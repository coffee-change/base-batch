import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    console.log('=== SYNC START ===')
    console.log('Wallet:', walletAddress)

    // 1. Get or create user
    let { data: user, error: userError } = await supabase
      .from('base_batch_user')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .maybeSingle()

    if (userError && userError.code !== 'PGRST116') {
      throw userError
    }

    const isNewUser = !user

    if (!user) {
      console.log('Creating new user...')
      const { data: newUser, error: insertError } = await supabase
        .from('base_batch_user')
        .insert({ wallet_address: walletAddress.toLowerCase() })
        .select()
        .single()

      if (insertError) throw insertError
      user = newUser
      console.log('New user created with ID:', user.id)
    } else {
      console.log('Existing user found with ID:', user.id)
    }

    // 2. Get latest transaction already in database (for comparison)
    const { data: latestDbTx } = await supabase
      .from('base_batch_roundup')
      .select('tx_hash, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    console.log('Latest DB transaction:', latestDbTx?.tx_hash || 'None')

    // 3. Get all existing transaction hashes for this user (for duplicate checking)
    const { data: existingTxs } = await supabase
      .from('base_batch_roundup')
      .select('tx_hash')
      .eq('user_id', user.id)

    // Filter out NULL values and create Set
    const existingTxHashes = new Set(
      (existingTxs || [])
        .map(tx => tx.tx_hash)
        .filter(hash => hash !== null && hash !== undefined)
    )
    console.log('Existing transactions in DB:', existingTxHashes.size)
    console.log('Existing hashes:', Array.from(existingTxHashes).map(h => h.slice(0, 10) + '...'))

    // 4. Fetch USDC transactions from Blockscout with filter=from
    const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    const API_URL = `https://base-sepolia.blockscout.com/api/v2/addresses/${walletAddress}/token-transfers?type=ERC-20&filter=from&token=${USDC_ADDRESS}`

    console.log('Fetching from Blockscout API...')
    const response = await fetch(API_URL)

    if (!response.ok) {
      console.error('Blockscout API error:', response.status)
      return NextResponse.json({
        success: true,
        userId: user.id,
        isNewUser: isNewUser,
        newTransactions: 0,
        skippedDuplicates: 0,
        totalFromApi: 0,
        message: 'User created but no transactions found'
      })
    }

    const data = await response.json()

    // 5. Handle cases where user has no transactions
    if (!data.items || data.items.length === 0) {
      console.log('No transactions found from API')
      return NextResponse.json({
        success: true,
        userId: user.id,
        isNewUser: isNewUser,
        newTransactions: 0,
        skippedDuplicates: 0,
        totalFromApi: 0,
        message: 'No USDC transactions found for this wallet'
      })
    }

    console.log('Total transactions from API:', data.items.length)

    // 6. Determine which transactions to process
    // For NEW users: Only process the LATEST transaction (first in array)
    // For EXISTING users: Process ALL new transactions
    const transactionsToProcess = isNewUser && data.items.length > 0
      ? [data.items[0]] // Only latest transaction for new users
      : data.items // All transactions for existing users

    console.log(`Processing ${transactionsToProcess.length} transaction(s) (isNewUser: ${isNewUser})`)

    // 7. Process transactions and filter out duplicates
    let newTransactionsCount = 0
    let skippedDuplicates = 0
    let skippedWholeNumbers = 0
    const processedInThisRun = new Set() // Track what we've processed in THIS sync run

    for (const tx of transactionsToProcess) {
      // IMPORTANT FIX: Use transaction_hash from API (not tx_hash)
      const txHash = tx.transaction_hash

      if (!txHash) {
        console.warn('Transaction missing hash, skipping')
        continue
      }

      // NEW CHECK: Skip if we already processed this in the current sync run
      if (processedInThisRun.has(txHash)) {
        console.log(`⏭️  SKIP (already processed in this run): ${txHash.slice(0, 10)}...`)
        skippedDuplicates++
        continue
      }

      // Check if this transaction already exists in our database
      if (existingTxHashes.has(txHash)) {
        console.log(`⏭️  SKIP (duplicate in DB): ${txHash.slice(0, 10)}...`)
        skippedDuplicates++
        processedInThisRun.add(txHash) // Mark as processed
        continue
      }

      // Calculate roundup
      const amount = parseFloat(tx.total.value) / Math.pow(10, tx.total.decimals || 6)
      const roundedUp = Math.ceil(amount)
      const roundup = roundedUp - amount

      // Skip whole dollar amounts (roundup = 0)
      if (roundup === 0) {
        console.log(`⏭️  SKIP (whole number): ${txHash.slice(0, 10)}... amount: $${amount}`)
        skippedWholeNumbers++
        processedInThisRun.add(txHash) // Mark as processed even if skipped
        continue
      }

      // Mark this transaction as being processed in this run
      processedInThisRun.add(txHash)

      // Double-check: Query database one more time before inserting (extra safety)
      const { data: doubleCheck } = await supabase
        .from('base_batch_roundup')
        .select('id')
        .eq('user_id', user.id)
        .eq('tx_hash', txHash)
        .maybeSingle()

      if (doubleCheck) {
        console.log(`⚠️  DOUBLE-CHECK: Transaction exists in DB, skipping: ${txHash.slice(0, 10)}...`)
        skippedDuplicates++
        existingTxHashes.add(txHash) // Update our Set
        continue
      }

      // Insert new roundup transaction (THIS SHOULD ONLY HAPPEN ONCE PER UNIQUE TX_HASH)
      console.log(`🔄 Attempting to insert: ${txHash.slice(0, 10)}... amount: $${amount} roundup: $${roundup.toFixed(2)}`)

      const { error: insertError } = await supabase
        .from('base_batch_roundup')
        .insert({
          user_id: user.id,
          tx_hash: txHash, // FIXED: Using correct field from API
          usdc_amount: amount,
          roundup_amount: roundup,
          status: false
        })

      if (insertError) {
        if (insertError.code === '23505') {
          // Unique constraint violation - already exists
          console.log(`⚠️  Database rejected duplicate: ${txHash.slice(0, 10)}...`)
          skippedDuplicates++
        } else {
          console.error('❌ Insert error:', insertError)
          console.error('Error details:', insertError)
        }
      } else {
        console.log(`✅ INSERTED: ${txHash.slice(0, 10)}... amount: $${amount} roundup: $${roundup.toFixed(2)}`)
        newTransactionsCount++
        // Add to our set so we don't try to insert it again
        existingTxHashes.add(txHash)
      }
    }

    console.log('=== SYNC COMPLETE ===')
    console.log(`✅ New transactions inserted: ${newTransactionsCount}`)
    console.log(`⏭️  Skipped duplicates: ${skippedDuplicates}`)
    console.log(`⏭️  Skipped whole numbers: ${skippedWholeNumbers}`)
    console.log(`📊 Total from API: ${data.items.length}`)

    return NextResponse.json({
      success: true,
      userId: user.id,
      isNewUser: isNewUser,
      newTransactions: newTransactionsCount,
      skippedDuplicates: skippedDuplicates,
      skippedWholeNumbers: skippedWholeNumbers,
      totalFromApi: data.items.length,
      message: `Synced ${newTransactionsCount} new transactions, skipped ${skippedDuplicates} duplicates`
    })

  } catch (error) {
    console.error('❌ Error syncing transactions:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

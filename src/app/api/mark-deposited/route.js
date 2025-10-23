import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { walletAddress, txHash } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('base_batch_user')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Mark all pending roundups as deposited
    const { data: updated, error: updateError } = await supabase
      .from('base_batch_roundup')
      .update({ status: true })
      .eq('user_id', user.id)
      .eq('status', false)
      .select()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      updatedCount: updated?.length || 0,
      depositTxHash: txHash,
      message: `Marked ${updated?.length || 0} roundups as deposited`
    })

  } catch (error) {
    console.error('Error marking roundups as deposited:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

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

    // Get user
    const { data: user, error: userError } = await supabase
      .from('base_batch_user')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (userError || !user) {
      return NextResponse.json({
        success: true,
        roundups: [],
        totalPending: 0,
        canDeposit: false
      })
    }

    // Get all pending roundups for this user
    const { data: roundups, error: roundupsError } = await supabase
      .from('base_batch_roundup')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', false)
      .order('created_at', { ascending: false })

    if (roundupsError) throw roundupsError

    // Calculate total pending
    const totalPending = roundups.reduce(
      (sum, r) => sum + parseFloat(r.roundup_amount),
      0
    )

    // Check if user can deposit ($1 threshold)
    const canDeposit = totalPending >= 1.0

    return NextResponse.json({
      success: true,
      roundups: roundups || [],
      totalPending: totalPending,
      canDeposit: canDeposit,
      userId: user.id
    })

  } catch (error) {
    console.error('Error fetching roundups:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

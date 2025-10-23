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
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({
        success: true,
        roundups: [],
        totalDeposited: 0
      })
    }

    // Get all DEPOSITED roundups for this user (status = true)
    const { data: roundups, error: roundupsError } = await supabase
      .from('base_batch_roundup')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', true) // Only deposited/invested roundups
      .order('created_at', { ascending: false })

    if (roundupsError) throw roundupsError

    // Calculate total deposited
    const totalDeposited = roundups?.reduce(
      (sum, r) => sum + parseFloat(r.roundup_amount),
      0
    ) || 0

    return NextResponse.json({
      success: true,
      roundups: roundups || [],
      totalDeposited: totalDeposited,
      userId: user.id
    })

  } catch (error) {
    console.error('Error fetching deposited roundups:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

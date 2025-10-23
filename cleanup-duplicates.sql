-- Coffee Change: Cleanup Duplicate Records
-- Run this in Supabase SQL Editor to fix existing duplicates

-- Step 1: View current duplicates (run this first to see what will be deleted)
SELECT
  user_id,
  usdc_amount,
  roundup_amount,
  COUNT(*) as duplicate_count
FROM base_batch_roundup
WHERE tx_hash IS NULL
GROUP BY user_id, usdc_amount, roundup_amount
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 2: Delete records where tx_hash is NULL
-- (These are the broken records that were created before the fix)
DELETE FROM base_batch_roundup
WHERE tx_hash IS NULL;

-- Step 3: Verify cleanup
SELECT
  'Cleanup complete!' as message,
  COUNT(*) as remaining_records,
  COUNT(CASE WHEN tx_hash IS NULL THEN 1 END) as null_tx_hash_count,
  COUNT(CASE WHEN tx_hash IS NOT NULL THEN 1 END) as valid_records
FROM base_batch_roundup;

-- Step 4: Show remaining records by user
SELECT
  u.wallet_address,
  r.tx_hash,
  r.usdc_amount,
  r.roundup_amount,
  r.status,
  r.created_at
FROM base_batch_roundup r
JOIN base_batch_user u ON r.user_id = u.id
ORDER BY r.created_at DESC;

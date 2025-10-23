-- STEP 1: See what duplicates you have
SELECT
  user_id,
  tx_hash,
  usdc_amount,
  roundup_amount,
  COUNT(*) as duplicate_count
FROM base_batch_roundup
GROUP BY user_id, tx_hash, usdc_amount, roundup_amount
HAVING COUNT(*) > 1;

-- STEP 2: Delete ALL records with NULL tx_hash
DELETE FROM base_batch_roundup
WHERE tx_hash IS NULL;

-- STEP 3: Delete duplicate records, keep only the oldest one
DELETE FROM base_batch_roundup
WHERE id NOT IN (
  SELECT MIN(id)
  FROM base_batch_roundup
  GROUP BY tx_hash
);

-- STEP 4: Verify cleanup - should show no duplicates
SELECT
  tx_hash,
  COUNT(*) as count
FROM base_batch_roundup
GROUP BY tx_hash
HAVING COUNT(*) > 1;

-- STEP 5: See what's left
SELECT * FROM base_batch_roundup ORDER BY created_at DESC;

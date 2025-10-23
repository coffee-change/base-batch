-- Coffee Change Database Setup
-- Run this SQL in your Supabase SQL Editor to ensure proper constraints

-- Add UNIQUE constraint on tx_hash to prevent duplicate transactions
ALTER TABLE base_batch_roundup
ADD CONSTRAINT unique_tx_hash UNIQUE (tx_hash);

-- Add UNIQUE constraint on wallet_address to prevent duplicate users
ALTER TABLE base_batch_user
ADD CONSTRAINT unique_wallet_address UNIQUE (wallet_address);

-- Add CHECK constraints to ensure positive amounts
ALTER TABLE base_batch_roundup
ADD CONSTRAINT positive_usdc_amount CHECK (usdc_amount > 0);

ALTER TABLE base_batch_roundup
ADD CONSTRAINT positive_roundup_amount CHECK (roundup_amount >= 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_wallet ON base_batch_user(wallet_address);
CREATE INDEX IF NOT EXISTS idx_roundup_user_id ON base_batch_roundup(user_id);
CREATE INDEX IF NOT EXISTS idx_roundup_status ON base_batch_roundup(status);
CREATE INDEX IF NOT EXISTS idx_roundup_tx_hash ON base_batch_roundup(tx_hash);
CREATE INDEX IF NOT EXISTS idx_roundup_user_status ON base_batch_roundup(user_id, status);

-- Verify setup
SELECT
  'Setup complete!' as message,
  (SELECT COUNT(*) FROM base_batch_user) as total_users,
  (SELECT COUNT(*) FROM base_batch_roundup) as total_roundups,
  (SELECT COUNT(*) FROM base_batch_roundup WHERE status = false) as pending_roundups,
  (SELECT COUNT(*) FROM base_batch_roundup WHERE status = true) as deposited_roundups;

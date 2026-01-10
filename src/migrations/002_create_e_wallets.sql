CREATE TABLE IF NOT EXISTS e_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    balance numeric(18,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_e_wallets_user_id
ON e_wallets (user_id);

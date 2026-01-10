CREATE TYPE transaction_type AS ENUM ('purchase','transfer','top_up', 'fee', 'refund', 'adjustment');
CREATE TYPE transaction_status AS ENUM ('in_queue','done','fail');

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    e_wallet_id UUID NOT NULL,
    e_wallet_trf_from UUID NULL,
    e_wallet_trf_to UUID NULL,
    amount numeric(18,2) DEFAULT 0.00,
    transaction_type transaction_type NOT NULL DEFAULT 'transfer',
    transaction_status transaction_status NOT NULL DEFAULT 'in_queue',
    transaction_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions (transaction_date);
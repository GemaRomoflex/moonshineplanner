CREATE TABLE IF NOT EXISTS moonshine_store (
    store_key TEXT PRIMARY KEY,
    store_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

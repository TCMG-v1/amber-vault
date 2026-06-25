CREATE TABLE IF NOT EXISTS dataset_registry (
    dataset_id TEXT PRIMARY KEY,
    domain TEXT NOT NULL,
    grain TEXT NOT NULL,
    primary_key_text TEXT NOT NULL,
    cadence TEXT NOT NULL,
    file_name TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS source_registry (
    source_id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    coverage TEXT NOT NULL,
    format TEXT NOT NULL,
    access TEXT NOT NULL,
    priority TEXT NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS load_runs (
    run_id TEXT PRIMARY KEY,
    dataset_id TEXT NOT NULL,
    source_id TEXT,
    file_name TEXT NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    row_count BIGINT,
    status TEXT NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS venues (
    venue_code TEXT PRIMARY KEY,
    venue_name TEXT NOT NULL,
    country_code TEXT,
    timezone_name TEXT,
    mic_code TEXT,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS trading_calendars (
    venue_code TEXT NOT NULL,
    trade_date DATE NOT NULL,
    session_status TEXT NOT NULL,
    session_open_utc TIMESTAMP,
    session_close_utc TIMESTAMP,
    notes TEXT,
    PRIMARY KEY (venue_code, trade_date)
);

CREATE TABLE IF NOT EXISTS instruments (
    instrument_id TEXT PRIMARY KEY,
    issuer_id TEXT,
    venue_code TEXT,
    symbol TEXT NOT NULL,
    instrument_name TEXT,
    asset_class TEXT NOT NULL,
    sector_name TEXT,
    industry_name TEXT,
    currency_code TEXT,
    isin TEXT,
    cusip TEXT,
    figi TEXT,
    active_flag BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS instrument_xref (
    instrument_id TEXT NOT NULL,
    xref_type TEXT NOT NULL,
    xref_value TEXT NOT NULL,
    source_id TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    valid_from DATE,
    valid_to DATE,
    notes TEXT,
    PRIMARY KEY (instrument_id, xref_type, xref_value)
);

CREATE TABLE IF NOT EXISTS universe_catalog (
    universe_id TEXT PRIMARY KEY,
    universe_name TEXT NOT NULL,
    universe_kind TEXT NOT NULL,
    parent_universe_id TEXT,
    source_id TEXT,
    cadence TEXT,
    color_role TEXT,
    direction_role TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS universe_membership (
    universe_id TEXT NOT NULL,
    instrument_id TEXT NOT NULL,
    as_of_date DATE NOT NULL,
    member_rank INTEGER,
    member_weight DOUBLE,
    shares_held DOUBLE,
    market_value DOUBLE,
    visible_flag BOOLEAN NOT NULL DEFAULT TRUE,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (universe_id, instrument_id, as_of_date)
);

CREATE TABLE IF NOT EXISTS eod_prices (
    instrument_id TEXT NOT NULL,
    trade_date DATE NOT NULL,
    open_price DOUBLE,
    high_price DOUBLE,
    low_price DOUBLE,
    close_price DOUBLE,
    adjusted_close_price DOUBLE,
    volume BIGINT,
    source_id TEXT,
    PRIMARY KEY (instrument_id, trade_date)
);

CREATE TABLE IF NOT EXISTS intraday_bars (
    instrument_id TEXT NOT NULL,
    bar_start TIMESTAMP NOT NULL,
    bar_size TEXT NOT NULL,
    open_price DOUBLE,
    high_price DOUBLE,
    low_price DOUBLE,
    close_price DOUBLE,
    volume BIGINT,
    vwap DOUBLE,
    source_id TEXT,
    PRIMARY KEY (instrument_id, bar_start, bar_size)
);

CREATE TABLE IF NOT EXISTS fx_rates (
    base_ccy TEXT NOT NULL,
    quote_ccy TEXT NOT NULL,
    observed_at TIMESTAMP NOT NULL,
    bid_rate DOUBLE,
    ask_rate DOUBLE,
    mid_rate DOUBLE,
    source_id TEXT,
    PRIMARY KEY (base_ccy, quote_ccy, observed_at)
);

CREATE TABLE IF NOT EXISTS currency_pairs_catalog (
    base_ccy TEXT NOT NULL,
    quote_ccy TEXT NOT NULL,
    pair_code TEXT NOT NULL,
    market_convention TEXT,
    major_flag BOOLEAN NOT NULL DEFAULT FALSE,
    region_bucket TEXT,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (base_ccy, quote_ccy)
);

CREATE TABLE IF NOT EXISTS yield_curve_points (
    curve_code TEXT NOT NULL,
    observed_at DATE NOT NULL,
    tenor_code TEXT NOT NULL,
    yield_percent DOUBLE,
    source_id TEXT,
    PRIMARY KEY (curve_code, observed_at, tenor_code)
);

CREATE TABLE IF NOT EXISTS corporate_actions (
    instrument_id TEXT NOT NULL,
    event_date DATE NOT NULL,
    action_type TEXT NOT NULL,
    ratio_numerator DOUBLE,
    ratio_denominator DOUBLE,
    cash_amount DOUBLE,
    currency_code TEXT,
    notes TEXT,
    source_id TEXT,
    PRIMARY KEY (instrument_id, event_date, action_type)
);

CREATE TABLE IF NOT EXISTS fundamentals_quarterly (
    issuer_id TEXT NOT NULL,
    fiscal_period_end DATE NOT NULL,
    currency_code TEXT,
    revenue DOUBLE,
    gross_profit DOUBLE,
    operating_income DOUBLE,
    net_income DOUBLE,
    total_assets DOUBLE,
    total_liabilities DOUBLE,
    operating_cash_flow DOUBLE,
    free_cash_flow DOUBLE,
    shares_diluted DOUBLE,
    source_id TEXT,
    PRIMARY KEY (issuer_id, fiscal_period_end)
);

CREATE TABLE IF NOT EXISTS fund_vehicle_profile (
    fund_id TEXT NOT NULL,
    as_of_date DATE NOT NULL,
    exchange_code TEXT,
    aum DOUBLE,
    nav DOUBLE,
    market_price DOUBLE,
    expense_ratio DOUBLE,
    sec_yield_30d DOUBLE,
    distribution_yield DOUBLE,
    premium_discount DOUBLE,
    median_bid_ask_spread DOUBLE,
    daily_volume BIGINT,
    volatility_target_low DOUBLE,
    volatility_target_high DOUBLE,
    strategy_text TEXT,
    source_id TEXT,
    PRIMARY KEY (fund_id, as_of_date)
);

CREATE TABLE IF NOT EXISTS options_quotes (
    underlier_id TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    strike_price DOUBLE NOT NULL,
    option_right TEXT NOT NULL,
    observed_at TIMESTAMP NOT NULL,
    bid_price DOUBLE,
    ask_price DOUBLE,
    last_price DOUBLE,
    implied_volatility DOUBLE,
    delta DOUBLE,
    gamma DOUBLE,
    theta DOUBLE,
    vega DOUBLE,
    volume BIGINT,
    open_interest BIGINT,
    source_id TEXT,
    PRIMARY KEY (underlier_id, expiry_date, strike_price, option_right, observed_at)
);

CREATE TABLE IF NOT EXISTS options_underliers (
    instrument_id TEXT NOT NULL,
    options_venue_code TEXT NOT NULL,
    contract_multiplier DOUBLE,
    settlement_style TEXT,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (instrument_id, options_venue_code)
);

CREATE TABLE IF NOT EXISTS fx_options_underliers (
    base_ccy TEXT NOT NULL,
    quote_ccy TEXT NOT NULL,
    venue_code TEXT NOT NULL,
    option_style TEXT,
    settlement_type TEXT,
    contract_size DOUBLE,
    quote_convention TEXT,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (base_ccy, quote_ccy, venue_code)
);

CREATE TABLE IF NOT EXISTS fx_options_quotes (
    base_ccy TEXT NOT NULL,
    quote_ccy TEXT NOT NULL,
    venue_code TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    option_right TEXT NOT NULL,
    strike_rate DOUBLE NOT NULL,
    delta_bucket TEXT NOT NULL,
    observed_at TIMESTAMP NOT NULL,
    bid_premium DOUBLE,
    ask_premium DOUBLE,
    mid_premium DOUBLE,
    implied_volatility DOUBLE,
    delta DOUBLE,
    gamma DOUBLE,
    theta DOUBLE,
    vega DOUBLE,
    source_id TEXT,
    PRIMARY KEY (base_ccy, quote_ccy, venue_code, expiry_date, option_right, strike_rate, delta_bucket, observed_at)
);

CREATE TABLE IF NOT EXISTS fx_options_surface (
    base_ccy TEXT NOT NULL,
    quote_ccy TEXT NOT NULL,
    venue_code TEXT NOT NULL,
    observed_at TIMESTAMP NOT NULL,
    tenor_code TEXT NOT NULL,
    surface_point TEXT NOT NULL,
    implied_volatility DOUBLE,
    risk_reversal DOUBLE,
    butterfly DOUBLE,
    atm_forward DOUBLE,
    source_id TEXT,
    PRIMARY KEY (base_ccy, quote_ccy, venue_code, observed_at, tenor_code, surface_point)
);

CREATE TABLE IF NOT EXISTS futures_settlements (
    symbol_root TEXT NOT NULL,
    contract_code TEXT NOT NULL,
    trade_date DATE NOT NULL,
    open_price DOUBLE,
    high_price DOUBLE,
    low_price DOUBLE,
    settlement_price DOUBLE,
    volume BIGINT,
    open_interest BIGINT,
    source_id TEXT,
    PRIMARY KEY (symbol_root, contract_code, trade_date)
);

CREATE TABLE IF NOT EXISTS futures_contract_catalog (
    symbol_root TEXT NOT NULL,
    contract_code TEXT NOT NULL,
    exchange_code TEXT NOT NULL,
    underlier_type TEXT,
    underlier_symbol TEXT,
    contract_month DATE,
    tick_size DOUBLE,
    point_value DOUBLE,
    settlement_type TEXT,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (symbol_root, contract_code, exchange_code)
);

CREATE TABLE IF NOT EXISTS holdings_snapshot (
    fund_id TEXT NOT NULL,
    holding_instrument_id TEXT NOT NULL,
    report_date DATE NOT NULL,
    weight_percent DOUBLE,
    shares_held DOUBLE,
    market_value DOUBLE,
    source_id TEXT,
    PRIMARY KEY (fund_id, holding_instrument_id, report_date)
);

CREATE TABLE IF NOT EXISTS etf_visible_holdings (
    fund_id TEXT NOT NULL,
    holding_instrument_id TEXT NOT NULL,
    report_date DATE NOT NULL,
    holding_rank INTEGER,
    weight_percent DOUBLE,
    shares_held DOUBLE,
    market_value DOUBLE,
    collateral_flag BOOLEAN NOT NULL DEFAULT FALSE,
    visible_flag BOOLEAN NOT NULL DEFAULT TRUE,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (fund_id, holding_instrument_id, report_date)
);

CREATE TABLE IF NOT EXISTS macro_observations (
    series_id TEXT NOT NULL,
    observed_at DATE NOT NULL,
    value_amount DOUBLE,
    unit_text TEXT,
    source_id TEXT,
    PRIMARY KEY (series_id, observed_at)
);

CREATE TABLE IF NOT EXISTS macro_series_catalog (
    series_id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    source_series_id TEXT NOT NULL,
    series_name TEXT NOT NULL,
    category_path TEXT,
    units_text TEXT,
    frequency_text TEXT,
    seasonal_adjustment TEXT,
    default_direction_label TEXT,
    color_role TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS macro_series_xref (
    source_id TEXT NOT NULL,
    source_series_id TEXT NOT NULL,
    series_id TEXT NOT NULL,
    alias_text TEXT,
    PRIMARY KEY (source_id, source_series_id, series_id)
);

CREATE TABLE IF NOT EXISTS macro_direction_labels (
    series_id TEXT NOT NULL,
    observed_at DATE NOT NULL,
    perceived_direction TEXT NOT NULL,
    color_role TEXT NOT NULL,
    change_basis TEXT,
    notes TEXT,
    PRIMARY KEY (series_id, observed_at)
);

CREATE TABLE IF NOT EXISTS series_relationship_xref (
    left_series_id TEXT NOT NULL,
    right_series_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (left_series_id, right_series_id, relationship_type)
);

CREATE TABLE IF NOT EXISTS synthetic_aggregate_catalog (
    aggregate_id TEXT PRIMARY KEY,
    aggregate_name TEXT NOT NULL,
    aggregate_kind TEXT NOT NULL,
    base_domain TEXT NOT NULL,
    quote_domain TEXT,
    rebalance_rule TEXT,
    color_role TEXT,
    direction_role TEXT,
    source_id TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS synthetic_aggregate_components (
    aggregate_id TEXT NOT NULL,
    component_id TEXT NOT NULL,
    component_type TEXT NOT NULL,
    component_weight DOUBLE NOT NULL,
    component_sign INTEGER NOT NULL DEFAULT 1,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (aggregate_id, component_id, component_type)
);

CREATE TABLE IF NOT EXISTS synthetic_aggregate_observations (
    aggregate_id TEXT NOT NULL,
    observed_at TIMESTAMP NOT NULL,
    aggregate_value DOUBLE,
    direction_label TEXT,
    source_id TEXT,
    notes TEXT,
    PRIMARY KEY (aggregate_id, observed_at)
);

CREATE VIEW IF NOT EXISTS latest_eod_prices AS
SELECT p.*
FROM eod_prices p
JOIN (
    SELECT instrument_id, MAX(trade_date) AS max_trade_date
    FROM eod_prices
    GROUP BY instrument_id
) latest
    ON p.instrument_id = latest.instrument_id
   AND p.trade_date = latest.max_trade_date;

CREATE VIEW IF NOT EXISTS latest_fx_rates AS
SELECT r.*
FROM fx_rates r
JOIN (
    SELECT base_ccy, quote_ccy, MAX(observed_at) AS max_observed_at
    FROM fx_rates
    GROUP BY base_ccy, quote_ccy
) latest
    ON r.base_ccy = latest.base_ccy
   AND r.quote_ccy = latest.quote_ccy
   AND r.observed_at = latest.max_observed_at;

CREATE VIEW IF NOT EXISTS workbook_ticker_overview AS
SELECT
    i.instrument_id,
    i.symbol,
    i.instrument_name,
    i.asset_class,
    i.currency_code,
    i.venue_code,
    p.trade_date AS last_trade_date,
    p.close_price AS last_close_price,
    p.adjusted_close_price AS last_adjusted_close_price,
    p.volume AS last_volume
FROM instruments i
LEFT JOIN latest_eod_prices p
    ON i.instrument_id = p.instrument_id;

CREATE VIEW IF NOT EXISTS workbook_fx_overview AS
SELECT
    base_ccy,
    quote_ccy,
    observed_at,
    bid_rate,
    ask_rate,
    mid_rate
FROM latest_fx_rates;

CREATE VIEW IF NOT EXISTS workbook_universe_membership AS
SELECT
    u.universe_id,
    u.universe_name,
    u.universe_kind,
    u.color_role,
    u.direction_role,
    m.as_of_date,
    m.member_rank,
    m.member_weight,
    m.visible_flag,
    i.instrument_id,
    i.symbol,
    i.instrument_name,
    i.asset_class,
    i.currency_code
FROM universe_catalog u
JOIN universe_membership m
    ON u.universe_id = m.universe_id
JOIN instruments i
    ON m.instrument_id = i.instrument_id;

CREATE VIEW IF NOT EXISTS workbook_macro_direction AS
SELECT
    c.series_id,
    c.series_name,
    c.category_path,
    c.units_text,
    d.observed_at,
    d.perceived_direction,
    d.color_role,
    o.value_amount
FROM macro_direction_labels d
JOIN macro_series_catalog c
    ON d.series_id = c.series_id
LEFT JOIN macro_observations o
    ON d.series_id = o.series_id
   AND d.observed_at = o.observed_at;

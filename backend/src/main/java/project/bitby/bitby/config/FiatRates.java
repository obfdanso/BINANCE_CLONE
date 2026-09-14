package project.bitby.bitby.config;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

/**
 * Single source of truth for fiat conversion rates.
 *
 * The GHS/USD rate was previously written out by hand in four places
 * (AssetServiceImpl three times, RevenueInitializationService, and
 * MarketDataService) and the copies disagreed - 10.41 in some, 0.0961 in
 * another, which is not quite its reciprocal. That drift is what made
 * /api/v1/convert/quote price cedis as though 1 GHS = 1 USD.
 *
 * Everything that converts between GHS and USD should use these constants.
 */
public final class FiatRates {

    private FiatRates() {
    }

    /** Cedis per US dollar. */
    public static final BigDecimal GHS_PER_USD = new BigDecimal("10.41");

    /**
     * US dollars per cedi - the exact reciprocal of GHS_PER_USD, so round
     * trips do not drift.
     */
    public static final BigDecimal USD_PER_GHS =
            BigDecimal.ONE.divide(GHS_PER_USD, new MathContext(12, RoundingMode.HALF_UP));

    /** US dollars per US dollar. Stated explicitly so callers can treat USD like any other asset. */
    public static final BigDecimal USD_PER_USD = BigDecimal.ONE;
}

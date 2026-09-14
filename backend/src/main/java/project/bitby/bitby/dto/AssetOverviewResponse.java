package project.bitby.bitby.dto;

import java.util.Map;

public class AssetOverviewResponse {
    private Map<String, Double> balances; // e.g., {"BTC": 0.5, "ETH": 2.0}
    private String selectedCurrency; // e.g., "USD"
    private double estimatedTotalValue; // in selectedCurrency
    private Map<String, Double> lastPrices; // e.g., {"BTC": 60000, "ETH": 3000}
    private String message;

    public AssetOverviewResponse() {}

    public AssetOverviewResponse(Map<String, Double> balances, String selectedCurrency, double estimatedTotalValue, Map<String, Double> lastPrices) {
        this.balances = balances;
        this.selectedCurrency = selectedCurrency;
        this.estimatedTotalValue = estimatedTotalValue;
        this.lastPrices = lastPrices;
    }

    public Map<String, Double> getBalances() {
        return balances;
    }

    public void setBalances(Map<String, Double> balances) {
        this.balances = balances;
    }

    public String getSelectedCurrency() {
        return selectedCurrency;
    }

    public void setSelectedCurrency(String selectedCurrency) {
        this.selectedCurrency = selectedCurrency;
    }

    public double getEstimatedTotalValue() {
        return estimatedTotalValue;
    }

    public void setEstimatedTotalValue(double estimatedTotalValue) {
        this.estimatedTotalValue = estimatedTotalValue;
    }

    public Map<String, Double> getLastPrices() {
        return lastPrices;
    }

    public void setLastPrices(Map<String, Double> lastPrices) {
        this.lastPrices = lastPrices;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 
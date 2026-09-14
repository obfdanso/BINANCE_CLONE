package project.bitby.bitby.dto;

public class BuyAssetRequest {
    private String assetSymbol; // e.g., "BTC"
    private double amount;
    private String currency; // e.g., "USD"

    public BuyAssetRequest() {}

    public BuyAssetRequest(String assetSymbol, double amount, String currency) {
        this.assetSymbol = assetSymbol;
        this.amount = amount;
        this.currency = currency;
    }

    public String getAssetSymbol() { return assetSymbol; }
    public void setAssetSymbol(String assetSymbol) { this.assetSymbol = assetSymbol; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
} 
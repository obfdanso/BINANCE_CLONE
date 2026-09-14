package project.bitby.bitby.dto;

public class DepositRequest {
    private double amount;
    private String currency; // e.g., "USD"
    private String email;

    public DepositRequest() {}

    public DepositRequest(double amount, String currency, String email) {
        this.amount = amount;
        this.currency = currency;
        this.email = email;
    }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
} 
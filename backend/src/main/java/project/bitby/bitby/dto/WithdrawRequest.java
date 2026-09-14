package project.bitby.bitby.dto;

public class WithdrawRequest {
    private double amount;
    private String currency;
    private String phoneNumber;

    public WithdrawRequest() {}

    public WithdrawRequest(double amount, String currency, String phoneNumber) {
        this.amount = amount;
        this.currency = currency;
        this.phoneNumber = phoneNumber;
    }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
} 
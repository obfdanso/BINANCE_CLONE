package project.bitby.bitby.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;
    
    @NotBlank(message = "User ID is required")
    @Column(unique = true)
    private String userId;
    
    
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private String telegramUsername;
    
    private LocalDateTime createdAt;
    
    /**
     * Optimistic lock guard for balance writes.
     *
     * Settlement updates both sides of a trade, and only the account placing
     * the order is row-locked; the counterparty is not. Without a version,
     * two trades touching the same counterparty could each read a balance and
     * write back over the other. With one, the later write fails instead of
     * silently winning.
     */
    @Version
    private Long version;

    private Double cediBalance = 0.0;
    
    private Double btcBalance = 0.0;
    private Double usdtBalance = 0.0;
    private Double usdBalance = 0.0;
    private Double ethBalance = 0.0;
    private Double bnbBalance = 0.0;

    /**
     * Balances live in one column per asset, so reading or writing one by
     * symbol needs a switch. Keeping it here means callers do not each write
     * their own copy - SpotTradingServiceImpl and ConvertService had started
     * to diverge on which assets they recognised.
     *
     * Returns null for an asset this account cannot hold, which callers should
     * treat as unsupported rather than as a zero balance.
     */
    public Double getBalanceFor(String asset) {
        if (asset == null) return null;
        switch (asset.toUpperCase()) {
            case "BTC":  return btcBalance  != null ? btcBalance  : 0.0;
            case "ETH":  return ethBalance  != null ? ethBalance  : 0.0;
            case "BNB":  return bnbBalance  != null ? bnbBalance  : 0.0;
            case "USDT": return usdtBalance != null ? usdtBalance : 0.0;
            case "USD":  return usdBalance  != null ? usdBalance  : 0.0;
            case "GHS":  return cediBalance != null ? cediBalance : 0.0;
            default:     return null;
        }
    }

    /** Returns false if the asset is not one this account can hold. */
    public boolean setBalanceFor(String asset, double amount) {
        if (asset == null) return false;
        switch (asset.toUpperCase()) {
            case "BTC":  btcBalance = amount;  return true;
            case "ETH":  ethBalance = amount;  return true;
            case "BNB":  bnbBalance = amount;  return true;
            case "USDT": usdtBalance = amount; return true;
            case "USD":  usdBalance = amount;  return true;
            case "GHS":  cediBalance = amount; return true;
            default:     return false;
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Double getCediBalance() {
        return cediBalance;
    }
    public void setCediBalance(Double cediBalance) {
        this.cediBalance = cediBalance;
    }

    public Double getBtcBalance() {
        return btcBalance;
    }
    public void setBtcBalance(Double btcBalance) {
        this.btcBalance = btcBalance;
    }
    public Double getUsdtBalance() {
        return usdtBalance;
    }
    public void setUsdtBalance(Double usdtBalance) {
        this.usdtBalance = usdtBalance;
    }
    public Double getUsdBalance() {
        return usdBalance;
    }
    public void setUsdBalance(Double usdBalance) {
        this.usdBalance = usdBalance;
    }
    public Double getEthBalance() {
        return ethBalance;
    }
    public void setEthBalance(Double ethBalance) {
        this.ethBalance = ethBalance;
    }
    public Double getBnbBalance() {
        return bnbBalance;
    }
    public void setBnbBalance(Double bnbBalance) {
        this.bnbBalance = bnbBalance;
    }
}

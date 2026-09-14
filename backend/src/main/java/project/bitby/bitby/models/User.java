package project.bitby.bitby.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
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

    /*
     * Balances are BigDecimal, not double.
     *
     * As doubles these produced values like 749.6610000000001 after ordinary
     * arithmetic, because a binary fraction cannot represent most decimal
     * amounts exactly. The error compounds across trades and leaves totals
     * that do not reconcile.
     *
     * The columns are numeric(36,18): enough integer room for cedi balances in
     * the billions, and 18 decimal places, which covers a satoshi (8) and wei
     * (18).
     */
    @Column(precision = 36, scale = 18)
    private BigDecimal cediBalance = BigDecimal.ZERO;

    @Column(precision = 36, scale = 18)
    private BigDecimal btcBalance = BigDecimal.ZERO;

    @Column(precision = 36, scale = 18)
    private BigDecimal usdtBalance = BigDecimal.ZERO;

    @Column(precision = 36, scale = 18)
    private BigDecimal usdBalance = BigDecimal.ZERO;

    @Column(precision = 36, scale = 18)
    private BigDecimal ethBalance = BigDecimal.ZERO;

    @Column(precision = 36, scale = 18)
    private BigDecimal bnbBalance = BigDecimal.ZERO;

    /**
     * Balances live in one column per asset, so reading or writing one by
     * symbol needs a switch. Keeping it here means callers do not each write
     * their own copy - SpotTradingServiceImpl and ConvertService had started
     * to diverge on which assets they recognised.
     *
     * Returns null for an asset this account cannot hold, which callers should
     * treat as unsupported rather than as a zero balance.
     */
    public BigDecimal getBalanceFor(String asset) {
        if (asset == null) return null;
        switch (asset.toUpperCase()) {
            case "BTC":  return btcBalance  != null ? btcBalance  : BigDecimal.ZERO;
            case "ETH":  return ethBalance  != null ? ethBalance  : BigDecimal.ZERO;
            case "BNB":  return bnbBalance  != null ? bnbBalance  : BigDecimal.ZERO;
            case "USDT": return usdtBalance != null ? usdtBalance : BigDecimal.ZERO;
            case "USD":  return usdBalance  != null ? usdBalance  : BigDecimal.ZERO;
            case "GHS":  return cediBalance != null ? cediBalance : BigDecimal.ZERO;
            default:     return null;
        }
    }

    /** Returns false if the asset is not one this account can hold. */
    public boolean setBalanceFor(String asset, BigDecimal amount) {
        if (asset == null || amount == null) return false;
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

}

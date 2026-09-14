package project.bitby.bitby.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.bitby.bitby.config.FiatRates;
import project.bitby.bitby.dto.AssetOverviewResponse;
import project.bitby.bitby.dto.AssetPriceHistoryResponse;
import project.bitby.bitby.dto.BuyAssetRequest;
import project.bitby.bitby.dto.BuyAssetResponse;
import project.bitby.bitby.models.ConvertOrder;
import project.bitby.bitby.models.Cryptocurrency;
import project.bitby.bitby.models.PriceHistory;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.ConvertOrderRepository;
import project.bitby.bitby.repository.CryptocurrencyRepository;
import project.bitby.bitby.repository.PriceHistoryRepository;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.service.AssetService;
import project.bitby.bitby.service.MarketDataService;
import project.bitby.bitby.service.RevenueInitializationService;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {
    @Autowired
    private ConvertOrderRepository convertOrderRepository;
    @Autowired
    private CryptocurrencyRepository cryptocurrencyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PriceHistoryRepository priceHistoryRepository;
    @Autowired
    private MarketDataService marketDataService;
    @Autowired
    private RevenueInitializationService revenueInitializationService;

    @Override
    public AssetOverviewResponse getAssetOverview(String userId, String selectedCurrency) {
        System.out.println("getAssetOverview called for userId: " + userId);
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            System.out.println("User not found for userId: " + userId);
            AssetOverviewResponse resp = new AssetOverviewResponse();
            resp.setMessage("User not found for userId: " + userId);
            return resp;
        }
        User user = userOpt.get();

        // Supported assets
        String[] assets = {"BTC", "ETH", "BNB", "USDT", "USD", "GHS"};
        Map<String, Double> userBalances = new HashMap<>();
        userBalances.put("BTC", user.getBtcBalance() != null ? user.getBtcBalance() : 0.0);
        userBalances.put("ETH", user.getEthBalance() != null ? user.getEthBalance() : 0.0);
        userBalances.put("BNB", user.getBnbBalance() != null ? user.getBnbBalance() : 0.0);
        userBalances.put("USDT", user.getUsdtBalance() != null ? user.getUsdtBalance() : 0.0);
        userBalances.put("USD", user.getUsdBalance() != null ? user.getUsdBalance() : 0.0);
        userBalances.put("GHS", user.getCediBalance() != null ? user.getCediBalance() : 0.0);

        // Prepare last prices map
        Map<String, Double> lastPrices = new HashMap<>();
        // Static prices for USD and GHS
        lastPrices.put("USD", 1.0);
        lastPrices.put("GHS", 1.0);
        // Fetch live prices for cryptos
        for (String asset : new String[]{"BTC", "ETH", "BNB", "USDT"}) {
            var market = marketDataService.getMarketDataBySymbol(asset);
            lastPrices.put(asset, market.isPresent() && market.get().getCurrentPrice() != null ? market.get().getCurrentPrice().doubleValue() : 0.0);
        }

        // Get price of each asset in selectedCurrency
        double estimatedTotalValue = 0.0;
        // Calculate estimated total value in selectedCurrency
        for (String asset : assets) {
            double balance = userBalances.getOrDefault(asset, 0.0);
            double assetPriceInUSD = 1.0;
            if (asset.equals("USD")) {
                assetPriceInUSD = 1.0;
            } else if (asset.equals("GHS")) {
                // Use accurate static conversion rate for GHS to USD
                assetPriceInUSD = FiatRates.USD_PER_GHS.doubleValue();
            } else {
                assetPriceInUSD = lastPrices.getOrDefault(asset, 0.0);
            }
            double assetValueInUSD = balance * assetPriceInUSD;
            double assetValueInSelected = assetValueInUSD;
            if (!selectedCurrency.equalsIgnoreCase("USD")) {
                // Convert USD value to selected currency
                if (selectedCurrency.equalsIgnoreCase("GHS")) {
                    assetValueInSelected = assetValueInUSD * FiatRates.GHS_PER_USD.doubleValue();
                } else {
                    // For other currencies, get their price in USD
                    var selectedMarket = marketDataService.getMarketDataBySymbol(selectedCurrency);
                    if (selectedMarket.isPresent() && selectedMarket.get().getCurrentPrice() != null && selectedMarket.get().getCurrentPrice().doubleValue() > 0) {
                        double selectedMarketPrice = selectedMarket.get().getCurrentPrice().doubleValue();
                        assetValueInSelected = assetValueInUSD / selectedMarketPrice;
                    }
                }
            }
            estimatedTotalValue += assetValueInSelected;
        }

        AssetOverviewResponse response = new AssetOverviewResponse(userBalances, selectedCurrency, estimatedTotalValue, lastPrices);
        response.setMessage("User found: " + user.getEmail());
        return response;
    }

    @Override
    public AssetPriceHistoryResponse getAssetPriceHistory() {
        List<Cryptocurrency> allCryptos = cryptocurrencyRepository.findByIsActiveTrue();
        Map<String, AssetPriceHistoryResponse.AssetChange> assets = new HashMap<>();
        for (Cryptocurrency crypto : allCryptos) {
            double lastPrice = crypto.getCurrentPrice() != null ? crypto.getCurrentPrice().doubleValue() : 0.0;
            double percentChange = 0.0;
            // Get price from 7 days ago
            List<PriceHistory> history = priceHistoryRepository.findByCryptocurrencyAndTimestampAfterOrderByTimestampAsc(
                crypto, java.time.LocalDateTime.now().minusDays(7));
            if (!history.isEmpty()) {
                double weekAgoPrice = history.get(0).getPrice().doubleValue();
                if (weekAgoPrice > 0) {
                    percentChange = ((lastPrice - weekAgoPrice) / weekAgoPrice) * 100.0;
                }
            }
            assets.put(crypto.getSymbol(), new AssetPriceHistoryResponse.AssetChange(lastPrice, percentChange));
        }
        return new AssetPriceHistoryResponse(assets);
    }

    @Override
    public BuyAssetResponse buyAsset(BuyAssetRequest request, String userId) {
        // Only allow BTC, ETH, USDT
        String asset = request.getAssetSymbol();
        if (!(asset.equals("BTC") || asset.equals("ETH") || asset.equals("USDT"))) {
            return new BuyAssetResponse("FAILED", null, "Only BTC, ETH, and USDT can be bought.");
        }
        
        // Find user by userId
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            return new BuyAssetResponse("FAILED", null, "User not found");
        }
        User user = userOpt.get();
        
        // Get last price for asset
        Optional<Cryptocurrency> cryptoOpt = cryptocurrencyRepository.findBySymbol(asset);
        if (cryptoOpt.isEmpty()) {
            return new BuyAssetResponse("FAILED", null, "Asset not found");
        }
        double lastPrice = cryptoOpt.get().getCurrentPrice() != null ? cryptoOpt.get().getCurrentPrice().doubleValue() : 0.0;
        if (lastPrice <= 0) {
            return new BuyAssetResponse("FAILED", null, "Invalid asset price");
        }
        
        // Calculate total cost in selected currency
        double totalCost = request.getAmount() * lastPrice;
        String currency = request.getCurrency();
        
        // Only allow buying with GHS or USD
        if (!(currency.equals("USD") || currency.equals("GHS"))) {
            return new BuyAssetResponse("FAILED", null, "You can only buy with GHS or USD balance.");
        }
        
        // Get system user (application revenue pool)
        Optional<User> systemUserOpt = userRepository.findByUsername("system_admin");
        if (systemUserOpt.isEmpty()) {
            return new BuyAssetResponse("FAILED", null, "System revenue pool not initialized");
        }
        User systemUser = systemUserOpt.get();
        
        // Calculate total cost in the payment currency
        double totalCostInPaymentCurrency = totalCost;
        if (currency.equals("GHS")) {
            // Convert totalCost (in USD) to GHS
            double usdToGhs = FiatRates.GHS_PER_USD.doubleValue();
            totalCostInPaymentCurrency = totalCost * usdToGhs;
        }
        
        // FIRST: Check if user has sufficient balance
        boolean userHasSufficientBalance = false;
        if (currency.equals("USD")) {
            if (user.getUsdBalance() != null && user.getUsdBalance() >= totalCostInPaymentCurrency) {
                userHasSufficientBalance = true;
            } else {
                return new BuyAssetResponse("FAILED", null, "Insufficient USD balance. You have: " + 
                    (user.getUsdBalance() != null ? user.getUsdBalance() : 0) + " USD, Required: " + totalCostInPaymentCurrency + " USD");
            }
        } else if (currency.equals("GHS")) {
            if (user.getCediBalance() != null && user.getCediBalance() >= totalCostInPaymentCurrency) {
                userHasSufficientBalance = true;
            } else {
                return new BuyAssetResponse("FAILED", null, "Insufficient GHS balance. You have: " + 
                    (user.getCediBalance() != null ? user.getCediBalance() : 0) + " GHS, Required: " + totalCostInPaymentCurrency + " GHS");
            }
        }
        
        if (!userHasSufficientBalance) {
            return new BuyAssetResponse("FAILED", null, "Insufficient " + currency + " balance for purchase");
        }
        
        // SECOND: Check if system has sufficient balance (as liquidity provider)
        boolean systemHasSufficientBalance = false;
        if (currency.equals("USD")) {
            if (systemUser.getUsdBalance() != null && systemUser.getUsdBalance() >= totalCost) {
                systemHasSufficientBalance = true;
            } else {
                return new BuyAssetResponse("FAILED", null, "System temporarily unavailable. Insufficient system USD balance. Available: " + 
                    (systemUser.getUsdBalance() != null ? systemUser.getUsdBalance() : 0) + " USD, Required: " + totalCost + " USD");
            }
        } else if (currency.equals("GHS")) {
            if (systemUser.getCediBalance() != null && systemUser.getCediBalance() >= totalCostInPaymentCurrency) {
                systemHasSufficientBalance = true;
            } else {
                return new BuyAssetResponse("FAILED", null, "System temporarily unavailable. Insufficient system GHS balance. Available: " + 
                    (systemUser.getCediBalance() != null ? systemUser.getCediBalance() : 0) + " GHS, Required: " + totalCostInPaymentCurrency + " GHS");
            }
        }
        
        if (!systemHasSufficientBalance) {
            return new BuyAssetResponse("FAILED", null, "System temporarily unavailable. Please try again later.");
        }
        
        // THIRD: Deduct from user's balance
        if (currency.equals("USD")) {
            user.setUsdBalance(user.getUsdBalance() - totalCostInPaymentCurrency);
        } else if (currency.equals("GHS")) {
            user.setCediBalance(user.getCediBalance() - totalCostInPaymentCurrency);
        }
        
        // FOURTH: Deduct from system revenue pool (as liquidity provider)
        if (currency.equals("USD")) {
            systemUser.setUsdBalance(systemUser.getUsdBalance() - totalCost);
        } else if (currency.equals("GHS")) {
            systemUser.setCediBalance(systemUser.getCediBalance() - totalCostInPaymentCurrency);
        }
        
        // FIFTH: Add purchased asset to user's balance
        switch (asset) {
            case "BTC":
                user.setBtcBalance((user.getBtcBalance() != null ? user.getBtcBalance() : 0.0) + request.getAmount());
                break;
            case "ETH":
                user.setEthBalance((user.getEthBalance() != null ? user.getEthBalance() : 0.0) + request.getAmount());
                break;
            case "USDT":
                user.setUsdtBalance((user.getUsdtBalance() != null ? user.getUsdtBalance() : 0.0) + request.getAmount());
                break;
        }
        
        // SIXTH: Save both user and system user
        userRepository.save(user);
        userRepository.save(systemUser);
        
        String txId = java.util.UUID.randomUUID().toString();
        return new BuyAssetResponse("SUCCESS", txId, "Asset purchased successfully. " + 
            totalCostInPaymentCurrency + " " + currency + " deducted from your balance.");
    }
}
package project.bitby.bitby.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import project.bitby.bitby.dto.DepositRequest;
import project.bitby.bitby.dto.DepositResponse;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.service.PaystackService;
import project.bitby.bitby.service.MarketDataService;
import project.bitby.bitby.dto.MarketDataResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaystackServiceImpl implements PaystackService {
    @Value("${paystack.secret-key}")
    private String paystackSecretKey;

    @Value("${paystack.public-key}")
    private String paystackPublicKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private final UserRepository userRepository;
    private final MarketDataService marketDataService;

    public PaystackServiceImpl(UserRepository userRepository, MarketDataService marketDataService) {
        this.userRepository = userRepository;
        this.marketDataService = marketDataService;
    }

    @Override
    public DepositResponse initializeDeposit(DepositRequest request, String currency) {
        String url = "https://api.paystack.co/transaction/initialize";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + paystackSecretKey);

        Map<String, Object> body = new HashMap<>();
        body.put("email", request.getEmail()); // Use phone/email as identifier
        body.put("amount", (int)(request.getAmount() * 100)); // Paystack expects amount in kobo
        body.put("currency", currency);
        body.put("callback_url", "https://your-frontend.com/paystack-callback"); // Replace with actual callback

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                String reference = (String) data.get("reference");
                String authUrl = (String) data.get("authorization_url");
                return new DepositResponse("PENDING", reference, authUrl);
            } else {
                return new DepositResponse("FAILED", null, "Failed to initialize Paystack transaction");
            }
        } catch (Exception e) {
            return new DepositResponse("FAILED", null, "Error: " + e.getMessage());
        }
    }

    @Override
    public void handleWebhook(String payload, String signature) {
        // For demo: skip signature verification
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(payload);
            String event = root.path("event").asText();
            if ("charge.success".equals(event)) {
                JsonNode data = root.path("data");
                String reference = data.path("reference").asText();
                double amount = data.path("amount").asDouble() / 100.0; // Paystack sends amount in kobo
                String currency = data.path("currency").asText().toUpperCase();
                String email = data.path("customer").path("email").asText();
                // For demo: find user by email (phoneNumber@bitby.com)
                String phoneNumber = email.replace("@bitby.com", "");
                Optional<User> userOpt = userRepository.findByEmail(phoneNumber);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    boolean updated = false;
                    switch (currency) {
                        case "BTC":
                        case "ETH":
                        case "USDT":
                        case "BNB": {
                            // Get current price in USD for the crypto
                            Optional<MarketDataResponse> marketDataOpt = marketDataService.getMarketDataBySymbol(currency);
                            if (marketDataOpt.isPresent() && marketDataOpt.get().getCurrentPrice() != null && marketDataOpt.get().getCurrentPrice().doubleValue() > 0) {
                                double price = marketDataOpt.get().getCurrentPrice().doubleValue();
                                double cryptoAmount = amount / price;
                                if (currency.equals("BTC")) user.setBtcBalance((user.getBtcBalance() != null ? user.getBtcBalance() : 0.0) + cryptoAmount);
                                if (currency.equals("ETH")) user.setEthBalance((user.getEthBalance() != null ? user.getEthBalance() : 0.0) + cryptoAmount);
                                if (currency.equals("USDT")) user.setUsdtBalance((user.getUsdtBalance() != null ? user.getUsdtBalance() : 0.0) + cryptoAmount);
                                if (currency.equals("BNB")) user.setBnbBalance((user.getBnbBalance() != null ? user.getBnbBalance() : 0.0) + cryptoAmount);
                                updated = true;
                            }
                            break;
                        }
                        case "USD":
                            user.setUsdBalance((user.getUsdBalance() != null ? user.getUsdBalance() : 0.0) + amount);
                            updated = true;
                            break;
                        case "GHS":
                            user.setCediBalance((user.getCediBalance() != null ? user.getCediBalance() : 0.0) + amount);
                            updated = true;
                            break;
                        default:
                            // For other currencies, you may want to convert to USD or handle as needed
                            user.setUsdBalance((user.getUsdBalance() != null ? user.getUsdBalance() : 0.0) + amount);
                            updated = true;
                    }
                    if (updated) {
                        userRepository.save(user);
                        System.out.println("Deposit successful for user: " + phoneNumber + ", amount: " + amount + " " + currency);
                    } else {
                        System.out.println("Deposit event received but not processed for currency: " + currency);
                    }
                } else {
                    System.out.println("User not found for deposit webhook: " + phoneNumber);
                }
            } else {
                System.out.println("Unhandled Paystack event: " + event);
            }
        } catch (Exception e) {
            System.out.println("Error handling Paystack webhook: " + e.getMessage());
        }
    }

    @Override
    public project.bitby.bitby.dto.WithdrawResponse initiateWithdrawal(project.bitby.bitby.dto.WithdrawRequest request, String userId) {
        // Only support GHS withdrawals for now
        if (!"GHS".equalsIgnoreCase(request.getCurrency())) {
            return new project.bitby.bitby.dto.WithdrawResponse("FAILED", null, "Only GHS withdrawals are supported at this time.");
        }
        Optional<User> userOpt = userRepository.findByUserId(userId);
        if (userOpt.isEmpty()) {
            return new project.bitby.bitby.dto.WithdrawResponse("FAILED", null, "User not found");
        }
        User user = userOpt.get();
        double amount = request.getAmount();
        if (user.getCediBalance() == null || user.getCediBalance() < amount) {
            return new project.bitby.bitby.dto.WithdrawResponse("FAILED", null, "Insufficient GHS balance");
        }
        // Deduct the amount
        user.setCediBalance(user.getCediBalance() - amount);
        userRepository.save(user);
        // MOCK: Simulate Paystack transfer for test/starter business
        // Generate a fake transaction ID
        String fakeTransferCode = "TRF_TEST_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        return new project.bitby.bitby.dto.WithdrawResponse("PENDING", fakeTransferCode, "[MOCKED] Withdrawal initiated (Paystack transfer simulated for test/starter business)");
        /*
        // Uncomment below for real Paystack integration
        String url = "https://api.paystack.co/transfer";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + paystackSecretKey);
        Map<String, Object> body = new HashMap<>();
        body.put("source", "balance");
        body.put("amount", (int)(amount * 100)); // Paystack expects amount in kobo
        body.put("currency", "GHS");
        body.put("reason", "Withdrawal to mobile money");
        // For test, use phoneNumber as recipient (in real, you'd create a recipient first)
        body.put("recipient", request.getPhoneNumber());
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                String transferCode = data != null ? (String) data.get("transfer_code") : null;
                return new project.bitby.bitby.dto.WithdrawResponse("PENDING", transferCode, "Withdrawal initiated");
            } else {
                return new project.bitby.bitby.dto.WithdrawResponse("FAILED", null, "Failed to initiate withdrawal");
            }
        } catch (Exception e) {
            return new project.bitby.bitby.dto.WithdrawResponse("FAILED", null, "Error: " + e.getMessage());
        }
        */
    }
} 
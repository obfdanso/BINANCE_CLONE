package project.bitby.bitby.service;

import project.bitby.bitby.dto.DepositRequest;
import project.bitby.bitby.dto.DepositResponse;

public interface PaystackService {
    DepositResponse initializeDeposit(DepositRequest request, String currency);
    void handleWebhook(String payload, String signature);
    // Add withdrawal method
    project.bitby.bitby.dto.WithdrawResponse initiateWithdrawal(project.bitby.bitby.dto.WithdrawRequest request, String userId);
} 
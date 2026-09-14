package project.bitby.bitby.service;

import project.bitby.bitby.dto.AssetOverviewResponse;
import project.bitby.bitby.dto.AssetPriceHistoryResponse;
import project.bitby.bitby.dto.BuyAssetRequest;
import project.bitby.bitby.dto.BuyAssetResponse;

public interface AssetService {
    AssetOverviewResponse getAssetOverview(String userId, String selectedCurrency);
    AssetPriceHistoryResponse getAssetPriceHistory();
    BuyAssetResponse buyAsset(BuyAssetRequest request, String userId);
} 
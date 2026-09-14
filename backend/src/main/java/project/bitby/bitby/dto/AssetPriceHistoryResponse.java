package project.bitby.bitby.dto;

import java.util.Map;

public class AssetPriceHistoryResponse {
    public static class AssetChange {
        private double lastPrice;
        private double percentChangeLastWeek;

        public AssetChange() {}
        public AssetChange(double lastPrice, double percentChangeLastWeek) {
            this.lastPrice = lastPrice;
            this.percentChangeLastWeek = percentChangeLastWeek;
        }
        public double getLastPrice() { return lastPrice; }
        public void setLastPrice(double lastPrice) { this.lastPrice = lastPrice; }
        public double getPercentChangeLastWeek() { return percentChangeLastWeek; }
        public void setPercentChangeLastWeek(double percentChangeLastWeek) { this.percentChangeLastWeek = percentChangeLastWeek; }
    }

    private Map<String, AssetChange> assets; // e.g., {"BTC": {lastPrice: 60000, percentChangeLastWeek: 5.2}}

    public AssetPriceHistoryResponse() {}
    public AssetPriceHistoryResponse(Map<String, AssetChange> assets) {
        this.assets = assets;
    }
    public Map<String, AssetChange> getAssets() { return assets; }
    public void setAssets(Map<String, AssetChange> assets) { this.assets = assets; }
} 
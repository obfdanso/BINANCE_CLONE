package project.bitby.bitby.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.models.Order;
import project.bitby.bitby.models.OrderBookEntry;
import project.bitby.bitby.models.TradingPair;
import project.bitby.bitby.repository.OrderBookEntryRepository;
import project.bitby.bitby.repository.OrderRepository;
import project.bitby.bitby.service.OrderBookService;
import project.bitby.bitby.service.WebSocketService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderBookServiceImpl implements OrderBookService {

    private final OrderBookEntryRepository orderBookEntryRepository;
    private final OrderRepository orderRepository;
    private final WebSocketService webSocketService;

    @Override
    public void updateOrderBookOnOrderPlaced(Order order) {
        log.debug("Updating order book for order placed: {}", order.getId());
        
        if (order.getStatus() == Order.OrderStatus.PENDING || 
            order.getStatus() == Order.OrderStatus.PARTIAL_FILLED) {
            
            // Add or update order book entry
            updateOrderBookEntry(order);
            
            // Broadcast order book update
            broadcastOrderBookUpdate(order.getTradingPair());
        }
    }

    @Override
    public void updateOrderBookOnOrderCancelled(Order order) {
        log.debug("Updating order book for order cancelled: {}", order.getId());
        
        // Remove or update order book entry
        removeOrderBookEntry(order);
        
        // Broadcast order book update
        broadcastOrderBookUpdate(order.getTradingPair());
    }

    @Override
    public void updateOrderBookOnOrderFilled(Order order) {
        log.debug("Updating order book for order filled: {}", order.getId());
        
        // Remove or update order book entry
        removeOrderBookEntry(order);
        
        // Broadcast order book update
        broadcastOrderBookUpdate(order.getTradingPair());
    }

    @Override
    public OrderBookResponse getOrderBook(TradingPair tradingPair, int depth) {
        List<OrderBookEntry> bids = orderBookEntryRepository.findTopBidsByTradingPair(tradingPair, depth);
        List<OrderBookEntry> asks = orderBookEntryRepository.findTopAsksByTradingPair(tradingPair, depth);
        
        List<OrderBookResponse.OrderBookLevel> bidLevels = bids.stream()
                .map(this::convertToOrderBookLevel)
                .collect(Collectors.toList());
        
        List<OrderBookResponse.OrderBookLevel> askLevels = asks.stream()
                .map(this::convertToOrderBookLevel)
                .collect(Collectors.toList());
        
        return new OrderBookResponse(
                tradingPair.getSymbol(), 
                System.currentTimeMillis(), 
                bidLevels, 
                askLevels
        );
    }

    @Override
    public BigDecimal getBestBidPrice(TradingPair tradingPair) {
        List<OrderBookEntry> bids = orderBookEntryRepository.findTopBidsByTradingPair(tradingPair, 1);
        return bids.isEmpty() ? BigDecimal.ZERO : bids.get(0).getPrice();
    }

    @Override
    public BigDecimal getBestAskPrice(TradingPair tradingPair) {
        List<OrderBookEntry> asks = orderBookEntryRepository.findTopAsksByTradingPair(tradingPair, 1);
        return asks.isEmpty() ? BigDecimal.ZERO : asks.get(0).getPrice();
    }

    @Override
    public BigDecimal getSpread(TradingPair tradingPair) {
        BigDecimal bestBid = getBestBidPrice(tradingPair);
        BigDecimal bestAsk = getBestAskPrice(tradingPair);
        
        if (bestBid.compareTo(BigDecimal.ZERO) == 0 || bestAsk.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return bestAsk.subtract(bestBid);
    }

    @Override
    public void rebuildOrderBook(TradingPair tradingPair) {
        log.info("Rebuilding order book for trading pair: {}", tradingPair.getSymbol());
        
        // Clear existing order book entries
        orderBookEntryRepository.deleteByTradingPairAndSideAndPrice(
                tradingPair, OrderBookEntry.OrderSide.BID, BigDecimal.ZERO);
        orderBookEntryRepository.deleteByTradingPairAndSideAndPrice(
                tradingPair, OrderBookEntry.OrderSide.ASK, BigDecimal.ZERO);
        
        // Get all active orders for this trading pair
        List<Order> activeOrders = orderRepository.findByTradingPairAndStatusIn(
                tradingPair, 
                List.of(Order.OrderStatus.PENDING, Order.OrderStatus.PARTIAL_FILLED)
        );
        
        // Group orders by price and side (exclude market orders and orders with null prices)
        Map<BigDecimal, List<Order>> bidOrders = activeOrders.stream()
                .filter(order -> order.getSide() == Order.OrderSide.BUY && 
                               order.getOrderType() != Order.OrderType.MARKET && 
                               order.getPrice() != null)
                .collect(Collectors.groupingBy(Order::getPrice));
        
        Map<BigDecimal, List<Order>> askOrders = activeOrders.stream()
                .filter(order -> order.getSide() == Order.OrderSide.SELL && 
                               order.getOrderType() != Order.OrderType.MARKET && 
                               order.getPrice() != null)
                .collect(Collectors.groupingBy(Order::getPrice));
        
        // Create order book entries for bids
        for (Map.Entry<BigDecimal, List<Order>> entry : bidOrders.entrySet()) {
            BigDecimal price = entry.getKey();
            List<Order> orders = entry.getValue();
            
            BigDecimal totalQuantity = orders.stream()
                    .map(Order::getRemainingQuantity)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            OrderBookEntry orderBookEntry = new OrderBookEntry();
            orderBookEntry.setTradingPair(tradingPair);
            orderBookEntry.setSide(OrderBookEntry.OrderSide.BID);
            orderBookEntry.setPrice(price);
            orderBookEntry.setTotalQuantity(totalQuantity);
            orderBookEntry.setOrderCount(orders.size());
            
            orderBookEntryRepository.save(orderBookEntry);
        }
        
        // Create order book entries for asks
        for (Map.Entry<BigDecimal, List<Order>> entry : askOrders.entrySet()) {
            BigDecimal price = entry.getKey();
            List<Order> orders = entry.getValue();
            
            BigDecimal totalQuantity = orders.stream()
                    .map(Order::getRemainingQuantity)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            OrderBookEntry orderBookEntry = new OrderBookEntry();
            orderBookEntry.setTradingPair(tradingPair);
            orderBookEntry.setSide(OrderBookEntry.OrderSide.ASK);
            orderBookEntry.setPrice(price);
            orderBookEntry.setTotalQuantity(totalQuantity);
            orderBookEntry.setOrderCount(orders.size());
            
            orderBookEntryRepository.save(orderBookEntry);
        }
        
        log.info("Order book rebuilt for trading pair: {}", tradingPair.getSymbol());
    }

    // Private helper methods

    private void updateOrderBookEntry(Order order) {
        // Market orders should not be added to the order book as they execute immediately
        if (order.getOrderType() == Order.OrderType.MARKET) {
            log.debug("Skipping order book update for market order: {}", order.getId());
            return;
        }
        
        // Price should not be null for limit orders
        if (order.getPrice() == null) {
            log.warn("Order price is null for non-market order: {}", order.getId());
            return;
        }
        
        OrderBookEntry.OrderSide side = order.getSide() == Order.OrderSide.BUY ? 
                OrderBookEntry.OrderSide.BID : OrderBookEntry.OrderSide.ASK;
        
        // Find existing entry at this price level
        OrderBookEntry existingEntry = orderBookEntryRepository.findByTradingPairAndSideAndPrice(
                order.getTradingPair(), side, order.getPrice());
        
        if (existingEntry != null) {
            // Update existing entry
            existingEntry.setTotalQuantity(existingEntry.getTotalQuantity().add(order.getRemainingQuantity()));
            existingEntry.setOrderCount(existingEntry.getOrderCount() + 1);
            orderBookEntryRepository.save(existingEntry);
        } else {
            // Create new entry
            OrderBookEntry newEntry = new OrderBookEntry();
            newEntry.setTradingPair(order.getTradingPair());
            newEntry.setSide(side);
            newEntry.setPrice(order.getPrice());
            newEntry.setTotalQuantity(order.getRemainingQuantity());
            newEntry.setOrderCount(1);
            
            orderBookEntryRepository.save(newEntry);
        }
    }

    private void removeOrderBookEntry(Order order) {
        // Market orders should not be in the order book, so no need to remove them
        if (order.getOrderType() == Order.OrderType.MARKET) {
            log.debug("Skipping order book removal for market order: {}", order.getId());
            return;
        }
        
        // Price should not be null for limit orders
        if (order.getPrice() == null) {
            log.warn("Order price is null for non-market order: {}", order.getId());
            return;
        }
        
        OrderBookEntry.OrderSide side = order.getSide() == Order.OrderSide.BUY ? 
                OrderBookEntry.OrderSide.BID : OrderBookEntry.OrderSide.ASK;
        
        // Find existing entry at this price level
        OrderBookEntry existingEntry = orderBookEntryRepository.findByTradingPairAndSideAndPrice(
                order.getTradingPair(), side, order.getPrice());
        
        if (existingEntry != null) {
            // Get all orders at this price level
            List<Order> ordersAtPrice = orderRepository.findByTradingPairAndStatusIn(
                    order.getTradingPair(), 
                    List.of(Order.OrderStatus.PENDING, Order.OrderStatus.PARTIAL_FILLED)
            ).stream()
            .filter(o -> o.getSide() == order.getSide() && o.getPrice() != null && o.getPrice().equals(order.getPrice()))
            .collect(Collectors.toList());
            
            if (ordersAtPrice.isEmpty()) {
                // No more orders at this price level, remove entry
                orderBookEntryRepository.delete(existingEntry);
            } else {
                // Update entry with remaining orders
                BigDecimal totalQuantity = ordersAtPrice.stream()
                        .map(Order::getRemainingQuantity)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                existingEntry.setTotalQuantity(totalQuantity);
                existingEntry.setOrderCount(ordersAtPrice.size());
                orderBookEntryRepository.save(existingEntry);
            }
        }
    }

    private void broadcastOrderBookUpdate(TradingPair tradingPair) {
        try {
            OrderBookResponse orderBook = getOrderBook(tradingPair, 20);
            webSocketService.broadcastOrderBookUpdate(tradingPair.getSymbol(), orderBook);
        } catch (Exception e) {
            log.error("Error broadcasting order book update for {}: {}", tradingPair.getSymbol(), e.getMessage());
        }
    }

    private OrderBookResponse.OrderBookLevel convertToOrderBookLevel(OrderBookEntry entry) {
        return new OrderBookResponse.OrderBookLevel(
                entry.getPrice(),
                entry.getTotalQuantity(),
                entry.getOrderCount()
        );
    }
} 
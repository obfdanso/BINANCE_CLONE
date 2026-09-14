package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.P2POrder;
import project.bitby.bitby.models.User;

import java.util.List;

@Repository
public interface P2POrderRepository extends JpaRepository<P2POrder, Long> {
    
    List<P2POrder> findByBuyer(User buyer);
    
    List<P2POrder> findBySeller(User seller);
    
    List<P2POrder> findByBuyerAndStatus(User buyer, P2POrder.OrderStatus status);
    
    List<P2POrder> findBySellerAndStatus(User seller, P2POrder.OrderStatus status);
} 
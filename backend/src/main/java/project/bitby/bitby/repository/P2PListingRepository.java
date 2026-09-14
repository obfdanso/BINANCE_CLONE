package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.P2PListing;
import project.bitby.bitby.models.User;

import java.util.List;

@Repository
public interface P2PListingRepository extends JpaRepository<P2PListing, Long> {
    
    List<P2PListing> findByStatus(P2PListing.ListingStatus status);
    
    List<P2PListing> findBySellerAndStatus(User seller, P2PListing.ListingStatus status);
    
    @Query("SELECT l FROM P2PListing l WHERE l.status = :status AND l.seller.id != :userId")
    List<P2PListing> findActiveListingsExcludingUser(@Param("status") P2PListing.ListingStatus status, @Param("userId") Long userId);
    
    List<P2PListing> findByAssetSymbolAndStatus(String assetSymbol, P2PListing.ListingStatus status);
} 
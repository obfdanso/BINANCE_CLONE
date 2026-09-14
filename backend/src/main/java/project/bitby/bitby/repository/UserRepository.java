package project.bitby.bitby.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.User;

import java.util.Optional;

@Repository

public interface UserRepository  extends JpaRepository<User, Long>{
        
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(String userId);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByTelegramUsername(String telegramUsername);
    Boolean existsByTelegramUsername(String telegramUsername);

    /**
     * Loads a user and holds a row lock until the transaction ends.
     *
     * Order placement decides whether an order is affordable by reading the
     * balance and subtracting what open orders already commit. Two requests
     * from the same account can both run that read before either writes its
     * order, so both see the same committed total and both pass: firing five
     * sell orders at once against a 0.249 BTC balance got three accepted,
     * committing 0.6 BTC.
     *
     * Taking the lock first serialises order placement per account, so the
     * second request reads the committed total the first one produced. Locking
     * is per row, so unrelated accounts do not wait on each other.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.userId = :userId")
    Optional<User> findByUserIdForUpdate(@Param("userId") String userId);
}

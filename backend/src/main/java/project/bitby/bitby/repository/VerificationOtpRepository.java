package project.bitby.bitby.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.bitby.bitby.models.VerificationOtp;

import java.util.Optional;

@Repository
public interface VerificationOtpRepository extends JpaRepository<VerificationOtp, Long> {
    Optional<VerificationOtp> findByEmailAndVerificationType(String email, VerificationOtp.VerificationType verificationType);
    Optional<VerificationOtp> findByMobileNumberAndVerificationType(String mobileNumber, VerificationOtp.VerificationType verificationType);
    Optional<VerificationOtp> findByTelegramUsernameAndVerificationType(String telegramUsername, VerificationOtp.VerificationType verificationType);
}

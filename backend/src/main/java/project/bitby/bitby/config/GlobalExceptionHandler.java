package project.bitby.bitby.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.validation.FieldError;
import project.bitby.bitby.dto.MessageResponse;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        
        // Map specific error messages to appropriate HTTP status codes
        if (message != null) {
            if (message.contains("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("User not found"));
            }
            if (message.contains("Listing not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Listing not found"));
            }
            if (message.contains("Order not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Order not found"));
            }
            if (message.contains("not active")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(message));
            }
            if (message.contains("cannot buy from yourself")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("You cannot buy from yourself"));
            }
            if (message.contains("exceeds available amount")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Requested amount exceeds available amount"));
            }
            if (message.contains("Insufficient") && message.contains("balance")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(message));
            }
            if (message.contains("invalid asset symbol")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Invalid asset symbol"));
            }
            if (message.contains("Only the buyer can")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(message));
            }
            if (message.contains("Only the seller can")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(message));
            }
            if (message.contains("not in pending status")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Order is not in the correct status"));
            }
            if (message.contains("Payment must be confirmed")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Payment must be confirmed before releasing assets"));
            }
            if (message.contains("Cannot cancel completed orders")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Cannot cancel completed orders"));
            }
            if (message.contains("already cancelled")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Order is already cancelled"));
            }
            if (message.contains("Unsupported asset") || message.contains("Unsupported currency")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(message));
            }
        }
        
        // Default for other runtime exceptions
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new MessageResponse("An unexpected error occurred: " + message));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new MessageResponse("Authentication failed: " + ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new MessageResponse("Access denied: " + ex.getMessage()));
    }

    /*
     * The handlers below exist because @ExceptionHandler(Exception.class)
     * catches Spring's own client-error exceptions too, and reported them as
     * 500 "An unexpected error occurred". A missing query parameter is the
     * caller's mistake, not a server fault, and saying so saves the caller
     * guessing which parameter was wrong.
     */

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingParameter(MissingServletRequestParameterException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new MessageResponse("Missing required parameter '" + ex.getParameterName()
                    + "' of type " + ex.getParameterType()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(this::describeFieldError)
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new MessageResponse(details.isEmpty() ? "Validation failed" : details));
    }

    private String describeFieldError(FieldError error) {
        return error.getField() + ": " + error.getDefaultMessage();
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new MessageResponse("Parameter '" + ex.getName() + "' has an invalid value: " + ex.getValue()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleUnreadableBody(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new MessageResponse("Request body is missing or malformed JSON"));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
            .body(new MessageResponse(ex.getMethod() + " is not supported for this endpoint"));
    }

    /**
     * Two requests touched the same row and the later one lost. Nothing is
     * wrong with the request itself, so 409 and an invitation to retry is more
     * useful than a 500.
     */
    @ExceptionHandler({OptimisticLockingFailureException.class, PessimisticLockingFailureException.class})
    public ResponseEntity<?> handleLockFailure(Exception ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new MessageResponse("That account was being updated by another request. Please retry."));
    }

    /**
     * An unknown path is a 404, not a server fault. Spring raises
     * NoResourceFoundException for one, and the catch-all below was turning
     * that into 500 "An unexpected error occurred" - so a typo in a URL looked
     * exactly like a crash.
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResource(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new MessageResponse("No endpoint at " + ex.getResourcePath()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new MessageResponse("An unexpected error occurred"));
    }
} 
package project.bitby.bitby.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import project.bitby.bitby.security.JwtAuthenticationFilter;
import project.bitby.bitby.service.UserDetailsServiceImpl;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // Allow all auth endpoints
                .requestMatchers("/market-data.html").permitAll()  // Allow access to market data page
                .requestMatchers("/js/**", "/css/**").permitAll()  // Allow access to static resources
                .requestMatchers("/api/market-data/**").permitAll()  // Allow access to market data API
                .requestMatchers("/api/v1/market/**").permitAll()  // Allow access to version 1 of market data API
                .requestMatchers("/ws/**").permitAll()  // Allow WebSocket connections
                .requestMatchers("/api/v1/convert/quote").permitAll()  // Allow quote endpoint without auth
                .requestMatchers("/api/v1/convert/types").permitAll()  // Allow types endpoint without auth
                .requestMatchers("/api/v1/convert/**").authenticated()  // Ensure other convert endpoints require authentication
                .requestMatchers("/api/p2p/**").authenticated()  // Explicitly require authentication for P2P endpoints
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight requests
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // For API documentation
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        // Handle CORS
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }

    // CORS configuration bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins for local development including your machine's IP
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://10.132.184.133:*",     // Your local machine IP with any port
            "http://localhost:*",          // Localhost with any port
            "http://127.0.0.1:*",          // Localhost alternative with any port
            "*"                           // Fallback for other origins
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
        configuration.setExposedHeaders(Arrays.asList("x-auth-token", "Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true); // Allow credentials (cookies, authorization headers, etc.)
        configuration.setMaxAge(3600L); // Cache preflight response for 1 hour
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
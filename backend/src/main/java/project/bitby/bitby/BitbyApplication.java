package project.bitby.bitby;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import project.bitby.bitby.service.MarketDataService;

@SpringBootApplication
@EnableScheduling
@RequiredArgsConstructor
public class BitbyApplication implements CommandLineRunner {

	private final MarketDataService marketDataService;

	public static void main(String[] args) {
		SpringApplication.run(BitbyApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Initialize market data on application startup
		marketDataService.initializeMarketData();
	}
}

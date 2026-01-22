import { initKafkaConsumer } from "./lib/kafka/consumer";
import { logger } from "./lib/logger";

const bootstrap = async () => {
	await initKafkaConsumer();
	logger.info("Notifications service started");
};

bootstrap().catch((err) => {
	console.error("Failed to start notifications service", err);
	process.exit(1);
});

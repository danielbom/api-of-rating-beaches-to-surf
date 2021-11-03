import SetupServer from "./SetupServer";
import config from "config";

async function bootstrap() {
  const setupSever = new SetupServer(config.get("App.port"));
  await setupSever.init();
  await setupSever.start();
}

bootstrap();

import SetupServer from "./SetupServer";

async function bootstrap() {
  const setupSever = new SetupServer();
  await setupSever.init();
  setupSever.start();
}

bootstrap();

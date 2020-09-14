import { express } from "./modules";
import { createPages } from "./test";
import startTimers from "./modules/timer";

async function main() {
  startTimers();
  express(5002);
  // createPages();
}

main();

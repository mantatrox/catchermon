import { express } from "./modules";
import { createPages } from "./test";

async function main() {
  express(5000);
  // createPages();
}

main();

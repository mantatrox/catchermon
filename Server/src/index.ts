import { express } from "./modules";
import { createPages } from "./test";

async function main() {
  express(5002);
  // createPages();
}

main();

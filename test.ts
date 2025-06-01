import "dotenv/config"; // make sure env variables are loaded
import { Database } from "./src/utils/db"; // adjust the path if needed
import { User } from "./src/app/models/User";
import { exit } from "process";
import { sleep } from "./src/utils/sleep"; // adjust the path if needed

async function main() {
  try {
    const user = await User.register("dkleidonaris@gmail.com", "123");
    console.log("✅ User created with ID:", user.id, user.name);

    console.log("BMR is:", user.calculateBMR());
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    console.log("Done");
    process.exit(0);
  }
}

main();

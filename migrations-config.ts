import { defineMikroOrmCliConfig } from "@medusajs/utils";
import path from "path";
import ReviewModel from "./models/review-model";

export default defineMikroOrmCliConfig("review_module", {
  entities: [ReviewModel] as any[],
  migrations: {
    path: path.join(__dirname, "migrations"),
  },
});

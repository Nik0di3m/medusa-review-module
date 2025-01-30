import { MedusaService } from "@medusajs/framework/utils";
import { Review } from "./models/review";
import { Logger } from "@medusajs/framework/types";

// This class is used to define the service methods for the Brand module
// Class have default methods like create, delete, list... and you can add custom methods
// You can also override the default methods
// The service class is used in the controller to access the database
// More info: https://docs.medusajs.com/resources/service-factory-reference

type InjectedDependencies = {
  logger: Logger;
};
class ReviewModuleService extends MedusaService({
  Review,
}) {
  protected logger_: Logger;
  constructor({ logger }: InjectedDependencies) {
    super(...arguments);
    this.logger_ = logger;
    this.logger_.info("Review Module: Initializing...");
  }
}

export default ReviewModuleService;

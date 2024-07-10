import { MedusaService } from "@medusajs/utils";
import { Logger } from "@medusajs/medusa";
import ReviewModel from "./models/review-model";

type InjectedDependencies = {
  logger: Logger;
};

class ReviewModuleService extends MedusaService({
  ReviewModel,
}) {
  protected logger_: Logger;

  constructor({ logger }: InjectedDependencies) {
    super(...arguments);
    this.logger_ = logger;
    this.logger_.info("[Review Module Service]: Initialized");
  }
}

export default ReviewModuleService;

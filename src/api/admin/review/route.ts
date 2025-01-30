import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { REVIEW_MODULE } from "src/modules/review";
import ReviewModuleService from "src/modules/review/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const reviewModuleService: ReviewModuleService =
    req.scope.resolve(REVIEW_MODULE);
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: reviews } = await query.graph({
    entity: "customer",
    fields: ["*", "review.*"],
  });

  res.status(200).json(reviews);
};

import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { REVIEW_MODULE } from "src/modules/review";
import ReviewModuleService from "src/modules/review/service";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const review_id = req.params.id;
  const { status } = req.body as any;

  const reviewModuleService: ReviewModuleService =
    req.scope.resolve(REVIEW_MODULE);

  const update = await reviewModuleService.updateReviews({
    id: review_id,
    status: status,
  });

  res.status(200).json({ data: update });
};

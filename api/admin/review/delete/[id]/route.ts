import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { any } from "prop-types";
import { REVIEW_MODULE } from "src/modules/review";
import ReviewModuleService from "src/modules/review/service";

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { customer_id, product_id } = req.body as any;
  const review_id = req.params.id;

  const reviewModuleService: ReviewModuleService =
    req.scope.resolve(REVIEW_MODULE);
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);

  const review = await reviewModuleService.retrieveReview(review_id);

  await remoteLink.dismiss({
    [Modules.CUSTOMER]: {
      customer_id: customer_id,
    },
    [REVIEW_MODULE]: {
      review_id: review.id,
    },
  });

  await remoteLink.dismiss({
    [Modules.PRODUCT]: {
      product_id: product_id,
    },
    [REVIEW_MODULE]: {
      review_id: review.id,
    },
  });

  const deleted = await reviewModuleService.deleteReviews(review_id);

  res.status(200).json({ data: deleted });
};

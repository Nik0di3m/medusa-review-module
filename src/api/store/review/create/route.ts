import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { REVIEW_MODULE } from "src/modules/review";
import ReviewModuleService from "src/modules/review/service";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const reviewModuleService: ReviewModuleService =
    req.scope.resolve(REVIEW_MODULE);
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);
  const { title, content, rating, customer_id, product_id } = req.body as any;

  // Tworzenie recenzji i powiązań
  const review = await reviewModuleService.createReviews({
    title,
    content,
    status: "draft",
    rating,
  });

  await remoteLink.create({
    [Modules.CUSTOMER]: {
      customer_id: customer_id,
    },
    [REVIEW_MODULE]: {
      review_id: review.id,
    },
  });

  await remoteLink.create({
    [Modules.PRODUCT]: {
      product_id: product_id,
    },
    [REVIEW_MODULE]: {
      review_id: review.id,
    },
  });

  res.status(201).json({
    review,
    status: "success",
  });
};

import { model } from "@medusajs/utils";

const ReviewModel = model.define("review_model", {
  id: model.id().primaryKey(),
  rating: model.number().default(0),
  comment: model.text(),
});

export default ReviewModel;

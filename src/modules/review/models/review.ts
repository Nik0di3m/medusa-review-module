import { model } from "@medusajs/framework/utils";
// This is Brand model that will be used to create a table in the database
// More information about the model can be found here: https://docs.medusajs.com/resources/references/data-model

export const Review = model.define("review", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text(),
  status: model.enum(["approved", "draft", "rejected"]).default("draft"),
  rating: model.number(),
});

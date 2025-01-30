import ReviewModule from "../modules/review";
import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";

// This code is responsible for linking products to brands.

export default defineLink(
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  },
  ReviewModule.linkable.review
);

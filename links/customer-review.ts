import ReviewModule from "../modules/review";
import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";

// This code is responsible for linking Customers to brands.

export default defineLink(
  {
    linkable: CustomerModule.linkable.customer,
    isList: true,
  },
  ReviewModule.linkable.review
);

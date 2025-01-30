import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: reviews } = await query.graph({
    entity: "review",
    fields: ["*", "customer_link.*", "product_link.*"],
  });

  const productIds = reviews.flatMap((review) =>
    review.product_link.flatMap((link) => link.product_id)
  );

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
    filters: {
      id: productIds,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const review of reviews) {
    for (const link of review.product_link) {
      const product = productMap.get(link.product_id);
      if (product) {
        link.product_title = product.title;
      }
    }
  }

  // add customer name to each review
  const customerIds = reviews.flatMap((review) =>
    review.customer_link.flatMap((link) => link.customer_id)
  );

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "first_name", "last_name"],
    filters: {
      id: customerIds,
    },
  });

  const customerMap = new Map(
    customers.map((customer) => [customer.id, customer])
  );

  for (const review of reviews) {
    for (const link of review.customer_link) {
      const customer = customerMap.get(link.customer_id);
      if (customer) {
        link.customer_name = `${customer.first_name} ${customer.last_name}`;
      }
    }
  }

  res.status(200).json(reviews);
};

import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const product_id = req.params.id;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Pobierz recenzje produktu
  const { data: reviewsOfProduct } = await query.graph({
    entity: "product",
    fields: ["review.*", "review.customer_link.*"],
    filters: {
      id: product_id,
    },
  });

  // remove all null reviews
  const filteredReviews = reviewsOfProduct.filter((product: any) => {
    product.review = product.review.filter((review: any) => review != null);
    return product.review.length > 0;
  });

  // Stwórz listę customer_id do pobrania danych klientów
  const customerIds = filteredReviews.flatMap((product: any) =>
    product.review.flatMap((review) =>
      review.customer_link.map((link) => link.customer_id)
    )
  );

  // Pobierz dane klientów na podstawie ich ID
  const uniqueCustomerIds = [...new Set(customerIds)]; // Usuń duplikaty ID klientów
  const customers = await query.graph({
    entity: "customer",
    fields: ["id", "first_name", "last_name"],
    filters: {
      id: uniqueCustomerIds,
    },
  });

  const customerMap = new Map(
    customers.data.map((customer) => [customer.id, customer])
  );

  // Dodaj imię i nazwisko klienta do każdej recenzji
  for (const product of reviewsOfProduct) {
    for (const review of product.review as any) {
      const customerLink = review.customer_link?.[0];
      if (customerLink) {
        const customer = customerMap.get(customerLink.customer_id);
        if (customer) {
          review.customer_name = `${customer.first_name} ${customer.last_name}`;
        }
      }
    }
  }

  res.status(200).json(reviewsOfProduct);
};

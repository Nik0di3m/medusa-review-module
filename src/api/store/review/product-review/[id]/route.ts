import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

// Definicja interfejsów typów
interface CustomerLink {
  customer_id: string;
  review_id: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Review {
  id: string;
  title: string;
  content: string;
  status: "approved" | "rejected";
  rating: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer_link: CustomerLink[];
  customer_name?: string;
}

interface Product {
  id: string;
  review: Review[];
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const product_id = req.params.id;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    // Pobierz recenzje produktu z walidacją typu
    const { data: reviewsOfProduct } = await query.graph<Product[]>({
      entity: "product",
      fields: ["review.*", "review.customer_link.*"],
      filters: { id: product_id },
    });

    // Filtruj nieprawidłowe recenzje i produkty
    const validProducts = reviewsOfProduct.filter(
      (product): product is Product => !!product?.review
    );

    // Zbierz unikalne ID klientów z zachowaniem typów
    const customerIds = validProducts
      .flatMap((product) =>
        product.review.flatMap((review) =>
          review.customer_link.map((link) => link.customer_id)
        )
      )
      .filter((id): id is string => !!id);

    const uniqueCustomerIds = [...new Set(customerIds)];

    // Pobierz dane klientów z walidacją typu
    const { data: customers } = await query.graph<Customer[]>({
      entity: "customer",
      fields: ["id", "first_name", "last_name"],
      filters: { id: uniqueCustomerIds },
    });

    // Utwórz mapę klientów z bezpiecznym typowaniem
    const customerMap = new Map<string, Customer>(
      customers.map((customer) => [customer.id, customer])
    );

    // Dodaj nazwę klienta do recenzji (niemutująca wersja)
    const productsWithCustomerNames = validProducts.map((product) => ({
      ...product,
      review: product.review.map((review) => {
        const customerId = review.customer_link[0]?.customer_id;
        const customer = customerId ? customerMap.get(customerId) : undefined;

        return {
          ...review,
          customer_name: customer
            ? `${customer.first_name} ${customer.last_name.charAt(0)}.`
            : "Anonymous",
        };
      }),
    }));

    // Filtruj i przetwarzaj recenzje (niemutująco)
    const approvedReviews = productsWithCustomerNames
      .map((product) => ({
        ...product,
        review: product.review.filter((review) => review.status === "approved"),
      }))
      .filter((product) => product.review.length > 0);

    // Oblicz statystyki z zabezpieczeniem przed NaN
    const allReviews = approvedReviews.flatMap((product) => product.review);
    const totalRating = allReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating =
      allReviews.length > 0
        ? Number((totalRating / allReviews.length).toFixed(1))
        : 0;

    res.status(200).json({
      reviews: approvedReviews,
      average_rating: averageRating,
      number_of_reviews: allReviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

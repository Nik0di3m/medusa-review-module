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
    // Pobierz recenzje produktu
    const { data: products } = await query.graph<Product[]>({
      entity: "product",
      fields: ["review.*", "review.customer_link.*"],
      filters: { id: product_id },
    });

    // Pobierz pierwszy i jedyny produkt (ponieważ filtrujemy po ID)
    const singleProduct = products[0] || { id: product_id, review: [] };

    // Zbierz unikalne ID klientów
    const customerIds = singleProduct.review
      .flatMap((review) => review.customer_link.map((link) => link.customer_id))
      .filter((id): id is string => !!id);

    const uniqueCustomerIds = [...new Set(customerIds)];

    // Pobierz dane klientów
    const { data: customers } = await query.graph<Customer[]>({
      entity: "customer",
      fields: ["id", "first_name", "last_name"],
      filters: { id: uniqueCustomerIds },
    });

    // Utwórz mapę klientów
    const customerMap = new Map<string, Customer>(
      customers.map((customer) => [customer.id, customer])
    );

    // Dodaj nazwy klientów do recenzji
    const processedReviews = singleProduct.review.map((review) => {
      const customerId = review.customer_link[0]?.customer_id;
      const customer = customerId ? customerMap.get(customerId) : undefined;

      return {
        ...review,
        customer_name: customer
          ? `${customer.first_name} ${customer.last_name.charAt(0)}.`
          : "Anonymous",
      };
    });

    // Filtruj zatwierdzone recenzje
    const approvedReviews = processedReviews.filter(
      (review) => review.status === "approved"
    );

    // Oblicz statystyki
    const totalRating = approvedReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const averageRating =
      approvedReviews.length > 0
        ? Number((totalRating / approvedReviews.length).toFixed(1))
        : 0;

    // Zwróć sformatowaną odpowiedź z pojedynczym obiektem
    res.status(200).json({
      product_id: product_id,
      reviews: approvedReviews,
      average_rating: averageRating,
      number_of_reviews: approvedReviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      product_id: product_id,
      message: "Internal server error",
      reviews: null,
      average_rating: 0,
      number_of_reviews: 0,
    });
  }
};

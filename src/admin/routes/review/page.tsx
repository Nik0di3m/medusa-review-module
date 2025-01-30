import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubble, Star, StarSolid } from "@medusajs/icons";
import {
  Table,
  Container,
  Heading,
  Button,
  Input,
  Select,
  RadioGroup,
  Label,
  Text,
  StatusBadge,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { ActionsDropdown } from "../../components/Review/ActionsDropdown";

interface IReview {
  id: string;
  title: string;
  content: string;
  status: "approved" | "draft" | "rejected";
  rating: number;
  customer_link: { customer_id: string; customer_name: string }[];
  product_link: { product_id: string; product_title: string }[];
}

const ReviewPage = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch("/admin/review/get");
      const data = await res.json();
      console.log(data);
      setReviews(data);
    };
    fetchReviews();
  }, []);

  const handleApproveReview = (reviewId: string) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return { ...review, status: "approved" };
      }
      return review;
    });
    setReviews(updatedReviews as any);
  };

  const handleRejectReview = (reviewId: string) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return { ...review, status: "rejected" };
      }
      return review;
    });
    setReviews(updatedReviews as any);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);
    setReviews(updatedReviews as any);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Reviews</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Manage all product reviews
          </Text>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h3">List of all reviews</Heading>
      </div>
      <div>
        <Table>
          <Table.Header>
            <Table.Row>
              {/* <Table.HeaderCell>ID</Table.HeaderCell> */}
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Content</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Rating</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {reviews.map((review) => (
              <Table.Row key={review.id}>
                {/* <Table.Cell>{review.id}</Table.Cell> */}
                <Table.Cell>{review.title}</Table.Cell>
                <Table.Cell>{review.content}</Table.Cell>
                <Table.Cell>
                  <StatusBadge
                    color={
                      review.status === "approved"
                        ? "green"
                        : review.status === "draft"
                        ? "orange"
                        : "red"
                    }
                  >
                    {review.status.toLocaleUpperCase()}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>
                        <StarSolid color="#FDB813" />
                      </span>
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <span key={i}>
                        <Star color="#E5E7EB" />
                      </span>
                    ))}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {review.product_link
                    .map((link) => link.product_title)
                    .join(", ")}
                </Table.Cell>
                <Table.Cell>
                  {review.customer_link
                    .map((link) => link.customer_name)
                    .join(", ")}
                </Table.Cell>
                <Table.Cell>
                  <ActionsDropdown
                    review_id={review.id}
                    onSuccesApprove={() => handleApproveReview(review.id)}
                    onSuccesReject={() => handleRejectReview(review.id)}
                    onSuccesDelete={() => handleDeleteReview(review.id)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export default ReviewPage;

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubble,
});

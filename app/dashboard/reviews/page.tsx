import { ReviewsManager } from "@/components/dashboard/reviews/ReviewsManager";
import { fetchReviews } from "@/lib/api/reviews";

export default async function DashboardReviewsPage() {
  const { items } = await fetchReviews();
  return <ReviewsManager initialReviews={items} />;
}

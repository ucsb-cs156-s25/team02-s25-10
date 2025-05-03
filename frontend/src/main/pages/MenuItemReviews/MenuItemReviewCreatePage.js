import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ReviewForm from "main/components/MenuItemReviews/ReviewForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ReviewCreatePage({ storybook = false }) {
  const objectToAxiosParams = (review) => ({
    url: "/api/menuitemreviews/post",
    method: "POST",
    params: {
      itemId: review.itemId,
      reviewerEmail: review.reviewerEmail,
      stars: review.stars,
      comments: review.comments,
    },
  });

  const onSuccess = (review) => {
    toast(`New review Created - id: ${review.id} Item Id: ${review.itemId}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreviews/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreviews" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Review</h1>
        <ReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}

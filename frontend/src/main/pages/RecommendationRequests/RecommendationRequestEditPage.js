import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationForm from "main/components/RecommendationRequests/RecommendationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: recommendationRequest,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/recommendationrequests?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/recommendationrequests`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (recommendationRequest) => ({
    url: "/api/recommendationrequests",
    method: "PUT",
    params: {
      id: recommendationRequest.id,
    },
    data: {
      requesterEmail: recommendationRequest.requesterEmail,
      professorEmail: recommendationRequest.professorEmail,
      explanation: recommendationRequest.explanation,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      done: recommendationRequest.done,
    },
  });

  const onSuccess = (recommendationRequest) => {
    toast(
      `Recommendation Request Updated - id: ${recommendationRequest.id} Requester Email: ${recommendationRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationrequests?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Recommendation Request</h1>
        {recommendationRequest && (
          <RecommendationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={recommendationRequest}
          />
        )}
      </div>
    </BasicLayout>
  );
}

// @ts-nocheck
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestsCreatePage({ storybook = false }) {
  const addZ = (timeString) => `${timeString}Z`;

  const objectToAxiosParams = (helpRequest) => ({
    url: "/api/helprequests/post",
    method: "POST",
    params: {
      requesterEmail: helpRequest.requesterEmail,
      teamId: helpRequest.teamId,
      tableOrBreakoutRoom: helpRequest.tableOrBreakoutRoom,
      requestTime: addZ(helpRequest.requestTime),
      explanation: helpRequest.explanation,
      solved: helpRequest.solved,
    },
  });

  const onSuccess = (helpRequest) => {
    toast(
      `New help request created - id: ${helpRequest.id}, requester: ${helpRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/helprequest/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>
        <HelpRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}

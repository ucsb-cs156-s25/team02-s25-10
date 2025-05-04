import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router-dom";
import ArticlesForm from "main/components/UCSBArticles/ArticlesForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBArticlesEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: article,
    _error,
    _status,
  } = useBackend(
    [`/api/ucsbarticles?id=${id}`],
    {
      method: "GET",
      url: "/api/ucsbarticles",
      params: {
        id,
      },
    }
  );

  const objectToAxiosPutParams = (article) => ({
    url: "/api/ucsbarticles",
    method: "PUT",
    params: {
      id: article.id,
    },
    data: {
      title: article.title,
      url: article.url,
      explanation: article.explanation,
      email: article.email,
      localDateTime: article.localDateTime,
    },
  });

  const onSuccess = (article) => {
    toast(`Article Updated - id: ${article.id} title: ${article.title}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    [`/api/ucsbarticles?id=${id}`]
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbarticles" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSB Article</h1>
        {article && (
          <ArticlesForm
            initialContents={article}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}

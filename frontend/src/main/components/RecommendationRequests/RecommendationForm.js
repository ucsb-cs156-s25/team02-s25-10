import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RecommendationForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  const defaultValues = initialContents;

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "RecommendationForm";

  // Stryker disable Regex
  // const isodate_regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-requesterEmail"}
          id="requesterEmail"
          type="text"
          isInvalid={Boolean(errors.requesterEmail)}
          {...register("requesterEmail", {
            required: "Requester Email is required.",
            maxLength: {
              value: 255,
              message: "Max length has 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requesterEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-professorEmail"}
          id="professorEmail"
          type="text"
          isInvalid={Boolean(errors.professorEmail)}
          {...register("professorEmail", {
            required: "Professor Email is required.",
            maxLength: {
              value: 255,
              message: "Max length has 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.professorEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          type="text"
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
            maxLength: {
              value: 255,
              message: "Max length has 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateRequested">Date Requested</Form.Label>
        <Form.Control
          id="dateRequested"
          type="datetime-local"
          isInvalid={Boolean(errors.dateRequested)}
          {...register("dateRequested", {
            required: "Date Requested is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateRequested?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateNeeded">Date Needed</Form.Label>
        <Form.Control
          id="dateNeeded"
          type="datetime-local"
          isInvalid={Boolean(errors.dateNeeded)}
          {...register("dateNeeded", {
            required: "Date Needed is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateNeeded?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="done">Done</Form.Label>
        <Form.Select
          id="done"
          isInvalid={Boolean(errors.done)}
          {...register("done", {
            required: "Done is required.",
          })}
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.done?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">{buttonLabel}</Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default RecommendationForm;

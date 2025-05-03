import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RecommendationForm( {initialContents, submitAction, buttonLabel = "Create"} ) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "RecommendationForm";

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
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
          {...register("professorEmail", {
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
        <Form.Label htmlFor="dateRequested">Date Requested (iso format)</Form.Label>
        <Form.Control
            data-testid={{testIdPrefix}+"-dateRequested"}
            id="dateRequested"
            type="datetime-local"
            isInvalid={Boolean(errors.localDateTime)}
            {...register("dateRequested", {
            required: true,
            pattern: isodate_regex,
            })}
        />
        <Form.Control.Feedback type="invalid">
            {errors.dateRequested && "Date Requested is required. "}
        </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label htmlFor="dateNeeded">Date Needed (iso format)</Form.Label>
        <Form.Control
            data-testid={{testIdPrefix}+"-dateNeeded"}
            id="dateNeeded"
            type="datetime-local"
            isInvalid={Boolean(errors.localDateTime)}
            {...register("dateNeeded", {
            required: true,
            pattern: isodate_regex,
            })}
        />
        <Form.Control.Feedback type="invalid">
            {errors.dateNeeded && "Date Needed is required. "}
        </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label htmlFor="done">Done</Form.Label>
            <Form.Select
                data-testid={testIdPrefix + "-done"}
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

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
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

// @ts-nocheck
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function removeZ(mystring) {
  return mystring.replace("Z", "");
}

function HelpRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: initialContents
      ? {
          ...initialContents,
          requestTime: removeZ(initialContents.requestTime),
        }
      : {},
  });

  const navigate = useNavigate();
  const testIdPrefix = "HelpRequestsForm";
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
          id="requesterEmail"
          type="email"
          isInvalid={Boolean(errors.requesterEmail)}
          {...register("requesterEmail", {
            required: "Requester email is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requesterEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="teamId">Team ID</Form.Label>
        <Form.Control
          id="teamId"
          type="text"
          isInvalid={Boolean(errors.teamId)}
          {...register("teamId", { required: "Team ID is required." })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.teamId?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="tableOrBreakoutRoom">
          Table / Breakout Room
        </Form.Label>
        <Form.Control
          id="tableOrBreakoutRoom"
          type="text"
          isInvalid={Boolean(errors.tableOrBreakoutRoom)}
          {...register("tableOrBreakoutRoom", {
            required: "Table or Breakout Room is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.tableOrBreakoutRoom?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="requestTime">Request Time (in UTC)</Form.Label>
        <Form.Control
          id="requestTime"
          type="datetime-local"
          isInvalid={Boolean(errors.requestTime)}
          {...register("requestTime", {
            required: "Request time is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requestTime?.message}
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
              message: "Max length is 255 characters.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Check
          id="solved"
          type="checkbox"
          label="Solved"
          {...register("solved")}
        />
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
export default HelpRequestForm;

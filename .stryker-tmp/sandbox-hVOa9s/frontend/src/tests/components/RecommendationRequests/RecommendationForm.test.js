// @ts-nocheck
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationForm from "main/components/RecommendationRequests/RecommendationForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested",
    "Date Needed",
    "Done",
  ];
  const testId = "RecommendationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationForm
            initialContents={recommendationRequestFixtures.oneRequest}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    const { dateRequested, dateNeeded } =
      recommendationRequestFixtures.oneRequest;

    expect(screen.getByLabelText("Id")).toHaveValue(
      String(recommendationRequestFixtures.oneRequest.id),
    );
    expect(screen.getByLabelText("Requester Email")).toHaveValue(
      recommendationRequestFixtures.oneRequest.requesterEmail,
    );
    expect(screen.getByLabelText("Professor Email")).toHaveValue(
      recommendationRequestFixtures.oneRequest.professorEmail,
    );
    expect(screen.getByLabelText("Explanation")).toHaveValue(
      recommendationRequestFixtures.oneRequest.explanation,
    );
    expect(screen.getByLabelText("Date Requested")).toHaveValue(
      dateRequested.slice(0, 16),
    );
    expect(screen.getByLabelText("Date Needed")).toHaveValue(
      dateNeeded.slice(0, 16),
    );
    expect(screen.getByLabelText("Done")).toHaveValue(
      String(recommendationRequestFixtures.oneRequest.done),
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required./);
    expect(
      screen.getByText(/Professor Email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Done is required./)).toBeInTheDocument();

    const reqEmailInput = screen.getByTestId(`${testId}-requesterEmail`);
    fireEvent.change(reqEmailInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length has 255 characters/),
      ).toBeInTheDocument();
    });

    fireEvent.change(reqEmailInput, { target: { value: "hi" } });
    await waitFor(() => {
      expect(
        screen.queryByText(/Max length has 255 characters/),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(submitButton);

    const profEmailInput = screen.getByTestId(`${testId}-professorEmail`);
    fireEvent.change(profEmailInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length has 255 characters/),
      ).toBeInTheDocument();
    });

    fireEvent.change(profEmailInput, { target: { value: "hi" } });
    await waitFor(() => {
      expect(
        screen.queryByText(/Max length has 255 characters/),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(submitButton);

    const explanationInput = screen.getByTestId(`${testId}-explanation`);
    fireEvent.change(explanationInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length has 255 characters/),
      ).toBeInTheDocument();
    });
  });
});

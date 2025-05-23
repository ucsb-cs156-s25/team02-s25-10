import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";
import HelpRequestForm from "main/components/HelpRequests/HelpRequestForm";

import { QueryClient, QueryClientProvider } from "react-query";
import { removeZ } from "main/components/HelpRequests/HelpRequestForm";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  test("that the removeZ function works properly", () => {
    expect(removeZ("ABC")).toBe("ABC");
    expect(removeZ("ABCZ")).toBe("ABC");
    expect(removeZ("")).toBe("");
  });

  const queryClient = new QueryClient();
  const testId = "HelpRequestsForm";

  const expectedLabels = [
    "Requester Email",
    "Team ID",
    "Table / Breakout Room",
    "Request Time (in UTC)",
    "Explanation",
  ];

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    const submitButton = await screen.findByText(/Create/);
    expect(submitButton).toBeInTheDocument();

    // Verify all labels exist
    expectedLabels.forEach((labelText) => {
      expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    const teamIdInput = screen.getByLabelText("Team ID");
    const tableInput = screen.getByLabelText("Table / Breakout Room");
    const requestTimeInput = screen.getByLabelText("Request Time (in UTC)");
    const explanationInput = screen.getByLabelText("Explanation");
    const solvedCheckbox = screen.getByLabelText("Solved");

    expect(requesterEmailInput).toHaveValue("");
    expect(teamIdInput).toHaveValue("");
    expect(tableInput).toHaveValue("");
    expect(requestTimeInput).toHaveValue("");
    expect(explanationInput).toHaveValue("");
    expect(solvedCheckbox).not.toBeChecked();
  });

  test("renders correctly with initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm
            initialContents={helpRequestsFixtures.oneHelpRequest}
            buttonLabel="Update"
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Update/)).toBeInTheDocument();
    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();

    expect(screen.getByLabelText("Request Time (in UTC)")).toHaveValue(
      helpRequestsFixtures.oneHelpRequest.requestTime
        .replace("Z", "")
        .slice(0, 16),
    );

    expectedLabels.forEach((labelText) => {
      expect(screen.getByText(labelText)).toBeInTheDocument();
    });
  });

  test("navigates back when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    const cancelButton = await screen.findByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("shows validation errors on empty submit and max length error on explanation", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Requester email is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Team ID is required/)).toBeInTheDocument();
    expect(
      screen.getByText(/Table or Breakout Room is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Request time is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();

    const explanationInput = screen.getByTestId(`${testId}-explanation`);
    fireEvent.change(explanationInput, { target: { value: "x".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length is 255 characters/),
      ).toBeInTheDocument();
    });
  });
});

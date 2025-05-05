import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequests/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequests", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 1,
      requesterEmail: "test_email",
      professorEmail: "professor_email",
      explanation: "test",
      dateRequested: "2025-01-01T12:00",
      dateNeeded: "2025-05-01T12:00",
      done: false,
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const profEmailInput = screen.getByLabelText("Professor Email");
    expect(profEmailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateRequestedInput = screen.getByLabelText("Date Requested");
    expect(dateRequestedInput).toBeInTheDocument();

    const dateNeededInput = screen.getByLabelText("Date Needed");
    expect(dateNeededInput).toBeInTheDocument();

    const doneInput = screen.getByLabelText("Done");
    expect(doneInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(requesterEmailInput, {
      target: { value: recommendationRequest.requesterEmail },
    });
    fireEvent.change(profEmailInput, {
      target: { value: recommendationRequest.professorEmail },
    });
    fireEvent.change(explanationInput, {
      target: { value: recommendationRequest.explanation },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: recommendationRequest.dateNeeded },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: recommendationRequest.dateRequested },
    });
    fireEvent.change(doneInput, {
      target: { value: recommendationRequest.done },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: recommendationRequest.requesterEmail,
      professorEmail: recommendationRequest.professorEmail,
      explanation: recommendationRequest.explanation,
      dateNeeded: recommendationRequest.dateNeeded,
      dateRequested: recommendationRequest.dateRequested,
      done: String(recommendationRequest.done),
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New recommendation request Created - id: 1 Requester Email: test_email",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });
  });
});

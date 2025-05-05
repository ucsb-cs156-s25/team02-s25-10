import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
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

describe("HelpRequestsCreatePage tests", () => {
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
          <HelpRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequests", async () => {
    const helpRequest = {
      id: 17,
      requesterEmail: "linghe@ucsb.edu",
      teamId: "42",
      tableOrBreakoutRoom: "2",
      requestTime: "2025-05-04T14:30:12Z",
      explanation: "Need help with testing",
      solved: false,
    };

    axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Requester Email"), {
      target: { value: "linghe@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Team ID"), {
      target: { value: "42" },
    });
    fireEvent.change(screen.getByLabelText("Table / Breakout Room"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Request Time (in UTC)"), {
      target: { value: "2025-05-04T14:30:12" }, // note: no 'Z', that is added on later
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "Need help with testing" },
    });
    fireEvent.click(screen.getByLabelText("Solved"));

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "linghe@ucsb.edu",
      teamId: "42",
      tableOrBreakoutRoom: "2",
      requestTime: "2025-05-04T14:30:12.000Z",
      explanation: "Need help with testing",
      solved: true,
    });

    expect(mockToast).toBeCalledWith(
      `New help request created - id: 17, requester: linghe@ucsb.edu`,
    );
    expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
  });
});

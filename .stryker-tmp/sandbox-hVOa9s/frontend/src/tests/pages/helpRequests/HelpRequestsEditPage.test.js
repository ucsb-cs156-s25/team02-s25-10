// @ts-nocheck
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();

    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByLabelText(/Requester Email/i),
      ).not.toBeInTheDocument();

      restoreConsole();
    });
  });

  describe("backend works normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "linghe@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "7",
        requestTime: "2025-05-01T12:00:00Z",
        explanation: "Need help with React",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 17,
        requesterEmail: "updated@ucsb.edu",
        teamId: "11",
        tableOrBreakoutRoom: "8",
        requestTime: "2025-05-01T12:00:00Z",
        explanation: "Updated explanation",
        solved: true,
      });
    });

    const queryClient = new QueryClient();

    test("is populated with the backend data and updates on submit", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const emailField = await screen.findByLabelText("Requester Email");
      const teamField = screen.getByLabelText("Team ID");
      const tableField = screen.getByLabelText("Table / Breakout Room");
      const timeField = screen.getByLabelText("Request Time (in UTC)");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedCheckbox = screen.getByLabelText("Solved");
      const submitButton = screen.getByRole("button", { name: "Update" });

      expect(emailField).toHaveValue("linghe@ucsb.edu");
      expect(teamField).toHaveValue("10");
      expect(tableField).toHaveValue("7");
      expect(timeField).toHaveValue("2025-05-01T12:00");
      expect(explanationField).toHaveValue("Need help with React");
      expect(solvedCheckbox.checked).toBe(false);

      fireEvent.change(emailField, { target: { value: "updated@ucsb.edu" } });
      fireEvent.change(teamField, { target: { value: "11" } });
      fireEvent.change(tableField, { target: { value: "8" } });
      fireEvent.change(explanationField, {
        target: { value: "Updated explanation" },
      });
      fireEvent.click(solvedCheckbox);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "HelpRequest Updated - id: 17, requester: updated@ucsb.edu",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "updated@ucsb.edu",
          teamId: "11",
          tableOrBreakoutRoom: "8",
          requestTime: "2025-05-01T12:00:00Z",
          explanation: "Updated explanation",
          solved: true,
        }),
      );
    });
  });
});

// @ts-nocheck
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (msg) => mockToast(msg),
  };
});

describe("HelpRequestsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "HelpRequestTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test("renders help requests for regular user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestsFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("renders Create button for admin user", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestsFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Create Help Request/)).toBeInTheDocument();
    });

    const button = screen.getByText(/Create Help Request/);
    expect(button).toHaveAttribute("href", "/helprequests/create");
    expect(button).toHaveStyle("float: right");
  });

  test("does not show create button for regular user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestsFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Create Help Request/)).not.toBeInTheDocument();
  });

  test("renders help requests with buttons for admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestsFixtures.threeHelpRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1"),
    );

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).toBeInTheDocument();
  });

  test("delete button works for admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestsFixtures.threeHelpRequests);
    axiosMock
      .onDelete("/api/helprequests")
      .reply(200, { message: "HelpRequest with id 1 was deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId(`${testId}-cell-row-0-col-id`);

    fireEvent.click(
      screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`),
    );

    await waitFor(() => {
      const toastArg = mockToast.mock.calls[0][0];
      const message =
        typeof toastArg === "string" ? toastArg : toastArg.message;
      expect(message).toBe("HelpRequest with id 1 was deleted");
    });
  });

  test("backend unavailable renders empty table", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/helprequests/all").timeout();
    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/helprequests/all",
    );

    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();
  });
});

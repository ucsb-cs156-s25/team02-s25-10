import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";
import HelpRequestTable from "main/components/HelpRequests/HelpRequestsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "id",
    "Requester Email",
    "Team ID",
    "Table / Breakout Room",
    "Request Time (in UTC)",
    "Explanation",
    "Solved",
  ];

  const expectedFields = [
    "id",
    "requesterEmail",
    "teamId",
    "tableOrBreakoutRoom",
    "requestTime",
    "explanation",
    "solved",
  ];

  const testId = "HelpRequestTable";

  test("renders empty table correctly", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable helpRequests={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`,
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestsFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    const expectedData = [
      {
        id: "1",
        requesterEmail: "linghe@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "10",
        requestTime: "2025-05-02T14:30:00Z",
        explanation: "Having trouble merging Git branches",
        solved: "No",
      },
      {
        id: "2",
        requesterEmail: "milad2@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "10",
        requestTime: "2025-05-01T14:30:00Z",
        explanation: "Having trouble with Team02 accessing board",
        solved: "No",
      },
      {
        id: "3",
        requesterEmail: "andrewy243@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "8",
        requestTime: "2025-04-28T14:30:00Z",
        explanation: "Having trouble with Team02 accessing board",
        solved: "Yes",
      },
    ];

    expectedData.forEach((row, index) => {
      Object.entries(row).forEach(([field, expectedValue]) => {
        expect(
          screen.getByTestId(`${testId}-cell-row-${index}-col-${field}`),
        ).toHaveTextContent(expectedValue);
      });
    });

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Has the expected column headers, content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestsFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    const expectedData = [
      {
        id: "1",
        requesterEmail: "linghe@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "10",
        requestTime: "2025-05-02T14:30:00Z",
        explanation: "Having trouble merging Git branches",
        solved: "No",
      },
      {
        id: "2",
        requesterEmail: "milad2@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "10",
        requestTime: "2025-05-01T14:30:00Z",
        explanation: "Having trouble with Team02 accessing board",
        solved: "No",
      },
      {
        id: "3",
        requesterEmail: "andrewy243@ucsb.edu",
        teamId: "10",
        tableOrBreakoutRoom: "8",
        requestTime: "2025-04-28T14:30:00Z",
        explanation: "Having trouble with Team02 accessing board",
        solved: "Yes",
      },
    ];

    expectedData.forEach((row, index) => {
      Object.entries(row).forEach(([field, expectedValue]) => {
        expect(
          screen.getByTestId(`${testId}-cell-row-${index}-col-${field}`),
        ).toHaveTextContent(expectedValue);
      });
    });

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestsFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/helprequests/edit/1"),
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/helprequests")
      .reply(200, { message: "HelpRequest deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestsFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});

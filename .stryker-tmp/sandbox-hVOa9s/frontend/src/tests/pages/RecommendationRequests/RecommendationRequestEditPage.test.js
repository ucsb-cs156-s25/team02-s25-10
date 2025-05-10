// @ts-nocheck
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";

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

describe("RecommendationRequestEditPage tests", () => {
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequest-name"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
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
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "test_email",
          professorEmail: "professor_email",
          explanation: "test",
          dateRequested: "2025-01-01T12:00",
          dateNeeded: "2025-05-01T12:00",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 17,
        requesterEmail: "another_email",
        professorEmail: "professor_email_two",
        explanation: "test2",
        dateRequested: "2022-01-01T12:00",
        dateNeeded: "2024-06-01T12:00",
        done: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationForm-id");

      const idField = screen.getByTestId("RecommendationForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationForm-professorEmail",
      );
      const explanationField = screen.getByTestId(
        "RecommendationForm-explanation",
      );
      const dateRequestedField = screen.getByLabelText("Date Requested");
      const dateNeededField = screen.getByLabelText("Date Needed");
      const doneField = screen.getByLabelText("Done");
      const submitButton = screen.getByTestId("RecommendationForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("test_email");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("professor_email");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("test");

      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2025-01-01T12:00");

      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2025-05-01T12:00");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toHaveValue("false");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "another_email" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "professor_email_two" },
      });
      fireEvent.change(explanationField, {
        target: { value: "test2" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2022-01-01T12:00" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2024-06-01T12:00" },
      });
      fireEvent.change(doneField, {
        target: { value: "true" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 Requester Email: another_email",
      );

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequests",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "another_email",
          professorEmail: "professor_email_two",
          explanation: "test2",
          dateRequested: "2022-01-01T12:00",
          dateNeeded: "2024-06-01T12:00",
          done: "true",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequests",
      });
    });

    //   test("Changes when you click Update", async () => {
    //     render(
    //       <QueryClientProvider client={queryClient}>
    //         <MemoryRouter>
    //           <RecommendationRequestEditPage />
    //         </MemoryRouter>
    //       </QueryClientProvider>,
    //     );

    //     await screen.findByTestId("RecommendationForm-id");

    //     const idField = screen.getByTestId("RecommendationForm-id");
    //     const nameField = screen.getByTestId("RecommendationForm-name");
    //     const descriptionField = screen.getByTestId("RecommendationForm-description");
    //     const submitButton = screen.getByTestId("RecommendationForm-submit");

    //     expect(idField).toHaveValue("17");
    //     expect(nameField).toHaveValue("Freebirds");
    //     expect(descriptionField).toHaveValue("Burritos");
    //     expect(submitButton).toBeInTheDocument();

    //     fireEvent.change(nameField, {
    //       target: { value: "Freebirds World Burrito" },
    //     });
    //     fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //     fireEvent.click(submitButton);

    //     await waitFor(() => expect(mockToast).toBeCalled());
    //     expect(mockToast).toBeCalledWith(
    //       "Recommendation Request Updated - id: 17 name: Freebirds World Burrito",
    //     );
    //     expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequests" });
    //   });
  });
});

import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReviews/MenuItemReviewEditPage";

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

describe("MenuItemReviewEditPage tests", () => {
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
      axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Review");
      expect(screen.queryByTestId("Review-name")).not.toBeInTheDocument();
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
        .onGet("/api/menuitemreviews", { params: { id: 17 } })
        .reply(200, {
          id: 2,
          itemId: 14,
          reviewerEmail: "johnsmith@gmail.com",
          stars: 3,
          comments: "It was alright",
        });
      axiosMock.onPut("/api/menuitemreviews").reply(200, {
        id: 2,
        itemId: 14,
        reviewerEmail: "johnsmith@gmail.com",
        stars: 5,
        comments: "FIRE FOOD",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ReviewForm-id");

      const idField = screen.getByTestId("ReviewForm-id");
      const itemIdField = screen.getByTestId("ReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("ReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("ReviewForm-stars");
      const commentslField = screen.getByTestId("ReviewForm-comments");
      const submitButton = screen.getByTestId("ReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("2");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue("14");
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("johnsmith@gmail.com");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("3");
      expect(commentslField).toBeInTheDocument();
      expect(commentslField).toHaveValue("It was alright");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: "14" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "johnsmith@gmail.com" },
      });
      fireEvent.change(starsField, {
        target: { value: "5" },
      });
      fireEvent.change(commentslField, {
        target: { value: "FIRE FOOD" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith("Review Updated - id: 2 Item Id: 14");

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 2 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: 14,
          reviewerEmail: "johnsmith@gmail.com",
          stars: "5",
          comments: "FIRE FOOD",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ReviewForm-id");

      const idField = screen.getByTestId("ReviewForm-id");
      const itemIdField = screen.getByTestId("ReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId("ReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("ReviewForm-stars");
      const commentslField = screen.getByTestId("ReviewForm-comments");
      const submitButton = screen.getByTestId("ReviewForm-submit");

      expect(idField).toHaveValue("2");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue("14");
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("johnsmith@gmail.com");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("3");
      expect(commentslField).toBeInTheDocument();
      expect(commentslField).toHaveValue("It was alright");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemIdField, {
        target: { value: "14" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "johnsmith@gmail.com" },
      });
      fireEvent.change(starsField, {
        target: { value: "5" },
      });
      fireEvent.change(commentslField, {
        target: { value: "FIRE FOOD" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith("Review Updated - id: 2 Item Id: 14");
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
    });
  });
});

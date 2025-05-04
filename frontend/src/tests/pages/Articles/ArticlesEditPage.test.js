import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBArticlesEditPage from "main/pages/UCSBArticles/UCSBArticlesEditPage";

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
      id: 42,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBArticlesEditPage tests", () => {
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
      axiosMock.onGet("/api/ucsbarticles", { params: { id: 42 } }).timeout();
    });

    const queryClient = new QueryClient();

    test("renders header but form fields are not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByText("Edit UCSB Article");
      expect(screen.queryByTestId("ArticlesForm-title")).not.toBeInTheDocument();

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
      axiosMock.onGet("/api/ucsbarticles", { params: { id: 42 } }).reply(200, {
        id: 42,
        title: "Initial Title",
        url: "https://example.com/original",
        explanation: "Original explanation",
        email: "original@example.com",
        localDateTime: "2022-11-11T11:11",
      });
      axiosMock.onPut("/api/ucsbarticles").reply(200, {
        id: "42",
        title: "Updated Title",
        url: "https://example.com/updated",
        explanation: "Updated explanation",
        email: "updated@example.com",
        localDateTime: "2023-01-01T09:00",
      });
    });

    const queryClient = new QueryClient();

    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("ArticlesForm-title");
    });

    test("is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("ArticlesForm-title");

      expect(screen.getByTestId("ArticlesForm-id")).toHaveValue("42");
      expect(screen.getByTestId("ArticlesForm-title")).toHaveValue("Initial Title");
      expect(screen.getByTestId("ArticlesForm-url")).toHaveValue("https://example.com/original");
      expect(screen.getByTestId("ArticlesForm-explanation")).toHaveValue("Original explanation");
      expect(screen.getByTestId("ArticlesForm-email")).toHaveValue("original@example.com");
      expect(screen.getByTestId("ArticlesForm-localDateTime")).toHaveValue("2022-11-11T11:11");
    });

    test("changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("ArticlesForm-title");

      fireEvent.change(screen.getByTestId("ArticlesForm-title"), {
        target: { value: "Updated Title" },
      });
      fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
        target: { value: "https://example.com/updated" },
      });
      fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), {
        target: { value: "Updated explanation" },
      });
      fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
        target: { value: "updated@example.com" },
      });
      fireEvent.change(screen.getByTestId("ArticlesForm-localDateTime"), {
        target: { value: "2023-01-01T09:00" },
      });

      const submitButton = screen.getByTestId("ArticlesForm-submit");
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 42 title: Updated Title"
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsbarticles" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 42 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Updated Title",
          url: "https://example.com/updated",
          explanation: "Updated explanation",
          email: "updated@example.com",
          localDateTime: "2023-01-01T09:00",
        })
      );
    });
  });
});

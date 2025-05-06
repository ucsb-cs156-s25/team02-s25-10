import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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

describe("ArticlesEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title: "owo",
        url: "https://example.com",
        explanation: "OwO",
        email: "junjieliu@ucsb.edu",
        localDateTime: "2022-01-02T12:00:01",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "owo",
        url: "https://example.com",
        explanation: "OwO",
        email: "junjieliu@gmail.com",
        localDateTime: "2022-01-02T12:00:01",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticlesForm-id");

      const idField = screen.getByTestId("ArticlesForm-id");
      const titleField = screen.getByTestId("ArticlesForm-title");
      const urlField = screen.getByTestId("ArticlesForm-url");
      const explanationField = screen.getByTestId("ArticlesForm-explanation");
      const emailField = screen.getByTestId("ArticlesForm-email");
      const localDateTimeField = screen.getByLabelText(
        "Date Added (iso format)",
      );
      const submitButton = screen.getByText("Update");
      //
      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(titleField).toBeInTheDocument();
      expect(titleField).toHaveValue("owo");

      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue("https://example.com");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("OwO");

      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("junjieliu@ucsb.edu");

      expect(localDateTimeField).toBeInTheDocument();
      expect(localDateTimeField).toHaveValue("2022-01-02T12:00:01.000");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(titleField, {
        target: { value: "DONT MAKE ME DO THIS" },
      });
      fireEvent.change(urlField, {
        target: { value: "https://example.com" },
      });
      fireEvent.change(explanationField, {
        target: { value: "I cry" },
      });
      fireEvent.change(emailField, {
        target: { value: "junjieliu@gmail.com" },
      });
      fireEvent.change(localDateTimeField, {
        target: { value: "2024-01-01T12:00:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Article Updated - id: 17 title: owo",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "DONT MAKE ME DO THIS",
          url: "https://example.com",
          explanation: "I cry",
          email: "junjieliu@gmail.com",
          localDateTime: "2024-01-01T12:00:00",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
    });
  });
});

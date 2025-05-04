import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBArticlesCreatePage from "main/pages/UCSBArticles/UCSBArticlesCreatePage";
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

describe("UCSBArticlesCreatePage tests", () => {
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
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const newArticle = {
      id: 42,
      title: "Breaking News",
      url: "https://example.com/news",
      explanation: "This is a test article.",
      email: "news@example.com",
      localDateTime: "2022-11-11T11:11",
    };

    axiosMock.onPost("/api/ucsbarticles/post").reply(202, newArticle);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("ArticlesForm-title"), {
      target: { value: newArticle.title },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
      target: { value: newArticle.url },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), {
      target: { value: newArticle.explanation },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
      target: { value: newArticle.email },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-localDateTime"), {
      target: { value: newArticle.localDateTime },
    });

    const submitButton = screen.getByTestId("ArticlesForm-submit");
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: newArticle.title,
      url: newArticle.url,
      explanation: newArticle.explanation,
      email: newArticle.email,
      localDateTime: newArticle.localDateTime,
    });

    expect(mockToast).toBeCalledWith(
      "New article created - id: 42 title: Breaking News"
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbarticles" });
  });
});

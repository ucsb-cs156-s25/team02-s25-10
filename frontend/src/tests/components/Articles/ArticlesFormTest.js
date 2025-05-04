import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/UCSBArticles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in an article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-id");
    expect(screen.getByTestId("ArticlesForm-id")).toHaveValue("2");
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    const submitButton = await screen.findByTestId("ArticlesForm-submit");
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Title is required/)).toBeInTheDocument();
    expect(screen.getByText(/url is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/LocalDateTime is required/)).toBeInTheDocument();
  });

  test("Correct error messages on bad localDateTime input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    const localDateTimeField = await screen.findByTestId("ArticlesForm-localDateTime");
    fireEvent.change(localDateTimeField, { target: { value: "not-a-date" } });

    const submitButton = screen.getByTestId("ArticlesForm-submit");
    fireEvent.click(submitButton);

    expect(await screen.findByText(/LocalDateTime is required/)).toBeInTheDocument(); // regex failure treated as required here
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>
    );

    fireEvent.change(screen.getByTestId("ArticlesForm-title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), {
      target: { value: "Test explanation" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-localDateTime"), {
      target: { value: "2022-11-11T11:11" },
    });

    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
  });

  test("navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    const cancelButton = await screen.findByTestId("ArticlesForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});

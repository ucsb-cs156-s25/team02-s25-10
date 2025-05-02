import { render, screen } from "@testing-library/react";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiReviewFixtures } from "fixtures/reviewFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("PlaceholderEditPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/menuitemreviews")
      .reply(200, apiReviewFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();
  test("Renders expected content", async () => {
    // arrange

    setupUserOnly();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PlaceholderEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await screen.findByText("Edit page not yet implemented");
  });
});

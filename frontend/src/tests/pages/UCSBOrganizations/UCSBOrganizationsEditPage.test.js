import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

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
      id: "SKY",
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationsEditPage tests", () => {
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
        .onGet("/api/ucsborganizations", { params: { code: "SKY" } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Organization");
      expect(
        screen.queryByTestId("UCSBOrganizationForm-orgCode"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();

      // Load the page first
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);

      // Mock the specific API call
      axiosMock
        .onGet("/api/ucsborganizations", { params: { code: "SKY" } })
        .reply(200, {
          orgCode: "SKY",
          orgTranslationShort: "skydive",
          orgTranslation: "skydiving",
          inactive: true,
        });

      // The PUT request needs to be set up for success
      axiosMock.onPut("/api/ucsborganizations").reply(200, {
        orgCode: "SKY1",
        orgTranslationShort: "skydive1",
        orgTranslation: "skydiving1",
        inactive: "false",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByLabelText(
        "OrgTranslationShort",
      );
      const orgTranslationField = screen.getByLabelText("OrgTranslation");
      const inactiveField = screen.getByLabelText("Inactive");

      const submitButton = screen.getByText("Update");

      expect(orgCodeField).toBeInTheDocument();
      expect(orgCodeField).toHaveValue("SKY");
      expect(orgTranslationShortField).toBeInTheDocument();
      expect(orgTranslationShortField).toHaveValue("skydive");
      expect(orgTranslationField).toBeInTheDocument();
      expect(orgTranslationField).toHaveValue("skydiving");
      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).toHaveValue("true");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(orgCodeField, {
        target: { value: "SKY1" },
      });
      fireEvent.change(orgTranslationShortField, {
        target: { value: "skydive1" },
      });
      fireEvent.change(orgTranslationField, {
        target: { value: "skydiving1" },
      });
      fireEvent.change(inactiveField, {
        target: { value: "false" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Organization Updated - id: SKY1 orgCode: SKY1",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ code: "SKY" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgCode: "SKY1",
          orgTranslationShort: "skydive1",
          orgTranslation: "skydiving1",
          inactive: "false",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslationShort",
      );
      const orgTranslationField = screen.getByTestId(
        "UCSBOrganizationForm-orgTranslation",
      );
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByText("Update");

      expect(orgCodeField).toHaveValue("SKY");
      expect(orgTranslationShortField).toHaveValue("skydive");
      expect(orgTranslationField).toHaveValue("skydiving");
      expect(inactiveField).toHaveValue("true");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(orgCodeField, {
        target: { value: "SKY1" },
      });
      fireEvent.change(orgTranslationShortField, {
        target: { value: "skydive1" },
      });
      fireEvent.change(orgTranslationField, {
        target: { value: "skydiving1" },
      });
      fireEvent.change(inactiveField, {
        target: { value: "false" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Organization Updated - id: SKY1 orgCode: SKY1",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });
    });
  });
});

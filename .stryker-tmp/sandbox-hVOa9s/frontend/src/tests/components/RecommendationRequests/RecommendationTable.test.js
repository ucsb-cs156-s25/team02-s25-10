// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationTable from "main/components/RecommendationRequests/RecommendationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
const mockedNavigate = jest.fn();
jest.mock(stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), "react-router-dom"), stryMutAct_9fa48("1") ? () => undefined : (stryCov_9fa48("1"), () => stryMutAct_9fa48("2") ? {} : (stryCov_9fa48("2"), {
  ...jest.requireActual(stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), "react-router-dom")),
  useNavigate: stryMutAct_9fa48("4") ? () => undefined : (stryCov_9fa48("4"), () => mockedNavigate)
})));
describe(stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), "RecommendationTable tests"), () => {
  if (stryMutAct_9fa48("6")) {
    {}
  } else {
    stryCov_9fa48("6");
    const queryClient = new QueryClient();
    const expectedHeaders = stryMutAct_9fa48("7") ? [] : (stryCov_9fa48("7"), [stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), "id"), stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), "Requester Email"), stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), "Professor Email"), stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), "Explanation"), stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), "Date Requested"), stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), "Date Needed"), stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), "Done")]);
    const expectedFields = stryMutAct_9fa48("15") ? [] : (stryCov_9fa48("15"), [stryMutAct_9fa48("16") ? "" : (stryCov_9fa48("16"), "id"), stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), "requesterEmail"), stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), "professorEmail"), stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), "explanation"), stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), "dateRequested"), stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), "dateNeeded"), stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), "done")]);
    const testId = stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), "RecommendationTable");
    test(stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), "renders empty table correctly"), () => {
      if (stryMutAct_9fa48("25")) {
        {}
      } else {
        stryCov_9fa48("25");
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(<QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationTable recommendationRequests={stryMutAct_9fa48("26") ? ["Stryker was here"] : (stryCov_9fa48("26"), [])} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>);

        // assert
        expectedHeaders.forEach(headerText => {
          if (stryMutAct_9fa48("27")) {
            {}
          } else {
            stryCov_9fa48("27");
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          }
        });
        expectedFields.forEach(field => {
          if (stryMutAct_9fa48("28")) {
            {}
          } else {
            stryCov_9fa48("28");
            const fieldElement = screen.queryByTestId(stryMutAct_9fa48("29") ? `` : (stryCov_9fa48("29"), `${testId}-cell-row-0-col-${field}`));
            expect(fieldElement).not.toBeInTheDocument();
          }
        });
      }
    });
    test(stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), "Has the expected column headers, content and buttons for admin user"), () => {
      if (stryMutAct_9fa48("31")) {
        {}
      } else {
        stryCov_9fa48("31");
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(<QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationTable recommendationRequests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>);

        // assert
        expectedHeaders.forEach(headerText => {
          if (stryMutAct_9fa48("32")) {
            {}
          } else {
            stryCov_9fa48("32");
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          }
        });
        expectedFields.forEach(field => {
          if (stryMutAct_9fa48("33")) {
            {}
          } else {
            stryCov_9fa48("33");
            const header = screen.getByTestId(stryMutAct_9fa48("34") ? `` : (stryCov_9fa48("34"), `${testId}-cell-row-0-col-${field}`));
            expect(header).toBeInTheDocument();
          }
        });
        expect(screen.getByTestId(stryMutAct_9fa48("35") ? `` : (stryCov_9fa48("35"), `${testId}-cell-row-0-col-id`))).toHaveTextContent(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), "1"));
        expect(screen.getByTestId(stryMutAct_9fa48("37") ? `` : (stryCov_9fa48("37"), `${testId}-cell-row-0-col-requesterEmail`))).toHaveTextContent(stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), "test_email"));
        expect(screen.getByTestId(stryMutAct_9fa48("39") ? `` : (stryCov_9fa48("39"), `${testId}-cell-row-1-col-id`))).toHaveTextContent(stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), "2"));
        expect(screen.getByTestId(stryMutAct_9fa48("41") ? `` : (stryCov_9fa48("41"), `${testId}-cell-row-1-col-requesterEmail`))).toHaveTextContent(stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), "another_email"));
        const editButton = screen.getByTestId(stryMutAct_9fa48("43") ? `` : (stryCov_9fa48("43"), `${testId}-cell-row-0-col-Edit-button`));
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass(stryMutAct_9fa48("44") ? "" : (stryCov_9fa48("44"), "btn-primary"));
        const deleteButton = screen.getByTestId(stryMutAct_9fa48("45") ? `` : (stryCov_9fa48("45"), `${testId}-cell-row-0-col-Delete-button`));
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass(stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), "btn-danger"));
      }
    });
    test(stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), "Has the expected column headers, content for ordinary user"), () => {
      if (stryMutAct_9fa48("48")) {
        {}
      } else {
        stryCov_9fa48("48");
        // arrange
        const currentUser = currentUserFixtures.userOnly;

        // act
        render(<QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationTable recommendationRequests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>);

        // assert
        expectedHeaders.forEach(headerText => {
          if (stryMutAct_9fa48("49")) {
            {}
          } else {
            stryCov_9fa48("49");
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          }
        });
        expectedFields.forEach(field => {
          if (stryMutAct_9fa48("50")) {
            {}
          } else {
            stryCov_9fa48("50");
            const header = screen.getByTestId(stryMutAct_9fa48("51") ? `` : (stryCov_9fa48("51"), `${testId}-cell-row-0-col-${field}`));
            expect(header).toBeInTheDocument();
          }
        });
        expect(screen.getByTestId(stryMutAct_9fa48("52") ? `` : (stryCov_9fa48("52"), `${testId}-cell-row-0-col-id`))).toHaveTextContent(stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "1"));
        expect(screen.getByTestId(stryMutAct_9fa48("54") ? `` : (stryCov_9fa48("54"), `${testId}-cell-row-0-col-requesterEmail`))).toHaveTextContent(stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), "test_email"));
        expect(screen.getByTestId(stryMutAct_9fa48("56") ? `` : (stryCov_9fa48("56"), `${testId}-cell-row-1-col-id`))).toHaveTextContent(stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "2"));
        expect(screen.getByTestId(stryMutAct_9fa48("58") ? `` : (stryCov_9fa48("58"), `${testId}-cell-row-1-col-requesterEmail`))).toHaveTextContent(stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), "another_email"));
        expect(screen.queryByText(stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), "Delete"))).not.toBeInTheDocument();
        expect(screen.queryByText(stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), "Edit"))).not.toBeInTheDocument();
      }
    });
    test(stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), "Edit button navigates to the edit page"), async () => {
      if (stryMutAct_9fa48("63")) {
        {}
      } else {
        stryCov_9fa48("63");
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(<QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationTable recommendationRequests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>);

        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(stryMutAct_9fa48("64") ? `` : (stryCov_9fa48("64"), `${testId}-cell-row-0-col-id`))).toHaveTextContent(stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), "1"));
        const editButton = screen.getByTestId(stryMutAct_9fa48("66") ? `` : (stryCov_9fa48("66"), `${testId}-cell-row-0-col-Edit-button`));
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(stryMutAct_9fa48("67") ? () => undefined : (stryCov_9fa48("67"), () => expect(mockedNavigate).toHaveBeenCalledWith(stryMutAct_9fa48("68") ? "" : (stryCov_9fa48("68"), "/recommendationrequests/edit/1"))));
      }
    });
    test(stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "Delete button calls delete callback"), async () => {
      if (stryMutAct_9fa48("70")) {
        {}
      } else {
        stryCov_9fa48("70");
        // arrange
        const currentUser = currentUserFixtures.adminUser;
        const axiosMock = new AxiosMockAdapter(axios);
        axiosMock.onDelete(stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), "/api/recommendationrequests")).reply(200, stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
          message: stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), "Recommendation Request deleted")
        }));

        // act - render the component
        render(<QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationTable recommendationRequests={recommendationRequestFixtures.threeRequests} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>);

        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(stryMutAct_9fa48("74") ? `` : (stryCov_9fa48("74"), `${testId}-cell-row-0-col-id`))).toHaveTextContent(stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), "1"));
        const deleteButton = screen.getByTestId(stryMutAct_9fa48("76") ? `` : (stryCov_9fa48("76"), `${testId}-cell-row-0-col-Delete-button`));
        expect(deleteButton).toBeInTheDocument();

        // act - click the delete button
        fireEvent.click(deleteButton);

        // assert - check that the delete endpoint was called

        await waitFor(stryMutAct_9fa48("77") ? () => undefined : (stryCov_9fa48("77"), () => expect(axiosMock.history.delete.length).toBe(1)));
        expect(axiosMock.history.delete[0].params).toEqual(stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
          id: 1
        }));
      }
    });
  }
});
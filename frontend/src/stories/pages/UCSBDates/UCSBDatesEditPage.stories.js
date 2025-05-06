import React from "react";
import { apiCurrentUserFixtures } from "main/fixtures/currentUserFixtures";
import { systemInfoFixtures } from "main/fixtures/systemInfoFixtures";
import { ucsbDatesFixtures } from "main/fixtures/ucsbDatesFixtures";
import { http, HttpResponse } from "msw";

import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

export default {
  title: "pages/UCSBDates/UCSBDatesEditPage",
  component: UCSBDatesEditPage,
};

const Template = () => <UCSBDatesEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/ucsbdates", () => {
      return HttpResponse.json(ucsbDatesFixtures.threeDates[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsbdates", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};

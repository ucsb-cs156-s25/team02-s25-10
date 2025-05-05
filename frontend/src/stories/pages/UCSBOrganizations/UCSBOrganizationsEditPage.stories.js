import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationsEditPage",
  component: UCSBOrganizationsEditPage,
};

const Template = () => <UCSBOrganizationsEditPage storybook={true} />;

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
    http.get("/api/ucsborganizations", () => {
      return HttpResponse.json(ucsbOrganizationFixtures.threeOrganization, {
        status: 200,
      });
    }),
    http.put("/api/ucsborganizations", () => {
      return HttpResponse.json(
        {
          id: 17,
          orgCode: "SKY",
          orgTranslationShort: "skydive",
          orgTranslation: "skydiving",
          inactive: true,
        },
        { status: 200 },
      );
    }),
  ],
};

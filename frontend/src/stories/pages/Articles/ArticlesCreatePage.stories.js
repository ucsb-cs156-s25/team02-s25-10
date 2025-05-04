import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBArticlesCreatePage from "main/pages/UCSBArticles/UCSBArticlesCreatePage";

export default {
  title: "pages/UCSBArticles/UCSBArticlesCreatePage",
  component: UCSBArticlesCreatePage,
};

const Template = () => <UCSBArticlesCreatePage storybook={true} />;

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
    http.post("/api/ucsbarticles/post", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};

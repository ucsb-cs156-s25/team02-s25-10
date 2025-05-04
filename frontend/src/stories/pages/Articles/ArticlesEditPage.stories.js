import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { http, HttpResponse } from "msw";

import UCSBArticlesEditPage from "main/pages/UCSBArticles/UCSBArticlesEditPage";

export default {
  title: "pages/UCSBArticles/UCSBArticlesEditPage",
  component: UCSBArticlesEditPage,
};

const Template = () => <UCSBArticlesEditPage storybook={true} />;

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
    http.get("/api/ucsbarticles", () => {
      return HttpResponse.json(articlesFixtures.threeArticles[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsbarticles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};

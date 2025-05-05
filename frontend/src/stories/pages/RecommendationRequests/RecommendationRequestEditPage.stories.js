import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

export default {
  title: "pages/RecommendationRequests/RecommendationRequestEditPage",
  component: RecommendationRequestEditPage,
};

const Template = () => <RecommendationRequestEditPage storybook={true} />;

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
    http.get("/api/recommendationrequests", () => {
      return HttpResponse.json(recommendationRequestFixtures.threeRequests, {
        status: 200,
      });
    }),
    http.put("/api/recommendationrequests", () => {
      return HttpResponse.json(recommendationRequestFixtures.oneRequest, {
        status: 200,
      });
    }),
    http.put("/api/recommendationrequests", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json(recommendationRequestFixtures.oneRequest, {
        status: 200,
      });
    }),
  ],
};

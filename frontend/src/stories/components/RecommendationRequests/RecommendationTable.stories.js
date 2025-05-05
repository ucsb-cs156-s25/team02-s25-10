import React from "react";
import RecommendationTable from "main/components/RecommendationRequests/RecommendationTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/RecommendationRequests/RecommendationTable",
  component: RecommendationTable,
};

const Template = (args) => {
  return <RecommendationTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  recommendationRequests: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  recommendationRequests: recommendationRequestFixtures.threeRequests,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  recommendationRequests: recommendationRequestFixtures.threeRequests,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/recommendationrequests", () => {
      return HttpResponse.json(
        { message: "Recommendation Request deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

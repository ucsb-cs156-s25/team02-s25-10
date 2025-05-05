import React from "react";
import ReviewTable from "main/components/MenuItemReviews/ReviewTable";
import { reviewFixtures } from "fixtures/reviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReviews/ReviewTable",
  component: ReviewTable,
};

const Template = (args) => {
  return <ReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  reviews: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  reviews: reviewFixtures.threeReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  reviews: reviewFixtures.threeReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuitemreviews", () => {
      return HttpResponse.json(
        { message: "Review deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

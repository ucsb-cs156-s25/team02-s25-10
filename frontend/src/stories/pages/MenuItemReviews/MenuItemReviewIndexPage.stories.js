import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { reviewFixtures } from "fixtures/reviewFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewIndexPage from "main/pages/MenuItemReviews/MenuItemReviewIndexPage";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewIndexPage",
  component: MenuItemReviewIndexPage,
};

const Template = () => <MenuItemReviewIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
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
    http.get("/api/menuitemreviews/all", () => {
      return HttpResponse.json([], { status: 200 });
    }),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/menuitemreviews/all", () => {
      return HttpResponse.json(reviewFixtures.threeReviews);
    }),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/menuitemreviews/all", () => {
      return HttpResponse.json(reviewFixtures.threeReviews);
    }),
    http.delete("/api/menuitemreviews", () => {
      return HttpResponse.json(
        { message: "Review deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

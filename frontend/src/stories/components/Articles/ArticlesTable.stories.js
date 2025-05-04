import React from "react";
import UCSBArticlesTable from "main/components/UCSBArticles/UCSBArticlesTable";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBArticles/UCSBArticlesTable",
  component: UCSBArticlesTable,
};

const Template = (args) => {
  return <UCSBArticlesTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  articles: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});
ThreeItemsOrdinaryUser.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  articles: articlesFixtures.threeArticles,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbarticles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};

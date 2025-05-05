import React from "react";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/UCSBDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemTable",
  component: UCSBDiningCommonsMenuItemsTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  ucsbDiningCommonsMenuItems: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  ucsbDiningCommonsMenuItems:
    ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItem,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  ucsbDiningCommonsMenuItems:
    ucsbDiningCommonsMenuItemFixtures.threeUcsbDiningCommonsMenuItem,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitem", () => {
      return HttpResponse.json(
        { message: "UCSBDiningCommonsMenuItem deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

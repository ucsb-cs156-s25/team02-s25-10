import React from "react";
import ReviewForm from "main/components/MenuItemReviews/ReviewForm";
import { reviewFixtures } from "fixtures/reviewFixtures";

export default {
  title: "components/MenuItemReviews/ReviewForm",
  component: ReviewForm,
};

const Template = (args) => {
  return <ReviewForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: reviewFixtures.oneRestaurant,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

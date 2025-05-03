import React from "react";
import RecommendationForm from "main/components/RecommendationRequests/RecommendationForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

export default {
  title: "components/RecommendationRequests/RecommendationForm",
  component: RecommendationForm,
};

const Template = (args) => {
  return <RecommendationForm {...args} />;
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
  initialContents: recommendationRequestFixtures.oneRequest,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

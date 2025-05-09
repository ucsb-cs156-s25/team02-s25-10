import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/recommendationRequestUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export function renderBooleanCell({ value }) {
  switch (value) {
    case true:
      return "Yes";
    case false:
      return "No";
    default:
      return "N/A";
  }
}

export default function RecommendationTable({
  recommendationRequests,
  currentUser,
  testIdPrefix = "RecommendationTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/recommendationrequests/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/recommendationrequests/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },

    {
      Header: "Requester Email",
      accessor: "requesterEmail",
    },
    {
      Header: "Professor Email",
      accessor: "professorEmail",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Date Requested",
      accessor: "dateRequested",
    },
    {
      Header: "Date Needed",
      accessor: "dateNeeded",
    },
    {
      Header: "Done",
      accessor: "done",
      Cell: renderBooleanCell,
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable
      data={recommendationRequests}
      columns={columns}
      testid={testIdPrefix}
    />
  );
}

import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBArticlesTable from "main/components/UCSBArticles/UCSBArticlesTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function UCSBArticlesIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsbarticles/create"
          style={{ float: "right" }}
        >
          Create UCSB Article
        </Button>
      );
    }
  };

  const {
    data: articles,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbarticles/all"],
    { method: "GET", url: "/api/ucsbarticles/all" },
    []
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSB Articles</h1>
        <UCSBArticlesTable articles={articles} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}

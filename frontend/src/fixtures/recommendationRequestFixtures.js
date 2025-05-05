const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "test_email",
    professorEmail: "professor_email",
    explanation: "test",
    dateRequested: "2025-01-01T12:00:00",
    dateNeeded: "2025-05-01T12:00:00",
    done: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "test_email",
      professorEmail: "professor_email",
      explanation: "test",
      dateRequested: "2025-01-01T12:00:00",
      dateNeeded: "2025-05-01T12:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "another_email",
      professorEmail: "professor_email_two",
      explanation: "grad school",
      dateRequested: "2023-01-01T12:00:00",
      dateNeeded: "2025-06-01T12:00:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "fake_email",
      professorEmail: "fake_professor_email",
      explanation: "fake request",
      dateRequested: "2022-01-01T12:00:00",
      dateNeeded: "2030-03-15T12:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };

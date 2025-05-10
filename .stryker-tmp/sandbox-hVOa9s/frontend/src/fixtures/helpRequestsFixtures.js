// @ts-nocheck
const helpRequestsFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "linghe@ucsb.edu",
    teamId: "10",
    tableOrBreakoutRoom: "10",
    requestTime: "2025-05-02T14:30:00Z",
    explanation: "Having trouble merging Git branches",
    solved: false,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "linghe@ucsb.edu",
      teamId: "10",
      tableOrBreakoutRoom: "10",
      requestTime: "2025-05-02T14:30:00Z",
      explanation: "Having trouble merging Git branches",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "milad2@ucsb.edu",
      teamId: "10",
      tableOrBreakoutRoom: "10",
      requestTime: "2025-05-01T14:30:00Z",
      explanation: "Having trouble with Team02 accessing board",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "andrewy243@ucsb.edu",
      teamId: "10",
      tableOrBreakoutRoom: "8",
      requestTime: "2025-04-28T14:30:00Z",
      explanation: "Having trouble with Team02 accessing board",
      solved: true,
    },
  ],
};

export { helpRequestsFixtures };

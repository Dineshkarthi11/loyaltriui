const approvalFlowTypes = [
  {
    typeId: 1,
    type: "Attendance Approval",
    templates: [
      {
        templateName: "UI Development Team Approvals",
        isActive: 1,
        type: "Attendance Approval",
        approvers: [
          {
            name: "Alice",
            imgurl: "https://randomuser.me/api/portraits/women/1.jpg",
          },
          {
            name: "Bob",
            imgurl: "",
            // imgurl: "https://randomuser.me/api/portraits/men/2.jpg",
          },
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/3.jpg",
          },
          {
            name: "Arjun",
            imgurl: "https://randomuser.me/api/portraits/men/3.jpg",
          },
          {
            name: "Abhi",
            imgurl: "https://randomuser.me/api/portraits/men/3.jpg",
          },
          {
            name: "Sundar",
            imgurl: "https://randomuser.me/api/portraits/men/3.jpg",
          },
        ],
      },
      {
        templateName: "UI Designers Team Approvals",
        isActive: 1,
        type: "Attendance Approval",
        approvers: [
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/4.jpg",
          },
          {
            name: "Eve",
            imgurl: "https://randomuser.me/api/portraits/women/5.jpg",
          },
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/6.jpg",
          },
        ],
      },
      {
        templateName: "QA Testing Team Approvals",
        isActive: 1,
        type: "Attendance Approval",
        approvers: [
          {
            name: "Grace",
            imgurl: "https://randomuser.me/api/portraits/women/7.jpg",
          },
          {
            name: "Heidi",
            imgurl: "https://randomuser.me/api/portraits/women/8.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/9.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 2,
    type: "Leave Approval",
    templates: [
      {
        templateName: "Annual Leave Requests",
        isActive: 1,
        type: "Leave Approval",
        approvers: [
          {
            name: "Alice",
            imgurl: "https://randomuser.me/api/portraits/women/10.jpg",
          },
          {
            name: "Bob",
            imgurl: "https://randomuser.me/api/portraits/men/11.jpg",
          },
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/12.jpg",
          },
        ],
      },
      {
        templateName: "Sick Leave Requests",
        status: "Inactive",
        type: "Leave Approval",
        approvers: [
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/13.jpg",
          },
          {
            name: "Eve",
            imgurl: "https://randomuser.me/api/portraits/women/14.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 3,
    type: "Punch Approval",
    templates: [
      {
        templateName: "Punch In/Out Approvals",
        isActive: 1,
        type: "Punch Approval",
        approvers: [
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/15.jpg",
          },
          {
            name: "Grace",
            imgurl: "https://randomuser.me/api/portraits/women/16.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 4,
    type: "Letter Request Approval",
    templates: [
      {
        templateName: "Recommendation Letter Requests",
        isActive: 1,
        type: "Letter Request Approval",
        approvers: [
          {
            name: "Heidi",
            imgurl: "https://randomuser.me/api/portraits/women/17.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/18.jpg",
          },
          {
            name: "Jack",
            imgurl: "https://randomuser.me/api/portraits/men/19.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 5,
    type: "WFH Approval",
    templates: [
      {
        templateName: "WFH Requests for Dev Team",
        isActive: 1,
        type: "WFH Approval",
        approvers: [
          {
            name: "Alice",
            imgurl: "https://randomuser.me/api/portraits/women/20.jpg",
          },
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/21.jpg",
          },
        ],
      },
      {
        templateName: "WFH Requests for QA Team",
        isActive: 1,
        type: "WFH Approval",
        approvers: [
          {
            name: "Grace",
            imgurl: "https://randomuser.me/api/portraits/women/22.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/23.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 6,
    type: "Asset Approval",
    templates: [
      {
        templateName: "Laptop Requests",
        isActive: 1,
        type: "Asset Approval",
        approvers: [
          {
            name: "Bob",
            imgurl: "https://randomuser.me/api/portraits/men/24.jpg",
          },
          {
            name: "Eve",
            imgurl: "https://randomuser.me/api/portraits/women/25.jpg",
          },
        ],
      },
      {
        templateName: "Software License Requests",
        status: "Inactive",
        type: "Asset Approval",
        approvers: [
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/26.jpg",
          },
          {
            name: "Heidi",
            imgurl: "https://randomuser.me/api/portraits/women/27.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 7,
    type: "Expense Approval",
    templates: [
      {
        templateName: "Travel Expense Requests",
        isActive: 1,
        type: "Expense Approval",
        approvers: [
          {
            name: "Alice",
            imgurl: "https://randomuser.me/api/portraits/women/28.jpg",
          },
          {
            name: "Grace",
            imgurl: "https://randomuser.me/api/portraits/women/29.jpg",
          },
        ],
      },
      {
        templateName: "Office Supplies Requests",
        status: "Inactive",
        type: "Expense Approval",
        approvers: [
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/30.jpg",
          },
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/31.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 8,
    type: "Loan Approval",
    templates: [
      {
        templateName: "Employee Loan Requests",
        isActive: 1,
        type: "Loan Approval",
        approvers: [
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/33.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 9,
    type: "Lorem ipsumdolar sit.",
    templates: [
      {
        templateName: "Employee Loan Requests",
        isActive: 1,
        type: "Lorem ipsumdolar sit.",
        approvers: [
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/33.jpg",
          },
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/30.jpg",
          },
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/31.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 10,
    type: "Lorem ipsumdolar sit.",
    templates: [
      {
        templateName: "Employee Loan Requests",
        isActive: 1,
        type: "Lorem ipsumdolar sit.",
        approvers: [
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/33.jpg",
          },
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/30.jpg",
          },
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/31.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 11,
    type: "Lorem ipsumdolar sit.",
    templates: [
      {
        templateName: "Employee Loan Requests",
        isActive: 1,
        type: "Lorem ipsumdolar sit.",
        approvers: [
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/33.jpg",
          },
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/30.jpg",
          },
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/31.jpg",
          },
        ],
      },
    ],
  },
  {
    typeId: 12,
    type: "Lorem ipsumdolar sit.",
    templates: [
      {
        templateName: "Employee Loan Requests",
        isActive: 1,
        type: "Lorem ipsumdolar sit.",
        approvers: [
          {
            name: "Charlie",
            imgurl: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Ivan",
            imgurl: "https://randomuser.me/api/portraits/men/33.jpg",
          },
          {
            name: "David",
            imgurl: "https://randomuser.me/api/portraits/men/30.jpg",
          },
          {
            name: "Frank",
            imgurl: "https://randomuser.me/api/portraits/men/31.jpg",
          },
        ],
      },
    ],
  },
];

export default approvalFlowTypes;

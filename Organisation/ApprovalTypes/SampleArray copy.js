const approvalFlowTypes = [
  {
    typeId: 1,
    type: "Attendance Approval",
    templates: [
      {
        templateName: "UI Development Team Approvals",
        isActive: 1,
        type: "Attendance Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/women/1.jpg",
          "https://randomuser.me/api/portraits/men/2.jpg",
          "https://randomuser.me/api/portraits/men/3.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb"],
      },
      {
        templateName: "UI Designers Team Approvals",
        isActive: 1,
        type: "Attendance Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/men/4.jpg",
          "https://randomuser.me/api/portraits/women/5.jpg",
          "https://randomuser.me/api/portraits/men/6.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb"],
      },
      {
        templateName: "QA Testing Team Approvals",
        isActive: 1,
        type: "Attendance Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/women/7.jpg",
          "https://randomuser.me/api/portraits/women/8.jpg",
          "https://randomuser.me/api/portraits/men/9.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/women/10.jpg",
          "https://randomuser.me/api/portraits/men/11.jpg",
          "https://randomuser.me/api/portraits/men/12.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb"],
      },
      {
        templateName: "Sick Leave Requests",
        status: "Inactive",
        type: "Leave Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/men/13.jpg",
          "https://randomuser.me/api/portraits/women/14.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/15.jpg",
          "https://randomuser.me/api/portraits/women/16.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/women/17.jpg",
          "https://randomuser.me/api/portraits/men/18.jpg",
          "https://randomuser.me/api/portraits/men/19.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/women/20.jpg",
          "https://randomuser.me/api/portraits/men/21.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
      },
      {
        templateName: "WFH Requests for QA Team",
        isActive: 1,
        type: "WFH Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/women/22.jpg",
          "https://randomuser.me/api/portraits/men/23.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/24.jpg",
          "https://randomuser.me/api/portraits/women/25.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
      },
      {
        templateName: "Software License Requests",
        status: "Inactive",
        type: "Asset Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/men/26.jpg",
          "https://randomuser.me/api/portraits/women/27.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/women/28.jpg",
          "https://randomuser.me/api/portraits/women/29.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
      },
      {
        templateName: "Office Supplies Requests",
        status: "Inactive",
        type: "Expense Approval",
        multiImage: [
          "https://randomuser.me/api/portraits/men/30.jpg",
          "https://randomuser.me/api/portraits/men/31.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/men/33.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/men/33.jpg",
          "https://randomuser.me/api/portraits/men/30.jpg",
          "https://randomuser.me/api/portraits/men/31.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb", "jkghjgh"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/men/33.jpg",
          "https://randomuser.me/api/portraits/men/30.jpg",
          "https://randomuser.me/api/portraits/men/31.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb", "jkghjgh"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/men/33.jpg",
          "https://randomuser.me/api/portraits/men/30.jpg",
          "https://randomuser.me/api/portraits/men/31.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb", "jkghjgh"],
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
        multiImage: [
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/men/33.jpg",
          "https://randomuser.me/api/portraits/men/30.jpg",
          "https://randomuser.me/api/portraits/men/31.jpg",
        ],
        name: ["dbdbdbd", "svsdfgvdf", "ihbihb", "jkghjgh"],
      },
    ],
  },
];

export default approvalFlowTypes;

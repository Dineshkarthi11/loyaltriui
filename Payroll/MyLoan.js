import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import ButtonClick from "../common/Button";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import MyLoanStatusViewPage from "./MyLoanStatusViewPage";
import Heading from "../common/Heading";
import localStorageData from "../common/Functions/localStorageKeyValues";
import NewLoanRequest from "./NewLoanRequest";
import Tabs from "../common/Tabs";

const MyLoan = () => {
  const { t } = useTranslation();

  const [navigationPath, setNavigationPath] = useState("pending");
  const [navigationValue, setNavigationValue] = useState("");
  const [openPop, setOpenPop] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [show, setShow] = useState(false);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [pendingEmployeeLoanList, setPendingEmployeeLoanList] = useState([]);
  const [approvedEmployeeLoanList, setApprovedEmployeeLoanList] = useState([]);
  const [rejectedEmployeeLoanList, setRejectedEmployeeLoanList] = useState([]);
  const [atPayrollEmployeeLoanList, setAtPayrollEmployeeLoanList] = useState(
    []
  );
  const [disbursedEmployeeLoanList, setDisbursedEmployeeLoanList] = useState(
    []
  );
  const [completedEmployeeLoanList, setCompletedEmployeeLoanList] = useState(
    []
  );
  const [view, setView] = useState(false);
  const [viewLoanId, setViewLoanId] = useState(null);
  const [employeeloanid, setEmployeeloanid] = useState("");
  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);
  const [pending, setPending] = useState();
  const [approval, setApproval] = useState();
  const [rejected, setRejected] = useState();
  const [atpayroll, setAtPayroll] = useState();
  const [disbursed, setDisbursed] = useState();
  const [completed, setCompleted] = useState();

  const tabs = [
    {
      id: 1,
      title: t("Pending"),
      value: "pending",
      navValue: "",
      count: pending,
    },
    {
      id: 2,
      title: t("Approved"),
      value: "approved",
      navValue: "",
      count: approval,
    },
    {
      id: 3,
      title: t("Rejected"),
      value: "rejected",
      navValue: "",
      count: rejected,
    },
    {
      id: 4,
      title: t("At_Payroll"),
      value: "at_payroll",
      navValue: "",
      count: atpayroll,
    },
    {
      id: 5,
      title: t("Disbursed"),
      value: "disbursed",
      navValue: "",
      count: disbursed,
    },
    {
      id: 6,
      title: t("Completed"),
      value: "completed",
      navValue: "",
      count: completed,
    },
  ];

  const header = [
    {
      pending: [
        // {
        //   id: 1,
        //   title: t("Name"),
        //   value: "employeeName",
        //   // flexColumn: true,
        //   // logo: true,
        //   // subvalue: "createdOn",
        // },
        {
          id: 2,
          title: t("Loan_Name"),
          value: "loanPolicyName",
        },
        {
          id: 3,
          title: t("Applied_Date"),
          value: "createdOn",
        },
        {
          id: 4,
          title: t("Amount"),
          value: "amount",
        },
        // {
        //   id: 5,
        //   title: t("Receipt"),
        //   value: "receipt",
        // },
        {
          id: 5,
          title: "",
          value: "action",
          dotsVertical: true,
          width: 50,
          dotsVerticalContent: [
            {
              title: "View Status",
              value: "status",
            },
          ],
        },
      ],
      approved: [
        // {
        //   id: 1,
        //   title: t("Name"),
        //   value: "employeeName",
        //   // flexColumn: true,
        //   // logo: true,
        //   // subvalue: "createdOn",
        // },
        {
          id: 2,
          title: t("Loan Policy"),
          value: "loanPolicyName",
        },
        {
          id: 3,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 4,
          title: t("Submission Date"),
          value: "createdOn",
        },
        {
          id: 5,
          title: t("Approvers"),
          value: "multiImage",
          multiImage: true,
          // view: true,
        },
        {
          id: 6,
          title: "",
          value: "action",
          dotsVertical: true,
          width: 50,
          dotsVerticalContent: [
            {
              title: "View Status",
              value: "status",
            },
          ],
        },
      ],
      rejected: [
        // {
        //   id: 1,
        //   title: t("Name"),
        //   value: "employeeName",
        //   // flexColumn: true,
        //   // logo: true,
        //   // subvalue: "createdOn",
        // },
        {
          id: 2,
          title: t("Loan Policy"),
          value: "loanPolicyName",
        },
        {
          id: 3,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 4,
          title: t("Submission Date"),
          value: "createdOn",
        },
        {
          id: 5,
          title: t("Rejected by"),
          value: "multiImage",
          multiImage: true,
        },
        {
          id: 5,
          title: "",
          value: "action",
          dotsVertical: true,
          width: 50,
          dotsVerticalContent: [
            {
              title: "View Status",
              value: "status",
            },
          ],
        },
      ],
      at_payroll: [
        // {
        //   id: 1,
        //   title: t("Name"),
        //   value: "name",
        //   flexColumn: true,
        //   logo: true,
        //   subvalue: "createdOn",
        // },
        {
          id: 2,
          title: t("Loan Policy"),
          value: "loanPolicyName",
        },
        {
          id: 3,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 4,
          title: t("Submission Date"),
          value: "createdOn",
        },

        // {
        //   id: 5,
        //   title: t("Rejected By"),
        //   value: "multiImage",
        //   multiImage: true,
        // },
        // {
        //   id: 6,
        //   value: "action",
        //   title: t("Action"),
        //   dotsVertical: true,
        //   dotsVerticalContent: [

        //     {
        //       title: "View Status",
        //       value: "status",
        //     },
        //   ],
        // },
        // {
        //   id: 6,
        //   title: t("Action"),
        //   value: "action",
        //   actionButton: true,
        //   buttonName: "Add to payroll table",
        //   dotsVerticalContent: [
        //     {
        //       title: "Reject",
        //       icon: <TbAlertHexagon />,
        //       value: "reject",
        //     },
        //     {
        //       title: "Move to Pending",
        //       value: "moveToPending",
        //     },
        //   ],
        // },
      ],
      disbursed: [
        // {
        //   id: 1,
        //   title: t("Name"),
        //   value: "name",
        //   flexColumn: true,
        //   logo: true,
        //   subvalue: "createdOn",
        // },
        {
          id: 2,
          title: t("Loan Policy"),
          value: "loanPolicyName",
        },
        {
          id: 3,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 4,
          title: t("Submission Date"),
          value: "createdOn",
        },

        // {
        //   id: 4,
        //   title: t("Submission Date"),
        //   value: "submissionDate",
        // },
        // {
        //   id: 5,
        //   title: t("Approvers"),
        //   value: "approvers",
        //   imageOnly: true,
        //   imageTooltip: true,
        // },
        // {
        //   id: 6,
        //   title: t("Action"),
        //   value: "action",
        //   actionButton: true,
        //   buttonName: "Add to payroll table",
        //   dotsVerticalContent: [
        //     {
        //       title: "Reject",
        //       icon: <TbAlertHexagon />,
        //       value: "reject",
        //     },
        //     {
        //       title: "Move to Pending",
        //       value: "moveToPending",
        //     },
        //   ],
        // },
      ],
      completed: [
        // {
        //   id: 1,
        //   title: t("Name"),
        //   value: "name",
        //   flexColumn: true,
        //   logo: true,
        //   subvalue: "createdOn",
        // },
        {
          id: 2,
          title: t("Loan Policy"),
          value: "loanPolicyName",
        },
        {
          id: 3,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 4,
          title: t("Submission Date"),
          value: "createdOn",
        },

        // {
        //   id: 4,
        //   title: t("Submission Date"),
        //   value: "submissionDate",
        // },
        // {
        //   id: 5,
        //   title: t("Approvers"),
        //   value: "approvers",
        //   imageOnly: true,
        //   imageTooltip: true,
        // },
        // {
        //   id: 6,
        //   title: t("Action"),
        //   value: "action",
        //   actionButton: true,
        //   buttonName: "Add to payroll table",
        //   dotsVerticalContent: [
        //     {
        //       title: "Reject",
        //       icon: <TbAlertHexagon />,
        //       value: "reject",
        //     },
        //     {
        //       title: "Move to Pending",
        //       value: "moveToPending",
        //     },
        //   ],
        // },
      ],
    },
  ];

  const actionData = [
    {
      pending: { id: 1, data: pendingEmployeeLoanList },
      approved: { id: 2, data: approvedEmployeeLoanList },
      rejected: { id: 2, data: rejectedEmployeeLoanList },
      at_payroll: { id: 2, data: atPayrollEmployeeLoanList },
      disbursed: { id: 2, data: disbursedEmployeeLoanList },
      completed: { id: 2, data: completedEmployeeLoanList },
    },
  ];
  const actionId = [
    {
      pending: { id: "employeeLoanId" },
      approved: { id: "employeeLoanId" },
      rejected: { id: "employeeLoanId" },
      at_payroll: { id: "employeeLoanId" },
      disbursed: { id: "employeeLoanId" },
      completed: { id: "employeeLoanId" },
    },
  ];

  const getPendingEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          requestStatus: 0,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      const newResult = result?.result?.data?.map((item) => ({
        ...item,
        amount: Number(item.amount).toFixed(2),
      }));
      setPendingEmployeeLoanList(newResult);
      setPending(result?.result?.totalCount);
      setEmployeeloanid(result.result[0]?.employeeLoanId);
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching pending employee loan list:", error);
    }
  };

  const getApprovedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          requestStatus: 1,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      if (result.status === 200) {
        console.log(result);
        setApproval(result.result.totalCount);
        setApprovedEmployeeLoanList(
          result?.result?.data?.map((each) => ({
            ...each,
            isAddToPayrollTableNeeded: 1,
            multiImage: each.approvers?.map(
              (approver) => approver.profilePicture
            ),
            name: each.approvers?.map((approver) => approver.employeeName),
            amount: Number(each.amount).toFixed(2),
          }))
        );
      }
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching approved employee loan list:", error);
    }
  };

  const getRejectedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          requestStatus: 2,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setRejectedEmployeeLoanList(result.result);
      if (result.status === 200) {
        console.log(result);
        setRejected(result.result.totalCount);
        setRejectedEmployeeLoanList(
          result?.result?.data?.map((each) => ({
            ...each,
            multiImage: each.approvers?.map(
              (approver) => approver.profilePicture
            ),
            name: each.approvers?.map((approver) => approver.employeeName),
          }))
        );
      }
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching rejected employee loan list:", error);
    }
  };

  const getAtPayrollEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          requestStatus: 3,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setAtPayroll(result.result.totalCount);
      setAtPayrollEmployeeLoanList(result?.result?.data);
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching at payroll employee loan list:", error);
    }
  };

  const getDisbursedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          requestStatus: 4,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setDisbursed(result.result.totalCount);
      setDisbursedEmployeeLoanList(result?.result?.data);
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching disbursed employee loan list:", error);
    }
  };

  const getCompletedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          requestStatus: 5,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setCompleted(result.result.totalCount);
      setCompletedEmployeeLoanList(result?.result?.data);
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching completed employee loan list:", error);
    }
  };

  useEffect(() => {
    console.log(navigationPath);
    switch (navigationPath) {
      default:
        getPendingEmployeeLoanList();
        getApprovedEmployeeLoanList();
        getRejectedEmployeeLoanList();
        getDisbursedEmployeeLoanList();
        getCompletedEmployeeLoanList();
        getAtPayrollEmployeeLoanList();
        break;
      case "approved":
        getApprovedEmployeeLoanList();
        break;
      case "rejected":
        getRejectedEmployeeLoanList();
        break;
      case "at_payroll":
        getAtPayrollEmployeeLoanList();
        break;
      case "disbursed":
        getDisbursedEmployeeLoanList();
        break;
      case "completed":
        getCompletedEmployeeLoanList();
        break;
    }
  }, [navigationPath, companyId]);
  useEffect(() => {
    // updateCompany()
  }, [navigationPath]);

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        {/* <div>
          <p className="font-bold text-lg">Employee Loan</p>
          <p className="para">{t("Main_dsc_work")}</p>
        </div> */}
        <Heading
          title={t("My Loan")}
          description={t(
            "My Loan helps to manage employee personal loan requests."
          )}
        />

        <div className="flex flex-col gap-6 xs:flex-row">
          <ButtonClick
            BtnType="add"
            buttonName="Submit a new loan request"
            handleSubmit={() => {
              setOpenPop("newLoanRequest");
              setShow(true);
            }}
          ></ButtonClick>
        </div>
      </div>
      <Tabs
        count={true}
        tabs={tabs}
        // data={companyList}
        header={header}
        tabClick={(e) => {
          console.log(e, "e");
          setNavigationPath(e);
        }}
        tabChange={(e) => {
          setNavigationValue(e);
        }}
        data={
          Object.keys(actionData[0]).includes(navigationPath)
            ? actionData[0]?.[navigationPath].data
            : null
        }
        // actionToggle={true}
        actionID={
          Object.keys(actionId[0]).includes(navigationPath)
            ? actionId[0]?.[navigationPath].id
            : null
        }
        path={navigationPath}
        // companyList={false}
        buttonClick={(e, company) => {
          // console.log(company, "company", e);
          if (e === true) {
            // setShow(e);
          } else if (e === navigationPath) {
            // setShow(true);
            console.log(company, "companyId");
            // setCompanyId(company);
            setOpenPop(e);
            // setUpdateId(false);
          } else {
            setOpenPop(navigationPath);

            // setShow(true);
            // console.log(company, "companyparentId");
            // if (company === "edit") {
            // setUpdateId(e);
            // }
          }
        }}
        clickDrawer={(e, i, value, details) => {
          // handleShow();
          console.log(e, i);
          // setShow(e);
          if (i === "status") {
            setViewLoanId(details.employeeLoanId);
            setView(true);
          }
        }}
        navigationClick={(e) => {
          setNavigationPath(e);
        }}
      />
      {openPop === "newLoanRequest" && show && (
        <NewLoanRequest
          open={show}
          employeeLoanId={employeeloanid}
          close={(e) => {
            setShow(e);
            getPendingEmployeeLoanList();
          }}
          // updateId={updateId}
          // companyDataId={companyId}
          refresh={() => {
            getPendingEmployeeLoanList();
          }}
          navigationValue={navigationValue}
        />
      )}

      {view && (
        <MyLoanStatusViewPage
          open={true}
          employeeLoanId={viewLoanId}
          close={() => {
            setView(false);
            setViewLoanId(null);
          }}
        />
      )}
    </div>
  );
};
export default MyLoan;

import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import Tabs from "../common/Tabs";
import NewLoanRequest from "./NewLoanRequest";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import EmployeeLoanViewPage from "./EmployeeLoanViewPage";
import Heading from "../common/Heading";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

const EmployeeLoan = ({ refresh = () => {} }) => {
  const { t } = useTranslation();

  const [navigationPath, setNavigationPath] = useState("pending");
  const [navigationValue, setNavigationValue] = useState("Pending");
  const [openPop, setOpenPop] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [show, setShow] = useState(false);
  // List Data
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
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState(false);
  const [view, setView] = useState(false);

  const [viewLoanId, setViewLoanId] = useState(null);
  const [pending, setPending] = useState();
  const [approval, setApproval] = useState();
  const [rejected, setRejected] = useState();
  const [atpayroll, setAtPayroll] = useState();
  const [disbursed, setDisbursed] = useState();
  const [completed, setCompleted] = useState();

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
    setLoggedEmployeeId(localStorageData.employeeId);
  }, []);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

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
        {
          id: 1,
          title: t("Name"),
          value: "employeeName",
          // flexColumn: true,
          // logo: true,
          // subvalue: "createdOn",
        },
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
          title: "Action",
          value: "action",
          dotsVertical: true,
          dotsVerticalContent: [
            {
              title: "Approve",
              value: "approve",
            },
            {
              title: "Reject",
              value: "reject",
            },
            {
              title: "View",
              value: "view",
            },
          ],
        },
      ],
      approved: [
        {
          id: 1,
          title: t("Name"),
          value: ["employeeName"],

          // flexColumn: true,
          // logo: true,
          // subvalue: "createdOn",
        },
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
          title: t("Action"),
          value: "isAddToPayrollTableNeeded",
          buttonName: "Add To PayrollTable",
          Regularize: true,
        },
        {
          id: 7,
          value: "action",
          dotsVertical: true,
          dotsVerticalContent: [
            {
              title: "Reject",
              value: "reject",
            },
            {
              title: "View",
              value: "view",
            },
          ],
        },
      ],
      rejected: [
        {
          id: 1,
          title: t("Name"),
          value: "employeeName",
          // flexColumn: true,
          // logo: true,
          // subvalue: "createdOn",
        },
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
          title: t("Rejected By"),
          value: "multiImage",
          multiImage: true,
        },
        {
          id: 6,
          value: "action",
          title: t("Action"),
          dotsVertical: true,
          dotsVerticalContent: [
            {
              title: "View",
              value: "view",
            },
          ],
        },
      ],
      at_payroll: [
        {
          id: 1,
          title: t("Name"),
          value: "employeeName",
          // flexColumn: true,
          // logo: true,
          // subvalue: "createdOn",
        },
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
          id: 1,
          title: t("Name"),
          value: "employeeName",
          // flexColumn: true,
          // logo: true,
          // subvalue: "createdOn",
        },
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
          id: 1,
          title: t("Name"),
          value: "employeeName",
          // flexColumn: true,
          // logo: true,
          // subvalue: "createdOn",
        },
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
        PAYROLLAPI.GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST,
        {
          companyId: companyId,
          requestStatus: 0,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setPendingEmployeeLoanList(
        result?.result?.data?.map((item) => ({
          ...item,
          amount: Number(item.amount).toFixed(2),
        }))
      );
      setPending(result.result.totalCount);
      console.log(result.result.data, "result dataa");
    } catch (error) {
      console.error("Error fetching pending employee loan list:", error);
    }
  };

  const getApprovedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST,
        {
          companyId: companyId,
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
        PAYROLLAPI.GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST,
        {
          companyId: companyId,
          requestStatus: 2,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setRejected(result.result.totalCount);
      setRejectedEmployeeLoanList(result.result.data);
      if (result.status === 200) {
        console.log(result);
        setRejectedEmployeeLoanList(
          result?.result?.data?.map((each) => ({
            ...each,
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
      console.error("Error fetching rejected employee loan list:", error);
    }
  };

  const getAtPayrollEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST,
        {
          companyId: companyId,
          requestStatus: 3,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setAtPayrollEmployeeLoanList(
        result?.result?.data?.map((item) => ({
          ...item,
          amount: Number(item.amount).toFixed(2),
        }))
      );
      setAtPayroll(result.result.totalCount);
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching at payroll employee loan list:", error);
    }
  };

  const getDisbursedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST,
        {
          companyId: companyId,
          requestStatus: 4,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setDisbursedEmployeeLoanList(
        result?.result?.data?.map((item) => ({
          ...item,
          amount: Number(item.amount).toFixed(2),
        }))
      );
      setDisbursed(result.result.totalCount);
      console.log(result.result, "result dataa");
    } catch (error) {
      console.error("Error fetching disbursed employee loan list:", error);
    }
  };

  const getCompletedEmployeeLoanList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST,
        {
          companyId: companyId,
          requestStatus: 5,
          loginEmployeeId: loggedEmployeeId,
        }
      );
      setCompleted(result.result.totalCount);
      setCompletedEmployeeLoanList(
        result?.result?.data?.map((item) => ({
          ...item,
          amount: Number(item.amount).toFixed(2),
        }))
      );
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
        getAtPayrollEmployeeLoanList();
        getDisbursedEmployeeLoanList();
        getCompletedEmployeeLoanList();
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

  const handleAction = async (actionStatus, details) => {
    const payload = {
      companyId: companyId,
      employeeLoanId: [details.employeeLoanId],
      actionEmployeeId: loggedEmployeeId,
      actionStatus: actionStatus,
      remarks: "",
      modifiedBy: loggedEmployeeId,
      ReccuringStartMonthYear: "",
    };

    try {
      const response = await Payrollaction(
        PAYROLLAPI.ACCEPT_OR_REJECT_EMPLOYEE_LOAN,
        payload
      );
      console.log(response, "API response");
      if (response.status === 200) {
        getPendingEmployeeLoanList();
        getApprovedEmployeeLoanList();
        getRejectedEmployeeLoanList();
        openNotification("success", "Successful", response.message, () => {
          setTimeout(() => {
            // setIsOpen(false);
            refresh(true);
          }, 1000);
        });
      } else if (response.status === 500) {
        openNotification("error", "Info", response.message);
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const addToPayrollTable = async (value) => {
    const employeeLoanId = value.employeeLoanId;
    const currentDate = new Date();
    const payrollMonthYear = `${currentDate.toLocaleString("default", {
      month: "long",
    })} ${currentDate.getFullYear()}`;

    const payload = {
      companyId,
      employeeLoanId,
      loggedEmployeeId,
      payrollMonthYear,
    };
    console.log(payload, "payload data");
    try {
      console.log("testt");
      const response = await Payrollaction(
        PAYROLLAPI.ADD_APPROVED_EMPLOYEE_LOAN_DETIALS_TO_PAYROLL_TABLE,
        payload
      );
      console.log(response, "API response");
      if (response.status === 200) {
        getPendingEmployeeLoanList();
        getApprovedEmployeeLoanList();
        getRejectedEmployeeLoanList();
        getAtPayrollEmployeeLoanList();
        getDisbursedEmployeeLoanList();
        getCompletedEmployeeLoanList();
        openNotification("success", "Successful", response.message, () => {
          setTimeout(() => {
            // setIsOpen(false);
            refresh(true);
          }, 1000);
        });
      } else {
        openNotification("error", "Info", response.message);
      }
    } catch (error) {
      console.error("Error adding to payroll table:", error);
    }
  };

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        {/* <div>
          <p className="font-bold text-lg">Employee Loan</p>
          <p className="para">{t("Main_dsc_work")}</p>
        </div> */}
        <Heading title="Employee Loan" description={t("Main_dsc_work")} />

        {/* <div className="flex flex-col gap-6 xs:flex-row">
          <ButtonClick
            BtnType="add"
            buttonName="Submit a new loan request"
            handleSubmit={() => {
              setOpenPop("newLoanRequest");
              setShow(true);
            }}
          ></ButtonClick>
        </div> */}
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
        buttonClick={(e, i, value, details) => {
          if (i === "approve") {
            handleAction(1, details);
            setApproved(e);
          } else if (i === "reject") {
            handleAction(2, details);
            setReject(true);
          } else if (i === "view") {
            setViewLoanId(details.employeeLoanId);
            setView(true);
          } else if (i === "Add To PayrollTable") {
            addToPayrollTable(details);
            console.log("testt");
          }
        }}
        clickDrawer={(e, i, value, details) => {
          // handleShow();
          console.log(e, i, value, details, "expeced data");
          if (i === "approve") {
            handleAction(1, details);
            setApproved(e);
          } else if (i === "reject") {
            handleAction(2, details);
            setReject(true);
          } else if (i === "view") {
            setViewLoanId(details.employeeLoanId);
            setView(true);
          } else if (details === "Add To PayrollTable") {
            addToPayrollTable(value);
            console.log(details.employeeLoanId, "testt");
          }
          // setShow(e);
        }}
        navigationClick={(e) => {
          // console.log(e);
          setNavigationPath(e);
          // handleClose();
        }}
        activeOrNot={(e) => {
          // console.log(e, "active check");
          // updateCompany();
          // setactive(e);
        }}
        // updateApi={
        //   Object.keys(updateApi[0]).includes(navigationPath)
        //     ? updateApi[0]?.[navigationPath].api
        //     : null
        // }
        // deleteApi={
        //   Object.keys(deleteApi[0]).includes(navigationPath)
        //     ? deleteApi[0]?.[navigationPath].api
        //     : null
        // }
        // referesh={() => {
        //   switch (navigationPath) {
        //     default:
        //       getPendingList();
        //       break;
        //     case "approved":
        //       getApprovedList();
        //       break;
        //   }
        // }}
      />

      {openPop === "newLoanRequest" && show && (
        <NewLoanRequest
          open={show}
          close={(e) => {
            setShow(e);
          }}
          // updateId={updateId}
          // companyDataId={companyId}
          // refresh={() => {
          //   getAssetsList();
          // }}
        />
      )}

      {view && (
        <EmployeeLoanViewPage
          open={view}
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

export default EmployeeLoan;

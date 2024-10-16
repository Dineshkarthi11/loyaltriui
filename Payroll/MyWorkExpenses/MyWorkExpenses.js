import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../common/Button";
import AddExpenceReimbursement from "./AddExpenceReimbursement";
import TableAnt from "../../common/TableAnt";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import {
  WorkExpenseHeader,
  WorkExpenseHeaderApproved,
  WorkExpenseHeaderRejected,
  WorkExpenseHeaderSettled,
} from "../../data";
import { Flex } from "antd";
import FlexCol from "../../common/FlexCol";
import ApprovedMyWorkExpense from "./ApprovedMyWorkExpense";
import RejectedMyWorkExpense from "./RejectedMyWorkExpense";
import TabsNew from "../../common/TabsNew";
import Heading from "../../common/Heading";
import config from "../../../config";
import { FaFile } from "react-icons/fa";
import localStorageData from "../../common/Functions/localStorageKeyValues";

const MyWorkExpenses = () => {
  const { t } = useTranslation();

  const [navigationPath, setNavigationPath] = useState("pending_Request");
  const [navigationValue, setNavigationValue] = useState("Addition");
  const [openPop, setOpenPop] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [show, setShow] = useState(false);
  // List Data
  const [IncompleteList, setIncompleteList] = useState([]);
  const [pendingRequestList, setPendingRequestList] = useState();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [employeeRequestedList, setEmployeeRequestedList] = useState([]);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState(false);
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState();
  const [approvedDetails, setApprovedDetails] = useState();
  const [employeeRequestedListApproved, setEmployeeRequestedListApproved] =
    useState([]);
  const [employeeRequestedListRejected, setEmployeeRequestedListRejected] =
    useState([]);
  const [employeeRequestedListSettled, setEmployeeRequestedListSettled] =
    useState([]);

  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [settledCount, setSettledCount] = useState(0);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );

  const handleShow = (popupType) => {
    setShow(true);
    setOpenPop(popupType);
  };

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  const tabs = [
    // {
    //   id: 1,
    //   title: t("Incomplete"),
    //   value: "incomplete",
    //   navValue: "Incomplete",
    // },

    {
      id: 2,
      title: t("Pending_Request"),
      value: "pending_Request",
      navValue: "Pending Request",
      count: pendingRequestCount,
    },

    {
      id: 3,
      title: t("Approved"),
      value: "approved",
      navValue: "Approved",
      count: approvedCount,
    },

    {
      id: 4,
      title: t("Rejected"),
      value: "rejected",
      navValue: "Rejected",
      count: rejectedCount,
    },

    {
      id: 5,
      title: t("Settled"),
      value: "settled",
      navValue: "Settled",
      count: settledCount,
    },
  ];

  const header = [
    {
      incomplete: [
        {
          id: 1,
          title: t("CATEGORY_NAME"),
          value: "categoryName",
        },
        {
          id: 2,
          title: t("DATE_OF_SPEND"),
          value: "dateOfSpend",
        },
        {
          id: 3,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 4,
          title: t("CREATED_ON"),
          value: "createdOn",
        },
        {
          id: 5,
          title: t("RECEIPT"),
          value: "receipt",
        },
        {
          id: 6,
          title: t("Action"),
          value: "action",
          action: true,
        },
      ],

      approved: [
        {
          id: 1,
          title: t("CATEGORY NAME"),
          value: "categoryName",
        },
      ],
    },
  ];

  const getEmployeeRequestedListForWorkExpenses = async (callback) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_WORK_EXPENSES_RECORD,
        {
          companyId: companyId,
          requestStatus: 4,
          employeeId: [employeeId],
        }
      );

      const data = result?.result || [];

      const modifiedData = data.map((approverslist) => {
        const approvers = approverslist.approvers || [];
        const approversNames = approvers
          .map((approveedby) => approveedby.firstName)
          .join(", ");

        return {
          categoryName: approverslist.categoryName,
          expenseDate: approverslist.expenseDate,
          amount: Number(approverslist.amount).toFixed(2) || 0,
          createdOn: approverslist.createdOn,
          approvers: approversNames,
          employeeWorkExpenseId: approverslist.employeeWorkExpenseId,
          receipt: approverslist.attachments ? (
            <a
              href={approverslist.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        };
      });

      setEmployeeRequestedList(modifiedData);
      setPendingRequestCount(result.result.length);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setPendingRequestCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpenses();
  }, []);

  const getEmployeeRequestedListForWorkExpensesApproved = async (callback) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_WORK_EXPENSES_RECORD,
        {
          companyId: companyId,
          requestStatus: 1,
          employeeId: [employeeId],
        }
      );

      const data = result?.result || [];

      const modifiedData = data.map((approverslist) => {
        const approvers = approverslist.approvers || [];
        const approversNames = approvers
          .map((approveedby) => approveedby.firstName)
          .join(", ");

        return {
          categoryName: approverslist.categoryName,
          expenseDate: approverslist.expenseDate,
          amount: Number(approverslist.amount).toFixed(2) || 0,
          createdOn: approverslist.createdOn,
          approvers: approversNames,
          receipt: approverslist.attachments ? (
            <a
              href={approverslist.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        };
      });

      setEmployeeRequestedListApproved(modifiedData);
      setApprovedCount(result.result.length);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setApprovedCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpensesApproved();
  }, []);

  const getEmployeeRequestedListForWorkExpensesRejected = async (callback) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_WORK_EXPENSES_RECORD,
        {
          companyId: companyId,
          requestStatus: 2,
          employeeId: [employeeId],
        }
      );

      const data = result?.result || [];

      const modifiedData = data.map((approverslist) => {
        const approvers = approverslist.approvers || [];
        const approversNames = approvers
          .map((approveedby) => approveedby.firstName)
          .join(", ");

        return {
          categoryName: approverslist.categoryName,
          expenseDate: approverslist.expenseDate,
          amount: Number(approverslist.amount).toFixed(2) || 0,
          createdOn: approverslist.createdOn,
          approvers: approversNames,
          receipt: approverslist.attachments ? (
            <a
              href={approverslist.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        };
      });

      setEmployeeRequestedListRejected(modifiedData);
      setRejectedCount(result.result.length);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setRejectedCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpensesRejected();
  }, []);

  const getEmployeeRequestedListForWorkExpensesSettled = async (callback) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_WORK_EXPENSES_RECORD,
        {
          companyId: companyId,
          requestStatus: 3,
          employeeId: [employeeId],
        }
      );

      const data = result?.result || [];

      const modifiedData = data.map((approverslist) => {
        const approvers = approverslist.approvers || [];
        const approversNames = approvers
          .map((approveedby) => approveedby.firstName)
          .join(", ");

        return {
          categoryName: approverslist.categoryName,
          expenseDate: approverslist.expenseDate,
          amount: Number(approverslist.amount).toFixed(2) || 0,
          createdOn: approverslist.createdOn,
          approvers: approversNames,
          receipt: approverslist.attachments ? (
            <a
              href={approverslist.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        };
      });

      if (result && result.result) {
        setEmployeeRequestedListSettled(modifiedData);
        setSettledCount(result.result.length);
      } else {
        setSettledCount(0);
      }

      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setSettledCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpensesSettled();
  }, []);

  return (
    <div className={`  w-full flex flex-col gap-3 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        {/* <div>
          <p className="font-bold text-lg">My work Expenses</p>
          <p className="para">{t("Main_dsc_work")}</p>
        </div> */}
        <Heading title="My Work Expenses" description={t("Main_dsc_work")} />
        <div className="flex flex-col gap-6 xs:flex-row">
          <ButtonClick
            BtnType="add"
            handleSubmit={() => {
              // console.log("show");
              // handleShow();
              setOpenPop("reimbursement");
              // setUpdateId(false);
              setShow(true);
            }}
            buttonName="Add Work Expense"
          ></ButtonClick>
        </div>
      </div>
      <TabsNew
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
        // data={
        //   Object.keys(actionData[0]).includes(navigationPath)
        //     ? actionData[0]?.[navigationPath].data
        //     : null
        // }
        // // actionToggle={true}
        // actionID={
        //   Object.keys(actionId[0]).includes(navigationPath)
        //     ? actionId[0]?.[navigationPath].id
        //     : null
        // }
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
        clickDrawer={(e) => {
          // handleShow();
          // console.log(e);
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
        referesh={() => {
          switch (navigationPath) {
            default:
              // getIncompleteList();
              // getPendingRequestList();
              break;
            case "pending_Request":
              // getPendingRequestList();
              break;
          }
        }}
      />

      {/* <FlexCol>
        <Flex justify="space-between"> */}
      {/* <Heading
          title="Requested Assets"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        /> */}
      {/* <Breadcrumbs
          items={breadcrumbItems}
          description={t("requestedAsset_description")}
        /> */}
      {/* {approvedBtn && (
            <Flex>
              <ButtonClick
                buttonName={t("Reject")}
                handleSubmit={() => {
                  setReject(true);
                }}
                className={"bg-red-500 text-white"}
                // BtnType="Add"
              />
              <ButtonClick
                buttonName={t("Approve")}
                handleSubmit={() => {
                  setApproved(true);
                }}
                className={"bg-primary text-white"}
                // BtnType="Add"
              />
            </Flex>
          )} */}
      {/* </Flex> */}
      {navigationPath === "pending_Request" && (
        <TableAnt
          data={employeeRequestedList}
          header={WorkExpenseHeader}
          path="pending_Request"
          actionID="employeeWorkExpenseId"
          deleteApi="deleteEmployeeWorkExpenseById"
          urlMain={`${config.payRollUrl}/api/main`}
          buttonClick={(e) => {
            setUpdateId(e);
            console.log(updateId, "tttt");
          }}
          clickDrawer={(actionID) => {
            handleShow("reimbursement", actionID);
          }}
          referesh={() => {
            getEmployeeRequestedListForWorkExpenses();
          }}

          // clickDrawer={(e, i, value, details) => {
          //   console.log(e, i, value, details);
          //   if (i === "approve") {
          //     setApproved(e);
          //   } else if (i === "reject") {
          //     setReject(true);
          //   }
          //   setApprovedEmployeeIds([value]);
          //   setApprovedDetails([details]);
          //   console.log(approvedEmployeeIds, "approveedd details");
          //   console.log(approvedDetails, "");
          // }}
          // selectedRow={(key, value, details) => {
          //   console.log(value, details);

          //   setApprovedBtn(details.length !== 0 ? key : false);
          //   setApprovedEmployeeIds(value);
          //   setApprovedDetails(details);
          // }}
          // headerTools={true}
        />
      )}

      {approved && (
        <ApprovedMyWorkExpense
          open={approved}
          close={() => {
            setApproved(false);
          }}
          // attendanceId={attendanceId}
          refresh={() => {
            getEmployeeRequestedListForWorkExpenses();
          }}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          employeeShowValue={[
            // { id: 1, title: "Employee Name", value: "employeeName" },
            { id: 2, title: "Category Name", value: "categoryName" },
          ]}
          actionApi={PAYROLLAPI.UPDATE_EMPLOYEE_WORK_EXPENSE_CATEGORY_RECORD}
        />
      )}
      {reject && (
        <RejectedMyWorkExpense
          open={reject}
          close={() => {
            setReject(false);
          }}
          // attendanceId={attendanceId}
          refresh={() => {
            getEmployeeRequestedListForWorkExpenses();
          }}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          employeeShowValue={[
            // { id: 1, title: "Employee Name", value: "employeeName" },
            { id: 2, title: "Category Name", value: "categoryName" },
          ]}
          actionApi={PAYROLLAPI.UPDATE_EMPLOYEE_WORK_EXPENSE_CATEGORY_RECORD}
        />
      )}
      {/* </FlexCol> */}

      {/* <FlexCol>
        <Flex justify="space-between">
       
        
        </Flex> */}
      {navigationPath === "approved" && (
        <TableAnt
          data={employeeRequestedListApproved}
          header={WorkExpenseHeaderApproved}
          path="approved"
          refresh={() => {
            getEmployeeRequestedListForWorkExpensesApproved();
          }}
        />
      )}
      {/* </FlexCol>
       */}

      {/* <FlexCol>
        <Flex justify="space-between">
       
        
        </Flex> */}
      {navigationPath === "rejected" && (
        <TableAnt
          data={employeeRequestedListRejected}
          header={WorkExpenseHeaderRejected}
          path="rejected"
          refresh={() => {
            getEmployeeRequestedListForWorkExpensesRejected();
          }}
        />
      )}
      {/* </FlexCol> */}

      <FlexCol>
        <Flex justify="space-between"></Flex>
        {navigationPath === "settled" && (
          <TableAnt
            data={employeeRequestedListSettled}
            header={WorkExpenseHeaderSettled}
            path="settled"
            refresh={() => {
              getEmployeeRequestedListForWorkExpensesSettled();
            }}
          />
        )}
      </FlexCol>

      {openPop === "reimbursement" && show && (
        <AddExpenceReimbursement
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId(null);
          }}
          updateId={updateId}
          // companyDataId={companyId}
          refresh={() => {
            getEmployeeRequestedListForWorkExpenses();
          }}
        />
      )}
    </div>
  );
};

export default MyWorkExpenses;

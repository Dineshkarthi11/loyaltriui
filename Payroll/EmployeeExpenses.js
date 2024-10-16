import React, { useEffect, useState } from "react";
import { Flex } from "antd";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";

import AddReimbursement from "./AddReimbursement";
import ButtonClick from "../common/Button";
import { IoDocumentsOutline } from "react-icons/io5";
import { PiCheck, PiPencilSimpleLineLight } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";
import TableAnt from "../common/TableAnt";
import FlexCol from "../common/FlexCol";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import RejectedMyWorkExpense from "./MyWorkExpenses/RejectedMyWorkExpense";
import ApprovedMyWorkExpense from "./MyWorkExpenses/ApprovedMyWorkExpense";
import {
  EmployeeWorkExpenseApprovedHeader,
  EmployeeWorkExpenseHeader,
  EmployeeWorkExpenseRejectedHeader,
  EmployeeWorkExpenseSettledHeader,
} from "../data";
import TabsNew from "../common/TabsNew";
import Heading from "../common/Heading";
import { FaFile } from "react-icons/fa";
import localStorageData from "../common/Functions/localStorageKeyValues";

const EmployeeExpenses = () => {
  const { t } = useTranslation();

  const [navigationPath, setNavigationPath] = useState("pending_Request");
  const [navigationValue, setNavigationValue] = useState("");
  const [openPop, setOpenPop] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [show, setShow] = useState(false);
  const [employeeRequestedList, setEmployeeRequestedList] = useState([]);
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [approvedDetails, setApprovedDetails] = useState();
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState();
  const [employeeRequestedListApproved, setEmployeeRequestedListApproved] =
    useState([]);
  const [employeeRequestedListRejected, setEmployeeRequestedListRejected] =
    useState([]);
  const [employeeRequestedListSettled, setEmployeeRequestedListSettled] =
    useState([]);
  const [approvedBtn, setApprovedBtn] = useState();
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [requestListApproveCount, setRequestListApproveCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [settledCount, setSettledCount] = useState(0);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  const tabs = [
    {
      id: 1,
      title: t("Pending_Request"),
      value: "pending_Request",
      navValue: "",
      count: pendingRequestCount,
    },
    {
      id: 2,
      title: t("Approved"),
      value: "approved",
      navValue: "",
      count: requestListApproveCount,
    },
    {
      id: 3,
      title: t("Rejected"),
      value: "rejected",
      navValue: "",
      count: rejectedCount,
    },
    // {
    //   id: 4,
    //   title: t("Added_to_Payroll"),
    //   value: "addedToPayroll",
    //   navValue: "",
    // },
    {
      id: 5,
      title: t("Settled"),
      value: "settled",
      navValue: "",
      count: settledCount,
    },
  ];

  const header = [
    {
      pendingRequest: [
        {
          id: 1,
          title: t("Name"),
          value: "name",
          flexColumn: true,
          logo: true,
          subvalue: "createdOn",
        },
        {
          id: 2,
          title: t("Category"),
          value: "category",
        },
        {
          id: 3,
          title: t("Received_On"),
          value: "receivedOn",
        },
        {
          id: 4,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 5,
          title: t("Receipt"),
          value: "receipt",
        },
      ],
      approved: [
        {
          id: 1,
          title: t("Name"),
          value: "name",
          flexColumn: true,
          logo: true,
          subvalue: "createdOn",
        },
        {
          id: 2,
          title: t("Category"),
          value: "",
        },
        {
          id: 3,
          title: t("Approved On"),
          value: "",
        },
        {
          id: 4,
          title: t("Amount Approved"),
          value: "",
        },
        {
          id: 5,
          title: t("Receipt"),
          value: "",
        },
        {
          id: 6,
          title: t("Action"),
          value: "action",
          actionButton: true,
          buttonName: "Add to payroll",
          dotsVerticalContent: [
            {
              title: "Mark as Settled",
              icon: <PiCheck />,
              value: "markAsSettled",
            },
            {
              title: "Edit",
              icon: <PiPencilSimpleLineLight />,
              value: "edit",
            },
            {
              title: "Delete",
              icon: <RiDeleteBin5Line />,
              value: "delete",
            },
          ],
        },
      ],
      rejected: [
        {
          id: 1,
          title: t("Name"),
          value: "name",
          flexColumn: true,
          logo: true,
          subvalue: "createdOn",
        },
        {
          id: 2,
          title: t("Category"),
          value: "",
        },
        {
          id: 3,
          title: t("Rejected On"),
          value: "",
        },
        {
          id: 4,
          title: t("Amount"),
          value: "",
        },
        {
          id: 5,
          title: t("Receipt"),
          value: "",
        },
        {
          id: 6,
          title: t("Action"),
          value: "action",
          action: true,
        },
      ],
      // addedToPayroll: [
      //   {
      //     id: 1,
      //     title: t("Name"),
      //     value: "name",
      //     flexColumn: true,
      //     logo: true,
      //     subvalue: "createdOn",
      //   },
      //   {
      //     id: 2,
      //     title: t("Category"),
      //     value: "",
      //   },
      //   {
      //     id: 3,
      //     title: t("Amount Approved"),
      //     value: "",
      //   },
      //   {
      //     id: 4,
      //     title: t("Added to Payroll On"),
      //     value: "",
      //   },
      //   {
      //     id: 5,
      //     title: t("Receipt"),
      //     value: "",
      //   },
      //   {
      //     id: 6,
      //     title: t("Action"),
      //     value: "action",
      //     actionButton: true,
      //     buttonName: "Add to payroll",
      //     dotsVerticalContent: [
      //       {
      //         title: "Mark as Settled",
      //         icon: <PiCheck />,
      //         value: "markAsSettled",
      //       },
      //       {
      //         title: "Edit",
      //         icon: <PiPencilSimpleLineLight />,
      //         value: "edit",
      //       },
      //       {
      //         title: "Delete",
      //         icon: <RiDeleteBin5Line />,
      //         value: "delete",
      //       },
      //     ],
      //   },
      // ],
      settled: [
        {
          id: 1,
          title: t("Name"),
          value: "name",
          flexColumn: true,
          logo: true,
          subvalue: "createdOn",
        },
        {
          id: 2,
          title: t("Category"),
          value: "",
        },
        {
          id: 3,
          title: t("Date of Spend"),
          value: "",
        },
        {
          id: 4,
          title: t("Amount Approved"),
          value: "",
        },
        {
          id: 5,
          title: t("Processed On"),
          value: "",
        },
        {
          id: 6,
          title: t("Receipt"),
          value: "",
        },
        {
          id: 7,
          title: t("Remarks"),
          value: "",
        },
        {
          id: 8,
          title: t("Action"),
          value: "action",
          dotsVertical: true,
          dotsVerticalContent: [
            {
              title: "Update",
              value: "update",
            },
            {
              title: "Delete",
              value: "delete",
              confirm: true,
            },
          ],
        },
      ],
    },
  ];

  // const pendingRequest = [
  //   {
  //     id: 1,
  //     title: "Paul Poole",
  //     logo: "https://randomuser.me/api/portraits/men/51.jpg",
  //     category: "Travel",
  //     receivedOn: "12/02/2024",
  //     amount: "AED 40000",
  //     receipt: "invoice133.pdf",
  //   },
  //   {
  //     id: 2,
  //     title: "Mitchell Medina",
  //     logo: "https://randomuser.me/api/portraits/men/9.jpg",
  //     category: "Travel",
  //     receivedOn: "12/02/2024",
  //     amount: "AED 40000",
  //     receipt: "invoice133.pdf",
  //   },
  //   {
  //     id: 3,
  //     title: "Amelia Lloyd",
  //     logo: "https://randomuser.me/api/portraits/men/20.jpg",
  //     category: "Travel",
  //     receivedOn: "12/02/2024",
  //     amount: "AED 20000",
  //     receipt: "invoice133.pdf",
  //   },
  //   {
  //     id: 4,
  //     title: "Franklin Fisher",
  //     logo: "https://randomuser.me/api/portraits/men/4.jpg",
  //     category: "Travel",
  //     receivedOn: "12/02/2024",
  //     amount: "AED 12000",
  //     receipt: "invoice133.pdf",
  //   },
  // ];

  // const actionData = [
  //   {
  //     pendingRequest: { id: 1, data: pendingRequestList },
  //     approved: { id: 2, data: approvedList },
  //     rejected: { id: 2, data: rejectedList },
  //     // addedToPayroll: { id: 2, data: addedToPayrollList },
  //     settled: { id: 2, data: settledList },
  //   },
  // ];
  // const actionId = [
  //   {
  //     addition: { id: "aditionID" },
  //     deduction: { id: "documentTypeId" },
  //     asset_Type: { id: "assetTypeId" },
  //     country: { id: "countryId" },
  //     State: { id: "stateId" },
  //   },
  // ];

  // const getPendingRequestList = async () => {
  //   setPendingRequestList(pendingRequest);
  // };

  // const getApprovedList = async () => {
  //   setApprovedList(approved);
  // };

  useEffect(() => {
    console.log(navigationPath);
    switch (navigationPath) {
      default:
        // getPendingRequestList();
        break;
      // case "approved":
      //   getApprovedList();
      //   break;
    }
  }, [navigationPath, companyId]);
  useEffect(() => {
    // updateCompany()
  }, [navigationPath]);

  const getEmployeeRequestedListForWorkExpenses = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_WORK_EXPENSES, {
        companyId: companyId,
        requestStatus: 4,
        loginEmployeeId: employeeId,
      });

      if (result && result.result) {
        const newValue = result.result.map((Item) => ({
          employeeWorkExpenseId: Item?.employeeWorkExpenseId,
          employeeName: Item?.employeeName,
          categoryName: Item?.categoryName,
          expenseDate: Item?.expenseDate,
          amount: Number(Item?.amount).toFixed(2) || 0,
          createdOn: Item?.createdOn,
          approvers: Item?.approvers,
          receipt: Item.attachments ? (
            <a
              href={Item.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        }));

        setEmployeeRequestedList(newValue);
        setPendingRequestCount(result.result.length);
      } else {
        setPendingRequestCount(0);
      }
    } catch (error) {
      console.error(
        "Error fetching work expenses for pending requests:",
        error
      );
      setPendingRequestCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpenses();
  }, []);

  const getEmployeeRequestedListForWorkExpensesApproved = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_WORK_EXPENSES, {
        companyId: companyId,
        requestStatus: 1,
        loginEmployeeId: employeeId,
      });

      if (result && result.result) {
        const newValue = result.result.map((Item) => ({
          employeeName: Item?.employeeName,
          categoryName: Item?.categoryName,
          expenseDate: Item?.expenseDate,
          amount: Number(Item?.amount).toFixed(2) || 0,
          createdOn: Item?.createdOn,
          approvers: Item?.approvers,
          receipt: Item.attachments ? (
            <a
              href={Item.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        }));

        setEmployeeRequestedListApproved(newValue);
        setRequestListApproveCount(result.result.length);
      } else {
        setRequestListApproveCount(0);
      }
    } catch (error) {
      console.error(
        "Error fetching work expenses for pending requests:",
        error
      );
      setRequestListApproveCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpensesApproved();
  }, []);

  const getEmployeeRequestedListForWorkExpensesRejected = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_WORK_EXPENSES, {
        companyId: companyId,
        requestStatus: 2,
        loginEmployeeId: employeeId,
      });

      if (result && result.result) {
        const newValue = result.result.map((Item) => ({
          employeeName: Item?.employeeName,
          categoryName: Item?.categoryName,
          expenseDate: Item?.expenseDate,
          amount: Number(Item?.amount).toFixed(2) || 0,
          createdOn: Item?.createdOn,
          approvers: Item?.approvers,
          receipt: Item.attachments ? (
            <a
              href={Item.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        }));
        setEmployeeRequestedListRejected(newValue);

        setRejectedCount(result.result.length);
      } else {
        setRejectedCount(0);
      }
    } catch (error) {
      console.error(
        "Error fetching work expenses for pending requests:",
        error
      );
      setRejectedCount(0);
    }
  };

  useEffect(() => {
    getEmployeeRequestedListForWorkExpensesRejected();
  }, []);

  const getEmployeeRequestedListForWorkExpensesSettled = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_WORK_EXPENSES, {
        companyId: companyId,
        requestStatus: 3,
        loginEmployeeId: employeeId,
      });

      if (result && result.result) {
        const newValue = result.result.map((Item) => ({
          employeeName: Item?.employeeName,
          categoryName: Item?.categoryName,
          expenseDate: Item?.expenseDate,
          amount: Number(Item?.amount).toFixed(2) || 0,
          createdOn: Item?.createdOn,
          approvers: Item?.approvers,
          receipt: Item.attachments ? (
            <a
              href={Item.attachments}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFile className="text-red-500 size-4" />
            </a>
          ) : null,
        }));
        setEmployeeRequestedListSettled(newValue);
        setSettledCount(result.result.length);
      } else {
        setSettledCount(0);
      }
    } catch (error) {
      console.error(
        "Error fetching work expenses for pending requests:",
        error
      );
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
            <p className="font-bold text-lg">Employee Expenses</p>
            <p className="para">{t("Offers a professional interface for accessing updates and details pertaining to employee loans.")}</p>
          </div> */}
        <Heading
          title={t("Employee Expenses")}
          description={t(
            "Offers a professional interface for accessing updates and details pertaining to expenses."
          )}
        />

        <div className="flex flex-col gap-6 xs:flex-row">
          {navigationPath === "settled" && (
            <ButtonClick
              icon={
                <IoDocumentsOutline className="2xl:text-2xl text-primary" />
              }
              buttonName="Download"
            ></ButtonClick>
          )}
          {navigationPath === "pending_Request" && approvedBtn && (
            <Flex gap={10}>
              <ButtonClick
                buttonName={t("Reject")}
                handleSubmit={() => {
                  setReject(true);
                  setApprovedBtn(false);
                }}
                BtnType="primary"
                danger={true}
              />
              <ButtonClick
                buttonName={t("Approve")}
                handleSubmit={() => {
                  setApproved(true);
                  setApprovedBtn(false);
                }}
                BtnType="primary"
              />
            </Flex>
          )}
          <ButtonClick
            BtnType="add"
            buttonName="Add Expense Reimbursement"
            handleSubmit={() => {
              setOpenPop("addExpenseReimbursement");
              setShow(true);
            }}
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
          setApprovedBtn(false);
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
        // referesh={() => {
        //   switch (navigationPath) {
        //     default:
        //       getPendingRequestList();
        //       break;
        //     case "approved":
        //       getApprovedList();
        //       break;
        //   }
        // }}
      />

      <FlexCol>
        {/* <Flex justify="space-between"> */}
        {/* <Heading
            title="Requested Assets"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          /> */}
        {/* <Breadcrumbs
            items={breadcrumbItems}
            description={t("requestedAsset_description")}
          /> */}

        {/* </Flex> */}
        {navigationPath === "pending_Request" && (
          <TableAnt
            data={employeeRequestedList}
            header={EmployeeWorkExpenseHeader}
            path="pending_Requests"
            actionID="employeeWorkExpenseId"
            clickDrawer={(e, i, value, details) => {
              console.log(e, i, value, details);
              if (i === "approve") {
                setApproved(e);
              } else if (i === "reject") {
                setReject(true);
              }
              setApprovedEmployeeIds([value]);
              setApprovedDetails([details]);
              console.log(approvedEmployeeIds, "approveedd details");
              console.log(approvedDetails, "");
            }}
            selectedRow={(key, value, details) => {
              console.log(value, details);

              setApprovedBtn(details.length !== 0 ? key : false);
              setApprovedEmployeeIds(value);
              setApprovedDetails(details);
            }}
            headerTools={true}
            referesh={() => {
              getEmployeeRequestedListForWorkExpenses();
            }}
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
              getEmployeeRequestedListForWorkExpensesApproved();
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
              getEmployeeRequestedListForWorkExpensesRejected();
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
      </FlexCol>

      <Flex justify="space-between"></Flex>
      {navigationPath === "approved" && (
        <TableAnt
          data={employeeRequestedListApproved}
          header={EmployeeWorkExpenseApprovedHeader}
          path="approvals"
          refresh={() => {
            getEmployeeRequestedListForWorkExpensesApproved();
          }}
        />
      )}

      <Flex justify="space-between"></Flex>
      {navigationPath === "rejected" && (
        <TableAnt
          data={employeeRequestedListRejected}
          header={EmployeeWorkExpenseRejectedHeader}
          path="rejections"
          refresh={() => {
            getEmployeeRequestedListForWorkExpensesRejected();
          }}
        />
      )}

      <Flex justify="space-between"></Flex>
      {navigationPath === "settled" && (
        <TableAnt
          data={employeeRequestedListSettled}
          header={EmployeeWorkExpenseSettledHeader}
          path="settlements"
          refresh={() => {
            getEmployeeRequestedListForWorkExpensesSettled();
          }}
        />
      )}

      {openPop === "addExpenseReimbursement" && show && (
        <AddReimbursement
          open={show}
          close={(e) => {
            setShow(e);
          }}
          // updateId={updateId}
          // companyDataId={companyId}
          refresh={() => {
            getEmployeeRequestedListForWorkExpenses();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeExpenses;

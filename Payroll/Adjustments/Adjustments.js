import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import API, { action } from "../../Api";
import ButtonClick from "../../common/Button";
import Breadcrumbs from "../../common/BreadCrumbs";
import Tabs from "../../common/Tabs";
import ButtonDropdown from "../../common/ButtonDropdown";

import { PiFiles } from "react-icons/pi";
import AddAdition from "./AddAddition";
import AddDeduction from "./AddDeduction";
import AddWorkExpence from "./AddWorkExpense";
import { Dropdown, Menu, Button } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import AddRecurringAdjustment from "./AddRecurringAdjustment";
import TableAnt from "../../common/TableAnt";
import TabsNew from "../../common/TabsNew";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import PayrollMainTableAnt from "../../common/PayrollMainTableAnt";
import Heading from "../../common/Heading";
import BulkactionDrawer from "./BulkactionDrawer"; import Loader from "../../common/Loader";

const Adjustment = () => {
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });

  const [navigationPath, setNavigationPath] = useState("addition");
  const [navigationValue, setNavigationValue] = useState("Addition");
  const [openPop, setOpenPop] = useState("");
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [show, setShow] = useState(false);
  // List Data
  const [additionList, setadditionList] = useState([]);
  const [deductionList, setDeductionList] = useState([]);
  const [bulkaction, setShowbulkaction] = useState();
  const [recurringAdjustmentList, setRecurringAdjustmentList] = useState([]);
  const [updateId, setUpdateId] = useState("");

  const handleShow = (popupType) => {
    console.log("Popup type:", popupType);
    setShow(true);
    setOpenPop(popupType);
  };

  const tabs = [
    {
      id: 1,
      title: t("Addition"),
      value: "addition",
      navValue: "Monthly Pay",
    },
    {
      id: 2,
      title: t("Deduction"),
      value: "deduction",
      navValue: "Deduction",
    },
    {
      id: 3,
      title: t("Recurring Adjustment"),
      value: "recurring_Adjustment",
      navValue: "Recurring Adjustment",
    },
    // {
    //   id: 3,
    //   title: t("Work_Expense"),
    //   value: "my_Adjustment",
    //   navValue: "My Adjustments",
    // },
    // {
    //   id: 4,
    //   title: t("Variable_Pay"),
    //   value: "my_Adjustment",
    //   navValue: "My Adjustments",
    // },
  ];

  const header = [
    {
      addition: [
        {
          id: 1,
          title: t("Name"),
          value: "employeeName",
          logo: true,
        },
        {
          id: 2,
          title: t("Type"),
          value: "additionName",
        },
        {
          id: 3,
          title: t("Reference"),
          value: "reference",
        },
        {
          id: 4,
          title: t("Remarks"),
          value: "remarks",
        },
        {
          id: 5,
          title: t("Incurred At"),
          value: "dateIncurred",
        },
        {
          id: 6,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 7,
          title: t("Action"),
          width: 100,
          value: "",
          action: true,
          isDelete: true,
        },
      ],
      deduction: [
        {
          id: 1,
          title: t("Name"),
          value: "employeeName",
          logo: true,
        },
        {
          id: 2,
          title: t("Type"),
          value: "deductionName",
        },
        {
          id: 3,
          title: t("Reference"),
          value: "reference",
        },
        {
          id: 4,
          title: t("Remarks"),
          value: "remarks",
        },
        {
          id: 5,
          title: t("Incurred At"),
          value: "dateIncurred",
        },
        {
          id: 6,
          title: t("Amount"),
          value: "amount",
        },
        {
          id: 7,
          title: t("Action"),
          width: 100,
          value: "",
          action: true,
          isDelete: true,
        },
      ],
      recurring_Adjustment: [
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
          title: t("Type"),
          value: "componentTypeName",
        },
        {
          id: 3,
          title: t("Reference"),
          value: "reference",
        },
        {
          id: 4,
          title: t("Remarks"),
          value: "remarks",
        },
        {
          id: 5,
          title: t("Amount"),
          value: "totalAmount",
        },
        // {
        //   id: 6,
        //   title: t("Attachments"),
        //   value: "attachments",
        // },
        {
          id: 7,
          title: t("Action"),
          width: 100,
          value: "",
          action: true,
          isDelete: true,
        },
      ],
    },
  ];

  const actionData = [
    {
      addition: { id: 1, data: additionList },
      deduction: { id: 2, data: deductionList },
      recurring_Adjustment: { id: 3, data: recurringAdjustmentList },
    },
  ];
  const actionId = [
    {
      addition: { id: "aditionID" },
      deduction: { id: "documentTypeId" },
      asset_Type: { id: "assetTypeId" },
      country: { id: "countryId" },
      State: { id: "stateId" },
    },
  ];

  const getAdditionList = async () => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_ALL_EMPLOYEE_ADDITIONS_RECORD,
      {
        companyId: companyId,
        isActive:1,
      }
    );
    const modifiedResult = result.result.map((item) => ({
      
      ...item,
      amount: parseFloat(item.amount).toFixed(2),
      isDelete: item.isSalaryPayoutDone,
    }));
    setadditionList(modifiedResult);
  };

  console.log(additionList,"additonlistt");
  const getDeductionList = async () => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_ALL_EMPLOYEE_DEDUCTIONS_RECORD,
      {
        companyId: companyId,
        isActive: 1,
      }
    );
    const modifiedResult = result.result.map((item) => ({
      ...item,
      amount: parseFloat(item.amount).toFixed(2),
      isDelete: item.isSalaryPayoutDone,
    }));
    setDeductionList(modifiedResult);
  };



  const getRecurringAdjustmentList = async () => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_ALL_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD,
      {
        companyId: companyId,
        isActive: 1,
      }
    );
      const modifiedResult = result.result.map((item) => ({
        ...item,
        totalAmount: parseFloat(item.totalAmount).toFixed(2),
        isDelete: item.isSalaryPayoutDone,
      }));
    setRecurringAdjustmentList(modifiedResult);

  };




  useEffect(() => {
    console.log(navigationPath);
    switch (navigationPath) {
      default:
        getAdditionList();
        break;
      case "deduction":
        getDeductionList();
        break;
      case "recurring_Adjustment":
        getRecurringAdjustmentList();
        break;
    }
  }, [navigationPath, companyId]);
  useEffect(() => {
    // updateCompany()
  }, [navigationPath]);

  const ButtonDropdownItems = [
    {
      key: "1",
      label: "New Addition",
      value: "newAddition",
    },
    {
      key: "2",
      label: "New Deduction",
      value: "newDeduction",
    },
    {
      key: "3",
      label: "Recurring Adjustment",
      value: "recurringAdjustment",
    },
  ];

  const options = [
    {
      status: "Open",
      month: "November",
      year: "2024",
    },
    {
      status: "Closed",
      month: "November",
      year: "2024",
    },
    {
      status: "Closed",
      month: "November",
      year: "2024",
    },
    {
      status: "Open",
      month: "November",
      year: "2024",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("Open");

  const handleMenuClick = (e) => {
    setSelectedOption(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {options.map((option, index) => (
        <Menu.Item key={option.status}>
          <div className="flex items-center gap-2 ml-auto">
            <div
              className={`${option.status === "Closed" ? "bg-gray-500" : "bg-lime-500"
                } min-w-16 px-3 pt-0 pb-0 rounded-md text-white`}
            >
              {option.status}
            </div>
            <div>
              {option.month} {option.year}
            </div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        {/* <div>
            <p className="font-bold text-lg">Adjustment</p>
            <p className="para">
              {t(
                "It enables employees to submit requests for reimbursement of work-related expenses."
              )}
            </p>
          </div> */}
        <Heading
          title={t("Adjustments")}
          description={t(
            "It enables employees to submit requests for reimbursement of work-related expenses."
          )}
        />

        <div className="flex flex-wrap  gap-6 ">
          {/* <Dropdown overlay={menu} placement="bottomCenter">
              <Button
                className="flex items-center gap-2 md:ml-auto"
                size={isSmallScreen ? "default" : "large"}
              >
                <div
                  className={`${
                    selectedOption === "Closed" ? "bg-gray-500" : "bg-lime-500"
                  } min-w-16 px-3 pt-0 pb-0 rounded-md text-white`}
                >
                  {selectedOption}
                </div>
                <div>
                  {options.find((opt) => opt.status === selectedOption)?.month}{" "}
                  {options.find((opt) => opt.status === selectedOption)?.year}
                </div>
                <IoIosArrowDown className="transition-all bg-transparent border-none outline-none 2xl:text-2xl hover:text-primary" />
              </Button>
            </Dropdown> */}

          {/* <ButtonClick
            handleSubmit={() => {
              // console.log("show");
              // handleShow(() => {
              // setShow(true);
              // });
              // setUpdateId(false);
            }}
            buttonName={t(`Download`)} // Set the button name
            icon={<PiFiles />}
          /> */}
          {/* <ButtonClick
            items={ButtonDropdownItems}
            BtnType="primary"
            buttonName={t("Bulk Actions")}
            handleSubmit={() => {
           
              // Add your logic here based on the selected key
              
              setShowbulkaction(true);
            }}
          /> */}
          <ButtonDropdown
            items={ButtonDropdownItems}
            BtnType="add"
            buttonName={t("New_Adjustment")}
            onSelect={(key, value) => {
              console.log("Selected key:", key + " " + value);
              // Add your logic here based on the selected key
              setOpenPop(value);
              setShow(true);
            }}
          />
        </div>
      </div>
      <TabsNew
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
        refresh={() => {
          switch (navigationPath) {
            default:
              getAdditionList();
              break;
            case "deduction":
              getDeductionList();
              break;
            case "recurring_Adjustment":
              getRecurringAdjustmentList();
              break;
          }
        }}
      />

      {navigationPath === "addition" && (
        <PayrollMainTableAnt
          data={additionList}
          header={header}
          path="addition"
          actionID={"employeeAdditionId"}
          deleteApi={"deleteEmployeeAdditionsById"}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          refresh={() => {
            getAdditionList();
          }}
          clickDrawer={(actionID) => {
            console.log("Action ID:", actionID);
            handleShow("newAddition", actionID);
          }}
          

        />
      )}

      {navigationPath === "deduction" && (
        <PayrollMainTableAnt
          data={deductionList}
          header={header}
          path="deduction"
          actionID={"employeeDeductionId"}
          deleteApi={"deleteEmployeeDeductionsById"}
          refresh={() => {
            getDeductionList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            console.log("Action ID:", actionID);
            handleShow("newDeduction", actionID);
          }}
        />
      )}

      {navigationPath === "recurring_Adjustment" && (
        <PayrollMainTableAnt
          data={recurringAdjustmentList}
          header={header}
          path="recurring_Adjustment"
          actionID={"employeeReccuringAdjustmentId"}
          deleteApi={"deleteEmployeeReccuringAjdustmentsById"}
          refresh={() => {
            getRecurringAdjustmentList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            console.log("Action ID:", actionID);
            handleShow("recurringAdjustment", actionID);
          }}
        />
      )}
      {bulkaction && (
        <BulkactionDrawer
          open={bulkaction}
          close={() => {
            setShowbulkaction(false);
          }}
        />
      )}

      {openPop === "newAddition" && show && (
        <AddAdition
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId(null);
          }}
          refresh={() => {
            getAdditionList();
          }}
          updateId={updateId}
        />
      )}
      {openPop === "newDeduction" && show && (
        <AddDeduction
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId(null);
          }}
          refresh={() => {
            getDeductionList();
          }}
          updateId={updateId}
        />
      )}
      {openPop === "recurringAdjustment" && show && (
        <AddRecurringAdjustment
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId(null);
          }}
          updateId={updateId}
          refresh={() => {
            getRecurringAdjustmentList();
          }}
        />
      )}
    </div>
  );
};

export default Adjustment;

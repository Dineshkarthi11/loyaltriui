import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TabsNew from "../../../../common/TabsNew";
import API from "../../../../Api";
import axios from "axios";

import PayrollSettingsTable from "../../../../common/PayrollSettingsTable";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import CreateEarnings from "./CreateEarnings";
import { motion } from "framer-motion";
import CreateVariablePays from "./CreateVariablePays";
import CreateAdditions from "./CreateAdditions";
import CreateDeductions from "./CreateDeductions";
import Breadcrumbs from "../../../../common/BreadCrumbs";
import Addnewsalary from "./AddNewsalary";
import Heading from "../../../../common/Heading";

export default function SalaryComponentsIND() {
  const { t } = useTranslation();
  const [navigationPath, setNavigationPath] = useState("earningsind");
  const [earnings, setEarnings] = useState([]);
  const [variables, setVariables] = useState([]);
  const [additions, setAdditions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [navigationValue, setNavigationValue] = useState(t("Earnings"));
  const [showIND, setShowIND] = useState(false);
  const [openPop, setOpenPop] = useState("");
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [show, setShow] = useState(false);

  // console.log(openPop, "updateid in bank account setting table");

  const handleClose = () => {
    setShow(false);
    setOpenPop(""); // Clear the value in setOpenPop
  };
  const handleShow = (popupType,) => {
    setShow(true);
    setOpenPop(popupType);
  };
  const breadcrumbItems = [
    // { label: t("Settings"), url: "" },
    // { label: t("Organisation"), url: "" },
    { label: t("Salary Components"), url: "" },
    { label: navigationValue, url: "" },
  ];
  const tabs = [
    {
      id: 1,
      title: t("Earnings"),
      value: "earningsind",
      navValue: t("Earnings"),
    },
    // {
    //   id: 2,
    //   title: t("Variable Pays"),
    //   value: "variablePays",
    //   navValue: t("Variable Pays")
    // },
    {
      id: 3,
      title: t("Additions"),
      value: "additions",
      navValue: t("Additions"),
    },
    {
      id: 4,
      title: t("Deductions"),
      value: "deductions",
      navValue: t("Deductions"),
    },
  ];

  const header = [
    {
      earningsind: [
        {
          id: 1,
          title: t("Name"),
          value: "earningsName",
        },
        {
          id: 2,
          title: t("Payslip Name"),
          value: "earningsPaySlipName",
        },
        {
          id: 3,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 4,
          title: t("Actions"),
          value: "",
          action: true,
        },
      ],
      // variablePays: [
      //   {
      //     id: 1,
      //     title: t("Name"),
      //     value: "variablePayName",
      //   },
      //   {
      //     id: 2,
      //     title: t("Name in Payslip"),
      //     value: "variablePayPaySlipName",
      //   },
      //   {
      //     id: 3,
      //     title: t("Status"),
      //     value: "isActive",
      //     actionToggle: true,
      //   },
      //   {
      //     id: 4,
      //     title: t("Actions"),
      //     value: "isEditable",
      //     action: true,
      //   },
      // ],
      additions: [
        {
          id: 1,
          title: t("Name"),
          value: "additionName",
        },
        {
          id: 2,
          title: t("Payslip Name"),
          value: "additionPaySlipName",
        },
        {
          id: 3,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 4,
          title: t("Actions"),
          value: "",
          action: true,
        },
      ],
      deductions: [
        {
          id: 1,
          title: t("Name"),
          value: "deductionName",
        },
        {
          id: 2,
          title: t("Payslip Name"),
          value: "deductionPaySlipName",
        },
        {
          id: 3,
          title: t("Status"),
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 4,
          title: t("Actions"),
          value: "",
          action: true,
        },
      ],
    },
  ];

  const getEarningList = async () => {
    // console.log(PAYROLLAPI.GET_ALL_EARNINGS_RECORDS);
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_EARNINGS_RECORDS, {
        companyId: companyId,
      });
      // console.log(result?.result, "data of get all earnings");
      setEarnings(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getVariablePayList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_VARIABLEPAYS_RECORDS,
        {
          companyId: companyId,
        }
      );
      // console.log(result?.result, "data of get all variablepay list");
      setVariables(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAdditionsList = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_ADDITIONS_RECORDS, {
        companyId: companyId,
      });
      // console.log(result?.result, "data of get all additions list");
      setAdditions(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDeductionsList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_DEDUCTIONS_RECORDS,
        {
          companyId: companyId,
        }
      );
      // console.log(result?.result, "data of get all additions list");
      setDeductions(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // console.log(navigationPath);
    switch (navigationPath) {
      default:
        getEarningList();
        break;
      case "variablePays":
        getVariablePayList();
        break;
      case "additions":
        getAdditionsList();
        break;
      case "deductions":
        getDeductionsList();
        break;
    }
  }, [navigationPath]);
  useEffect(() => {}, [navigationPath]);

 
  return (
    <div className={`w-full`}>
      <div className="flex flex-col gap-3 ">
        <Heading
          title={t("Salary Components ")}
          description={t("Main_dsc_salarycomp")}
        />

        <div>
          <TabsNew
            tabs={tabs}
            tabClick={(e) => {
              setNavigationPath(e);
            }}
            tabChange={(e) => {
              setNavigationValue(e);
            }}
          />
        </div>
      </div>

      {navigationPath === "earningsind" && (
        <PayrollSettingsTable
          data={earnings}
          heading={"Earnings"}
          buttonName={"Create Earnings"}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="earningsind"
          deleteApi={"deleteEarningsById"}
          actionID={"earningsId"}
          updateApi={"toggleEarningsStatus"}
          cursorPointer={false}
          refresh={() => {
            getEarningList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            handleShow("earningsind", actionID);
          }}
        />
      )}

      {navigationPath === "variablePays" && (
        <PayrollSettingsTable
          data={variables}
          heading={"Variable Pays"}
          buttonName={"Create Variable Pays"}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="variablePays"
          deleteApi={"deleteVariablePaysById"}
          actionID={"variablePayId"}
          updateApi={"toggleVariablePaysStatus"}
          refresh={() => {
            getVariablePayList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            // console.log("Action ID:", actionID);
            handleShow("variablePays", actionID);
          }}
          cursorPointer={false}
        />
      )}

      {navigationPath === "additions" && (
        <PayrollSettingsTable
          data={additions}
          heading={"Additions"}
          buttonName={"Create Additions "}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="additions"
          deleteApi={"deleteAdditionsById"}
          actionID={"additionId"}
          updateApi={"toggleAdditionsStatus"}
          refresh={() => {
            getAdditionsList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            // console.log("Action ID:", actionID);
            handleShow("additions", actionID);
          }}
          cursorPointer={false}
        />
      )}

      {navigationPath === "deductions" && (
        <PayrollSettingsTable
          data={deductions}
          heading={"Deductions"}
          buttonName={"Create Deductions"}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="deductions"
          deleteApi={"deleteDeductionsById"}
          actionID={"deductionId"}
          updateApi={"toggleDeductionsStatus"}
          refresh={() => {
            getDeductionsList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            // console.log("Action ID:", actionID);
            handleShow("deductions", actionID);
          }}
          cursorPointer={false}
        />
      )}

      {show && openPop === "earningsind" && (
        <motion.div initial="hidden" animate="visible">
          <Addnewsalary
            open={show}
            close={(e) => {
              getEarningList();
              setShow(e);
              handleClose();
              setUpdateId(null);
            }}
            refresh={() => {
              getEarningList();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}

      {show && openPop === "additions" && (
        <motion.div initial="hidden" animate="visible">
          <CreateAdditions
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId();
              handleClose();
              setUpdateId(undefined);
            }}
            refresh={() => {
              getAdditionsList();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}

      {show && openPop === "deductions" && (
        <motion.div initial="hidden" animate="visible">
          <CreateDeductions
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId();
              handleClose();
              setUpdateId(undefined);
            }}
            refresh={() => {
              getDeductionsList();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}
    </div>
  );
}

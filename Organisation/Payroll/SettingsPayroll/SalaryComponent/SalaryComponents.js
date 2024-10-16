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
import Heading from "../../../../common/Heading";

export default function SalaryComponents() {
  const { t } = useTranslation();
  const [navigationPath, setNavigationPath] = useState("earnings");
  const [earnings, setEarnings] = useState([]);
  const [variables, setVariables] = useState([]);
  const [additions, setAdditions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [navigationValue, setNavigationValue] = useState(t("Earnings"));
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );

  const handleClose = () => {
    setShow(false);
    setOpenPop(""); // Clear the value in setOpenPop
  };
  const handleShow = (popupType) => {
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
      value: "earnings",
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
      earnings: [
        {
          id: 1,
          title: t("Name"),
          value: "earningsName",
          bold: true,
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
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_EARNINGS_RECORDS, {
        companyId: companyId,
      });
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
      setDeductions(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
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
  useEffect(() => { }, [navigationPath]);

  return (
    <div className={`w-full`}>
      <div className="flex flex-col gap-3 ">
        <Heading
          title={t("Salary Components")}
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

      {navigationPath === "earnings" && (
        <PayrollSettingsTable
          data={earnings}
          heading={"Earnings"}
          buttonName={"Create Earnings"}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="earnings"
          deleteApi={"deleteEarningsById"}
          actionID={"earningsId"}
          updateApi={"toggleEarningsStatus"}
          refresh={() => {
            getEarningList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            handleShow("earnings", actionID);
            
          }}
          cursorPointer={false}
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
            handleShow("deductions", actionID);
          }}
          cursorPointer={false}
        />
      )}

      { openPop === "earnings" && (
        <motion.div initial="hidden" animate="visible">
          <CreateEarnings
            open={show}
            close={(e) => {
              getEarningList();
              setShow(e);
              
              // handleClose();
              setUpdateId(null);
             
            }}
          
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}

      {show && openPop === "variablePays" && (
        <motion.div initial="hidden" animate="visible">
          <CreateVariablePays
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId();
              handleClose();
              setUpdateId(undefined);
            }}
            refresh={() => {
              getVariablePayList();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}

      {  openPop === "additions" && (
        <motion.div initial="hidden" animate="visible">
          <CreateAdditions
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId();
              // handleClose();
              setUpdateId(undefined);
              getAdditionsList()
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
              getDeductionsList()
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

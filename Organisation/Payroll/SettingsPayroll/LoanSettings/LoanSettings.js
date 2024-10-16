import React, { useEffect, useState } from "react";
import PayrollSettingsTable from "../../../../common/PayrollSettingsTable";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import CreateLoanSettings from "./CreateLoanSettings";
import Heading from "../../../../common/Heading";

export default function LoanSettings() {
  const [loanSettingsList, setLoanSettingsList] = useState([]);
  const [show, setShow] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [updateId, setUpdateId] = useState(null);
  const [openPop, setOpenPop] = useState(false);


  const { t } = useTranslation();

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setOpenPop(false);
    setUpdateId(null);
    localStorage.removeItem("actionidforupdate");
  };

  const header = [
    {
      EmployeeLoanSettings: [
        {
          id: 1,
          title: t("Name"),
          value: "loanPolicyName",
          bold: true,
        },
        {
          id: 2,
          title: t("Number_of_employees"),
          value: "employeeCount",
        },
        {
          id: 3,
          title: t("Creation_Date"),
          value: "createdOn",
        },
        // {
        //   id: 4,
        //   title: t("Currency"),
        //   value: "currency",
        // },
        {
          id: 5,
          title: t("Active"),
          value: "isActive",
          actionToggle: true,
        },
        {
          id: 6,
          title: t("Action"),
          value: "",
          action: true
        },
      ],
    },
  ];

  const getLoanSettingsList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_Loan_Settings_RECORDS,
        {
          companyId: companyId,
        }
      );
      setLoanSettingsList(result?.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLoanSettingsList();
  }, []);

  return (
    <div>
      <Heading
        title={t("Loan_Settings")}
        description={t("Main_Desc_loan")}
      />

      <div className="mt-4">
        <PayrollSettingsTable
          data={loanSettingsList}
          heading={t("Employee_Loan_Settings")}
          buttonName={t("Create_Loan_Settings")}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="EmployeeLoanSettings"
          actionID={"loanPolicyId"}
          updateApi={"toggleLoanPoliciesStatus"}
          deleteApi={"deleteLoanPoliciesById"}
          clickDrawer={(actionID) => {
            handleShow("loansettings", actionID);
          }}
          refresh={() => {
            getLoanSettingsList();
          }}
          cursorPointer={false}


        />
      </div>

      {show && (
        <motion.div initial="hidden" animate="visible">
          <CreateLoanSettings
            open={show}
            close={(e) => {
              setShow(e);
              setUpdateId(null);
              handleClose();
            }}
            refresh={() => {
              getLoanSettingsList();
            }}
            openPolicy={openPop}
            updateId={updateId}
          />
        </motion.div>
      )}
    </div>
  );
}

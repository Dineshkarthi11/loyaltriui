import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TabsNew from "../../../../common/TabsNew";
import API from "../../../../Api";
import axios from "axios";
import PayrollSettingsTable from "../../../../common/PayrollSettingsTable";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import CreateFinalSettlements from "./CreateFinalSettlements";
import CreateGrativityChanges from "./CreateGrativityChanges";
import Heading from "../../../../common/Heading";

export default function FinalSettlements() {
  const { t } = useTranslation();
  const [navigationPath, setNavigationPath] = useState("finalSettlements");
  const [gratuitySettingsList, setGratuitySettingsList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [leaveEncashmentList, setleaveEncashmentList] = useState([]);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [show, setShow] = useState(false);
  const [openPop, setOpenPop] = useState("");

  const handleShow = (popupType) => {
    setShow(true);
    setOpenPop(popupType);
  };

  const handleClose = () => {
    setShow(false);
    setOpenPop(""); // Clear the value in setOpenPop
  };

  const tabs = [
    {
      id: 1,
      title: t("Leave Encashment"),
      value: "finalSettlements",
    },
    {
      id: 2,
      title: t("Gratuity_Settings"),
      value: "gratuitySettings",
    },
  ];

  const header = [
    {
      finalSettlements: [
        {
          id: 1,
          title: t("Leave_Type"),
          value: "leaveType",
          bold: true,
        },
        {
          id: 2,
          title: t("Daily_Rate_is_calculated_Based_on"),
          value: "encashmentRules",
        },
        {
          id: 3,
          title: t("Month Calculation"),
          value: "encashmentRules1",
        },
        {
          id: 4,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
      gratuitySettings: [
        {
          id: 1,
          title: t("Years"),
          value: "yearRange",
        },
        {
          id: 2,
          title: t("Gratuity Calculation"),
          value: "gratiutyCalculationDays",
        },
        {
          id: 3,
          title: t("Gratuity Payout"),
          value: "gratuityPayoutDays",
        },
        {
          id: 4,
          title: t("Gratuity Calculation Contract"),
          value: "gratiutyCalculationDaysContract",
        },
        {
          id: 5,
          title: t("Gratuity Payout Contract"),
          value: "gratuityPayoutDaysContract",
        },

        {
          id: 6,
          title: t("Action"),
          value: "",
          action: true,
        },
      ],
    },
  ];

  const getAllLeaveEncashmentRules = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_LeaveENCASHMENTRULES_RECORDS,
        {
          companyId: companyId,
        }
      );
      const formatString = (str) => {
        return (
          str
            // Add space between lowercase and uppercase letters
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            // Add space between digits and letters
            .replace(/(\d)([A-Za-z])/g, "$1 $2")
            // Capitalize the first letter
            .replace(/^./, (match) => match.toUpperCase())
        );
      };
      // Process the result to format encashmentRules
      const formattedResult = result?.result.map((item) => {
        const encashmentRules = JSON.parse(item.encashmentRules);
        const encashmentRules1 = JSON.parse(item.encashmentRules);
        const formattedRules = `${formatString(encashmentRules.rule1)} `;
        const formattedRules1 = ` ${formatString(encashmentRules.rule2)}`;
        return {
          ...item,
          encashmentRules: formattedRules,
          encashmentRules1: formattedRules1,
        };
      });

      setleaveEncashmentList(formattedResult);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllLeaveEncashmentRules();
  }, []);

  const getGratuitySettingsList = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_Gratuity_Settings_RECORDS,
        {
          companyId: companyId,
        }
      );

      const formattedGratuitySettings = result?.result.map((item) => {
        return {
          ...item,
          yearRange: `${item.fromYear} - ${item.toYear}`,
        };
      });

      setGratuitySettingsList(formattedGratuitySettings);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getGratuitySettingsList();
  }, []);

  useEffect(() => {
    getGratuitySettingsList();
  }, []);

  return (
    <div className={`  w-full flex flex-col gap-3 `}>
      <Heading
        title={t("Final_Settlements")}
        description={t("Main_dsc_finalsettle")}
      />

      <div>
        <TabsNew
          tabs={tabs}
          tabClick={(e) => {
            setNavigationPath(e);
          }}
        />
      </div>

      {navigationPath === "finalSettlements" && (
        <PayrollSettingsTable
          data={leaveEncashmentList}
          heading={t("Leave_Encashment")}
          buttonName={t("Create_Leave_Encashment")}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="finalSettlements"
          actionID={"leaveEncashmentRuleId"}
          deleteApi={"deleteLeaveEncashmentRulesById"}
          refresh={() => {
            getAllLeaveEncashmentRules();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            handleShow("finalSettlements", actionID);
          }}
          cursorPointer={false}
        />
      )}

      {navigationPath === "gratuitySettings" && (
        <PayrollSettingsTable
          data={gratuitySettingsList}
          heading={t("Gratuity")}
          buttonName={t("Create Gratuity")}
          BtnType={"add"}
          header={header}
          payrollSettings={true}
          path="gratuitySettings"
          actionID={"gratuityId"}
          deleteApi={"deleteGratutitySettingsById"}
          refresh={() => {
            getGratuitySettingsList();
          }}
          buttonClick={(e) => {
            setUpdateId(e);
          }}
          clickDrawer={(actionID) => {
            handleShow("gratuitySettings", actionID);
          }}
          cursorPointer={false}
        />
      )}

      {show && openPop === "finalSettlements" && (
        <CreateFinalSettlements
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId();
            handleClose();
            setUpdateId(undefined);
          }}
          refresh={() => {
            getAllLeaveEncashmentRules();
          }}
          openPolicy={openPop}
          updateId={updateId}
        />
      )}

      {show && openPop === "gratuitySettings" && (
        <CreateGrativityChanges
          open={show}
          close={(e) => {
            setShow(e);
            setUpdateId();
            handleClose();
            setUpdateId(undefined);
          }}
          refresh={() => {
            getGratuitySettingsList();
          }}
          openPolicy={openPop}
          updateId={updateId}
        />
      )}
    </div>
  );
}

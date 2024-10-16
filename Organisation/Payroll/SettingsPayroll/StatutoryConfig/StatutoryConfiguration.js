import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiFlag, PiPencilSimpleLine, PiUsers } from "react-icons/pi";
import { Tooltip, Skeleton, notification } from "antd";
import Heading from "../../../../common/Heading";
import ToggleBtn from "../../../../common/ToggleBtn";
import { motion } from "framer-motion";
import EmpProvidentFund from "./EmpProvidentFund";
import EmpStateInsurance from "./EmpStateInsurance";
import EmpPofessionalTax from "./EmpPofessionalTax";
import LabourWelfareFund from "./LabourWelfareFund";
import AssignEmpProvidentFund from "./AssignEmpProvidentFund";
import AssignEmpStateInsurance from "./AssignEmpStateInsurance";
import AssignEmpPofessionalTax from "./AssignEmpPofessionalTax";
import AssignLabourWelfareFund from "./AssignLabourWelfareFund";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";

export default function StatutoryConfiguration() {
  const { t } = useTranslation();
  const [updateId, setUpdateId] = useState(null);
  const [show, setShow] = useState(false);
  const [assignPopUP, setAssignPopUP] = useState({
    status: false,
    id: null,
    statutoryConfigurationId: null,
  });
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const replaceNullWithDash = (obj) => {
    const newObj = {};
    for (const key in obj) {
      if (obj[key] === null || obj[key] === "") {
        newObj[key] = "--";
      } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        newObj[key] = replaceNullWithDash(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  };

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_STATUTORY_CONFIGURATIONS_RECORDS,
        { companyId }
      );
      if (result.status === 200) {
        const transformedData = result.result.map((item) => {
          let details = {};
          const config = replaceNullWithDash(item.config);

          const name = getNameByStatutorySettingsId(
            parseInt(item.statutorySettingsId)
          );

          if (parseInt(item.statutorySettingsId) === 1) {
            details = {
              statutorySettingsId: 1,
              employeesContributionRate:
                config.employeeContribution.percent + "%" || "--",
              employersContributionRate:
                config.employerContribution.percent + "%" || "--",
              contributoryWageMaxLimit: config.employerpfwageLimit || "--",
              renewalAtTheStartOfTheYear: "--",
            };
          } else if (parseInt(item.statutorySettingsId) === 2) {
            details = {
              statutorySettingsId: 2,
              employeesContribution:
                config.employeeContributiongrossway + "%" || "--",
              employersContribution:
                config.employerContributiongrossway + "%" || "--",
              contributoryWageMaxLimit: "--",
              renewalAtTheStartOfTheYear: "--",
            };
          } else if (parseInt(item.statutorySettingsId) === 3) {
            details = {
              statutorySettingsId: 3,
              pTRCNumber: config.ptrcNumber || "--",
              deductionFrequency: config.deductionFrequency || "--",
              state: config.state || "--",
              renewalAtTheStartOfTheYear: "--",
            };
          } else if (parseInt(item.statutorySettingsId) === 4) {
            details = {
              statutorySettingsId: 4,
              employeesContribution: config.employeeContribution || "--",
              employersContribution: config.employerContribution || "--",
              deductionCycle: config.deductionCycle || "--",
              renewalAtTheStartOfTheYear: "--",
            };
          }
          return {
            id: item.statutoryConfigurationId,
            name: getNameByStatutorySettingsId(
              parseInt(item.statutorySettingsId)
            ),
            countryName: "Indian",
            details: details,
            isActive: item.isActive === "1",
            employeeCount: item.employeeCount || "--",
          };
        });
        setData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const getNameByStatutorySettingsId = (id) => {
    switch (id) {
      case 1:
        return "Employee Provident Fund(EPF)";
      case 2:
        return "Employee State Insurance(ESI)";
      case 3:
        return "Professional Tax(PT)";
      case 4:
        return "Labour Welfare Fund";
      default:
        return "Unknown";
    }
  };

  const handleShow = (id, statutoryConfigurationId) => {
    handleClose().then(() => {
      setUpdateId(id);
      setAssignPopUP((prevState) => ({
        ...prevState,
        statutoryConfigurationId,
      }));
      setShow(true);
    });
  };

  const handleClose = () => {
    return new Promise((resolve) => {
      setShow(false);
      setTimeout(() => {
        setUpdateId(null);
        setAssignPopUP((prevState) => ({
          ...prevState,
          statutoryConfigurationId: null,
        }));
        resolve();
      }, 300); // Delay for closing animation
    });
  };

  const handleToggle = async (id) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.STATUTORY_CONFIGURATIONS_RECORDS_TOGGLE_STATUS,
        { id }
      );
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        // Update the data state to reflect the change
        const updatedData = data.map((item) =>
          item.id === id ? { ...item, isActive: !item.isActive } : item
        );
        setData(updatedData);
      } else if (result.status === 500) {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      console.error("Error toggling:", error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Heading
        title={t("Statutory Configuration")}
        description={t(
          "Statutory Configuration refers to the setup and management of mandatory compliance requirements  when processing payroll."
        )}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {loading ? (
          <Skeleton active />
        ) : data.length === 0 ? (
          <div
            className="vhcenter text-gray-500 col-span-1
          sm:col-span-2 md:col-span-3 pt-20"
          >
            {t("No data available")}
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className="rounded-lg borderb text-sm md:text-[10px] 2xl:text-sm dark:text-white transition-all duration-300 hover:border-primary"
            >
              <div className="flex items-center justify-between p-2 2xl:p-3 border-b border-black/10 dark:border-white/20">
                <h1 className="font-semibold text-black capitalize dark:text-white">
                  {item.name}
                </h1>
                <div className="flex items-center gap-2">
                  <Tooltip title="Edit" placement="top">
                    <button
                      className="rounded-full bg-[#EDEDED] dark:bg-slate-500 opacity-60 size-7 vhcenter 2xl:size-[30px] hover:bg-primaryalpha/10 hover:opacity-100 hover:text-primary transition duration-300"
                      onClick={() =>
                        handleShow(item.details.statutorySettingsId, item.id)
                      }
                    >
                      <PiPencilSimpleLine className="size-3.5 2xl:size-4 font-bold" />
                    </button>
                  </Tooltip>
                  <ToggleBtn
                    change={() => handleToggle(item.id)}
                    value={item.isActive}
                  />
                </div>
              </div>

              {Object.entries(item.details).map(
                ([key, value], subIndex) =>
                  key !== "statutorySettingsId" && (
                    <div
                      key={subIndex}
                      className="flex flex-col gap-3.5 p-2 2xl:p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        <p className="mr-3">{value}</p>
                      </div>
                    </div>
                  )
              )}

              <div className="flex gap-4 justify h-11 border-t border-black/10 dark:border-white/20">
                <div className="flex items-center gap-2 p-2 text-xs md:text-[8px] 2xl:text-xs font-semibold 2xl:p-3 dark:text-white">
                  {item.employeeCount !== "0" && (
                    <span>{item.employeeCount}</span>
                  )}
                  <PiUsers className="text-sm 2xl:text-lg" />
                  {item.isActive ? (
                    <span
                      className="text-[9px] 2xl:text-[11px] text-primary cursor-pointer"
                      onClick={() => {
                        setAssignPopUP({
                          status: true,
                          id: item.details.statutorySettingsId,
                          statutoryConfigurationId: item.id,
                        });
                      }}
                    >
                      Add Employee +
                    </span>
                  ) : (
                    <Tooltip title="Please do fill in the detatils and activate the configuration to assign the employees">
                      <span className="text-[9px] 2xl:text-[11px] text-gray-400 cursor-not-allowed">
                        Add Employee +
                      </span>
                    </Tooltip>
                  )}
                </div>

                <div className="flex items-center gap-2 p-2 text-xs md:text-[8px] 2xl:text-xs font-semibold 2xl:p-3 dark:text-white">
                  <PiFlag className="text-sm 2xl:text-lg" />
                  <div className="flex items-center gap-0.5">
                    <span>For</span>
                    <span>{item.countryName}</span>
                    <span>Citizens</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {assignPopUP.status && assignPopUP.id === 1 && (
        <AssignEmpProvidentFund
          open={assignPopUP.status}
          close={() =>
            setAssignPopUP({
              status: false,
              id: null,
              statutoryConfigurationId: null,
            })
          }
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          statutorySettingsId={assignPopUP.id}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {assignPopUP.status && assignPopUP.id === 2 && (
        <AssignEmpStateInsurance
          open={assignPopUP.status}
          close={() =>
            setAssignPopUP({
              status: false,
              id: null,
              statutoryConfigurationId: null,
            })
          }
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          statutorySettingsId={assignPopUP.id}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {assignPopUP.status && assignPopUP.id === 3 && (
        <AssignEmpPofessionalTax
          open={assignPopUP.status}
          close={() =>
            setAssignPopUP({
              status: false,
              id: null,
              statutoryConfigurationId: null,
            })
          }
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          statutorySettingsId={assignPopUP.id}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {assignPopUP.status && assignPopUP.id === 4 && (
        <AssignLabourWelfareFund
          open={assignPopUP.status}
          close={() =>
            setAssignPopUP({
              status: false,
              id: null,
              statutoryConfigurationId: null,
            })
          }
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          statutorySettingsId={assignPopUP.id}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {show && updateId === 1 && (
        <EmpProvidentFund
          open={show}
          close={(e) => handleClose(e)}
          updateId={updateId}
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {show && updateId === 2 && (
        <EmpStateInsurance
          open={show}
          close={(e) => handleClose(e)}
          updateId={updateId}
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {show && updateId === 3 && (
        <EmpPofessionalTax
          open={show}
          close={(e) => handleClose(e)}
          updateId={updateId}
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          refresh={() => {
            fetchData();
          }}
        />
      )}

      {show && updateId === 4 && (
        <LabourWelfareFund
          open={show}
          close={(e) => handleClose(e)}
          updateId={updateId}
          statutoryConfigurationId={assignPopUP.statutoryConfigurationId}
          refresh={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
}

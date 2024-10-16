import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../../../common/DrawerPop";
import { useFormik } from "formik";
import Dropdown from "../../../../common/Dropdown";
import * as yup from "yup";
import API, { action } from "../../../../Api";
import { DaysDivider, Paycalculation } from "../../../../data";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateFinalSettlements({
  open,
  close = () => {},
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [CreateFinalSettlements, setFinalSettlements] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [leavetypes, setLeavetypes] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const { showNotification } = useNotification();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );
  const [functionRender, setFunctionRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setFinalSettlements(false);
    setUpdateId(undefined);
    localStorage.removeItem("actionidforupdate");
  };

  useMemo(
    () =>
      setTimeout(() => {
        CreateFinalSettlements === false && close(false);
      }, 800),
    [CreateFinalSettlements]
  );

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const formik = useFormik({
    initialValues: {
      companyId: [],
      leaveType: null,
      leaveTypeId: "",
      dailyRateCalcualtion: null,
      monthCalculation: null,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      leaveType: yup.string().required("Leave Type is required"),
      dailyRateCalcualtion: yup
        .string()
        .required("Daily Rate Calculation Basis is required"),
      monthCalculation: yup.string().required("Month Calculation is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_LeaveENCASHMENTRULES_RECORD_BY_ID,
            {
              id: updateId,
              companyId: companyId,
              leaveTypeId: formik.values.leaveTypeId,
              encashmentRules: {
                rule1: formik.values.dailyRateCalcualtion,
                rule2: formik.values.monthCalculation,
              },
              createdBy: employeeId,
              isActive: 1,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_LeaveENCASHMENTRULES_RECORD,
            {
              companyId: companyId,
              leaveTypeId: formik.values.leaveTypeId,
              encashmentRules: {
                rule1: formik.values.dailyRateCalcualtion,
                rule2: formik.values.monthCalculation,
              },
              createdBy: employeeId,
              isActive: 1,
            }
          );
          if (result.status === 200) {
            // alert("success");
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Info", error);
        setLoading(false);
      }
    },
  });

  const getListOfLeaveTypes = async () => {
    try {
      const result = await action(API.GET_LEAVE_TYPES, {
        companyId: companyId,
      });

      if (result?.result) {
        const options = result.result.map(({ leaveTypeId, leaveType }) => ({
          id: leaveTypeId,
          label: leaveType,
          value: leaveType,
          leaveTypeId: leaveTypeId,
        }));
        setLeavetypes(options);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getListOfLeaveTypes();
  }, []);

  const getCreateFinalSettlementsyIds = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_LeaveENCASHMENTRULES_RECORDS_BY_ID,
        {
          id: e,
        }
      );

      if (
        result?.status === 200 &&
        result?.result.length > 0 &&
        result.result[0].encashmentRules
      ) {
        const encashmentRules = JSON.parse(result.result[0].encashmentRules);
        const rule1 = encashmentRules.rule1;
        const rule2 = encashmentRules.rule2;
        const leaveType = result.result[0].leaveType;
        const leaveTypeId = result.result[0].leaveTypeId;
        // Set values for the dropdowns
        formik.setFieldValue("leaveType", leaveType);
        formik.setFieldValue("leaveTypeId", leaveTypeId);
        formik.setFieldValue("dailyRateCalcualtion", rule1);
        formik.setFieldValue("monthCalculation", rule2);
      }
    }
  };

  useEffect(() => {
    getCreateFinalSettlementsyIds(updateId);
  }, [updateId]);

  return (
    <DrawerPop
      open={CreateFinalSettlements}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={formik.handleSubmit}
      updateBtn={UpdateBtn}
      updateFun={() => {
        // updateBankById();
        formik.handleSubmit();
      }}
      header={[
        !updateId ? t("Create Leave Encashment") : t("Update Leave Encashment"),
        !updateId
          ? t("Create New Leave Encashment")
          : t("Update Selected Leave Encashment"),
      ]}
      footerBtn={[t("Cancel"), !updateId ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative flex flex-col w-full h-full gap-8">
        <Dropdown
          title={t("Leave_Type")}
          placeholder={t("choose_here")}
          change={(selectedLeaveType) => {
            const selectedOption = leavetypes.find(
              (option) => option.label === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("leaveType", selectedOption.value);
              formik.setFieldValue("leaveTypeId", selectedOption.leaveTypeId);
            }
          }}
          required={true}
          options={leavetypes}
          value={formik.values.leaveType}
          error={formik.errors.leaveType}
        />
        console.error("Error fetching data:", error);
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-3">
            <Dropdown
              title={t("Daily_rate_is_calculated_based_on")}
              placeholder={t("choose_here")}
              change={(e) => {
                formik.setFieldValue("dailyRateCalcualtion", e);
              }}
              required={true}
              options={Paycalculation}
              value={formik.values.dailyRateCalcualtion}
              error={formik.errors.dailyRateCalcualtion}
            />
          </div>
          <div className="col-span-3 ml-2">
            <Dropdown
              title={t("Month_calculation")}
              placeholder={t("choose_here")}
              change={(e) => {
                formik.setFieldValue("monthCalculation", e);
              }}
              required={true}
              options={DaysDivider}
              value={formik.values.monthCalculation}
              error={formik.errors.monthCalculation}
            />
          </div>
        </div>
      </div>
    </DrawerPop>
  );
}

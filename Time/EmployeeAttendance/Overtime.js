import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";
import Dropdown from "../../common/Dropdown";
import TimeSelect from "../../common/TimeSelect";
import FormInput from "../../common/FormInput";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action } from "../../Api";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Overtime({
  open,
  close = () => {},
  updateId,
  attendanceId,
  refresh = () => {},
  date,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
  };
  const option = [
    {
      title: "Fixed Amount",
      value: "fixedAmount",
    },
    {
      title: "1x Salary",
      value: "1xSalary",
    },
    {
      title: "1.5x Salary",
      value: "1.5xSalary",
    },
    {
      title: "2x Salary",
      value: "2xSalary",
    },
  ];

  const formik = useFormik({
    initialValues: {
      overtimeHours: "",
      overtimeRate: null,
      overtimeAmount: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      overtimeHours: yup.string().required("Overtime is required"),
      overtimeRate: yup.string().required("Overtime rate is required"),
      overtimeAmount: yup.string().required("Amount is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.ADD_EMPLOYEE_STATUS, {
          status: "Overtime", // Half Day,Absent,Fine,Overtime,Leave
          employeeAttendanceId: attendanceId,
          createdBy: employeeId,
          employeeAttendanceDate: date,
          employeeId: employeeDetails?.employeeId || null,
          overtime: {
            timeExtra: e.overtimeHours,
            overtimeRate: e.overtimeRate,
            overTimeAmount: e.overtimeAmount,
          },
        });
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
          formik.resetForm();
        } else {
          openNotification("error", "Failed", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  const getEmployeeDetails = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ATTENDENCE_ID_BASED, {
        id: attendanceId,
      });
      setEmployeeDetails(result.result);
      formik.setFieldValue(
        "overtimeHours",
        result?.result?.overtime?.timeExtra
      );
      formik.setFieldValue(
        "overtimeRate",
        result?.result?.overtime?.overTimeRate
      );
      formik.setFieldValue("overtimeAmount", result?.result?.overtime?.amount);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);
  const calculateAmount = async (data, item) => {
    try {
      const result = await action(API.CALCULATE_AMOUNT_WITH_POLICYS, {
        method: data,
        hours: formik.values.overtimeHours,
        type: item,
        employeeDailyAttendanceId: attendanceId,
      });
      if (result.status === 200) {
        formik.setFieldValue("overtimeAmount", result?.result?.amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      header={[
        t("Overtime"),
        t("Manually enter overtime hours and adjust payments accordingly"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"z-50 "} gap={30}>
        <Flex justify="space-between">
          <Flex gap={16} align="center">
            <h1 className=" relative font-semibold text-xl w-16 h-16 bg-primaryLight text-primary rounded-full flex items-center justify-center">
              {employeeDetails?.employeeName.charAt(0).toUpperCase()}
            </h1>

            <div>
              <h1 className="h1">
                {employeeDetails?.employeeName.charAt(0).toUpperCase() +
                  employeeDetails?.employeeName?.slice(1)}
              </h1>
              <p className="para">{employeeDetails?.email}</p>
            </div>
          </Flex>
          <Flex gap={4} align="center">
            <p className=" flex gap-1 font-medium text-[10px] text-grey">
              <span>Date :</span>
              <span>{date}</span>
            </p>
          </Flex>
        </Flex>
        <FlexCol className={" grid grid-cols-2 "} gap={25}>
          <div className=" col-span-2">
            <TimeSelect
              type="number"
              title="Overtime"
              placeholder="Number of hours"
              required={true}
              className=""
              description={"Overtime after the shift ends"}
              value={formik.values.overtimeHours}
              change={(e) => {
                formik.setFieldValue("overtimeHours", e);
              }}
              error={formik.errors.overtimeHours}
            />
          </div>

          <Dropdown
            title="Overtime rate"
            placeholder="Choose Overtime rate"
            options={option}
            value={formik.values.overtimeRate}
            change={(e) => {
              calculateAmount("Overtime", e);
              formik.setFieldValue("overtimeRate", e);
            }}
            error={formik.errors.overtimeRate}
            required={true}
          />
          <FormInput
            title="Amount"
            placeholder="Amount Per Hour"
            value={formik.values.overtimeAmount}
            change={(e) => {
              formik.setFieldValue("overtimeAmount", e);
            }}
            error={formik.errors.overtimeAmount}
            required={true}
          />
        </FlexCol>
      </FlexCol>
    </DrawerPop>
  );
}

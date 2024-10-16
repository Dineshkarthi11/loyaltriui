import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";
import TextArea from "../../common/TextArea";
import Dropdown from "../../common/Dropdown";
import TimeSelect from "../../common/TimeSelect";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNotification } from "../../../Context/Notifications/Notification";
import RadioButton from "../../common/RadioButton";
import { leaveSection } from "../../data";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function HalfDay({
  open,
  close = () => {},
  attendanceId,
  companyDataId,
  refresh,
  date,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [shift, setShift] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const [employeeLeaveTypesDetails, setEmployeeLeaveTypesDetails] = useState(
    []
  );

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const handleClose = () => {
    close(false);
  };

  const getShift = async () => {
    const result = await action(API.GET_SHIFT_RECORDS, {
      companyId: companyId,
    });
    setShift(
      result.result?.map((each) => ({
        label: each.shift,
        value: each.shiftId,
        color: each.shiftColor,
      }))
    );
  };

  useEffect(() => {
    getShift();
  }, []);

  const getLeavetype = async (e) => {
    const result = await action(API.GET_EMPLOYEE_LEAVE_TYPE_LIST, {
      id: e,
      companyId: companyId,
    });
    setEmployeeLeaveTypes(
      result.result?.map((each) => ({
        label: each.leaveType,
        value: each.leaveTypeId,
      }))
    );
    setEmployeeLeaveTypesDetails(result.result);
  };

  const formik = useFormik({
    initialValues: {
      shift: null,
      checkInTime: "",
      checkOutTime: "",

      leaveType: null,
      leaveSection: "",
      leaveReason: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      checkInTime: yup.string().required("Check In Time is required"),
      checkOutTime: yup.string().required("Check Out Time is required"),
      leaveType: yup.string().required("Leave Type is required"),
      leaveSection: yup.string().required("Leave Session is required"),
      leaveReason: yup.string().required("Leave Reason is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const leaveDetails = employeeLeaveTypesDetails.filter(
          (each) => parseInt(e.leaveType) === parseInt(each.leaveTypeId)
        )[0];
        const result = await action(API.ADD_EMPLOYEE_STATUS, {
          status: "Half Day", // Half Day,Absent,Fine,Overtime,Leave
          employeeAttendanceId: attendanceId,
          createdBy: employeeId,
          employeeAttendanceDate: date,
          employeeId: employeeDetails?.employeeId,
          shiftAssign: {
            //Present and Half Day
            shiftId: e.shift,
            firstCheckInTime: e.checkInTime,
            lastCheckOutTime: e.checkOutTime,
          },
          leaveParams: {
            employeeId: employeeDetails?.employeeId,
            createdBy: employeeId,
            companyId: companyId,
            leaveDateFrom: date,
            leaveDateTo: date,
            totalLeaveDays: 0.5,
            leaveTypeId: e.leaveType,
            leaveReason: e.leaveReason,
            appliedCount: 1,
            count: leaveDetails.leaveBalance,
            isActive: 1,
            isLeave: 1,
            halfDay: 1,
            isRegularization: "0",
            isExtraDuty: "0",
            maximumLeaveLimit: leaveDetails.maximumLeaveLimit || 0,
            leaveApplied: leaveDetails.leaveApplied,
            leaveSection: e.leaveSection,
            superiorEmployeeId: employeeDetails.employeeId,
            remarks: "",
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
          openNotification("error", "Info", result.message);
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
      if (result.status === 200) {
        setEmployeeDetails(result.result);
        getLeavetype(result.result.employeeId);

        formik.setFieldValue("shift", result.result?.shiftId);
        formik.setFieldValue("checkInTime", result.result?.firstCheckInTime);
        formik.setFieldValue("checkOutTime", result.result?.lastCheckOutTime);

        formik.setFieldValue("leaveType", result.result?.leaveTypeId);
        formik.setFieldValue("leaveSection", result.result?.leaveSession);
        formik.setFieldValue("leaveReason", result.result?.LeaveReasion);
      }
    } catch (error) {
      console.log();
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
        close(e);
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      header={[
        t("Half Day"),
        t(
          "Adjust time by entering punch-in and punch-out times manually for marking unpaid half days"
        ),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={""} gap={30}>
        <Flex justify="space-between">
          <Flex gap={16} align="center">
            <h1 className=" relative font-semibold text-xl w-16 h-16 bg-primaryLight text-primary rounded-full flex items-center justify-center">
              {employeeDetails?.employeeName?.charAt(0).toUpperCase()}
            </h1>

            <div>
              <h1 className="h1">
                {employeeDetails?.employeeName?.charAt(0).toUpperCase() +
                  employeeDetails?.employeeName?.slice(1)}
              </h1>
              <p className="para">{employeeDetails?.email}</p>
            </div>
          </Flex>
          <Flex gap={4} align="center">
            <p className=" flex gap-1 font-medium text-[10px] text-grey">
              <span>Date :</span>
              <span>
                {" "}
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </p>
          </Flex>
        </Flex>
        <FlexCol
          className={
            " grid grid-cols-2 bg-secondaryWhite dark:bg-dark p-4 rounded-xl"
          }
          gap={20}
        >
          <Dropdown
            title="Shift Name"
            placeholder="Select Shift"
            required={true}
            className=" col-span-2"
            options={shift}
            change={(e) => {
              formik.setFieldValue("shift", e);
            }}
            value={formik.values.shift}
            error={formik.errors.shift}
          />
          <TimeSelect
            title="Check In Time"
            placeholder="Choose Time"
            change={(e) => {
              formik.setFieldValue("checkInTime", e);
            }}
            value={formik.values.checkInTime}
            error={formik.errors.checkInTime}
          />
          <TimeSelect
            title="Check Out Time"
            placeholder="Choose Time"
            change={(e) => {
              formik.setFieldValue("checkOutTime", e);
            }}
            value={formik.values.checkOutTime}
            error={formik.errors.checkOutTime}
          />
        </FlexCol>
        <FlexCol
          className={
            " grid grid-cols-1  bg-secondaryWhite dark:bg-dark p-4 rounded-xl"
          }
          gap={25}
        >
          <Dropdown
            title="Leave Type"
            placeholder="Choose Leave Type"
            required={true}
            change={(e) => {
              formik.setFieldValue("leaveType", e);
            }}
            value={formik.values.leaveType}
            options={employeeLeaveTypes}
            error={formik.errors.leaveType}
          />
          <RadioButton
            title={t("Leave Session")}
            options={leaveSection}
            value={formik.values.leaveSection}
            change={(e) => {
              formik.setFieldValue("leaveSection", e);
            }}
            error={formik.errors.leaveSection}
          ></RadioButton>
          <TextArea
            title="Reason"
            placeholder="Reason"
            change={(e) => {
              formik.setFieldValue("leaveReason", e);
            }}
            value={formik.values.leaveReason}
            error={formik.errors.leaveReason}
          />
        </FlexCol>
      </FlexCol>
    </DrawerPop>
  );
}

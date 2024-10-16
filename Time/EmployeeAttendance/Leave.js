import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";
import TextArea from "../../common/TextArea";
import Dropdown from "../../common/Dropdown";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action } from "../../Api";
import { useNotification } from "../../../Context/Notifications/Notification";
import { dateFormater } from "../../common/Functions/commonFunction";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Leave({
  open,
  close = () => {},
  attendanceId,
  companyDataId,
  refresh = () => {},
  date,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
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

  const getLeavetype = async (e) => {
    const result = await action(API.GET_EMPLOYEE_LEAVE_TYPE_LIST, {
      id: e,
      companyId: companyId,
    });
    setEmployeeLeaveTypes(
      result.result.map((each) => ({
        label: each.leaveType,
        value: each.leaveTypeId,
      }))
    );
    setEmployeeLeaveTypesDetails(result.result);
  };

  const formik = useFormik({
    initialValues: {
      leaveType: null,
      leaveReason: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      leaveType: yup.string().required("Leave Type is Required"),
      leaveReason: yup.string().required("Reason is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const leaveDetails = employeeLeaveTypesDetails.filter(
          (each) => parseInt(e.leaveType) === parseInt(each.leaveTypeId)
        )[0];

        const result = await action(API.ADD_EMPLOYEE_PAID_LEAVE, {
          employeeId: employeeDetails?.employeeId,
          companyId: companyId,
          leaveDateFrom: dateFormater(date),
          leaveDateTo: dateFormater(date),
          totalLeaveDays: 1,
          leaveTypeId: e.leaveType,
          leaveReason: e.leaveReason,
          appliedCount: 1,
          count: leaveDetails.leaveBalance,
          isActive: 1,
          isLeave: 1,
          createdBy: employeeId,
          halfDay: 0,
          isRegularization: "0",
          isExtraDuty: "0",
          maximumLeaveLimit: leaveDetails.maximumLeaveLimit || 0,
          leaveApplied: leaveDetails.leaveApplied,
          leaveSection: "",
          superiorEmployeeId: employeeId,
          remarks: "",
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
    const result = await action(API.GET_EMPLOYEE_ATTENDENCE_ID_BASED, {
      id: attendanceId,
    });
    if (result.status === 200) {
      formik.setFieldValue("leaveType", result.result.leaveTypeId);
      formik.setFieldValue("leaveReason", result.result.leaveReason);

      setEmployeeDetails(result.result);
      getLeavetype(result.result.employeeId);
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
      header={[
        t("Leave"),
        t(
          "Select the taken paid leave; if it was not applied, enter it manually."
        ),
      ]}
      footerBtn={[t("Cancel"), t("Submit")]}
      footerBtnDisabled={loading}
      className="z-50"
    >
      <FlexCol className={"z-50"} gap={30}>
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
              <sapn>
                {new Date(dateFormater(date)).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </sapn>
            </p>
          </Flex>
        </Flex>
        <FlexCol className={" grid grid-cols-1"} gap={25}>
          <Dropdown
            title="Leave Type"
            placeholder="Choose Leave Type"
            required={true}
            change={(e) => {
              formik.setFieldValue("leaveType", e);
            }}
            value={formik.values.leaveType}
            error={formik.errors.leaveType}
            options={employeeLeaveTypes}
          />
          <TextArea
            title="Reason"
            placeholder="Type here..."
            change={(e) => {
              formik.setFieldValue("leaveReason", e);
            }}
            value={formik.values.leaveReason}
            error={formik.errors.leaveReason}
            required={true}
          />
        </FlexCol>
      </FlexCol>
    </DrawerPop>
  );
}

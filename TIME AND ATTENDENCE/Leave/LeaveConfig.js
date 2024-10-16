import { Flex, notification } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import Dropdown from "../../common/Dropdown";
import { useFormik } from "formik";
import * as yup from "yup";
import DateSelect from "../../common/DateSelect";
import API, { action } from "../../Api";
import moment from "moment";
import { useNotification } from "../../../Context/Notifications/Notification";
export default function LeaveConfig({
  open,
  close = () => {},
  employeeId,
  companyDataId,
  // refresh,
  updateId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [leaveConfig, setLeaveConfig] = useState();

  useEffect(() => {
    // console.log(open);
    setCompanyId(localStorage.getItem("companyId"));
  }, [open]);
  const handleClose = () => {
    // close(false);
    setShow(false);
  };
  // useEffect
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
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

  const formik = useFormik({
    initialValues: {
      leaveCycleStart: "",
      leavePeriod: null,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      leaveCycleStart: yup.string().required("Leave Cycle Start is required"),
      leavePeriod: yup.string().required("Leave Period Start required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.LEAVE_CONFIGURATION, {
          companyId: companyId,
          leaveParameters: {
            leaveCycleStart: e.leaveCycleStart,
            leavePeriod: e.leavePeriod,
          },
        });

        // console.log(result);

        if (result.status === 200) {
          openNotification(
            "success",
            "Successful",
            "Regularize saved. Changes are now reflected."
          );
          setTimeout(() => {
            handleClose();
            setLoading(false);
            // refresh();
          }, 1000);
          formik.resetForm();
        }
      } catch (error) {
        // console.log(error);
        openNotification("error", "Failed ", error.message);
        setLoading(false);
      }
    },
  });

  const getLeaveConfig = async () => {
    try {
      const result = await action(API.GET_LEAVE_CONFIGURATION, {
        companyId: companyId,
      });
      if (result.status === 200) {
        setLeaveConfig(result.result);
        // const value = parseInt(result.result[0].leaveParameters.leaveCycleStart);
        // if (
        //   /^\d{2}$/.test(value) &&
        //   parseInt(value) >= 1 &&
        //   parseInt(value) <= 12
        // ) {
        //   formik.setFieldValue("leaveCycleStart", value); // Set as MM
        // }
        formik.setFieldValue(
          "leaveCycleStart",
          parseInt(result.result[0].leaveParameters.leaveCycleStart)
        );

        formik.setFieldValue(
          "leavePeriod",
          result.result[0].leaveParameters.leavePeriod
        );
      }
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaveConfig();
  }, []);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        // close(e);
      }}
      contentWrapperStyle={
        {
          // maxWidth: "600px",
        }
      }
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      // updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        t("Leave Configuration"),
        t(
          "Leave configuration specifies the leave period and leave cycle for employee leave management."
        ),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), t("Submit")]}
      footerBtnDisabled={loading}
    >
      <div className="flex flex-col gap-4">
        <Dropdown
          title="Leave Cycle Start"
          value={formik.values.leaveCycleStart}
          change={(e) => {
            formik.setFieldValue("leaveCycleStart", e);
          }}
          error={formik.errors.leaveCycleStart}
          options={[...Array(28)].map((_, i) => ({
            label: `${i + 1}`,
            value: `${i + 1}`,
          }))}
          placeholder="Choose Leave Cycle "
          disableFilterSort={true}
        />
        <DateSelect
          title="Leave Period Start"
          value={formik.values.leavePeriod}
          change={(e) => {
            formik.setFieldValue("leavePeriod", e);
          }}
          error={formik.errors.leavePeriod}
          placeholder="Choose Leave Period "
          pickerType="month"
          dateFormat="YYYY-MM"
          className={".hide-year-picker .ant-picker-header"}
          hideYear={true}
        />
      </div>
    </DrawerPop>
  );
}

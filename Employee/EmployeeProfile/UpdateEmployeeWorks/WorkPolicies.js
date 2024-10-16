import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import API, { action } from "../../../Api";
import axios from "axios";
import DrawerPop from "../../../common/DrawerPop";
import FlexCol from "../../../common/FlexCol";
import Dropdown from "../../../common/Dropdown";
import FormInput from "../../../common/FormInput";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function WorkPolicies({
  open,
  close = () => {},
  updateData,
  employeeId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [overTimePolicy, setOverTimePolicy] = useState([]);
  const [timeOutPolicy, setTimeOutPolicy] = useState([]);
  const [shortTimePolicy, setShortTimePolicy] = useState([]);
  const [missPunchPolicy, setMissPunchPolicy] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  const handleClose = () => {
    close(false);
  };
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const getOverTimePolicy = async (e) => {
    // console.log(API.HOST + API.GET_OVERTIME_POLICY + "/" + e);
    try {
      const result = await axios.post(
        API.HOST + API.GET_OVERTIME_POLICY + "/" + e
      );

      // console.log(result, "getOverTimePolicy");
      setOverTimePolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getTimeInOutPolicy = async (e) => {
    try {
      const result = await axios.post(
        API.HOST + API.GET_EMPLOYEE_TIME_IN_OUT_POLICY + "/" + e
      );
      // console.log(result, "getTimeInOutPolicy");
      setTimeOutPolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getShortTimePolicy = async (e) => {
    // console.log(API.HOST + API.GET_SHORT_TIME_POLICY + "/" + e);
    try {
      const result = await axios.post(
        API.HOST + API.GET_SHORT_TIME_POLICY + "/" + e
      );
      // console.log(result, "getShortTimePolicy");
      setShortTimePolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getMissPunchPolicy = async (e) => {
    // console.log(API.HOST + API.GET_MISS_PUNCH_POLICY + "/" + e);
    try {
      const result = await axios.post(
        API.HOST + API.GET_MISS_PUNCH_POLICY + "/" + e
      );
      setMissPunchPolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
      // console.log(result, "getMissPunchPolicy");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOverTimePolicy(updateData.companyId);
    getTimeInOutPolicy(updateData.companyId);
    getShortTimePolicy(updateData.companyId);
    getMissPunchPolicy(updateData.companyId);
  }, []);

  useEffect(() => {
    formik.setFieldValue("timeInOutPolicy", updateData.timeInOutPolicy);
    formik.setFieldValue("overTimePolicy", updateData.overtimePolicy);
    formik.setFieldValue("shortTimePolicy", updateData.shortTimePolicy);
    formik.setFieldValue("missPunchPolicy", updateData.missPunchPolicy);
  }, [updateData]);

  const formik = useFormik({
    initialValues: {
      timeInOutPolicy: "",
      overTimePolicy: "",
      shortTimePolicy: "",
      missPunchPolicy: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // department: yup.string().required("Department is Required"),
      // description: yup.string().required("Description is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log(e);
      try {
        // console.log(API.HOST + API.UPDATE_PERSONAL_INFORMATION);
        const result = await action(API.UPDATE_PERSONAL_INFORMATION, {
          employeeId: employeeId,
          companyId : companyId,
          
        
          fields: {
            timeInOutPolicy: e.timeInOutPolicy,
            overtimePolicy: e.overTimePolicy,
            shortTimePolicy: e.shortTimePolicy,
            missPunchPolicy: e.missPunchPolicy,
          },
        });

        // console.log(result);
        
        if (result.status === 200) {
          openNotification(
            "success",
            "Successful",
            "Employee Work Policies Update. Changes are now reflected."
          );
          setTimeout(() => {
            handleClose();
            setLoading(false);
            refresh();
          }, 500);
          formik.resetForm();
        }
      } catch (error) {
        // console.log(error);
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
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
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Work Policies") : t(""),
        !UpdateBtn
          ? t("Manage you companies here, and some lorem ipsu")
          : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <Dropdown
          title="Time In-Out Policy"
          value={formik.values.timeInOutPolicy}
          change={(e) => {
            formik.setFieldValue("timeInOutPolicy", e);
          }}
          options={timeOutPolicy}
        />
        <Dropdown
          title="Over Time Policy"
          value={formik.values.overTimePolicy}
          change={(e) => {
            formik.setFieldValue("overTimePolicy", e);
          }}
          options={overTimePolicy}
        />
        <Dropdown
          title="Short Time Policy"
          value={formik.values.shortTimePolicy}
          change={(e) => {
            formik.setFieldValue("shortTimePolicy", e);
          }}
          options={shortTimePolicy}
        />
        <Dropdown
          title="Miss punch Policy"
          value={formik.values.missPunchPolicy}
          change={(e) => {
            formik.setFieldValue("missPunchPolicy", e);
          }}
          options={missPunchPolicy}
        />
      </FlexCol>
    </DrawerPop>
  );
}

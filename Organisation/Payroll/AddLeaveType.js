import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import axios from "axios";
import API from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import FormInput from "../../common/FormInput";
import TextArea from "../../common/TextArea";
import { notification } from "antd";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddLeaveType({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();
  const layout = useSelector((state) => state.layout.value);

  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const handleClose = () => {
    refresh();
    close(false);
    // setShow(false);
    // closeShow();
  };
  const formik = useFormik({
    initialValues: {
      leaveType: "",
      description: "",
    },

    enableReinitialize: true,

    validateOnChange: false,

    validationSchema: yup.object().shape({
      leaveType: yup.string().required("LeaveType is Required"),
      description: yup.string().required("Description is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log({
      //   // companyId: companyDataId,
      //   leaveType: e.leaveType,
      //   description: e.description,
      // });
      try {
        const result = await axios.post(API.HOST + API.ADD_LEAVE_TYPES, {
          companyId: companyDataId,
          leaveType: e.leaveType,
          description: e.description,
        });
        if (result.data.status === 200) {
          // alert("success");
          openNotification("success", "Successful", result.data.message, () => {
            handleClose();
            refresh();
            setLoading(false);
          });
        } else if (result.data.status === 500) {
          openNotification("error", "Failed", result.data.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  const getIdBasedLeaveTypeList = async (e) => {
    // console.log(e, "e");
    if (e !== "" && updateId !== false) {
      const result = await axios.post(
        API.HOST + API.GET_LEAVE_TYPES_ID_BASED_RECORDS + "/" + e
      );

      if (result.status === 200) {
        setCompanyId(result.data.companyId);
        formik.setFieldValue("leaveType", result.data.leaveType);
        formik.setFieldValue("description", result.data.description);
        setIsUpdate(true);
      }
      // setGetIdBasedUpdatedRecords(result.data);
      // console.log(result.data);
    }
  };
  useEffect(() => {
    // console.log(updateId, "updateData");
    getIdBasedLeaveTypeList(updateId);
  }, [updateId]);

  const updateIdBasedLeaveType = async () => {
    // console.log(updateId, formik.values.leaveType, formik.values.leaveType);
    const result = await axios.post(API.HOST + API.UPDATE_LEAVE_TYPES, {
      companyId: companyId,
      leaveTypeId: updateId,
      leaveType: formik.values.leaveType,
      description: formik.values.description,
    });
    if (result.data.status === 200) {
      openNotification("success", "Successful", result.data.messages.success);
      setTimeout(() => {
        handleClose();
        refresh();
      }, 1000);
    } else if (result.data.status !== 200) {
      openNotification("error", "Failed ", result.data.message);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        close(e);
      }}
      contentWrapperStyle={{
        width: "fit",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={isUpdate}
      updateFun={() => {
        updateIdBasedLeaveType();
      }}
      header={[
        !isUpdate ? t("Add_a_New_LeaveType") : t("Update_LeaveType"),
        !isUpdate
          ? t("Add_a_New_LeaveType_Description")
          : t("Update_Selected_LeaveType"),
      ]}
      footerBtn={[
        t("Cancel"),
        !isUpdate ? t("Add_LeaveType") : t("Update_LeaveType"),
      ]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full ">
        <div className="pb-[30px]">
          <FormInput
            title={t("LeaveType")}
            placeholder={t("LeaveType")}
            value={formik.values.leaveType}
            change={(e) => {
              formik.setFieldValue("leaveType", e);
            }}
            error={formik.errors.leaveType}
          />
        </div>
        <TextArea
          title={t("Description")}
          placeholder={t(" Description")}
          className=""
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
          value={formik.values.description}
          error={formik.errors.description}
        />
      </div>
    </DrawerPop>
  );
}

import { Drawer, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import axios from "axios";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import FormInput from "../../common/FormInput";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import CheckBoxInput from "../../common/CheckBoxInput";
import { useNotification } from "../../../Context/Notifications/Notification";
export default function AddDepartment({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const { t } = useTranslation();
  const layout = useSelector((state) => state.layout.value);

  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState();
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    close(false);

    // setShow(false);
    // closeShow();
  };
  const formik = useFormik({
    initialValues: {
      department: "",
      description: "",
      isActive: 0,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      department: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Department must only contain letters")
        .required("Department is required"),
      description: yup.string().required("Description is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await action(API.UPDATE_DEPARTMENT, {
            id: updateId,
            companyId: companyId,
            department: formik.values.department,
            description: formik.values.description,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_DEPARTMENT, {
            companyId: companyDataId,
            department: e.department,
            description: e.description,
            isActive: e.isActive,
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
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });
  const getIdBasedDepartmentList = async (e) => {
    try {
      if (e !== "" && updateId !== false) {
        const result = await action(API.GET_DEPARTMENT_ID_BASED_RECORDS, {
          id: e,
        });

        if (result.status === 200) {
          formik.setFieldValue("department", result.result.department);
          formik.setFieldValue("description", result.result.description);
          setCompanyId(result.result.companyId);
          setIsUpdate(true);
        }
        // setGetIdBasedUpdatedRecords(result.data);
        // console.log(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // console.log(updateId, "updateData");
    getIdBasedDepartmentList(updateId);
  }, [updateId]);

  // const updateIdBasedLocation = async () => {
  //   try {
  //     const result = await action(API.UPDATE_DEPARTMENT, {
  //       id: updateId,
  //       companyId: companyId,
  //       department: formik.values.department,
  //       description: formik.values.description,
  //     });
  //     if (result.status === 200) {
  //       openNotification("success", "Successful", result.message);
  //       setTimeout(() => {
  //         handleClose();
  //         refresh();
  //       }, 1000);
  //     } else if (result.status !== 200) {
  //       openNotification("error", "Something went wrong ", result.message);
  //     }
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        formik.setFieldValue("department", "");
        formik.setFieldValue("description", "");
        close(e);
      }}
      contentWrapperStyle={{
        maxWidth: "540px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={isUpdate}
      updateFun={() => {
        //updateIdBasedLocation();
        formik.handleSubmit();
      }}
      header={[
        !isUpdate ? t("Create_Department") : t("Update_Department"),
        !isUpdate
          ? t("Create_New_Department")
          : t("Update_Selected_Department"),
      ]}
      footerBtn={[t("Cancel"), !isUpdate ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative h-full w-full dark:text-white">
        <FormInput
          title={t("Department")}
          placeholder={t("Department")}
          value={formik.values.department}
          change={(e) => {
            formik.setFieldValue("department", e);
          }}
          // error={formik.values.department ? "" : formik.errors.department}
          error={formik.touched.department && formik.errors.department}
          required={true}
        />
        <TextArea
          title={t("Description")}
          placeholder={t("Description")}
          className=""
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
          value={formik.values.description}
          error={formik.values.description ? "" : formik.errors.description}
          required={true}
        />
      </FlexCol>
    </DrawerPop>
  );
}

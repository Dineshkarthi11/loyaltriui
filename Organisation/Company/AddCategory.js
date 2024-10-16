import React, { useEffect, useState } from "react";
import FormInput from "../../common/FormInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import axios from "axios";
import API, { action } from "../../Api";
import { notification } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddCategory({
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
  const [loading, setLoading] = useState(false);
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
    formik.setFieldValue("category", "");
    formik.setFieldValue("description", "");
    // setShow(false);
    // closeShow();
  };

  const formik = useFormik({
    initialValues: {
      category: "",
      description: "",
      isActive: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      category: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Category must only contain letters")
        .required("Category is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await action(API.UPDATE_CATEGORY, {
            id: updateId,
            companyId: companyId,
            category: formik.values.category,
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
          const result = await action(API.ADD_CATEGORY, {
            companyId: companyDataId,
            category: e.category,
            description: e.description,
            isActive: e.isActive,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1000);
          }
        }
      } catch (error) {
        openNotification(
          "error",
          "Error saving category",
          "There was an error while saving the category. Please try again."
        );
        setLoading(false);
      }
    },
  });

  const getIdBasedCategoryList = async (e) => {
    // console.log(e, "e");
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_CATEGORY_ID_BASED_RECORDS, { id: e });

      if (result.status === 200) {
        setCompanyId(result.result.companyId);
        formik.setFieldValue("category", result.result.category);
        formik.setFieldValue("description", result.result.description);
        setIsUpdate(true);
      }
      // setGetIdBasedUpdatedRecords(result.data);
      // console.log(result.data);
    }
  };
  useEffect(() => {
    // console.log(updateId, "updateData");
    getIdBasedCategoryList(updateId);
  }, [updateId]);

  // const updateIdBasedCategory = async () => {
  //   console.log({
  //     id: companyId,
  //     companyId: updateId,
  //     category: formik.values.category,
  //     description: formik.values.description,
  //   });
  //   const result = await action(API.UPDATE_CATEGORY, {
  //     id: updateId,
  //     companyId: companyId,
  //     category: formik.values.category,
  //     description: formik.values.description,
  //   });
  //   if (result.status === 200) {
  //     openNotification("success", "Successful", result.message);
  //     setTimeout(() => {
  //       handleClose();
  //       refresh();
  //     }, 1000);
  //   } else if (result.status !== 200) {
  //     openNotification("error", "Something went wrong ", result.message);
  //   }
  //   console.log(result);
  // };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
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
        // updateIdBasedCategory();
        formik.handleSubmit();
      }}
      header={[
        !isUpdate ? t("Create_Category") : t("Update_Category"),
        !isUpdate ? t("Create_New_Category") : t("Update_Selected_Category"),
      ]}
      footerBtn={[t("Cancel"), !isUpdate ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative h-full w-full dark:text-white">
        <FormInput
          title={t("Category")}
          placeholder={t("Category")}
          value={formik.values.category}
          change={(e) => {
            formik.setFieldValue("category", e);
          }}
          // error={formik.values.category ? "" : formik.errors.category}
          error={formik.touched.category && formik.errors.category}
          required={true}
          // Alphabet={true}
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

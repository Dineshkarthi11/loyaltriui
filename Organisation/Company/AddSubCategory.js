import React, { useEffect, useState } from "react";
// import FormInput from "../../common/FormInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import axios from "axios";
import API, { action } from "../../Api";
import { notification } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import TextArea from "../../common/TextArea";
import FormInput from "../../common/FormInput";
import Dropdown from "../../common/Dropdown";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddSubSubCategory({
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
  const [category, setCategory] = useState();
  const [functionRender, setFunctionRender] = useState();
  const [CategoryList, setCategoryList] = useState();
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
    close(false);
    // setShow(false);
    // closeShow();
  };

  const formik = useFormik({
    initialValues: {
      categoryId: null,
      subCategory: "",
      description: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      categoryId: yup.string().required("Category is required"),
      subCategory: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Subcategory must only contain letters")
        .required("Subcategory is required"),
      description: yup.string().required("Description is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // if (!e.subCategory || !e.description) {
      //   // Update the field names
      //   openNotification(
      //     "error",
      //     "Please fill the form properly",
      //     "All fields are required."
      //   );
      //   return;
      // }

      try {
        if (updateId) {
          const result = await action(API.UPDATE_SUB_CATEGORY, {
            id: updateId,
            companyId: companyId,
            categoryId: formik.values.categoryId,
            subCategory: formik.values.subCategory,
            description: formik.values.description,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
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
          const result = await action(API.ADD_SUB_CATEGORY, {
            companyId: companyDataId,
            categoryId: e.categoryId,
            subCategory: e.subCategory,
            description: e.description,
          });
          // error msg , if duplicate value submitted

          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
            // setFunctionRender(!functionRender);
            // window.location.reload()
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

  const getIdBasedSubCategoryList = async (e) => {
    // console.log(e, "e");
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_SUB_CATEGORY_ID_BASED_RECORDS, {
        id: e,
      });

      if (result.status === 200) {
        setCompanyId(result.result.companyId);

        formik.setFieldValue("categoryId", parseInt(result.result.categoryId));
        formik.setFieldValue("subCategory", result.result.subCategory);
        formik.setFieldValue("description", result.result.description);
        setIsUpdate(true);
      }
      // setGetIdBasedUpdatedRecords(result.data);
      // console.log(result.data);
    }
  };

  const getCategoryList = async () => {
    const result = await action(API.GET_CATEGORY);
    setCategoryList(
      result?.result?.map((each) => ({
        value: each.categoryId,
        label: each.category,
      }))
    );
  };

  useEffect(() => {
    getCategoryList();
  }, [functionRender]);

  useEffect(() => {
    // console.log(updateId, "updateData");
    getIdBasedSubCategoryList(updateId);
  }, [updateId]);

  // const updateIdBasedSubCategory = async () => {
  //   // console.log(updateId, formik.values.subCategory, formik.values.subCategory);
  //   const result = await action(API.UPDATE_SUB_CATEGORY, {
  //     id: updateId,
  //     subCategoryId: companyId,
  //     subCategory: formik.values.subCategory,
  //     description: formik.values.description,
  //   });
  //   if (result.status === 200) {
  //     openNotification("success", "Successful", result.message);
  //     formik.resetForm();
  //     setTimeout(() => {
  //       handleClose();
  //       refresh();
  //     }, 1000);
  //   } else if (result.status !== 200) {
  //     openNotification("error", "Something went wrong ", result.message);
  //   }
  //   console.log(result);
  // };

  const getCategory = async () => {
    try {
      const result = await action(API.GET_CATEGORY, {
        companyId: companyDataId,
      });
      setCategory(
        result.result?.map((each) => ({
          label: each.category,
          value: each.categoryId,
        }))
      );
    } catch (error) {
      openNotification("error", "Error", error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

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
        //updateIdBasedSubCategory();
        formik.handleSubmit();
      }}
      header={[
        !isUpdate ? t("Create_SubCategory") : t("Update_SubCategory"),
        !isUpdate
          ? t("Create_New_Subcategory")
          : t("Update_Selected_SubCategory"),
      ]}
      footerBtn={[t("Cancel"), !isUpdate ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="grid grid-cols-2 gap-6 ">
        <Dropdown
          title={t("Category")}
          placeholder={t("Choose_Category")}
          value={formik.values.categoryId}
          change={(e) => {
            formik.setFieldValue("categoryId", e);
          }}
          error={formik.values.categoryId ? "" : formik.errors.categoryId}
          options={category}
          required={true}
        />
        <FormInput
          title={t("Sub_Category")}
          placeholder={t("Sub_Category")}
          value={formik.values.subCategory}
          change={(e) => {
            formik.setFieldValue("subCategory", e);
          }}
          // error={formik.values.subCategory ? "" : formik.errors.subCategory}
          error={formik.touched.subCategory && formik.errors.subCategory}
          required={true}
          Alphabet={true}
        />
        <TextArea
          title={t("Description")}
          placeholder={t("Description")}
          className=" col-span-2"
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
          value={formik.values.description}
          error={formik.values.description ? "" : formik.errors.description}
          required={true}
        />
      </div>
    </DrawerPop>
  );
}

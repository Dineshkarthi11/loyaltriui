import { Drawer, notification } from "antd";
import React, { useEffect, useState } from "react";
import FormInput from "../../common/FormInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import axios from "axios";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddLocation({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  companyDataId = "",
}) {
  const { t } = useTranslation();
  const layout = useSelector((state) => state.layout.value);

  const [show, setShow] = useState(open);
  // Id based Data
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState();
  // const [UpdateBtn, setupdateBtn] = useState(false);
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
    setShow(false);
    // closeShow();
  };
  const formik = useFormik({
    initialValues: {
      location: "",
      description: "",
      isActive: 1,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      location: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, "Location must only contain letters")
        .required("Location is required"),
      description: yup.string().required("Description is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await action(API.UPDATE_LOCATION, {
            id: updateId,
            companyId: companyId,
            location: formik.values.location,
            description: formik.values.description,
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
        } else {
          console.log(API.ADD_LOCATION, {
            companyId: companyDataId,
            location: e.location,
            description: e.description,
            isActive: e.isActive,
          });
          const result = await action(API.ADD_LOCATION, {
            companyId: companyDataId,
            location: e.location,
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
  const getIdBasedLocationList = async (e) => {
    // console.log(e, "e");
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_LOCATIONID_BASED_RECORDS, { id: e });

      if (result.status === 200) {
        formik.setFieldValue("location", result.result.location);
        formik.setFieldValue("description", result.result.description);
        setCompanyId(result.result.companyId);
        setIsUpdate(true);
      }
      // setGetIdBasedUpdatedRecords(result.data);
      // console.log(result.data);
    }
  };
  useEffect(() => {
    // console.log(updateId, "updateData");
    getIdBasedLocationList(updateId);
  }, [updateId]);

  // const updateIdBasedLocation = async () => {
  //   // console.log(updateId, formik.values.location, formik.values.location);
  //   const result = await action(API.UPDATE_LOCATION, {
  //     id: updateId,
  //     companyId: companyId,
  //     location: formik.values.location,
  //     description: formik.values.description,
  //   });
  //   if (result.status === 200) {
  //     openNotification("success", "Successful", result.message);
  //     setTimeout(() => {
  //       handleClose();
  //       refresh();
  //     }, 1000);
  //     formik.resetForm();
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
        // updateIdBasedLocation();
        formik.handleSubmit();
      }}
      header={[
        !isUpdate ? t("Create_Location") : t("Update_Location"),
        !isUpdate ? t("Create_New_Location") : t("Update_Selected_Location"),
      ]}
      footerBtn={[t("Cancel"), !isUpdate ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full h-full ">
        <FormInput
          title={t("Location")}
          placeholder={t("Location")}
          value={formik.values.location}
          change={(e) => {
            formik.setFieldValue("location", e);
          }}
          // error={formik.values.location ? "" : formik.errors.location}
          error={formik.touched.location && formik.errors.location}
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
          Characters={true}
        />
      </FlexCol>
    </DrawerPop>
  );
}

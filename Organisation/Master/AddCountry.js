import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import FormInput from "../../common/FormInput";
import TextArea from "../../common/TextArea";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import * as yup from "yup";
import API, { action } from "../../Api";
import axios from "axios";
import { notification } from "antd";
import { HiMiniStar } from "react-icons/hi2";
import { useNotification } from "../../../Context/Notifications/Notification";
export default function AddCountry({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();
  const [addCountry, setAddCountry] = useState(open);

  const [UpdateBtn, setupdateBtn] = useState(false);

  const [functionRender, setFunctionRender] = useState(false);
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
  useMemo(
    () =>
      setTimeout(() => {
        addCountry === false && close(false);
      }, 800),
    [addCountry]
  );

  const handleClose = () => {
    setAddCountry(false);
  };
  const formik = useFormik({
    initialValues: {
      countryName: "",
      countryCode: "",
      description: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      countryName: yup.string().required("Country is required"),
      countryCode: yup.string().required("Country Code is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await action(API.UPDATE_COUNTRY, {
            id: updateId,
            countryName: formik.values.countryName,
            countryCode: formik.values.countryCode,
            description: formik.values.description,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_COUNTRY, {
            countryName: e.countryName,
            countryCode: e.countryCode,
            description: e.description,
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
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  const getIdBasedCountryRecords = async (e) => {
    try {
      if (e !== "" && updateId !== false) {
        const result = await action(API.GET_COUNTRY_BY_ID, { id: e });
        formik.setFieldValue("countryName", result.result.countryName);
        formik.setFieldValue("countryCode", result.result.countryCode);
        formik.setFieldValue("description", result.result.description);
        setupdateBtn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIdBasedCountryRecords(updateId);
  }, [updateId]);

  return (
    <DrawerPop
      open={addCountry}
      close={(e) => {
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        width: "540px",
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Create_Country") : t("Update_Country"),
        !UpdateBtn ? t("Create_New_Country") : t("Update_Selected_Country"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full h-full">
        <FormInput
          title={t("Country")}
          placeholder={t("Country")}
          change={(e) => {
            formik.setFieldValue("countryName", e);
          }}
          value={formik.values.countryName}
          error={formik.values.countryName ? "" : formik.errors.countryName}
          required={true}
        />

        <FormInput
          title={t("Country_Code")}
          placeholder={t("Country_Code")}
          change={(e) => {
            formik.setFieldValue("countryCode", e);
          }}
          value={formik.values.countryCode}
          error={formik.values.countryCode ? "" : formik.errors.countryCode}
          required={true}
        />

        <TextArea
          title={t("Description")}
          placeholder={t("Description")}
          change={(e) => formik.setFieldValue("description", e)}
          value={formik.values.description}
          error={formik.values.description ? "" : formik.errors.description}
          required={true}
        />

        {formik.errors.companyId && (
          <p className=" flex justify-start items-center my-1 mb-0 text-[10px] text-red-500">
            <HiMiniStar className="text-[10px]" />
            <span className="text-[10px] pl-1">{formik.errors.companyId}</span>
          </p>
        )}
      </FlexCol>
    </DrawerPop>
  );
}

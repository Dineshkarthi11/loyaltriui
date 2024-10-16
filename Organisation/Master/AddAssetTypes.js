import DrawerPop from "../../common/DrawerPop";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import * as yup from "yup";
import API, { action } from "../../Api";
import FormInput from "../../common/FormInput";
import MultiSelect from "../../common/MultiSelect";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import { getCompanyList } from "../../common/Functions/commonFunction";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddAssetTypes({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();

  const [companyList, setCompanyList] = useState([]);

  const [addAssets, setAddAssets] = useState(open);
  const [loading, setLoading] = useState(false);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
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
  useMemo(
    () =>
      setTimeout(() => {
        addAssets === false && close(false);
      }, 800),
    [addAssets]
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      date: "",
      companyId: [],
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      name: yup.string().required("Asset Type is required"),
      description: yup.string().required("Description is required"),
      companyId: yup
        .array()
        .min(1, "Company is required")
        .required("Company is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await action(API.UPDATE_ASSETS_TYPES, {
            id: updateId,
            assetType: formik.values.name,
            description: formik.values.description,
            companyId: formik.values.companyId,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              // getRecords();
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_ASSET_TYPE, {
            assetType: e.name,
            // date: e.date,
            description: e.description,
            companyId: e.companyId,
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

  const getCompany = async () => {
    try {
      const result = await getCompanyList(organisationId);
      setCompanyList(
        result?.map((each) => ({
          value: each.companyId,
          label: each.company,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCompany();
  }, []);

  const getIdBasedAssetsIdRecords = async (e) => {
    try {
      const result = await action(API.GET_ASSETS_TYPESID_BASED_RECORDS, {
        id: e,
      });
      formik.setFieldValue("name", result.result.assetType);
      formik.setFieldValue("description", result.result.description);
      formik.setFieldValue("companyId", result.result.companyId);
      setupdateBtn(true);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (updateId) getIdBasedAssetsIdRecords(updateId);
  }, [updateId]);

  const handleClose = () => {
    setAddAssets(false);
    formik.setFieldValue("name", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("companyId", "");
  };

  return (
    <DrawerPop
      open={addAssets}
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
        !UpdateBtn ? t("Create_Asset_Types") : t("Update_Asset_Types"),
        !UpdateBtn
          ? t("Create_New_Asset_Types")
          : t("Update_Selected_Asset_Types"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full h-full">
        <FormInput
          title={t("Asset_Type")}
          placeholder={t("Asset_Type")}
          change={(e) => {
            formik.setFieldValue("name", e);
          }}
          value={formik.values.name}
          error={formik.values.name ? "" : formik.errors.name}
          required={true}
        />
        <MultiSelect
          title={t("Choose_Company")}
          value={formik.values.companyId}
          change={(e) => {
            formik.setFieldValue("companyId", e);
          }}
          onSearch={(e) => {}}
          options={companyList}
          placeholder={t("Choose_Company")}
          className="text-sm"
          error={
            formik.values.companyId.length === 0 ? formik.errors.companyId : ""
          }
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
      </FlexCol>
    </DrawerPop>
  );
}

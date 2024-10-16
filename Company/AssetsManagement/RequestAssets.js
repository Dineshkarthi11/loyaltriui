import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import API, { action } from "../../Api";
import axios from "axios";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import TextArea from "../../common/TextArea";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function RequestAssets({
  open,
  close = () => {},
  companyDataId,
  refresh = () => {},
  employee,
  AssetData,
}) {
  // console.log(AssetData, "AssetData");
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  const [assetsTypes, seAssetsTypes] = useState([]);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  // console.log(employee, "employeeId");
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
  };
  useEffect(()=>{
    formik.setFieldValue("assetsType", AssetData.assetTypeId);
    formik.setFieldValue("description", AssetData.requestDescription);
  },[AssetData])
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getAssetTypes = async (e) => {
    try {
      const result = await action(API.GET_ASSETS_TYPES_RECORDS, {
        companyId: companyId,
      });
      seAssetsTypes(
        result.result.map((each) => ({
          label: each.assetType,
          value: each.assetTypeId,
        }))
      );
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAssetTypes();
  }, []);
  const formik = useFormik({
    initialValues: {
      assetsType: null,
      description: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      assetsType: yup.string().required("Assets Type is required"),
      description: yup.string().required("Description is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log(e);
      try {
        // console.log(API.REQUEST_EMPLOYEE_ASSETS, {
        //   employeeId: employee,
        //   companyId: companyId,
        //   assetsType: e.assetsType,
        //   description: e.description,
        // });
        if (AssetData && Object.keys(AssetData).length > 0) {
          const result = await action(API.UPDATE_EMPLOYEE_ASSETS, {
            employeeId: employee,
            companyId: companyId,
            assetTypeId: e.assetsType,
            requestDescription: e.description,
            requestStatus: "Pending",
            id: AssetData.employeeAssetRequestId,
          });
          
          // console.log(result);

          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1200);
            formik.resetForm();
          } else {
            openNotification("error", "Failed ", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.REQUEST_EMPLOYEE_ASSETS, {
            employeeId: employee,
            companyId: companyId,
            assetTypeId: e.assetsType,
            requestDescription: e.description,
            requestStatus: "Pending",
          });

          // console.log(result);
          
          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1200);
            formik.resetForm();
          } else {
            openNotification("error", "Failed ", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        // console.log(error);
        setLoading(false);
        openNotification("error", "Failed ", error.message);
      }
    },
  });
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
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
        !UpdateBtn ? t("Request_Asset") : t(""),
        !UpdateBtn
          ? t("Request work equipment and resources here.")
          : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <FlexCol>
        <Dropdown
          title={t("Asset_Type")}
          value={formik.values.assetsType}
          placeholder="Choose Asset Type"
          change={(e) => {
            formik.setFieldValue("assetsType", e);
          }}
          error={formik.errors.assetsType}
          required={true}
          options={assetsTypes}
        />

        <TextArea
          title={t("Description")}
          placeholder={t("Description")}
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
          error={formik.errors.description}
          required={true}
        />
      </FlexCol>
    </DrawerPop>
  );
}

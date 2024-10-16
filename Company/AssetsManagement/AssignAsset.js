import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Flex, notification } from "antd";
import API, { action } from "../../Api";
import axios from "axios";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import TextArea from "../../common/TextArea";
import FormInput from "../../common/FormInput";
import Heading from "../../common/Heading";
import RadioButton from "../../common/RadioButton";
import DateSelect from "../../common/DateSelect";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AssignAsset({
  open,
  close = () => {},
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [assetsTypes, seAssetsTypes] = useState([]);

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

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

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  // Drop Down

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
      // console.log(error);
    }
  };
  useEffect(() => {
    getAssetTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      assetsType: null,
      asset: "",
      description: "",
      iswarranty: 0,
      warrantyExpiry: "",
      assetRenewal: null,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      assetsType: yup.string().required("Asset Type is Required"),
      asset: yup.string().required("Asset Name is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log(e);
      try {
        // console.log(API.ADD_EMPLOYEE_ASSETS, {
        //   employeeId: employeeId, //employeeId,
        //   companyId: companyId,
        //   assetTypeId: e.assetsType,
        //   assetName: e.asset,
        //   description: e.description,
        //   isUnderwarranty: e.iswarranty,
        //   warrantyExpiry: e.warrantyExpiry,
        //   validUpto: e.assetRenewal,
        // });
        const result = await action(API.ADD_EMPLOYEE_ASSETS, [
          {
            employeeId: employeeId, //employeeId,
            companyId: companyId,
            assetTypeId: e.assetsType,
            assetName: e.asset,
            description: e.description,
            isUnderwarranty: e.iswarranty,
            warrantyExpiry: e.warrantyExpiry,
            validUpto: e.assetRenewal,
          },
        ]);

        if (result.status === 200) {
          openNotification(
            "success",
            "Successful",
            "Regularize saved. Changes are now reflected."
          );
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
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
        !UpdateBtn ? t("Assign_Asset") : t(""),
        !UpdateBtn
          ? t("Manage you companies here, and some lorem ipsu")
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
          placeholder="Choose  Asset Type"
          value={formik.values.assetsType}
          change={(e) => {
            formik.setFieldValue("assetsType", e);
          }}
          error={formik.errors.assetsType}
          required={true}
          options={assetsTypes}
        />
        <FormInput
          title={t("Asset Name")}
          placeholder="Asset Name"
          value={formik.values.asset}
          change={(e) => {
            formik.setFieldValue("asset", e);
          }}
        />
        <TextArea
          title={t("Description")}
          placeholder={t("Description")}
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
        />
        <Flex gap={8} className="">
          <Heading
            className={" "}
            title={t("Is_asset_under_warranty")}
            description={t("Set_asset_warrant_informations")}
          />
          <RadioButton
            options={[
              {
                label: t("Yes"),
                value: 1,
              },
              {
                label: t("No"),
                value: 0,
              },
            ]}
            value={formik.values.iswarranty}
            change={(e) => {
              formik.setFieldValue("iswarranty", e);
            }}
          />
        </Flex>

        {formik.values.iswarranty === 1 && (
          <>
            <DateSelect
              title={t("Warranty_Expiry")}
              value={formik.values.warrantyExpiry}
              change={(e) => {
                formik.setFieldValue("warrantyExpiry", e);
              }}
            />
            <DateSelect
              title={t("Asset_Renewal")}
              value={formik.values.assetRenewal}
              change={(e) => {
                formik.setFieldValue("assetRenewal", e);
              }}
            />
          </>
        )}
      </FlexCol>
    </DrawerPop>
  );
}

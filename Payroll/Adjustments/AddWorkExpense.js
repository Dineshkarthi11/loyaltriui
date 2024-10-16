import DrawerPop from "../../common/DrawerPop";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import * as yup from "yup";
import { HiMiniStar } from "react-icons/hi2";
import { DatePicker, Drawer, notification } from "antd";
import API, { action } from "../../Api";
import FormInput from "../../common/FormInput";
import MultiSelect from "../../common/MultiSelect";
import DateSelect from "../../common/DateSelect";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import FileUpload from "../../common/FileUpload";
import { getCompanyList } from "../../common/Functions/commonFunction";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddWorkExpence({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();

  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addAssets, setAddAssets] = useState(open);
  const [navigationBtn, setNavigationBtn] = useState();
  const layout = useSelector((state) => state.layout.value);
  const [assetsId, setAssetsId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
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
  const options = [
    { value: "cordova", label: "Cordova" },
    { value: "cordovaEduaction", label: "Cordova Eduaction" },
    { value: "edvimEduaction", label: "Edvim Eduaction" },
  ];

  const header = [
    {
      assetsTypes: [
        { id: 1, title: "Name", value: "assetType" },
        { id: 2, title: "Description", value: "description" },

        { id: 3, title: "Companies", value: "company" },
      ],
    },
  ];
  const navigateBtn = [
    {
      id: 1,
      title: "Assets Types",
      value: "assetsTypes",
    },
  ];

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
      console.log(API.ADD_ASSET_TYPE, {
        // companyId: companyDataId,
        companyId: e.companyId,
        assetType: e.name,
        description: e.description,
        date: e.date,
      });

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
              setLoading(false);
              refresh();
            }, 1000);
          } else if (result.status !== 200) {
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
          console.log(result);
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              // getRecords();
              refresh();
              setLoading(false);
            }, 1000);
          }
        }
      } catch (error) {
        console.log(error);
        openNotification("error", "Failed ", error);
        setLoading(false);
      }
    },
  });

  // const getRecords = async () => {
  //   const result = await axios.get(API.HOST + API.GET_ASSETS_TYPES_RECORDS);
  //   setAssetsList(result.data.tbl_assetType);
  //   console.log(result);
  // };

  const getCompany = async () => {
    const result = await getCompanyList(organisationId);
    // setCompanyList(result.data.tbl_company)
    setCompanyList(
      result?.map((each) => ({
        value: each.companyId,
        label: each.company,
      }))
    );

    // console.log(result);
  };

  useEffect(() => {
    // getRecords();
    getCompany();
  }, []);

  // useEffect(() => {
  //   console.log(addAssets);
  // }, [addAssets]);

  // const getIdBasedAssetsIdRecords = async (e) => {
  //   const result = await action(API.GET_ASSETS_TYPESID_BASED_RECORDS, {
  //     id: e,
  //   });
  //   formik.setFieldValue("name", result.result.assetType);
  //   formik.setFieldValue("description", result.result.description);
  //   // formik.setFieldValue("date", result.data.date);
  //   formik.setFieldValue("companyId", result.result.companyId);
  //   console.log(typeof result.result.companyId);
  //   setupdateBtn(true);

  //   console.log(result);
  // };
  // useEffect(() => {
  //   if (updateId) getIdBasedAssetsIdRecords(updateId);
  // }, [updateId]);

  const handleClose = () => {
    close(false);

    setAddAssets(false);
    formik.setFieldValue("name", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("companyId", "");
    // formik.setFieldValue("date", "");
  };
  const handleShow = () => setAddAssets(true);

  return (
    <DrawerPop
      open={addAssets}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        // UpdateIdBasedAssetsTypes();
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Add Work Expense") : t("Update Work Expense"),
        !UpdateBtn
          ? t("Create New Work Expense")
          : t("Update New Work Expense"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full">
        <FileUpload />
        <FormInput
          title={t("Employee Name")}
          placeholder={t("Employee Name")}
          change={(e) => {
            formik.setFieldValue("name", e);
          }}
          value={formik.values.name}
          error={formik.values.name ? "" : formik.errors.name}
          required={true}
        />

        <Dropdown placeholder="Choose any" title="Category" />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            title={t("Reference")}
            placeholder={t("Reference")}
            change={(e) => {
              formik.setFieldValue("reference", e);
            }}
            value={formik.values.name}
            error={formik.values.name ? "" : formik.errors.name}
            required={true}
          />
          <DateSelect
            title="Date of Spend"
            change={(e) => formik.setFieldValue("date", e)}
          />
        </div>

        <TextArea
          title={t("Description")}
          placeholder={t(" Type Here..")}
          change={(e) => formik.setFieldValue("remearks", e)}
          value={formik.values.description}
          error={formik.values.description ? "" : formik.errors.description}
          required={true}
        />
        <div className="grid grid-cols-2 gap-4">
          <Dropdown placeholder="AED" title="Currency" />
          <FormInput
            title={t("Amount Spend")}
            placeholder={t("Type here...")}
            change={(e) => {
              formik.setFieldValue("amount", e);
            }}
            value={formik.values.name}
            error={formik.values.name ? "" : formik.errors.name}
            required={true}
            className=""
          />
        </div>
      </FlexCol>
    </DrawerPop>
  );
}

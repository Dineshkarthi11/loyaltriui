import React, { useEffect, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import API from "../../Api";
import axios from "axios";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import TextArea from "../../common/TextArea";
import FormInput from "../../common/FormInput";
import DateSelect from "../../common/DateSelect";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function CreateNewAssets({
  open,
  close = () => {},
  employeeId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  const handleClose = () => {
    close(false);
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
  const formik = useFormik({
    initialValues: {
      assetsType: "",
      availableAsset: "",
      description: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      assetsType: yup.string().required("Assets Type is required"),
      availableAsset: yup.string().required("Available Asset is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log(e);
      try {
        // console.log(API.HOST + API.CREATE_LEAVE_REQUEST);
        const result = await axios.post(API.HOST + API.CREATE_LEAVE_REQUEST, {
          assetsType: e.assetsType,
          availableAsset: e.availableAsset,
          description: e.description,
        });
        
        // console.log(result);
        
        if (result.data.status === 200) {
          openNotification(
            "success",
            "Successful",
            "Regularize saved. Changes are now reflected."
          );
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 500);
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
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={
        {
          // maxWidth: "600px",
        }
      }
      handleSubmit={(e) => {
        // console.log(e);
        //   formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Add New Asset") : t(""),
        !UpdateBtn
          ? t("Manage you companies here, and some lorem ipsu")
          : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("Add Document")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"grid grid-cols-2"}>
        <h1 className="h2 col-span-2">Asset overview</h1>
        <div className="col-span-2">
          <FormInput
            title="Serial Number"
            placeholder="Type here..."
            value={formik.values.assetsType}
            change={(e) => {
              formik.setFieldValue("assetsType", e);
            }}
            required={true}
            className=""
          />
        </div>
        <Dropdown
          title="Type"
          placeholder="Select"
          value={formik.values.availableAsset}
          change={(e) => {
            formik.setFieldValue("availableAsset", e);
          }}
          className="col-span-2"
        />
        <Dropdown
          title="Make"
          placeholder="Select"
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
        />
        <Dropdown
          title="Model"
          placeholder="Select"
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
        />
        <DateSelect
          title="Purchase Date"
          placeholder="dd--mm--yyyy"
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
        />
        <Dropdown
          title="Status"
          placeholder="Select"
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
        />
      </FlexCol>
    </DrawerPop>
  );
}

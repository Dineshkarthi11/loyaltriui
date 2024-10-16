import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import API, { action } from "../../../Api";
import axios from "axios";
import DrawerPop from "../../../common/DrawerPop";
import FlexCol from "../../../common/FlexCol";
import Dropdown from "../../../common/Dropdown";
import FormInput from "../../../common/FormInput";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function ContactInformation({
  open,
  close = () => {},
  updateData,
  employeeId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [overTimePolicy, setOverTimePolicy] = useState([]);
  const [timeOutPolicy, setTimeOutPolicy] = useState([]);
  const [shortTimePolicy, setShortTimePolicy] = useState([]);
  const [missPunchPolicy, setMissPunchPolicy] = useState([]);
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState([]);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
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

  const formik = useFormik({
    initialValues: {
      email: "",
      number: "",
      zipCode: "",
      address: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required")
        .test(
          "is-valid-email",
          "Please enter a valid email",
          (value) =>
            value &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)
        ),
      number: yup
        .string()
        .min(10, "Mobile must be at least 10 characters")
        .max(15, "Mobile must be at most 15 characters")
        .required("Mobile Number is required"),
      address: yup.string().required("Address is required"),
      zipCode: yup
        .string()
        .required("Postal/ZIP code is required")
        .min(3, "Postal/ZIP code must be at least 3 characters")
        .max(6, "Postal/ZIP code must be at most 6 characters"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.UPDATE_PERSONAL_INFORMATION, {
          employeeId: updateData.employeeId,
          companyId: updateData.companyId,
          
          fields: {
            email: e.email,
            phone: e.number,
            address: e.address,
            cityId: e.city,
            zipCode: e.zipCode,
          },
          // employeeAddressModel: {
          //   address: e.address,
          //   cityId: e.city,
          //   zipCode: e.zipCode,
          // },
          // employeeCompanyModel: {
          //   companyId: updateData.companyId,
          // },
        });        
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 500);
          formik.resetForm();
        }
      } catch (error) {
        openNotification("error", "Failed ", error);
        setLoading(false);
      }
    },
  });

  const getCity = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);

      result.result.map(
        (each) =>
          parseInt(updateData.countryId) === parseInt(each.countryId) &&
          each.stateData.map((each) => {
            parseInt(updateData.countryId) === parseInt(each.stateId) &&
              setCity(
                each.cityData.map((each) => ({
                  label: each.city,
                  value: each.cityId,
                }))
              );
          })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    formik.setFieldValue("email", updateData.email);
    formik.setFieldValue("number", updateData.phone);
    formik.setFieldValue("address", updateData.address);
    formik.setFieldValue("zipCode", updateData.zipCode);
  }, [updateData]);

  useEffect(() => {
    getCity();
  }, []);

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
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Contact Information") : t(""),
        !UpdateBtn ? "Manage Employee contact information" : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <FormInput
          title="Personal Mail"
          value={formik.values.email}
          change={(e) => {
            let value = e;
            value = value.trim();
            value = value.toLowerCase()
            formik.setFieldValue("email", value);
          }}
          options={timeOutPolicy}
          placeholder="Personal Mail"
          required={true}
          error={formik.errors.email}
        />
        <FormInput
          title="Personal Number"
          value={formik.values.number}
          change={(e) => {
            const value = e.replace(/[^0-9]/g, "");
            formik.setFieldValue("number", value);
          }}
          options={overTimePolicy}
          placeholder="Personal Number"
          error={formik.errors.number}
          required={true}
          maxLength={15}
        />
        <FormInput
          title="Address"
          value={formik.values.address}
          change={(e) => {
            formik.setFieldValue("address", e);
          }}
          // options={city}
          placeholder="Address"
          error={formik.errors.address}
          required={true}
        />
        <FormInput
          title="Postal/ZIP Code"
          value={formik.values.zipCode}
          change={(e) => {
            const value = e.replace(/[^0-9]/g, "");
            formik.setFieldValue("zipCode", value);
          }}
          options={missPunchPolicy}
          placeholder="Postal/ZIP Code"
          error={formik.errors.zipCode}
          required={true}
          maxLength={6}
        />
      </FlexCol>
    </DrawerPop>
  );
}

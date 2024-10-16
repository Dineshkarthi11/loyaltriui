import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../../common/FlexCol";
import FormInput from "../../../common/FormInput";
import { useTranslation } from "react-i18next";

import API, { action } from "../../../Api";
import DrawerPop from "../../../common/DrawerPop";
import { useFormik } from "formik";
import * as yup from "yup";
import Dropdown from "../../../common/Dropdown";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function AddressInformation({
  open,
  close = () => {},
  updateData,
  employeeId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [loading, setLoading] = useState(false);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);

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

  const getCountry = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);
      setCountry(
        result.result.map((each) => ({
          label: each.countryName,
          value: each.countryId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getState = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);
      result.result.map(
        (each) =>
          formik.values.country === each.countryId &&
          setState(
            each.stateData.map((each) => ({
              label: each.stateName,
              value: each.stateId,
            }))
          )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getCity = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);

      result.result.map(
        (each) =>
          formik.values.country === each.countryId &&
          each.stateData.map((each) => {
            parseInt(formik.values.state) === parseInt(each.stateId) &&
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

  const formik = useFormik({
    initialValues: {
      country: "",
      state: "",
      city: "",
      zipcode: "",
      // Location: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      zipcode: yup
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
          // employeeModel: {
          //   firstName: updateData.firstName,
          // },
          fields: {
            countryId: e.country,
            stateId: e.state,
            cityId: e.city,
            zipCode: e.zipcode,
            // locationId: e.Location,
          },
          // employeeCompanyModel: {
          //   companyId: updateData.companyId,
          // },
        });

        // console.log(result);

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
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

  useEffect(() => {
    formik.setFieldValue("country", updateData.countryId);
    formik.setFieldValue("state", updateData.stateId);
    formik.setFieldValue("city", updateData.cityId);
    formik.setFieldValue("zipcode", updateData.zipCode);
    // formik.setFieldValue("Location", updateData.locationId);
  }, [updateData]);

  useEffect(() => {
    getCountry();
    getState();
    getCity();
    // getLocation();
  }, [formik.values.country, formik.values.state, formik.values.city]);
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
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
        !UpdateBtn ? t("Address Information") : t(""),
        !UpdateBtn ? "Manage employee address information" : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <Dropdown
          title="Country"
          value={formik.values.country}
          change={(e) => {
            formik.setFieldValue("country", e);
            formik.setFieldValue("state", "");
            formik.setFieldValue("city", "");
          }}
          options={country}
          required={true}
          error={formik.errors.country}
        />
        <Dropdown
          title="Province State"
          value={formik.values.state}
          change={(e) => {
            formik.setFieldValue("state", e);
          }}
          options={state}
          required={true}
          error={formik.errors.state}
        />
        <Dropdown
          title="City"
          value={formik.values.city}
          change={(e) => {
            formik.setFieldValue("city", e);
          }}
          options={city}
          required={true}
          error={formik.errors.city}
        />
        <FormInput
          title="Postal Code"
          placeholder="Postal Code"
          value={formik.values.zipcode}
          change={(e) => {
            const value = e.replace(/[^0-9]/g, "");
            formik.setFieldValue("zipcode", value);
          }}
          error={formik.errors.zipcode}
          required={true}
          maxLength={6}
        />
      </FlexCol>
    </DrawerPop>
  );
}

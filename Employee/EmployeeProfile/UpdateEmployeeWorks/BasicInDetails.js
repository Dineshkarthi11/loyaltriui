import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../../common/FlexCol";
import FormInput from "../../../common/FormInput";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import API, { action } from "../../../Api";
import DrawerPop from "../../../common/DrawerPop";
import { useFormik } from "formik";
import * as yup from "yup";
import DateSelect from "../../../common/DateSelect";
import RadioButton from "../../../common/RadioButton";
import Dropdown from "../../../common/Dropdown";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function BasicInDetails({
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
  const [loading, setLoading] = useState(false);
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );

  const [designationList, setDesignationList] = useState([]);
  const [shiftSchemeList, setShiftSchemeList] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [company, setCompany] = useState([]);
  const [location, setLocation] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [country, setCountry] = useState([]);

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
  const Gender = [
    {
      id: 1,
      label: t("Male"),
      value: "male",
    },
    {
      id: 2,
      label: t("Female"),
      value: "female",
    },
    {
      id: 3,
      label: t("Others"),
      value: "others",
    },
  ];
  useEffect(() => {
    getCountry();
  }, []);

  useEffect(() => {
    // console.log(updateData,"updateDataLIst");

    formik.setFieldValue("firstName", updateData.firstName);
    formik.setFieldValue("lastName", updateData.lastName);
    formik.setFieldValue("fatherOrHusbandName", updateData.fatherOrHusbandName);
    formik.setFieldValue("dateOfBirth", updateData.dateOfBirth);
    formik.setFieldValue("gender", updateData.gender?.toLowerCase());
    formik.setFieldValue("nationality", updateData.countryId);
  }, [updateData]);

  const getCountry = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);
      // console.log(result);
      setCountry(
        result.result.map((each) => ({
          label: each.countryName,
          value: each.countryId,
        }))
      );

      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      fatherOrHusbandName: "",
      dateOfBirth: "",
      gender: "",
      // nationality: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      firstName: yup.string().required("First Name is Required"),
      // description: yup.string().required("Description is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.UPDATE_PERSONAL_INFORMATION, {
          employeeId: updateData.employeeId,
          companyId: updateData.companyId,

          fields: {
            firstName:
              e.firstName.charAt(0).toUpperCase() + e.firstName.slice(1),
            lastName: e.lastName,
            fatherOrHusbandName:
              e.fatherOrHusbandName.charAt(0).toUpperCase() + e.fatherOrHusbandName.slice(1),
            dateOfBirth: e.dateOfBirth,
            gender: e.gender,
          },
        });

        // console.log(result);

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
        // console.log(error);
        openNotification("error", "Failed ", error);
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
        !UpdateBtn ? t("Basic Information") : t(""),
        !UpdateBtn ? t("Manage Employee Basic information") : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={"col-span-2"}>
        <FormInput
          title="First Name"
          value={formik.values.firstName}
          change={(e) => {
            formik.setFieldValue("firstName", e);
          }}
          options={company}
          required={true}
          placeholder="First Name"
          error={formik.errors.firstName}
        />
        <FormInput
          title="Last Name"
          value={formik.values.lastName}
          change={(e) => {
            formik.setFieldValue("lastName", e);
          }}
          options={designationList}
          placeholder="Last Name"
        />
        <FormInput
          title="Father Name"
          value={formik.values.fatherOrHusbandName}
          change={(e) => {
            formik.setFieldValue("fatherOrHusbandName", e);
          }}
          placeholder="Father Name"
        />
        <DateSelect
          title="Date of Birth"
          value={formik.values.dateOfBirth}
          change={(e) => {
            formik.setFieldValue("dateOfBirth", e);
          }}
          options={departmentList}
        />
        <RadioButton
          title={t("Select_Gender")}
          options={Gender}
          value={formik.values.gender}
          change={(e) => {
            // console.log(e);
            formik.setFieldValue("gender", e);
          }}
          // error={formik.err  ors.gender}
          error={formik.errors.gender}
          required={true}
        />
        {/* <Dropdown
          title="Nationality"
          value={formik.values.nationality}
          change={(e) => {
            formik.setFieldValue("nationality", e);
          }}
          options={country}
        /> */}
      </FlexCol>
    </DrawerPop>
  );
}

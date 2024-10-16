import React, { useEffect, useMemo, useState } from "react";
import { notification } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FormInput from "../../common/FormInput";
import MultiSelect from "../../common/MultiSelect";
import API, { action } from "../../Api";
import { getCompanyList } from "../../common/Functions/commonFunction";
import { useNotification } from "../../../Context/Notifications/Notification";
import FlexCol from "../../common/FlexCol";
import CheckBoxInput from "../../common/CheckBoxInput";
import { lowerCase } from "lodash";

export default function AddMasterAdmin({
  open,
  close = () => {},
  updateId,
  // closeShow,
  refresh,
}) {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState();
  const [isUpdate, setIsUpdate] = useState();
  const [show, setShow] = useState(open);
  const [company, setCompany] = useState([]);
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );
  const [masterAdmin, setMasterdetails] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
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
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setCompanyId("");
    setShow(false);
    setDisableButton(false);
  };

  const getCompany = async () => {
    try {
      const result = await getCompanyList(organisationId);
      setCompany(
        result.map((each) => ({
          label: each.company,
          value: each.companyId,
        }))
      );
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCompany();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      companyId: null,
      resetPassword: 0,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is Required"),
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
      password: yup.string().required("Password is Required"),
      contactNumber: yup
        .string()
        .min(10, "Phone Number must be at least 10 digits long")
        .max(12, "Phone Number must be at most 12 digits long")
        .required("Mobile Number is required"),
      companyId: yup.array().required("Company is Required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        setDisableButton(true);
        if (updateId) {
          const result = await action(API.UPDATE_MASTER_ADMIN, {
            companyId: e.companyId,
            firstName: e.name,
            email: e.email,
            phone: e.contactNumber,
            password: e.password,
            resetPassword: e.resetPassword,
            employeeId: updateId,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              formik.resetForm();
              setLoading(false);
            }, 1500);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_MASTER_ADMIN, {
            companyId: e.companyId,
            firstName: e.name,
            email: e.email,
            phone: e.contactNumber,
            password: e.password,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              formik.resetForm();
              setLoading(false);
            }, 1000);
          } else {
            openNotification(
              "error",
              "Info",
              ...Object.keys(result.message).map((each) => result.message[each])
            );
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });
  const getMasterDetails = async () => {
    try {
      const result = await action(API.GET_ID_BASED_MASTER_ADMIN, {
        employeeId: updateId,
      });
      if (result.status === 200) {
        setMasterdetails(result.result);
        formik.setFieldValue("name", result.result.firstName);
        formik.setFieldValue("email", result.result.email);
        formik.setFieldValue("password", result.result.password);
        formik.setFieldValue("contactNumber", result.result.phone);
        formik.setFieldValue("companyId", result.result.companyId);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useMemo(() => getMasterDetails(), [updateId]);

  return (
    <div>
      {show && (
        <DrawerPop
          open={show}
          close={(e) => {
            // console.log(e);
            handleClose();
          }}
          contentWrapperStyle={{
            width: "540px",
          }}
          handleSubmit={(e) => {
            if (!disableButton) {
              formik.handleSubmit();
            }
          }}
          updateBtn={isUpdate}
          updateFun={() => {
            // formik.handleSubmit();
            // updateCompany();
          }}
          header={[
            !updateId
              ? t("Create New Super Admin")
              : t("Update Selected Super Admin"),
            !updateId
              ? t("Create New Super Admin")
              : t("Update Selected Super Admin"),
          ]}
          footerBtn={[t("Cancel"), t("Save")]}
          footerBtnDisabled={loading}
        >
          <FlexCol gap={17} className="relative w-full h-full">
            <FormInput
              title={t("Name")}
              placeholder={t("Name")}
              change={(e) => {
                formik.setFieldValue("name", e);
              }}
              value={formik.values.name}
              error={formik.errors.name}
              required={true}
            />

            <FormInput
              title={t("Email")}
              placeholder={t("Email")}
              change={(e) => {
                let value = e;
                value = value.trim();
                value = value.toLowerCase();
                formik.setFieldValue("email", value);
              }}
              value={formik.values.email}
              error={formik.errors.email}
              required={true}
            />
            {updateId ? (
              <div className="flex flex-col gap-4">
                <CheckBoxInput
                  titleRight="Reset Password"
                  value={formik.values.resetPassword}
                  change={(e) => {
                    formik.setFieldValue("password", "");
                    formik.setFieldValue("resetPassword", e);
                  }}
                />
                <>
                  {formik.values.resetPassword ? (
                    <FormInput
                      title={t("Password")}
                      placeholder={t("Password")}
                      change={(e) => {
                        formik.setFieldValue("password", e);
                      }}
                      value={formik.values.password}
                      error={formik.errors.password}
                      required={true}
                    />
                  ) : null}
                </>
              </div>
            ) : (
              <FormInput
                title={t("Password")}
                placeholder={t("Password")}
                change={(e) => {
                  formik.setFieldValue("password", e);
                }}
                value={formik.values.password}
                error={formik.errors.password}
                required={true}
              />
            )}

            <FormInput
              title={t("Phone Number")}
              placeholder={t("Contact Number")}
              change={(e) => {
                formik.setFieldValue("contactNumber", e);
              }}
              value={formik.values.contactNumber}
              error={formik.errors.contactNumber}
              type="number"
              required={true}
              maxLength={12}
            />

            <MultiSelect
              title={t("Choose_Company")}
              change={(e) => {
                formik.setFieldValue("companyId", e);
              }}
              options={company}
              placeholder={t("Choose_Company")}
              value={formik.values.companyId}
              error={formik.errors.companyId}
              required={true}
            />
          </FlexCol>
        </DrawerPop>
      )}
    </div>
  );
}

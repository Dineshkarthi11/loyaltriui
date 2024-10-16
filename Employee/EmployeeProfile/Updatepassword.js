import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import { PiLockLight } from "react-icons/pi";
import PasswordInput from "../../common/PasswordInput";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import API, { action } from "../../Api";
import * as yup from "yup";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Updatepassword({ open, close = () => {}, employee }) {
  const [show, setShow] = useState(open);
  const [UpdateBtn, setUpdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = useParams();
  const { t } = useTranslation();
  const [firstloading, setFirstLoading] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirstLoading(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

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

  // console.log(employeeId, "employee id data in update password")

  const formik = useFormik({
    initialValues: {
      employeeId: employeeId,
      oldPassword: "",
      newPassword: "",
      confirmpassword: "",
    },
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      //   currentpassword: yup.string().required("Current password is required"),
      //   newpassword: yup.string().required("New password is required"),
      //   confirmpassword: yup.string()
      // .required("Confirm password is required")
      // .test('passwords-match', 'Passwords must match', function(value) {
      //   return value === this.parent.newpassword
      // })
      oldPassword: yup.string().required("Current password is required"),
      newPassword: yup
        .string()
        .trim() // Removes leading and trailing whitespace
        .min(8, "Password must be at least 8 characters")
        .matches(/^\S*$/, "Password cannot contain spaces")
        .required("New password is required"),

      confirmpassword: yup
        .string()
        .trim() // Removes leading and trailing whitespace
        .min(8, "Password must be at least 8 characters")
        .matches(/^\S*$/, "Password cannot contain spaces")
        .required("Confirm password is required"),
    }),
    onSubmit: async (e) => {
      // console.log(
      //   {
      //     oldPassword: e.oldPassword,
      //     newPassword: e.newPassword,
      //     confirmpassword: e.confirmpassword
      //   },
      //   "entered values");

      try {
        if (e.oldPassword === e.newPassword) {
          formik.setFieldError(
            "newPassword",
            "New password must not match with old password"
          );
          return;
        }
        if (e.newPassword !== e.confirmpassword) {
          // Handle error if passwords do not match
          formik.setFieldError("confirmpassword", "Passwords must match");
          return;
        }
        setLoading(true);
        const result = await action(API.UPDATE_PASSWORD, {
          employeeId: employeeId,
          oldPassword: e.oldPassword,
          newPassword: e.newPassword,
          // confirmpassword: e.confirmpassword
        });

        if (result.status === 200) {
          openNotification(
            "success",
            "Success",
            "Password updated successfully"
          );
          setTimeout(() => {
            handleClose();
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Failure", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error.message);
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
      handleSubmit={() => formik.handleSubmit()}
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn ? t("Update Password") : t(""),
        !UpdateBtn ? t("Update Password.") : t(""),
      ]}
      footerBtn={[t("Cancel "), !UpdateBtn ? t("Change Password") : t("")]}
      footerBtnDisabled={loading}
    >
      <div className="flex flex-col gap-8">
        <PasswordInput
          title="Current password"
          placeholder="Current password"
          icon={<PiLockLight className="text-gray-500" />}
          value={formik.values.oldPassword}
          change={(e) => {
            firstloading === 0
              ? formik.setFieldValue("oldPassword", "")
              : formik.setFieldValue("oldPassword", e);
          }} // to solve the first loading issue of password , if the password is saved @ google.
          // change={formik.handleChange}
          error={formik.errors.oldPassword}
          required={true}
        />
        <PasswordInput
          title="New password"
          placeholder="New password"
          icon={<PiLockLight className="text-gray-500" />}
          value={formik.values.newPassword}
          change={(e) => {
            let value = e;
            value = value.trim();
            formik.setFieldValue("newPassword", value);
          }}
          // change={formik.handleChange}
          error={formik.errors.newPassword}
          required={true}
        />
        <PasswordInput
          title="Confirm password"
          placeholder="Confirm password"
          icon={<PiLockLight className="text-gray-500" />}
          value={formik.values.confirmpassword}
          change={(e) => {
            let value = e;
            value = value.trim();
            formik.setFieldValue("confirmpassword", value);
          }}
          // change={formik.handleChange}
          error={formik.errors.confirmpassword}
          required={true}
        />
      </div>
    </DrawerPop>
  );
}

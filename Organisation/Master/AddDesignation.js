import React, { useEffect, useMemo, useState } from "react";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import DrawerPop from "../../common/DrawerPop";
import FormInput from "../../common/FormInput";
import MultiSelect from "../../common/MultiSelect";
import TextArea from "../../common/TextArea";
import { getCompanyList } from "../../common/Functions/commonFunction";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddDesignation({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();

  const [addDesignation, setAddDesignation] = useState(open);

  const [functionRender, setFunctionRender] = useState(false);
  const [organisationId, setOrganisationId] = useState(
    localStorage.getItem("organisationId")
  );
  const handleClose = () => {
    setAddDesignation(false);
  };

  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyList, setCompanyList] = useState([]);
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
        addDesignation === false && close(false);
      }, 800),
    [addDesignation]
  );

  const formik = useFormik({
    initialValues: {
      designation: "",
      companyId: [],
      description: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      designation: yup.string().required("Designation is required"),
      companyId: yup
        .array()
        .min(1, "Company is required")
        .required("Company is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId) {
          const result = await action(API.UPDATE_DESIGNATION, {
            id: updateId,
            designation: formik.values.designation,
            companyId: formik.values.companyId,
            description: formik.values.description,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_DESIGNATION, {
            designation: e.designation,
            companyId: e.companyId,
            description: e.description,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
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
  }, [functionRender]);

  const getDesignationById = async (e) => {
    try {
      if (e !== "" && updateId !== false) {
        const result = await action(API.GET_DESIGNATIONID_BASED_RECORDS, {
          id: e,
        });
        formik.setFieldValue("designation", result.result.designation);
        formik.setFieldValue("companyId", result.result.companyId);
        formik.setFieldValue("description", result.result.description);
        setupdateBtn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDesignationById(updateId);
  }, [updateId]);

  return (
    <DrawerPop
      open={addDesignation}
      close={(e) => {
        handleClose();
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
        !UpdateBtn ? t("Create_Designation") : t("Update_Designation"),
        !UpdateBtn ? t("Create_New_Designation") : t("Update_Designation"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative w-full h-full">
        <div className="py-1">
          <FormInput
            title={t("Designation_Name")}
            placeholder={t("Designation_Name")}
            change={(e) => {
              formik.setFieldValue("designation", e);
            }}
            value={formik.values.designation}
            error={formik.values.designation ? "" : formik.errors.designation}
            required={true}
          />
        </div>

        <div className="pt-[30px] ">
          <MultiSelect
            title={t("Choose_Company")}
            change={(e) => {
              formik.setFieldValue("companyId", e);
            }}
            options={companyList}
            placeholder={t("Choose_Company")}
            value={formik.values.companyId}
            error={formik.errors.companyId}
            required={true}
          />
        </div>

        <div className="pt-[30px]">
          <TextArea
            title={t("Description")}
            placeholder={t("Description")}
            className=""
            change={(e) => {
              formik.setFieldValue("description", e);
            }}
            value={formik.values.description}
            error={formik.values.description ? "" : formik.errors.description}
            required={true}
          />
        </div>
      </div>
    </DrawerPop>
  );
}

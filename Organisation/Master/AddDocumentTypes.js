import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import * as yup from "yup";
import API, { action } from "../../Api";
import DrawerPop from "../../common/DrawerPop";
import FormInput from "../../common/FormInput";
import ToggleBtn from "../../common/ToggleBtn";
import TextArea from "../../common/TextArea";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function AddDocumentTypes({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();

  const [addDocuments, setAddDocuments] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
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
        addDocuments === false && close(false);
      }, 800),
    [addDocuments]
  );

  const formik = useFormik({
    initialValues: {
      documentType: "",
      description: "",
      mandatoryType: "",
      expiryReminders: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      documentName: yup.string().required("Document Type is required"),
      description: yup.string().required("Description is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true)
      try {
        if (updateId) {
          const result = await action(API.UPDATE_DOCUMENT_TYPES, {
            id: updateId,
            companyId: companyDataId,
            documentType: formik.values.documentName,
            description: formik.values.description,
            mandatoryType: formik.values.mandatoryType,
            expiryReminders: formik.values.expiryReminders,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
              setLoading(false);
            }, 1000);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_DOCUMENT_TYPES, {
            companyId: companyDataId,
            documentType: e.documentName,
            description: e.description,
            mandatoryType: e.mandatoryType,
            expiryReminders: e.expiryReminders,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              setFunctionRender(!functionRender);
              refresh();
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

  const getDocumentIdRecords = async (e) => {
    try {
      if (e !== "" && updateId !== false) {
        const result = await action(API.GET_DOCUMENTID_BASED_RECORDS, {
          id: e,
        });
        formik.setFieldValue("documentName", result.result.documentType);
        formik.setFieldValue("description", result.result.description);
        formik.setFieldValue("mandatoryType", result.result.mandatoryType);
        formik.setFieldValue("expiryReminders", result.result.expiryReminders);
        setupdateBtn(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getDocumentIdRecords(updateId);
  }, [updateId]);

  const handleClose = () => {
    setAddDocuments(false);
    formik.setFieldValue("documentName", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("mandatoryType", "");
    formik.setFieldValue("expiryReminders", "");
  };
  return (
    <DrawerPop
      open={addDocuments}
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
        !UpdateBtn ? t("Create_Document_Type") : t("Update_Document_Type"),
        !UpdateBtn
          ? t("Create_a_New_Document_Type")
          : t("Update_Selected_Document_Type"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <div className="relative flex flex-col w-full h-full gap-6">
        <FormInput
          title={t("Document_Type")}
          placeholder={t("Document_Type")}
          change={(e) => {
            formik.setFieldValue("documentName", e);
          }}
          value={formik.values.documentName}
          error={formik.values.documentName ? "" : formik.errors.documentName}
          required={true}
        />

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

        <div className="grid grid-cols-2 gap-4 dark:text-white">
          <div className="flex flex-col gap-2 ">
            <label className="text-sm ">{t("Mandatory_Type")}</label>
            <div className="grid grid-cols-12 ">
              <div className="col-span-1 ">
                <ToggleBtn
                  change={(e) => {
                    formik.setFieldValue("mandatoryType", e);
                  }}
                  value={parseInt(formik.values.mandatoryType)}
                  text={true}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ">
            <label className="text-sm ">{t("Expiry_Reminders")}</label>
            <div className="grid grid-cols-12 ">
              <div className="col-span-1 ">
                <ToggleBtn
                  value={parseInt(formik.values.expiryReminders)}
                  change={(e) => formik.setFieldValue("expiryReminders", e)}
                  text={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawerPop>
  );
}

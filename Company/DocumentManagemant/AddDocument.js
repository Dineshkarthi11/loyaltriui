import { Flex, notification } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action, fileAction } from "../../Api";
import axios from "axios";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import ImageUpload from "../../common/ImageUpload";
import FormInput from "../../common/FormInput";
import ButtonClick from "../../common/Button";
import { UploadImage } from "../../common/SVGFiles";
import Dropdown from "../../common/Dropdown";
import TextArea from "../../common/TextArea";
import Heading from "../../common/Heading";
import RadioButton from "../../common/RadioButton";
import DateSelect from "../../common/DateSelect";
import { useNotification } from "../../../Context/Notifications/Notification";
import FileUpload from "../../common/FileUpload";

export default function AddDocument({
  open,
  close = () => { },
  employeeId,
  companyDataId,
  refresh = () => { },
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const getDocumentTypes = async (e) => {
    // console.log(e, "getDocumentTypes");

    try {
      const result = await action(
        API.GET_DOCUMENT_TYPES_RECORDS,
        { companyId: e } //e
      );
      setDocumentTypes(
        result?.result?.map((each) => ({
          label: each.documentType,
          value: each.documentTypeId,
        }))
      );
      // console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocumentTypes(companyId);
  }, []);

  const formik = useFormik({
    initialValues: {
      documentTypeId: null,
      documentName: "",
      file: "",
      description: "",
      renewal: "",
      renewalDate: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // department: yup.string().required("Department is Required"),
      // description: yup.string().required("Description is Required"),
      documentName: yup.string().required("Document is required"),
      documentTypeId: yup.string().required("Document Type is required"),
      file: yup.string().required("Document is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      // console.log(e);
      // console.log(employeeId);
      try {
        // console.log(API.HOST + API.ADD_EMPLOYEE_DOCUMENT);
        // const result = await action(API.ADD_MY_DOCUMENT, {
        //   employeeId: employeeId, //employeeId,
        //   companyId: companyId,
        //   documentTypeId: e.documentTypeId,
        //   documentName: e.documentName,
        //   documentFile: e.file,
        //   description: e.description,
        //   isUnderwarranty: e.renewal,
        //   validTo: e.renewalDate,

        // });
        const formData = new FormData();
        formData.append("action", API.ADD_MY_DOCUMENT);
        formData.append("employeeId", employeeId);
        formData.append("companyId", companyId);
        formData.append("documentTypeId", e.documentTypeId);
        formData.append("fileName", e.documentName);
        formData.append("file", e.file);
        formData.append("description", e.description);
        formData.append("isUnderWarranty", e.renewal);
        formData.append("validTo", e.renewalDate);
        // validFrom
        
        const result = await fileAction(formData);
        
        // console.log(result);
        
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            refresh(false);
            setLoading(false);
            handleClose();
          }, 1000);
          formik.resetForm();
        } else {
          openNotification("error", "Failed", result.message);
          setLoading(false);
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
      }}
      // contentWrapperStyle={{
      //   // maxWidth: "600px",
      // }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        !UpdateBtn ? t("Upload_Documents") : t("update"),
        !UpdateBtn ? t("Upload New Document") : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <FlexCol>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <Dropdown
            title="Document Type"
            placeholder="Choose Document Type"
            value={formik.values.documentTypeId}
            change={(e) => {
              formik.setFieldValue("documentTypeId", e);
            }}
            required={true}
            error={formik.errors.documentTypeId}
            options={documentTypes}
          />
          <FormInput
            title="Document"
            placeholder="Document"
            value={formik.values.documentName}
            error={formik.errors.documentName}
            change={(e) => {
              formik.setFieldValue("documentName", e);
            }}
            required={true}
          />
        </div>
        {/* <ImageUpload
          multiple={false}
          change={(e) => {
            formik.setFieldValue("file", e);
            console.log(e, "image");
          }}
          required={true}
          label="Upload Image"
          error={formik.errors.file}
        /> */}
        <FileUpload
          required={true}
          title={"Upload Document"}
          change={(e) => {
            formik.setFieldValue("file", e);
            // console.log(e, "image");
          }}
          error={ formik.errors.file}
          // showUploadList={false}
          // fileName={formik.values.file.name}
        />
        <TextArea
          title="Description"
          placeholder="Description"
          value={formik.values.description}
          change={(e) => {
            formik.setFieldValue("description", e);
          }}
        />
        <div className="flex flex-col gap-1">
          <Heading
            title="Is document under renewal"
            description="Set asset warrant informations"
          />
          <RadioButton
            title=""
            value={formik.values.renewal}
            change={(e) => {
              formik.setFieldValue("renewal", e);
            }}
            options={[
              {
                label: "Yes",
                value: 1,
              },
              {
                label: "No",
                value: 0,
              },
            ]}
          />
        </div>
        {formik.values.renewal === 1 && (
          <DateSelect
            title="Renewal Date"
            value={formik.values.renewalDate}
            change={(e) => {
              formik.setFieldValue("renewalDate", e);
            }}
          />
        )}

        {/* <div className="flex flex-col gap-2 ">
          <ImageUpload custom={true}>
            <div className="flex-col gap-3 vhcenter">
              <UploadImage className="w-20 2xl:w-28" />
              <div>
                <p className="para">
                  <span className="text-primary">{t("Click to upload ")}</span>
                  <span className="!text-grey">
                    {t("or drag and drop files here")}
                  </span>
                </p>
                <p className="text-[9px] 2xl:text-xs text-grey">
                  {t("jpg, svg, png or gif(max file size 2mb)")}
                </p>
              </div>
            </div>
          </ImageUpload>
         
          <p className="text-[9px] 2xl:text-xs text-grey font-normal ">
            Some data formats, such as dates, numbers and colors, may not be
            recognized. Learn more
          </p>
        </div>
        <div className="grid items-center grid-cols-11 gap-4 text-center ">
          <div className="col-span-5 border-b "></div>
          <p className="text-xs ">{t("OR")}</p>
          <div className="col-span-5 border-b"></div>
        </div>
        <Flex gap={12} align="end">
          <FormInput websiteLink={true} title={t("Upload_from_URL")} />
          <ButtonClick buttonName={t("Upload")} />
        </Flex> */}
      </FlexCol>
    </DrawerPop>
  );
}

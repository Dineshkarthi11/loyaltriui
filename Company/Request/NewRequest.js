import React, { useEffect, useState } from "react";
import Dropdown from "../../common/Dropdown";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import FileUpload from "../../common/FileUpload";
import DateSelect from "../../common/DateSelect";
import { useTranslation } from "react-i18next";
import TextArea from "../../common/TextArea";
import { useFormik } from "formik";
import * as Yup from "yup";
import { notification } from "antd";
import API, { action } from "../../Api";
import dayjs from "dayjs";
import FormInput from "../../common/FormInput";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

// Define the validation schema with conditional validations

function NewRequest({
  open,
  close = () => {},
  refresh = () => {},
  navigationValue,
  requestId,
}) {
  const [newreq, setNewreq] = useState(open);
  const { t } = useTranslation();
  const [employeeId] = useState(localStorageData.employeeId);
  const [companyId] = useState(localStorageData.companyId);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [fromdateError, setfromdateError] = useState("");
  const [todateError, setTodateError] = useState("");
  const [loading, setLoading] = useState(false);
  const [letterTpeError, setLetterTypeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  useEffect(() => {
    if (navigationValue === "Work From Home") {
      setSelectedRequestType("workfromhome");
    } else {
      setSelectedRequestType("letterrequest");
    }
  }, [navigationValue]);

  const handleClose = () => {
    close(false);
  };

  const handleRequestTypeChange = (value) => {
    setSelectedRequestType(value);
    formik.setFieldValue("selectedRequestType", value);
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
      employeeId: "",
      requestType: "",
      requestDescription: "",
      fromDate: "",
      toDate: "",
      requestStatus: "",
      createdBy: "",
      requestLetterType: "",
      selectedRequestType: "",
    },

    onSubmit: async (values) => {
      setLoading(true);
      let hasError = false;
      if (selectedRequestType === "workfromhome") {
        if (!formik.values.fromDate) {
          setfromdateError("From date is required");
          hasError = true;
        } else {
          setfromdateError("");
        }
        if (!formik.values.toDate) {
          setTodateError("To date is required");
          hasError = true;
        } else {
          setTodateError("");
        }
        if (!formik.values.requestDescription) {
          setDescriptionError("Reason is required");
        } else {
          setDescriptionError("");
        }
      } else if (selectedRequestType === "letterrequest") {
        if (!formik.values.requestLetterType) {
          setLetterTypeError("Request for is required ");
          hasError = true;
        } else {
          setLetterTypeError("");
        }
        if (!formik.values.requestDescription) {
          setDescriptionError("Purpose is required");
        } else {
          setDescriptionError("");
        }
      }

      if (hasError) {
        return;
      }
      try {
        if (selectedRequestType === "workfromhome") {
          if (!requestId) {
            const result = await action(API.Save_SPECIAL_REQUEST, {
              employeeId: parseInt(employeeId),
              requestType: 1,
              requestDescription: values.requestDescription,
              fromDate: values.fromDate,
              toDate: values.toDate,
              requestStatus: 0,
              createdBy: employeeId,
              requestLetterType: null,
              companyId: companyId,
            });

            if (result.status === 200) {
              openNotification("success", "Success", result.message);
              setTimeout(() => {
                handleClose();
                setLoading(false);
                refresh(true);
              }, 1000);
            } else if (result.status === 500) {
              openNotification("error", "Info", result.message);
              setLoading(false);
            }
          } else {
            const result = await action(API.UPDATE_REQUEST_TYPE, {
              employeeId: parseInt(employeeId),
              requestType: 1,
              requestDescription: values.requestDescription,
              fromDate: values.fromDate,
              toDate: values.toDate,
              requestStatus: 0,
              createdBy: employeeId,
              requestLetterType: null,
              companyId: companyId,
              id: requestId,
            });

            if (result.status === 200) {
              openNotification("success", "Update Success", result.message);
              setTimeout(() => {
                handleClose();
                setLoading(false);
                refresh(true);
              }, 1000);
            } else if (result.status === 500) {
              setLoading(false);
              openNotification("error", "Failed", result.message);
            }
          }
        } else {
          if (!requestId) {
            const result = await action(API.Save_SPECIAL_REQUEST, {
              employeeId: employeeId,
              requestType: 2,
              requestDescription: values.requestDescription,
              fromDate: dayjs(),
              toDate: null,
              requestStatus: 0,
              createdBy: employeeId,
              requestLetterType: values.requestLetterType,
              companyId: companyId,
            });

            if (result.status === 200) {
              openNotification("success", "Success", result.message);
              setTimeout(() => {
                handleClose();
                refresh(true);
                setLoading(false);
              }, 1000);
            } else if (result.status === 500) {
              openNotification("error", "Failed", result.message);
              setLoading(false);
            }
          } else {
            const result = await action(API.UPDATE_REQUEST_TYPE, {
              employeeId: employeeId,
              requestType: 2,
              requestDescription: values.requestDescription,
              fromDate: dayjs(),
              toDate: null,
              requestStatus: 0,
              createdBy: employeeId,
              requestLetterType: values.requestLetterType,
              companyId: companyId,
              id: requestId,
            });

            if (result.status === 200) {
              openNotification("success", "Success", result.message);
              setTimeout(() => {
                handleClose();
                refresh(true);
                setLoading(false);
              }, 1000);
            } else if (result.status === 500) {
              openNotification("error", "Failed", result.message);
              setLoading(false);
            }
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });

  const getSpecialRequest = async (id) => {
    try {
      const result = await action(API.GET_SPECIAL_REQUESTBY_ID, {
        id,
      });

      const { fromDate, toDate } = result.result;

      formik.setFieldValue("fromDate", fromDate);
      formik.setFieldValue("toDate", toDate);
      formik.setFieldValue(
        "requestDescription",
        result.result.requestDescription
      );

      formik.setFieldValue(
        "requestLetterType",
        result.result.requestLetterType
      );

      // console.log([result.result], "Response");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSpecialRequest(requestId);
  }, [requestId]);
  return (
    <div>
      <DrawerPop
        header={[
          t("New Request"),
          selectedRequestType === "workfromhome"
            ? "Request your work-from-home arrangement here. Ensure all relevant details are included to facilitate smooth approval."
            : "Submit your request for official letters here. Please provide all necessary information to ensure timely processing.",
        ]}
        open={newreq}
        close={(e) => {
          handleClose();
        }}
        contentWrapperStyle={{
          width: "590px",
        }}
        footerBtn={[t("Cancel"), t("Save")]}
        footerBtnDisabled={loading}
        handleSubmit={() => {
          formik.handleSubmit();
        }}
      >
        <FlexCol className="relative w-full">
          <Dropdown
            title={t("Request Type")}
            change={(e) => {
              handleRequestTypeChange(e);
            }}
            value={selectedRequestType}
            options={[
              { id: 1, value: "workfromhome", label: "Work From Home" },
              { id: 2, value: "letterrequest", label: "Letter request" },
            ]}
            placeholder={t("Work from home")}
          />
          {selectedRequestType === "workfromhome" ? (
            <>
              <div className="flex gap-3">
                <DateSelect
                  title={t("From Date")}
                  value={formik.values.fromDate}
                  defaultPickerValue={dayjs()}
                  placeholder={t("Choose Date")}
                  change={(e) => {
                    formik.setFieldValue("fromDate", e);
                    if (e) setfromdateError("");
                  }}
                  error={fromdateError}
                  required
                  fromDate={dayjs()}
                />
                <DateSelect
                  title={t("To Date")}
                  value={formik.values.toDate}
                  defaultPickerValue={dayjs()}
                  placeholder={t("Choose Date")}
                  change={(e) => {
                    formik.setFieldValue("toDate", e);
                    if (e) setTodateError("");
                  }}
                  error={todateError}
                  required
                  fromDate={formik.values.fromDate}
                />
              </div>
              <TextArea
                title={t("Reason")}
                placeholder={t("Reason")}
                value={formik.values.requestDescription}
                change={(e) => {
                  formik.setFieldValue("requestDescription", e);
                  if (e) setDescriptionError("");
                }}
                error={descriptionError}
                required
              />
            </>
          ) : (
            <>
              <FormInput
                title={t("Request For")}
                value={formik.values.requestLetterType}
                placeholder={t("Request")}
                change={(e) => {
                  formik.setFieldValue("requestLetterType", e);
                  if (e) setLetterTypeError("");
                }}
                error={letterTpeError}
                required
              />
              <TextArea
                title={t("Purpose")}
                placeholder={t("Purpose")}
                value={formik.values.requestDescription}
                change={(e) => {
                  formik.setFieldValue("requestDescription", e);
                  if (e) setDescriptionError("");
                }}
                error={descriptionError}
                required
              />
            </>
          )}
          {/* <p className="para">
            {t(
              "Some data formats, such as dates, numbers and colors, may not be recognized. Learn more"
            )}
          </p> */}
        </FlexCol>
      </DrawerPop>
    </div>
  );
}

export default NewRequest;

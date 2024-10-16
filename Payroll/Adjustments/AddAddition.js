import DrawerPop from "../../common/DrawerPop";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import * as yup from "yup";
import FormInput from "../../common/FormInput";
import DateSelect from "../../common/DateSelect";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import {
  getCompanyList,
  getEmployeeList,
} from "../../common/Functions/commonFunction";
import FileUpload from "../../common/FileUpload";
import PAYROLLAPI, { Payrollaction, payrollFileAction } from "../../PayRollApi";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AddAdition({
  open,
  close = () => {},
  companyDataId,
  refresh = () => {},
  updateId,
  employeeName,
  employeeId,
}) {
  const { t } = useTranslation();

  const [companyList, setCompanyList] = useState([]);

  const [addAssets, setAddAssets] = useState(open);
  const layout = useSelector((state) => state.layout.value);
  const [loading, setLoading] = useState(false);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [functionRender, setFunctionRender] = useState(false);
  const [joiningDate, setjoiningDate] = useState("");
  const [organisationId, setOrganisationId] = useState(
    localStorageData.organisationId
  );
  const [additionsList, setAdditionsList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );

  console.log(updateId, "updateeidd");
  console.log(employeeId, "employeeIdddd");

  const handleClose = () => {
    close();
    setAddAssets(false);
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

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  function getCurrentMonthYear() {
    const date = new Date(); // Get the current date
    const options = { month: "long", year: "numeric" }; // Formatting options
    return date.toLocaleDateString("en-GB", options); // Format the date
  }

  const formik = useFormik({
    initialValues: {
      companyId: companyId,
      financialYearId: 1,
      employeeId: "",
      additionId: "",
      remarks: "",
      amount: "",
      salaryMonthYear: "",
      reference: "",
      dateIncurred: "",
      isActive: 1,
      file: "",
      createdBy: loggedEmployeeId,
    },
    enableReinitialize: true,
    validateOnChange: false,

    validate: (values) => {
      const errors = {};
      if (!values.employeeId && !values.employeename && !employeeId) {
        errors.employeename = t("Employee name is required");
      }

      if (!values.remarks) {
        errors.remarks = t("Remarks is required");
      }

      if (!values.amount) {
        errors.amount = t("Amount is required");
      } else if (!/^\d{1,10}(\.\d{1,2})?$/.test(values.amount)) {
        // Accepts up to 10 digits before the decimal and up to 2 after the decimal
        errors.amount = t(
          "Amount must be a valid number with up to 10 digits and 2 decimal places"
        );
      }

      if (!values.reference) {
        errors.reference = t("Reference is required");
      }

      if (!values.dateIncurred) {
        errors.dateIncurred = t("Date Incurred is required");
      }

      if (!values.additionName) {
        errors.additionName = t("Addition Type is required");
      }
      return errors;
    },
    onSubmit: async (e) => {
      setLoading(true);
      const currentMonthYear = getCurrentMonthYear();

      console.log(PAYROLLAPI.CREATE_EMPLOYEE_ADDITIONS_RECORD, {
        companyId: companyId,
        financialYearId: 1,
        employeeId: e.employeeId,
        additionId: e.additionId,
        remarks: e.remarks,
        amount: e.amount,
        salaryMonthYear: currentMonthYear,
        reference: e.reference,
        dateIncurred: e.dateIncurred,
        isActive: 1,
        createdBy: loggedEmployeeId,
      });

      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_EMPLOYEE_ADDITIONS_RECORD_BY_ID,
            {
              id: updateId,
              companyId: companyId,
              financialYearId: 1,
              employeeId: formik.values.employeeId,
              additionId: formik.values.additionId,
              remarks: formik.values.remarks,
              amount: parseFloat(formik.values.amount),
              salaryMonthYear: currentMonthYear,
              reference: formik.values.reference,
              dateIncurred: formik.values.dateIncurred,
              isActive: 1,
              modifiedBy: loggedEmployeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              setLoading(false);
              setFunctionRender(!functionRender);
              refresh();
            }, 1000);

            const myAdjustementAdditionIdForImage = updateId;

            if (e.file) {
              // Prepare form data for file upload
              const formData = new FormData();
              formData.append("action", "EmployeeAdditionFileUpload");
              formData.append(
                "employeeAdditionId",
                myAdjustementAdditionIdForImage
              );
              formData.append("file", e.file);

              // Upload the file
              const fileResult = await payrollFileAction(formData);

              // Handle the file upload response
              if (fileResult.status === 200) {
                console.log("File uploaded successfully:", fileResult);
                openNotification(
                  "success",
                  "File uploaded successfully",
                  fileResult.message,
                  () => {
                    handleClose();
                    setLoading(false);
                    refresh();
                  }
                );
              } else {
                console.log("File upload failed:", fileResult);
                openNotification(
                  "error",
                  "File upload failed",
                  fileResult.message
                );
                setLoading(false);
              }
            }
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_EMPLOYEE_ADDITIONS_RECORD,
            {
              companyId: companyId,
              financialYearId: 1,
              employeeId: e.employeeId || employeeId,
              additionId: e.additionId,
              remarks: e.remarks,
              amount: parseFloat(e.amount),
              salaryMonthYear: currentMonthYear,
              reference: e.reference,
              dateIncurred: e.dateIncurred,
              isActive: 1,
              createdBy: loggedEmployeeId,
            }
          );
          console.log(result);
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            formik.resetForm();
            setTimeout(() => {
              handleClose();
              setLoading(false);
              refresh();
            }, 1000);

            const myAdjustementAdditionIdForImage = result.result.insertedId;

            if (e.file) {
              // Prepare form data for file upload
              const formData = new FormData();
              formData.append("action", "EmployeeAdditionFileUpload");
              formData.append(
                "employeeAdditionId",
                myAdjustementAdditionIdForImage
              );
              formData.append("file", e.file);

              // Upload the file
              const fileResult = await payrollFileAction(formData);

              // Handle the file upload response
              if (fileResult.status === 200) {
                console.log("File uploaded successfully:", fileResult);
                openNotification(
                  "success",
                  "File uploaded successfully",
                  fileResult.message,
                  () => {
                    handleClose();
                    refresh();
                    setLoading(false);
                  }
                );
              } else {
                console.log("File upload failed:", fileResult);
                openNotification(
                  "error",
                  "File upload failed",
                  fileResult.message
                );
                setLoading(false);
              }
            }
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
          console.log(result);
        }
      } catch (error) {
        console.log(error);
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  // const getRecords = async () => {
  //   const result = await axios.get(API.HOST + API.GET_ASSETS_TYPES_RECORDS);
  //   setAssetsList(result.data.tbl_assetType);
  //   console.log(result);
  // };

  const getCompany = async () => {
    const result = await getCompanyList(organisationId);
    // setCompanyList(result.data.tbl_company)
    setCompanyList(
      result?.map((each) => ({
        value: each.companyId,
        label: each.company,
      }))
    );

    // console.log(result);
  };

  useEffect(() => {
    // getRecords();
    getCompany();
  }, []);

  // useEffect(() => {
  //   console.log(addAssets);
  // }, [addAssets]);

  // const getIdBasedAssetsIdRecords = async (e) => {
  //   const result = await action(API.GET_ASSETS_TYPESID_BASED_RECORDS, {
  //     id: e,
  //   });
  //   formik.setFieldValue("name", result.result.assetType);
  //   formik.setFieldValue("description", result.result.description);
  //   // formik.setFieldValue("date", result.data.date);
  //   formik.setFieldValue("companyId", result.result.companyId);
  //   console.log(typeof result.result.companyId);
  //   setupdateBtn(true);

  //   console.log(result);
  // };
  // useEffect(() => {
  //   if (updateId) getIdBasedAssetsIdRecords(updateId);
  // }, [updateId]);

  const handleShow = () => setAddAssets(true);

  const getEmployess = async () => {
    const result = await getEmployeeList(companyId);

    if (result?.length > 0) {
      const options = result
        .filter(
          (employee) =>
            employee.employeeId !== undefined &&
            employee.firstName !== undefined &&
            employee.lastName !== undefined &&
            employee.joiningDate !== undefined
        ) // Filtering only valid employee objects

        .map(({ employeeId, firstName, lastName, joiningDate }) => ({
          id: employeeId,

          label: `${firstName} ${lastName}`,

          value: employeeId,

          employeeId: employeeId,
          joiningDate: joiningDate,
        }));

      console.log(options, "daataaaa");
      options.forEach((employee) => {});
      setEmployeeList(options);
    } else {
      // Handle the case where result.result is not an array or is empty

      console.log("No employees found.");
    }
  };

  useEffect(() => {
    if (companyId) getEmployess();
  }, [companyId]);

  const getAdditionsList = async () => {
    const result = await Payrollaction(PAYROLLAPI.GET_ALL_ADDITIONS_RECORDS, {
      companyId: companyId,
      isEditable: 1,
    });

    if (result?.result) {
      const options = result.result.map(({ additionId, additionName }) => ({
        id: additionId,
        label: additionName,
        value: additionName,
        employeeId: additionId,
      }));
      console.log(options, "daataaaa");
      setAdditionsList(options);
    }

    console.log(result, "dsaaadata");
    console.log(additionsList, "additionss dataa");
  };

  useEffect(() => {
    getAdditionsList();
  }, []);

  const getAdjustementEmployeeAdditionsRecordById = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_ADDITIONS_RECORD_BY_ID,
        {
          id: e,
        }
      );
      console.log(result, "dataaa of getbyid");
      if (result.result && result.result.length > 0) {
        const formattedAmount = parseFloat(result.result[0].amount).toFixed(2);
        formik.setFieldValue("reference", result.result[0].reference);
        formik.setFieldValue("remarks", result.result[0].remarks);
        formik.setFieldValue(
          "amount",
          Number.isInteger(parseFloat(formattedAmount))
            ? parseInt(formattedAmount)
            : formattedAmount
        );
        formik.setFieldValue("dateIncurred", result.result[0].dateIncurred);
        formik.setFieldValue("additionName", result.result[0].additionName);
        formik.setFieldValue("additionId", result.result[0].additionId);
        formik.setFieldValue("employeeId", result.result[0].employeeId);
        formik.setFieldValue("additionFile", result.result[0].additionFile);
        console.log(result.result[0].dateIncurred, "dateee");

        setupdateBtn(true);
      } else {
        // Handle the case where no data is returned for the given ID
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getAdjustementEmployeeAdditionsRecordById(updateId);
  }, [updateId]);

  const uniqueEmployees = Array.from(
    new Set(employeeList.map((option) => option.employeeId))
  ).map((employeeId) => {
    return employeeList.find((option) => option.employeeId === employeeId);
  });

  return (
    <DrawerPop
      open={addAssets}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        // UpdateIdBasedAssetsTypes();
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Add Addition") : t("Update Addition"),
        !UpdateBtn ? t("Create New Addition") : t("Update Selected Addition"),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Save") : t("Update")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full">
        {/* <Dropdown
          title={t("Employee Name")}
          placeholder="Choose any one of the option"
          change={(selectedLeaveType) => {
            const selectedOption = employeeList.find(
              (option) => option.value === selectedLeaveType
            );
            
            if (selectedOption) {
              formik.setFieldValue("employeename", `${selectedOption.label}`);
              formik.setFieldValue("employeeId", selectedOption.employeeId);
            }
            console.log(selectedOption);
            console.log(selectedOption.employeeId, "employeeId");
          }}
          value={formik.values.employeeId || employeeId}
          error={formik.errors.employeename}
          options={employeeList}
          required={true}
          disabled={!!employeeId}
        /> */}
        <Dropdown
          title={t("Employee Name")}
          placeholder="Choose any one of the option"
          change={(selectedLeaveType) => {
            const selectedOption = uniqueEmployees.find(
              (option) => option.value === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("employeename", selectedOption.label);
              formik.setFieldValue(
                "employeeId",
                selectedOption.employeeId?.toString() || ""
              );
              setjoiningDate(selectedOption.joiningDate);
            }
          }}
          value={
            formik.values.employeeId ||
            (typeof employeeId === "number"
              ? employeeId.toString()
              : employeeId)
          }
          error={formik.errors.employeename}
          options={uniqueEmployees.map((option) => ({
            value: option.value?.toString() || "",
            label: option.label,
            employeeId: option.employeeId?.toString() || "",
          }))}
          required={true}
          disabled={!!employeeId}
        />

        <FormInput
          title={t("Reference")}
          placeholder={t("Reference")}
          change={(e) => {
            formik.setFieldValue("reference", e);
          }}
          value={formik.values.reference}
          error={formik.errors.reference}
          required={true}
        />
        <Dropdown
          title={t("Addition Type")}
          placeholder={t("Choose Addition Type")}
          change={(selectedLeaveType) => {
            const selectedOption = additionsList.find(
              (option) => option.label === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("additionName", selectedOption.value);
              formik.setFieldValue("additionId", selectedOption.employeeId);
            }
            console.log(selectedOption);
            console.log(selectedOption.additionId, "categoryidd");
          }}
          value={formik.values.additionName}
          error={formik.errors.additionName}
          options={additionsList}
          required={true}
          SelectName={"Choose Additional Type"}
        />
        <DateSelect
          title="Date Incurred"
          change={(e) => formik.setFieldValue("dateIncurred", e)}
          value={formik.values.dateIncurred}
          error={formik.errors.dateIncurred}
          required={true}
          placeholder="Choose Date"
          maxdate={true}
          joiningDate={joiningDate}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            title={t("Amount")}
            placeholder={t("Amount")}
            change={(e) => {
              // Allow only valid numeric input including decimals up to 2 places
              let valuedata = e.replace(/[^0-9.]/g, ""); // Allow only numbers and a single dot
              if (valuedata.includes(".")) {
                const parts = valuedata.split(".");
                // Limit to 2 decimal places
                if (parts[1]?.length > 2) {
                  valuedata = `${parts[0]}.${parts[1].slice(0, 2)}`;
                }
              }
              formik.setFieldValue("amount", valuedata);
            }}
            maxLength={10} // Limit the input length
            value={formik.values.amount}
            error={formik.errors.amount}
            required={true}
          />
          {/* <FormInput
            title={t("VAT")}
            placeholder={t("AED")}
            change={(e) => {
              formik.setFieldValue("vat", e);
            }}
            value={formik.values.name}
            error={formik.values.name ? "" : formik.errors.name}
            required={true}
            className=""
          /> */}
        </div>

        <TextArea
          title={t("Remarks")}
          placeholder={t("Remarks")}
          change={(e) => formik.setFieldValue("remarks", e)}
          value={formik.values.remarks}
          error={formik.errors.remarks}
          required={true}
        />
        <FileUpload
          change={(e) => {
            formik.setFieldValue("file", e);
            formik.setFieldValue("additionFile", e);
          }}
        />
        {formik.values.additionFile &&
          typeof formik.values.additionFile === "string" && (
            <>
              {/* <p>{t("Current file:")}</p> */}
              <a
                href={formik.values.additionFile}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formik.values.additionFile.split("?")[0].split("/").pop()}
              </a>
            </>
          )}
      </FlexCol>
    </DrawerPop>
  );
}

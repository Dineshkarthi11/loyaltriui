import DrawerPop from "../../common/DrawerPop";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";

import * as yup from "yup";
import API, { action } from "../../Api";
import FormInput from "../../common/FormInput";
import DateSelect from "../../common/DateSelect";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import FileUpload from "../../common/FileUpload";
import PAYROLLAPI, { Payrollaction, payrollFileAction } from "../../PayRollApi";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AddExpenceReimbursement({
  open,
  close = () => {},

  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();

  const [categoryList, setCategoryList] = useState([]);
  const [fileurl, setFileurl] = useState();
  const [filename, setFilename] = useState();
  const [addAssets, setAddAssets] = useState(open);
  const [loading, setLoading] = useState(false);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employee, setemployee] = useState("");
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );

  const [workExpenseId, setWorkExpenseId] = useState("");
  const [updateId, setUpdateId] = useState(
    localStorage.getItem("actionidforupdate")
  );

  useMemo(
    () =>
      setTimeout(() => {
        addAssets === false && close(false);
      }, 800),
    [addAssets]
  );

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getEmployee = async () => {
    // setemployeeList(employeeDetails);

    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: loggedEmployeeId,
      });
      setemployee(result.result.joiningDate);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [loggedEmployeeId, employee]);

  // Function to format the current date as "Month Year"
  function getCurrentMonthYear() {
    const date = new Date(); // Get the current date
    const options = { month: "long", year: "numeric" }; // Formatting options
    return date.toLocaleDateString("en-GB", options); // Format the date
  }

  const formik = useFormik({
    initialValues: {
      description: "",
      reference: "",
      categoryId: null,
      attachments: null,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      description: yup
        .string()
        .required("Description is required")
        .matches(/^[a-zA-Z0-9\-_.,!@#$%^&*()+=\'\"?<>\/\[\]{};: ]+$/),
      amount: yup.number().required("Amount is required"),
      categoryId: yup.string().required("Expense Category is required"),
      reference: yup.string().required("Reference is required"),
      date: yup.string().required("Date is required"),
    }),
    onSubmit: async (e) => {
      // setLoading(true);
      const currentMonthYear = getCurrentMonthYear();

      console.log(
        {
          financialYearId: 1,
          companyId: companyId,
          employeeId: loggedEmployeeId,
          categoryId: e.categoryId,
          description: e.description,
          amount: e.amount,
          expenseDate: e.date,
          salaryMonthYear: currentMonthYear,
          attachments: null,
          isActive: 1,
          createdBy: loggedEmployeeId,
        },
        "entereddata"
      );

      try {
        if (updateId) {
          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_EMPLOYEE_WORK_EXPENSES,
            {
              id: workExpenseId,
              financialYearId: 1,
              companyId: companyId,
              employeeId: loggedEmployeeId,
              categoryId: e.categoryId,
              description: e.description,
              amount: e.amount,
              expenseDate: e.date,
              salaryMonthYear: currentMonthYear,
              // attachments: e.attachments,
              isActive: 1,
              createdBy: loggedEmployeeId,
              reference: e.reference,
            }
          );

          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
              // setLoading(false);
            }, 1000);
          }
          const myWorkExpenseIdForImage = workExpenseId;

          if (e.file) {
            // Prepare form data for file upload
            const formData = new FormData();
            formData.append("action", "EmployeeWorkExpenseFileUpload");
            formData.append("employeeWorkExpenseId", myWorkExpenseIdForImage);
            formData.append("file", e.file);
            // formData.append("attachments", e.attachments);

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
          } else if (result.status === 500) {
            openNotification("error", "Something went wrong", result.messages);
            handleClose();
          }
        } else {
          console.log(
            PAYROLLAPI.CREATE_WORK_EXPENSES_RECORD,
            {
              financialYearId: 1,
              companyId: companyId,
              employeeId: loggedEmployeeId,
              categoryId: e.categoryId,
              description: e.description,
              amount: e.amount,
              expenseDate: e.date,
              salaryMonthYear: currentMonthYear,
              isActive: 1,
              createdBy: loggedEmployeeId,
              reference: e.reference,
            },
            "consolee dataaa"
          );

          const result = await Payrollaction(
            PAYROLLAPI.CREATE_WORK_EXPENSES_RECORD,
            {
              financialYearId: 1,
              companyId: companyId,
              employeeId: loggedEmployeeId,
              categoryId: e.categoryId,
              description: e.description,
              reference: e.reference,
              amount: e.amount,
              expenseDate: e.date,
              salaryMonthYear: currentMonthYear,
              isActive: 1,
              createdBy: loggedEmployeeId,
            }
          );
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1000);
            const myWorkExpenseIdForImage = result.result.insertedId;

            if (e.file) {
              // Prepare form data for file upload
              const formData = new FormData();
              formData.append("action", "EmployeeWorkExpenseFileUpload");
              formData.append("employeeWorkExpenseId", myWorkExpenseIdForImage);
              formData.append("file", e.file);

              // Upload the file
              const fileResult = await payrollFileAction(formData);

              // Handle the file upload response
              if (fileResult.status === 200) {
                console.log("File uploaded successfully:", fileResult);
                openNotification(
                  "success",
                  "File uploaded successfully",
                  fileResult.message
                );
                setTimeout(() => {
                  handleClose();
                  refresh();
                  setLoading(false);
                }, 1500);
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
          } else if (result.status === 500) {
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

  const getCategory = async () => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_WORK_EXPENSE_CATEGORY_RECORD
    );

    if (result?.result) {
      const options = result.result.map((each) => ({
        id: each.categoryId,
        label: each.categoryName,
        value: parseInt(each.categoryId),
        categoryId: each.categoryId,
      }));

      setCategoryList(options);
    }

    // console.log(result);
  };

  useEffect(() => {
    getCategory();
  }, []);

  // useEffect(() => {
  //   console.log(addAssets);
  // }, [addAssets]);

  const getIdBasedAssetsIdRecords = async (e) => {
    const result = await Payrollaction(PAYROLLAPI.GET_EMPLOYEE_WORK_EXPENSES, {
      id: e,
    });
    setWorkExpenseId(result.result[0].employeeWorkExpenseId);
    console.log(workExpenseId, "iiiidddd");

    console.log(result.result[0].description, "getbyidresultt");
    // formik.setFieldValue("name", result.result.assetType);
    formik.setFieldValue("description", result.result[0].description);
    formik.setFieldValue("date", result.result[0].expenseDate);
    formik.setFieldValue("amount", result.result[0].amount);
    formik.setFieldValue("categoryId", parseInt(result.result[0].categoryId));
    formik.setFieldValue("reference", result.result[0].reference);
    formik.setFieldValue("attachments", result.result[0].attachments);
    setFilename(result.result[0].fileName);
    setFileurl(result.result[0].attachments);
    console.log(typeof result.result.companyId);
    setupdateBtn(true);

    console.log(result);
  };
  useEffect(() => {
    if (updateId) getIdBasedAssetsIdRecords(updateId);
  }, [updateId, workExpenseId]);

  const handleClose = () => {
    close(false);
    setUpdateId(undefined);
    localStorage.removeItem("actionidforupdate");
  };

  return (
    <DrawerPop
      open={addAssets}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={{
        width: "540px",
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
        !UpdateBtn
          ? t("Add Expense Reimbursement")
          : t("Update Expense Reimbursement"),
        !UpdateBtn
          ? t("Create New Expense Reimbursement")
          : t("Update New Expense Reimbursement"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className="relative w-full">
        <div>
          <FileUpload
            defaultname={filename}
            defaulturl={fileurl}
            change={(e) => {
              formik.setFieldValue("file", e);
              // formik.setFieldValue("attachments", e);
            }}
          />
        </div>
        {/* <FormInput
          title={t("Employee Name")}
          placeholder={t("Employee Name")}
          change={(e) => {
            formik.setFieldValue("name", e);
          }}
          value={formik.values.name}
          error={formik.values.name ? "" : formik.errors.name}
          required={true}
        /> */}

        <Dropdown
          title={t("Expense Category")}
          placeholder={t("choose_here")}
          change={(selectedLeaveType) => {
            // const selectedOption = categoryList.find(
            //   (option) => option.label === selectedLeaveType
            // );
            // if (selectedOption) {
            //   formik.setFieldValue("categoryname", selectedOption.label);
            formik.setFieldValue("categoryId", selectedLeaveType);
            //   }
            //   console.log(selectedOption);
            //   console.log(selectedOption.categoryId, "categoryidd");
          }}
          options={categoryList}
          value={formik.values.categoryId}
          error={formik.errors.categoryId}
          required={true}
        />

        <div className="grid grid-cols-2 gap-4">
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
          <DateSelect
            title="Date of Spend"
            placeholder="Enter Date of Spend"
            change={(e) => formik.setFieldValue("date", e)}
            error={formik.errors.date}
            value={formik.values.date}
            required={true}
            maxdate={true}
            joiningDate={employee}
          />
        </div>

        <TextArea
          title={t("Description")}
          placeholder={t("Description")}
          change={(e) => formik.setFieldValue("description", e)}
          value={formik.values.description}
          error={formik.errors.description}
          required={true}
        />
        <div className="grid grid-cols-2 gap-4">
          {/* <Dropdown placeholder="AED" title="Currency"/> */}
          <FormInput
            title={t("Amount Spent")}
            placeholder={t("Amount Spent")}
            change={(e) => {
              const valuedata = e.replace(/[^0-9]/g, "");
              formik.setFieldValue("amount", valuedata);
            }}
            value={formik.values.amount}
            error={formik.errors.amount}
            required={true}
            className=""
          />
        </div>
      </FlexCol>
    </DrawerPop>
  );
}

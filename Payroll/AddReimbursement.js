import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";

import DrawerPop from "../common/DrawerPop";
import API, { action } from "../Api";
import FormInput from "../common/FormInput";
import FileUpload from "../common/FileUpload";
import Dropdown from "../common/Dropdown";
import FlexCol from "../common/FlexCol";
import TextArea from "../common/TextArea";
import DateSelect from "../common/DateSelect";
import PAYROLLAPI, { Payrollaction, payrollFileAction } from "../PayRollApi";
import { getEmployeeList } from "../common/Functions/commonFunction";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function AddReimbursement({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh = () => {},
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [employeeList, setEmployeeList] = useState([]);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const { showNotification } = useNotification();
  const [employee, setemployee] = useState();
  const [joiningDate, setjoiningDate] = useState("");
  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const handleClose = () => {
    close(false);
    setShow(false);
  };

  function getCurrentMonthYear() {
    const date = new Date(); // Get the current date
    const options = { month: "long", year: "numeric" }; // Formatting options
    return date.toLocaleDateString("en-GB", options); // Format the date
  }

  const getEmployee = async () => {
    // setemployeeList(employeeDetails);

    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: loggedEmployeeId,
      });
      setemployee(result.result.joiningDate);
      console.log(employee, "joining date of employee");

      // getDepartment(result.data.employeeCompanyData?.departmentId);
      // getLocation(result.data.employeeCompanyData?.locationId);
      // getShiftScheme(result.data.employeeCompanyData?.shiftSchemeId);
      // getDesignation(result.data.employeeCompanyData?.designationId);
      // getCompany(result.data.employeeCompanyData?.companyId);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [loggedEmployeeId, employee]);

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      description: yup
        .string()
        .required("Description is required")
        .matches(/^[a-zA-Z0-9\-_.,!@#$%^&*()+=\'\"?<>\/\[\]{};: ]+$/),
      employeename: yup.string().required("Name is required"),
      categoryname: yup.string().required("Category is required"),
      reference: yup.string().required("Reference is required"),
      amount: yup.number().required("Amount is required"),
      date: yup.string().required("Date is required"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      const currentMonthYear = getCurrentMonthYear();

      console.log(
        {
          financialYearId: 1,
          companyId: companyId,
          employeeId: e.employeeId,
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
          // const result = await Payrollaction(
          //   PAYROLLAPI.UPDATE_Loan_Settings_RECORD_BY_ID,
          //   {
          //     financialYearId:1,
          // companyId: companyId,
          // employeeId: loggedEmployeeId,
          // categoryId:1,
          // description: e.description,
          // amount: e.amount,
          // expenseDate: e.expenseDate,
          // salaryMonthYear:"january 2024",
          // isActive: 1,
          // createdBy: loggedEmployeeId,
          //   }
          // );
          // if (result.status === 200) {
          //   openNotification(
          //     "success",
          //     "Update Successful",
          //     result.message,
          //     () => {
          //       handleClose();
          //       console.log(handleClose, "close Successful");
          //       setFunctionRender(!functionRender);
          //       refresh();
          //       console.log(refresh, "refresh Successful");
          //     }
          //   );
          // } else if (result.status === 500) {
          //   openNotification("error", "Something went wrong", result.message);
          // }
        } else {
          console.log(
            PAYROLLAPI.CREATE_WORK_EXPENSES_RECORD,
            {
              financialYearId: 1,
              companyId: companyId,
              employeeId: e.employeeId,
              categoryId: e.categoryId,
              description: e.description,
              amount: e.amount,
              expenseDate: e.date,
              salaryMonthYear: currentMonthYear,
              attachments: null,
              isActive: 1,
              createdBy: loggedEmployeeId,
            },
            "consolee dataaa"
          );

          const result = await Payrollaction(
            PAYROLLAPI.CREATE_WORK_EXPENSES_RECORD,
            {
              financialYearId: 1,
              companyId: companyId,
              employeeId: e.employeeId,
              categoryId: e.categoryId,
              description: e.description,
              amount: e.amount,
              expenseDate: e.date,
              salaryMonthYear: currentMonthYear,
              attachments: null,
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

  const getCategory = async () => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_WORK_EXPENSE_CATEGORY_RECORD
    );

    if (result?.result) {
      const options = result.result.map(({ categoryId, categoryName }) => ({
        id: categoryId,
        label: categoryName,
        value: categoryName,
        categoryId: categoryId,
      }));

      setCategoryList(options);
    }

    // console.log(result);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getEmployess = async () => {
    const result = await getEmployeeList();
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

      setEmployeeList(options);
    } else {
      // Handle the case where result.result is not an array or is empty

      console.log("No employees found.");
    }
  };

  useEffect(() => {
    getEmployess();
  }, []);

  return (
    <DrawerPop
      contentWrapperStyle={{
        width: "540px",
      }}
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
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
          ? t("New Expense Reimbursement")
          : t("Update Expense Reimbursement"),
        !UpdateBtn
          ? t("Create New Expense Reimbursement")
          : t("Update Selected Expense Reimbursement"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <FlexCol>
        <div className="flex flex-col gap-2">
          <FileUpload
            change={(e) => {
              formik.setFieldValue("file", e);
            }}
          />
        </div>
        <Dropdown
          title={t("Employee Name")}
          placeholder={t("Name")}
          change={(selectedLeaveType) => {
            const selectedOption = employeeList.find(
              (option) => option.value === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("employeename", `${selectedOption.label}`);
              formik.setFieldValue("employeeId", selectedOption.employeeId);
              setjoiningDate(selectedOption.joiningDate);
            }
            console.log(selectedOption);
            console.log(selectedOption.employeeId, "categoryidd");
          }}
          value={formik.values.employeeId}
          error={formik.errors.employeename}
          options={employeeList}
          required={true}
        />
        <Dropdown
          title={t("Expense Category")}
          placeholder={t("choose_here")}
          change={(selectedLeaveType) => {
            const selectedOption = categoryList.find(
              (option) => option.label === selectedLeaveType
            );
            if (selectedOption) {
              formik.setFieldValue("categoryname", selectedOption.value);
              formik.setFieldValue("categoryId", selectedOption.categoryId);
            }
            console.log(selectedOption);
            console.log(selectedOption.categoryId, "categoryidd");
          }}
          options={categoryList}
          value={formik.values.categoryname}
          error={formik.errors.categoryname}
          required={true}
        />
        <div className="flex justify-between items-center">
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
            change={(e) => formik.setFieldValue("date", e)}
            error={formik.errors.date}
            required={true}
            value={formik.values.date}
            maxdate={true}
            joiningDate={joiningDate}
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

        {/* <div className="flex justify-between items-center">
          <Dropdown
            title={t("Currency")}
            placeholder={t("Choose")}
            value={""}
            change={(e) => {}}
            options={""}
            className="text-sm w-40"
          />
          <FormInput
            title={t("Amount Spend")}
            placeholder={t("here")}
            value={""}
            change={(e) => {}}
          />
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          {/* <Dropdown placeholder="AED" title="Currency"/> */}
          <FormInput
            title={t("Amount Spent")}
            placeholder={t("Amount Spent")}
            change={(e) => {
              formik.setFieldValue("amount", e);
            }}
            value={formik.values.amount}
            error={formik.errors.amount}
            type="number"
            required={true}
          />
        </div>
      </FlexCol>
    </DrawerPop>
  );
}

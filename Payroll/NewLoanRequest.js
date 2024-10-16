import React, { useEffect, useMemo, useState } from "react";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import { Skeleton } from "antd";
import DrawerPop from "../common/DrawerPop";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import FormInput from "../common/FormInput";
import FileUpload from "../common/FileUpload";
import Dropdown from "../common/Dropdown";
import PAYROLLAPI, { Payrollaction, payrollFileAction } from "../PayRollApi";
import { useNotification } from "../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../common/Functions/commonFunction";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function NewLoanRequest({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
  employeeLoanId,
}) {
  const { t } = useTranslation();
  const [newLoanRequest, setNewLoanRequest] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanType, setLoanType] = useState(1);
  const [loanSettingsList, setLoanSettingsList] = useState([]);
  const [selectedLoanPolicy, setSelectedLoanPolicy] = useState(null);
  const [repaymentPlan, setRepaymentPlan] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [repaymentError, setRepaymentError] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [tenure2, setTenure2] = useState("");
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [companyDetails, setCompanyDetails] = useState("");

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
    setLoggedEmployeeId(localStorageData.employeeId);
  }, []);

  useMemo(
    () =>
      setTimeout(() => {
        newLoanRequest === false && close(false);
      }, 800),
    [newLoanRequest]
  );

  const handleClose = () => {
    setNewLoanRequest(false);
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) =>
        setCompanyDetails(details)
      );
    }

    const handleStorageChange = () => {
      if (companyId) {
        fetchCompanyDetails(companyId).then((details) =>
          setCompanyDetails(details)
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  console.log(companyDetails.currency, "ccc");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      date: "",
      companyId: [],
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      loanAmount: yup
        .number()
        .min(
          selectedLoanPolicy?.minimumValue,
          `Value must not be below ${selectedLoanPolicy?.minimumValue}`
        )
        .max(
          selectedLoanPolicy?.maximumValue,
          `Value must not be above ${selectedLoanPolicy?.maximumValue}`
        )
        .required("Loan amount is required"),

      reason: yup.string().required("Purpose is required"),
    }),
    onSubmit: async (e) => {
      // setLoading(true);
      // const isValid = validateInstallments();
      // if (!isValid) {
      //   // If validation fails, prevent form submission
      //   return;
      // }
      validateInstallments();

      // Check if there's an error message
      if (repaymentError) {
        // If there is an error message, prevent form submission
        console.error(repaymentError); // Optionally log the error
        return; // Exit if there is an error
      }

      // Prepare tenureAmountData based on selectedLoanPolicy.repaymentType
      let tenureAmountData = [];

      if (selectedLoanPolicy.repaymentType === "fixedRate") {
        // Map over repaymentPlan to construct tenureAmountData
        tenureAmountData = repaymentPlan.map((data) => ({
          EMI: data.installmentNumber,
          // amount: parseFloat(data.amountToPay.replace("AED ", "")), // Extract numeric amount
          amount: data.amountToPay,
        }));
      } else if (selectedLoanPolicy.repaymentType === "customRate") {
        // Map over installments to construct tenureAmountData
        tenureAmountData = installments.map((amount, index) => ({
          EMI: index + 1,
          amount: parseFloat(amount),
        }));
      }
      console.log(
        PAYROLLAPI.SAVE_EMPLOYEE_LOAN_REQUEST,
        {
          companyId: companyId,
          employeeId: loggedEmployeeId,
          loanPolicyId: loanType,
          amount: e.loanAmount,
          reason: e.reason,
          tenureMonths: e.tenure,
          createdBy: loggedEmployeeId,
          tenureAmountData: tenureAmountData,
        },
        "loan requested data"
      );

      try {
        const result = await Payrollaction(
          PAYROLLAPI.SAVE_EMPLOYEE_LOAN_REQUEST,
          {
            companyId: companyId,
            employeeId: loggedEmployeeId,
            loanPolicyId: loanType,
            amount: e.loanAmount,
            reason: e.reason,
            tenureMonths: e.tenure,
            createdBy: loggedEmployeeId,
            tenureAmountData: tenureAmountData,
          }
        );

        console.log(result, "saved data for loan request");

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            refresh(false);
            handleClose();
            // setLoading(false);
            refresh();
          }, 1000);

          const loanPolicyIdForImage = result.result.insertedId;

          if (e.file) {
            // Prepare form data for file upload
            const formData = new FormData();
            formData.append("action", "EmployeeLoanFileUpload");
            formData.append("employeeLoanId", loanPolicyIdForImage);
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
                refresh(false);
                // setLoading(false);
                handleClose();
              }, 1000);
            } else {
              console.log("File upload failed:", fileResult);
              openNotification(
                "error",
                "File upload failed",
                fileResult.message
              );
              // setLoading(false);
            }
          }
        } else {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        openNotification(
          "error",
          "Failed",
          "There was an error while saving the category. Please try again."
        );
        // setLoading(false);
      }
    },
  });

  const getLoanSettingsList = async () => {
    console.log(PAYROLLAPI.GET_ALL_Loan_Settings_RECORDS);
    setLoading(true);
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_Loan_Settings_RECORDS,
        {
          companyId: companyId,
        }
      );
      console.log(result?.result, "data of get all LoanSettings list");
      setLoanSettingsList(result?.result);
      // setTenure2(result?.result[0].repaymentTenure)
      // If there's only one loan policy, set it as the default selected loan policy
      if (result?.result.length === 1) {
        const policy = result.result[0];
        setLoanType(policy.loanPolicyId);
        setSelectedLoanPolicy(policy);
        formik.setFieldValue("loanAmount", policy.minimumValue);
        formik.setFieldValue("tenure", policy.repaymentTenure);
        // const option=result.result[0].repaymentTenure
        setTenure2(parseInt(policy.repaymentTenure));
      } else if (result?.result.length > 0) {
        // If there are multiple loan policies, set the first one as the default selected loan policy
        const policy = result.result[0];
        setLoanType(policy.loanPolicyId);
        setSelectedLoanPolicy(policy);
        formik.setFieldValue("loanAmount", policy.minimumValue);
        formik.setFieldValue("tenure", policy.repaymentTenure);
        setTenure2(parseInt(policy.repaymentTenure));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoanSettingsList([]);
    } finally {
      setLoading(false); // Stop loading after data fetch is complete
    }
  };

  useEffect(() => {
    getLoanSettingsList();
  }, []);

  const handleLoanPolicyClick = (policy) => {
    setLoanType(policy.loanPolicyId);
    setSelectedLoanPolicy(policy);
    formik.setFieldValue("loanAmount", policy.minimumValue);
    formik.setFieldValue("tenure", policy.repaymentTenure);
    setTenure2(parseInt(policy.repaymentTenure));
    if (policy.repaymentType === "customRate") {
      const initialInstallments = Array.from(
        { length: policy.repaymentTenure },
        () => policy.minimumValue / policy.repaymentTenure
      );
      setInstallments(initialInstallments);
    }
  };

  useEffect(() => {
    if (formik.values.loanAmount && formik.values.tenure) {
      if (selectedLoanPolicy?.repaymentType === "fixedRate") {
        const loanAmount = parseFloat(formik.values.loanAmount);
        const tenure = parseInt(formik.values.tenure);

        // Calculate base amount per installment
        const baseAmountToPay = loanAmount / tenure;

        // Round base amount to 2 decimal places
        const roundedBaseAmount = Math.round(baseAmountToPay * 100) / 100;

        // Calculate the initial repayment plan with the base amount
        let newRepaymentPlan = Array.from({ length: tenure }, (_, i) => {
          const installmentNumber = i + 1;
          return {
            installmentNumber: installmentNumber,
            amountToPay: roundedBaseAmount,
            outstanding: loanAmount - roundedBaseAmount * (i + 1),
          };
        });

        // Calculate total paid with base amount
        const totalPaid = roundedBaseAmount * tenure;

        // Find the rounding difference to be added to the last installment
        const roundingDifference = loanAmount - totalPaid;

        // Adjust the last installment
        newRepaymentPlan[tenure - 1].amountToPay += roundingDifference;

        // Recalculate outstanding for each installment
        newRepaymentPlan = newRepaymentPlan.map((plan, i) => {
          const amountPaidSoFar = newRepaymentPlan
            .slice(0, i + 1)
            .reduce((sum, installment) => sum + installment.amountToPay, 0);
          plan.outstanding = loanAmount - amountPaidSoFar;
          return plan;
        });

        setRepaymentPlan(newRepaymentPlan);
      } else if (selectedLoanPolicy?.repaymentType === "customRate") {
        const initialInstallments = Array.from(
          { length: formik.values.tenure },
          () => formik.values.loanAmount / formik.values.tenure
        );
        setInstallments(initialInstallments);
      }
    }
  }, [formik.values.loanAmount, formik.values.tenure]);

  useEffect(() => {
    if (selectedLoanPolicy?.repaymentType === "customRate") {
      validateInstallments();
    }
  }, [installments]);

  // const handleInstallmentChange = (index, value) => {
  //   const updatedInstallments = [...installments];
  //   updatedInstallments[index] = parseFloat(value);
  //   setInstallments(updatedInstallments);
  // };

  const handleInstallmentChange = (index, value) => {
    const parsedValue = value === "" ? 0 : parseFloat(value) || 0;
    const updatedInstallments = [...installments];
    updatedInstallments[index] = parsedValue;
    setInstallments(updatedInstallments); // Update state or data source
  };

  const validateInstallments = () => {
    // Only validate if the repaymentType is customRate
    if (selectedLoanPolicy?.repaymentType === "customRate") {
      const totalAmount = installments.reduce((sum, value) => sum + value, 0);
      const loanAmount = parseFloat(formik.values.loanAmount);
      console.log(totalAmount, "total amount");
      console.log(loanAmount, "loan amount");

      if (totalAmount > loanAmount) {
        setRepaymentError(
          "The total installment amount exceeds the loan amount."
        );
      } else if (totalAmount < loanAmount) {
        setRepaymentError(
          "The total installment amount is less than the loan amount."
        );
      } else {
        setRepaymentError("");
      }
    }
  };

  const calculateOutstanding = (index) => {
    const amountPaid = installments
      .slice(0, index + 1)
      .reduce((sum, value) => sum + value, 0);
    const loanAmount = parseFloat(formik.values.loanAmount);
    return loanAmount - amountPaid;
  };

  return (
    <DrawerPop
      placement="bottom"
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      open={newLoanRequest}
      close={(e) => {
        handleClose();
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("New Loan Request") : t("Update Loan Request"),
        !UpdateBtn
          ? t("Create New Loan Request")
          : t("Update Selected Loan Request"),
      ]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <Flex justify="center" align="center" className="">
        <FlexCol className={"md:w-4/6 md-auto  "}>
          <FlexCol className={" borderb rounded-xl bg-white p-4 dark:bg-dark"}>
            <Heading
              title={t("Loan Policy")}
              description={t("Select a loan policy as per your needs")}
              className={"bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"}
            />

            <div className="text-sm ">
              {loading ? ( // Show loader while data is still being fetched
                <div className="flex justify-center">
                  <Skeleton size="large" /> {/* Antd spinner */}
                </div>
              ) : loanSettingsList.length > 0 ? ( // Show the loan policies list if data exists
                <p>Following Loan policy(s) are available for you</p>
              ) : (
                // Show message if no data exists
                <p>Loan policies are not available</p>
              )}
            </div>

            <div className=" flex flex-wrap items-center gap-3 dark:text-white">
              {loanSettingsList.map((each) => (
                <div
                  key={each.loanPolicyId}
                  className={`col-span-4 p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark md:w-80 ${
                    loanType === each.loanPolicyId && "border-primary "
                  }`}
                  onClick={() => handleLoanPolicyClick(each)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-semibold">
                        {each.loanPolicyName}
                      </h3>
                      <p className="text-xs font-medium text-[#667085] pt-2">
                        {each.description}
                      </p>
                      <p className="flex justify-between pt-4 gap-1">
                        <p className="flex flex-col p-1 borderb rounded-lg">
                          <span className="text-xs text-[#667085]">
                            Min Loan Amount
                          </span>
                          <span className="font-semibold">
                            {each.minimumValue}
                          </span>
                        </p>
                        <p className="flex flex-col p-1 borderb rounded-lg">
                          <span className="text-xs text-[#667085]">
                            Max Loan Amount
                          </span>
                          <span className="font-semibold">
                            {each.maximumValue}
                          </span>
                        </p>
                      </p>
                    </div>
                    <div
                      className={`${
                        loanType === each.loanPolicyId && "border-primary"
                      } border rounded-full`}
                    >
                      <div
                        className={`font-semibold text-base w-4 h-4 border-2 border-white rounded-full ${
                          loanType === each.loanPolicyId &&
                          "text-primary bg-primary"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FlexCol>
          {loanSettingsList.length !== 0 && (
            <>
              <FlexCol
                className={"borderb rounded-xl bg-white p-4 dark:bg-dark"}
              >
                <Heading
                  title={t("Loan Details")}
                  description={t(
                    "Enter the particulars regarding the loan you need"
                  )}
                  className={
                    "bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"
                  }
                />
                <div className="flex flex-col gap-3 md:w-1/2">
                  <FormInput
                    title={t("Loan amount")}
                    placeholder={t("Loan amount")}
                    description={`Min Loan Amount ${companyDetails.currency} ${
                      selectedLoanPolicy?.minimumValue || ""
                    } - Max Loan Amount ${companyDetails.currency} ${
                      selectedLoanPolicy?.maximumValue || ""
                    }`}
                    value={formik.values.loanAmount}
                    change={(e) => {
                      const valuedata = e.replace(/[^0-9]/g, "");
                      formik.setFieldValue("loanAmount", valuedata);
                    }}
                    error={formik.errors.loanAmount}
                    required={true}
                  />
                  <FormInput
                    title={t("Purpose")}
                    placeholder={t("here")}
                    value={formik.values.reason}
                    change={(e) => formik.setFieldValue("reason", e)}
                    error={formik.errors.reason}
                    description={"Please explain why you require a loan."}
                    required={true}
                  />
                  <Dropdown
                    title={t("Tenure (in months)")}
                    placeholder={t("Choose")}
                    value={formik.values.tenure}
                    change={(value) => formik.setFieldValue("tenure", value)}
                    options={
                      // formik.values.tenure &&
                      // [...Array(parseInt(formik.values.tenure))].map((_, i) => ({
                      //   label: `${i + 1}`,
                      //   value: `${i + 1}`,
                      // }))
                      [...Array(tenure2)].map((_, i) => ({
                        label: `${i + 1}`,
                        value: `${i + 1}`,
                      }))
                    }
                    className="text-sm"
                    disableFilterSort={true}
                    required={true}
                  />
                  {/* <Dropdown
  title={t("Tenure (in months)")}
  placeholder={t("Choose")}
  value={formik.values.tenure}
  change={(value) => formik.setFieldValue("tenure", value)}
  options={
   
    Array.from({ length: tenure }, (_, index) => ({
      label: `${index + 1}`,
      value: `${index + 1}`
    }))
  }
  className="text-sm"
  disableFilterSort={true}
  required={true}
/> */}

                  <div className="flex flex-col gap-2 text-sm text-gray-900 mt-4">
                    Please upload any relevant document to be considered with
                    the loan request.
                    <FileUpload
                      change={(e) => formik.setFieldValue("file", e)}
                    />
                  </div>
                </div>
              </FlexCol>

              <FlexCol
                className={"borderb rounded-xl bg-white p-4 dark:bg-dark"}
              >
                <Heading
                  title={t("Repayment Plan")}
                  description={t("Have a look at your payments scheduled")}
                  className={
                    "bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"
                  }
                />
                <div className="borderb rounded-lg p-2">
                  <table className="w-full table-auto">
                    <thead className="borderb rounded-lg bg-[#F4F4F4] dark:bg-dark">
                      <tr className="borderb text-gray-500">
                        <th className="px-4 py-2">Installment Number</th>
                        <th className="px-4 py-2">Amount to Pay</th>
                        <th className="px-4 py-2">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {selectedLoanPolicy?.repaymentType === "fixedRate"
                        ? repaymentPlan.map((data, index) => (
                            <tr key={index} className="borderb">
                              <td className="px-4 py-2">
                                {data.installmentNumber}
                              </td>
                              <td className="px-4 py-2">
                                {/* {data.amountToPay} */}
                                {companyDetails?.currency &&
                                companyDetails.currency.length > 1
                                  ? `${data.amountToPay
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                                      companyDetails.currency
                                    }`
                                  : `${
                                      companyDetails?.currency
                                    } ${data.amountToPay
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                              </td>
                              <td className="px-4 py-2">
                                {/* {data.outstanding} */}

                                {companyDetails?.currency &&
                                companyDetails.currency.length > 1
                                  ? `${data.outstanding
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                                      companyDetails.currency
                                    }`
                                  : `${
                                      companyDetails?.currency
                                    } ${data.outstanding
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                              </td>
                            </tr>
                          ))
                        : installments.map((installment, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">{index + 1}</td>
                              <td className="px-4 py-2">
                                <FormInput
                                  type="number"
                                  value={installment}
                                  change={(e) =>
                                    handleInstallmentChange(index, e)
                                  }
                                />
                              </td>
                              <td className="px-4 py-2">
                                {/* AED {calculateOutstanding(index).toFixed(2)} */}
                                {companyDetails?.currency &&
                                companyDetails.currency.length > 1
                                  ? `${calculateOutstanding(index)
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                                      companyDetails.currency
                                    }`
                                  : `${
                                      companyDetails?.currency
                                    } ${calculateOutstanding(index)
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                  {repaymentError && (
                    <div className="text-red-500">{repaymentError}</div>
                  )}
                </div>
              </FlexCol>
            </>
          )}
        </FlexCol>
      </Flex>
    </DrawerPop>
  );
}

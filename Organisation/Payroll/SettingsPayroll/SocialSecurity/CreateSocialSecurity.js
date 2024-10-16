import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useFormik } from "formik";
import * as yup from "yup";
import Stepper from "../../../../common/Stepper";
import Accordion from "../../../../common/Accordion";
import FormInput from "../../../../common/FormInput";
import { useSelector } from "react-redux";
import Dropdown from "../../../../common/Dropdown";
import { Flex } from "antd";
import FlexCol from "../../../../common/FlexCol";
import CheckBoxInput from "../../../../common/CheckBoxInput";
import API, { action } from "../../../../Api";
import { Paycalculation } from "../../../../data";
import PAYROLLAPI, { Payrollaction } from "../../../../PayRollApi";
import EmployeeCheck from "../../../../common/EmployeeCheck";
import { useNotification } from "../../../../../Context/Notifications/Notification";
import localStorageData from "../../../../common/Functions/localStorageKeyValues";

export default function CreateSocialSecurity({
  open,
  close = () => {},
  refresh,
  updateId,
}) {
  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState(updateId ? true : false);
  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [activeBtnValue, setActiveBtnValue] = useState("createssc");
  const [nextStep, setNextStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [assignBtnName, setAssignBtnName] = useState("employees");
  const [country, setCountry] = useState([]);
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState([]);
  const [sscId, setSSCTypeId] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [employeeSearchData, setEmployeeSearchData] = useState([]);
  const [CountryIdData, setCountryIdData] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);
  const [allEmploylist, setAllemploylist] = useState([]);
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
  );

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    setShow(false);
    refresh();
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
      socialSecurityContributionName: "",
      employerContribution: "",
      employeeContribution: "",
      deductedFrom: null,
      wageMaxLimit: "",
      yearStartRenewel: 0,
      companyId: companyId,
      countryId: "",
      countryName: null,
      isActive: 1,
      createdBy: loggedEmployeeId,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,

    validationSchema: yup.object().shape({
      socialSecurityContributionName: yup
        .string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z]+$/,
          "Name should contain only characters without any space"
        )
        .min(3, "Name must be at least 3 characters long")
        .max(10, "Name cannot exceed 10 characters"),
      countryName: yup.string().required("Nationality is required"),
      employerContribution: yup
        .string()
        .required("Employer Contribution is required"),
      employeeContribution: yup
        .string()
        .required("Employee Contribution is required"),
      deductedFrom: yup.string().required("Deducted From is required"),
      wageMaxLimit: yup
        .string()
        .required("Wage Max Limit is required")
        .min(3, "Wage Max Limit must be at least 3 digits")
        .max(7, "Wage Max Limit cannot exceed 7 digits"),
    }),

    onSubmit: async (e) => {
      setLoading(true);

      if (!updateId) {
        try {
          const deductedFromValue =
            e.deductedFrom === "basicSalary" ? "1" : "2";
          const yearStartRenewelValue = e.yearStartRenewel ? "1" : "0";
          const result = await Payrollaction(
            PAYROLLAPI.CREATE_SocialSecurityContributions_RECORD,
            {
              socialSecurityContributionName:
                e.socialSecurityContributionName.charAt(0).toUpperCase() +
                e.socialSecurityContributionName.slice(1),
              employerContribution: e.employerContribution,
              employeeContribution: e.employeeContribution,
              deductedFrom: deductedFromValue,
              wageMaxLimit: e.wageMaxLimit,
              yearStartRenewel: yearStartRenewelValue,
              companyId: companyId,
              countryId: e.countryId,
              // countryName: e.countryName,
              rules: null,
              isActive: 1,
              createdBy: loggedEmployeeId,
            }
          );

          if (result.status === 200) {
            setSSCTypeId(result.result.insertedId);
            openNotification("success", "Successful", result.message);
            setPresentage(1);
            setNextStep(nextStep + 1);
            setActiveBtnValue("assign");
            setLoading(false);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors && result.errors && result.errors.isUnique;
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
          }
        } catch (error) {
          openNotification(
            "error",
            "Info",
            "There was an error while saving the category. Please try again."
          );
          setLoading(false);
        }
      } else {
        try {
          const deductedFromValue =
            formik.values.deductedFrom === "basicSalary" ? "1" : "2";
          const yearStartRenewelValue =
            formik.values.yearStartRenewel === "1" ? "1" : "0";

          const result = await Payrollaction(
            PAYROLLAPI.UPDATE_SocialSecurityContributions_RECORD_BY_ID,
            {
              id: updateId,
              socialSecurityContributionName:
                formik.values.socialSecurityContributionName
                  .charAt(0)
                  .toUpperCase() +
                formik.values.socialSecurityContributionName.slice(1),
              employerContribution: formik.values.employerContribution,
              employeeContribution: formik.values.employeeContribution,
              deductedFrom: deductedFromValue,
              wageMaxLimit: formik.values.wageMaxLimit,
              yearStartRenewel: yearStartRenewelValue,
              companyId: companyId,
              countryId: formik.values.countryId,
              countryName: formik.values.countryName,
              isActive: 1,
              rules: null,
              createdBy: loggedEmployeeId,
            }
          );

          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setPresentage(1);
            setNextStep(nextStep + 1);
            setLoading(false);
          } else if (result.status === 400) {
            const errorMessage =
              result.errors && result.errors && result.errors.isUnique;
            openNotification("error", "Info", errorMessage || result.message);
            setLoading(false);
          } else if (result.status === 500) {
            openNotification("error", "Info", result.message);
          }
        } catch (error) {
          openNotification(
            "error",
            "Info",
            "There was an error while saving the category. Please try again."
          );
          setLoading(false);
        }
      }
    },
  });

  const initialValues = {
    socialSecurityContributionName: "",
  };

  const Formik2 = useFormik({
    initialValues,

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({}),

    onSubmit: async (e) => {
      setLoading(false);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        const result = await Payrollaction(
          PAYROLLAPI.ASSIGN_EMPLOYEE_FOR_SocialSecurityContributions,
          {
            socialSecurityContributionId: sscId,
            companyId: companyId,
            withEffectfrom: formattedDate,
            isActive: 1,
            createdBy: loggedEmployeeId,
            employeeId: selectedEmployeeId
              .map((each) => each.assign && each.id)
              .filter((data) => data),
          }
        );
        if (result.status === 200) {
          openNotification("success", "Successful", result.message, () => {
            handleClose();
          });
          setTimeout(() => {
            handleClose();
            refresh();
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Info", error.code);
        setLoading(false);
      }
    },
  });

  const CreateSSCSteps = [
    {
      id: 0,
      value: 0,
      title: "Create SSC",
      data: "createssc",
    },
    {
      id: 1,
      value: 1,
      title: "Assign",
      data: "assign",
    },
  ];

  useEffect(() => {
    if (activeBtn < 1 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(CreateSSCSteps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const navigateBtn = [{ id: 1, value: "Employees", title: "Employees" }];
  const [activeTab, setActiveTab] = useState(navigateBtn[0].id);

  const getCountry = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);
      if (result?.result) {
        const options = result.result.map(({ countryId, countryName }) => ({
          id: countryId,
          label: countryName,
          value: countryName,
          countryId: countryId,
        }));

        setCountry(options);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  const getSscRecordsById = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await Payrollaction(
        PAYROLLAPI.GET_SocialSecurityContributions_RECORD_BY_ID,
        {
          id: e,
        }
      );
      if (result.result && result.result.length > 0) {
        const record = result.result[0];
        formik.setFieldValue(
          "socialSecurityContributionName",
          record.socialSecurityContributionName
        );
        formik.setFieldValue("countryName", record.countryName);
        formik.setFieldValue("countryId", record.countryId);
        formik.setFieldValue(
          "employerContribution",
          record.employerContribution
        );
        formik.setFieldValue(
          "employeeContribution",
          record.employeeContribution
        );
        formik.setFieldValue("wageMaxLimit", record.wageMaxLimit);
        formik.setFieldValue("yearStartRenewel", record.yearStartRenewel);
        // Set deductedFrom value based on the response
        const deductedFromValue =
          record.deductedFrom === "1" ? "basicSalary" : "grossSalary";
        formik.setFieldValue("deductedFrom", deductedFromValue);

        const employeeId = record.employee.map((emp) => emp.employeeId);
        setEmployeeList(employeeId);
        setEmployeeId(employeeId);
        setIsUpdate(true);
      } else {
        console.log("No data found for the given ID");
      }
    }
  };

  useEffect(() => {
    getSscRecordsById(updateId);
  }, [updateId]);

  // const updateSscById = async () => {
  //   console.log({
  //     id: updateId,
  //     socialSecurityContributionName:
  //       formik.values.socialSecurityContributionName,
  //     employerContribution: formik.values.employerContribution,
  //     employeeContribution: formik.values.employeeContribution,
  //     deductedFrom: formik.values.deductedFrom,
  //     wageMaxLimit: formik.values.wageMaxLimit,
  //     yearStartRenewel: formik.values.yearStartRenewel,
  //     companyId: companyId,
  //     countryId: formik.values.countryId,
  //     countryName: formik.values.countryName,
  //     isActive: 1,
  //     rules: null,
  //     createdBy: loggedEmployeeId,
  //   });
  //   try {
  //     const deductedFromValue =
  //       formik.values.deductedFrom === "basicSalary" ? "1" : "2";
  //     const yearStartRenewelValue =
  //       formik.values.yearStartRenewel === "1" ? "1" : "0";

  //     const result = await Payrollaction(
  //       PAYROLLAPI.UPDATE_SocialSecurityContributions_RECORD_BY_ID,
  //       {
  //         id: updateId,
  //         socialSecurityContributionName:
  //           formik.values.socialSecurityContributionName,
  //         employerContribution: formik.values.employerContribution,
  //         employeeContribution: formik.values.employeeContribution,
  //         deductedFrom: deductedFromValue,
  //         wageMaxLimit: formik.values.wageMaxLimit,
  //         yearStartRenewel: yearStartRenewelValue,
  //         companyId: companyId,
  //         countryId: formik.values.countryId,
  //         countryName: formik.values.countryName,
  //         isActive: 1,
  //         rules: null,
  //         createdBy: loggedEmployeeId,
  //       }
  //     );

  //     console.log(result);

  //     if (result.status === 200) {
  //       openNotification("success", "Successful", result.message);
  //       setPresentage(1);
  //       setNextStep(nextStep + 1);
  //     } else if (result.status === 400) {
  //       const errorMessage =
  //         result.errors &&
  //         result.errors[0] &&
  //         result.errors[0].socialSecurityContributionName;
  //       openNotification(
  //         "error",
  //         "Update Social Security Contributions Failed",
  //         errorMessage || result.message
  //       );
  //     } else if (result.status === 500) {
  //       openNotification("error", "Something went wrong", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during form submission:", error);
  //     openNotification(
  //       "error",
  //       "Error saving category",
  //       "There was an error while saving the category. Please try again."
  //     );
  //   }
  // };

  // useEffect(() => {
  //   switch (assignBtnName) {
  //     default:
  //       getEmployee();
  //       break;
  //   }
  // }, [assignBtnName]);

  const handleToggleList = (id, checked) => {
    // console.log(checked);
    // console.log(id);
    if (id === 0) {
      switch (assignBtnName) {
        default:
          setEmployeeList((prevSwitches) =>
            prevSwitches?.map((sw) => ({ ...sw, assign: checked }))
          );
          break;
      }
    } else {
      switch (assignBtnName) {
        default:
          setEmployeeList((prevSwitches) =>
            prevSwitches?.map((sw) =>
              sw?.id === id ? { ...sw, assign: checked } : sw
            )
          );
          break;
      }
    }
  };

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      getEmployee();
    }
  };
  useEffect(() => {
    setEmployeeList((prevSwitches) =>
      prevSwitches?.map((sw) =>
        employeeId.includes(sw?.id) ? { ...sw, assign: true } : sw
      )
    );
  }, [employeeSearchData]);

  const getEmployee = async () => {
    // Check if the countryId exists
    if (!CountryIdData) {
      // console.log("Country not selected");
      return; // Exit the function if countryId is not selected
    }

    const result = await action(API.GET_EMPLOYEE_LIST_BY_COUNTRY_CODE, {
      companyId: companyId,
      countryId: formik.values.countryId,
    });

    // Check if result.result exists and is an array
    if (!Array.isArray(result.result)) {
      // console.log("Result is not an array");
      return;
    }

    // Map over result.result if it exists and is an array
    setEmployeeList(
      result.result.map((each) => ({
        id: each.employeeId,
        label: each.lastName,
        value: each.dateOfBirth,
        assign: false,
      }))
    );
    setAllemploylist(
      result.result?.map((each) => ({
        employeeId: parseInt(each.employeeId),
        employeeName: each.firstName + " " + each.lastName,
        value: each.dateOfBirth,
        profilePicture: each.profilePicture,
      }))
    );
    setEmployeeSearchData(result.result);
  };

  useEffect(() => {
    // switch (assignBtnName) {
    //   default:
    setEmployeeList(
      searchData.map((each) => ({
        id: each.employeeId,
        label: each.lastName,
        value: each.dateOfBirth,
        assign: false,
      }))
    );
  }, [searchData]);

  const updateUserForSscById = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const result = await Payrollaction(
        PAYROLLAPI.UPDATE_SocialSecurityContributions_EMPLOYEES_BY_ID,
        {
          socialSecurityContributionId: updateId,
          withEffectfrom: formattedDate,
          isActive: 1,
          createdBy: loggedEmployeeId,
          employeeId: selectedEmployeeId
            .map((each) => each.assign && each.id)
            .filter((data) => data),
        }
      );

      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {
          handleClose();
        });
        setTimeout(() => {
          handleClose();
          refresh();
          // window.location.reload();
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Info", error.code);
    }
  };

  let countrydata = CountryIdData || formik.values.countryId;

  return (
    <div className="container_align">
      {show && (
        <DrawerPop
          placement="bottom"
          contentWrapperStyle={{
            position: "absolute",
            height: "100%",
            top: 0,
            // left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            borderRadius: 0,
            borderTopLeftRadius: "0px !important",
            borderBottomLeftRadius: 0,
          }}
          open={show}
          close={(e) => {
            setIsUpdate(!isUpdate);
            handleClose();
          }}
          header={[
            !updateId
              ? t("Create Social Security Contributions")
              : t("Update Social Security Contributions"),
            !updateId
              ? t("Create Social Security Contributions By Simple Steps")
              : t("Update Social Security Contributions By Simple Steps"),
          ]}
          headerRight={
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2.5">
                <p className="text-sm font-medium text-gray-400">{t("Help")}</p>
                <RxQuestionMarkCircled className="text-2xl font-medium text-gray-400 " />
              </div>
            </div>
          }
          footerBtn={[
            t("Cancel"),
            activeBtnValue === "assign" ? t("Save") : "Save and Continue",
          ]}
          footerBtnDisabled={loading}
          className="widthFull"
          stepsData={CreateSSCSteps}
          // buttonClick={(e) => {
          //   console.log(activeBtnValue);
          //   if (activeBtnValue === "createssc") {
          //     // if (!updateId) {
          //     //   formik.handleSubmit();
          //     // } else {
          //     //   updateSscById();
          //     // }
          //     formik.handleSubmit();
          //     console.log("click 1");
          //     getEmployee();
          //   } else if (activeBtnValue === "assign") {
          //     console.log("click 2");
          //     if (!updateId) {
          //       Formik2.handleSubmit();
          //     } else {
          //       updateUserForSscById();
          //     }
          //   }
          // }}
          handleSubmit={(e) => {
            // console.log(e);
            if (activeBtnValue === "createssc") {
              // if (!updateId) {
              //   formik.handleSubmit();
              // } else {
              //   updateSscById();
              // }
              formik.handleSubmit();
              getEmployee();
            } else if (activeBtnValue === "assign") {
              if (!updateId) {
                Formik2.handleSubmit();
              } else {
                updateUserForSscById();
              }
            }
          }}
          buttonClickCancel={(e) => {
            if (activeBtn > 0) {
              setActiveBtn(activeBtn - 1);
              setNextStep(nextStep - 1);
              setActiveBtnValue(CreateSSCSteps?.[activeBtn - 1].data);
            }
          }}
          nextStep={nextStep}
          activeBtn={activeBtn}
          saveAndContinue={false}
        >
          <FlexCol>
            {CreateSSCSteps && (
              <Flex justify="center">
                <div className=" sticky -top-6  z-50 px-5 dark:bg-[#1f1f1f] w-2/5 pb-6 ">
                  <Stepper
                    steps={CreateSSCSteps}
                    currentStepNumber={activeBtn}
                    presentage={presentage}
                  />
                </div>
              </Flex>
            )}
            <Flex justify="center" align="center" className="w-full">
              {activeBtnValue === "createssc" ? (
                // <FlexCol className={"md:grid grid-cols-2 items-end p-4 "}>
                <Accordion
                  title={
                    updateId
                      ? t("Update_Social_Security_Contributions")
                      : t("Create_Social_Security_Contributions")
                  }
                  description={
                    updateId
                      ? t(
                          "This form facilitates the customization and adjustment of contribution settings to ensure compliance with local regulations and organizational policies"
                        )
                      : t(
                          "This form facilitates the customization and adjustment of contribution settings to ensure compliance with local regulations and organizational policies"
                        )
                  }
                  padding={true}
                  initialExpanded={true}
                  className="w-full col-span-2 sm:w-auto"
                  childrenGap="gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-full col-span-2 sm:col-span-1">
                      <FormInput
                        Id={"5"}
                        title={t("Name")}
                        placeholder={t("Name")}
                        change={(e) => {
                          formik.setFieldValue(
                            "socialSecurityContributionName",
                            e
                          );
                          if (formik.errors.socialSecurityContributionName) {
                            formik.setFieldError(
                              "socialSecurityContributionName",
                              undefined
                            );
                          }
                        }}
                        required={true}
                        value={formik.values.socialSecurityContributionName}
                        error={formik.errors.socialSecurityContributionName}
                      />
                    </div>

                    <Dropdown
                      className="col-span-2 sm:col-span-1"
                      title={t("Nationality")}
                      placeholder={t("Choose Nationality")}
                      change={(selectedCountry) => {
                        const selectedOption = country.find(
                          (option) => option.label === selectedCountry
                        );
                        if (selectedOption) {
                          formik.setFieldValue(
                            "countryName",
                            selectedOption.value
                          );
                          formik.setFieldValue(
                            "countryId",
                            selectedOption.countryId,
                            setCountryIdData(selectedOption.countryId)
                          );
                          if (formik.errors.countryName) {
                            formik.setFieldError("countryName", undefined);
                          }
                        }
                      }}
                      value={formik.values.countryName}
                      error={formik.errors.countryName}
                      options={country}
                      required={true}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="w-full col-span-3 sm:col-span-1">
                      <FormInput
                        Id={"5"}
                        title={t("Employee_Contribution")}
                        placeholder={t("Employee Contribution in %")}
                        change={(e) => {
                          // Remove any non-numeric characters from the input
                          const value = e.replace(/[^0-9.]/g, "");

                          // Convert the input to a float
                          // const value1 = value === "" ? "" : parseInt(value);

                          // Limit the value to a maximum of 100%
                          // if (value > 100) {
                          //   value = 100;
                          // }
                          // Check if the numeric value is not NaN
                          if (!isNaN(value)) {
                            // Limit the value to a maximum of 100%
                            const finalValue = value > 100 ? 100 : value;

                            formik.setFieldValue(
                              "employeeContribution",
                              finalValue
                            );
                            if (formik.errors.employeeContribution) {
                              formik.setFieldError(
                                "employeeContribution",
                                undefined
                              );
                            }
                          }
                        }}
                        value={formik.values.employeeContribution}
                        error={formik.errors.employeeContribution}
                        // type="number"
                        required={true}
                        maxLength={5}
                      />
                    </div>

                    <div className="w-full col-span-3 sm:col-span-1">
                      <FormInput
                        title={t("Employer_Contribution")}
                        placeholder={t("Employer Contribution in %")}
                        change={(e) => {
                          const value = e.replace(/[^0-9.]/g, "");
                          // const value1 = value === "" ? "" : parseInt(value);
                          // let value = parseFloat(e); // Convert the input to a float
                          // Limit the value to a maximum of 100%
                          if (!isNaN(value)) {
                            // Limit the value to a maximum of 100%
                            const finalValue = value > 100 ? 100 : value;
                            formik.setFieldValue(
                              "employerContribution",
                              finalValue
                            );
                            if (formik.errors.employerContribution) {
                              formik.setFieldError(
                                "employerContribution",
                                undefined
                              );
                            }
                          }
                        }}
                        value={formik.values.employerContribution}
                        error={formik.errors.employerContribution}
                        // type="number"
                        required={true}
                        maxLength={5}
                      />
                    </div>

                    <Dropdown
                      className="col-span-3 sm:col-span-1"
                      title={t("Deducted_From")}
                      placeholder={t("Choose Deducted From")}
                      change={(e) => {
                        formik.setFieldValue("deductedFrom", e);
                        if (formik.errors.deductedFrom) {
                          formik.setFieldError("deductedFrom", undefined);
                        }
                      }}
                      options={Paycalculation}
                      value={formik.values.deductedFrom}
                      error={formik.errors.deductedFrom}
                      required={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="w-full col-span-2 sm:col-span-1">
                      <FormInput
                        title={t("Wage Max Limit")}
                        placeholder={t("Wage Max Limit")}
                        change={(e) => {
                          // Convert the input to a float
                          const value = e.replace(/\D/g, "");
                          const value1 = value === "" ? "" : parseInt(value);

                          // Allow only positive numbers
                          if (!isNaN(value1)) {
                            // Limit the value to a maximum of 100%
                            const finalValue = value1 < 0 ? 0 : value1;

                            // Set the value in formik state
                            formik.setFieldValue("wageMaxLimit", finalValue);
                            if (formik.errors.wageMaxLimit) {
                              formik.setFieldError("wageMaxLimit", undefined);
                            }
                          }
                        }}
                        value={formik.values.wageMaxLimit}
                        error={formik.errors.wageMaxLimit}
                        // type="number"
                        required={true}
                      />
                    </div>

                    <div className="font-medium leading-[24px] flex items-start gap-1 col-span-2 sm:col-span-1">
                      <div
                        className="font-medium translate-y-3 dark:text-white"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <CheckBoxInput
                          titleRight={"Renewal at Start of year"}
                          value={formik.values.yearStartRenewel === "1"}
                          change={(e) => {
                            formik.setFieldValue(
                              "yearStartRenewel",
                              e ? "1" : "0"
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Accordion>
              ) : (
                // </FlexCol>
                //     <div className="flex justify-center w-full">
                //       <FlexCol>
                //         <Heading
                //           title={t("Assign")}
                //           description={t("Assign")}
                //           padding={false}
                //           className="col-span-2 Text_area"
                //         />
                //         <div className="flex flex-col gap-6 p-2">
                //           <div className="!rounded-2xl flex flex-col gap-6 ">
                //             {navigateBtn && (
                //               <div className="flex gap-2 p-[6px] bg-[#FAFAFA] dark:bg-secondaryDark border border-black border-opacity-10 rounded-xl flex-wrap">
                //                 {navigateBtn?.map((tab) => (
                //                   <button
                //                     key={tab.id}
                //                     onClick={() => {
                //                       setAllSelect(false);
                //                       console.log(tab.value);
                //                       //  tabClick(tab.value);
                //                       setAssignBtnName(tab.value);
                //                       setActiveTab(tab.id);
                //                       //  setTabName(tab.value);
                //                     }}
                //                     className={`${activeTab === tab.id ? "" : ""
                //                       } text-sm font-medium whitespace-nowrap py-3 px-[18px] relative rounded-lg group`}
                //                   >
                //                     {activeTab === tab.id && (
                //                       <motion.div
                //                         layoutId="bubble"
                //                         className="absolute inset-0 z-10 rounded-lg bg-accent"
                //                         transition={{
                //                           type: "spring",
                //                           duration: 0.6,
                //                         }}
                //                       ></motion.div>
                //                     )}
                //                     <span
                //                       className={`${activeTab === tab.id
                //                           ? "relative z-20 text-white"
                //                           : " text-black dark:text-white group-hover:text-primary"
                //                         }`}
                //                     >
                //                       {tab.title}
                //                     </span>
                //                   </button>
                //                 ))}
                //               </div>
                //             )}
                //             <SearchBox
                //               placeholder="Search Employess"
                //               value={searchValue}
                //               change={(e) => {
                //                 console.log(e);
                //                 setSarchValue(e);
                //               }}
                //               icon={<LuSearch className="text-[20px]" />}
                //               data={
                //                 assignBtnName === "employees" && employeeSearchData
                //               }
                //               onSearch={(value) => {
                //                 console.log(value);
                //                 setSearchData(value);
                //               }}
                //             />
                //             {/* <div className="">
                //   <div className="relative">
                //     <span className="absolute  opacity-50 top-3.5 ltr:left-3 rtl:right-3">
                //       <LuSearch className="text-[20px]" />
                //     </span>

                //     <input
                //       type="text"
                //       placeholder={"Search Employess"}
                //       value={""}
                //       onChange={(e) => "change"(e.target.value)}
                //       className={`w-full text-sm border focus:outline-none rounded-[8px] p-4 pl-10`}
                //     />
                //   </div>
                // </div> */}
                //             <div className="flex flex-col gap-8 ">
                //               <div className="flex flex-col grid-cols-12 gap-3 py-2 md:grid md:items-center ">
                //                 <div className="flex items-center justify-between col-span-5">
                //                   <div className="flex items-center justify-between">
                //                     <CheckBoxInput
                //                       change={(e) => {
                //                         handleToggleList(0, e);
                //                         setAllSelect(e);
                //                         console.log(e);
                //                       }}
                //                       value={allSelect}
                //                     >
                //                       Select All
                //                     </CheckBoxInput>
                //                   </div>
                //                   <p className="mb-0 text-sm font-semibold text-accent">
                //                     All Employees-
                //                     {assignBtnName === "employees" &&
                //                       employeeList.length}
                //                   </p>
                //                 </div>
                //                 <div className="flex items-center justify-end col-span-7 ">
                //                   {allSelect && (
                //                     <div className="flex justify-end items-center text-[12px] font-medium text-accent py-2 px-3 rounded-full bg-[#F9F5FF] dark:bg-dark">
                //                       <p className="mb-0 ">Remove All</p>
                //                       <RxCross2 className=" text-[18px] font-medium pl-1 text-[#9E77ED]" />
                //                     </div>
                //                   )}
                //                 </div>
                //               </div>

                //               <List>
                //                 <VirtualList
                //                   data={
                //                     assignBtnName === "employees" && employeeList
                //                   }
                //                   height={400}
                //                   itemHeight={47}
                //                   itemKey="email"
                //                   onScroll={onScroll}
                //                 >
                //                   {(item) => (
                //                     <List.Item
                //                       key={item.email}
                //                       onClick={(e) => {
                //                         // console.log(e, "e");
                //                         // setAssignSelect(
                //                         //   item.id !== assignSelect ? item.id : 0
                //                         // );
                //                         if (item.id !== assignSelect) {
                //                           // console.log("true value");
                //                           setAssignEmployee([
                //                             ...assignEmployee,
                //                             item.id,
                //                           ]);
                //                         } else {
                //                           // console.log("false value");

                //                           // console.log(
                //                           //   assignEmployee.splice(item.id, 1)
                //                           // );
                //                           setAssignEmployee(
                //                             assignEmployee.splice(item.id, 1)
                //                           );
                //                         }
                //                       }}
                //                       className="cursor-pointer "
                //                     >
                //                       <CheckBoxInput
                //                         change={(e) => {
                //                           handleToggleList(item.id, e);
                //                           // handleColumnVisibilityChange(item.id);
                //                           // setAllSelect(item.id ? true : false);
                //                           // setAssignSelect(e ? item.id : 0);
                //                           // console.log(item.assign);
                //                           // if (e === true) {
                //                           //   setAssignEmployee([
                //                           //     ...assignEmployee,
                //                           //     item.id,
                //                           //   ]);
                //                           // } else {
                //                           //   // console.log(
                //                           //   //   assignEmployee.splice(item.id, 1)
                //                           //   // );
                //                           //   setAssignEmployee(
                //                           //     assignEmployee.splice(item.id, 1)
                //                           //   );
                //                           // }
                //                         }}
                //                         value={item.assign}
                //                         className="pr-2"
                //                       />
                //                       <List.Item.Meta
                //                         avatar={
                //                           <Avatar
                //                             src={profile}
                //                             className="w-12 h-12 mx-2 "
                //                           />
                //                         }
                //                         title={
                //                           <a href="https://ant.design">
                //                             {item.label}
                //                           </a>
                //                         }
                //                         description={item.value}
                //                         className="flex items-center"
                //                       />
                //                       {/* <div>Content</div> */}
                //                     </List.Item>
                //                   )}
                //                 </VirtualList>
                //               </List>
                //             </div>
                //           </div>
                //         </div>
                //       </FlexCol>
                //     </div>

                <div className="flex justify-center max-w-2/3">
                  {countrydata && (
                    <EmployeeCheck
                      title={t("Assign")}
                      description={t("Assign Employees")}
                      employee={employeeList}
                      countryBasedEmployee={true}
                      countryId={countrydata}
                      navigateBtn={navigateBtn}
                      datas={allEmploylist}
                      assignData={(employee, department, location) => {
                        setSelectedEmployeeId(employee);

                        // setDepartmentList(department);
                        // setLocationList(location);
                      }}
                    />
                  )}
                </div>
              )}
            </Flex>
          </FlexCol>
        </DrawerPop>
      )}
    </div>
  );
}

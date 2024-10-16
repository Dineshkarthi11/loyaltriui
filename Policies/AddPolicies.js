/* eslint-disable no-unused-expressions */
import React, { useEffect, useMemo, useState } from "react";
import CheckBoxInput from "../common/CheckBoxInput";
import TimeSelect from "../common/TimeSelect";
import Dropdown from "../common/Dropdown";
import lineImage from "../../assets/images/Group 2516.png";
import { IoMdAdd } from "react-icons/io";
import { PiTrash } from "react-icons/pi";
import Accordion from "../common/Accordion";
import FormInput from "../common/FormInput";
import { Flex, Tooltip } from "antd";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useTranslation } from "react-i18next";

import { useFormik } from "formik";
import * as yup from "yup";
import API, { action } from "../Api";

import { motion } from "framer-motion";
import { HalfDay, FullDay } from "../common/SVGFiles";
import imgorange from "../../assets/images/calendar-orange.png";

import {
  DaysDivider,
  Deduction,
  Multiplyer,
  allowanceType,
  attendanceHolidayOverTime,
  attendanceOnHolidays,
  automationPolicies,
  breakRule,
  customRateExtraHours,
  customType,
  deductionTypeOption,
  exitRule,
  extraHoursOnWeekDays,
  lateentrypolicy,
  lessWorkinghours,
  missPunchDeductionTypeOption,
  missPunchPolicy,
  navigateBtn,
  occurrence,
  occurrenceType,
  policiesMenu,
  regularOvertime,
  workPolicyOvertimeCheck,
} from "../data";
import { PiArrowRight, PiCloudWarningBold } from "react-icons/pi";
import DrawerPop from "../common/DrawerPop";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import Stepper from "../common/Stepper";
import EmployeeCheck from "../common/EmployeeCheck";
import Heading2 from "../common/Heading2";
import { useNotification } from "../../Context/Notifications/Notification";
import RadioButton from "../common/RadioButton";
import Heading3 from "../common/Heading3";
import ToggleBtn from "../common/ToggleBtn";
import ButtonClick from "../common/Button";

export default function AddPolicies({
  open,
  close = () => {},
  updateId,
  refresh,
}) {
  const [show, setShow] = useState(open);

  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [insertedId, setInsertedId] = useState();
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [departmentCheckList, setDepartmentCheckList] = useState([]);
  const [locationCheckList, setLocationCheckList] = useState([]);

  const [customRate, setCustomRate] = useState(1);
  const [activeBtnValue, setActiveBtnValue] = useState("policies"); //policies || createPolicy

  const [pilicyIdByDetails, setPilicyIdByDetails] = useState(0);

  const [formik2, setFormik2] = useState();

  const [breakRuleFormik2, setBreakRuleFormik2] = useState();

  const [exitRuleFormik2, setExitRuleFormik2] = useState();

  const { showNotification } = useNotification();

  const [attendanceHolidays, setAttendanceHolidays] = useState(false);

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

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeBtnValue]);

  // Notification End

  const [lateEntryList, setLateEntryList] = useState([]);
  const [breakRuleList, setBreakRuleList] = useState([]);
  const [exitRuleList, setExitRuleList] = useState([]);
  const [extraHoursOnWeekDaysList, setExtraHoursOnWeekDaysList] = useState([]);
  const [customRateExtraHoursList, setCustomRateExtraHoursList] = useState([]);
  const [attendanceHolidayOvertimeList, setAttendanceHolidayOvertimeList] =
    useState([]);
  const [lessWorkinghoursList, setLessWorkinghoursList] = useState([]);
  const [missPunchPolicyList, setMissPunchPolicyList] = useState([]);

  //update Data

  const [timeOutPolicyData, setTimeoutPolicyData] = useState(null);

  const [reloadValueFirst, setReloadValueFirst] = useState([]);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
    if (JSON.parse(localStorage.getItem("lateEntryList"))) {
      setLateEntryList(JSON.parse(localStorage.getItem("lateEntryList")));
    } else {
      setLateEntryList(lateentrypolicy);
    }
    if (JSON.parse(localStorage.getItem("breakRuleList"))) {
      setBreakRuleList(JSON.parse(localStorage.getItem("breakRuleList")));
    } else {
      setBreakRuleList(breakRule);
    }
    if (JSON.parse(localStorage.getItem("exitRuleList"))) {
      setExitRuleList(JSON.parse(localStorage.getItem("exitRuleList")));
    } else {
      setExitRuleList(exitRule);
    }

    if (JSON.parse(localStorage.getItem("extraHoursOnWeekDaysList"))) {
      setExtraHoursOnWeekDaysList(
        JSON.parse(localStorage.getItem("extraHoursOnWeekDaysList"))
      );
    } else {
      setExtraHoursOnWeekDaysList(extraHoursOnWeekDays);
    }
    if (JSON.parse(localStorage.getItem("customRateExtraHoursList"))) {
      setCustomRateExtraHoursList(
        JSON.parse(localStorage.getItem("customRateExtraHoursList"))
      );
    } else {
      setCustomRateExtraHoursList(customRateExtraHours);
    }
    if (JSON.parse(localStorage.getItem("attendanceHolidayOvertimeList"))) {
      setAttendanceHolidayOvertimeList(
        JSON.parse(localStorage.getItem("attendanceHolidayOvertimeList"))
      );
    } else {
      setAttendanceHolidayOvertimeList(attendanceHolidayOverTime);
    }

    if (JSON.parse(localStorage.getItem("lessWorkinghoursList"))) {
      setLessWorkinghoursList(
        JSON.parse(localStorage.getItem("lessWorkinghoursList"))
      );
    } else {
      setLessWorkinghoursList(lessWorkinghours);
    }
    if (JSON.parse(localStorage.getItem("missPunchPolicyList"))) {
      setMissPunchPolicyList(
        JSON.parse(localStorage.getItem("missPunchPolicyList"))
      );
    } else {
      setMissPunchPolicyList(missPunchPolicy);
    }
  }, []);

  useEffect(() => {
    switch (reloadValueFirst[0]) {
      case "lateEntryList":
        setLateEntryList(lateEntryList);
        break;
      case "breakRuleList":
        setBreakRuleList(breakRuleList);
        break;
      case "exitRuleList":
        setExitRuleList(exitRuleList);
        break;
      case "extraHoursOnWeekDaysList":
        setExtraHoursOnWeekDaysList(extraHoursOnWeekDaysList);
        break;
      case "customRateExtraHoursList":
        setCustomRateExtraHoursList(customRateExtraHoursList);
        break;
      case "lessWorkinghoursList":
        setAttendanceHolidayOvertimeList(attendanceHolidayOvertimeList);
        break;
      case "missPunchPolicyList":
        setMissPunchPolicyList(missPunchPolicyList);
        break;

      default:
        break;
    }
    // if (reloadValueFirst[0] === "lateEntryList")
    //   setLateEntryList(lateEntryList);
  }, [reloadValueFirst]);

  const formik = useFormik({
    initialValues: {
      workPolicyName: "",
      workPolicyType: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      // workPolicyName: yup.string().required("Please choose Work Policy"),
      // workPolicyType: yup.string().required("Please choose Work Policy Type"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
    },
  });

  let dynamicFields;
  let dynamicFieldTwo;
  let dynamicFieldThree;
  if (updateId) {
    dynamicFields = lateEntryList?.reduce((ac, each) => {
      //lateEntryList
      each.field.reduce((acc, value) => {
        acc[each.inputType] = null;
        return acc;
      });
    }, {});
    dynamicFieldTwo = breakRuleList?.reduce((ac, each) => {
      each.field.reduce((acc, value) => {
        acc[each.inputType] = null;
        return acc;
      });
    }, {});
    dynamicFieldThree = exitRuleList?.reduce((ac, each) => {
      each.field.reduce((acc, value) => {
        acc[each.inputType] = null;
        return acc;
      });
    }, {});
  } else {
    dynamicFields = lateentrypolicy?.reduce((ac, each) => {
      each.field.reduce((acc, value) => {
        acc[each.inputType] = null;
        return acc;
      });
    }, {});
  }

  // useEffect(() => {
  //   if (formik.values.workPolicyName) {
  //     formik.handleSubmit();
  //   }
  // }, [formik.values.workPolicyName]);

  const initialValues = {
    policyName: "",
    lateEntryOccurrence: null,
    breakRuleOccurrence: null,
    exitRuleOccurrence: null,
    lateEntryOccurrenceType: null,
    breakRuleOccurrenceType: null,
    exitRuleOccurrenceType: null,
    lateEntryOccurrenceTypeValue: null,
    breakRuleOccurrenceTypeValue: null,
    exitRuleOccurrenceTypeValue: null,
    warningEmail: 0,

    ...dynamicFields,
    ...dynamicFieldTwo,
    ...dynamicFieldThree,
  };

  const safeFlatMap = (list) =>
    (list ?? []).flatMap((each) =>
      (each.field ?? []).map((field) => [
        field.inputType,
        yup.string().required(`${field.title} lateEntryListis required`),
      ])
    );

  const Formik2 = useFormik({
    initialValues,

    enableReinitialize: true,
    validateOnChange: false,

    validationSchema: yup.object().shape({
      policyName: yup.string().required("Work Policy Name is required"),

      ...(formik2 && Object.fromEntries(safeFlatMap(lateEntryList))),
      ...(breakRuleFormik2 && Object.fromEntries(safeFlatMap(breakRuleList))),
      ...(exitRuleFormik2 && Object.fromEntries(safeFlatMap(exitRuleList))),
      // ...Object.fromEntries(safeFlatMap(lateEntryList)),
      // ...Object.fromEntries(safeFlatMap(breakRuleList)),
      // ...Object.fromEntries(safeFlatMap(exitRuleList)),
      // ...additionalValidations2,
    }),

    onSubmit: async (e) => {
      try {
        if (updateId || insertedId) {
          const result = await action(API.UPDATE_WORK_POLICY, {
            workPolicyId: updateId || insertedId,
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.policyName,
            warningEmail: e.warningEmail,
            workRules: {
              lateEntryRule: {
                occurrence: {
                  type: e.lateEntryOccurrenceType,
                  value: e.lateEntryOccurrenceTypeValue,
                },
                rule: lateEntryList?.map((each) => ({
                  minutes: e[each.field[0].inputType], //hours
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
              breakRule: {
                occurrence: {
                  type: e.breakRuleOccurrenceType,
                  value: e.breakRuleOccurrenceTypeValue,
                },
                rule: breakRuleList?.map((each) => ({
                  minutes: e[each.field[0].inputType], //hours
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
              exitRule: {
                occurrence: {
                  type: e.exitRuleOccurrenceType,
                  value: e.exitRuleOccurrenceTypeValue,
                },
                rule: exitRuleList?.map((each) => ({
                  minutes: e[each.field[0].inputType], //hours
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
            },
          });
          if (result.status === 200) {
            // setInsertedId(result.result.insertedId);
            setNextStep(nextStep + 1);
            openNotification("success", "Successful", result.message);
            setLoading(false);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_EMPLOYEE_WORK_POLICY_DETAILS, {
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.policyName,
            warningEmail: e.warningEmail,
            workRules: {
              lateEntryRule: {
                occurrence: {
                  type: e.lateEntryOccurrenceType,
                  value: e.lateEntryOccurrenceTypeValue,
                },
                rule: lateEntryList?.map((each) => ({
                  minutes: e[each.field[0].inputType], //hours
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
              breakRule: {
                occurrence: {
                  type: e.breakRuleOccurrenceType,
                  value: e.breakRuleOccurrenceTypeValue,
                },
                rule: breakRuleList?.map((each) => ({
                  minutes: e[each.field[0].inputType], //hours
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
              exitRule: {
                occurrence: {
                  type: e.exitRuleOccurrenceType,
                  value: e.exitRuleOccurrenceTypeValue,
                },
                rule: exitRuleList?.map((each) => ({
                  minutes: e[each.field[0].inputType], //hours
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
            },
          });

          if (result.status === 200) {
            setInsertedId(result.result.insertedId);
            setNextStep(nextStep + 1);
            openNotification("success", "Successful", result.message);
            setLoading(false);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }

        // }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });

  // OverTimePolicy
  const overTimeDynamicFields = customRateExtraHoursList.reduce((ac, each) => {
    each.field?.reduce((acc, value) => {
      acc[each.inputType || each?.InputOne?.inputType] = "";
      return acc;
    });
  }, {});

  const additionalValidations =
    customRate === 2
      ? Object.fromEntries(safeFlatMap(customRateExtraHoursList))
      : {};

  const Formik3 = useFormik({
    initialValues: {
      overtimePolicyName: "",
      fixedRateTime: "",
      fixedRateAmount: "",
      // isTrackOverTime: false,
      // isRequestOverTime: false,
      maximumOverTimePerMonth: "",
      overtimeType: "fixedRate",
      // offType: "",
      halfDay: "",
      fullDay: "",
      overtimeTypes: "",
      ...overTimeDynamicFields,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      overtimePolicyName: yup.string().required("Work Policy Name is required"),

      fixedRateTime:
        customRate === 1
          ? yup.string().required("Fixed Rate Time is required")
          : yup.string(),
      fixedRateAmount:
        customRate === 1
          ? yup.string().required("Fixed Rate Amount is required")
          : yup.string(),
      // maximumOverTimePerMonth: yup
      //   .string()
      //   .required("Maximum Over Time Per Month is required"),
      ...additionalValidations,
      halfDay:
        customRate === 3
          ? yup.string().required("Half Day is required")
          : yup.string(),
      fullDay:
        customRate === 3
          ? yup.string().required("Full Day is required")
          : yup.string(),
      // ...Object.fromEntries(
      //   safeFlatMap(
      //     customRateExtraHoursList
      //     // .flatMap((each) =>
      //     //   customRate === 2
      //     //     ? customRateExtraHoursList.flatMap((each) =>
      //     //         each.field.map((field) => [
      //     //           field.inputType,
      //     //           yup.string().required(`${field.title} is required`),
      //     //         ])
      //     //       )
      //     //     : []
      //     // )
      //   )
      // ),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId || insertedId) {
          const result = await action(API.UPDATE_WORK_POLICY, {
            workPolicyId: updateId || insertedId,
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.overtimePolicyName,
            workRules: {
              overTime: {
                Type: e.overtimeType,
                overtimeType: e.overtimeTypes,
                values:
                  customRate === 1
                    ? [
                        {
                          minutes: e.fixedRateTime, //hours
                          amount: e.fixedRateAmount,
                        },
                      ]
                    : customRate === 2
                    ? customRateExtraHoursList?.map((each) => ({
                        minutes: e[each.field[0].inputType], //hours
                        type: e[each.field[1].inputType],
                        salaryMultiplyer:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[2].inputType]
                            : null,
                        salaryComponent:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[3].inputType]
                            : null,
                        amount:
                          e[each.field[1].inputType] === "fixedAmount"
                            ? e[each.field[2].inputType]
                            : null,
                      }))
                    : [
                        {
                          halfDay: e.halfDay,
                          fullDay: e.fullDay,
                        },
                      ],
                maximumOverTimePerMonth: e.maximumOverTimePerMonth || null,
              },
            },
            isTrackOverTime: e.isTrackOverTime,
            isRequestOverTime: e.isRequestOverTime,
            // overtimeType: e.overtimeType,
            offType: e.offType,
          });
          if (result.status === 200) {
            // setInsertedId(result.result.insertedId);
            setNextStep(nextStep + 1);
            openNotification("success", "Successful", result.message);

            setLoading(false);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_EMPLOYEE_WORK_POLICY_DETAILS, {
            companyId: companyId,
            // workPolicyId: insertedId,
            // overtimePolicyName: e.overtimePolicyName,
            // workRuleType: formik.values.workPolicyName,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.overtimePolicyName,
            workRules: {
              overTime: {
                Type: e.overtimeType,
                overtimeType: e.overtimeTypes,

                values:
                  customRate === 1
                    ? [
                        {
                          minutes: e.fixedRateTime, //hours
                          amount: e.fixedRateAmount,
                        },
                      ]
                    : customRate === 2
                    ? customRateExtraHoursList?.map((each) => ({
                        minutes: e[each.field[0].inputType], //hours
                        type: e[each.field[1].inputType],
                        salaryMultiplyer:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[2].inputType]
                            : null,
                        salaryComponent:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[3].inputType]
                            : null,

                        amount:
                          e[each.field[1].inputType] === "fixedAmount"
                            ? e[each.field[2].inputType]
                            : null,
                      }))
                    : [
                        {
                          halfDay: e.halfDay,
                          fullDay: e.fullDay,
                        },
                      ],
                maximumOverTimePerMonth: e.maximumOverTimePerMonth || null,
              },
            },
            isTrackOverTime: e.isTrackOverTime,
            isRequestOverTime: e.isRequestOverTime,
            // overtimeType: e.overtimeType,
            offType: e.offType,
          });

          if (result.status === 200) {
            setInsertedId(result.result.insertedId);
            openNotification("success", "Successful", result.message);

            setLoading(false);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });

  // Less working Hours policy

  const lessWorkingDynamicFields = attendanceHolidayOvertimeList.reduce(
    (ac, each) => {
      each.field.reduce((acc, value) => {
        acc[each.inputType] = "";

        return acc;
      });
    },
    {}
  );
  const additionalValidations1 = Object.fromEntries(
    safeFlatMap(attendanceHolidayOvertimeList) || {}
  );

  const Formik4 = useFormik({
    initialValues: {
      lessWorkingHourseName: "",
      lessWorkingOccurrence: "",
      lessWorkingOccurrenceType: "",
      lessWorkingOccurrenceTypeValue: "",
      warningEmail: 0,

      ...lessWorkingDynamicFields,
      attendanceAndHolidayName: "",
      attendanceAndHolidayType: "salaryMultiplier",
      salaryMultiplier: null,
      salaryComponent: null,
      comboOffYes: "",
      comboOffNo: "",
      overTime: "",
      doNotConsider: null,

      halfDay: "",
      fullDay: "",

      minimumWorkinghours: "",
      maximumWorkinghours: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      attendanceAndHolidayName: yup
        .string()
        .required("Work Policy Name is required"),
      // ...Object.fromEntries(
      //   safeFlatMap(
      //     lessWorkinghoursList
      //     .flatMap((each) =>
      //       each.field.map((field) => [
      //         field.inputType,
      //         yup.string().required(`${field.title} is required`),
      //       ])
      //     )
      //   )
      // ),
      ...(attendanceHolidays && additionalValidations1),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId || insertedId) {
          const result = await action(API.UPDATE_WORK_POLICY, {
            workPolicyId: updateId || insertedId,
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.attendanceAndHolidayName,
            warningEmail: e.warningEmail,

            workRules: {
              attendanceOnHoliday: {
                Type: e.attendanceAndHolidayType,
                minimumWorkinghours: e.minimumWorkinghours,
                maximumWorkinghours: e.maximumWorkinghours,
                values:
                  e.attendanceAndHolidayType === "salaryMultiplier"
                    ? {
                        salaryMultiplier: e.salaryMultiplier,
                        salaryComponent: e.salaryComponent,
                      }
                    : e.attendanceAndHolidayType === "comboOff"
                    ? {
                        halfDay: e.halfDay,
                        fullDay: e.fullDay,
                      }
                    : e.attendanceAndHolidayType === "overtime"
                    ? attendanceHolidayOvertimeList?.map((each) => ({
                        minutes: e[each.field[0].inputType], //hours
                        type: e[each.field[1].inputType],
                        salaryMultiplyer:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[2].inputType]
                            : null,
                        salaryComponent:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[3].inputType]
                            : null,
                        amount:
                          e[each.field[1].inputType] === "fixedAmount"
                            ? e[each.field[2].inputType]
                            : null,
                      }))
                    : { doNotConsider: e.doNotConsider },
              },
            },
          });
          if (result.status === 200) {
            // setInsertedId(result.result.insertedId);
            setNextStep(nextStep + 1);
            openNotification("success", "Successful", result.message);

            setLoading(false);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.ADD_EMPLOYEE_WORK_POLICY_DETAILS, {
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.attendanceAndHolidayName,
            warningEmail: e.warningEmail,
            workRules: {
              attendanceOnHoliday: {
                Type: e.attendanceAndHolidayType,
                minimumWorkinghours: e.minimumWorkinghours,
                maximumWorkinghours: e.maximumWorkinghours,
                values:
                  e.attendanceAndHolidayType === "salaryMultiplier"
                    ? {
                        salaryMultiplier: e.salaryMultiplier,
                        salaryComponent: e.salaryComponent,
                      }
                    : e.attendanceAndHolidayType === "comboOff"
                    ? {
                        halfDay: e.halfDay,
                        fullDay: e.fullDay,
                      }
                    : e.attendanceAndHolidayType === "overtime"
                    ? attendanceHolidayOvertimeList?.map((each) => ({
                        minutes: e[each.field[0].inputType], //hours
                        type: e[each.field[1].inputType],
                        salaryMultiplyer:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[2].inputType]
                            : null,
                        salaryComponent:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[3].inputType]
                            : null,
                        amount:
                          e[each.field[1].inputType] === "fixedAmount"
                            ? e[each.field[2].inputType]
                            : null,
                      }))
                    : { doNotConsider: e.doNotConsider },
              },
            },
          });

          if (result.status === 200) {
            setInsertedId(result.result.insertedId);
            openNotification("success", "Successful", result.message);

            setLoading(false);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });

  console.log(
    Formik4.values.attendanceAndHolidayType,
    "Formik4.values.attendanceAndHolidayType"
  );

  // Miss punch policy

  const missPunchDynamicFields = missPunchPolicyList.reduce((ac, each) => {
    each.field?.reduce((acc, value) => {
      acc[each.inputType] = "";
      return acc;
    });
  }, {});

  const Formik5 = useFormik({
    initialValues: {
      missPunchName: "",
      missPunchOccurrence: "",
      missPunchOccurrenceValue: "",
      missPunchOccurrenceValueType: "",
      warningEmail: "",

      ...missPunchDynamicFields,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      missPunchName: yup.string().required("Work Policy Name is required"),

      ...Object.fromEntries(safeFlatMap(missPunchPolicyList)),
    }),

    onSubmit: async (e) => {
      setLoading(true);

      try {
        if (updateId || insertedId) {
          const result = await action(API.UPDATE_WORK_POLICY, {
            workPolicyId: updateId || insertedId,
            companyId: companyId || null,
            workPolicyTypeId: formik.values.workPolicyType || null,
            workPolicyType: formik.values.workPolicyName || null,
            workPolicyName: e.missPunchName || null,
            warningEmail: e.warningEmail || null,
            workRules: {
              missPunch: {
                occurrence: {
                  type: e.missPunchOccurrenceValue,
                  value: e.missPunchOccurrenceValueType,
                },
                rule: missPunchPolicyList?.map((each) => ({
                  minutes: e[each.field[0].inputType],
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
            },
          });
          if (result.status === 200) {
            setInsertedId(result.result.insertedId);
            openNotification("success", "Successful", result.message);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Info", result.message);
          }
        } else {
          const result = await action(API.ADD_EMPLOYEE_WORK_POLICY_DETAILS, {
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.missPunchName,
            warningEmail: e.warningEmail,
            workRules: {
              missPunch: {
                occurrence: {
                  type: e.missPunchOccurrenceValue,
                  value: e.missPunchOccurrenceValueType,
                },
                rule: missPunchPolicyList?.map((each) => ({
                  minutes: e[each.field[0].inputType],
                  deductionType: e[each.field[1].inputType],
                  deductionComponent:
                    e[each.field[1].inputType] === "halfDay" ||
                    e[each.field[1].inputType] === "fullDay" ||
                    e[each.field[1].inputType] === "perMinutes"
                      ? e[each.field[2].inputType]
                      : null,
                  // : e[each.field[1].inputType] === "fixedAmount" &&
                  //   e[each.field[3].inputType],
                  // occurrence: e[each.field[4].inputType],
                  days:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? null
                      : e[each.field[3].inputType],
                  amount:
                    e[each.field[1].inputType] === "fixedAmount"
                      ? e[each.field[2].inputType]
                      : null,
                })),
              },
            },
          });

          if (result.status === 200) {
            setInsertedId(result.result.insertedId);
            openNotification("success", "Successful", result.message);
            setNextStep(nextStep + 1);
            setLoading(false);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });

  //----------------------------- Id base Get Data Start---------------------------

  const getIdBasedEmployeeDetails = async () => {
    const result = await action(API.GET_ID_BASED_EMPLOYEE_WORK_POLICY, {
      id: updateId,
    });
    setPresentage(1);
    //----------------------------------------------------------------------------

    formik.setFieldValue("workPolicyName", result.result?.workPolicyType);
    formik.setFieldValue(
      "workPolicyType",
      parseInt(result.result?.workPolicyTypeId)
    );

    if (presentage < 1) {
      setPresentage(0.9);
    }

    // if (formik.values.workPolicyType)
    setNextStep(nextStep + 1);
    setInsertedId(result.result?.workPolicyId);
    if (parseInt(result.result?.workPolicyTypeId) === 1) {
      Formik2.setFieldValue("policyName", result.result.workPolicyName);
      Formik2.setFieldValue("warningEmail", result.result.warningEmail);

      result.result.workPolicyDetails?.some((data, index) => {
        if (data.workRules.lateEntryRule?.occurrence.type) {
          Formik2.setFieldValue("lateEntryOccurrence", 1);
          Formik2.setFieldValue(
            "lateEntryOccurrenceType",
            data.workRules.lateEntryRule?.occurrence.type
          );
          Formik2.setFieldValue(
            "lateEntryOccurrenceTypeValue",
            data.workRules.lateEntryRule?.occurrence.value
          );
        } else if (data.workRules.breakRule?.occurrence.type) {
          Formik2.setFieldValue("breakRuleOccurrence", 1);
          Formik2.setFieldValue(
            "breakRuleOccurrenceType",
            data.workRules.breakRule?.occurrence.type
          );
          Formik2.setFieldValue(
            "breakRuleOccurrenceTypeValue",
            data.workRules.breakRule?.occurrence.value
          );
        } else if (data.workRules.exitRule?.occurrence.type) {
          Formik2.setFieldValue("exitRuleOccurrence", 1);
          Formik2.setFieldValue(
            "exitRuleOccurrenceType",
            data.workRules.exitRule?.occurrence.type
          );
          Formik2.setFieldValue(
            "exitRuleOccurrenceTypeValue",
            data.workRules.exitRule?.occurrence.value
          );
        }
      });

      // lateEntryRule

      result.result.workPolicyDetails?.map((data, index) =>
        data.workRules?.lateEntryRule?.rule?.map((each, i) => {
          Object.keys(each).map((item) =>
            Formik2.setFieldValue(item + "lateEntryRule" + i, each[item])
          );
        })
      );

      setLateEntryList(
        result.result.workPolicyDetails?.map((data, index) =>
          data.workRules?.lateEntryRule?.rule?.map((each, i) => ({
            id: i,
            rowType: "Two" + i,
            field: [
              {
                title: "If Employee Late More Than",
                type: "time",
                inputType: Object.keys(each)[0] + "lateEntryRule" + i,
                description: "No late fine for _ mins",
                line: true,
              },
              {
                title: "Deduction Type",
                type: "dropdown",
                inputType: Object.keys(each)[1] + "lateEntryRule" + i,
                description: "Description",
                line: true,
                option: deductionTypeOption,
              },
              Object.values(each)[1] !== "fixedAmount" && {
                title: "Deduction From " + Object.values(each)[1],
                type:
                  Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
                valuecheck: "DeductionComponent",
                inputType: Object.keys(each)[2] + "lateEntryRule" + i,
                // description: "Lorem ipsum dolor sit amet",
                line: true,
                changeValue: true,

                option: Deduction,
                // display: true,
              },
              {
                title:
                  Object.values(each)[1] === "fixedAmount" ? "Amount" : "Days",
                type:
                  Object.values(each)[1] !== "fixedAmount"
                    ? "dropdown"
                    : "input",
                valuecheck: "DeductionComponent",
                inputType:
                  Object.values(each)[1] === "fixedAmount"
                    ? Object.keys(each)[4] + "lateEntryRule" + i
                    : Object.keys(each)[3] + "lateEntryRule" + i,
                // description:
                //   "Lorem ipsum dolor sit amet",
                divline: true,
                option:
                  Object.values(each)[1] !== "fixedAmount" ? DaysDivider : null,
                display: true,
              },
              // {
              //   title: "Days",
              //   type:
              //     Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
              //   valuecheck: "DeductionComponent",
              //   inputType: Object.keys(each)[3] + "lateEntryRule" + i,
              //   // description:
              //   //   "Lorem ipsum dolor sit amet",
              //   divline: true,
              //   option: DaysDivider,
              //   display: true,
              // },
              // {
              //   title: "Amount",
              //   type: Object.values(each)[1] === "fixedAmount" ? "input" : null,
              //   enter: "text",
              //   valuecheck: "DeductionComponent",
              //   inputType: Object.keys(each)[4] + "lateEntryRule" + i,
              //   description: "Lorem ipsum dolor sit amet",
              //   // line: true,
              //   display: true,
              // },
            ].filter((each) => each),
          }))
        )[0]
      );

      // breakRule

      result.result.workPolicyDetails?.map((data, index) =>
        data.workRules?.breakRule?.rule?.map((each, i) => {
          Object.keys(each).map((item) =>
            Formik2.setFieldValue(item + "breakRule" + i, each[item])
          );
        })
      );

      setBreakRuleList(
        result.result.workPolicyDetails?.map((data, index) =>
          data.workRules?.breakRule?.rule?.map((each, i) => ({
            id: i,
            rowType: "Two" + i,
            field: [
              {
                title: "If Employee Late More Than",
                type: "time",
                inputType: Object.keys(each)[0] + "breakRule" + i,
                description: "No late fine for _ mins",
                line: true,
              },
              {
                title: "Deduction Type",
                type: "dropdown",
                inputType: Object.keys(each)[1] + "breakRule" + i,
                description: "Description",
                line: true,
                option: deductionTypeOption,
              },
              Object.values(each)[1] !== "fixedAmount" && {
                title: "Deduction From " + Object.values(each)[1],
                type:
                  Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
                valuecheck: "DeductionComponent",
                inputType: Object.keys(each)[2] + "breakRule" + i,
                // description: "Lorem ipsum dolor sit amet",
                line: true,
                changeValue: true,

                option: Deduction,
                // display: true,
              },
              {
                title:
                  Object.values(each)[1] === "fixedAmount" ? "Amount" : "Days",
                type:
                  Object.values(each)[1] !== "fixedAmount"
                    ? "dropdown"
                    : "input",
                valuecheck: "DeductionComponent",
                inputType:
                  Object.values(each)[1] === "fixedAmount"
                    ? Object.keys(each)[4] + "breakRule" + i
                    : Object.keys(each)[3] + "breakRule" + i,
                // description:
                //   "Lorem ipsum dolor sit amet",
                divline: true,
                option:
                  Object.values(each)[1] !== "fixedAmount" ? DaysDivider : null,
                display: true,
              },
              // {
              //   title: "Days",
              //   type:
              //     Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
              //   valuecheck: "DeductionComponent",
              //   inputType: Object.keys(each)[3] + "breakRule" + i,
              //   // description:
              //   //   "Lorem ipsum dolor sit amet",
              //   divline: true,
              //   option: DaysDivider,
              //   display: true,
              // },
              // {
              //   title: "Amount",
              //   type: Object.values(each)[1] === "fixedAmount" ? "input" : null,
              //   enter: "text",
              //   valuecheck: "DeductionComponent",
              //   inputType: Object.keys(each)[4] + "breakRule" + i,
              //   description: "Lorem ipsum dolor sit amet",
              //   // line: true,
              //   display: true,
              // },
            ].filter((each) => each),
          }))
        )[1]
      );

      // exitRule

      result.result.workPolicyDetails?.map((data, index) =>
        data.workRules?.exitRule?.rule?.map((each, i) => {
          Object.keys(each).map((item) =>
            Formik2.setFieldValue(item + "exitRule" + i, each[item])
          );
        })
      );

      setExitRuleList(
        result.result.workPolicyDetails?.map((data, index) =>
          data.workRules?.exitRule?.rule?.map((each, i) => ({
            id: i,
            rowType: "Two" + i,
            field: [
              {
                title: "If Employee Leave Early By",
                type: "time",
                inputType: Object.keys(each)[0] + "exitRule" + i,
                description: "No late fine for _ mins",
                line: true,
              },
              {
                title: "Deduction Type",
                type: "dropdown",
                inputType: Object.keys(each)[1] + "exitRule" + i,
                description: "Description",
                line: true,
                option: deductionTypeOption,
              },
              Object.values(each)[1] !== "fixedAmount" && {
                title: "Deduction From",
                type:
                  Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
                valuecheck: "DeductionComponent",
                inputType: Object.keys(each)[2] + "exitRule" + i,
                // description: "Lorem ipsum dolor sit amet",
                line: true,
                changeValue: true,

                option: Deduction,
                // display: true,
              },
              {
                title:
                  Object.values(each)[1] === "fixedAmount" ? "Amount" : "Days",
                type:
                  Object.values(each)[1] !== "fixedAmount"
                    ? "dropdown"
                    : "input",
                valuecheck: "DeductionComponent",
                inputType:
                  Object.values(each)[1] === "fixedAmount"
                    ? Object.keys(each)[4] + "exitRule" + i
                    : Object.keys(each)[3] + "exitRule" + i,
                // description:
                //   "Lorem ipsum dolor sit amet",
                divline: true,
                option:
                  Object.values(each)[1] !== "fixedAmount" ? DaysDivider : null,
                display: true,
              },
              // {
              //   title: "Days",
              //   type:
              //     Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
              //   valuecheck: "DeductionComponent",
              //   inputType: Object.keys(each)[3] + "exitRule" + i,
              //   // description:
              //   //   "Lorem ipsum dolor sit amet",
              //   divline: true,
              //   option: DaysDivider,
              //   display: true,
              // },
              // {
              //   title: "Amount",
              //   type: Object.values(each)[1] === "fixedAmount" ? "input" : null,
              //   enter: "text",
              //   valuecheck: "DeductionComponent",
              //   inputType: Object.keys(each)[4] + "exitRule" + i,
              //   description: "Lorem ipsum dolor sit amet",
              //   // line: true,
              //   display: true,
              // },
            ].filter((each) => each),
          }))
        )[2]
      );
    } else if (parseInt(result.result?.workPolicyTypeId) === 2) {
      Formik3.setFieldValue(
        "overtimePolicyName",
        result.result?.workPolicyName
      );

      Formik3.setFieldValue(
        "maximumOverTimePerMonth",
        result.result?.workPolicyDetails[0]?.workRules?.overTime
          ?.maximumOverTimePerMonth
      );

      Formik3.setFieldValue(
        "overtimeType",
        result.result?.workPolicyDetails[0].workRules?.overTime.Type
      );
      Formik3.setFieldValue(
        "overtimeTypes",
        result.result?.workPolicyDetails[0].workRules?.overTime.overtimeType
      );
      if (
        result.result?.workPolicyDetails[0].workRules?.overTime.Type ===
        "fixedRate"
      ) {
        Formik3.setFieldValue(
          "fixedRateTime",
          result.result?.workPolicyDetails[0].workRules?.overTime?.values[0]
            .minutes //hours
        );
        Formik3.setFieldValue(
          "fixedRateAmount",
          result.result?.workPolicyDetails[0].workRules?.overTime?.values[0]
            .amount
        );
        setCustomRate(1);
      } else if (
        result.result?.workPolicyDetails[0].workRules?.overTime.Type ===
        "customRate"
      ) {
        result.result.workPolicyDetails?.map((data, index) =>
          data.workRules?.overTime?.values?.map((each, i) => {
            Object.keys(each)?.map((item) =>
              Formik3.setFieldValue(item + i, each[item])
            );
          })
        );

        setCustomRateExtraHoursList(
          result.result.workPolicyDetails?.map((data, index) =>
            data.workRules?.overTime?.values?.map((each, e) => ({
              id: e,
              rowType: "Two" + e,
              field: [
                {
                  title: "If Employee works more than",
                  type: "time",
                  inputType: Object.keys(each)[0] + e,
                  description: "Description",
                  line: true,
                },
                {
                  title: " Type",
                  type: "dropdown",
                  inputType: Object.keys(each)[1] + e,
                  description: "Description",
                  line: true,
                  option: customType,
                },
                Object.values(each)[1] !== "fixedAmount" && {
                  title: "Salary Multiplyer",
                  type:
                    Object.values(each)[1] !== "fixedAmount"
                      ? "dropdown"
                      : null,
                  inputType: Object.keys(each)[2] + e,
                  // changeValue: true,
                  option: Multiplyer,
                  // display: true,
                },
                Object.values(each)[1] !== "fixedAmount" && {
                  title: "Salary Component",
                  type:
                    Object.values(each)[1] !== "fixedAmount"
                      ? "dropdown"
                      : null,
                  valuecheck: "DeductionComponent",
                  inputType: Object.keys(each)[3] + e,
                  // description: "Lorem ipsum dolor sit amet",
                  line: true,
                  changeValue: true,

                  option: Deduction,
                  // display: true,
                },
                // {
                //   title: "Amount Per Minute",
                //   titleChange: true,
                //   type:
                //     Object.values(each)[1] === "fixedAmount" ? "input" : null,
                //   enter: "number",
                //   enterDigits: "6",
                //   inputType: Object.keys(each)[2] + e,
                //   placeholder: "Type here...",
                //   description: "Description",
                // },
                Object.values(each)[1] === "fixedAmount" && {
                  title: "Amount",
                  type:
                    Object.values(each)[1] === "fixedAmount" ? "input" : null,
                  enter: "text",
                  valuecheck: "DeductionComponent",
                  inputType: Object.keys(each)[4] + e,
                  description: "Lorem ipsum dolor sit amet",
                  // line: true,
                  display: true,
                },
              ].filter((each) => each),
            }))
          )[0]
        );
        setCustomRate(2);
      } else if (
        result.result?.workPolicyDetails[0].workRules?.overTime.Type ===
        "complimentaryOff"
      ) {
        Formik3.setFieldValue(
          "halfDay",
          result.result?.workPolicyDetails[0].workRules?.overTime?.values[0]
            .halfDay
        );
        Formik3.setFieldValue(
          "fullDay",
          result.result?.workPolicyDetails[0].workRules?.overTime?.values[0]
            .fullDay
        );

        setCustomRate(3);
      }
    } else if (parseInt(result.result?.workPolicyTypeId) === 3) {
      Formik4.setFieldValue(
        "attendanceAndHolidayName",
        result.result?.workPolicyName
      );
      Formik4.setFieldValue(
        "attendanceAndHolidayType",
        result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
          ?.Type
      );
      Formik4.setFieldValue(
        "minimumWorkinghours",
        result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
          ?.minimumWorkinghours
      );
      Formik4.setFieldValue(
        "maximumWorkinghours",
        result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
          ?.maximumWorkinghours
      );

      // Switch
      switch (
        result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
          ?.Type
      ) {
        case "salaryMultiplier":
          Formik4.setFieldValue(
            "salaryMultiplier",
            result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
              ?.values.salaryMultiplier
          );
          Formik4.setFieldValue(
            "salaryComponent",
            result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
              ?.values.salaryComponent
          );
          break;
        case "comboOff":
          Formik4.setFieldValue(
            "fullDay",
            result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
              ?.values.fullDay
          );

          Formik4.setFieldValue(
            "halfDay",
            result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
              ?.values.halfDay
          );

          break;
        case "overtime":
          result.result.workPolicyDetails?.map((data, index) =>
            data.workRules?.attendanceOnHoliday?.values?.map((each, i) => {
              Object.keys(each)?.map((item) =>
                Formik4.setFieldValue(item + i, each[item])
              );
            })
          );

          setAttendanceHolidayOvertimeList(
            result.result.workPolicyDetails?.map((data, index) =>
              data.workRules?.attendanceOnHoliday?.values?.map((each, e) => ({
                id: e,
                rowType: "Two" + e,
                field: [
                  {
                    title: "If Employee works more than",
                    type: "time",
                    inputType: Object.keys(each)[0] + e,
                    description: "Description",
                    line: true,
                  },
                  {
                    title: " Type",
                    type: "dropdown",
                    inputType: Object.keys(each)[1] + e,
                    description: "Description",
                    line: true,
                    option: customType,
                  },
                  Object.values(each)[1] !== "fixedAmount" && {
                    title: "Salary Multiplyer",
                    type:
                      Object.values(each)[1] !== "fixedAmount"
                        ? "dropdown"
                        : null,
                    inputType: Object.keys(each)[2] + e,
                    // changeValue: true,
                    option: Multiplyer,
                    // display: true,
                  },
                  Object.values(each)[1] !== "fixedAmount" && {
                    title: "Deduction From",
                    type:
                      Object.values(each)[1] !== "fixedAmount"
                        ? "dropdown"
                        : null,
                    valuecheck: "overtimeComponent",
                    inputType: Object.keys(each)[3] + e,
                    // description: "Lorem ipsum dolor sit amet",
                    line: true,
                    changeValue: true,

                    option: Deduction,
                    // display: true,
                  },
                  // {
                  //   title: "Amount Per Minute",
                  //   titleChange: true,
                  //   type:
                  //     Object.values(each)[1] === "fixedAmount" ? "input" : null,
                  //   enter: "number",
                  //   enterDigits: "6",
                  //   inputType: Object.keys(each)[2] + e,
                  //   placeholder: "Type here...",
                  //   description: "Description",
                  // },
                  Object.values(each)[1] === "fixedAmount" && {
                    title: "Amount",
                    type:
                      Object.values(each)[1] === "fixedAmount" ? "input" : null,
                    enter: "text",
                    valuecheck: "OvertimeAmmount",
                    inputType: Object.keys(each)[4] + e,
                    description: "Lorem ipsum dolor sit amet",
                    // line: true,
                    display: true,
                  },
                ].filter((each) => each),
              }))
            )[0]
          );
          break;
        case "doNotConsider":
          Formik4.setFieldValue(
            "doNotConsider",
            result.result?.workPolicyDetails[0]?.workRules?.attendanceOnHoliday
              ?.values.doNotConsider
          );
          break;

        default:
          break;
      }
    } else if (parseInt(result.result?.workPolicyTypeId) === 4) {
      Formik5.setFieldValue("missPunchName", result.result.workPolicyName);
      Formik5.setFieldValue("warningEmail", result.result.warningEmail);

      result.result.workPolicyDetails?.map((data, index) =>
        data.workRules?.missPunch?.rule?.map((each, i) => {
          Object.keys(each)?.map((item) =>
            Formik5.setFieldValue(item + i, each[item])
          );
        })
      );
      setMissPunchPolicyList(
        result.result.workPolicyDetails?.map((data, index) =>
          data.workRules?.missPunch?.rule?.map((each, e) => ({
            id: e,
            rowType: "Two" + e,
            field: [
              {
                title: "If miss punch occurs more than",
                type: "input",
                // valuecheck: "DeductionComponent",
                // option: occurrence,
                inputType: Object.keys(each)[0] + e,
                description: "Lorem ipsum dolor sit amet,it",
                line: true,
              },
              {
                title: "Deduction Type",
                type: "dropdown",
                inputType: Object.keys(each)[1] + e,
                description: "Description",
                option: missPunchDeductionTypeOption,
                icon: true,
              },
              Object.values(each)[1] !== "fixedAmount" && {
                title: "Deduction From",
                type:
                  Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
                valuecheck: "DeductionComponent",
                inputType: Object.keys(each)[2] + e,
                // description: "Lorem ipsum dolor sit amet",
                // line: true,
                changeValue: true,
                option: Deduction,
                // display: true,
              },
              Object.values(each)[1] !== "fixedAmount" && {
                title: "Days",
                type:
                  Object.values(each)[1] !== "fixedAmount" ? "dropdown" : null,
                valuecheck: "DeductionComponent",
                inputType: Object.keys(each)[3] + e,
                // description:
                //   "Lorem ipsum dolor sit amet",
                divline: true,
                option: DaysDivider,
                display: true,
              },
              Object.values(each)[1] === "fixedAmount" && {
                title: "Amount",
                type: Object.values(each)[1] === "fixedAmount" ? "input" : null,
                enter: "text",
                valuecheck: "DeductionComponent",
                inputType: Object.keys(each)[4] + e,
                description: "Lorem ipsum dolor sit amet",
                // line: true,
                display: true,
              },
            ].filter((each) => each),
          }))
        )[0]
      );
    }
    setEmployeeList(result.result?.workPolicyApplicability?.employeeId);
  };

  useEffect(() => {
    if (updateId) getIdBasedEmployeeDetails();
  }, [updateId]);

  //----------------------------- Id base Get Data End---------------------------

  useEffect(() => {
    if (activeBtn < 2 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(policiesMenu?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const assignPolicy = async () => {
    try {
      setPresentage(2);
      const result = await action(API.ADD_ASSIGN_POLICY, {
        workPolicyId: insertedId,
        employeeId: employeeCheckList
          .map((each) => each.assign && each.id)
          .filter((data) => data),
        departmentId: departmentCheckList
          .map((each) => each.assign && each.id)
          .filter((data) => data),
        locationId: locationCheckList
          .map((each) => each.assign && each.id)
          .filter((data) => data),
      });
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          handleClose();
          refresh();
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error.code);
    }
  };

  const UpdateAssignPolicy = async () => {
    const result = await action(API.UPDATE_WORK_POLICY_APPLICABILITY, {
      workPolicyId: updateId,
      employeeId: employeeCheckList
        .map((each) => each.assign && each.id)
        .filter((data) => parseInt(data)),
      departmentId: departmentCheckList
        .map((each) => each.assign && each.id)
        .filter((data) => parseInt(data)),
      locationId: locationCheckList
        .map((each) => each.assign && each.id)
        .filter((data) => parseInt(data)),
    });
    if (result.status === 200) {
      openNotification("success", "Successful", result.message);
      setTimeout(() => {
        handleClose();
        refresh();
      }, 1000);
    } else {
      openNotification("error", "Info", result.message);
    }
  };
  return (
    <DrawerPop
      // style={
      //   my-drawer-content:  {
      //     background: "#000",

      //   }
      // }
      background="#F8FAFC"
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
        handleClose();
      }}
      header={[
        !isUpdate ? t("Policies") : t("Update_Policies"),
        !isUpdate ? t("Add_New_Policies") : t("Update_Selected_Policy"),
      ]}
      headerRight={
        <div className="flex gap-10 items-center">
          <p className="2xl:text-sm text-xs font-medium text-gray-400">
            Draft Saved 10 Seconds ago
          </p>
          <div className="flex items-center gap-2.5">
            <p className="2xl:text-sm text-xs font-medium text-gray-400">
              {t("Help")}
            </p>
            <RxQuestionMarkCircled className=" text-2xl font-medium text-gray-400" />
          </div>
        </div>
      }
      footerBtn={[
        t("Cancel"),
        !isUpdate ? t("Save&Continue") : t("Update_Policy"),
      ]}
      footerBtnDisabled={loading}
      className="widthFull"
      stepsData={policiesMenu}
      buttonClick={(e) => {
        switch (activeBtnValue) {
          case "policies":
            break;
          case "createPolicy":
            switch (formik.values.workPolicyType) {
              case 1:
                if (updateId || insertedId) {
                  Formik2.handleSubmit();
                } else {
                  Formik2.handleSubmit();
                }
                break;
              case 2:
                if (updateId || insertedId) {
                  Formik3.handleSubmit();
                } else {
                  Formik3.handleSubmit();
                }
                break;
              case 3:
                if (updateId || insertedId) {
                  Formik4.handleSubmit();
                } else {
                  Formik4.handleSubmit();
                }
                break;
              case 4:
                if (updateId || insertedId) {
                  Formik5.handleSubmit();
                } else {
                  Formik5.handleSubmit();
                }
                break;

              default:
                break;
            }
            break;
          case "assignPolicy":
            if (updateId) {
              UpdateAssignPolicy();
            } else {
              assignPolicy();
            }
            break;

          default:
            break;
        }
      }}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(policiesMenu?.[activeBtn - 1].data);
        }
      }}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
      initialBtn={nextStep === 0 ? false : true}
    >
      <FlexCol gap={42} className={"max-w-[1072px] mx-auto"}>
        {policiesMenu && (
          <Flex justify="center">
            <div className=" w-full  z-50 px-5 pb-6 ">
              <Stepper
                steps={policiesMenu}
                currentStepNumber={activeBtn}
                presentage={presentage}
              />
            </div>
          </Flex>
        )}

        <Flex justify="center" className="w-full">
          <div className="w-full 2xl:pt-2">
            {activeBtnValue === "policies" ? (
              <Flex className={"justify-center"}>
                <FlexCol gap={42} className={"items-start"}>
                  <Heading2
                    title={t("Company_Automation_Policies")}
                    description={t("Company_Automation_Policies_Description")}
                    titleClassname="company-heading"
                    // font="18px"
                  />

                  <Flex justify="center">
                    <FlexCol className="grid grid-cols-12">
                      {automationPolicies?.map((each, i) => (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          key={i}
                          className={`p-1 rounded-[20px] bg-white dark:bg-dark group hover:border-primaryalpha/20 cursor-pointer transition-all duration-300 w-full hover:shadow-[0px_15px_31px_0px] hover:shadow-primaryalpha/[0.07] xl:col-span-6 sm:col-span-6 col-span-12 group`}
                          onClick={() => {
                            formik.setFieldValue("workPolicyName", each.title);
                            formik.setFieldValue("workPolicyType", each.value);

                            if (presentage < 1) {
                              setPresentage(0.9);
                            }
                            setNextStep(nextStep + 1);
                          }}
                        >
                          <div
                            className={` ${
                              formik.values.workPolicyName === each.title && ""
                            } w-full xl:w-[350px] h-[190px] rounded-2xl border border-black/10 dark:border-white/10  transition-all duration-300 p-5  group-hover:bg-gradient-to-t to-primaryalpha/5 from-white bg-white dark:from-zinc-800 dark:bg-dark dark:shadow-none`}
                          >
                            <div className="flex flex-col gap-[16px]">
                              <Flex justify="space-between" className="w-full">
                                <div
                                  className={`group-hover:border-white p-2.5 border rounded-lg w-fit bg-white `}
                                >
                                  <img
                                    src={each.img}
                                    alt=""
                                    className=" w-6 h-6"
                                  />
                                </div>
                                <PiArrowRight
                                  size={20}
                                  className="opacity-20 transition-all duration-300 group-hover:text-primary group-hover:opacity-100"
                                />
                              </Flex>
                              <div className=" text-start">
                                <h2 className=" 2xl:text-[18px] text-base font-semibold">
                                  {each.title}
                                </h2>
                                <p className=" text-xs font-medium opacity-70 text-gray-600 2xl:leading-[18px]">
                                  {each.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </FlexCol>
                  </Flex>
                </FlexCol>
              </Flex>
            ) : activeBtnValue === "createPolicy" ? (
              formik.values.workPolicyType === 1 ? (
                <FlexCol className={""}>
                  <FlexCol
                    className={"borderb rounded-xs bg-white dark:bg-dark p-4"}
                  >
                    <Heading2
                      title={t("Time_In_Out_Policies")}
                      description={t("Time_In_Out_Policies_Description")}
                    />
                    <Flex
                      className=" grid grid-cols-1 sm:grid-cols-2 items-center md:items-end"
                      gap={8}
                    >
                      <FormInput
                        title={t("Work_Policy_Name")}
                        placeholder={t("Work_Policy_Name")}
                        value={Formik2.values.policyName}
                        change={(e) => {
                          Formik2.setFieldValue("policyName", e);
                          setPresentage(1.1);
                        }}
                        error={Formik2.errors.policyName}
                        required={true}
                      />

                      <div
                        className={
                          "w-full flex gap-2 p-2 dark:bg-dark items-center bg-white justify-end "
                        }
                      >
                        <ToggleBtn
                          // description={each.description}
                          value={Formik2.values.warningEmail}
                          change={(e) => {
                            Formik2.setFieldValue("warningEmail", e);
                          }}
                        />
                        <div className="flex gap-3 2xl:gap-6 items-center">
                          <div>
                            <p className="font-semibold text-xs 2xl:text-sm">
                              Send Notification Email to Employees
                            </p>
                            <p className="text-xs 2xl:text-sm text-grey">
                              Allow staff to receive important notification via
                              message
                            </p>
                          </div>
                        </div>
                      </div>
                    </Flex>
                  </FlexCol>
                  <Accordion
                    title={t("Create_Late_Entry_Rule")}
                    description={t(
                      "Automate_late_fine_for_employees_who_are_coming_late_to_work"
                    )}
                    primarybg={false}
                    padding={false}
                    initialExpanded={true}
                    click={() => {
                      setPresentage(1.4);
                    }}
                    className={" bg-white dark:bg-dark"}
                  >
                    <div className="px-2 md:px-[25px] md:py-5 py-2 flex flex-col gap-6  dark:bg-dark  ">
                      {lateEntryList?.map((policy, i) => (
                        <>
                          <div className="relative xl:flex justify-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  xl:gap-7 gap-3">
                            {policy.field.map((each, index) => (
                              <>
                                {each.type !== null && (
                                  <div
                                    className=" col-span-1 flex  w-full  "
                                    key={index}
                                  >
                                    {each?.type === "time" ? (
                                      <TimeSelect
                                        className="w-full"
                                        title={each.title}
                                        // description={each.description
                                        //   ?.split("_")
                                        //   .join(Formik2.values[each.inputType])}
                                        placeholder={`Choose ${each.title}`}
                                        format="HH:mm"
                                        value={Formik2.values[each.inputType]}
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                          if (e) {
                                            setFormik2(1);
                                          } else {
                                            setFormik2();
                                          }
                                        }}
                                        error={
                                          Formik2.values[each.inputType]
                                            ? ""
                                            : Formik2.errors[each.inputType]
                                        }
                                        required={true}
                                      />
                                    ) : each?.type === "dropdown" ? (
                                      each.Occurrence === true ? (
                                        Formik2.values[each.inputType] ? (
                                          <div className=" flex flex-col items-start">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              value={
                                                Formik2.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                            <Dropdown
                                              className="w-full "
                                              description={each.description
                                                ?.split("_")
                                                .join(
                                                  +" " +
                                                    Formik2.values[
                                                      each.inputType
                                                    ] +
                                                    " "
                                                )}
                                              placeholder={
                                                "Select" + " " + each.title
                                              }
                                              value={
                                                Formik2.values[
                                                  each.inputType
                                                ] || each.value
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                              options={each.option}
                                              icondropDown={
                                                each.icon ? true : false
                                              }
                                              icon={
                                                each.icon && (
                                                  <PiCloudWarningBold className="text-primary font-bold" />
                                                )
                                              }
                                              error={
                                                Formik2.values[
                                                  each.inputType
                                                ] || each.value
                                                  ? ""
                                                  : Formik2.errors[
                                                      each.inputType
                                                    ]
                                              }
                                              required={true}
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex items-center">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              value={
                                                Formik2.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                          </div>
                                        )
                                      ) : (
                                        <Dropdown
                                          className="w-full"
                                          title={each.title}
                                          placeholder={
                                            "Choose" + " " + each.title
                                          }
                                          value={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                          }
                                          error={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                              ? ""
                                              : Formik2.errors[each.inputType]
                                          }
                                          required={true}
                                          change={(e) => {
                                            if (e) {
                                              setFormik2(1);
                                            } else {
                                              setFormik2();
                                            }
                                            if (timeOutPolicyData === null) {
                                              if (!each.changeValue) {
                                                const indexValue =
                                                  lateEntryList.map(
                                                    (each) =>
                                                      each.id === policy.id &&
                                                      each.field.findIndex(
                                                        (entry) =>
                                                          entry.valuecheck ===
                                                          "DeductionComponent"
                                                      )
                                                  );
                                                indexValue.map((data) =>
                                                  data !== -1 && data !== false
                                                    ? lateEntryList.map(
                                                        (each) =>
                                                          each.id ===
                                                            policy.id &&
                                                          each.field.splice(
                                                            parseInt(data),
                                                            2
                                                          )
                                                      )
                                                    : null
                                                );

                                                if (e === "fixedAmount") {
                                                  lateEntryList.map((item) => {
                                                    item.id === policy.id &&
                                                      item.field.splice(2, 0, {
                                                        title: "Amount",
                                                        type: "input",
                                                        enter: "text",
                                                        valuecheck:
                                                          "DeductionComponent",
                                                        inputType:
                                                          "lateEntryAmount" +
                                                          item.id,
                                                        description:
                                                          "Lorem ipsum dolor sit amet",
                                                        display: true,
                                                      });
                                                  });
                                                } else {
                                                  lateEntryList.map((item) => {
                                                    item.id === policy.id &&
                                                      item.field.splice(
                                                        2,
                                                        4,
                                                        {
                                                          title:
                                                            "Deduction From",
                                                          type: "dropdown",
                                                          valuecheck:
                                                            "DeductionComponent",
                                                          inputType:
                                                            "lateEntryDeductionComponent" +
                                                            item.id,
                                                          changeValue: true,
                                                          option: Deduction,
                                                        },
                                                        {
                                                          title: "Days",
                                                          type: "dropdown",
                                                          valuecheck:
                                                            "DeductionComponent",
                                                          inputType:
                                                            "lateEntryDays" +
                                                            item.id,
                                                          divline: true,
                                                          option: DaysDivider,
                                                          display: true,
                                                        }
                                                      );
                                                  });
                                                }
                                              }
                                            }

                                            Formik2.setFieldValue(
                                              each.inputType,
                                              e
                                            );
                                            // }
                                          }}
                                          options={each.option}
                                          icondropDown={
                                            each.icon ? true : false
                                          }
                                          icon={
                                            each.icon && (
                                              <PiCloudWarningBold className="text-primary font-bold" />
                                            )
                                          }
                                        />
                                      )
                                    ) : each.type === "dropdown" &&
                                      (Formik2.values[each.inputType] ===
                                        "halfDay" ||
                                        Formik2.values[each.inputType] ===
                                          "fullDay") ? (
                                      <CheckBoxInput
                                        titleRight={each.title}
                                        value={Formik2.values[each.inputType]}
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                        }}
                                      />
                                    ) : each.type === "input" ? (
                                      <FormInput
                                        className="w-full"
                                        title={each.title}
                                        placeholder={each.title}
                                        pattern="[0-9]*"
                                        inputmode="numeric"
                                        format="mm"
                                        type={each.enter}
                                        maxLength={7}
                                        value={
                                          Formik2.values[each.inputType] ||
                                          each.value
                                        }
                                        change={(e) => {
                                          if (
                                            /^\d+$/g.test(e) &&
                                            /^\d+(?!.*--).*$/g.test(e)
                                          ) {
                                            Formik2.setFieldValue(
                                              each.inputType,
                                              e
                                            );
                                          } else if (e === "") {
                                            Formik2.setFieldValue(
                                              each.inputType,
                                              ""
                                            );
                                          }
                                        }}
                                        error={
                                          Formik2.values[each.inputType] ||
                                          each.value
                                            ? ""
                                            : Formik2.errors[each.inputType]
                                        }
                                        required={true}
                                      />
                                    ) : null}
                                  </div>
                                )}
                              </>
                            ))}

                            {i !== 0 && (
                              <div className="absolute md:-right-[18px] top-[230px] md:top-0 pb-2 z-50 w-4">
                                <Tooltip placement="topLeft" title="Delete">
                                  <PiTrash
                                    className=" hover:bg-primary hover:text-white text-rose-600 p-1 mt-7 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                    onClick={() => {
                                      const indexValue =
                                        lateEntryList.findIndex(
                                          (entry) => entry.id === policy.id
                                        );

                                      if (indexValue !== -1) {
                                        const removedElement =
                                          lateEntryList.splice(indexValue, 1);
                                        setReloadValueFirst([
                                          "lateEntryList",
                                          policy.id,
                                        ]);
                                      }
                                    }}
                                  />
                                </Tooltip>
                                {/* </motion.button> */}
                              </div>
                            )}
                          </div>
                          {i === 0 && (
                            <Flex className="grid grid-cols-4 justify-start items-center gap-2">
                              <div className="flex justify-start">
                                <CheckBoxInput
                                  titleRight={"Set Occurrence"}
                                  value={Formik2.values.lateEntryOccurrence}
                                  change={(e) => {
                                    Formik2.setFieldValue(
                                      "lateEntryOccurrence",
                                      e
                                    );
                                  }}
                                />
                              </div>
                              {Formik2.values.lateEntryOccurrence ? (
                                <Flex gap={8} className="grid grid-cols-2">
                                  <div className=" grid grid-cols-2 gap-2  w-[400px]  ">
                                    <Dropdown
                                      className="w-full col-span-1  "
                                      title={"Type"}
                                      placeholder={"Choose Type"}
                                      value={
                                        Formik2.values.lateEntryOccurrenceType
                                      }
                                      change={(e) => {
                                        Formik2.setFieldValue(
                                          "lateEntryOccurrenceType",
                                          e
                                        );
                                        Formik2.setFieldValue(
                                          "lateEntryOccurrenceTypeValue",
                                          ""
                                        );
                                      }}
                                      options={occurrenceType}
                                    />
                                    {Formik2.values.lateEntryOccurrenceType ===
                                    "count" ? (
                                      <Dropdown
                                        className="w-full col-span-1 "
                                        title={"Count"}
                                        placeholder={"Choose Count"}
                                        value={
                                          Formik2.values
                                            .lateEntryOccurrenceTypeValue
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            "lateEntryOccurrenceTypeValue",
                                            e
                                          );
                                        }}
                                        options={occurrence}
                                      />
                                    ) : (
                                      <TimeSelect
                                        className="w-full col-span-1 "
                                        title={"Time"}
                                        placeholder={"Choose Time"}
                                        format="HH:mm"
                                        value={
                                          Formik2.values
                                            .lateEntryOccurrenceTypeValue
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            "lateEntryOccurrenceTypeValue",
                                            e
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </Flex>
                              ) : null}
                            </Flex>
                          )}
                        </>
                      ))}
                    </div>

                    <div className="relative flex justify-between items-center gap-3  border-t border-black/10 dark:border-white/20 px-[25px] py-[15px]">
                      <div
                        className="flex justify-start items-center gap-[9px] cursor-pointer group"
                        onClick={(e) => {
                          setLateEntryList([
                            ...lateEntryList,
                            {
                              id: e.clientX,
                              rowType: "Two" + e.clientX,
                              field: [
                                {
                                  title: "If Employee Late More Than",
                                  type: "time",
                                  inputType: "lateEntryMinutesTwo" + e.clientX,
                                  description: "No late fine for _ mins",
                                  line: true,
                                },
                                {
                                  title: "Deduction Type",
                                  type: "dropdown",
                                  inputType:
                                    "lateEntryDeductionTypeTwo" + e.clientX,
                                  description: "Description",
                                  line: true,
                                  option: deductionTypeOption,
                                },
                                {
                                  title: "Deduction From",
                                  type: "dropdown",
                                  valuecheck: "DeductionComponent",
                                  inputType:
                                    "lateEntryDeductionComponent" + e.clientX,
                                  line: true,
                                  changeValue: true,

                                  option: Deduction,
                                },
                                {
                                  title: "Days",
                                  type: "dropdown",
                                  valuecheck: "DeductionComponent",
                                  inputType: "lateEntryDays" + e.clientX,
                                  divline: true,
                                  option: DaysDivider,
                                  display: true,
                                },
                              ],
                            },
                          ]);
                        }}
                      >
                        <IoMdAdd className="group-hover:bg-primary  group-hover:text-white  bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                        <p className="text-sm 2xl:text-base  dark:text-white ">
                          {t("Add_Range")}
                        </p>
                      </div>
                      <div className=" border-b "></div>

                      {/* <div className=" flex items-center gap-3">
                        <ButtonClick
                          buttonName={
                            <PiTrash className="text-[15px] 2xl:text-[17px] text-red-600" />
                          }
                            className={"px-2 bg-[#f4f4f4]"}
                          tooltip={"Delete"}
                          handleSubmit={() => {
                            const removedElement = lateEntryList.splice(1);
                            setReloadValueFirst(["lateEntryList", 1]);
                          }}
                        />
                        <ButtonClick
                          buttonName={"Save"}
                          tooltip={"Save"}
                          className={"bg-[#f4f4f4]"}
                          handleSubmit={() => {
                            localStorage.setItem(
                              "lateEntryList",
                              JSON.stringify(lateEntryList)
                            );
                          }}
                        />
                      </div> */}
                    </div>
                  </Accordion>

                  <Accordion
                    title={t("Create_Break_Rule")}
                    description={t(
                      "Automate fines for employees who take excess breaks."
                    )}
                    padding={false}
                    primarybg={false}
                    initialExpanded={true}
                    click={() => {
                      setPresentage(1.7);
                    }}
                    className={" bg-white dark:bg-dark"}
                  >
                    <div className=" md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6 dark:bg-dark  ">
                      {breakRuleList?.map((policy, i) => (
                        <>
                          <div className="relative xl:flex justify-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:gap-7 gap-3">
                            {policy.field.map((each, index) => (
                              <>
                                {each.type !== null && (
                                  <div
                                    className="col-span-1 flex w-full "
                                    key={index}
                                  >
                                    {each.type === "time" ? (
                                      <TimeSelect
                                        className="w-full"
                                        title={each.title}
                                        placeholder={
                                          "Choose" + " " + each.title
                                        }
                                        format="HH:mm"
                                        value={
                                          Formik2.values[each.inputType] ||
                                          each.value
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                          if (e) {
                                            setBreakRuleFormik2(1);
                                          } else {
                                            setBreakRuleFormik2();
                                          }
                                        }}
                                        required={true}
                                        error={
                                          Formik2.values[each.inputType] ||
                                          each.value
                                            ? ""
                                            : Formik2.errors[each.inputType]
                                        }
                                      />
                                    ) : each.type === "dropdown" ? (
                                      each.Occurrence === true ? (
                                        Formik2.values[each.inputType] ? (
                                          <div className=" flex flex-col items-start">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              value={
                                                Formik2.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                            <Dropdown
                                              className="w-full "
                                              placeholder={
                                                "Choose" + " " + each.title
                                              }
                                              value={
                                                Formik2.values[
                                                  each.inputType
                                                ] || each.value
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                                if (e) {
                                                  setBreakRuleFormik2(1);
                                                } else {
                                                  setBreakRuleFormik2();
                                                }
                                              }}
                                              options={each.option}
                                              icondropDown={
                                                each.icon ? true : false
                                              }
                                              icon={
                                                each.icon && (
                                                  <PiCloudWarningBold className="text-primary font-bold" />
                                                )
                                              }
                                              required={true}
                                              error={
                                                Formik2.values[
                                                  each.inputType
                                                ] || each.value
                                                  ? ""
                                                  : Formik2.errors[
                                                      each.inputType
                                                    ]
                                              }
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex items-center">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              value={
                                                Formik2.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                          </div>
                                        )
                                      ) : (
                                        <Dropdown
                                          className="w-full"
                                          title={each.title}
                                          placeholder={
                                            "Choose" + " " + each.title
                                          }
                                          value={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                          }
                                          required={true}
                                          error={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                              ? ""
                                              : Formik2.errors[each.inputType]
                                          }
                                          change={(e) => {
                                            if (e) {
                                              setBreakRuleFormik2(1);
                                            } else {
                                              setBreakRuleFormik2();
                                            }
                                            if (timeOutPolicyData === null) {
                                              if (!each.changeValue) {
                                                const indexValue =
                                                  breakRuleList.map(
                                                    (each) =>
                                                      each.id === policy.id &&
                                                      each.field.findIndex(
                                                        (entry) =>
                                                          entry.valuecheck ===
                                                          "DeductionComponent"
                                                      )
                                                  );
                                                indexValue.map((data) =>
                                                  data != -1 && data !== false
                                                    ? breakRuleList.map(
                                                        (each) =>
                                                          each.id ===
                                                            policy.id &&
                                                          each.field.splice(
                                                            parseInt(data),
                                                            2
                                                          )
                                                      )
                                                    : null
                                                );
                                                if (e === "fixedAmount") {
                                                  breakRuleList.map((item) => {
                                                    item.id === policy.id &&
                                                      item.field.splice(2, 0, {
                                                        title: "Amount",
                                                        enter: "text",
                                                        type: "input",
                                                        valuecheck:
                                                          "DeductionComponent",
                                                        inputType:
                                                          "breakRuleAmount" +
                                                          item.id,
                                                        description:
                                                          "Lorem ipsum dolor sit amet",
                                                        // line: true,
                                                        display: true,
                                                      });
                                                  });
                                                } else {
                                                  breakRuleList.map((item) => {
                                                    item.id === policy.id &&
                                                      item.field.splice(
                                                        2,
                                                        4,
                                                        {
                                                          title:
                                                            "Deduction From",
                                                          type: "dropdown",
                                                          valuecheck:
                                                            "DeductionComponent",
                                                          inputType:
                                                            "breakRuleDeductionComponent" +
                                                            item.id,
                                                          description:
                                                            "Lorem ipsum dolor sit amet",
                                                          line: true,
                                                          changeValue: true,

                                                          option: Deduction,
                                                          // display: true,
                                                        },
                                                        {
                                                          title: "Days",
                                                          type: "dropdown",
                                                          valuecheck:
                                                            "DeductionComponent",
                                                          inputType:
                                                            "breakRuleDays" +
                                                            item.id,
                                                          // description:
                                                          //   "Lorem ipsum dolor sit amet",
                                                          divline: true,
                                                          option: DaysDivider,
                                                          display: true,
                                                        }
                                                      );
                                                  });
                                                }
                                              }
                                            }
                                            Formik2.setFieldValue(
                                              each.inputType,
                                              e
                                            );
                                          }}
                                          options={each.option}
                                          icondropDown={
                                            each.icon ? true : false
                                          }
                                          icon={
                                            each.icon && (
                                              <PiCloudWarningBold className="text-primary font-bold" />
                                            )
                                          }
                                        />
                                      )
                                    ) : each.type === "checkBox" ? (
                                      <CheckBoxInput
                                        titleRight={each.title}
                                        value={Formik2.values[each.inputType]}
                                        change={(e) => {}}
                                      />
                                    ) : (
                                      each.type === "input" && (
                                        <FormInput
                                          className="w-full"
                                          title={each.title}
                                          required={true}
                                          error={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                              ? ""
                                              : Formik2.errors[each.inputType]
                                          }
                                          // description={each.description}
                                          placeholder={each.title}
                                          pattern="[0-9]*"
                                          inputmode="numeric"
                                          format="mm"
                                          type={each.enter}
                                          maxLength={7}
                                          value={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                          }
                                          change={(e) => {
                                            if (
                                              /^\d+$/g.test(e) &&
                                              /^\d+(?!.*--).*$/g.test(e)
                                            ) {
                                              Formik2.setFieldValue(
                                                each.inputType,
                                                e
                                              );
                                            } else if (e === "") {
                                              Formik2.setFieldValue(
                                                each.inputType,
                                                ""
                                              );
                                            }
                                          }}
                                        />
                                      )
                                    )}
                                  </div>
                                )}
                              </>
                            ))}
                            {i !== 0 && (
                              <div className="absolute md:-right-[66px] top-[260px] md:top-7 pb-2 z-50 w-16">
                                <Tooltip placement="topLeft" title="Delete">
                                  <PiTrash
                                    className="hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                    onClick={() => {
                                      const indexValue =
                                        breakRuleList.findIndex(
                                          (entry) => entry.id === policy.id
                                        );

                                      if (indexValue !== -1) {
                                        const removedElement =
                                          breakRuleList.splice(indexValue, 1);
                                        setReloadValueFirst([
                                          "breakRuleList",
                                          policy.id,
                                        ]);
                                      }
                                    }}
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                          {i === 0 && (
                            <Flex className="grid grid-cols-4 justify-start items-center gap-2">
                              <div className="flex justify-start">
                                <CheckBoxInput
                                  titleRight={"Set Occurrence"}
                                  value={Formik2.values.breakRuleOccurrence}
                                  change={(e) => {
                                    Formik2.setFieldValue(
                                      "breakRuleOccurrence",
                                      e
                                    );
                                  }}
                                />
                              </div>
                              {Formik2.values.breakRuleOccurrence ? (
                                <Flex gap={8} className="grid grid-cols-2">
                                  <div className=" grid grid-cols-2 gap-2  w-[400px]  ">
                                    <Dropdown
                                      className="w-full col-span-1  "
                                      title={"Type"}
                                      placeholder={"Choose Type"}
                                      value={
                                        Formik2.values.breakRuleOccurrenceType
                                      }
                                      change={(e) => {
                                        Formik2.setFieldValue(
                                          "breakRuleOccurrenceType",
                                          e
                                        );
                                        Formik2.setFieldValue(
                                          "breakRuleOccurrenceTypeValue",
                                          ""
                                        );
                                      }}
                                      options={occurrenceType}
                                    />
                                    {Formik2.values.breakRuleOccurrenceType ===
                                    "count" ? (
                                      <Dropdown
                                        className="w-full col-span-1 "
                                        title={"Count"}
                                        placeholder={"Choose Count"}
                                        value={
                                          Formik2.values
                                            .breakRuleOccurrenceTypeValue
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            "breakRuleOccurrenceTypeValue",
                                            e
                                          );
                                        }}
                                        options={occurrence}
                                      />
                                    ) : (
                                      <TimeSelect
                                        className="w-full col-span-1 "
                                        title={"Time"}
                                        placeholder={"Choose Time"}
                                        format="HH:mm"
                                        value={
                                          Formik2.values
                                            .breakRuleOccurrenceTypeValue
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            "breakRuleOccurrenceTypeValue",
                                            e
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </Flex>
                              ) : null}
                            </Flex>
                          )}
                        </>
                      ))}
                    </div>
                    <div className="relative flex justify-between items-center gap-2  border-t border-black/10 dark:border-white/20 px-[25px] py-[15px]">
                      <div
                        className="flex justify-start items-center gap-[9px] group cursor-pointer"
                        onClick={(e) => {
                          setBreakRuleList([
                            ...breakRuleList,
                            {
                              id: e.clientX,
                              rowType: "Two" + e.clientX,
                              field: [
                                {
                                  title: "If Employee Late More Than",
                                  type: "time",
                                  inputType: "breakRuleMinutesTwo" + e.clientX,
                                  description: "No late fine for _ mins",
                                  line: true,
                                },
                                {
                                  title: "Deduction Type",
                                  type: "dropdown",
                                  inputType:
                                    "breakRuleDeductionTypeTwo" + e.clientX,
                                  description: "Description",
                                  line: true,
                                  option: deductionTypeOption,
                                },
                                {
                                  title: "Deduction From",
                                  type: "dropdown",
                                  valuecheck: "DeductionComponent",
                                  inputType:
                                    "breakRulDeductionComponent" + e.clientX,
                                  description: "Lorem ipsum dolor sit amet",
                                  line: true,
                                  changeValue: true,

                                  option: Deduction,
                                },
                                {
                                  title: "Days",
                                  type: "dropdown",
                                  valuecheck: "DeductionComponent",
                                  inputType: "breakRuleDays" + e.clientX,
                                  divline: true,
                                  option: DaysDivider,
                                  display: true,
                                },
                              ],
                            },
                          ]);
                        }}
                      >
                        <IoMdAdd className=" group-hover:bg-primary group-hover:text-white bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                        <p className="text-sm 2xl:text-base  dark:text-white">
                          {t("Add_Range")}
                        </p>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion
                    title={t("Create_Early_Exit_Rule")}
                    primarybg={false}
                    description={t(
                      "Automate fines for employees who leave early"
                    )}
                    padding={false}
                    initialExpanded={true}
                    click={() => {
                      setPresentage(2);
                    }}
                    className={" bg-white dark:bg-dark"}
                  >
                    <div className=" md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6  dark:bg-dark ">
                      {exitRuleList?.map((policy, i) => (
                        <>
                          <div
                            className="relative xl:flex justify-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  xl:gap-7 gap-3"
                            key={i}
                          >
                            {policy.field.map((each, index) => (
                              <>
                                {each.type !== null && (
                                  <div
                                    className="col-span-1 flex w-full "
                                    key={index}
                                  >
                                    {each.type === "time" ? (
                                      <TimeSelect
                                        className="w-full"
                                        title={each.title}
                                        placeholder={
                                          "Choose" + " " + each.title
                                        }
                                        format="HH:mm"
                                        value={
                                          Formik2.values[each.inputType] ||
                                          each.value
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                          if (e) {
                                            setExitRuleFormik2(1);
                                          } else {
                                            setExitRuleFormik2();
                                          }
                                        }}
                                        required={true}
                                        error={
                                          Formik2.values[each.inputType] ||
                                          each.value
                                            ? ""
                                            : Formik2.errors[each.inputType]
                                        }
                                      />
                                    ) : each.type === "dropdown" ? (
                                      each.Occurrence === true ? (
                                        Formik2.values[each.inputType] ? (
                                          <div className=" flex flex-col items-start">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              // description={each.description}
                                              value={
                                                Formik2.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                            <Dropdown
                                              className="w-full "
                                              // title={each.title}
                                              description={each.description
                                                ?.split("_")
                                                .join(
                                                  +" " +
                                                    Formik2.values[
                                                      each.inputType
                                                    ] +
                                                    " "
                                                )}
                                              placeholder={
                                                "Choose" + " " + each.title
                                              }
                                              value={
                                                Formik2.values[
                                                  each.inputType
                                                ] || each.value
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                              options={each.option}
                                              icondropDown={
                                                each.icon ? true : false
                                              }
                                              icon={
                                                each.icon && (
                                                  <PiCloudWarningBold className="text-primary font-bold" />
                                                )
                                              }
                                              error={
                                                Formik2.values[
                                                  each.inputType
                                                ] || each.value
                                                  ? ""
                                                  : Formik2.errors[
                                                      each.inputType
                                                    ]
                                              }
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex items-center">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              // description={each.description}
                                              value={
                                                Formik2.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik2.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                          </div>
                                        )
                                      ) : (
                                        <Dropdown
                                          className="w-full"
                                          required={true}
                                          error={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                              ? ""
                                              : Formik2.errors[each.inputType]
                                          }
                                          title={each.title}
                                          placeholder={
                                            "Choose" + " " + each.title
                                          }
                                          value={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                          }
                                          change={(e) => {
                                            if (e) {
                                              setExitRuleFormik2(1);
                                            } else {
                                              setExitRuleFormik2();
                                            }
                                            if (!each.changeValue) {
                                              const indexValue =
                                                exitRuleList.map(
                                                  (each) =>
                                                    each.id === policy.id &&
                                                    each.field.findIndex(
                                                      (entry) =>
                                                        entry.valuecheck ===
                                                        "DeductionComponent"
                                                    )
                                                );
                                              indexValue.map((data) =>
                                                data != -1 && data !== false
                                                  ? exitRuleList.map(
                                                      (each) =>
                                                        each.id === policy.id &&
                                                        each.field.splice(
                                                          parseInt(data),
                                                          2
                                                        )
                                                    )
                                                  : null
                                              );
                                              if (e === "fixedAmount") {
                                                exitRuleList.map((item) => {
                                                  item.id === policy.id &&
                                                    item.field.splice(2, 0, {
                                                      title: "Amount",
                                                      enter: "text",
                                                      type: "input",
                                                      valuecheck:
                                                        "DeductionComponent",
                                                      inputType:
                                                        "exitRuleAmount" +
                                                        item.id,
                                                      description:
                                                        "Lorem ipsum dolor sit amet",
                                                      // line: true,
                                                      display: true,
                                                    });
                                                });
                                              } else {
                                                exitRuleList.map((item) => {
                                                  item.id === policy.id &&
                                                    item.field.splice(
                                                      2,
                                                      4,
                                                      {
                                                        title: "Deduction From",
                                                        type: "dropdown",
                                                        valuecheck:
                                                          "DeductionComponent",
                                                        inputType:
                                                          "exitRuleDeductionComponent" +
                                                          item.id,
                                                        description:
                                                          "Lorem ipsum dolor sit amet",
                                                        line: true,
                                                        changeValue: true,

                                                        option: Deduction,
                                                        // display: true,
                                                      },
                                                      {
                                                        title: "Days",
                                                        type: "dropdown",
                                                        valuecheck:
                                                          "DeductionComponent",
                                                        inputType:
                                                          "exitRuleDays" +
                                                          item.id,
                                                        // description:
                                                        //   "Lorem ipsum dolor sit amet",
                                                        divline: true,
                                                        option: DaysDivider,
                                                        display: true,
                                                      }
                                                    );
                                                });
                                              }
                                            }
                                            Formik2.setFieldValue(
                                              each.inputType,
                                              e
                                            );
                                          }}
                                          options={each.option}
                                          icondropDown={
                                            each.icon ? true : false
                                          }
                                          icon={
                                            each.icon && (
                                              <PiCloudWarningBold className="text-primary font-bold" />
                                            )
                                          }
                                        />
                                      )
                                    ) : each.type === "checkBox" ? (
                                      <CheckBoxInput
                                        titleRight={each.title}
                                        // description={each.description}
                                        value={Formik2.values[each.inputType]}
                                        change={(e) => {}}
                                      />
                                    ) : (
                                      each.type === "input" && (
                                        <FormInput
                                          className="w-full"
                                          title={each.title}
                                          // description={each.description}
                                          // placeholder={"Select" + " " + each.title}
                                          placeholder={each.title}
                                          value={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                          }
                                          pattern="[0-9]*"
                                          inputmode="numeric"
                                          type={each.enter}
                                          maxLength={7}
                                          change={(e) => {
                                            if (
                                              /^\d+$/g.test(e) &&
                                              /^\d+(?!.*--).*$/g.test(e)
                                            ) {
                                              Formik2.setFieldValue(
                                                each.inputType,
                                                e
                                              );
                                            } else if (e === "") {
                                              Formik2.setFieldValue(
                                                each.inputType,
                                                ""
                                              );
                                            }
                                          }}
                                          required={true}
                                          error={
                                            Formik2.values[each.inputType] ||
                                            each.value
                                              ? ""
                                              : Formik2.errors[each.inputType]
                                          }
                                        />
                                      )
                                    )}
                                  </div>
                                )}
                                {/* {each.line && (
                                <div className=" hidden col-span-1 md:flex justify-center items-center">
                                  <img
                                    src={lineImage}
                                    alt=""
                                    className="h-[69px] w-[1px]"
                                  />
                                </div>
                              )} */}
                              </>
                            ))}

                            {i !== 0 && (
                              <div className="absolute md:-right-[66px] top-[260px] md:top-7 pb-2 z-50 w-16">
                                <Tooltip placement="topLeft" title="Delete">
                                  <PiTrash
                                    className=" hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                    onClick={() => {
                                      const indexValue = exitRuleList.findIndex(
                                        (entry) => entry.id === policy.id
                                      );

                                      if (indexValue !== -1) {
                                        const removedElement =
                                          exitRuleList.splice(indexValue, 1);
                                        setReloadValueFirst([
                                          "exitRuleList",
                                          policy.id,
                                        ]);
                                      }
                                    }}
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                          {i === 0 && (
                            <Flex
                              // gap={8}
                              className="grid grid-cols-4 justify-start items-center gap-2"
                            >
                              <div className="flex justify-start">
                                <CheckBoxInput
                                  titleRight={"Set Occurrence"}
                                  // description={each.description}
                                  value={Formik2.values.exitRuleOccurrence}
                                  change={(e) => {
                                    Formik2.setFieldValue(
                                      "exitRuleOccurrence",
                                      e
                                    );
                                  }}
                                />
                              </div>
                              {Formik2.values.exitRuleOccurrence ? (
                                <Flex gap={8} className="grid grid-cols-2">
                                  <div className=" grid grid-cols-2 gap-2  w-[400px]  ">
                                    <Dropdown
                                      className="w-full col-span-1  "
                                      title={"Type"}
                                      description={""}
                                      placeholder={"Choose Type"}
                                      value={
                                        Formik2.values.exitRuleOccurrenceType
                                      }
                                      change={(e) => {
                                        Formik2.setFieldValue(
                                          "exitRuleOccurrenceType",
                                          e
                                        );
                                        Formik2.setFieldValue(
                                          "exitRuleOccurrenceTypeValue",
                                          ""
                                        );
                                      }}
                                      options={occurrenceType}
                                    />
                                    {Formik2.values.exitRuleOccurrenceType ===
                                    "count" ? (
                                      <Dropdown
                                        className="w-full col-span-1 "
                                        title={"Count"}
                                        description={""}
                                        placeholder={"Choose Count"}
                                        value={
                                          Formik2.values
                                            .exitRuleOccurrenceTypeValue
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            "exitRuleOccurrenceTypeValue",
                                            e
                                          );
                                        }}
                                        options={occurrence}
                                      />
                                    ) : (
                                      <TimeSelect
                                        className="w-full col-span-1 "
                                        title={"Time"}
                                        description={""}
                                        placeholder={"Choose Time"}
                                        format="HH:mm"
                                        value={
                                          Formik2.values
                                            .exitRuleOccurrenceTypeValue
                                        }
                                        change={(e) => {
                                          Formik2.setFieldValue(
                                            "exitRuleOccurrenceTypeValue",
                                            e
                                          );
                                        }}
                                      />
                                    )}
                                  </div>
                                </Flex>
                              ) : null}
                            </Flex>
                          )}
                        </>
                      ))}
                    </div>
                    <div className="relative flex justify-between items-center gap-2 border-t border-black/10 dark:border-white/20 px-[25px] py-[15px]">
                      <div
                        className="flex justify-start items-center gap-[9px] cursor-pointer"
                        onClick={(e) => {
                          setExitRuleList([
                            ...exitRuleList,
                            {
                              id: e.clientX,
                              rowType: "Two" + e.clientX,
                              field: [
                                {
                                  title: "If Employee Early",
                                  type: "time",
                                  inputType: "exitRuleMinutesTwo" + e.clientX,
                                  description: "No late fine for _ mins",
                                  line: true,
                                },
                                {
                                  title: "Deduction Type",
                                  type: "dropdown",
                                  inputType:
                                    "exitRuleDeductionTypeTwo" + e.clientX,
                                  description: "Description",
                                  line: true,
                                  option: deductionTypeOption,
                                },
                                {
                                  title: "Deduction From",
                                  type: "dropdown",
                                  valuecheck: "DeductionComponent",
                                  inputType:
                                    "exitRuleDeductionComponent" + e.clientX,
                                  description: "Lorem ipsum dolor sit amet",
                                  line: true,
                                  changeValue: true,

                                  option: Deduction,
                                  // display: true,
                                },
                                {
                                  title: "Days",
                                  type: "dropdown",
                                  valuecheck: "DeductionComponent",
                                  inputType: "exitRuleDays" + e.clientX,
                                  // description:
                                  //   "Lorem ipsum dolor sit amet",
                                  divline: true,
                                  option: DaysDivider,
                                  display: true,
                                },
                                // {
                                //   title: "Set Occurrence",
                                //   type: "dropdown",
                                //   option: occurrence,
                                //   Occurrence: true,

                                //   inputType:
                                //     "exitRuleOccurrenceTwo" + e.clientX,
                                //   description:
                                //     "Fine will effect after _ occurunce",
                                // },
                              ],
                            },
                          ]);
                        }}
                      >
                        <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                        <p className="text-sm 2xl:text-base dark:text-white">
                          {t("Add_Range")}
                        </p>
                      </div>
                      {/* <div className=" border-b "></div> */}
                    </div>
                  </Accordion>
                </FlexCol>
              ) : formik.values.workPolicyType === 2 ? (
                <FlexCol>
                  <FlexCol
                    className={"borderb rounded-xl bg-white dark:bg-dark p-4"}
                  >
                    <Heading2
                      title={t("Overtime_Policy")}
                      description={t("Overtime_Policy_Description")}
                    />
                    <Flex
                      className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      gap={12}
                    >
                      <FormInput
                        title={t("Work_Policy_Name")}
                        placeholder={t("Work_Policy_Name")}
                        value={Formik3.values.overtimePolicyName}
                        change={(e) => {
                          Formik3.setFieldValue("overtimePolicyName", e);
                        }}
                        required={true}
                        error={
                          Formik3.values.overtimePolicyName
                            ? ""
                            : Formik3.errors.overtimePolicyName
                        }
                      />
                      <FormInput
                        title={t("Maximum_Over_Time_Per_Month") + "(In hours)"}
                        placeholder={t("Maximum_Over_Time_Per_Month")}
                        type={"text"}
                        pattern="[0-9]*\.?[0-9]*"
                        inputmode="numeric"
                        value={Formik3.values.maximumOverTimePerMonth}
                        change={(e) => {
                          const value = e.replace(/[^0-9]/g, "");
                          if (/^\d*\.?\d*$/.test(e)) {
                            Formik3.setFieldValue("maximumOverTimePerMonth", e);
                          } else if (e === "") {
                            Formik3.setFieldValue(
                              "maximumOverTimePerMonth",
                              " e.target.value"
                            );
                          }
                        }}
                        // required={true}
                        error={
                          Formik3.values.maximumOverTimePerMonth
                            ? ""
                            : Formik3.errors.maximumOverTimePerMonth
                        }
                        maxLength={4}
                      />

                      {/* <CheckBoxInput
                        titleRight={"Send Notification Email to Employees"}
                        // description={each.description}
                        value={Formik3.values.warningEmail}
                        change={(e) => {
                          Formik3.setFieldValue("warningEmail", e);
                        }}
                      /> */}
                    </Flex>
                  </FlexCol>

                  <div className="flex flex-col gap-8  borderb rounded-xl bg-white dark:bg-dark p-4 w-full">
                    <RadioButton
                      title="Overtime Types"
                      textclass={"text-sm 2xl:text-base font-medium h2 mb-2"}
                      options={workPolicyOvertimeCheck}
                      value={Formik3.values.overtimeTypes}
                      change={(e) => {
                        Formik3.setFieldValue("overtimeTypes", e);
                      }}
                    />
                    <div className="flex flex-col gap-4">
                      <Heading3
                        title={t(
                          "Create_hourly_rate_calculation_for_regular_over_time"
                        )}
                        description={t(
                          "Involves_parsing_and_analyzing_time_data_to_accurately_determine_compensation"
                        )}
                      />

                      <div className="md:grid grid-cols-12 flex flex-col gap-6 dark:text-white">
                        {regularOvertime?.map((each, i) => (
                          <div
                            key={i}
                            className={`col-span-4 p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                              customRate === each.id && "border-primary "
                            } `}
                            onClick={() => {
                              setCustomRate(each.id);
                              Formik3.setFieldValue("overtimeType", each.value);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className=" flex flex-col gap-2">
                                <div
                                  className={`${
                                    customRate === each.id && " text-primary  "
                                  } p-2 borderb rounded-mdx w-fit bg-[#F8FAFC] dark:bg-secondaryDark`}
                                >
                                  {each.image}
                                </div>

                                <h3 className="text-sm font-medium text-black 2xl:text-base dark:text-white flex items-center gap-2">
                                  {each.title}
                                </h3>
                                <p className=" text-xs font-medium text-[#667085] ">
                                  {each.description}
                                </p>
                              </div>
                              <div
                                className={`${
                                  customRate === each.id && "border-primary"
                                } border  rounded-full`}
                              >
                                <div
                                  className={`font-semibold text-base w-4 h-4 border-2 border-white dark:border-white/10   rounded-full ${
                                    customRate === each.id &&
                                    "text-primary bg-primary"
                                  } `}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {customRate === 1 ? (
                      <div
                        data-aos="zoom-in"
                        className={`flex flex-col gap-10  `}
                      >
                        <FlexCol
                          className={
                            "p-4 borderb bg-[#FAFAFA] dark:bg-secondaryDark rounded-xs "
                          }
                        >
                          <Heading3
                            title={t("Extra_hours_on_week_days")}
                            description={t(
                              "Set_employee_extra_work_hours_on_week_days"
                            )}
                          />
                          <div className="flex items-center gap-4">
                            <div className="">
                              <TimeSelect
                                title={"If Employee works more than"}
                                // description={"Description"}
                                format="HH:mm"
                                value={Formik3.values.fixedRateTime}
                                placeholder="Choose Time"
                                change={(e) => {
                                  Formik3.setFieldValue("fixedRateTime", e);
                                }}
                                error={
                                  Formik3.values.fixedRateTime
                                    ? ""
                                    : Formik3.errors.fixedRateTime
                                }
                                required={true}
                              />
                            </div>
                            <div className="">
                              <img
                                src={lineImage}
                                alt=""
                                className="h-[69px] w-[1px]"
                              />
                            </div>
                            <div className="">
                              <FormInput
                                title={"Amount Per Minute"}
                                placeholder={"Amount Per Minute"}
                                type={"number"}
                                inputmode="numeric"
                                value={Formik3.values.fixedRateAmount}
                                change={(e) => {
                                  const parts = e.split(".");

                                  if (parts.length > 2) {
                                    e =
                                      parts[0] + "." + parts.slice(1).join("");
                                  }
                                  if (parts[1] && parts[1].length > 2) {
                                    e = parts[0] + "." + parts[1].slice(0, 2);
                                  }

                                  e = e.replace(/[^0-9.]/g, "");
                                  Formik3.setFieldValue("fixedRateAmount", e);
                                }}
                                maxLength={7}
                                required={true}
                                error={
                                  Formik3.values.fixedRateAmount
                                    ? ""
                                    : Formik3.errors.fixedRateAmount
                                }
                              />
                            </div>
                          </div>
                        </FlexCol>
                      </div>
                    ) : customRate === 2 ? (
                      <div className="relative borderb rounded-xs bg-[#FAFAFA] dark:bg-secondaryDark">
                        <FlexCol className={"  p-4 "}>
                          <Heading3
                            title={t("Extra_hours_on_week_days")}
                            description={t(
                              "Set_employee_extra_work_hours_on_week_days"
                            )}
                          />
                          <div className=" flex flex-col gap-6">
                            {customRateExtraHoursList?.map((customRate, i) => (
                              <div
                                key={i}
                                className="relative md:grid grid-cols-4  gap-4 flex flex-col"
                              >
                                {customRate.field?.map(
                                  (each, index) =>
                                    each.type !== null && (
                                      <div key={index} className="col-span-1 ">
                                        {each.type === "time" ? (
                                          <TimeSelect
                                            title={each.title}
                                            placeholder={
                                              "Choose" + " " + each.title
                                            }
                                            format="HH:mm"
                                            value={
                                              Formik3.values[each.inputType]
                                            }
                                            change={(e) => {
                                              Formik3.setFieldValue(
                                                each.inputType,
                                                e
                                              );
                                            }}
                                            error={
                                              Formik3.errors[each.inputType]
                                            }
                                            required={true}
                                          />
                                        ) : each.type === "dropdown" ? (
                                          <Dropdown
                                            title={each.title}
                                            placeholder={
                                              "Choose" + " " + each.title
                                            }
                                            value={
                                              Formik3.values[each.inputType]
                                            }
                                            change={(e) => {
                                              if (!each.changeValue) {
                                                if (e === "fixedAmount") {
                                                  customRateExtraHoursList.map(
                                                    (item) => {
                                                      item.id ===
                                                        customRate.id &&
                                                        item.field.splice(
                                                          2,
                                                          3,
                                                          {
                                                            title: "Amount",
                                                            titleChange: true,
                                                            type: "input",
                                                            enter: "number",
                                                            enterDigits: "6",
                                                            inputType:
                                                              "customRateAmmount" +
                                                              item.id,
                                                            placeholder:
                                                              "Type here...",
                                                            description:
                                                              "Description",
                                                          }
                                                        );
                                                    }
                                                  );
                                                } else {
                                                  customRateExtraHoursList.map(
                                                    (item) => {
                                                      item.id ===
                                                        customRate.id &&
                                                        item.field.splice(
                                                          2,
                                                          3,
                                                          {
                                                            title:
                                                              "Salary Multiplyer",
                                                            type: "dropdown",
                                                            inputType:
                                                              "customRateMultiplyer" +
                                                              item.id,
                                                            option: Multiplyer,
                                                          },
                                                          {
                                                            title:
                                                              "Salary Component",
                                                            type: "dropdown",
                                                            inputType:
                                                              "customRateComponent" +
                                                              item.id,
                                                            option: Deduction,
                                                          }
                                                        );
                                                    }
                                                  );
                                                }
                                              }
                                              Formik3.setFieldValue(
                                                each.inputType,
                                                e
                                              );
                                            }}
                                            options={each.option}
                                            icondropDown={
                                              each.icon ? true : false
                                            }
                                            icon={
                                              each.icon && (
                                                <PiCloudWarningBold className="text-primary font-bold" />
                                              )
                                            }
                                            error={
                                              Formik3.errors[each.inputType]
                                            }
                                            required={true}
                                          />
                                        ) : each.type === "input" ? (
                                          <FormInput
                                            title={
                                              Formik3.values[
                                                customRateExtraHoursList?.map(
                                                  (each) =>
                                                    Object.values(each.field)[1]
                                                      .inputType
                                                )[i]
                                              ] === "salaryMultiplyer"
                                                ? "Multiplayer"
                                                : each.title
                                            }
                                            // description={each.description}
                                            placeholder={each.title}
                                            value={
                                              Formik3.values[each.inputType]
                                            }
                                            error={
                                              Formik3.errors[each.inputType]
                                            }
                                            type={each.enter}
                                            pattern="[0-9]*"
                                            inputmode="numeric"
                                            change={(e) => {
                                              if (e) {
                                                const parts = e.split(".");

                                                if (parts.length > 2) {
                                                  e =
                                                    parts[0] +
                                                    "." +
                                                    parts.slice(1).join("");
                                                }
                                                if (
                                                  parts[1] &&
                                                  parts[1].length > 2
                                                ) {
                                                  e =
                                                    parts[0] +
                                                    "." +
                                                    parts[1].slice(0, 2);
                                                }
                                                e = e.replace(/[^0-9.]/g, "");
                                                Formik3.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }
                                            }}
                                            maxLength={7}
                                            required={true}
                                          />
                                        ) : null}
                                      </div>
                                    )
                                )}
                                {i !== 0 && (
                                  <div className="absolute -right-[60px] top-7 pb-2 z-50 w-16">
                                    <Tooltip placement="topLeft" title="Delete">
                                      <PiTrash
                                        className=" hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                        onClick={() => {
                                          const indexValue =
                                            customRateExtraHoursList.findIndex(
                                              (entry) =>
                                                entry.id === customRate.id
                                            );

                                          if (indexValue !== -1) {
                                            const removedElement =
                                              customRateExtraHoursList.splice(
                                                indexValue,
                                                1
                                              );
                                            setReloadValueFirst([
                                              "customRateExtraHoursList",
                                              customRate.id,
                                            ]);
                                          }
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </FlexCol>
                        <div className=" flex justify-between items-center border-t border-black/10 dark:border-white/20 px-4 py-2">
                          <div
                            className="flex justify-start items-center gap-[9px] cursor-pointer    "
                            onClick={(e) => {
                              setCustomRateExtraHoursList([
                                ...customRateExtraHoursList,
                                {
                                  id: e.clientX,
                                  rowType: "Two" + e.clientX,
                                  field: [
                                    {
                                      title: "If Employee works more than",
                                      type: "time",
                                      inputType:
                                        "customRateMinutes" + e.clientX,
                                      description: "Description",
                                      line: true,
                                    },
                                    {
                                      title: " Type",
                                      type: "dropdown",
                                      inputType: "customRateType" + e.clientX,
                                      description: "Description",
                                      line: true,
                                      option: customType,
                                    },
                                  ],
                                },
                              ]);
                            }}
                          >
                            <IoMdAdd className="group-hover:bg-primary  group-hover:text-white  bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                            <p className="text-sm 2xl:text-base font-medium dark:text-white ">
                              {t("Add_Range")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-8">
                        <div className=" flex flex-col gap-6  dark:bg-dark ">
                          <FlexCol
                            className={
                              "p-4 bg-[#FAFAFA] borderb dark:bg-secondaryDark rounded-xs"
                            }
                          >
                            <Heading3
                              title={t("Extra_hours_on_week_days")}
                              description={t(
                                "Set_employee_extra_work_hours_on_week_days"
                              )}
                            />
                            <div className="flex gap-3">
                              <div className=" flex flex-col gap-3.5 dark:text-white">
                                <p className="2xl:text-sm text-xs font-medium">
                                  If Employee works more than
                                </p>
                                <TimeSelect
                                  options={allowanceType}
                                  placeholder="Choose time"
                                  value={Formik3.values.halfDay}
                                  change={(e) => {
                                    Formik3.setFieldValue("halfDay", e);
                                  }}
                                  format="HH:mm"
                                  error={Formik3.errors.halfDay}
                                />
                                <TimeSelect
                                  options={allowanceType}
                                  placeholder="Choose time"
                                  value={Formik3.values.fullDay}
                                  change={(e) => {
                                    Formik3.setFieldValue("fullDay", e);
                                  }}
                                  format="HH:mm"
                                  error={Formik3.errors.fullDay}
                                />
                              </div>
                              <div className=" hidden  md:flex justify-center  items-center w-8 translate-y-4">
                                <img
                                  src={lineImage}
                                  alt=""
                                  className="h-[69px] w-[1px]"
                                />
                              </div>
                              <div className=" flex flex-col gap-6 dark:text-white w-48">
                                <p className="2xl:text-sm text-xs font-medium">
                                  {t("Off_Type")}
                                </p>
                                <div className="flex flex-col gap-2 2xl:gap-5">
                                  <Flex
                                    onClick={() => {
                                      Formik3.setFieldValue(
                                        "offType",
                                        "halfDay"
                                      );
                                    }}
                                    gap={12}
                                    className="bg-white rounded-xs w-44 p-2 justify-center m-auto"
                                    align="center"
                                  >
                                    <HalfDay className="2xl:w-6 w-4" />
                                    <p className="2xl:text-base text-sm font-medium">
                                      {t("Half_Day")}
                                    </p>
                                  </Flex>
                                  <Flex
                                    onClick={() => {
                                      Formik3.setFieldValue(
                                        "offType",
                                        "fullDay"
                                      );
                                    }}
                                    gap={12}
                                    className="bg-white rounded-xs w-44 p-2 justify-center m-auto"
                                    align="center"
                                  >
                                    <FullDay className="2xl:w-6 w-4" />
                                    <p className="2xl:text-base text-sm font-medium">
                                      {t("Full_Day")}
                                    </p>
                                  </Flex>
                                </div>
                              </div>
                            </div>
                          </FlexCol>
                        </div>
                      </div>
                    )}
                  </div>
                </FlexCol>
              ) : formik.values.workPolicyType === 3 ? (
                <FlexCol className={"w-full"}>
                  <FlexCol className=" borderb rounded-xs p-4 bg-white dark:bg-dark">
                    <Heading2
                      title="Attendance on Holidays"
                      description="Manage and configure your organization's holiday attendance policies effectively."
                    />
                    <Flex
                      className="grid items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      gap={8}
                    >
                      <FormInput
                        title={t("Work Policy Name")}
                        placeholder={t("Work Policy Name")}
                        value={Formik4.values.attendanceAndHolidayName}
                        change={(e) => {
                          Formik4.setFieldValue("attendanceAndHolidayName", e);
                        }}
                        className="lg:w-[80%]"
                        required={true}
                        error={Formik4.errors.attendanceAndHolidayName}
                      />
                    </Flex>
                  </FlexCol>
                  <div className="flex flex-col gap-10  borderb rounded-xl bg-white dark:bg-dark p-4">
                    <Flex gap={8}>
                      <FormInput
                        title={t("Minimum Working Hours")}
                        placeholder={t("Minimum Working Hours")}
                        type={"text"}
                        pattern="[0-9]*\.?[0-9]*"
                        inputmode="numeric"
                        value={Formik4.values.minimumWorkinghours}
                        change={(e) => {
                          const value = e.replace(/[^0-9]/g, "");
                          if (/^\d*\.?\d*$/.test(e)) {
                            Formik4.setFieldValue("minimumWorkinghours", e);
                          } else if (e === "") {
                            Formik4.setFieldValue(
                              "minimumWorkinghours",
                              " e.target.value"
                            );
                          }
                        }}
                        error={Formik4.errors.minimumWorkinghours}
                        maxLength={4}
                      />
                      <FormInput
                        title={t("Maximum Working Hours")}
                        placeholder={t("Maximum Working Hours")}
                        type={"text"}
                        pattern="[0-9]*\.?[0-9]*"
                        inputmode="numeric"
                        value={Formik4.values.maximumWorkinghours}
                        change={(e) => {
                          const value = e.replace(/[^0-9]/g, "");
                          if (/^\d*\.?\d*$/.test(e)) {
                            Formik4.setFieldValue("maximumWorkinghours", e);
                          } else if (e === "") {
                            Formik4.setFieldValue(
                              "maximumWorkinghours",
                              " e.target.value"
                            );
                          }
                        }}
                        error={Formik4.errors.maximumWorkinghours}
                        maxLength={4}
                      />
                    </Flex>
                    <div className="flex flex-col gap-4">
                      <Heading3
                        title={t("Calculation for attendance on holidays")}
                        description={t(
                          "Define how attendance on holidays should be managed within your organization. Choose from the options below:"
                        )}
                      />

                      <div className="md:grid grid-cols-4 flex flex-col gap-6 dark:text-white">
                        {attendanceOnHolidays?.map((each, i) => (
                          <div
                            key={i}
                            className={` p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                              Formik4.values.attendanceAndHolidayType ===
                                each.value && "border-primary"
                            } `}
                            onClick={() => {
                              Formik4.setFieldValue(
                                "attendanceAndHolidayType",
                                each.value
                              );
                              setAttendanceHolidays(
                                each.value === "overtime" ? true : false
                              );
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className=" flex flex-col gap-2">
                                <div
                                  className={`${
                                    Formik4.values.attendanceAndHolidayType ===
                                      each.value && " text-primary  "
                                  } p-2 borderb rounded-mdx w-fit bg-[#F8FAFC] dark:bg-secondaryDark`}
                                >
                                  {each.image}
                                </div>
                                <h3 className=" text-sm font-semibold">
                                  {each.title}
                                </h3>
                                <p className=" text-xs font-medium text-[#667085] ">
                                  {each.description}
                                </p>
                              </div>
                              <div
                                className={`${
                                  Formik4.values.attendanceAndHolidayType ===
                                    each.value && "border-primary"
                                } border rounded-full w-fit`}
                              >
                                <div
                                  className={`font-semibold text-base w-4 h-4 border-2 border-white dark:border-white/10 rounded-full ${
                                    Formik4.values.attendanceAndHolidayType ===
                                      each.value && "text-primary bg-primary"
                                  } `}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="">
                        {Formik4.values.attendanceAndHolidayType ===
                        "salaryMultiplier" ? (
                          <FlexCol className=" p-4 borderb rounded-xl bg-[#FAFAFA] dark:bg-secondaryDark">
                            <Heading3
                              title={
                                "Consider attendance on holiday as working day"
                              }
                              description={
                                "Set a salary multiplier for considering attendance on holidays as a regular working day."
                              }
                            />
                            <div className=" grid grid-cols-4 gap-2">
                              <Dropdown
                                title={"Salary Multiplier"}
                                change={(e) => {
                                  Formik4.setFieldValue("salaryMultiplier", e);
                                }}
                                value={Formik4.values.salaryMultiplier}
                                placeholder="Choose Multiplier"
                                options={Multiplyer}
                              />
                              <Dropdown
                                title={"Salary Component"}
                                change={(e) => {
                                  Formik4.setFieldValue("salaryComponent", e);
                                }}
                                value={Formik4.values.salaryComponent}
                                placeholder="Select"
                                options={Deduction}
                              />
                            </div>
                          </FlexCol>
                        ) : Formik4.values.attendanceAndHolidayType ===
                          "comboOff" ? (
                          <div className="flex flex-col gap-8">
                            <div className="relative flex flex-col gap-6   dark:bg-dark ">
                              <FlexCol
                                className={
                                  "p-4 bg-[#FAFAFA] borderb dark:bg-secondaryDark rounded-xs"
                                }
                              >
                                <Heading3
                                  title={t(
                                    "Consider Attendance On Holidays as Comp Off"
                                  )}
                                  description={t(
                                    "Allow employees to earn compensatory time off only if they adhere to the shift timings."
                                  )}
                                />
                                <div className="flex gap-2">
                                  <div className=" flex flex-col gap-3.5 dark:text-white">
                                    <p className="2xl:text-sm text-xs font-medium">
                                      If Employee works more than
                                    </p>
                                    <TimeSelect
                                      options={allowanceType}
                                      placeholder="Choose time"
                                      value={Formik4.values.halfDay}
                                      change={(e) => {
                                        Formik4.setFieldValue("halfDay", e);
                                      }}
                                      format="HH:mm"
                                    />
                                    <TimeSelect
                                      options={allowanceType}
                                      placeholder="Choose time"
                                      value={Formik4.values.fullDay}
                                      change={(e) => {
                                        Formik4.setFieldValue("fullDay", e);
                                      }}
                                      format="HH:mm"
                                    />
                                  </div>
                                  <div className=" hidden  md:flex justify-center  items-center w-8 translate-y-4">
                                    <img
                                      src={lineImage}
                                      alt=""
                                      className="h-[69px] w-[1px]"
                                    />
                                  </div>
                                  <div className=" flex flex-col gap-6 dark:text-white w-48">
                                    <p className="2xl:text-sm text-xs font-medium">
                                      {t("Off_Type")}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                      <Flex
                                        onClick={() => {
                                          Formik4.setFieldValue(
                                            "offType",
                                            "halfDay"
                                          );
                                        }}
                                        gap={12}
                                        className="bg-white rounded-xs w-44 p-2 justify-center m-auto"
                                        align="center"
                                      >
                                        <HalfDay className="2xl:w-6 w-4" />
                                        <p className="2xl:text-base text-sm font-medium">
                                          {t("Half_Day")}
                                        </p>
                                      </Flex>
                                      <Flex
                                        onClick={() => {
                                          Formik4.setFieldValue(
                                            "offType",
                                            "fullDay"
                                          );
                                        }}
                                        // size="large"
                                        // style={{ height: 48 }}
                                        gap={12}
                                        className="bg-white rounded-xs w-44 p-2 justify-center m-auto"
                                        align="center"
                                      >
                                        <FullDay className="2xl:w-6 w-4" />
                                        <p className="2xl:text-base text-sm font-medium">
                                          {t("Full_Day")}
                                        </p>
                                      </Flex>
                                    </div>
                                  </div>
                                </div>
                              </FlexCol>
                            </div>
                            {/* </Accordion> */}
                          </div>
                        ) : Formik4.values.attendanceAndHolidayType ===
                          "overtime" ? (
                          <div className="relative borderb rounded-xs bg-[#FAFAFA] dark:bg-secondaryDark">
                            <FlexCol className={"  p-4 "}>
                              <Heading3
                                title={t(
                                  "Consider Attendance On Holidays as Overtime"
                                )}
                                description={t(
                                  "Set a minimum number of work hours required to be eligible for overtime pay on holidays."
                                )}
                              />
                              <div className=" flex flex-col gap-6">
                                {attendanceHolidayOvertimeList?.map(
                                  (customRate, i) => (
                                    <div
                                      key={i}
                                      className="relative md:grid grid-cols-4  gap-4 flex flex-col"
                                    >
                                      {customRate.field?.map(
                                        (each, index) =>
                                          each.type !== null && (
                                            <div
                                              key={index}
                                              className="col-span-1 "
                                            >
                                              {each.type === "time" ? (
                                                <TimeSelect
                                                  title={each.title}
                                                  placeholder={
                                                    "Choose" + " " + each.title
                                                  }
                                                  format="HH:mm"
                                                  value={
                                                    Formik4.values[
                                                      each.inputType
                                                    ]
                                                  }
                                                  change={(e) => {
                                                    Formik4.setFieldValue(
                                                      each.inputType,
                                                      e
                                                    );
                                                  }}
                                                  error={
                                                    Formik4.values[
                                                      each.inputType
                                                    ]
                                                      ? ""
                                                      : Formik4.errors[
                                                          each.inputType
                                                        ]
                                                  }
                                                  required={true}
                                                />
                                              ) : each.type === "dropdown" ? (
                                                <Dropdown
                                                  title={each.title}
                                                  placeholder={
                                                    "Choose" + " " + each.title
                                                  }
                                                  value={
                                                    Formik4.values[
                                                      each.inputType
                                                    ]
                                                  }
                                                  change={(e) => {
                                                    if (!each.changeValue) {
                                                      if (e === "fixedAmount") {
                                                        attendanceHolidayOvertimeList.map(
                                                          (item) => {
                                                            item.id ===
                                                              customRate.id &&
                                                              item.field.splice(
                                                                2,
                                                                3,
                                                                {
                                                                  title:
                                                                    "Amount",
                                                                  titleChange: true,
                                                                  type: "input",
                                                                  enter:
                                                                    "number",
                                                                  enterDigits:
                                                                    "6",
                                                                  inputType:
                                                                    "OvertimeAmmount" +
                                                                    item.id,
                                                                  placeholder:
                                                                    "Type here...",
                                                                  description:
                                                                    "Description",
                                                                }
                                                              );
                                                          }
                                                        );
                                                      } else {
                                                        attendanceHolidayOvertimeList.map(
                                                          (item) => {
                                                            item.id ===
                                                              customRate.id &&
                                                              item.field.splice(
                                                                2,
                                                                3,
                                                                {
                                                                  title:
                                                                    "Salary Multiplyer",
                                                                  type: "dropdown",
                                                                  inputType:
                                                                    "overtimeMultiplyer" +
                                                                    item.id,
                                                                  option:
                                                                    Multiplyer,
                                                                },
                                                                {
                                                                  title:
                                                                    "Salary Component",
                                                                  type: "dropdown",
                                                                  inputType:
                                                                    "overtimeComponent" +
                                                                    item.id,
                                                                  option:
                                                                    Deduction,
                                                                }
                                                              );
                                                          }
                                                        );
                                                      }
                                                    }
                                                    Formik4.setFieldValue(
                                                      each.inputType,
                                                      e
                                                    );
                                                  }}
                                                  options={each.option}
                                                  icondropDown={
                                                    each.icon ? true : false
                                                  }
                                                  icon={
                                                    each.icon && (
                                                      <PiCloudWarningBold className="text-primary font-bold" />
                                                    )
                                                  }
                                                  error={
                                                    Formik4.values[
                                                      each.inputType
                                                    ]
                                                      ? ""
                                                      : Formik4.errors[
                                                          each.inputType
                                                        ]
                                                  }
                                                  required={true}
                                                />
                                              ) : each.type === "input" ? (
                                                <FormInput
                                                  title={
                                                    Formik4.values[
                                                      customRateExtraHoursList?.map(
                                                        (each) =>
                                                          Object.values(
                                                            each.field
                                                          )[1].inputType
                                                      )[i]
                                                    ] === "salaryMultiplyer"
                                                      ? "Multiplayer"
                                                      : each.title
                                                  }
                                                  placeholder={each.title}
                                                  value={
                                                    Formik4.values[
                                                      each.inputType
                                                    ]
                                                  }
                                                  error={
                                                    Formik4.values[
                                                      each.inputType
                                                    ]
                                                      ? ""
                                                      : Formik4.errors[
                                                          each.inputType
                                                        ]
                                                  }
                                                  type={each.enter}
                                                  pattern="[0-9]*"
                                                  inputmode="numeric"
                                                  change={(e) => {
                                                    if (each.enterDigits)
                                                      if (/^\d*$/g.test(e))
                                                        Formik4.setFieldValue(
                                                          each.inputType,
                                                          e
                                                        );
                                                  }}
                                                  maxLength={4}
                                                  required={true}
                                                />
                                              ) : null}
                                            </div>
                                          )
                                      )}
                                      {i !== 0 && (
                                        <div className="absolute -right-[60px] top-7 pb-2 z-50 w-16">
                                          <Tooltip
                                            placement="topLeft"
                                            title="Delete"
                                          >
                                            <PiTrash
                                              className=" hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                              onClick={() => {
                                                const indexValue =
                                                  attendanceHolidayOvertimeList.findIndex(
                                                    (entry) =>
                                                      entry.id === customRate.id
                                                  );

                                                if (indexValue !== -1) {
                                                  const removedElement =
                                                    attendanceHolidayOvertimeList.splice(
                                                      indexValue,
                                                      1
                                                    );
                                                  setReloadValueFirst([
                                                    "attendanceHolidayOvertimeList",
                                                    customRate.id,
                                                  ]);
                                                }
                                              }}
                                            />
                                          </Tooltip>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </FlexCol>
                            <div className=" flex justify-between items-center border-t border-black/10 dark:border-white/20 px-4 py-2">
                              <div
                                className="flex justify-start items-center gap-[9px] cursor-pointer    "
                                onClick={(e) => {
                                  setAttendanceHolidayOvertimeList([
                                    ...attendanceHolidayOvertimeList,
                                    {
                                      id: e.clientX,
                                      rowType: "Two" + e.clientX,
                                      field: [
                                        {
                                          title: "If Employee works more than",
                                          type: "time",
                                          inputType:
                                            "overtimeMinutes" + e.clientX,
                                          description: "Description",
                                          line: true,
                                        },
                                        {
                                          title: " Type",
                                          type: "dropdown",
                                          inputType: "overtimeType" + e.clientX,
                                          description: "Description",
                                          line: true,
                                          option: customType,
                                        },
                                      ],
                                    },
                                  ]);
                                }}
                              >
                                <IoMdAdd className="group-hover:bg-primary  group-hover:text-white  bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                                <p className="text-sm 2xl:text-base font-medium dark:text-white ">
                                  {t("Add_Range")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          Formik4.values.attendanceAndHolidayType ===
                            "doNotConsider" && (
                            <FlexCol className=" p-4 borderb rounded-xl bg-[#FAFAFA] dark:bg-secondaryDark">
                              <div className="flex gap-3">
                                <img
                                  className="size-[50px] shrink-0"
                                  src={imgorange}
                                />
                                <Heading2
                                  title={"Not Consider Attendance On Holidays"}
                                  description={
                                    "Opt not to consider attendance on holidays for additional compensation or compensatory time off."
                                  }
                                />
                              </div>
                            </FlexCol>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </FlexCol>
              ) : (
                formik.values.workPolicyType === 4 && (
                  <FlexCol className={"w-full"}>
                    <FlexCol
                      className={"p-4 borderb rounded-xs bg-white dark:bg-dark"}
                    >
                      <Heading2
                        title={t("Miss_Punch_Policy")}
                        description={t("Miss_Punch_Policy_Description")}
                      />
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-2 items-center md:items-end">
                        <FormInput
                          title={t("Work_Policy_Name")}
                          placeholder={t("Work_Policy_Name")}
                          value={Formik5.values.missPunchName}
                          change={(e) => {
                            Formik5.setFieldValue("missPunchName", e);
                          }}
                          className="lg:w-[80%]"
                          error={
                            Formik5.values.missPunchName
                              ? ""
                              : Formik5.errors.missPunchName
                          }
                          required={true}
                        />

                        <div
                          className={
                            "w-full flex gap-2 p-2 dark:bg-dark items-center bg-white justify-end "
                          }
                        >
                          <ToggleBtn
                            // description={each.description}
                            value={Formik5.values.warningEmail}
                            change={(e) => {
                              Formik5.setFieldValue("warningEmail", e);
                            }}
                          />
                          <div className="flex gap-3 2xl:gap-6 items-center">
                            <div>
                              <p className="font-semibold text-xs 2xl:text-sm">
                                Send Notification Email to Employees
                              </p>
                              <p className="text-xs 2xl:text-sm text-grey">
                                Allow staff to receive important notification
                                via message
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FlexCol>
                    <Accordion
                      title={t("Miss_Punch_Rule")}
                      description={t("Miss_Punch_Rule_Description")}
                      padding={false}
                      primarybg={false}
                      initialExpanded={true}
                      className={"bg-white dark:bg-dark"}
                    >
                      <div className=" md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6  dark:bg-dark  ">
                        {missPunchPolicyList?.map((missPunch, i) => (
                          <div className="relative xl:flex justify-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-7 gap-3">
                            {missPunch?.field.map((each, index) => (
                              <>
                                {!each.inputCount && each.type !== null && (
                                  <div
                                    className=" col-span-1 flex  w-full  "
                                    key={index}
                                  >
                                    {each.type === "time" ? (
                                      <TimeSelect
                                        className="w-full"
                                        title={each.title}
                                        placeholder={"Enter" + " " + each.title}
                                        type="number"
                                        format="HH:mm"
                                        value={Formik5.values[each.inputType]}
                                        required={true}
                                        change={(e) => {
                                          Formik5.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                        }}
                                        error={
                                          Formik5.values[each.inputType]
                                            ? ""
                                            : Formik5.errors[each.inputType]
                                        }
                                      />
                                    ) : each.type === "dropdown" ? (
                                      each.Occurrence === true ? (
                                        Formik5.values[each.inputType] ? (
                                          <div className=" flex flex-col items-start">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              description={each.description
                                                ?.split("_")
                                                .join(
                                                  Formik5.values[each.inputType]
                                                )}
                                              value={
                                                Formik5.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik5.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                            <Dropdown
                                              className="w-full "
                                              error={
                                                Formik5.values[each.inputType]
                                                  ? ""
                                                  : Formik5.errors[
                                                      each.inputType
                                                    ]
                                              }
                                              description={each.description
                                                ?.split("_")
                                                .join(
                                                  +" " +
                                                    Formik5.values[
                                                      each.inputType
                                                    ] +
                                                    " "
                                                )}
                                              placeholder={
                                                "Select" + " " + each.title
                                              }
                                              value={
                                                Formik5.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik5.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                              options={each.option}
                                              icondropDown={
                                                each.icon ? true : false
                                              }
                                              icon={
                                                each.icon && (
                                                  <PiCloudWarningBold className="text-primary font-bold" />
                                                )
                                              }
                                              required={true}
                                            />
                                          </div>
                                        ) : (
                                          <div className="flex items-center">
                                            <CheckBoxInput
                                              titleRight={each.title}
                                              value={
                                                Formik5.values[each.inputType]
                                              }
                                              change={(e) => {
                                                Formik5.setFieldValue(
                                                  each.inputType,
                                                  e
                                                );
                                              }}
                                            />
                                          </div>
                                        )
                                      ) : (
                                        <Dropdown
                                          className="w-full"
                                          title={each.title}
                                          error={
                                            Formik5.values[each.inputType]
                                              ? ""
                                              : Formik5.errors[each.inputType]
                                          }
                                          placeholder={
                                            "Choose" + " " + each.title
                                          }
                                          required={true}
                                          value={Formik5.values[each.inputType]}
                                          change={(e) => {
                                            if (!each.changeValue) {
                                              const indexValue =
                                                missPunchPolicyList.map(
                                                  (each) =>
                                                    each.id === missPunch.id &&
                                                    each.field.findIndex(
                                                      (entry) =>
                                                        entry.valuecheck ===
                                                        "DeductionComponent"
                                                    )
                                                );
                                              indexValue.map((data) =>
                                                data != -1 && data !== false
                                                  ? missPunchPolicyList.map(
                                                      (each) =>
                                                        each.id ===
                                                          missPunch.id &&
                                                        each.field.splice(
                                                          parseInt(data),
                                                          2
                                                        )
                                                    )
                                                  : null
                                              );
                                              if (e === "fixedAmount") {
                                                missPunchPolicyList.map(
                                                  (item) => {
                                                    item.id === missPunch.id &&
                                                      item.field.splice(2, 0, {
                                                        title: "Amount",
                                                        enter: "number",
                                                        type: "input",
                                                        valuecheck:
                                                          "DeductionComponent",
                                                        inputType:
                                                          "missPunchAmount" +
                                                          item.id,
                                                        description:
                                                          "Lorem ipsum dolor sit amet",
                                                        // line: true,
                                                        display: true,
                                                      });
                                                  }
                                                );
                                              } else {
                                                missPunchPolicyList.map(
                                                  (item) => {
                                                    item.id === missPunch.id &&
                                                      item.field.splice(
                                                        2,
                                                        4,
                                                        {
                                                          title:
                                                            "Deduction From",
                                                          type: "dropdown",
                                                          valuecheck:
                                                            "DeductionComponent",
                                                          inputType:
                                                            "missPunchDeductionComponent" +
                                                            item.id,
                                                          changeValue: true,
                                                          option: Deduction,
                                                        },
                                                        {
                                                          title: "Days",
                                                          type: "dropdown",
                                                          valuecheck:
                                                            "DeductionComponent",
                                                          inputType:
                                                            "missPunchDays" +
                                                            item.id,
                                                          divline: true,
                                                          option: DaysDivider,
                                                          display: true,
                                                        }
                                                      );
                                                  }
                                                );
                                              }
                                            }
                                            Formik5.setFieldValue(
                                              each.inputType,
                                              e
                                            );
                                          }}
                                          options={each.option}
                                          icondropDown={
                                            each.icon ? true : false
                                          }
                                          icon={
                                            each.icon && (
                                              <PiCloudWarningBold className="text-primary font-bold" />
                                            )
                                          }
                                        />
                                      )
                                    ) : (
                                      <FormInput
                                        className="w-full"
                                        title={each.title}
                                        error={
                                          Formik5.values[each.inputType]
                                            ? ""
                                            : Formik5.errors[each.inputType]
                                        }
                                        placeholder={each.title}
                                        value={Formik5.values[each.inputType]}
                                        required={true}
                                        maxLength={7}
                                        change={(e) => {
                                          if (each.title === "Amount") {
                                            if (
                                              /^\d+$/g.test(e) &&
                                              /^\d+(?!.*--).*$/g.test(e)
                                            ) {
                                              Formik5.setFieldValue(
                                                each.inputType,
                                                e
                                              );
                                            }
                                          } else if (parseInt(e) <= 31) {
                                            if (
                                              /^\d+$/g.test(e) &&
                                              /^\d+(?!.*--).*$/g.test(e)
                                            ) {
                                              Formik5.setFieldValue(
                                                each.inputType,
                                                e
                                              );
                                            }
                                          }

                                          if (e === "") {
                                            Formik5.setFieldValue(
                                              each.inputType,
                                              ""
                                            );
                                          }
                                        }}
                                        type={each.enter}
                                      />
                                    )}
                                  </div>
                                )}
                              </>
                            ))}
                            {i !== 0 && (
                              <div className="absolute -right-4 top-0 pb-2 pl-0.5 z-50 w-4">
                                <Tooltip placement="topLeft" title="Delete">
                                  <PiTrash
                                    className=" hover:bg-primary hover:text-white text-rose-600 p-1 mt-7 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                    onClick={() => {
                                      const indexValue =
                                        missPunchPolicyList.findIndex(
                                          (entry) => entry.id === missPunch.id
                                        );

                                      if (indexValue !== -1) {
                                        const removedElement =
                                          missPunchPolicyList.splice(
                                            indexValue,
                                            1
                                          );
                                        setReloadValueFirst([
                                          "missPunchPolicyList",
                                          missPunch.id,
                                        ]);
                                      }
                                    }}
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="relative flex flex-col gap-2 items-start border-t border-black/10 dark:border-white/20 px-[25px] py-[15px]">
                        <div
                          className="flex justify-start items-center gap-[9px] cursor-pointer"
                          onClick={(e) => {
                            setMissPunchPolicyList([
                              ...missPunchPolicyList,
                              {
                                id: e.clientX,
                                rowType: "Two" + e.clientX,
                                field: [
                                  {
                                    title: "If miss punch occurs more than",
                                    type: "input",
                                    inputType: "missPunchMinutes" + e.clientX,
                                    description:
                                      "Lorem ipsum dolor sit amet,it",
                                    check: true,
                                  },
                                  {
                                    title: "Deduction Type",
                                    type: "dropdown",
                                    inputType:
                                      "missPunchDeductionType" + e.clientX,
                                    description: "Description",
                                    option: deductionTypeOption,
                                    icon: true,
                                  },
                                  {
                                    title: "Deduction From",
                                    type: "dropdown",
                                    valuecheck: "DeductionComponent",
                                    inputType:
                                      "missPunchDeductionComponent" + e.clientX,
                                    changeValue: true,
                                    option: Deduction,
                                  },
                                  {
                                    title: "Days",
                                    type: "dropdown",
                                    valuecheck: "DeductionComponent",
                                    inputType: "missPunchDays" + e.clientX,
                                    divline: true,
                                    option: DaysDivider,
                                    display: true,
                                  },
                                ],
                              },
                            ]);
                          }}
                        >
                          <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                          <p className="text-sm 2xl:text-base font-medium dark:text-white">
                            {t("Add_Range")}
                          </p>
                        </div>
                      </div>
                    </Accordion>
                  </FlexCol>
                )
              )
            ) : (
              activeBtnValue === "assignPolicy" && (
                <EmployeeCheck
                  title="Applicability"
                  description="Manage your companies Policies here"
                  employee={employeeList}
                  department={departmentList}
                  location={locationList}
                  navigateBtn={navigateBtn}
                  assignData={(employee, department, location) => {
                    setEmployeeCheckList(employee);
                    setDepartmentCheckList(department);
                    setLocationCheckList(location);
                  }}
                />
              )
            )}
          </div>
        </Flex>
      </FlexCol>
    </DrawerPop>
    // {/* </Wizard> */}
    // </div>
  );
}

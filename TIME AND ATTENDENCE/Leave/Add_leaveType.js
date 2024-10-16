import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import API, { action } from "../../Api";
import * as yup from "yup";
import { Button, Flex, Tooltip } from "antd";
import { leavelimitPer, unusedLeaveRule, DaysDivider } from "../../data";
import { MdOutlineDeleteForever } from "react-icons/md";
import { RxQuestionMarkCircled } from "react-icons/rx";
import DrawerPop from "../../common/DrawerPop";
import image from "../../../assets/images/image 508.png";
import image1 from "../../../assets/images/image 509.png";
import Heading from "../../common/Heading";
import FormInput from "../../common/FormInput";
import Dropdown from "../../common/Dropdown";
import RadioButton from "../../common/RadioButton";
import LeaveTemplate from "./LeaveTemplate";
import ToggleBtn from "../../common/ToggleBtn";
import Stepper from "../../common/Stepper";
import TextArea from "../../common/TextArea";
import Accordion from "../../common/Accordion";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { IoAdd } from "react-icons/io5";
import CheckBoxInput from "../../common/CheckBoxInput";
import FlexCol from "../../common/FlexCol";
import { TiTick } from "react-icons/ti";
import { setAccordionItem } from "../../../Redux/action";
import { lightenColor } from "../../common/lightenColor";
import { PiArrowRight, PiTrash } from "react-icons/pi";
import EmployeeCheck from "../../common/EmployeeCheck";
import { LeaveTypeSVG } from "../../common/SVGFiles";
import Heading2 from "../../common/Heading2";
import { useNotification } from "../../../Context/Notifications/Notification";
import { fetchCompanyDetails } from "../../common/Functions/commonFunction";
import { LuInfo } from "react-icons/lu";
import { FaAsterisk } from "react-icons/fa";
import localStorageData from "../../common/Functions/localStorageKeyValues";

const Add_leaveType = ({
  open = "",
  close = () => {},
  refresh = () => {},
  createPolicyAction,
  updateId,
  openPolicy,
}) => {
  const primaryColor = localStorageData.mainColor;
  const [show, setShow] = useState(open);
  const [activeBtn, setActiveBtn] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const { t } = useTranslation();
  const [activeBtnValue, setActiveBtnValue] = useState("LeaveType"); //LeaveType
  const [presentage, setPresentage] = useState(0.2);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [conditionalPay, setConditionalPay] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState(null);
  const [isInIndia, setIsInIndia] = useState(false);

  const navigateBtn = [
    { id: 1, value: "Employees", title: "Employees" },
    { id: 2, value: "Departments", title: "Departments" },
    { id: 3, value: "Locations", title: "Locations" },
  ];
  // Assign leave type

  const selectedAccordionItem = useSelector(
    (state) => state.accordion.accordionItem
  );
  const dispatchRedux = useDispatch();

  const [departmentList, setDepartmentList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveCountList, setLeaveCountList] = useState([]);

  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [departmentCheckList, setDepartmentCheckList] = useState([]);
  const [locationCheckList, setLocationCheckList] = useState([]);
  const [Paycalculation, setPaycalculation] = useState([
    {
      id: 2,
      label: "Gross Salary",
      value: "grossSalary",
    },
  ]);

  const lighterColor = lightenColor(primaryColor, 0.9);
  const themeMode = useSelector((state) => state.layout.mode);

  useEffect(() => {
    console.log(selectedAccordionItem);
    formik.setFieldValue("leaveType", selectedAccordionItem.title);
    formik.setFieldValue("leaveCount", selectedAccordionItem.leaveCount);
    formik.setFieldValue("description", selectedAccordionItem.description);
  }, [selectedAccordionItem]);

  const LeaveType = [
    {
      id: 1,
      label: t("Between"),
      value: "between",
    },
    {
      id: 2,
      label: t("Greater_than_or_equal_to"),
      value: "greaterThanOrEqualTo",
    },
    {
      id: 3,
      label: t("Less_than"),
      value: "lessThan",
    },
  ];
  const leavePayRateData = [
    {
      id: 1,
      field: [
        {
          title: "If the employee’s leave allowance used is:",
          inputType: "payType",
          type: "radioBtn",
          option: "",
          supInputOne: [
            {
              title: "From",
              inputType: "fromDays",
              type: "input",
            },
            {
              title: "To",
              inputType: "toDays",
              type: "input",
            },
          ],
          supInputTwo: [
            {
              title: "",
              inputType: "fromDays",
              type: "input",
            },
          ],
          supInputThree: [
            {
              title: "",
              inputType: "fromDays",
              type: "input",
            },
          ],
        },
        {
          title: "Pay rate for this policy?",
          inputType: "ruleType",
          type: "choose",
          supInputTwo: [
            {
              title: "Pay Calculation",
              inputType: "Paycalculation",
              type: "dropdown",
              option: Paycalculation,
            },
            {
              title: "Days",
              inputType: "days",
              type: "dropdown",
              option: DaysDivider,
            },
          ],
          supInputThree: [
            {
              title: "Percentage Paid",
              inputType: "percentagepaid",
              type: "input",
            },
            {
              title: "Pay Calculation",
              inputType: "Paycalculation",
              type: "dropdown",
              option: Paycalculation,
            },
            {
              title: "Days",
              inputType: "Days",
              type: "dropdown",
              option: DaysDivider,
            },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeBtnValue]);

  const [conditions, setConditions] = useState([]);
  const [isAddingCondition, setIsAddingCondition] = useState(true);
  const [conditionalPayRate, setConditionalPayRate] = useState([]);

  const handleAddAnotherCondition = (e) => {
    setConditionalPayRate([
      ...conditionalPayRate,
      {
        id: e.clientX,
        field: [
          {
            title: "If the employee’s leave allowance used is:",
            inputType: "payType" + e.clientX,
            type: "radioBtn",
            option: "",
            supInputOne: [
              {
                title: "From",
                inputType: "fromDays" + e.clientX,
                type: "input",
              },
              {
                title: "To",
                inputType: "toDays" + e.clientX,
                type: "input",
              },
            ],
            supInputTwo: [
              {
                title: "",
                inputType: "fromDays" + e.clientX,
                type: "input",
              },
            ],
            supInputThree: [
              {
                title: "",
                inputType: "fromDays" + e.clientX,
                type: "input",
              },
            ],
          },
          {
            title: "Pay rate for this policy?",
            inputType: "ruleType" + e.clientX,
            type: "choose",
            supInputTwo: [
              {
                title: "Pay Calculation",
                inputType: "Paycalculation" + e.clientX,
                type: "dropdown",
                option: Paycalculation,
              },
              {
                title: "Days",
                inputType: "days" + e.clientX,
                type: "dropdown",
                option: DaysDivider,
              },
            ],
            supInputThree: [
              {
                title: "Percentage Paid",
                inputType: "percentagepaid" + e.clientX,
                type: "input",
              },
              {
                title: "Pay Calculation",
                inputType: "Paycalculation" + e.clientX,
                type: "dropdown",
                option: Paycalculation,
              },
              {
                title: "Days",
                inputType: "Days" + e.clientX,
                type: "dropdown",
                option: DaysDivider,
              },
            ],
          },
        ],
      },
    ]);

    const newCondition = {
      /* Default values or empty values */
    };
    setConditions([...conditions, newCondition]);
  };

  const handleDeleteCondition = () => {
    // Your logic for handling "Delete Condition"
    setIsAddingCondition(true);
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const handleClose = () => {
    dispatchRedux(setAccordionItem(""));

    setShow(false);
  };
  const [showPop, setShowPop] = useState(false);
  const handleShow = () => setShow(true);
  const [openPop, setOpenPop] = useState("");

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
    const fetchLocation = async () => {
      try {
        const response = await fetchCompanyDetails(companyId);
        setIsInIndia(parseInt(response?.isPFESIenabled) === 1 ? true : false);
        setPaycalculation(
          parseInt(response?.isPFESIenabled) === 1
            ? [
                {
                  id: 2,
                  label: "Gross Salary",
                  value: "grossSalary",
                },
              ]
            : [
                {
                  id: 1,
                  label: "Basic Salary",
                  value: "basicSalary",
                },
                {
                  id: 2,
                  label: "Gross Salary",
                  value: "grossSalary",
                },
              ]
        );
        setConditionalPayRate([
          {
            id: 1,
            field: [
              {
                title: "If the employee’s leave allowance used is:",
                inputType: "payType",
                type: "radioBtn",
                option: "",
                supInputOne: [
                  {
                    title: "From",
                    inputType: "fromDays",
                    type: "input",
                  },
                  {
                    title: "To",
                    inputType: "toDays",
                    type: "input",
                  },
                ],
                supInputTwo: [
                  {
                    title: "",
                    inputType: "fromDays",
                    type: "input",
                  },
                ],
                supInputThree: [
                  {
                    title: "",
                    inputType: "fromDays",
                    type: "input",
                  },
                ],
              },
              {
                title: "Pay rate for this policy?",
                inputType: "ruleType",
                type: "choose",
                supInputTwo: [
                  {
                    title: "Pay Calculation",
                    inputType: "Paycalculation",
                    type: "dropdown",
                    option:
                      parseInt(response?.isPFESIenabled) === 1
                        ? [
                            {
                              id: 2,
                              label: "Gross Salary",
                              value: "grossSalary",
                            },
                          ]
                        : [
                            {
                              id: 1,
                              label: "Basic Salary",
                              value: "basicSalary",
                            },
                            {
                              id: 2,
                              label: "Gross Salary",
                              value: "grossSalary",
                            },
                          ],
                  },
                  {
                    title: "Days",
                    inputType: "days",
                    type: "dropdown",
                    option: DaysDivider,
                  },
                ],
                supInputThree: [
                  {
                    title: "Percentage Paid",
                    inputType: "percentagepaid",
                    type: "input",
                  },
                  {
                    title: "Pay Calculation",
                    inputType: "Paycalculation",
                    type: "dropdown",
                    option:
                      parseInt(response?.isPFESIenabled) === 1
                        ? [
                            {
                              id: 2,
                              label: "Gross Salary",
                              value: "grossSalary",
                            },
                          ]
                        : [
                            {
                              id: 1,
                              label: "Basic Salary",
                              value: "basicSalary",
                            },
                            {
                              id: 2,
                              label: "Gross Salary",
                              value: "grossSalary",
                            },
                          ],
                  },
                  {
                    title: "Days",
                    inputType: "Days",
                    type: "dropdown",
                    option: DaysDivider,
                  },
                ],
              },
            ],
          },
        ]);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (activeBtn < 4 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setNextStep(nextStep);
      console.log(1 + activeBtn);
      console.log(steps?.[activeBtn + 1].data, "data");
      setActiveBtnValue(steps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  let initialValues = {};

  initialValues = leavePayRateData.reduce((ac, item) => {
    item.field.forEach((field) => {
      ac[field.inputType] = "";

      if (field.supInputOne) {
        field.supInputOne.forEach((supInput) => {
          ac[supInput.inputType] = "";
        });
      }

      if (field.supInputTwo) {
        field.supInputTwo.forEach((supInput) => {
          ac[supInput.inputType] = "";
        });
      }

      if (field.supInputThree) {
        field.supInputThree.forEach((supInput) => {
          ac[supInput.inputType] = "";
        });
      }
    });

    return ac;
  }, {});

  let baseValidationSchema = yup.object().shape({
    leaveType: yup.string().required("Leave Type is required"),
    description: yup.string().required("Description is required"),
    leaveCount: yup
      .number()
      .max(365, "Leave count must be less than or equal to 365")
      .required("Leave Count is required"),
    maxLeaveLimit: yup
      .number()
      .typeError("Max Leave Limit must be a number")
      .test(
        "is-integer-or-half",
        "Max Leave Limit must be an integer or a value ending in .5.",
        (value) => Number.isInteger(value) || value % 1 === 0.5
      )
      .max(100, "Max Leave Limit cannot be more than 100")
      .required("Max Leave Limit is required"),
    leaveLimitPer: yup.string().required("Leave Limit Per is required"),
    unusedLeaveRule: yup.string().required("Unused Leave Rule is required"),
    leaveDays: yup.string().required("Leave Days Rule is required"),
    isAnnualleave: yup.string().required("Recurring Policy is required"),
    defaulPayType: yup.string().required("Default Pay Type is required"),
    // fromDays: yup.number().required("Days is Required"),
    conditionalPayRate: yup.array().of(
      yup.object().shape({
        field: yup.array().of(
          yup.object().shape({
            inputType: yup.string(),
            supInputOne: yup.array().of(
              yup.object().shape({
                inputType: yup.string(),
              })
            ),
            supInputTwo: yup.array().of(
              yup.object().shape({
                inputType: yup.string(),
              })
            ),
            supInputThree: yup.array().of(
              yup.object().shape({
                inputType: yup.string(),
              })
            ),
          })
        ),
      })
    ),
  });

  const [validationSchema, setValidationSchema] =
    useState(baseValidationSchema);

  const formik = useFormik({
    initialValues: {
      leaveType: "",
      categoryId: "",
      // leaveName: "",
      description: "",
      leaveCount: null,
      isProrata: "",
      maxLeaveLimit: "",
      leaveLimitPer: null,
      isProrataProbationIncluded: "",
      leavePaytype: "",
      carryforword: "",
      isProbationRestricted: "",
      unusedLeaveRule: null,
      isRestrictedHoliday: "",
      maxlimit: "",
      encashmentLimit: "",
      encashmentRule: null,
      days: null,
      // leaveDaysType: "",
      isAnnualleave: "",
      leaveDays: "",
      // isProbationRestricted: "",
      defaulPayType: "", //unpaid
      defaulPercentage: "",
      defaultSalaryComponent: null,
      defaultDays: null,
      conditionalPay: false,
      ...initialValues,
      conditionalPayRate: [],

      leavePaidRules: [
        {
          fromDate: "",
          toDate: "",
          payType: "",
          ruleType: "",
          calculation: {
            percentagepaid: "",
            Paycalculation: "",
            days: "",
          },
        },
      ],

      isActive: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: validationSchema,

    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (updateId || leaveTypeId) {
          const result = await action(API.UPDATE_LEAVE_TYPE, {
            id: updateId || leaveTypeId,
            companyId: companyId,
            leaveType:
              e.leaveType.charAt(0).toUpperCase() + e.leaveType.slice(1) ||
              null,
            description: e.description || null,
            leaveCount: e.leaveCount || null,
            maxLeaveLimit: e.maxLeaveLimit || null,
            leaveLimitPer: e.leaveLimitPer || null,
            isRestrictedHoliday: e.isRestrictedHoliday || null,
            unusedLeaveRule: {
              unusedleaveRuleType: e.unusedLeaveRule || null,
              rule: {
                limit: e.encashmentLimit || null,
                calculation: {
                  salaryComponent: e.encashmentRule || null,
                  days: e.days || null,
                },
              },
            },
            isProrata: e.isProrata || 0,
            isProrataProbationIncluded: e.isProrataProbationIncluded,
            leaveDaysType: e.leaveDays || null,
            isAnnualleave: e.isAnnualleave || 0,
            leavePayRate: {
              default: {
                payType: e.defaulPayType || null,
                calculation: {
                  percentage: e.defaulPercentage || null,
                  salaryComponent: e.defaultSalaryComponent || null,
                  days: e.defaultDays || null,
                },
              },
              conditional: conditionalPayRate?.map((each) => ({
                payType: e[each.field[0].inputType],
                // maxDays:e[each.field[1].inputType]
                minDays:
                  e[each.field[0].supInputOne[0].inputType] ||
                  e[each.field[0].supInputTwo[0].inputType] ||
                  e[each.field[0].supInputThree[0].inputType],
                maxDays: e[each.field[0].supInputOne[1].inputType],
                ruleType: e[each.field[1].inputType],
                calculation: {
                  //Paycalculation
                  salaryComponent:
                    e[each.field[1].supInputTwo[0].inputType] ||
                    e[each.field[1].supInputThree[1].inputType],
                  days:
                    e[each.field[1].supInputTwo[1].inputType] ||
                    e[each.field[1].supInputThree[2].inputType],
                  percentagepaid: e[each.field[1].supInputThree[0].inputType],
                },
              })),
            },
            isActive: "1",
            createdBy: employeeId,
          });
          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setPresentage(2);
            setLoading(false);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.CREATE_LEAVE_TYPE, {
            companyId: companyId,
            employeeId: employeeId,
            leaveType:
              e.leaveType.charAt(0).toUpperCase() + e.leaveType.slice(1) ||
              null,
            description: e.description || null,
            leaveCount: e.leaveCount || null,
            maxLeaveLimit: e.maxLeaveLimit || null,
            leaveLimitPer: e.leaveLimitPer || null,
            isRestrictedHoliday: e.isRestrictedHoliday || null,
            unusedLeaveRule: {
              unusedleaveRuleType: e.unusedLeaveRule || null,
              rule: {
                limit: e.encashmentLimit || null,
                calculation: {
                  salaryComponent: e.encashmentRule || null,
                  days: e.days || null,
                },
              },
            },
            isProrata: e.isProrata || 0,
            isProrataProbationIncluded: e.isProrataProbationIncluded,
            leaveDaysType: e.leaveDays || null,
            isAnnualleave: e.isAnnualleave || 0,
            leavePayRate: {
              default: {
                payType: e.defaulPayType || null,
                calculation: {
                  percentage: e.defaulPercentage || null,
                  salaryComponent: e.defaultSalaryComponent || null,
                  days: e.defaultDays || null,
                },
              },

              conditional: conditionalPayRate?.map((each) => ({
                payType: e[each.field[0].inputType],
                // maxDays:e[each.field[1].inputType]
                minDays:
                  e[each.field[0].supInputOne[0].inputType] ||
                  e[each.field[0].supInputTwo[0].inputType] ||
                  e[each.field[0].supInputThree[0].inputType],
                maxDays: e[each.field[0].supInputOne[1].inputType],
                ruleType: e[each.field[1].inputType],
                calculation: {
                  //Paycalculation
                  salaryComponent:
                    e[each.field[1].supInputTwo[0].inputType] ||
                    e[each.field[1].supInputThree[1].inputType],
                  days:
                    e[each.field[1].supInputTwo[1].inputType] ||
                    e[each.field[1].supInputThree[2].inputType],
                  percentagepaid: e[each.field[1].supInputThree[0].inputType],
                },
              })),
            },
            isActive: "1",
            createdBy: employeeId,
          });

          if (result.status === 200) {
            setLeaveTypeId(result.result.insertedId);
            openNotification("success", "Successful", result.message);
            setPresentage(2);
            setLoading(false);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Info", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.message);
        setLoading(false);
      }
    },
  });

  const createDynamicValidationSchema = () => {
    let dynamicSchema = baseValidationSchema;

    if (formik.values.conditionalPay) {
      conditionalPayRate.forEach((item) => {
        item.field.forEach((field) => {
          console.log(
            formik.values[field.inputType] === "between",
            formik.values.conditionalPay,
            "between"
          );
          if (field.supInputOne && field.supInputOne.length >= 2) {
            const fromDaysRef = field.supInputOne[0].inputType;
            const toDaysRef = field.supInputOne[1].inputType;

            if (
              formik.values[field.inputType] === "between" &&
              formik.values.conditionalPay
            ) {
              dynamicSchema = dynamicSchema.shape({
                [toDaysRef]: yup
                  .number()
                  .required("Days is ")
                  .moreThan(
                    yup.ref(fromDaysRef),
                    "Please give a greater value on the right side"
                  ),
              });
            }
          }
        });
      });
    }

    return dynamicSchema;
  };

  useEffect(() => {
    setValidationSchema(createDynamicValidationSchema(formik.values));
  }, [formik.values, conditionalPayRate]);

  const assignPolicy = async () => {
    setLoading(true);
    try {
      setPresentage(2);
      const result = await action(API.ADD_ASSIGN_EMPLOYEE_LEAVE_TYPES, {
        leaveTypeId: leaveTypeId,
        companyId: companyId,
        employeeId:
          employeeCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        departmentId:
          departmentCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        locationId:
          locationCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        leaveCount:
          employeeCheckList
            ?.map(
              (each) =>
                each.assign && parseInt(each[`${"leaveCount" + each.id}`])
            )
            .filter((data) => parseInt(data)) || [],
        // leaveCount:
        createdBy: employeeId,
      });
      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {
          setShow(false);
        });
        setTimeout(() => {
          handleClose();
          setLoading(false);
          refresh();
        }, 1000);
      } else {
        openNotification("error", "Info", result.message);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Failed", error.message);
      setLoading(false);
    }
  };
  // Assign Leave Types
  const getIDbasedleaveType = async () => {
    try {
      const result = await action(API.GET_LEAVE_TYPES_ID_BASED_RECORDS, {
        id: updateId,
      });
      console.log("Id", result);

      formik.setFieldValue("leaveType", result.result?.leaveType);
      formik.setFieldValue("leaveCount", result.result?.leaveCount);
      formik.setFieldValue("description", result.result?.description);
      formik.setFieldValue("maxLeaveLimit", result.result?.maxLeaveLimit);
      formik.setFieldValue("leaveLimitPer", result.result?.leaveLimitPer);
      formik.setFieldValue(
        "isRestrictedHoliday",
        result.result?.isRestrictedHoliday
      );
      formik.setFieldValue(
        "unusedLeaveRule",
        result.result.unusedLeaveRule.unusedleaveRuleType
      );
      formik.setFieldValue("maxlimit", result.result?.maxlimit);
      formik.setFieldValue(
        "encashmentLimit",
        result.result.unusedLeaveRule?.rule?.limit
      );
      formik.setFieldValue(
        "encashmentRule",
        result.result.unusedLeaveRule?.rule?.calculation?.salaryComponent
      );
      formik.setFieldValue(
        "days",
        result.result.unusedLeaveRule?.rule?.calculation.days
      );
      formik.setFieldValue("isProrata", parseInt(result.result?.isProrata));
      formik.setFieldValue(
        "isProrataProbationIncluded",
        result.result?.isProrataProbationIncluded
      );
      formik.setFieldValue("leaveDays", result.result?.leaveDaysType);
      formik.setFieldValue(
        "isAnnualleave",
        parseInt(result.result.isAnnualleave)
      );

      formik.setFieldValue(
        `defaulPercentage`,
        result.result.leavePayRate.default.calculation.percentage
      );
      formik.setFieldValue(
        "defaulPayType",
        result.result.leavePayRate.default.payType
      );
      formik.setFieldValue(
        `defaultSalaryComponent`,
        result.result.leavePayRate.default.calculation.salaryComponent
      );
      formik.setFieldValue(
        `defaultDays`,
        result.result.leavePayRate.default.calculation.days
      );
      if (result.result.leavePayRate.conditional.length > 0) {
        setConditionalPay(true);
        formik.setFieldValue("conditionalPay", 1);
      }

      result.result.leavePayRate.conditional?.map((data, index) =>
        Object.keys(data).map((item) =>
          formik.setFieldValue(item + index, data[item])
        )
      );

      result.result.leavePayRate.conditional?.map((data, index) =>
        Object.keys(data.calculation).map((item) =>
          formik.setFieldValue(item + index, data.calculation[item])
        )
      );
      setConditionalPayRate(
        result.result.leavePayRate.conditional?.map((data, i) => ({
          id: i,
          field: [
            {
              title: "If the employee’s leave allowance used is:",
              inputType: Object.keys(data)[0] + i,
              type: "radioBtn",
              option: "",
              supInputOne: [
                {
                  title: "From",
                  inputType: Object.keys(data)[1] + i,
                  type: "input",
                },
                {
                  title: "To",
                  inputType: Object.keys(data)[2] + i,
                  type: "input",
                },
              ],
              supInputTwo: [
                {
                  title: "",
                  inputType: Object.keys(data)[1] + i,
                  type: "input",
                },
              ],
              supInputThree: [
                {
                  title: "",
                  inputType: Object.keys(data)[1] + i,
                  type: "input",
                },
              ],
            },
            {
              title: "Pay rate for this policy?",
              inputType: Object.keys(data)[3] + i,
              type: "choose",
              supInputTwo: [
                {
                  title: "Pay Calculation",
                  inputType: Object.keys(data.calculation)[2] + i,
                  type: "dropdown",
                  option: Paycalculation,
                },
                {
                  title: "Days",
                  inputType: Object.keys(data.calculation)[1] + i,
                  type: "dropdown",
                  option: DaysDivider,
                },
              ],
              supInputThree: [
                {
                  title: "Percentage Paid",
                  inputType: Object.keys(data.calculation)[2] + i,
                  type: "input",
                },
                {
                  title: "Pay Calculation",
                  inputType: Object.keys(data.calculation)[0] + i,
                  type: "dropdown",
                  option: Paycalculation,
                },
                {
                  title: "Days",
                  inputType: Object.keys(data.calculation)[1] + i,
                  type: "dropdown",
                  option: DaysDivider,
                },
              ],
            },
          ],
        }))
      );

      // );

      setEmployeeList(result.result?.LeaveTypeApplicable?.employeeIds || []);
      setDepartmentList(
        result.result?.LeaveTypeApplicable?.departmentIds || []
      );
      setLocationList(result.result?.LeaveTypeApplicable?.locationIds || []);

      setLeaveCountList(
        result.result?.LeaveTypeApplicable?.leaveCountDatas || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const UpdateAssignEmployee = async () => {
    setLoading(true);
    try {
      const result = await action(API.UPDATE_ASSIGN_EMPLOYEE_LEAVE_TYPES, {
        leaveTypeId: updateId,
        companyId: companyId,
        employeeId:
          employeeCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        departmentId:
          departmentCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        locationId:
          locationCheckList
            ?.map((each) => each.assign && each.id)
            .filter((data) => parseInt(data)) || [],
        leaveCount:
          employeeCheckList
            ?.map((each) => each.assign && each[`${"leaveCount" + each.id}`])
            .filter((data) => parseInt(data)) || [],
        createdBy: employeeId,
      });
      console.log(result);
      if (result.status === 200) {
        openNotification("success", "Successfully", result.message, () => {
          setShow(false);
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
      console.log(result);
    } catch (error) {
      openNotification("error", "Failed", error.code);
      setLoading(false);
      console.log(error);
    }
  };

  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Leave_Type"),
      data: "LeaveType",
    },

    {
      id: 2,
      value: 1,
      title: t("Configuration"),
      data: "Configuration",
    },
    {
      id: 3,
      value: 2,
      title: t("Applicability"),
      data: "Applicability",
    },
  ]);

  const handleLeaveTemplateAction = (action) => {
    switch (action) {
      case "Configuration":
        handleCardClick("Start from scratch");
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (updateId) {
      getIDbasedleaveType();
    }
  }, [updateId]);

  const handleCardClick = (selectedCard) => {
    // Your logic...
    switch (selectedCard) {
      default:
        break;
      case "Start from Template":
        handleShow();
        setOpenPop("leaveTemplate");
        setShowPop(true);
        break;

      case "Start from scratch":
        setPresentage(1);

        switch (activeBtnValue) {
          case "LeaveType":
            setNextStep(nextStep + 1);
            break;

          case "Configuration":
            if (!leaveTypeId && !updateId) {
              formik.handleSubmit();
            }
            break;

          case "Applicability":
            assignPolicy();
            break;
          default:
            break;
        }
        break;
    }
  };

  useEffect(() => {
    if (openPolicy === "Configuration") {
      handleLeaveTemplateAction("Configuration");

      console.log("Display create policy content");
    }
  }, [openPop]);

  return (
    <div className="container_align">
      <DrawerPop
        placement="bottom"
        initialBtn={nextStep === 0 ? false : true}
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
          // background:"#F8FAFC"
        }}
        background="#F8FAFC"
        open={show}
        close={(e) => {
          // console.log(e);
          formik.resetForm();
          handleClose();
        }}
        header={[
          !updateId ? t("Create_Leave_Type") : t("Update Employee Leave Types"),
          !updateId
            ? t("Complete_Leave_Type_in_few_steps")
            : t("Update Employee Leave Type in few steps"),
        ]}
        headerRight={
          <div className="flex items-center gap-10">
            <p className="text-sm font-medium text-gray-400">
              Draft Saved 10 Seconds ago
            </p>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-medium text-gray-400">{t("Help")}</p>
              <RxQuestionMarkCircled className="text-2xl font-medium text-gray-400 " />
            </div>
          </div>
        }
        footerBtn={[t("Cancel")]}
        footerBtnDisabled={loading}
        className="widthFull"
        stepsData={steps}
        //
        buttonClick={(e) => {
          switch (activeBtnValue) {
            case "LeaveType":
              setNextStep(nextStep + 1);
              break;

            case "Configuration":
              formik.handleSubmit();
              break;
            case "Applicability":
              if (!updateId) {
                assignPolicy();
              } else {
                UpdateAssignEmployee();
              }
              break;
            default:
              openNotification(
                "error",
                "Please choose a card..",
                "Please select a card before moving to the next step."
              );
              break;
          }
        }}
        buttonClickCancel={(e) => {
          if (activeBtn > 0) {
            setActiveBtn(activeBtn - 1);
            setNextStep(nextStep - 1);
            setActiveBtnValue(steps?.[activeBtn - 1].data);
            console.log(activeBtn - 1);
            setPresentage(presentage - 0.9);
          }
          if (activeBtnValue === "Configuration" && !updateId) {
            formik.resetForm();
          }
        }}
        nextStep={nextStep}
        activeBtn={activeBtn}
        saveAndContinue={true}
      >
        <div className=" max-w-[843px] mx-auto">
          <div className="flex flex-col gap-6">
            {steps && (
              <div className=" sticky -top-6 w-full z-50 px-5  dark:text-white pb-10 ">
                <Stepper
                  currentStepNumber={activeBtn}
                  presentage={presentage}
                  steps={steps}
                />
              </div>
            )}
          </div>

          <div className="w-full mt-6">
            {
              activeBtnValue === "LeaveType" ? (
                <div className="w-full vhcenter rounded-lg dark:bg-dark">
                  <div className="flex flex-col gap-6 pt-4 items-start">
                    <Heading2
                      className={"items-start"}
                      title={t("Choose Configuration")}
                      description={t("Create_Leave_Type_Description")}
                    />

                    <div class="flex flex-col md:flex-row gap-6">
                      <div
                        className="p-1 rounded-[20px] border border-black/5 group hover:border-primaryalpha/20 cursor-pointer transition-all duration-300 hover:shadow-[0px_15px_31px_0px] hover:shadow-primaryalpha/[0.07]"
                        onClick={() => handleCardClick("Start from scratch")}
                      >
                        <div
                          className="w-full sm:w-[340px] h-[273px] rounded-2xl border border-black/10 dark:border-black/90 group-hover:border-primaryalpha/90 transition-all duration-300 vhcenter"
                          style={{
                            background: `linear-gradient(180deg,  ${
                              themeMode === "dark"
                                ? "rgb(76 76 76)"
                                : lighterColor
                            } 0%, rgba(255, 255, 255, 0.00) 100%)`,
                          }}
                        >
                          <div className="flex flex-col justify-center items-center gap-3">
                            <div className="">
                              <img alt="example" src={image} />
                            </div>
                            <div className="text-center">
                              <p className="h3">{t("Start_from_scratch")}</p>
                              <p className="para !font-medium px-5">
                                {t("Start_from_scratch_Description")}
                              </p>
                            </div>
                            <PiArrowRight size={20} className="text-primary" />
                          </div>
                        </div>
                      </div>
                      <div
                        className="p-1 rounded-[20px] border border-black/5 group hover:border-primaryalpha/20 cursor-pointer hover:shadow-[0px_15px_31px_0px] hover:shadow-primaryalpha/[0.07] transition-all duration-300"
                        onClick={() => handleCardClick("Start from Template")}
                      >
                        <div
                          className="w-full sm:w-[340px] h-[273px] rounded-2xl border border-black/10 group-hover:border-primaryalpha/90 transition-all duration-300 vhcenter dark:border-black/90 "
                          style={{
                            background: `linear-gradient(180deg,  ${
                              themeMode === "dark"
                                ? "rgb(76 76 76)"
                                : lighterColor
                            } 0%, rgba(255, 255, 255, 0.00) 100%)`,
                          }}
                        >
                          <div className="flex flex-col justify-center items-center gap-3">
                            <div className="">
                              <img alt="example" src={image1} />
                            </div>
                            <div className="text-center">
                              <p className="h3">{t("Start_from_Template")}</p>
                              <p className="para !font-medium px-5">
                                {t("Start_from_Template_Description")}
                              </p>
                            </div>
                            <PiArrowRight size={20} className="text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeBtnValue === "Configuration" ? (
                <div className="mt-6 flex flex-col w-full gap-6 ">
                  <FlexCol className="borderb p-4 rounded-md bg-white dark:bg-dark w-full">
                    <Heading
                      className={""}
                      title={
                        updateId
                          ? t("Update Employee Leave Types")
                          : t("Create_Leave_Type")
                      }
                      description={t("Create_Leave_Type_Description")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        Id={"5"}
                        title={t("LeaveType")}
                        placeholder={t("LeaveType")}
                        required={true}
                        change={(e) => {
                          formik.setFieldValue("leaveType", e);
                          if (presentage < 1.1) setPresentage(presentage + 0.1);
                        }}
                        value={formik.values.leaveType}
                        error={
                          formik.values.leaveType ? "" : formik.errors.leaveType
                        }
                        // autoFocus={true}
                      />
                      <FormInput
                        type={"text"}
                        pattern="[0-9]*"
                        inputmode="numeric"
                        title={t("Leave_Count")}
                        placeholder={t("Leave_Count")}
                        required={true}
                        change={(e) => {
                          if (/^\d*\.?\d*$/.test(e)) {
                            if (e) {
                              const numericValue = e.replace(/\D/g, ""); // Remove non-numeric characters

                              if (numericValue.length <= 3) {
                                // Only allow 3 digits
                                formik.setFieldValue(
                                  "leaveCount",
                                  numericValue.toString()
                                );
                              }
                            } else if (e === "") {
                              formik.setFieldValue("leaveCount", null);
                            }
                          }
                          if (presentage < 1.2) setPresentage(presentage + 0.1);
                          formik.setFieldValue("maxLeaveLimit", "");
                        }}
                        value={
                          isNaN(formik.values.leaveCount)
                            ? ""
                            : formik.values.leaveCount
                        }
                        error={formik.errors.leaveCount}
                      />

                      <TextArea
                        className=" col-span-2"
                        title={t("Description")}
                        placeholder={t("Description")}
                        required={true}
                        change={(e) => {
                          formik.setFieldValue("description", e);
                          if (presentage < 1.3) setPresentage(presentage + 0.1);
                        }}
                        value={formik.values.description}
                        error={
                          formik.values.description
                            ? ""
                            : formik.errors.description
                        }
                      />

                      <FormInput
                        title={t("Max_Leave_Limit")}
                        placeholder={t("Set_Limit")}
                        type={"string"}
                        pattern="[0-9]*"
                        inputmode="numeric"
                        required={true}
                        change={(e) => {
                          if (
                            parseFloat(e) <=
                            parseFloat(formik.values.leaveCount)
                          ) {
                            if (/^\d*\.?\d*$/.test(e))
                              if (e.includes(".")) {
                                let parts = e.split(".");
                                if (parts[1].length > 2) {
                                  let col = `${parts[0]}.${parts[1].slice(
                                    0,
                                    2
                                  )}`;
                                  console.log(col);
                                }
                              }
                            const parts = e.split(".");

                            if (parts.length > 1) {
                              e = parts[0] + "." + parts.slice(1).join("");
                            }
                            if (parts[1] && parts[1].length > 1) {
                              e = parts[0] + "." + parts[1].slice(0, 1);
                            }

                            e = e.replace(/[^0-9.]/g, "");
                            console.log(e);
                            formik.setFieldValue("maxLeaveLimit", e);
                          } else if (e === "") {
                            formik.setFieldValue("maxLeaveLimit", e);
                          }
                          if (presentage < 1.4) setPresentage(presentage + 0.1);
                        }}
                        value={formik.values.maxLeaveLimit}
                        error={formik.errors.maxLeaveLimit}
                      />

                      <Dropdown
                        title={t("Leave_Limit_Per")}
                        placeholder={t("Choose_limit_type")}
                        required={true}
                        change={(e) => {
                          console.log(e);
                          formik.setFieldValue("leaveLimitPer", e);

                          if (presentage < 1.5) setPresentage(presentage + 0.1);
                        }}
                        value={formik.values.leaveLimitPer}
                        error={formik.errors.leaveLimitPer}
                        options={leavelimitPer}
                      />

                      <Dropdown
                        title={t("Unused_Leave_Rule")}
                        placeholder={t("Choose_Rule")}
                        required={true}
                        change={(e) => {
                          console.log(e);
                          formik.setFieldValue("unusedLeaveRule", e);
                          if (presentage < 1.6) {
                            setPresentage(presentage + 0.1);
                          }
                        }}
                        value={formik.values.unusedLeaveRule}
                        error={formik.errors.unusedLeaveRule}
                        options={unusedLeaveRule}
                        icondropDown={true}
                        className="drop_down col-span-1"
                      />

                      {formik.values.unusedLeaveRule === "Carry Forward" ? (
                        <FormInput
                          title={t("Carry_Forward_Limit")}
                          placeholder={t("Carry_Forward_Limit")}
                          type={"string"}
                          pattern="[0-9]*\.?[0-9]{0,2}"
                          inputmode="numeric"
                          change={(e) => {
                            if (
                              parseFloat(e) <=
                              parseFloat(formik.values.maxLeaveLimit) // parseInt
                            ) {
                              if (/^\d*\.?\d{0,2}$/.test(e))
                                formik.setFieldValue("encashmentLimit", e);
                            } else if (e === "") {
                              formik.setFieldValue("encashmentLimit", e);
                            }
                            if (
                              parseFloat(e) >
                              parseFloat(formik.values.maxLeaveLimit)
                            ) {
                              formik.setFieldError(
                                "encashmentLimit",
                                "Carry Forward Limit must be less than or equal to the maximum limit."
                              );
                            } else {
                              formik.setFieldError("encashmentLimit", "");
                            }
                            if (presentage < 1.6) {
                              setPresentage(presentage + 0.1);
                            }
                          }}
                          value={formik.values.encashmentLimit}
                          error={formik.errors.encashmentLimit}
                        />
                      ) : (
                        formik.values.unusedLeaveRule === "Encash" && (
                          <>
                            <FormInput
                              title="Encashment Limit"
                              placeholder="Encashment Limit"
                              change={(e) => {
                                if (
                                  parseFloat(e) <=
                                  parseFloat(formik.values.leaveCount)
                                ) {
                                  if (/^\d*\.?\d{0,2}$/.test(e))
                                    // /^\d+$/g
                                    formik.setFieldValue("encashmentLimit", e);
                                } else if (e === "") {
                                  formik.setFieldValue("encashmentLimit", "");
                                }
                              }}
                              value={formik.values.encashmentLimit}
                            />
                            <div className=" grid grid-cols-6 items-center gap-2">
                              <Dropdown
                                title="Encashment Rule"
                                placeholder="Encashment Rule"
                                change={(e) => {
                                  formik.setFieldValue("encashmentRule", e);
                                  formik.setFieldValue("days", null);
                                }}
                                value={formik.values.encashmentRule}
                                options={Paycalculation}
                                className="col-span-5"
                              />
                            </div>
                            <Dropdown
                              title="Days"
                              placeholder="Days"
                              type="number"
                              change={(e) => {
                                formik.setFieldValue("days", e);
                              }}
                              value={formik.values.days || null}
                              options={DaysDivider}
                            />
                          </>
                        )
                      )}
                      <div className="flex justify-start items-center">
                        <CheckBoxInput
                          titleRight={t("Restricted Holiday")}
                          change={(e) => {
                            formik.setFieldValue("isRestrictedHoliday", e);

                            if (presentage < 1.5)
                              setPresentage(presentage + 0.1);
                          }}
                          value={formik.values.isRestrictedHoliday}
                          error={formik.errors.isRestrictedHoliday}
                        />
                      </div>
                    </div>
                  </FlexCol>

                  <div className=" borderb bg-white dark:bg-dark p-4  flex flex-row justify-start items-center gap-4  border-black/10 border rounded-[10px]">
                    <div className="">
                      <LeaveTypeSVG />
                    </div>

                    <div className="flex flex-col justify-start gap-5 w-full px-4">
                      <Flex justify="start">
                        <CheckBoxInput
                          titleRight={t("Prorate Accural")}
                          value={formik.values.isProrata} //isCheckboxActive
                          change={(e) => {
                            formik.setFieldValue("isProrata", e);
                          }}
                        />
                      </Flex>
                      <div
                        id="Job"
                        className="text-xs font-medium leading-[18px] text-[#667085] w-full"
                      >
                        {t(
                          "Prorate accrual is about adjusting that earned time off based on when you start or stop working during a month."
                        )}
                      </div>

                      <div className="flex flex-row items-start gap-3">
                        <div id="ToggleBase">
                          <ToggleBtn
                            titleRight={t("Applicable_to_Probationers")}
                            value={parseInt(
                              formik.values.isProrataProbationIncluded
                            )}
                            change={(e) => {
                              console.log(e, "here is i");
                              formik.setFieldValue(
                                "isProrataProbationIncluded",
                                e
                              );
                            }}
                            className="font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Accordion
                    title={t("Leave_Allowance")}
                    className="Text_area bg-white dark:bg-dark"
                    padding={false}
                    toggleBtn={false}
                    initialExpanded={true}
                    click={() => {
                      setPresentage(1.4);
                    }}
                    primarybg={false}
                  >
                    <div class="Container_padding self-stretch rounded-2xl flex-col justify-center  items-start gap-5 flex">
                      <div class="relative">
                        <div class="h3  flex">
                          {t("Which_days_to_consider_as_a_leave_days")}
                          <FaAsterisk className="text-[6px] text-rose-600 mt-2 ml-1" />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div class="justify-start items-start gap-4 inline-flex mt-3">
                            <div
                              className="relative px-2.5 py-[2px]  rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                              onClick={() => {
                                formik.setFieldValue(
                                  "leaveDays",
                                  "calendarDays"
                                );
                              }} // Add your onClick handler
                            >
                              {formik.values.leaveDays === "calendarDays" && (
                                <TiTick className=" text-primary" />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  formik.values.leaveDays === "calendarDays" &&
                                  "text-primary"
                                }`}
                              >
                                {t("Calendar_Days")}
                              </span>
                            </div>

                            <div
                              className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer  dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                              onClick={() => {
                                formik.setFieldValue(
                                  "leaveDays",
                                  "workingDays"
                                );
                              }} // Add your onClick handler
                            >
                              {formik.values.leaveDays === "workingDays" && (
                                <TiTick className=" text-primary" />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  formik.values.leaveDays === "workingDays" &&
                                  "text-primary"
                                }`}
                              >
                                {t("Working_Days")}
                              </span>
                            </div>
                          </div>
                          {formik.errors.leaveDays && (
                            <p className=" flex justify-start items-center mt-2 my-1 mb-0 text-[10px] text-red-600">
                              <span className="text-[10px] p-2">
                                {formik.errors.leaveDays}
                              </span>
                            </p>
                          )}

                          <div className="w-3/4 left-0 text-gray-500 text-[10px] 2xl:text-xs font-medium font-['Inter'] leading-none md:leading-[18px]">
                            <p>{t("Leave_Allowance_Desc")}</p>
                          </div>
                        </div>
                      </div>
                      <div class="divider-h" />

                      <div class="flex flex-col justify-start items-start gap-4 ">
                        <div class="flex flex-col gap-4">
                          <div class=" h3  flex">
                            {t("Is_this_a_recurring_policy")}
                            <FaAsterisk className="text-[6px] text-rose-600 mt-2 ml-1" />
                          </div>
                          <div class="flex justify-start items-start gap-4 ">
                            <div
                              className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                              onClick={() => {
                                formik.setFieldValue("isAnnualleave", 1);
                              }}
                            >
                              {formik.values.isAnnualleave === 1 && (
                                <TiTick className=" text-primary" />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  formik.values.isAnnualleave === 1 &&
                                  "text-primary"
                                }`}
                              >
                                {t("Annually_Recurring")}
                              </span>
                            </div>
                            <div
                              className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                              onClick={() => {
                                formik.setFieldValue("isAnnualleave", 0);
                              }} // Add your onClick handler
                            >
                              {formik.values.isAnnualleave === 0 && (
                                <TiTick className=" text-primary" />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  formik.values.isAnnualleave === 0 &&
                                  "text-primary"
                                }`}
                              >
                                {t("One_time_only")}
                              </span>
                            </div>
                          </div>
                          {formik.errors.isAnnualleave && (
                            <p className=" flex justify-start items-center mt-2 my-1 mb-0 text-[10px] text-red-600">
                              <span className="text-[10px] p-2">
                                {formik.errors.isAnnualleave}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  <div className=".Container_padding">
                    <Accordion
                      title={t("Leave_Pay_Rate")}
                      padding={false}
                      toggleBtn={false}
                      initialExpanded={true}
                      click={() => {
                        setPresentage(1.4);
                      }}
                      className="Text_area bg-white dark:bg-dark"
                      primarybg={false}
                    >
                      <FlexCol className={"p-4"}>
                        <div class="flex gap-4 items-center ">
                          <ToggleBtn
                            change={(e) => {
                              console.log(e, "e");
                              formik.setFieldValue(
                                "conditionalPay",
                                e === 1 ? true : false
                              );
                            }}
                            value={formik.values.conditionalPay}
                          />
                          <div
                            id="Text1"
                            className="text-sm font-medium leading-[20px]"
                          >
                            {t(
                              "Set_conditional_pay_rate_based_on_employees_leave_allowance_used"
                            )}
                          </div>
                        </div>

                        {formik.values.conditionalPay && (
                          <>
                            {conditionalPayRate.map((item, i) => (
                              <div
                                className="rounded-lg borderb px-4 py-6 bg-[#FBFBFB] dark:bg-secondaryDark flex flex-col gap-6 w-full"
                                key={i}
                              >
                                {item.field.map((each, i) => (
                                  <div
                                    key={i}
                                    className="w-full  flex flex-col justify-center items-start gap-4"
                                  >
                                    {each.type === "radioBtn" ? (
                                      <>
                                        <RadioButton
                                          options={LeaveType}
                                          change={(e) => {
                                            formik.setFieldValue(
                                              each.inputType,
                                              e
                                            );
                                          }}
                                          value={formik.values[each.inputType]}
                                        />
                                        <div class="justify-center items-center gap-3 inline-flex">
                                          {formik.values[each.inputType] ===
                                            "between" && (
                                            <div className="flex gap-4 items-center">
                                              <p className=" ">
                                                {t("Leave_used_Between")}
                                              </p>
                                              <div className=" flex gap-2 items-center justify-start">
                                                {each.supInputOne.map(
                                                  (item, i) => (
                                                    <FormInput
                                                      change={(e) => {
                                                        const value = e.replace(
                                                          /[^0-9.]/g,
                                                          ""
                                                        );
                                                        if (!isNaN(value)) {
                                                          formik.setFieldValue(
                                                            item.inputType,
                                                            value
                                                          );
                                                        }
                                                      }}
                                                      value={
                                                        formik.values[
                                                          item.inputType
                                                        ]
                                                      }
                                                      placeholder={t("Days")}
                                                      error={
                                                        formik.errors[
                                                          item.inputType
                                                        ]
                                                      }
                                                    />
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {formik.values[each.inputType] ===
                                            "greaterThanOrEqualTo" && (
                                            <div className="flex gap-4 items-center">
                                              <p>
                                                {t(
                                                  "Leave_used_Greater_than_or_equal_to"
                                                )}
                                              </p>
                                              {each.supInputTwo.map((item) => (
                                                <FormInput
                                                  change={(e) => {
                                                    const value = e.replace(
                                                      /[^0-9.]/g,
                                                      ""
                                                    );
                                                    if (!isNaN(value)) {
                                                      formik.setFieldValue(
                                                        item.inputType,
                                                        value
                                                      );
                                                    }
                                                  }}
                                                  value={
                                                    formik.values[
                                                      item.inputType
                                                    ]
                                                  }
                                                  placeholder={t("Days")}
                                                />
                                              ))}
                                            </div>
                                          )}

                                          {formik.values[each.inputType] ===
                                            "lessThan" && (
                                            <div className="flex gap-4 items-center">
                                              <p>{t("Leave_used_Less_than")}</p>
                                              {each.supInputTwo.map((item) => (
                                                <div className="flex items-center gap-2">
                                                  <FormInput
                                                    change={(e) => {
                                                      const value = e.replace(
                                                        /[^0-9.]/g,
                                                        ""
                                                      );
                                                      if (!isNaN(value)) {
                                                        formik.setFieldValue(
                                                          item.inputType,
                                                          value
                                                        );
                                                      }
                                                    }}
                                                    value={
                                                      formik.values[
                                                        item.inputType
                                                      ]
                                                    }
                                                    placeholder={t("Days")}
                                                  />
                                                  <Tooltip
                                                    color="#beb0fa"
                                                    title={`Considered when Leave taken count till ${
                                                      formik.values[
                                                        item.inputType
                                                      ]
                                                        ? formik.values[
                                                            item.inputType
                                                          ] - 1
                                                        : 0
                                                    } days `}
                                                  >
                                                    <LuInfo className="text-md" />
                                                  </Tooltip>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <div className="divider-h" />
                                      </>
                                    ) : (
                                      <FlexCol>
                                        <p className="font-medium text-sm">
                                          Pay rate for this policy?
                                        </p>
                                        <div class="flex gap-4">
                                          <div
                                            className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer  dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                                            onClick={(e) => {
                                              formik.setFieldValue(
                                                each.inputType,
                                                "paid"
                                              );
                                            }} // Add your onClick handler
                                          >
                                            {formik.values[each.inputType] ===
                                              "paid" && (
                                              <TiTick className=" text-primary" />
                                            )}
                                            <span
                                              className={`text-xs font-medium ${
                                                formik.values[
                                                  each.inputType
                                                ] === "paid" && "text-primary"
                                              }`}
                                            >
                                              {t("Paid_Leave")}
                                            </span>
                                          </div>
                                          <div
                                            className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                                            onClick={() => {
                                              formik.setFieldValue(
                                                each.inputType,
                                                "unpaid"
                                              );
                                            }} // Add your onClick handler
                                          >
                                            {formik.values[each.inputType] ===
                                              "unpaid" && (
                                              <TiTick className=" text-primary" />
                                            )}
                                            <span
                                              className={`text-xs font-medium ${
                                                formik.values[
                                                  each.inputType
                                                ] === "unpaid" && "text-primary"
                                              }`}
                                            >
                                              {t("Unpaid_Leave")}
                                            </span>
                                          </div>
                                          <div
                                            className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                                            onClick={() =>
                                              formik.setFieldValue(
                                                each.inputType,
                                                "partiallyPaid"
                                              )
                                            } // Add your onClick handler
                                          >
                                            {formik.values[each.inputType] ===
                                              "partiallyPaid" && (
                                              <TiTick className=" text-primary" />
                                            )}
                                            <span
                                              className={`text-xs font-medium ${
                                                formik.values[
                                                  each.inputType
                                                ] === "partiallyPaid" &&
                                                "text-primary"
                                              }`}
                                            >
                                              {t("Partially_Paid_Leave")}
                                            </span>
                                          </div>
                                        </div>
                                        {formik.values[each.inputType] ===
                                          "partiallyPaid" && (
                                          <div class="grid grid-cols-3 gap-4 ">
                                            {each.supInputThree.map((item) => (
                                              <div className=" ">
                                                {item.type === "input" ? (
                                                  <FormInput
                                                    type={"string"}
                                                    pattern="[0-9]*"
                                                    inputmode="numeric"
                                                    title={item.title}
                                                    placeholder={t(
                                                      "Percentage"
                                                    )}
                                                    change={(e) => {
                                                      formik.setFieldValue(
                                                        item.inputType,
                                                        e
                                                      );
                                                    }}
                                                    value={
                                                      formik.values[
                                                        item.inputType
                                                      ]
                                                    }
                                                  />
                                                ) : (
                                                  <Dropdown
                                                    title={item.title}
                                                    placeholder={t(
                                                      "select_pay_type"
                                                    )}
                                                    options={item.option}
                                                    change={(e) => {
                                                      formik.setFieldValue(
                                                        item.inputType,
                                                        e
                                                      );
                                                    }}
                                                    value={
                                                      formik.values[
                                                        item.inputType
                                                      ]
                                                    }
                                                    className=" col-span-2"
                                                  />
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {formik.values[each.inputType] ===
                                          "unpaid" && (
                                          <div class="grid grid-cols-2 gap-4 items-center">
                                            {each.supInputTwo.map((item) => (
                                              <Dropdown
                                                title={item.title}
                                                placeholder={t(
                                                  "select_pay_type"
                                                )}
                                                options={item.option}
                                                change={(e) => {
                                                  formik.setFieldValue(
                                                    item.inputType,
                                                    e
                                                  );
                                                }}
                                                value={
                                                  formik.values[item.inputType]
                                                }
                                              />
                                            ))}
                                          </div>
                                        )}
                                      </FlexCol>
                                    )}
                                  </div>
                                ))}

                                {i !== 0 && (
                                  <Tooltip placement="top" title={"Delete"}>
                                    <div className="flex items-center gap-1 md:gap-2 borderb p-2 w-fit h-fit rounded-[5px] cursor-pointer hover:border-primary transform duration-300">
                                      <div
                                        className="text-red-600"
                                        onClick={() => {
                                          console.log("delete");
                                          const newConditionalPayRate = [
                                            ...conditionalPayRate,
                                          ];
                                          newConditionalPayRate.splice(i, 1);

                                          // Update the state with the new array
                                          setConditionalPayRate(
                                            newConditionalPayRate
                                          );
                                          console.log(conditionalPayRate);
                                        }}
                                      >
                                        <PiTrash className="w-[15px] h-[15px] 2xl:w-[18px] 2xl:h-[18px]" />
                                      </div>
                                      <div className="text-grey text-xs 2xl:text-sm font-semibold">
                                        Remove Condition
                                      </div>
                                    </div>
                                  </Tooltip>
                                )}
                              </div>
                            ))}

                            <div class="">
                              {isAddingCondition ? (
                                <Button onClick={handleAddAnotherCondition}>
                                  <div class="flex gap-4 items-center">
                                    <IoAdd />
                                    {t("Add_Another_Condition")}
                                  </div>
                                </Button>
                              ) : (
                                <Button
                                  onClick={handleDeleteCondition}
                                  type="primary"
                                  danger
                                  ghost
                                >
                                  <div class="flex gap-4 items-center">
                                    <MdOutlineDeleteForever />
                                    {t("Delete_Condition")}
                                  </div>
                                </Button>
                              )}
                            </div>
                          </>
                        )}

                        <div class=" self-stretch  px-4 py-6 rounded-lg border border-black border-opacity-5 flex-col items-start gap-4 flex">
                          <div
                            id="Text1"
                            className="flex text-sm font-medium leading-[20px] "
                          >
                            {t(
                              "What_is_the_default_leave_pay_rate_for_this_policy"
                            )}
                            <FaAsterisk className="text-[6px] text-rose-600 mt-2 ml-1" />
                          </div>
                          <div className="w-[811px] text-gray-500 text-xs font-medium font-['Inter'] leading-[18px]">
                            <p>
                              {t(
                                "Set_a_default_rate_for_leaves_when_an_employee_does_not_match_any_pay_rate_condition"
                              )}
                            </p>
                          </div>

                          <FlexCol>
                            <div class="flex gap-4">
                              <div
                                className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "defaulPayType",
                                    "paidLeave"
                                  );
                                }} // Add your onClick handler
                              >
                                {formik.values.defaulPayType ===
                                  "paidLeave" && (
                                  <TiTick className=" text-primary" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    formik.values.defaulPayType ===
                                      "paidLeave" && "text-primary"
                                  }`}
                                >
                                  {t("Paid_Leave")}
                                </span>
                              </div>
                              <div
                                className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                                onClick={() =>
                                  formik.setFieldValue(
                                    "defaulPayType",
                                    "unpaid"
                                  )
                                } // Add your onClick handler
                              >
                                {formik.values.defaulPayType === "unpaid" && (
                                  <TiTick className=" text-primary" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    formik.values.defaulPayType === "unpaid" &&
                                    "text-primary"
                                  }`}
                                >
                                  {t("Unpaid_Leave")}
                                </span>
                              </div>
                              <div
                                className="relative px-2.5 py-[2px] rounded-full bg-[#F2F4F7] flex items-center justify-center gap-1.5 cursor-pointer dark:text-black text-xs lg:text-[10px] 2xl:text-xs"
                                onClick={() =>
                                  formik.setFieldValue(
                                    "defaulPayType",
                                    "partiallyPaid"
                                  )
                                } // Add your onClick handler
                              >
                                {formik.values.defaulPayType ===
                                  "partiallyPaid" && (
                                  <TiTick className=" text-primary" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    formik.values.defaulPayType ===
                                      "partiallyPaid" && "text-primary"
                                  }`}
                                >
                                  {t("Partially_Paid_Leave")}
                                </span>
                              </div>
                            </div>
                            {formik.errors.leaveDays && (
                              <p className=" flex justify-start items-center mt-2 my-1 mb-0 text-[10px] text-red-600">
                                <span className="text-[10px] p-2">
                                  {formik.errors.defaulPayType}
                                </span>
                              </p>
                            )}

                            {formik.values.defaulPayType ===
                              "partiallyPaid" && (
                              <div class="grid grid-cols-7 gap-4 items-center ">
                                <div className=" col-span-3">
                                  <FormInput
                                    title={t("Percentage Paid")}
                                    placeholder={t("Percentage")}
                                    type={"string"}
                                    pattern="[0-9]*"
                                    inputmode="numeric"
                                    change={(e) => {
                                      if (parseInt(e) < 100) {
                                        formik.setFieldValue(
                                          `defaulPercentage`,
                                          e
                                        );
                                      } else if (e === "") {
                                        formik.setFieldValue(
                                          `defaulPercentage`,
                                          ""
                                        );
                                      }
                                      if (presentage < 1.4)
                                        setPresentage(presentage + 0.1);
                                    }}
                                    value={formik.values.defaulPercentage}
                                  />
                                </div>
                                <Dropdown
                                  className=" col-span-2"
                                  title={t("Pay_Calculation")}
                                  placeholder={t("select_pay_type")}
                                  options={Paycalculation}
                                  change={(e) => {
                                    formik.setFieldValue(
                                      `defaultSalaryComponent`,
                                      e
                                    );
                                    if (presentage < 1.4)
                                      setPresentage(presentage + 0.1);
                                  }}
                                  value={formik.values.defaultSalaryComponent}
                                />
                                <Dropdown
                                  className=" col-span-2"
                                  title={t("Days")}
                                  placeholder={t("select Days")}
                                  options={DaysDivider}
                                  change={(e) => {
                                    formik.setFieldValue(`defaultDays`, e);
                                    if (presentage < 1.4)
                                      setPresentage(presentage + 0.1);
                                  }}
                                  value={formik.values.defaultDays}
                                />
                              </div>
                            )}

                            {formik.values.defaulPayType === "unpaid" && (
                              <div class="grid grid-cols-2 gap-4 items-center">
                                <Dropdown
                                  className=""
                                  title={t("Pay_Calculation")}
                                  placeholder={t("select_pay_type")}
                                  options={Paycalculation}
                                  change={(e) => {
                                    formik.setFieldValue(
                                      `defaultSalaryComponent`,
                                      e
                                    );
                                    if (presentage < 1.4)
                                      setPresentage(presentage + 0.1);
                                  }}
                                  value={formik.values.defaultSalaryComponent}
                                />
                                <Dropdown
                                  title={t("Days")}
                                  placeholder={t("Select_Days")}
                                  options={DaysDivider}
                                  change={(e) => {
                                    formik.setFieldValue(`defaultDays`, e);
                                    if (presentage < 1.4)
                                      setPresentage(presentage + 0.1);
                                  }}
                                  value={formik.values.defaultDays}
                                />
                              </div>
                            )}
                          </FlexCol>
                        </div>
                      </FlexCol>
                    </Accordion>
                  </div>
                </div>
              ) : activeBtnValue === "Applicability" ? (
                <EmployeeCheck
                  title="Applicability"
                  description="Assign Employees"
                  employee={employeeList}
                  department={departmentList}
                  location={locationList}
                  navigateBtn={navigateBtn}
                  assignData={(employee, department, location) => {
                    console.log(employee, department, location, "hhhhhh");
                    setEmployeeCheckList(employee);
                    setDepartmentCheckList(department);
                    setLocationCheckList(location);
                  }}
                  customField={[
                    {
                      title: "Leave Count",
                      inputField: "leaveCount",
                      type: "text",
                      value: formik.values.leaveCount,
                      maxLength: 3,
                    },
                  ]}
                  selectedCount={leaveCountList}
                />
              ) : null /* or any other fallback JSX */
            }
          </div>
        </div>
      </DrawerPop>
      {openPop === "leaveTemplate" && showPop && (
        <LeaveTemplate
          open={showPop}
          close={(e) => {
            setShowPop(e);
          }}
          updateId={updateId}
          onAction={handleLeaveTemplateAction}
          action={(e) => {
            handleLeaveTemplateAction();
          }}
        />
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  ConfigurationAction: state.layout.ConfigurationAction,
});

export default connect(mapStateToProps)(Add_leaveType);

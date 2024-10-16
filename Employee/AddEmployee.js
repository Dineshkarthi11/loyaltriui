import React, { useEffect, useMemo, useRef, useState } from "react";
import FormInput from "../common/FormInput";
import Dropdown from "../common/Dropdown";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import API, { action } from "../Api";
import DateSelect from "../common/DateSelect";
import TextArea from "../common/TextArea";
import { Flex, Popover, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { LuAlertCircle } from "react-icons/lu";
import RadioButton from "../common/RadioButton";
import CheckBoxInput from "../common/CheckBoxInput";
import { RxDotFilled } from "react-icons/rx";
import { HiPlus } from "react-icons/hi2";
import { IoMoon } from "react-icons/io5";
import { FiSun } from "react-icons/fi";
import { PiClockCountdownFill, PiTrash } from "react-icons/pi";
import { bloodGroup, moreAssetsList, moreDocumentList } from "../data";
import FlexCol from "../common/FlexCol";
import { useMediaQuery } from "react-responsive";
import Stepper from "../common/Stepper";
import ButtonClick from "../common/Button";
import { TbAlertCircleFilled } from "react-icons/tb";

// Image
import TravelLocation from "../../assets/images/leave/TravelLocation.svg";
import allCandidate from "../../assets/images/image 538.png";
import ToggleBtn from "../common/ToggleBtn";
import popupimg from "../../assets/images/Frame 427319308.png";
import DrawerPop from "../common/DrawerPop";
import PAYROLLAPI, { Payrollaction } from "../PayRollApi";
import Heading2 from "../common/Heading2";
import {
  fetchCompanyDetails,
  getCompanyList,
} from "../common/Functions/commonFunction";
import Accordion from "../common/Accordion";
import CascaderSelect from "../common/CascaderSelect";
import { useNotification } from "../../Context/Notifications/Notification";
import * as moment from "moment";
import FileUpload from "../common/FileUpload";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function AddEmployee({
  open = "",
  close = () => {},
  updateId = null,
  refresh = () => {},
  OpenQuickView,
}) {
  const { t } = useTranslation();
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  const [Pcity, setPCity] = useState([]);
  const [state, setState] = useState([]);
  const [Pstate, setPstate] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [shiftSchemeList, setShiftSchemeList] = useState([]);
  const [shiftSchemeContentList, setShiftSchemeContentList] = useState({});

  const [employee, setEmployee] = useState([]);
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [religion, setReligion] = useState([]);
  const [assetsTypes, setAssetsTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [overTimePolicy, setOverTimePolicy] = useState([]);
  const [timeOutPolicy, setTimeOutPolicy] = useState([]);
  const [shortTimePolicy, setShortTimePolicy] = useState([]);
  const [missPunchPolicy, setMissPunchPolicy] = useState([]);
  const [leavePolicyDetails, setLeavePolicyDetails] = useState([]);
  const [holidayPolicyDetails, setHolidayPolicyDetails] = useState([]);

  const [activeBtn, setActiveBtn] = useState(0);
  const [activeBtnValue, setActiveBtnValue] = useState("employeeDetails"); //employeeDetails//workDetails//assets_Docs//contact_Policy//addressDetails//

  const [presentage, setPresentage] = useState(0);
  const [sameDetails, setSameDetails] = useState(0);

  const [showHoliday, setShowHoliday] = useState();
  const [nextStep, setNextStep] = useState(0);
  const [addAdressstep, setAddAdressstep] = useState(true);
  const [organisationId, setOrganisationId] = useState(
    localStorageData.organisationId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [createdBy, setCreatedBy] = useState(localStorageData.employeeId);
  const [bankDetails, setBankdetails] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [grossSalary, setGrossSalary] = useState(0);
  const [dynamicData, setDynamicdata] = useState([]);
  const [initialUpdateORCreate, setInitialUpdateORCreate] = useState({
    step: "",
    insertedId: null,
  });

  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Employee_Details"),
      data: "employeeDetails",
    },
    {
      id: 2,
      value: 1,
      title: "Address Details ",
      data: "addressDetails",
    },
    {
      id: 3,
      value: 2,
      title: t("Work_Details"),
      data: "workDetails",
    },
    {
      id: 4,
      value: 3,
      title: t("Contract Policy"),
      data: "contact_Policy",
    },
    {
      id: 5,
      value: 4,
      title: t("Assets_Docs"),
      data: "assets_Docs",
    },
  ]);

  const [addMoreAssets, setAddMoreassets] = useState();
  const [addMoreDocuments, setAddMoreDocuments] = useState();

  const [allSelectLeavePresets, setAllSelectLeavePresets] = useState(false);
  const [allSelectHolidayPresets, setAllSelectHolidayPresets] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [salaryTemplateStatus, setSalaryTemplateStatus] = useState();

  // check scroll to top

  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);

  // Scroll to the appropriate div when activeBtnValue changes
  useEffect(() => {
    if (activeBtnValue === "employeeDetails" && div1Ref.current) {
      div1Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "addressDetails" && div2Ref.current) {
      div2Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "workDetails" && div3Ref.current) {
      div3Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "contact_Policy" && div4Ref.current) {
      div4Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "assets_Docs" && div5Ref.current) {
      div5Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeBtnValue]);
  // \\\\\\\\\\\\ scroll to top end \\\\\\\\\\\\\\\\\\\\\\\

  useEffect(() => {
    setCompanyId(localStorageData.companyId);
  }, []);

  const popverArray = [
    {
      id: 0,
      label: "Clock In  ",
      value: shiftSchemeContentList?.startTime,
      icon: <FiSun className=" text-base text-primary" />,
    },
    {
      id: 1,
      label: "Clock Out",
      value: shiftSchemeContentList?.endTime,
      icon: <IoMoon className=" text-base text-[#FFAD4D]" />,
    },
    {
      id: 2,
      label: "Break Time",
      value: shiftSchemeContentList?.breakDuration,
      icon: <PiClockCountdownFill className=" text-base text-[#1FA5FC]" />,
    },
  ];

  const [show, setShow] = useState(open);
  const [openLeave, setOpenLeave] = useState();
  const [isUpdate, setIsUpdate] = useState();
  const [holidays, setHolidays] = useState([]);
  const [leavetypes, setLeaveTypes] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState([]); //get leave type value
  const [holidayId, setHolidayId] = useState([]);
  const [salaryTemplateList, setSalaryTemplateList] = useState([]);
  const [approvalFlowData, setapprovalFlowData] = useState([]);
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
  const handleShow = () => {
    setOpenLeave(true);
  };

  const [employeeId, setEmployeeId] = useState();

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  // Notification End

  const Gender = [
    {
      id: 1,
      label: t("Male"),
      value: "male",
    },
    {
      id: 2,
      label: t("Female"),
      value: "female",
    },
    {
      id: 3,
      label: t("Others"),
      value: "others",
    },
  ];

  const handleToggleList = (id, checked) => {
    if (id === 0) {
    } else {
      setLeaveTypes((prevSwitches) =>
        prevSwitches?.map((sw) =>
          sw?.value === id ? { ...sw, select: checked } : sw
        )
      );
    }
  };
  const handleToggleHolidayList = (id, checked) => {
    if (id === 0) {
    } else {
      setHolidays((prevSwitches) =>
        prevSwitches?.map((sw) =>
          sw?.value === id ? { ...sw, select: checked } : sw
        )
      );
    }
  };

  const epfformat = (value) => {
    if (value == null) {
      return "";
    }

    // Remove any non-alphanumeric characters from the input
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Trim the value to a maximum of 12 characters to fit the required format
    const trimmedValue = cleanedValue.substring(0, 15);

    if (trimmedValue.length === 0) {
      // Return an empty string if the input is cleared
      return "";
    }

    // Define the segment lengths for the format AA/AAA/0000000/000
    const segmentLengths = [2, 3, 7, 3];

    // Create segments based on defined lengths
    let index = 0;
    const parts = segmentLengths.map((length) => {
      const segment = trimmedValue.substring(index, index + length);
      index += length;
      return segment;
    });

    // Add the remaining part if there are any characters left
    if (index < trimmedValue.length) {
      parts.push(trimmedValue.substring(index));
    }

    // Join parts with '/' and ensure it does not end with '/'
    const formatted = parts.filter((part) => part.length > 0).join("/");

    return formatted;
  };

  const esiformat = (value) => {
    if (value == null) {
      return "";
    }

    // Remove any non-alphanumeric characters from the input
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Trim the value to a maximum of 17 characters (2 + 2 + 6 + 3 + 4)
    const trimmedValue = cleanedValue.substring(0, 17);

    // Define the segment lengths for the format 00-00-000000-000-0000
    const segmentLengths = [2, 2, 6, 3, 4];

    // Create segments based on defined lengths
    let index = 0;
    const parts = segmentLengths.map((length) => {
      const segment = trimmedValue.substring(index, index + length);
      index += length;
      return segment;
    });

    // Join parts with '-' and ensure it does not end with '-'
    const formatted = parts.filter((part) => part.length > 0).join("-");

    return formatted;
  };

  // form for employee details
  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      nickName: "",
      email: "",
      mobile: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: null,
      religion: null,
      fatherOrHusbandName: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: yup.object().shape({
      firstName: yup
        .string()
        .matches(
          /^[A-Za-z ]*$/,
          "Numbers and special characters are not allowed"
        )
        .required("First Name is required"),
      lastName: yup
        .string()
        .matches(
          /^[A-Za-z ]*$/,
          "Numbers and special characters are not allowed"
        )
        .required("Last Name is required"),
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required")
        .test(
          "is-valid-email",
          "Please enter a valid email",
          (value) =>
            value &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)
        ),
      // mobile: yup.string()
      //   .required("Mobile Number is required")
      //   .test(
      //     "is-valid-length",
      //     "Mobile Number must be exactly 10 or 12 characters",
      //     (value) => value && (value.length === 10 || value.length === 12)
      //   ),
      mobile: yup
        .string()
        .min(10, "Mobile must be at least 10 characters")
        .max(15, "Mobile must be at most 15 characters")
        .required("Mobile Number is required"),
      gender: yup.string().required("Gender is required"),
      dateOfBirth: yup.string().required("Date of Birth is required"),
      bloodGroup: yup.string().required("Blood Group is required"),
      // religion: yup.string().required("Religion is required"),
    }),
    onSubmit: async (e) => {
      // //setLoading(true);
      if (updateId) {
        window.scrollTo(0, 0);
        setNextStep(nextStep + 1);
        setPresentage(0.9);
        // //setLoading(false)
      } else {
        if (employeeId) {
          await updateemployeeBasic(e);
        } else {
          await createEmployee(e);
        }
      }
    },
  });

  const createEmployee = async (e) => {
    try {
      const result = await action(API.ADD_EMPLOYEE, {
        companyId: companyId,
        firstName: e.firstName.charAt(0).toUpperCase() + e.firstName.slice(1),
        middleName: e.middleName,
        lastName: e.lastName,
        nickName: e.nickName,
        gender: e.gender,
        bloodGroup: e.bloodGroup,
        dateOfBirth: e.dateOfBirth,
        email: e.email,
        phone: e.mobile,
        religionId: e.religion,
        fatherOrHusbandName: e.fatherOrHusbandName,
      });

      if (result.status === 200) {
        setInitialUpdateORCreate({
          step: "basic",
          insertedId: result.result.insertedId,
        });

        setEmployeeId(result.result.insertedId);
        setNextStep(nextStep + 1);
        setPresentage(1);
        openNotification("success", "Successful", result.message);
      } else if (result.status === 500) {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error.code);
    }
  };

  // form for address  details
  const formik2 = useFormik({
    initialValues: {
      addressType: "",
      address: "",
      city: null,
      country: null,
      state: null,
      zipCode: "",
      PermanentAddress: "",
      PermanentCity: null,
      PermanentState: null,
      PermanentZipCode: "",
      PermanentCountry: null,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // addressType: yup.string().required("Address Type is Required"),
      address: yup.string().required("Address is required"),
      city: yup.string().required("City is required"),
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
      zipCode: yup
        .string()
        .required("Postal/ZIP code is required")
        .min(3, "Postal/ZIP code must be at least 3 characters")
        .max(6, "Postal/ZIP code must be at most 6 characters"),
      PermanentAddress: yup.string().required("Address is required"),
      PermanentCity: yup.string().required("City is required"),
      PermanentCountry: yup.string().required("Country is required"),
      PermanentState: yup.string().required("State is required"),
      PermanentZipCode: yup
        .string()
        .required("Postal/ZIP code is required")
        .min(3, "Postal/ZIP code must be at least 3 characters")
        .max(6, "Postal/ZIP code must be at most 6 characters"),
    }),
    onSubmit: async (e) => {
      // //setLoading(true)
      try {
        if (updateId) {
          setNextStep(nextStep + 1);
          setPresentage(1.9);
        } else {
          if (initialUpdateORCreate.step !== "address") {
            const result = await action(API.ADD_EMPLOYEE_ADDRESS, {
              employeeId: employeeId,
              address: e.address,
              cityId: e.city,
              countryId: e.country,
              stateId: e.state,
              zipCode: e.zipCode,
              PermanentAddress: e.PermanentAddress,
              PermanentCityId: e.PermanentCity,
              PermanentStateId: e.PermanentState,
              PermanentZipCode: e.PermanentZipCode,
              PermanentCountryId: e.PermanentCountry,
            });

            if (result.status === 200) {
              setInitialUpdateORCreate({
                step: "address",
                insertedId: result.result.insertedId,
              });
              formik3.setFieldValue("department", "");
              formik3.setFieldValue("category", "");
              formik3.setFieldValue("designation", "");
              formik3.setFieldValue("location", "");
              setNextStep(nextStep + 1);
              setPresentage(2);
              openNotification("success", "Successful", result.message);
              // //setLoading(false);
            } else {
              openNotification("error", "Info", result.message);
              // //setLoading(false)
            }
          } else if (
            initialUpdateORCreate.step === "address" &&
            initialUpdateORCreate.insertedId
          ) {
            updateemployeeBasic();
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        // //setLoading(false)
        return error;
      }
    },
  });

  // form for work details
  const formik3 = useFormik({
    initialValues: {
      company: null,
      designation: null,
      department: null,
      category: null,
      reports: null,
      dateOfJoin: null,
      location: null,
      shiftScheme: null,
      // workPolicy: "",
      // leavePolicy: "",
      // salaryPolicy: "",
      uannumber: "",
      pannumber: "",
      aadhaarnumber: "",
      aadhaarenrollmentnumber: "",
      pfnumber: "",
      PFeligible: null,
      ESIeligible: null,
      esinumber: "",
      PTeligible: null,
      LWFeligible: null,
      EPSeligible: null,
      pfjoindate: "",
      epsjoiningdate: "",
      epsexitdate: "",
      HPSeligible: null,
      statutoryStatus: "N",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      company: yup.string().required("Company is required"),
      designation: yup.string().required("Designation is required"),
      department: yup.string().required("Department is required"),
      category: yup.string().required("Category is required"),
      // reports: yup.string().required("Reports is required"),
      dateOfJoin: yup.string().required("Date of Join is required"),
      location: yup.string().required("Location is required"),
      // shiftScheme: yup.string().required("Shift Scheme is required"),

      // workPolicy: yup.string().required("Work Policy Mark is Required"),
      // leavePolicy: yup.string().required("Leave Policy is Required"),
      // salaryPolicy: yup.string().required("Salary Policy is Required"),
      aadhaarnumber: yup.string().when("statutoryStatus", (statutoryStatus) => {
        if (statutoryStatus[0] === "Y") {
          return yup
            .string()
            .length(12, "Aadhaar Number must be exactly 12 characters")
            .matches(
              /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
              "Invalid Aadhaar Number"
            )
            .required("Aadhaar Number required");
        } else {
          return yup.string().notRequired("");
        }
      }),

      pannumber: yup.string().when("statutoryStatus", (statutoryStatus) => {
        if (statutoryStatus[0] === "Y") {
          return yup
            .string()
            .length(10, "PAN Number must be exactly 10 characters")
            .matches(/[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}/, "Invalid PAN Number")
            .required("PAN Number required");
        } else {
          return yup.string().notRequired("");
        }
      }),
    }),
    onSubmit: async (e) => {
      //setLoading(true)
      setInitialUpdateORCreate({ step: "company", insertedId: null });
      const payload = {
        // id: null,
        companyId: companyId,
        employeeId: employeeId,
        UAN: e.uannumber,
        PANnumber: e.pannumber,
        adharNumber: e.aadhaarnumber,
        adharEnrollNumber: e.aadhaarenrollmentnumber,
        PFnumber: e.pfnumber,
        PFjoiningDate: e.pfjoindate || null,
        PFeligible: e.PFeligible === "Yes" ? 1 : 0,
        ESIeligible: e.ESIeligible === "Yes" ? 1 : 0,
        ESInumber: e.esinumber,
        PTeligible: e.PTeligible === "Yes" ? 1 : 0,
        LWFeligible: e.LWFeligible === "Yes" ? 1 : 0,
        EPSeligible: e.EPSeligible === "Yes" ? 1 : 0,
        EPSjoiningDate: e.epsjoiningdate || null,
        EPSexitDate: e.epsexitdate || null,
        HPSeligible: e.HPSeligible === "Yes" ? 1 : 0,
        isActive: 1,
        createdBy: createdBy,
        restrictionValue: null,
      };

      const UpdatePayload = {
        // id: statutoryEmployeeInfoId,
        companyId: companyId,
        employeeId: updateId,
        UAN: formik3.values.uannumber,
        PANnumber: formik3.values.pannumber,
        adharNumber: formik3.values.aadhaarnumber,
        adharEnrollNumber: formik3.values.aadhaarenrollmentnumber,
        PFnumber: formik3.values.pfnumber,
        PFjoiningDate: formik3.values.pfjoindate,
        PFeligible: formik3.values.PFeligible === "Yes" ? 1 : 0,
        ESIeligible: formik3.values.ESIeligible === "Yes" ? 1 : 0,
        ESInumber: formik3.values.esinumber,
        PTeligible: formik3.values.PTeligible === "Yes" ? 1 : 0,
        LWFeligible: formik3.values.LWFeligible === "Yes" ? 1 : 0,
        EPSeligible: formik3.values.EPSeligible === "Yes" ? 1 : 0,
        EPSjoiningDate: formik3.values.epsjoiningdate,
        EPSexitDate: formik3.values.epsexitdate || null,
        HPSeligible: formik3.values.HPSeligible === "Yes" ? 1 : 0,
        isActive: 1,
        createdBy: createdBy,
        restrictionValue: null,
      };
      setNextStep(nextStep + 1);

      // formik4.setFieldValue("timeInOut", "");
      // formik4.setFieldValue("overTime", "");
      // formik4.setFieldValue("shortTime", "");
      // formik4.setFieldValue("missPunch", "");
      // formik4.setFieldValue("leave", "");
      // formik4.setFieldValue("holiday", "");
      // formik4.setFieldValue("salary", "");

      try {
        if (updateId) {
          if (formik3.values.statutoryStatus === "Y") {
            const result = await Payrollaction(
              PAYROLLAPI.SAVE_EMPLOYEE_STATUTORY_INFO,
              UpdatePayload
            );
            if (result.status === 200) {
              openNotification("success", "Successful", result.message);
              setNextStep(nextStep + 1);
              setPresentage(3);
            } else {
              openNotification("error", "Info", result.message);
              // //setLoading(false)
            }
          }
        } else {
          if (formik3.values.statutoryStatus === "Y") {
            const result = await Payrollaction(
              PAYROLLAPI.SAVE_EMPLOYEE_STATUTORY_INFO,
              payload
            );
            if (result.status === 200) {
              openNotification(
                "success",
                "Successful",
                "Work Details & " + result.message,
                () => {
                  setNextStep(nextStep + 1);
                  setPresentage(3);
                }
              );
            } else {
              openNotification("error", "Info", result.message);
              // //setLoading(false)
            }
          } else {
            openNotification("success", "Successful", "Work Details added");
          }
        }

        // const result = await axios.post(API.HOST + API.ADD_EMPLOYEE_COMPANY, {
        //   employeeId: employeeId,
        //   companyId: e.company,
        //   departmentId: e.department,
        //   categoryId: e.category,
        //   designationId: e.designation,
        //   locationId: e.location,
        //   joiningDate: e.dateOfJoin,
        //   shiftSchemeId: e.shiftScheme,
        //   // workPolicy: e.workPolicy,
        //   // leavePolicy: e.leavePolicy,
        //   // salaryPolicy: e.salaryPolicy,
        //   reportsTo: e.reports,
        // });
        // console.log(result);
        // if (result.data.status === 200) {

        //   setEmployeeCompanyId(result.data.data.companyId);

        //   openNotification(
        //     "success",
        //     result.data.message,
        //     "Employee profile update saved. Changes are now reflected."
        //   );
        // } else {
        //   openNotification("error", "Failed..", result.data.message);
        // }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        return error;
      }
    },
  });

  const getAllCompanyBank = async () => {
    try {
      const result = await Payrollaction(PAYROLLAPI.GET_ALL_BANK_RECORDS, {
        companyId: formik3.values.company,
      });
      setBankdetails(
        result.result.map((item) => ({
          label: item.bankName,
          value: item.bankId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllCompanyBank();
  }, [formik3.values.company]);
  // form for contact & Policy details
  const formik4 = useFormik({
    initialValues: {
      probationPeriod: "",
      noticePeriod: "",
      timeInOut: null,
      overTime: null,
      shortTime: null,
      missPunch: null,
      leave: "",
      holiday: "",
      salary: null,
      bankAccNo: "",
      bankId: null,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      probationPeriod: yup
        .string()
        .required("Probation Period in Days is required"),
      noticePeriod: yup.string().required("Notice Period in Days is required"),
    }),
    onSubmit: async (e) => {
      // //setLoading(true)
      const yourDate = new Date();
      const formattedDate = moment(yourDate).format("YYYY-MM-DD");
      // Check if selectedTemplate is not null before proceeding
      if (
        selectedTemplate &&
        templateDetails &&
        templateDetails.earnings &&
        templateDetails.deductions &&
        salaryTemplateStatus === 0
      ) {
        const data = {
          salaryTemplateId: selectedTemplate,
          employeeId: employeeId || updateId,
          createdBy: createdBy,
          earnings: templateDetails.earnings.map((item) => ({
            // salaryTemplateId: item.salaryTemplateId,
            salaryComponetType: item.salaryComponetType,
            componetId: item.componetId,
            calculationTypeId: item.calculationTypeId,
            value: item.value,
            amount: item.amount,
            rules: item.rules,
            isActive: item.isActive,
            createdBy: item.createdBy,
          })),
          deductions: templateDetails.deductions.map((item) => ({
            // salaryTemplateId: item.salaryTemplateId,
            salaryComponetType: item.salaryComponetType,
            componetId: item.componetId,
            calculationTypeId: item.calculationTypeId,
            value: item.value,
            amount: item.amount,
            rules: item.rules,
            isActive: item.isActive,
            createdBy: item.createdBy,
          })),
          grossSalary: grossSalary,
          withEffectfrom: formattedDate,
          incrimentPercentage: 0.0,
        };

        // Call the API only if selectedTemplate is not null
        await saveSalaryTemplateEmployeeMapping(data);
      }

      // Always attempt to submit the form data
      try {
        if (updateId) {
          setNextStep(nextStep + 1);
          setPresentage(3.9);
        } else {
          if (
            initialUpdateORCreate.step === "company" &&
            !initialUpdateORCreate.insertedId
          ) {
            const result = await action(API.ADD_EMPLOYEE_COMPANY, {
              employeeId: employeeId,
              companyId: formik3.values.company,
              departmentId: formik3.values.department || null,
              categoryId: formik3.values.category || null,
              designationId: formik3.values.designation || null,
              locationId: formik3.values.location || null,
              joiningDate: formik3.values.dateOfJoin || null,
              shiftSchemeId: formik3.values.shiftScheme || null,
              reportsTo: formik3.values.reports || null,
              probationPeriod: e.probationPeriod || null,
              noticePeriod: e.noticePeriod || null,
              timeInOutPolicy: e.timeInOut || null,
              overtimePolicy: e.overTime || null,
              shortTimePolicy: e.shortTime || null,
              missPunchPolicy: e.missPunch || null,
              leaveType:
                leavetypes
                  .filter((each) => each.select)
                  .map((each) => each.value) || [],
              holidayPolicy:
                holidays
                  .filter((each) => each.select)
                  .map((each) => each.value) || [],
              salaryPolicy: e.salary || null,
              createdBy: createdBy,
              approvalFlowData: approvalFlowData.map((item) => ({
                approvalTypeId: item[0] || null,
                approvalTemplateId: item[1] || null,
                departmentIds: null,
                locationIds: null,
              })),
            });

            if (result.status === 200) {
              setInitialUpdateORCreate({
                step: "company",
                insertedId: result.result.insertedId,
              });
              setNextStep(nextStep + 1);
              // //setLoading(false)
              openNotification(
                "success",
                "Successful",
                "Contract Policy deatils added successfully"
              );
            } else {
              openNotification("error", "Info", result.message);
              // //setLoading(false)
            }
          } else if (
            initialUpdateORCreate.step === "company" &&
            initialUpdateORCreate.insertedId
          ) {
            // //setLoading(false)
            updateemployeeBasic();
          }
        }
      } catch (error) {
        // //setLoading(false)
        openNotification("error", "Failed", error.code);
      }
    },
  });
  // form for assets & Docs details

  const documentDynamicFields = addMoreDocuments?.reduce((ac, each) => {
    each.field.reduce((acc, value) => {
      acc[each.inputType] = "";
      return acc;
    });
  }, {});
  const assetsDynamicFields = addMoreAssets?.reduce((ac, each) => {
    each.field.reduce((acc, value) => {
      acc[each.inputType] = "";
      return acc;
    });
  }, {});

  const formik5 = useFormik({
    initialValues: {
      ...documentDynamicFields,
      ...assetsDynamicFields,
      // assetId: [],
      // assetName: "",
      // assetDescription: "",
      // isWarranty: "",
      // documentId: [],
      // document: "",
      // documentDescription: "",
      // // documentRenewal: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // assetId: yup.string().required("Asset Type is required"),
      // assetName: yup.string().required("Asset is required"),
      // documentId: yup.string().required("Document Type is Required"),
      // document: yup.string().required("Document is Required"),
      // isWarranty: yup.string().required("IsWarranty is Required"),
      // documentRenewal: yup.string().required("Document Renewal is Required"),
    }),
    onSubmit: async (e) => {
      // //setLoading(true)
      // setNextStep(5);

      try {
        if (updateId) {
          updateemployeeBasic();
        } else {
          const result_Asset = await action(
            API.ADD_EMPLOYEE_ASSETS,
            addMoreAssets?.map((each) => ({
              employeeId: employeeId, //employeeId,
              companyId: formik3.values.company,
              assetTypeId: e[each.field[0]?.inputType] || null,
              assetName: e[each.field[1]?.inputType] || null,
              description: e[each.field[3]?.inputType] || null,
              isUnderwarranty: e[each.field[5]?.inputType] || null,
              warrantyExpiry: e[each.field[6]?.inputType] || null,
              validUpto: e[each.field[4]?.inputType] || null,
            }))

            // assetTypeId: e.assetId,
            // asset: e.assetName,
            // isUnderwarranty: e.isWarranty,
          );

          const result_Document = await action(
            API.ADD_EMPLOYEE_DOCUMENT,

            addMoreDocuments?.map((each) => ({
              employeeId: employeeId, //employeeId,
              companyId: formik3.values.company,
              documentTypeId: e[each.field[0]?.inputType] || null,
              documentName: e[each.field[1]?.inputType] || null,
              documentFile: e[each.field[2]?.inputType] || null,
              description: e[each.field[3]?.inputType] || null,
              isUnderwarranty: e[each.field[4]?.inputType] || null,
              validTo: e[each.field[5]?.inputType] || null,
            }))

            // employeeCompanyId: e,
            // documentId: e.documentId,

            // document: e.document,
          );
          if (result_Asset.status === 200 && result_Document.status === 200) {
            setPresentage(0);

            openNotification(
              "success",
              "Successful",
              result_Asset.message,
              " ",
              result_Document.message,

              () => {
                setShow(false);
              }
            );
            setTimeout(() => {
              handleClose();
              refresh();
              // //setLoading(false)
            }, 1000);
          } else {
            openNotification("error", "Info", result_Asset.message);
            // //setLoading(false)
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error.code);
        return error;
      }
    },
  });

  const getEmployeeStatutoryConfigurationDataByIds = async () => {
    const result = await Payrollaction(
      PAYROLLAPI.GET_EMPLOYEE_EMPLOYMENT_INFO,
      {
        employeeId: updateId,
      }
    );

    if (
      result?.result?.length !== 0 &&
      result?.result?.PANnumber !== "" &&
      result?.result?.PANnumber &&
      result?.result?.adharNumber !== "" &&
      result?.result?.adharNumber
    ) {
      formik3.setFieldValue("statutoryStatus", "Y");
    } else {
      formik3.setFieldValue("statutoryStatus", "N");
    }

    const transformValue = (value) => (value === "1" ? "Yes" : "No");

    formik3.setFieldValue("uannumber", result.result.UAN);
    formik3.setFieldValue("pannumber", result.result.PANnumber);
    formik3.setFieldValue("aadhaarnumber", result.result.adharNumber);
    formik3.setFieldValue(
      "aadhaarenrollmentnumber",
      result.result.adharEnrollNumber
    );
    formik3.setFieldValue("pfnumber", result.result.PFnumber);
    formik3.setFieldValue(
      "PFeligible",
      transformValue(result.result.PFeligible)
    );
    formik3.setFieldValue(
      "ESIeligible",
      transformValue(result.result.ESIeligible)
    );
    formik3.setFieldValue("esinumber", result.result.ESInumber);
    formik3.setFieldValue(
      "PTeligible",
      transformValue(result.result.PTeligible)
    );
    formik3.setFieldValue(
      "LWFeligible",
      transformValue(result.result.LWFeligible)
    );
    formik3.setFieldValue(
      "EPSeligible",
      transformValue(result.result.EPSeligible)
    );
    formik3.setFieldValue("pfjoindate", result.result.PFjoiningDate);
    formik3.setFieldValue("epsjoiningdate", result.result.EPSjoiningDate);
    formik3.setFieldValue("epsexitdate", result.result.EPSexitDate);
    formik3.setFieldValue(
      "HPSeligible",
      transformValue(result.result.HPSeligible)
    );
  };

  useEffect(() => {
    if (updateId) {
      getEmployeeStatutoryConfigurationDataByIds();
    }
  }, [updateId]);

  // Get Id Based employee

  const getIdBasedEmployee = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: updateId,
      });
      // if (result.result) {
      // Basic

      // formik.setFieldValue("gender", result.result.gender);
      formik.setFieldValue("gender", result.result.gender);
      formik.setFieldValue("firstName", result.result.firstName);
      formik.setFieldValue("middleName", result.result.middleName);
      formik.setFieldValue("lastName", result.result.lastName);
      formik.setFieldValue("nickName", result.result.nickName);
      formik.setFieldValue(
        "religion",
        result.result.religionId === "0" ? null : result.result.religionId
      );
      // formik.setFieldValue("bloodGroup", result.result.bloodGroup);
      formik.setFieldValue("bloodGroup", result.result.bloodGroup);
      formik.setFieldValue("dateOfBirth", result.result.dateOfBirth);
      formik.setFieldValue("email", result.result.email);
      formik.setFieldValue("mobile", result.result.phone);
      formik.setFieldValue(
        "fatherOrHusbandName",
        result.result.fatherOrHusbandName
      );

      // Address
      if (result.result.PermanentAddress) {
        setSameDetails(1);
      }
      formik2.setFieldValue("addressType", result.result.addressType);
      formik2.setFieldValue("address", result.result.address);
      formik2.setFieldValue("city", result.result.cityId);
      formik2.setFieldValue("state", result.result.stateId);
      formik2.setFieldValue("country", result.result.countryId);
      formik2.setFieldValue("zipCode", result.result.zipCode);
      formik2.setFieldValue("PermanentAddress", result.result.PermanentAddress);
      formik2.setFieldValue("PermanentCity", result.result.PermanentCityId);
      formik2.setFieldValue("PermanentState", result.result.PermanentStateId);
      formik2.setFieldValue("PermanentZipCode", result.result.PermanentZipCode);
      formik2.setFieldValue(
        "PermanentCountry",
        result.result.PermanentCountryId
      );

      setLeaveTypeId(
        result.result.employeeLeaves.map((item) => item.leaveTypeId)
      );
      setHolidayId(result.result?.holidayPolicy);
      // work Deatils

      formik3.setFieldValue(
        "company",
        parseInt(result.result.companyId) || null
      );
      formik3.setFieldValue("designation", result.result.designationId || null);
      formik3.setFieldValue(
        "department",
        parseInt(result.result.departmentId) || null
      );
      formik3.setFieldValue(
        "category",
        parseInt(result.result.categoryId) || null
      );
      formik3.setFieldValue(
        "reports",
        result.result.superiorEmployeeId || null
      );
      formik3.setFieldValue("dateOfJoin", result.result.joiningDate || null);
      formik3.setFieldValue(
        "location",
        parseInt(result.result.locationId) || null
      );
      // formik.setFieldValue("bloodGroup", result.result.employeeCompanyData.BloodGroup);
      formik3.setFieldValue(
        "shiftScheme",
        parseInt(result.result.shiftSchemeId) || null
      );
      // formik.setFieldValue("email", result.result.email);
      // formik.setFieldValue("mobile", result.result.phone);

      // contact

      if (result.result.employeeLeaves) {
        // setOpenLeave(true);
      }

      formik4.setFieldValue("leave", true);
      // setLeaveTypes((prevSwitches) =>
      //   prevSwitches?.map((sw) =>
      //     result.result?.employeeLeave["leaveTypeId"] === sw.id
      //       ? { ...sw, select: true }
      //       : sw
      //   )
      // );
      // setHolidays((prevSwitches) =>
      //   prevSwitches?.map((sw) =>
      //     result.result?.holidayPolicy.includes(parseInt(sw.id))
      //       ? { ...sw, select: true }
      //       : sw
      //   )
      // );

      formik4.setFieldValue("probationPeriod", result.result.probationPeriod);
      formik4.setFieldValue("noticePeriod", result.result.noticePeriod);
      formik4.setFieldValue(
        "timeInOut",
        result.result.timeInOutPolicy === "0"
          ? null
          : result.result.timeInOutPolicy
      );
      formik4.setFieldValue(
        "overTime",
        result.result.overtimePolicy === "0"
          ? null
          : result.result.overtimePolicy
      );
      formik4.setFieldValue(
        "shortTime",
        result.result.shortTimePolicy === "0"
          ? null
          : result.result.shortTimePolicy
      );
      formik4.setFieldValue(
        "missPunch",
        result.result.missPunchPolicy === "0"
          ? null
          : result.result.missPunchPolicy
      );
      // formik4.setFieldValue("leave", result.result.leavePolicy);
      formik4.setFieldValue(
        "holiday",
        result.result.holidayPolicy === "0" ? null : result.result.holidayPolicy
      );
      formik4.setFieldValue("salary", result.result.salaryPolicy);

      // result.result.employeeAssets?.map((data, index) =>
      //   Object.keys(data).map((item, i) =>
      //     formik5.setFieldValue(item, data[item])
      //   )
      // );

      result.result.employeeAssets?.map((data, index) =>
        Object.keys(data).map((item, i) =>
          formik5.setFieldValue(item + index, data[item])
        )
      );

      result.result.employeeDocments?.map((data, index) =>
        Object.keys(data).map((item, i) =>
          formik5.setFieldValue(item + index, data[item])
        )
      );

      setAddMoreassets(
        result.result.employeeAssets?.map((each, e) => ({
          id: e,
          rowType: "First",
          employeeAssetId: each.employeeAssetId,
          field: [
            {
              title: "Asset Type",
              type: "dropdown",
              inputType: Object.keys(each)[16] + e,
              required: true,
            },
            {
              title: "Asset Name",
              type: "input",
              inputType: Object.keys(each)[14] + e,
              required: true,
            },

            {
              title: "Description",
              type: "textArea",
              inputType: Object.keys(each)[15] + e,
            },
            {
              title: "Asset Renewal",
              // type:
              //   parseInt(Object.values(each)[7]) === 1 ? "renewalDate" : null,
              type: "renewalDate",
              inputType: Object.keys(each)[4] + e,
              placeholder: "dd-mm-yyyy",
            },
            {
              title: "Is asset under warranty",
              description: "Set asset warrant informations",
              type: "radio",
              inputType: Object.keys(each)[6] + e,
            },
            {
              title: "Warranty Expiry",
              type: parseInt(Object.values(each)[6]) === 1 ? "date" : null,
              inputType: Object.keys(each)[7] + e,
              placeholder: "dd-mm-yyyy",
            },
          ],
        }))
      );

      setAddMoreDocuments(
        result.result.employeeDocments.map((each, e) => ({
          id: 1,
          rowType: "First",
          employeeDocumentId: each.employeeDocumentId,
          field: [
            {
              title: "Document Types",
              type: "dropdown",
              inputType: Object.keys(each)[15] + e,
            },
            {
              title: "Document",
              type: "input",
              inputType: Object.keys(each)[13] + e,
            },
            {
              title: "Is asset under warranty",
              description: "Set asset warrant informations",
              type: "upload",
              inputType: "uploadFile" + e,
            },
            {
              title: "Description",
              type: "textArea",
              inputType: Object.keys(each)[14] + e,
            },
            {
              title: "Is document under renewal",
              description: "Set asset warrant informations",
              type: "radio",
              inputType: Object.keys(each)[6] + e,
            },
            {
              title: "Renewal Date",
              type: "date",
              inputType: "renewalDate" + e,
              placeholder: "dd-mm-yyyy",
            },
          ],
        }))
      );

      if (result.result.approvalData) {
        const getdata = result.result.approvalData.map((item) => [
          item.approvalTypeId,
          item.approvalTemplateId,
        ]);
        setapprovalFlowData(getdata);
      }
    } catch (error) {
      openNotification("error", "Failed", error.code);
    }
  };

  // Update Employee Basic Deatils
  const updateemployeeBasic = async () => {
    try {
      const result = await action(API.UPDATE_EMPLOYEE_BASIC_DETAILS, {
        employeeId: updateId || employeeId,
        employeeModel: {
          companyId: companyId,
          firstName:
            formik.values.firstName.charAt(0).toUpperCase() +
              formik.values.firstName.slice(1) || null,
          middleName: formik.values.middleName || null,
          lastName: formik.values.lastName || null,
          nickName: formik.values.nickName || null,
          gender: formik.values.gender || null,
          bloodGroup: formik.values.bloodGroup || null,
          dateOfBirth: formik.values.dateOfBirth || null,
          email: formik.values.email || null,
          phone: formik.values.mobile || null,
          fatherOrHusbandName: formik.values.fatherOrHusbandName,
          religionId: formik.values.religion,
        },
        employeeAddressModel:
          initialUpdateORCreate.step !== "basic"
            ? {
                address: formik2.values.address || null,
                cityId: formik2.values.city || null,
                countryId: formik2.values.country || null,
                stateId: formik2.values.state || null,
                zipCode: formik2.values.zipCode || null,
                PermanentAddress: formik2.values.PermanentAddress || null,
                PermanentCityId: formik2.values.PermanentCity || null,
                PermanentStateId: formik2.values.PermanentState || null,
                PermanentZipCode: formik2.values.PermanentZipCode || null,
                PermanentCountryId: formik2.values.PermanentCountry || null,
              }
            : null,
        // Work Details
        // companyId: formik3.values.company,
        employeeCompanyModel:
          initialUpdateORCreate.step !== "address" &&
          initialUpdateORCreate.step !== "basic"
            ? {
                departmentId: formik3.values.department || null,
                categoryId: formik3.values.category || null,
                designationId: formik3.values.designation || null,
                locationId: formik3.values.location || null,
                joiningDate: formik3.values.dateOfJoin || null,
                shiftSchemeId: formik3.values.shiftScheme || null,

                //   departmentId: formik3.values.department,
                // categoryId: formik3.values.category,
                // designationId: formik3.values.designation,
                // locationId: formik3.values.location,
                // joiningDate: formik3.values.dateOfJoin,
                // shiftSchemeId: formik3.values.shiftScheme,

                probationPeriod: formik4.values.probationPeriod || null,
                noticePeriod: formik4.values.noticePeriod || null,
                timeInOutPolicy: formik4.values.timeInOut || null,
                overtimePolicy: formik4.values.overTime || null,
                shortTimePolicy: formik4.values.shortTime || null,
                missPunchPolicy: formik4.values.missPunch || null,
                // leavePolicy: leavetypes
                //   .map((each) => each.select && each.id)
                //   .filter((data) => data),
                leaveType:
                  leavetypes
                    .map((each) => each.select && each.value)
                    .filter((data) => data) || [],
                holidayPolicy:
                  holidays
                    .map((each) => each.select && each.value)
                    .filter((data) => data) || [],
                salaryPolicy: formik4.values.salary || null,
              }
            : null,

        employeeHierarchyModel:
          initialUpdateORCreate.step !== "address" &&
          initialUpdateORCreate.step !== "basic"
            ? {
                superiorEmployeeId: formik3.values.reports,
                companyId: companyId,
              }
            : null,
        asset: addMoreAssets?.map((each) => ({
          employeeId: updateId, //employeeId,
          companyId: formik3.values.company,
          employeeAssetId: each.employeeAssetId,
          assetTypeId: formik5.values[each.field[0].inputType] || null,
          assetName: formik5.values[each.field[1].inputType] || null,
          description: formik5.values[each.field[2].inputType] || null,
          validUpto: formik5.values[each.field[3].inputType] || null,
          warrantyExpiry: formik5.values[each?.field[5]?.inputType]
            ? formik5.values[each?.field[5]?.inputType]
            : null,
          isUnderwarranty: formik5.values[each?.field[4]?.inputType]
            ? formik5.values[each?.field[4]?.inputType]
            : null,
        })),

        document: addMoreDocuments?.map((each) => ({
          employeeId: updateId, //employeeId,
          companyId: formik3.values.company,
          employeeDocumentId: each.employeeDocumentId,
          documentTypeId: formik5.values[each.field[0].inputType] || null,
          documentName: formik5.values[each.field[1].inputType] || null,
          documentFile: formik5.values[each.field[2].inputType] || null,
          description: formik5.values[each.field[3].inputType] || null,
          isUnderwarranty: formik5.values[each.field[4].inputType] || null,
          validTo: formik5.values[each?.field[5]?.inputType] || null,
          createdBy: employeeId,
        })),

        approvalFlowData:
          initialUpdateORCreate.step !== "address" &&
          initialUpdateORCreate.step !== "basic"
            ? approvalFlowData.map((item) => ({
                approvalTypeId: item[0],
                approvalTemplateId: item[1],
                departmentIds: null,
                locationIds: null,
              }))
            : null,
      });

      // if (result) setNextStep(nextStep + 1);
      if (result.status === 200) {
        openNotification("success", "Successful", result.message, () => {
          setShow();
        });
        if (updateId) {
          setTimeout(() => {
            handleClose();
            refresh();
          }, 1000);
        } else {
          setNextStep(nextStep + 1);
          setPresentage(presentage + 1);
        }
      } else {
        openNotification("error", "Info", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error.code);
    }
  };

  // _______________________________-----------------------________________________

  useEffect(() => {
    if (updateId) {
      getIdBasedEmployee();
    }
  }, [updateId]);

  const getCountry = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);
      setCountry(
        result.result.map((each) => ({
          label: each.countryName,
          value: each.countryId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getState = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);

      result.result.map(
        (each) =>
          formik2.values.country === each.countryId &&
          setState(
            each.stateData.map((each) => ({
              label: each.stateName,
              value: each.stateId,
            }))
          )
      );
      result.result.map((each) => {
        formik2.values.PermanentCountry === each.countryId &&
          setPstate(
            each.stateData.map((each) => ({
              label: each.stateName,
              value: each.stateId,
            }))
          );
      });
    } catch (error) {
      return error;
    }
  };

  const getCity = async () => {
    try {
      const result = await action(API.GET_CITY_LIST);

      result.result.map(
        (each) =>
          formik2.values.country === each.countryId &&
          each.stateData.map(
            (each) =>
              formik2.values.state === each.stateId &&
              setCity(
                each.cityData.map((each) => ({
                  label: each.city,
                  value: each.cityId,
                }))
              )
          )
      );
      result.result.map((each) => {
        formik2.values.PermanentCountry === each.countryId &&
          each.stateData.map(
            (each) =>
              formik2.values.PermanentState === each.stateId &&
              setPCity(
                each.cityData.map((each) => ({
                  label: each.city,
                  value: each.cityId,
                }))
              )
          );
      });
    } catch (error) {
      return error;
    }
  };

  const getCategory = async (e) => {
    try {
      const result = await action(API.GET_CATEGORY, {
        companyId: e,
        isActive: 1,
      });
      setCategoryList(
        result.result.map((each) => ({
          label: each.category,
          value: each.categoryId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getDesignation = async (e) => {
    try {
      const result = await action(API.GET_DESIGNATION_RECORDS, {
        companyId: e,
        isActive: 1,
      });

      setDesignationList(
        result?.result?.map((each) => ({
          label: each.designation,
          value: each.designationId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getShiftScheme = async (e) => {
    try {
      const result = await action(API.GET_SHIFT_SCHEME, {
        companyId: e,
        isActive: 1,
      });

      setShiftSchemeList(
        result.result.map((each) => ({
          label: each.shiftScheme,
          value: each.shiftSchemeId,
          startTime: each.startTime,
          endTime: each.endTime,
          breakDuration: each.breakDuration,
          shiftScheme: each.shiftScheme,
        }))
      );
    } catch (error) {
      return error;
    }
  };
  const getEmployee = async (e) => {
    try {
      const result = await action(API.EMPLOYEE_REPORTING_MANAGERS, {
        companyId: e,
        employeeId: updateId || null,
      });
      setEmployee(
        result.result?.map((each) => ({
          label: each.firstName,
          value: each.employeeId,
          // logo: logo,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getCompany = async () => {
    try {
      const result = await getCompanyList(organisationId);
      const companyOptions = result.map((each) => ({
        label: each.company,
        value: each.companyId,
      }));

      // Retrieve LoginData from localStorage
      const loginData = localStorageData.LoginData;
      const userCompanyIds = loginData?.userData?.companyId || [];

      // Filter companyOptions based on userCompanyIds
      const filteredCompanyOptions = companyOptions.filter((option) =>
        userCompanyIds.includes(option.value)
      );

      // Set default company based on localStorage
      if (companyId) {
        const initialCompany = filteredCompanyOptions.find(
          (company) => company.value === parseInt(companyId)
        );
        if (initialCompany) {
          formik3.setFieldValue("company", initialCompany.value);
          getLocation(initialCompany.value); // Call getLocation with default companyId
        }
      }

      // If only one company option is available, set it as the default and update location
      if (filteredCompanyOptions.length === 1) {
        formik3.setFieldValue("company", filteredCompanyOptions[0].value);
        getLocation(filteredCompanyOptions[0].value);
        getDepartment(filteredCompanyOptions[0].value);
      }

      setCompany(filteredCompanyOptions);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getCompany();
  }, []);

  const getLocation = async (companyId) => {
    try {
      const result = await action(API.GET_LOCATION, {
        companyId: companyId,
        isActive: 1,
      });
      setLocation(
        result.result.map((each) => ({
          label: each.location,
          value: each.locationId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getDepartment = async (companyId) => {
    try {
      const result = await action(API.GET_DEPARTMENT, {
        companyId: companyId,
        isActive: 1,
      });
      setDepartmentList(
        result.result.map((each) => ({
          label: each.department,
          value: each.departmentId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getReligion = async () => {
    try {
      const result = await axios.get(API.HOST + API.GET_RELIGION_LIST);
      setReligion(
        result.data.tbl_religion.map((each) => ({
          label: each.religionName,
          value: each.religionId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getAssetTypes = async (e) => {
    try {
      const result = await action(API.GET_ASSETS_TYPES_RECORDS, {
        companyId: companyId,
        isActive: 1,
      });
      setAssetsTypes(
        result.result.map((each) => ({
          label: each.assetType,
          value: each.assetTypeId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getDocumentTypes = async (e) => {
    try {
      const result = await action(API.GET_DOCUMENT_TYPES_RECORDS, {
        companyId: e,
        isActive: 1,
      });
      setDocumentTypes(
        result?.result?.map((each) => ({
          label: each.documentType,
          value: each.documentTypeId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getOverTimePolicy = async (e) => {
    try {
      const result = await axios.post(
        API.HOST + API.GET_OVERTIME_POLICY + "/" + e
      );
      setOverTimePolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getTimeInOutPolicy = async (e) => {
    try {
      const result = await axios.post(
        API.HOST + API.GET_EMPLOYEE_TIME_IN_OUT_POLICY + "/" + e
      );
      setTimeOutPolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getShortTimePolicy = async (e) => {
    try {
      const result = await axios.post(
        API.HOST + API.GET_SHORT_TIME_POLICY + "/" + e
      );
      setShortTimePolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getMissPunchPolicy = async (e) => {
    try {
      const result = await axios.post(
        API.HOST + API.GET_MISS_PUNCH_POLICY + "/" + e
      );
      setMissPunchPolicy(
        result.data.tbl_workPolicy.map((each) => ({
          label: each.workPolicyName,
          value: each.workPolicyId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getHolidayPolicy = async (e) => {
    try {
      const result = await action(API.GET_HOLIDAY, { companyId: e });
      setHolidays(
        result.result.map((each) => ({
          // label: each.holidayName,
          // value: each.holidayId,
          id: each.holidayId,
          img: TravelLocation,
          title: each.holidayName,
          subtitle: t("VacationSub"),
          value: each.holidayId,
          description: t("DescriptionDesc"),
          // allowancePay: [
          //   { leavedays: t("CalendarDays"), Leavepayrate: t("Paid") },
          // ],
          select: holidayId?.some((item) => item === each.holidayId),
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const getLeavetype = async (e) => {
    try {
      const result = await axios.post(API.HOST + API.GET_LEAVE_TYPE + "/" + e);
      setLeaveTypes(
        result.data.tbl_leaveType.map((each, i) => ({
          // label: each.leaveType,
          // value: each.leaveTypeId,
          id: each.leaveTypeId,
          img: TravelLocation,
          title: each.leaveType,
          subtitle: t("VacationSub"),
          value: each.leaveTypeId,
          description: t("DescriptionDesc"),
          allowancePay: [
            { leavedays: t("CalendarDays"), Leavepayrate: t("Paid") },
          ],
          select: leaveTypeId?.some((item) => item === each.leaveTypeId),
        }))
      );
    } catch (error) {
      return error;
    }
  };

  const handleDeleteAsset = (assetId) => {
    setAddMoreassets((prevAssets) =>
      prevAssets.filter((asset) => asset.id !== assetId)
    );
  };

  const handleDeleteDocument = (documentId) => {
    setAddMoreDocuments((prevDocuments) =>
      prevDocuments.filter((document) => document.id !== documentId)
    );
  };

  const getSalaryTemplateList = async (e) => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_ALL_Salary_Template_Builder,
        {
          companyId: companyId,
        }
      );
      setSalaryTemplateList(
        result.result.map((each) => ({
          label: each.templateName,
          value: each.salaryTemplateId,
        }))
      );
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getSalaryTemplateList();
  }, []);

  useEffect(() => {
    getState();
  }, [formik2.values.country, formik2.values.PermanentCountry]);
  useEffect(() => {
    getCity();
  }, [formik2.values.state, formik2.values.PermanentState]);

  useEffect(() => {
    switch (activeBtnValue) {
      default:
        getCountry();
        getReligion();

        break;
      case "workDetails":
        getCompany();

        break;
      case "assets_Docs":
        if (!updateId) {
          setAddMoreassets(moreAssetsList);
          setAddMoreDocuments(moreDocumentList);
        }
        getAssetTypes(formik3.values.company);
        getDocumentTypes(formik3.values.company);
        break;
      case "contact_Policy":
        getOverTimePolicy(formik3.values.company);
        getTimeInOutPolicy(formik3.values.company);
        getShortTimePolicy(formik3.values.company);
        getMissPunchPolicy(formik3.values.company);
        getHolidayPolicy(formik3.values.company);
        getLeavetype(formik3.values.company);
        getSalaryTemplateList(formik3.values.company);
        getApprovalDetails(formik3.values.company);
        break;
    }
  }, [activeBtnValue]);
  useEffect(() => {
    if (formik3.values.company) {
      getLocation(formik3.values.company);
      getCategory(formik3.values.company);
      getEmployee(formik3.values.company);
      getDesignation(formik3.values.company);
      getShiftScheme(formik3.values.company);
      getDepartment(formik3.values.company);
    }
  }, [formik3.values.company]);

  useEffect(() => {
    if (activeBtn < 4 && activeBtn !== nextStep) {
      /// && activeBtn !== nextStep
      setActiveBtn(1 + activeBtn);
      // setNextStep(nextStep);
      setActiveBtnValue(steps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  useEffect(() => {
    setPresentage(presentage);
    setSteps(steps);
  }, [addAdressstep]);

  useEffect(() => {
    shiftSchemeList.map((e) => {
      if (formik3.values.shiftScheme === e.value) {
        setShiftSchemeContentList(e);
      }
    });
  }, [formik3.values.shiftScheme]);

  const fetchTemplateDetails = async (salaryTemplateId) => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_TEMPLATE_EARNINGS_AND_DEDUCTIONS_IN_EMPLOYEE_ONBOARDING,
        {
          salaryTemplateId: salaryTemplateId,
        }
      );
      setTemplateDetails(response.result);
    } catch (error) {
      return error;
    }
  };

  // Sample Demo Content For CascaderSelect

  const getApprovalDetails = async (e) => {
    try {
      const result = await action(API.GET_ALL_APPROVAL_DETAILS, {
        companyId: e,
      });
      const dynamicData = result.result.map((item) => ({
        label: item.approvalTypeName,
        value: item.approvalTypeId,
        children: item.approvalTemplates.map((template) => ({
          label: template.templateName,
          value: template.approvalTemplateId,
        })),
      }));
      setDynamicdata(dynamicData);
    } catch (error) {
      return error;
    }
  };

  const getSalaryTemplateListForUpdate = async () => {
    try {
      const result = await Payrollaction(
        PAYROLLAPI.GET_SALARY_TEMPLATE_CHECK_DATA_WHILE_UPDATE,
        {
          employeeId: updateId || employeeId,
        }
      );
      setSalaryTemplateStatus(result.result.salaryTemplateStatus);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (activeBtnValue === "contact_Policy") {
      getSalaryTemplateListForUpdate();
    }
  }, [activeBtnValue]);

  const renderFields = (items = [], type) => {
    return items.map((item, index) => (
      <div
        key={index}
        className="borderb bg-[#FCFCFC] dark:bg-dark p-3 rounded-[10px] flex items-center justify-between"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-grey text-xs 2xl:text-xs lg:text-[10px] font-medium">
              {type === "earnings" ? "Earnings Name" : "Deductions Name"}
            </p>
            <p className="2xl:text-sm lg:text-xs text-sm font-medium">
              {type === "earnings" ? item.earningsName : item.deductionName}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-grey text-xs 2xl:text-xs lg:text-[10px] font-medium">
              Calculation Type
            </p>
            <p className="2xl:text-sm lg:text-xs text-sm font-medium">
              {item.calculationType}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-grey 2xl:text-sm lg:text-xs text-sm font-medium">
            Amount:
          </p>
          <FormInput
            type="number"
            value={item.amount}
            className="w-[126px]"
            change={(e) => {
              const newValue = e;
              setTemplateDetails((prevDetails) => ({
                ...prevDetails,
                [type]: prevDetails[type].map((detail, i) =>
                  i === index ? { ...detail, amount: newValue } : detail
                ),
              }));
            }}
          />
        </div>
      </div>
    ));
  };

  const calculateGrossSalary = (earnings, deductions) => {
    const totalEarnings = earnings.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    const totalDeductions = deductions.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    return totalEarnings - totalDeductions;
  };

  useEffect(() => {
    if (templateDetails) {
      const earnings = templateDetails.earnings || [];
      const deductions = templateDetails.deductions || [];
      setGrossSalary(calculateGrossSalary(earnings, deductions));
    }
  }, [templateDetails]);

  const saveSalaryTemplateEmployeeMapping = async (data) => {
    try {
      const response = await Payrollaction(
        PAYROLLAPI.SAVE_Salary_Template_Employee_Mapping,
        data
      );

      if (response.status === 200) {
        openNotification("success", "Successful", response.message);
      } else {
        openNotification("error", "Info", response.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error.message);
    }
  };

  const getCompanyIdFromLocalStorage = () => {
    return localStorageData.companyId;
  };

  useEffect(() => {
    const companyId = getCompanyIdFromLocalStorage();
    if (companyId) {
      fetchCompanyDetails(companyId).then((details) =>
        setCompanyDetails(details)
      );
    }

    const handleStorageChange = () => {
      const companyId = getCompanyIdFromLocalStorage();
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

  return (
    <>
      <DrawerPop
        placement="bottom"
        // style={
        //   my-drawer-content:  {
        //     background: "#000",

        //   }
        // }
        // placement="bottom"
        // width="100vw"
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
        background="#F8FAFC"
        open={show}
        close={(e) => {
          // console.log(e);
          formik.resetForm();
          formik2.resetForm();
          formik3.resetForm();
          formik4.resetForm();
          formik5.resetForm();
          handleClose();
        }}
        // className={classNames}
        // handleSubmit={(e) => {
        //   // console.log(e);
        //   formik.handleSubmit();
        //   // window.scrollTo({
        //   //   top: 0,
        //   //   behavior: "smooth", // Optional: Add smooth scrolling effect
        //   // });
        // }}
        updateBtn={isUpdate}
        updateFun={() => {
          // updateCompany();
        }}
        header={[
          !isUpdate
            ? t("Employee_Onboarding")
            : t("Update_Employee_Onboarding"),
          t("Complete_employee_Registration_Description"),
        ]}
        headerRight={
          <div className="flex md:gap-10 items-center">
            <p className="xl:text-sm text-[10px] font-medium text-gray-400">
              Draft Saved 10 Seconds ago
            </p>
            <div className="flex items-center gap-2.5">
              <p className="xl:text-sm text-xs font-medium text-gray-400">
                help
              </p>
              <RxQuestionMarkCircled className=" xl:text-2xl text-sm font-medium text-gray-400" />
            </div>
          </div>
        }
        footerBtn={[
          t("Cancel"),
          activeBtnValue === "assets_Docs" ? t("Save") : t("Save & Continue"),
        ]}
        footerBtnDisabled={loading}
        className="widthFull"
        stepsData={steps}
        handleSubmit={(e) => {
          if (activeBtnValue === "employeeDetails") {
            formik.handleSubmit();
          } else if (activeBtnValue === "addressDetails") {
            formik2.handleSubmit();
          } else if (activeBtnValue === "workDetails") {
            formik3.handleSubmit();
          } else if (activeBtnValue === "contact_Policy") {
            formik4.handleSubmit();
          } else if (activeBtnValue === "assets_Docs") {
            formik5.handleSubmit();
          }

          // if (active   Btn < 4 && activeBtn !== nextStep) {
          //   /// && activeBtn !== nextStep
          //   setActiveBtn(1 + activeBtn);
          //   setNextStep(activeBtn);
          //   console.log(1 + activeBtn);
          // }
        }}
        buttonClickCancel={(e) => {
          if (activeBtn > 0) {
            setPresentage(presentage - 1);
            setActiveBtn(activeBtn - 1);
            setNextStep(nextStep - 1);
            setActiveBtnValue(steps?.[activeBtn - 1].data);
          }
        }}
        nextStep={nextStep}
        activeBtn={activeBtn}
        saveAndContinue={false}
      >
        <div className="flex flex-col gap-10  max-w-[926px] mx-auto">
          <div className="z-50 px-5  dark:bg-[#1f1f1f] pb-8  ">
            {steps && (
              <Stepper
                currentStepNumber={activeBtn}
                presentage={presentage}
                // direction="left"
                // labelPlacement="vertical"
                steps={steps}
                addMore={addAdressstep}
                data={{
                  id: 2,
                  value: 1,

                  title: "Address Details ",
                  data: "addressDetails",
                }}
              />
            )}
          </div>

          {country && (
            <form action="submit" className=" flex  justify-center ">
              <div className="w-full flex justify-center ">
                {activeBtnValue === "employeeDetails" ? (
                  <div
                    ref={div1Ref}
                    className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark"
                  >
                    <Heading2
                      className={""}
                      title={t("Personal_Details")}
                      description={t("Personal_Details_Description")}
                    />

                    <div className="grid grid-cols-4 gap-3 borderb rounded-[15px] p-1.5 md:pr-4 !border-primaryalpha/20 bg-primaryalpha/5 dark:bg-primaryalpha/10 items-center">
                      <Flex gap={15} className="col-span-4 md:col-span-3">
                        <img
                          src={allCandidate}
                          alt=""
                          className="w-[82px] h-[66px] hidden md:block"
                        />
                        <div className="flex flex-col gap-1 justify-center">
                          <h1 className="text-xs lg:text-xs 2xl:text-sm font-semibold flex  items-center dark:text-white">
                            {t("candidate_Box")}
                            <span>
                              <LuAlertCircle className=" opacity-50 pl-1" />
                            </span>
                          </h1>
                          <p className="text-grey text-[10px] 2xl:text-xs font-medium">
                            {t("candidate_Box_Description")}
                          </p>
                        </div>
                      </Flex>
                      <div className="flex md:justify-end">
                        <ToggleBtn
                          flexText={true}
                          change={(e) => {
                            setAddAdressstep(e);
                            if (e) {
                              // If toggle is true, add a new step
                              const newSteps = [
                                ...steps.slice(0, 1), // Keep the first step as it is
                                {
                                  id: 2,
                                  value: 1,
                                  title: t("Address_Details"),
                                  data: "addressDetails",
                                },
                                ...steps.slice(1), // Add remaining steps
                              ];
                              setSteps(newSteps);
                            } else {
                              // If toggle is false, remove the second step
                              const newSteps = [
                                ...steps.slice(0, 1), // Keep the first step
                                ...steps.slice(2), // Skip the second step
                              ];
                              setSteps(newSteps);
                            }
                          }}
                          value={addAdressstep}
                        />
                      </div>
                    </div>
                    <FlexCol className={"md:grid grid-cols-2"}>
                      <FormInput
                        title={t("First_Name")}
                        value={formik.values.firstName}
                        placeholder={t("First_Name")}
                        change={(e) => {
                          formik.setFieldValue("firstName", e);
                          if (e) {
                            if (presentage < 0.1)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.errors.firstName}
                        required={true}
                        Alphabet={true}
                      />
                      <FormInput
                        title={t("Middle_Name")}
                        value={formik.values.middleName}
                        placeholder={t("Middle_Name")}
                        change={(e) => {
                          formik.setFieldValue("middleName", e);
                          if (e) {
                            if (presentage < 0.2)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.errors.middleName}
                        Alphabet={true}
                      />
                      <FormInput
                        title={t("Last_Name")}
                        value={formik.values.lastName}
                        placeholder={t("Last_Name")}
                        change={(e) => {
                          formik.setFieldValue("lastName", e);
                          if (e) {
                            if (presentage < 0.3)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.errors.lastName}
                        required={true}
                        Alphabet={true}
                      />
                      <FormInput
                        title={t("Nick_Name")}
                        value={formik.values.nickName}
                        placeholder={t("Nick_Name")}
                        change={(e) => {
                          formik.setFieldValue("nickName", e);
                          if (e) {
                            if (presentage < 0.4)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.errors.nickName}
                      />
                      <FormInput
                        title={t("Email")}
                        value={formik.values.email}
                        placeholder={t("Email")}
                        change={(e) => {
                          let value = e;
                          value = value.trim();
                          value = value.toLowerCase();
                          formik.setFieldValue("email", value);
                          if (e) {
                            if (presentage < 0.5)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        type="mail"
                        error={formik.errors.email}
                        required={true}
                        maxLength={50}
                      />
                      <FormInput
                        title={t("Mobile")}
                        value={formik.values.mobile}
                        placeholder={t("Mobile")}
                        change={(e) => {
                          const value = e.replace(/[^0-9]/g, "");
                          formik.setFieldValue("mobile", value);
                          if (value) {
                            if (presentage < 0.6) {
                              setPresentage(presentage + 0.1);
                            }
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.errors.mobile}
                        required={true}
                        maxLength={15}
                      />
                      <DateSelect
                        title={t("Date_Of_birth")}
                        value={formik.values.dateOfBirth}
                        defaultPickerValue="2006-01-01"
                        placeholder={t("Date_Of_birth")}
                        // value={2024-11-03}
                        change={(e) => {
                          formik.setFieldValue("dateOfBirth", e);
                          if (e) {
                            if (presentage < 0.7)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={
                          formik.values.dateOfBirth
                            ? ""
                            : formik.errors.dateOfBirth
                        }
                        required={true}
                        dateofBirth={true}
                      />

                      <RadioButton
                        title={t("Select_Gender")}
                        options={Gender}
                        value={formik.values.gender}
                        change={(e) => {
                          formik.setFieldValue("gender", e);
                          if (e) {
                            if (presentage < 0.8)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.values.gender ? "" : formik.errors.gender}
                        required={true}
                      ></RadioButton>
                      <Dropdown
                        title={t("Blood_Group")}
                        value={formik.values.bloodGroup}
                        placeholder={t("Blood_Group_placeholder")}
                        change={(e) => {
                          formik.setFieldValue("bloodGroup", e);
                          if (e) {
                            if (presentage < 0.9)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={
                          formik.values.bloodGroup
                            ? ""
                            : formik.errors.bloodGroup
                        }
                        options={bloodGroup}
                        required={true}
                      />

                      <Dropdown
                        title={t("Religion")}
                        value={formik.values.religion}
                        change={(e) => {
                          formik.setFieldValue("religion", e);
                          if (presentage < 1) setPresentage(presentage + 0.1);
                        }}
                        placeholder={t("Religion_placeholder")}
                        error={
                          formik.values.religion ? "" : formik.errors.religion
                        }
                        options={religion}
                      />
                      <FormInput
                        title={t("Father/Husband Name ")}
                        value={formik.values.fatherOrHusbandName}
                        placeholder={t("Father/Husband Name ")}
                        change={(e) => {
                          formik.setFieldValue("fatherOrHusbandName", e);
                          if (e) {
                            if (presentage < 1) setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik.errors.fatherOrHusbandName}
                      />
                    </FlexCol>
                  </div>
                ) : activeBtnValue === "addressDetails" ? (
                  <div
                    ref={div2Ref}
                    className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark"
                  >
                    <Heading2
                      className={""}
                      title={t("Communication_Address")}
                      description={t("Communication_Address_Description")}
                    />
                    <FlexCol className={"md:grid grid-cols-2"}>
                      <TextArea
                        title={t("Address")}
                        placeholder={t("Address")}
                        value={formik2.values.address}
                        change={(e) => {
                          formik2.setFieldValue("address", e);
                          if (sameDetails) {
                            formik2.setFieldValue("PermanentAddress", e);
                          }
                          if (e) {
                            if (presentage < 1.1)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={
                          formik2.values.address ? "" : formik2.errors.address
                        }
                        required={true}
                        className=" col-span-2"
                        rows={8}
                      />

                      <Dropdown
                        title={t("Country")}
                        placeholder={t("Choose Country")}
                        value={formik2.values.country}
                        change={(e) => {
                          formik2.setFieldValue("country", e);
                          formik2.setFieldValue("state", null);
                          formik2.setFieldValue("city", null);
                          if (sameDetails) {
                            formik2.setFieldValue("PermanentCountry", e);
                            formik2.setFieldValue("PermanentState", "");
                            formik2.setFieldValue("PermanentCity", "");
                          }
                          if (e) {
                            if (presentage < 1.5)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.country}
                        options={country}
                        required={true}
                      />
                      <Dropdown
                        title={t("State_Province")}
                        placeholder={t("Choose_State_Province")}
                        value={formik2.values.state}
                        change={(e) => {
                          formik2.setFieldValue("state", e);
                          formik2.setFieldValue("city", null);
                          if (sameDetails) {
                            formik2.setFieldValue("PermanentState", e);
                            formik2.setFieldValue("PermanentCity", "");
                          }
                          if (e) {
                            if (presentage < 1.3)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.state}
                        options={state}
                        required={true}
                      />
                      <Dropdown
                        title={t("City_Locality")}
                        placeholder={t("Choose_City_Locality")}
                        value={formik2.values.city}
                        change={(e) => {
                          formik2.setFieldValue("city", e);
                          if (sameDetails) {
                            formik2.setFieldValue("PermanentCity", e);
                          }
                          if (e) {
                            if (presentage < 1.2)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.city}
                        options={city}
                        required={true}
                      />

                      <FormInput
                        title={t("Postal_ZIP_Code")}
                        placeholder={t("Postal/ZIP Code")}
                        value={formik2.values.zipCode}
                        change={(e) => {
                          const value = e.replace(/[^0-9]/g, "");
                          formik2.setFieldValue("zipCode", value);

                          if (value) {
                            if (presentage < 1.4) {
                              setPresentage(presentage + 0.1);
                            }
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.zipCode}
                        required={true}
                        maxLength={8}
                      />
                    </FlexCol>
                    <div className="flex justify-between">
                      <Heading2
                        className={""}
                        title={t("Permanent_Address")}
                        description={t("Permanent_Address_Description")}
                      />

                      <div className="flex gap-2 items-center">
                        <CheckBoxInput
                          value={sameDetails}
                          change={(e) => {
                            setSameDetails(e);

                            if (e === 1) {
                              if (presentage < 2)
                                setPresentage(presentage + 0.5);

                              formik2.setFieldValue(
                                "PermanentAddress",
                                formik2.values.address
                              );
                              formik2.setFieldValue(
                                "PermanentCity",
                                formik2.values.city
                              );
                              formik2.setFieldValue(
                                "PermanentState",
                                formik2.values.state
                              );
                              formik2.setFieldValue(
                                "PermanentZipCode",
                                formik2.values.zipCode
                              );
                              formik2.setFieldValue(
                                "PermanentCountry",
                                formik2.values.country
                              );
                            } else {
                              setPresentage(presentage - 0.5);
                              formik2.setFieldValue("PermanentAddress", " ");
                              formik2.setFieldValue("PermanentCity", null);
                              formik2.setFieldValue("PermanentState", null);
                              formik2.setFieldValue("PermanentZipCode", "");
                              formik2.setFieldValue("PermanentCountry", null);
                            }
                          }}
                          titleRight={t("Set_same_as_communication_address")}
                        />
                      </div>
                    </div>
                    <FlexCol className={"md:grid grid-cols-2"}>
                      <TextArea
                        title={t("Address")}
                        placeholder={t("Address")}
                        value={formik2.values.PermanentAddress}
                        change={(e) => {
                          formik2.setFieldValue("PermanentAddress", e);
                          if (e) {
                            if (presentage < 1.6)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.PermanentAddress}
                        required={true}
                        className=" col-span-2"
                        rows={8}
                      />

                      <Dropdown
                        title={t("Country")}
                        placeholder={t("Choose Country")}
                        value={formik2.values.PermanentCountry}
                        change={(e) => {
                          formik2.setFieldValue("PermanentCountry", e);
                          formik2.setFieldValue("PermanentState", null);
                          formik2.setFieldValue("PermanentCity", null);
                          if (e) {
                            if (presentage < 2) setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.PermanentCountry}
                        options={country}
                        required={true}
                      />
                      <Dropdown
                        title={t("State_Province")}
                        placeholder={t("Choose State")}
                        value={formik2.values.PermanentState}
                        change={(e) => {
                          formik2.setFieldValue("PermanentState", e);
                          formik2.setFieldValue("PermanentCity", null);

                          if (e) {
                            if (presentage < 1.8)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.PermanentState}
                        options={Pstate}
                        required={true}
                      />
                      <Dropdown
                        title={t("City_Locality")}
                        placeholder={t("Choose City")}
                        value={formik2.values.PermanentCity}
                        change={(e) => {
                          formik2.setFieldValue("PermanentCity", e);
                          if (e) {
                            if (presentage < 1.7)
                              setPresentage(presentage + 0.1);
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.PermanentCity}
                        options={Pcity}
                        required={true}
                      />

                      <FormInput
                        title={t("Postal_ZIP_Code")}
                        placeholder={t("Postal/ZIP Code")}
                        value={formik2.values.PermanentZipCode}
                        change={(e) => {
                          const value = e.replace(/[^0-9]/g, "");
                          formik2.setFieldValue("PermanentZipCode", value);
                          if (value) {
                            if (presentage < 1.9) {
                              setPresentage(presentage + 0.1);
                            }
                          } else {
                            setPresentage(presentage - 0.1);
                          }
                        }}
                        error={formik2.errors.PermanentZipCode}
                        required={true}
                        maxLength={8}
                      />
                    </FlexCol>
                  </div>
                ) : activeBtnValue === "workDetails" ? (
                  <div ref={div3Ref} className="flex flex-col w-full gap-6">
                    <div className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark">
                      <Heading2
                        className={""}
                        title={t("Work_Details")}
                        description={t("Work_Details_Description")}
                      />
                      <FlexCol className={"md:grid grid-cols-2"}>
                        <Dropdown
                          title="Company"
                          placeholder="Select a company"
                          value={formik3.values.company}
                          change={(e) => {
                            const selectedCompany = company.find(
                              (company) => company.value === e
                            );
                            formik3.setFieldValue(
                              "company",
                              selectedCompany?.value || null
                            );
                            formik3.setFieldValue("designation", null);
                            formik3.setFieldValue("department", null);
                            formik3.setFieldValue("category", null);
                            formik3.setFieldValue("reports", null);
                            formik3.setFieldValue("location", null);
                            formik3.setFieldValue("shiftScheme", null);

                            if (selectedCompany) {
                              getLocation(selectedCompany.value); // Call getLocation with the selected companyId
                              getDepartment(selectedCompany.value);
                              if (presentage < 2.1)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          error={
                            formik3.touched.company && formik3.errors.company
                              ? formik3.errors.company
                              : ""
                          }
                          options={company}
                          required={true}
                        />
                        <Dropdown
                          title={t("Designation")}
                          placeholder={t("Choose Designation")}
                          value={formik3.values.designation || null}
                          change={(e) => {
                            formik3.setFieldValue("designation", e);
                            if (e) {
                              if (presentage < 2.2)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          error={formik3.errors.designation}
                          options={designationList}
                          required={true}
                        />
                        <Dropdown
                          title={t("Department")}
                          placeholder={t("Choose Department")}
                          value={formik3.values.department || null}
                          change={(e) => {
                            formik3.setFieldValue("department", e);
                            if (e) {
                              if (presentage < 2.3)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          error={formik3.errors.department}
                          options={departmentList}
                          required={true}
                        />
                        <Dropdown
                          title={t("Category")}
                          placeholder={t("Category_placeholder")}
                          value={formik3.values.category || null}
                          change={(e) => {
                            formik3.setFieldValue("category", e);
                            if (e) {
                              if (presentage < 2.4)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          error={formik3.errors.category}
                          options={categoryList}
                          required={true}
                        />
                        <Dropdown
                          title={t("Reports_To")}
                          placeholder={t("Reports_To_placeholder")}
                          value={formik3.values.reports}
                          change={(e) => {
                            formik3.setFieldValue("reports", e);
                            if (e) {
                              if (presentage < 2.5)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          error={formik3.errors.reports}
                          options={employee}
                          // required={true}
                          // icondropDown={true}
                        />
                        <DateSelect
                          title={t("Date_of_Join")}
                          value={formik3.values.dateOfJoin}
                          change={(e) => {
                            formik3.setFieldValue("dateOfJoin", e);
                            if (e) {
                              if (presentage < 2.6)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          error={formik3.errors.dateOfJoin}
                          // dateFormat="DD/MM/YYY"
                          required={true}
                          placeholder="Select"
                        />
                        <FormInput
                          title={"IBAN/Account Number"}
                          value={formik4.values.bankAccNo}
                          change={(e) => {
                            formik4.setFieldValue("bankAccNo", e);
                          }}
                          placeholder="Enter account number"
                        />
                        <Dropdown
                          title={"Choose bank"}
                          value={formik4.values.bankId}
                          options={bankDetails}
                          change={(e) => {
                            formik4.setFieldValue("bankId", e);
                          }}
                          placeholder="Choose bank name"
                        />
                        <Dropdown
                          title={t("Location")}
                          placeholder={t("Location_placeholder")}
                          value={formik3.values.location || null}
                          change={(e) => {
                            formik3.setFieldValue("location", e);
                            if (e) {
                              if (presentage < 2.8)
                                setPresentage(presentage + 0.2);
                            } else {
                              setPresentage(presentage - 0.2);
                            }
                          }}
                          error={formik3.errors.location}
                          options={location}
                          required={true}
                          // className=" col-span-2"
                        />
                        <Dropdown
                          title={t("Shift_Scheme")}
                          descriptionTop={t("descriptionTop")}
                          placeholder={t("Shift_Scheme_placeholder")}
                          value={formik3.values.shiftScheme}
                          change={(e) => {
                            formik3.setFieldValue("shiftScheme", e);
                            if (e) {
                              if (presentage < 2.9)
                                setPresentage(presentage + 0.2);
                            } else {
                              setPresentage(presentage - 0.2);
                            }
                          }}
                          error={formik3.errors.shiftScheme}
                          options={shiftSchemeList}
                          className=" col-span-1"
                          rightIcon={formik3.values.shiftScheme ? true : false}
                          PopoverContent={
                            <div className="w-[450px] 2xl:w-[590px] p-3 flex flex-col gap-4">
                              <div className="flex gap-2 items-center">
                                <div className="size-10 2xl:size-14 rounded-full">
                                  <img src={popupimg} />
                                </div>
                                <h2 className="text-[22px] 2xl:text-2xl font-bold">
                                  {shiftSchemeContentList?.shiftScheme}
                                </h2>
                              </div>
                              <div className=" flex items-center  ">
                                <div className="flex items-center gap-1 text-xs font-medium bg-green-100 rounded-full px-2 py-0.5">
                                  <RxDotFilled className="text-xl text-green-500 font-bold" />
                                  <p className="text-green-700 text-xs 2xl:text-sm font-medium">
                                    {t("Working_Time")}
                                  </p>
                                </div>
                              </div>
                              <div className=" bg-[#F6F6F6] dark:bg-[#0B1019] px-[19px] py-[17px] rounded-lg">
                                <p className=" text-grey text-xs 2xl:text-sm font-normal">
                                  The General Shift represents the core working
                                  hours typically spanning from 9:00 AM to 5:00
                                  PM within our organization. This shift
                                  structure offers employees a consistent
                                  schedule with two breaks—a brief 15-minute
                                  morning break...
                                </p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <h2 className="text-xs 2xl:text-sm font-medium">
                                  {t("Overview_of_one_week")}
                                </h2>
                                <div className="grid grid-cols-3 gap-[17px]">
                                  {popverArray?.map((each, i) => (
                                    <div
                                      className="  border rounded-xl px-3.5 py-[11px] "
                                      key={i}
                                    >
                                      <div className="flex items-center gap-1.5 ">
                                        {each.icon}
                                        <p className="text-xs 2xl:text-sm text-grey">
                                          {each.label}
                                        </p>
                                      </div>
                                      <h1 className="text-base 2xl:text-xl font-medium">
                                        {each.value}
                                      </h1>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </FlexCol>
                    </div>
                    {parseInt(companyDetails?.isPFESIenabled) === 1 && (
                      <Accordion
                        toggleBtn={true}
                        title={t(
                          "Would you like to enable statutory contributions for this employee?"
                        )}
                        description={t(
                          "Activate and configure benefits by filling in the required details for ESI, PF, EPS, and more."
                        )}
                        primarybg={false}
                        className={"w-full bg-white dark:bg-dark"}
                        initialExpanded={
                          formik3.values.statutoryStatus === "Y" ? true : false
                        }
                        change={(e) => {
                          formik3.setFieldValue(
                            "statutoryStatus",
                            e === 1 ? "Y" : "N"
                          );
                        }}
                      >
                        <div className="grid grid-cols-3 gap-8 w-full">
                          <FormInput
                            title={t("UAN")}
                            placeholder={t("UAN")}
                            value={formik3.values.uannumber}
                            change={(e) => {
                              formik3.setFieldValue("uannumber", e);
                            }}
                            error={formik3.errors.uannumber}
                          />
                          <FormInput
                            title={t("PAN Number")}
                            placeholder={t("PAN Number")}
                            value={formik3.values.pannumber}
                            change={(e) => {
                              formik3.setFieldValue("pannumber", e);
                            }}
                            error={formik3.errors.pannumber}
                          />
                          <FormInput
                            title={t("Aadhaar Number")}
                            placeholder={t("Aadhaar Number")}
                            value={formik3.values.aadhaarnumber}
                            change={(e) => {
                              formik3.setFieldValue("aadhaarnumber", e);
                            }}
                            error={formik3.errors.aadhaarnumber}
                          />
                          <FormInput
                            title={t("Aadhaar Enrollment Number")}
                            placeholder={t("Aadhaar Enrollment Number")}
                            value={formik3.values.aadhaarenrollmentnumber}
                            change={(e) => {
                              formik3.setFieldValue(
                                "aadhaarenrollmentnumber",
                                e
                              );
                            }}
                            error={formik3.errors.aadhaarenrollmentnumber}
                          />
                          <Dropdown
                            title={t("PF Eligible")}
                            placeholder={t("PF Eligible")}
                            options={[
                              { id: 1, value: "Yes", label: "Yes" },
                              { id: 2, value: "No", label: "No" },
                            ]}
                            value={formik3.values.PFeligible}
                            change={(e) =>
                              formik3.setFieldValue("PFeligible", e)
                            }
                          />
                          <DateSelect
                            title={t("PF Join Date")}
                            value={formik3.values.pfjoindate}
                            change={(e) => {
                              formik3.setFieldValue("pfjoindate", e);
                            }}
                          />
                          <FormInput
                            title={t("PF Number")}
                            placeholder={t("PF Number")}
                            value={epfformat(formik3.values.pfnumber)}
                            change={(e) => {
                              formik3.setFieldValue("pfnumber", e);
                            }}
                            error={formik3.errors.pfnumber}
                          />
                          <Dropdown
                            title={t("ESI Eligible")}
                            placeholder={t("ESI Eligible")}
                            options={[
                              { id: 1, value: "Yes", label: "Yes" },
                              { id: 2, value: "No", label: "No" },
                            ]}
                            value={formik3.values.ESIeligible}
                            change={(e) =>
                              formik3.setFieldValue("ESIeligible", e)
                            }
                          />
                          <FormInput
                            title={t("ESI Number")}
                            placeholder={t("ESI Number")}
                            value={esiformat(formik3.values.esinumber)}
                            change={(e) => {
                              formik3.setFieldValue("esinumber", e);
                            }}
                            error={formik3.errors.esinumber}
                          />
                          <Dropdown
                            title={t("PT Eligible")}
                            placeholder={t("PT Eligible")}
                            options={[
                              { id: 1, value: "Yes", label: "Yes" },
                              { id: 2, value: "No", label: "No" },
                            ]}
                            value={formik3.values.PTeligible}
                            change={(e) =>
                              formik3.setFieldValue("PTeligible", e)
                            }
                          />
                          <Dropdown
                            title={t("LWF Eligible")}
                            placeholder={t("LWF Eligible")}
                            options={[
                              { id: 1, value: "Yes", label: "Yes" },
                              { id: 2, value: "No", label: "No" },
                            ]}
                            value={formik3.values.LWFeligible}
                            change={(e) =>
                              formik3.setFieldValue("LWFeligible", e)
                            }
                          />
                          <Dropdown
                            title={t("EPS Eligible")}
                            placeholder={t("EPS Eligible")}
                            options={[
                              { id: 1, value: "Yes", label: "Yes" },
                              { id: 2, value: "No", label: "No" },
                            ]}
                            value={formik3.values.EPSeligible}
                            change={(e) =>
                              formik3.setFieldValue("EPSeligible", e)
                            }
                          />
                          <DateSelect
                            title={t("EPS Joining Date")}
                            placeholder={t("EPS Joining Date")}
                            value={formik3.values.epsjoiningdate}
                            change={(e) => {
                              formik3.setFieldValue("epsjoiningdate", e);
                            }}
                          />
                          <DateSelect
                            title={t("EPS Exit Date")}
                            placeholder={t("EPS Exit Date")}
                            value={formik3.values.epsexitdate}
                            change={(e) => {
                              formik3.setFieldValue("epsexitdate", e);
                            }}
                          />
                          <Dropdown
                            title={t("HPS Eligible")}
                            placeholder={t("HPS Eligible")}
                            options={[
                              { id: 1, value: "Yes", label: "Yes" },
                              { id: 2, value: "No", label: "No" },
                            ]}
                            value={formik3.values.HPSeligible}
                            change={(e) =>
                              formik3.setFieldValue("HPSeligible", e)
                            }
                          />
                        </div>
                      </Accordion>
                    )}
                  </div>
                ) : activeBtnValue === "contact_Policy" ? (
                  <div ref={div4Ref} className=" flex flex-col w-full gap-6">
                    <div className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark">
                      <FlexCol className={"md:grid grid-cols-2"}>
                        <Heading2
                          className={"col-span-2 "}
                          title={t("Probation_modal_title")}
                          description={t("Probation_titile_Description")}
                        />
                        <FormInput
                          title={t("Probation_period_units")}
                          placeholder={t("Probation Period in Days")}
                          change={(e) => {
                            const value = e.replace(/[^0-9]/g, "");
                            formik4.setFieldValue("probationPeriod", value);

                            if (value) {
                              if (presentage < 3.1) {
                                setPresentage(presentage + 0.2);
                              }
                            } else {
                              setPresentage(presentage - 0.2);
                            }
                          }}
                          value={formik4.values.probationPeriod}
                          error={
                            formik4.values.probationPeriod
                              ? ""
                              : formik4.errors.probationPeriod
                          }
                          required={true}
                          maxLength={5}
                        />
                        <FormInput
                          title={t("Notice_period_units")}
                          placeholder={t("Notice Period in Days")}
                          change={(e) => {
                            const value = e.replace(/[^0-9]/g, "");
                            formik4.setFieldValue("noticePeriod", value);

                            if (value) {
                              if (presentage < 3.1) {
                                setPresentage(presentage + 0.1);
                              }
                            } else {
                              setPresentage(presentage + 0.1);
                            }
                          }}
                          value={formik4.values.noticePeriod}
                          error={
                            formik4.values.noticePeriod
                              ? ""
                              : formik4.errors.noticePeriod
                          }
                          required={true}
                          maxLength={5}
                        />
                      </FlexCol>
                    </div>
                    <div className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark">
                      <FlexCol className={"md:grid grid-cols-2"}>
                        <Heading2
                          className={"col-span-2 "}
                          title={t("Work_Policy_Details")}
                          description={t("Work_Policy_Details_Description")}
                        />

                        <Dropdown
                          title={t("TimeIn_out_Policy")}
                          placeholder={t("Choose Time-In Out Policy")}
                          change={(e) => {
                            formik4.setFieldValue("timeInOut", e);
                            if (e) {
                              if (presentage < 3.2)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          value={formik4.values.timeInOut || null}
                          error={formik4.errors.timeInOut}
                          options={timeOutPolicy}
                        />
                        <Dropdown
                          title={t("Over_time_Policy")}
                          placeholder={t("Choose Over Time Policy")}
                          change={(e) => {
                            formik4.setFieldValue("overTime", e);
                            if (e) {
                              if (presentage < 3.3)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          value={formik4.values.overTime || null}
                          error={formik4.errors.overTime}
                          options={overTimePolicy}
                        />
                        <Dropdown
                          title={t("Attendance on Holidays")}
                          placeholder={t("Choose Attendance on Holidays")}
                          change={(e) => {
                            formik4.setFieldValue("shortTime", e);
                            if (e) {
                              if (presentage < 3.4)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          value={formik4.values.shortTime || null}
                          error={formik4.errors.shortTime}
                          options={shortTimePolicy}
                        />
                        <Dropdown
                          title={t("Miss_Punch_Policy")}
                          placeholder={t("Choose Miss Punch Policy")}
                          change={(e) => {
                            formik4.setFieldValue("missPunch", e);
                            if (e) {
                              if (presentage < 3.5)
                                setPresentage(presentage + 0.1);
                            } else {
                              setPresentage(presentage - 0.1);
                            }
                          }}
                          value={formik4.values.missPunch || null}
                          error={formik4.errors.missPunch}
                          options={missPunchPolicy}
                        />
                      </FlexCol>

                      <FlexCol className={"md:grid grid-cols-2"}>
                        <Heading2
                          className={""}
                          title="Applicable Leave Details"
                          description=" Fill Policy details of employee for registration."
                          // required={true}
                          titleClassname="2xl:text-[18px] text-xs"
                        />
                        <ButtonClick
                          BtnType="primary"
                          buttonName={"Set Leave Types"}
                          handleSubmit={() => {
                            handleShow();
                          }}
                        />

                        <Heading2
                          className={""}
                          title="Applicable Holiday"
                          description=" Fill Policy details of employee for registration."
                          // required={true}
                          titleClassname="2xl:text-[18px] text-xs"
                        />
                        <ButtonClick
                          BtnType="primary"
                          buttonName={t("Applicable Holiday")}
                          handleSubmit={() => {
                            setShowHoliday(true);
                          }}
                        />
                      </FlexCol>
                    </div>
                    <div className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark">
                      <FlexCol className={"md:grid grid-cols-2"}>
                        <Heading2
                          className={"col-span-2 "}
                          title={t("Approval Flow")}
                          description={t("Choose employee approval flows")}
                        />
                        <CascaderSelect
                          value={approvalFlowData}
                          options={dynamicData}
                          placeholder="Choose Approval Type"
                          onChange={(value) => {
                            setapprovalFlowData(value);
                          }}
                          title="Approval Type"
                        />
                      </FlexCol>
                    </div>

                    <div>
                      {salaryTemplateStatus === 0 && (
                        <div className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark">
                          <FlexCol className={"md:grid grid-cols-2"}>
                            <Heading2
                              className={""}
                              title="Salary Template"
                              description=" Fill Policy details of employee for registration."
                              // required={true}
                              titleClassname="2xl:text-[18px] text-xs"
                            />
                            <Dropdown
                              // title="Miss Punch Policy"
                              placeholder={t("Choose Salary Template")}
                              change={(e) => {
                                formik4.setFieldValue("salary", e);
                                setSelectedTemplate(e);
                                fetchTemplateDetails(e);
                                if (e) {
                                  if (presentage < 3.6)
                                    setPresentage(presentage + 0.1);
                                } else {
                                  setPresentage(presentage - 0.1);
                                }
                              }}
                              options={salaryTemplateList}
                              value={formik4.values.salary || null}
                              error={formik4.errors.salary}
                            />
                          </FlexCol>

                          {selectedTemplate && templateDetails && (
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-3.5">
                                <h6 className="h6 !text-[#6A4BFC] !font-semibold">
                                  Earnings
                                </h6>
                                <div className="flex flex-col gap-4">
                                  {renderFields(
                                    templateDetails.earnings,
                                    "earnings"
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col gap-3.5">
                                <h6 className="h6 !text-[#DC0000] !font-semibold">
                                  Deductions
                                </h6>
                                <div className="flex flex-col gap-4">
                                  {renderFields(
                                    templateDetails.deductions,
                                    "deductions"
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  activeBtnValue === "assets_Docs" && (
                    <div
                      ref={div5Ref}
                      className="flex flex-col gap-6 p-4 w-full borderb rounded-[10px] bg-white dark:bg-dark"
                    >
                      <FlexCol className={""}>
                        <div className="col-span-2 flex justify-between items-center">
                          <Heading2
                            className={" "}
                            title={t("Asset_Details")}
                            description={t(
                              "Fill_Asset_details_of_employee_for_registration"
                            )}
                          />
                        </div>
                      </FlexCol>
                      <FlexCol className={""}>
                        {addMoreAssets?.map((item, i) => (
                          <div className="flex flex-col gap-1" key={i}>
                            <FlexCol className=" md:grid grid-cols-2 p-6 rounded-md border-2 bg-primary/10">
                              {item.field?.map((each) =>
                                each.type === "dropdown" ? (
                                  <Dropdown
                                    title={each.title}
                                    placeholder="Choose Assets type"
                                    value={formik5.values[each.inputType]}
                                    change={(e) => {
                                      formik5.setFieldValue(each.inputType, e);
                                      if (e) {
                                        if (presentage < 3.7)
                                          setPresentage(presentage + 0.1);
                                      } else {
                                        setPresentage(presentage - 0.1);
                                      }
                                    }}
                                    error={formik5.errors[each.inputType]}
                                    options={assetsTypes}
                                    // required={each.required}
                                  />
                                ) : each.type === "input" ? (
                                  <FormInput
                                    title={each.title}
                                    placeholder={t("AssetsName")}
                                    value={formik5.values[each.inputType]}
                                    change={(e) => {
                                      formik5.setFieldValue(each.inputType, e);
                                      if (e) {
                                        if (presentage < 3.8)
                                          setPresentage(presentage + 0.1);
                                      } else {
                                        setPresentage(presentage - 0.1);
                                      }
                                    }}
                                    error={
                                      formik5.values[each.inputType]
                                        ? ""
                                        : formik5.errors[each.inputType]
                                    }
                                    // required={each.required}
                                  />
                                ) : each.type === "textArea" ? (
                                  <TextArea
                                    className=" col-span-2"
                                    title={each.title}
                                    placeholder={t("Description")}
                                    value={formik5.values[each.inputType]}
                                    change={(e) => {
                                      formik5.setFieldValue(each.inputType, e);
                                      if (e) {
                                        if (presentage < 3.9)
                                          setPresentage(presentage + 0.1);
                                      } else {
                                        setPresentage(presentage - 0.1);
                                      }
                                    }}
                                    error={formik5.errors[each.inputType]}
                                  />
                                ) : each.type === "renewalDate" ? (
                                  <div className="col-span-2">
                                    <DateSelect
                                      className="half"
                                      title={each.title}
                                      placeholder={each.placeholder}
                                      value={formik5.values[each.inputType]}
                                      change={(e) => {
                                        formik5.setFieldValue(
                                          each.inputType,
                                          e
                                        );
                                        if (e) {
                                          if (presentage < 3.9)
                                            setPresentage(presentage + 0.1);
                                        } else {
                                          setPresentage(presentage - 0.1);
                                        }
                                      }}
                                      error={
                                        formik5.values[each.inputType]
                                          ? ""
                                          : formik5.errors[each.inputType]
                                      }
                                      // required={each.required}
                                    />
                                  </div>
                                ) : each.type === "radio" ? (
                                  <>
                                    <Heading2
                                      className={" "}
                                      title={each.title}
                                      description={each.description}
                                    />
                                    <RadioButton
                                      className="text-start"
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
                                      value={parseInt(
                                        formik5.values[each.inputType]
                                      )}
                                      change={(e) => {
                                        formik5.setFieldValue(
                                          each.inputType,
                                          parseInt(e)
                                        );
                                        if (e) {
                                          if (presentage < 3.9)
                                            setPresentage(presentage + 0.1);
                                        } else {
                                          setPresentage(presentage - 0.1);
                                        }
                                        if (parseInt(e) === 1) {
                                          addMoreAssets.map((data) => {
                                            data.id === item.id &&
                                              item.field.splice(
                                                6,
                                                0,
                                                {
                                                  title: "Warranty Expiry",
                                                  type: "date",
                                                  inputType:
                                                    "warrantyExpiry" + data.id,
                                                  placeholder: "dd-mm-yyyy",
                                                }
                                                // {
                                                //   title: "Asset Renewal",
                                                //   type: "date",
                                                //   inputType:
                                                //     "assetRenewal" + e.clientX,
                                                //   placeholder: "dd-mm-yyyy",
                                                // }
                                              );
                                          });
                                        } else {
                                          addMoreAssets.map((data) => {
                                            data.id === item.id &&
                                              item.field.splice(4, 2);
                                          });
                                        }
                                      }}
                                      error={formik5.errors[each.inputType]}
                                    />
                                  </>
                                ) : (
                                  each.type === "date" && (
                                    <DateSelect
                                      title={each.title}
                                      placeholder={each.placeholder}
                                      value={formik5.values[each.inputType]}
                                      change={(e) => {
                                        formik5.setFieldValue(
                                          each.inputType,
                                          e
                                        );
                                        if (e) {
                                          if (presentage < 3.9)
                                            setPresentage(presentage + 0.1);
                                        } else {
                                          setPresentage(presentage - 0.1);
                                        }
                                      }}
                                      error={
                                        formik5.values[each.inputType]
                                          ? ""
                                          : formik5.errors[each.inputType]
                                      }
                                      // required={each.required}
                                    />
                                  )
                                )
                              )}
                            </FlexCol>
                            <div className="flex justify-end">
                              <Tooltip placement="topLeft" title="Delete">
                                <PiTrash
                                  className="hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark cursor-pointer"
                                  onClick={() => handleDeleteAsset(item.id)}
                                />
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </FlexCol>
                      <div
                        className="flex items-center justify-center cursor-pointer hover:text-primary"
                        onClick={(e) => {
                          setAddMoreassets([
                            ...addMoreAssets,
                            {
                              id: e.clientX,
                              rowType: "Two" + e.clientX,
                              field: [
                                {
                                  title: "Asset Type",
                                  type: "dropdown",
                                  inputType: "assetId" + e.clientX,
                                  required: true,
                                },
                                {
                                  title: "Asset Name",
                                  type: "input",
                                  inputType: "assetName" + e.clientX,
                                  required: true,
                                },
                                {
                                  title: "Description",
                                  type: "textArea",
                                  inputType: "assetDescription" + e.clientX,
                                },
                                {
                                  title: "Asset Renewal",
                                  type: "renewalDate",
                                  inputType: "assetRenewal" + e.clientX,
                                  placeholder: "dd-mm-yyyy",
                                },
                                {
                                  title: "Is asset under warranty",
                                  description: "Set asset warrant informations",
                                  type: "radio",
                                  inputType: "isWarranty" + e.clientX,
                                },
                              ],
                            },
                          ]);
                        }}
                      >
                        <HiPlus className=" bg-gray-100 rounded-full p-1 text-2xl dark:bg-slate-600" />
                        <p className="mb-0 pl-[8px] tex-sm font-semibold opacity-50">
                          {t("Add_More")}
                        </p>
                      </div>

                      <div className="w-full borderb"></div>
                      <FlexCol className={""}>
                        <div className=" col-span-2 flex justify-between items-center">
                          <Heading2
                            className={" "}
                            title={t("Document_Details")}
                            description={t(
                              "Fill_Asset_details_of_employee_for_registration"
                            )}
                          />
                        </div>
                        <FlexCol className="  ">
                          {/* <img src={}alt="" /> */}
                          {addMoreDocuments?.map((item, i) => (
                            <div className="flex flex-col gap-1" key={i}>
                              <FlexCol className=" md:grid grid-cols-2 p-6 rounded-md border-2 bg-primary/10">
                                {item?.field?.map((each) =>
                                  each.type === "dropdown" ? (
                                    <Dropdown
                                      title={each.title}
                                      placeholder=" Choose Document Types"
                                      value={formik5.values[each.inputType]}
                                      change={(e) => {
                                        formik5.setFieldValue(
                                          each.inputType,
                                          e
                                        );
                                        if (e) {
                                          if (presentage < 3.9)
                                            setPresentage(presentage + 0.1);
                                        } else {
                                          setPresentage(presentage - 0.1);
                                        }
                                      }}
                                      error={
                                        formik5.values[each.inputType]
                                          ? ""
                                          : formik5.errors[each.inputType]
                                      }
                                      options={documentTypes}
                                      // required={true}
                                    />
                                  ) : each.type === "input" ? (
                                    <FormInput
                                      title={each.title}
                                      placeholder={t("Document_Name")}
                                      value={formik5.values[each.inputType]}
                                      change={(e) => {
                                        formik5.setFieldValue(
                                          each.inputType,
                                          e
                                        );
                                        if (e) {
                                          if (presentage < 3.9)
                                            setPresentage(presentage + 0.1);
                                        } else {
                                          setPresentage(presentage - 0.1);
                                        }
                                      }}
                                      error={
                                        formik5.values[each.inputType]
                                          ? ""
                                          : formik5.errors[each.inputType]
                                      }
                                      // required={true}
                                    />
                                  ) : each.type === "upload" ? (
                                    <div className="col-span-2">
                                      <FileUpload
                                        display="block"
                                        // flex={false}
                                        change={(e) => {
                                          // formik5.setFieldValue(

                                          formik5.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                        }}
                                      />
                                    </div>
                                  ) : each.type === "radio" ? (
                                    <>
                                      <Heading2
                                        className={" "}
                                        title={each.title}
                                        description={each.description}
                                      />
                                      <RadioButton
                                        className="text-start"
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
                                        value={parseInt(
                                          formik5.values[each.inputType]
                                        )}
                                        change={(e) => {
                                          formik5.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                          if (e) {
                                            if (presentage < 3.9)
                                              setPresentage(presentage + 0.1);
                                          } else {
                                            setPresentage(presentage - 0.1);
                                          }
                                          if (parseInt(e) === 1) {
                                            addMoreDocuments.map((data) => {
                                              data.id === item.id &&
                                                item.field.splice(5, 0, {
                                                  title: "Renewal Date",
                                                  type: "date",
                                                  inputType:
                                                    "renewalDate" + e.clientX,
                                                  placeholder: "dd-mm-yyyy",
                                                });
                                            });
                                          } else {
                                            addMoreDocuments.map((data) => {
                                              data.id === item.id &&
                                                item.field.splice(5, 1);
                                            });
                                          }
                                        }}
                                        error={formik5.errors[each.inputType]}
                                      />
                                    </>
                                  ) : each.type === "textArea" ? (
                                    <TextArea
                                      className=" col-span-2"
                                      title={each.title}
                                      placeholder={t("Description")}
                                      value={formik5.values[each.inputType]}
                                      change={(e) => {
                                        formik5.setFieldValue(
                                          each.inputType,
                                          e
                                        );
                                        if (e) {
                                          if (presentage < 3.9)
                                            setPresentage(presentage + 0.1);
                                        } else {
                                          setPresentage(presentage - 0.1);
                                        }
                                      }}
                                      rows={8}
                                      error={formik5.errors[each.inputType]}
                                    />
                                  ) : (
                                    each.type === "date" && (
                                      <DateSelect
                                        className={each.className}
                                        title={each.title}
                                        placeholder={each.placeholder}
                                        value={formik5.values[each.inputType]}
                                        change={(e) => {
                                          formik5.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                          if (e) {
                                            if (presentage < 3.9)
                                              setPresentage(presentage + 0.1);
                                          } else {
                                            setPresentage(presentage - 0.1);
                                          }
                                        }}
                                        error={
                                          formik5.values[each.inputType]
                                            ? ""
                                            : formik5.errors[each.inputType]
                                        }
                                        // required={each.required}
                                      />
                                    )
                                  )
                                )}
                              </FlexCol>
                              <div className="flex justify-end">
                                <Tooltip placement="topLeft" title="Delete">
                                  <PiTrash
                                    className="hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark cursor-pointer"
                                    onClick={() =>
                                      handleDeleteDocument(item.id)
                                    }
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          ))}
                        </FlexCol>
                      </FlexCol>
                      <div className="">
                        <div
                          className="flex items-center justify-center cursor-pointer hover:text-primary"
                          onClick={(e) => {
                            setAddMoreDocuments([
                              ...addMoreDocuments,
                              {
                                id: e.clientX,
                                rowType: "Two" + e.clientX,
                                field: [
                                  {
                                    title: "Document Types",
                                    type: "dropdown",
                                    inputType: "documentId" + e.clientX,
                                  },
                                  {
                                    title: "Document",
                                    type: "input",
                                    inputType: "document" + e.clientX,
                                  },
                                  {
                                    title: "Is asset under warranty",
                                    description:
                                      "Set asset warrant informations",
                                    type: "upload",
                                    inputType: "uploadFile" + e.clientX,
                                  },
                                  {
                                    title: "Description",
                                    type: "textArea",
                                    inputType:
                                      "documentDescription" + e.clientX,
                                  },
                                  {
                                    title: "Is document under renewal",
                                    description:
                                      "Set asset warrant informations",
                                    type: "radio",
                                    inputType: "isWarrantyDocument" + e.clientX,
                                  },
                                ],
                              },
                            ]);
                          }}
                        >
                          <HiPlus className=" bg-gray-100 rounded-full p-1 text-2xl dark:bg-slate-600" />
                          <p className="mb-0 pl-[8px] tex-sm font-semibold opacity-50">
                            {t("Add_More")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </form>
          )}
        </div>
      </DrawerPop>

      {openLeave && (
        <DrawerPop
          contentWrapperStyle={{
            width: "550px",
          }}
          handleSubmit={(e) => {
            setOpenLeave(false);
          }}
          header={[
            !isUpdate ? t("Leave Presets") : t("Update Leave Presets"),
            !isUpdate ? t("Leave Presets") : t("Update Leave Presets"),
          ]}
          footerBtn={[
            t("Cancel"),
            !isUpdate ? t("Save & Continue") : t("Update_Category"),
          ]}
          footerBtnDisabled={loading}
          open={openLeave}
          close={() => {
            setOpenLeave(false);
          }}
        >
          <FlexCol>
            <Flex gap={8}>
              <CheckBoxInput
                change={(e) => {
                  setAllSelectLeavePresets(e);
                  setLeaveTypes((prevSwitches) =>
                    prevSwitches?.map((sw) => ({ ...sw, select: e }))
                  );
                }}
                value={allSelectLeavePresets}
                titleRight="Select All Types"
              />
            </Flex>

            {leavetypes.map((each) => (
              <Flex
                justify="space-between"
                align="center"
                className=" rounded-xl p-2.5 borderb hover:bg-primaryalpha/10 dark:hover:bg-primaryalpha/25"
              >
                <Flex className="" align="center">
                  <CheckBoxInput
                    change={(e) => {
                      handleToggleList(each.value, e);
                      setLeavePolicyDetails({ ...leavePolicyDetails, each });
                      formik4.setFieldValue("leave", e);
                    }}
                    value={each.select}
                  />
                  <div className="rounded-lg vhcenter w-12 h-12 bg-primaryalpha/5">
                    <img
                      src={each.img}
                      alt=""
                      className=" w-[51px] h-[52px] p-3.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <span className="font-semibold text-xs 2xl:text-sm">
                      {" "}
                      {each.title.charAt(0).toUpperCase() + each.title.slice(1)}
                    </span>
                    <span className="text-grey text-[10px] 2xl:text-xs">
                      {each.subtitle}
                    </span>
                  </div>
                </Flex>
                <Popover
                  placement="left"
                  title={
                    <p className="text-xs 2xl:text-sm font-semibold">
                      {each.title.charAt(0).toUpperCase() + each.title.slice(1)}{" "}
                    </p>
                  }
                  content={
                    <p className="w-52 text-[10px] 2xl:text-xs text-grey">
                      {each.description}
                    </p>
                  }
                >
                  <TbAlertCircleFilled className=" text-xl text-[#E8E8E8] hover:text-primary cursor-pointer transform duration-300" />
                </Popover>
              </Flex>
            ))}
          </FlexCol>
        </DrawerPop>
      )}

      {showHoliday && (
        <DrawerPop
          contentWrapperStyle={{
            width: "550px",
          }}
          handleSubmit={(e) => {
            setShowHoliday(false);
          }}
          header={[
            !isUpdate
              ? t("Applicable Holiday")
              : t("Update Applicable Holiday"),
            !isUpdate
              ? t("Applicable Holiday")
              : t("Update Applicable Holiday"),
          ]}
          footerBtn={[
            t("Cancel"),
            !isUpdate ? t("Save & Continue") : t("Update Holiday"),
          ]}
          footerBtnDisabled={loading}
          open={showHoliday}
          close={() => {
            setShowHoliday(false);
          }}
        >
          <FlexCol>
            <Flex gap={8}>
              <CheckBoxInput
                change={(e) => {
                  setAllSelectHolidayPresets(e);
                  setHolidays((prevSwitches) =>
                    prevSwitches?.map((sw) => ({ ...sw, select: e }))
                  );
                }}
                value={allSelectHolidayPresets}
                titleRight="Select All Types"
              />
            </Flex>

            {holidays.map((each) => (
              <Flex
                gap={8}
                justify="space-between"
                align="center"
                className=" rounded-xl p-2.5 borderb hover:bg-primaryalpha/10 dark:hover:bg-primaryalpha/25"
              >
                <Flex className="" align="center" justify="center">
                  <CheckBoxInput
                    change={(e) => {
                      handleToggleHolidayList(each.value, e);
                      setHolidayPolicyDetails({
                        ...holidayPolicyDetails,
                        each,
                      });
                      formik4.setFieldValue("holiday", e);
                    }}
                    value={each.select}
                    classname="flex justify-center"
                  />
                  <div className="rounded-lg vhcenter w-12 h-12 bg-primaryalpha/5">
                    <img
                      src={each.img}
                      alt=""
                      className=" w-[51px] h-[52px] p-3.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <span className="font-semibold text-xs 2xl:text-sm">
                      {" "}
                      {each.title.charAt(0).toUpperCase() + each.title.slice(1)}
                    </span>
                    <span className="text-grey text-[10px] 2xl:text-xs">
                      {each.subtitle}
                    </span>
                  </div>
                </Flex>
                <Popover
                  placement="left"
                  title={
                    <p className="text-xs 2xl:text-sm font-semibold">
                      {each.title.charAt(0).toUpperCase() + each.title.slice(1)}{" "}
                    </p>
                  }
                  content={
                    <p className="w-52 text-[10px] 2xl:text-xs text-grey">
                      {each.description}
                    </p>
                  }
                >
                  <TbAlertCircleFilled className=" text-xl text-[#E8E8E8] hover:text-primary cursor-pointer transform duration-300" />
                </Popover>
              </Flex>
            ))}
          </FlexCol>
        </DrawerPop>
      )}
    </>
  );
}

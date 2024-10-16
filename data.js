import cash from "../assets/images/Cash.png";
import workplace from "../assets/images/policy/hourglass.png";
import workaholic from "../assets/images/policy/fingerprint.png";
import deadline from "../assets/images/policy/work timing.png";
import time from "../assets/images/policy/Time.png";
import VectorLine from "../assets/images/policy/Vector.png";

import document from "../assets/images/documents_5972418 1.png";
import pricing from "../assets/images/pricing_12015225 (1) 1.png";
import Avatar from "../assets/images/Avatar.png";
import whatsapp from "../assets/images/whats app.png";
import linkedIn from "../assets/images/Linked.png";
import Message from "../assets/images/Message.png";

import passport from "../assets/images/onBoarding/Passport.png";
import group from "../assets/images/onBoarding/Group.png";
import bank from "../assets/images/onBoarding/bank.png";
import educationCertificate from "../assets/images/onBoarding/Education Certificate.png";

// Leave Template

import TravelLocation from "../assets/images/leave/TravelLocation.svg";
import Virus from "../assets/images/leave/virus.svg";
import Mother from "../assets/images/leave/mother.svg";
import Kaaba from "../assets/images/leave/kaaba.svg";
import Calendar from "../assets/images/leave/Calendar.svg";
import {
  PiCalendarXDuotone,
  PiClockClockwise,
  PiCloudWarningBold,
  PiDownloadSimpleBold,
  PiHandCoins,
  PiLockOpenBold,
} from "react-icons/pi";
import { title } from "faker/lib/locales/az";
import { TbSettingsCheck } from "react-icons/tb";
import { LuCalendarClock } from "react-icons/lu";

// const { t } = useTranslation();

const bloodGroup = [
  {
    id: 1,
    label: "A+",
    value: "A+",
  },
  {
    id: 2,
    label: "A-",
    value: "A-",
  },
  {
    id: 3,
    label: "B+",
    value: "B+",
  },
  {
    id: 2,
    label: "B-",
    value: "B-",
  },
  {
    id: 2,
    label: "AB+",
    value: "AB+",
  },
  {
    id: 2,
    label: "AB-",
    value: "AB-",
  },
  {
    id: 2,
    label: "O+",
    value: "O+",
  },
  {
    id: 2,
    label: "O-",
    value: "O-",
  },
];
const leavelimitPer = [
  {
    id: 1,
    label: "Monthly",
    value: "Monthly",
  },
  {
    id: 2,
    label: "Quarterly",
    value: "Quarterly",
  },
  {
    id: 3,
    label: "Half Yearly",
    value: "Half Yearly",
  },
  {
    id: 4,
    label: "Annually",
    value: "Annualy",
  },
];
const Multiplyer = [
  { value: "1", label: "1x" },
  { value: "1.5", label: "1.5x" },
  { value: "2", label: "2x" },
  { value: "3", label: "3x" },
  { value: "4", label: "4x" },
  { value: "5", label: "5x" },
];
const regularOvertime = [
  {
    id: 1,
    title: "Fixed Rate",
    description:
      "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
    image: (
      <PiLockOpenBold className=" active:text-primary focus:text-primary" />
    ),
    value: "fixedRate",
  },
  {
    id: 2,
    title: "Custom Rate",
    description:
      "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
    image: (
      <TbSettingsCheck className=" active:text-primary focus:text-primary" />
    ),
    value: "customRate",
  },
  {
    id: 3,
    title: "Complimentary Off",
    description:
      "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
    image: (
      <LuCalendarClock className=" active:text-primary focus:text-primary" />
    ),
    value: "complimentaryOff",
  },
];
const attendanceOnHolidays = [
  {
    id: 1,
    title: "Salary Multiplier",
    description: "Consider attendance on holiday as working day.",
    image: <PiHandCoins className=" active:text-primary focus:text-primary" />,
    value: "salaryMultiplier",
  },
  {
    id: 2,
    title: "Combo Off",
    description: "Consider attendance on holidays as comp off.",
    image: (
      <PiCalendarXDuotone className=" active:text-primary focus:text-primary" />
    ),
    value: "comboOff",
  },
  {
    id: 3,
    title: "Overtime",
    description: "Consider attendance on holidays as comp off.",
    image: (
      <PiClockClockwise className=" active:text-primary focus:text-primary" />
    ),
    value: "overtime",
  },
  {
    id: 4,
    title: "Don't Consider",
    description: "Consider attendance on holidays as comp off.",
    image: (
      <PiCalendarXDuotone className=" active:text-primary focus:text-primary" />
    ),
    value: "doNotConsider",
  },
];

const automationPolicies = [
  {
    id: 1,
    title: "Time In-Out Policies",
    description:
      "Automate rules for employees who are coming late, taking breaks more than the allotted time or leaving earlier than the shift out-time",
    value: 1,
    img: workplace,
    bgImage: VectorLine,
  },
  {
    id: 2,
    title: "Over Time Policy",
    description:
      "Automate overtime for employees who are working extra after their shift hours",
    value: 2,
    img: time,
    bgImage: VectorLine,
  },
  {
    id: 3,
    title: "Attendance on Holidays",
    description:
      "Automate rule for employees who are leaving earlier than the allotted working hours",
    value: 3,
    img: deadline,
    bgImage: VectorLine,
  },
  {
    id: 4,
    title: "Miss Punch Policy",
    description:
      "Set rules for handling instances when employees fail to punch in or out accurately",
    value: 4,
    img: workaholic,
    bgImage: VectorLine,
  },
];
const allowanceType = [
  { value: "fixedAmount", label: "Fixed Amount" },
  { value: "multiplier", label: "Multiplier" },
];
const MultiplyBy = [
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
];

const customType = [
  // {
  //   id: 1,
  //   title: "Fixed Amount",
  //   value: "fixedAmount",
  // },
  { id: 1, label: "Fixed Amount", value: "fixedAmount" },
  { id: 2, label: "Salary Multiplyer", value: "salaryMultiplyer" },
];

const deductionTypeOption = [
  // {
  //   label: "Warning",
  //   value: "warning",
  //   icon: <PiCloudWarningBold className="font-bold text-primary" />,
  // },
  {
    value: "halfDay",
    label: "Half Day",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
  {
    value: "fullDay",
    label: "Full Day",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
  {
    value: "perMinutes",
    label: "Per Minutes",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
  {
    value: "fixedAmount",
    label: "Fixed Amount",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
];
const missPunchDeductionTypeOption = [
  {
    value: "halfDay",
    label: "Half Day",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
  {
    value: "fullDay",
    label: "Full Day",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
  // {
  //   value: "perMinutes",
  //   label: "Per Minutes",
  //   icon: <PiCloudWarningBold className="font-bold text-primary" />,
  // },
  {
    value: "fixedAmount",
    label: "Fixed Amount",
    icon: <PiCloudWarningBold className="font-bold text-primary" />,
  },
];
const Deduction = [
  { value: "basicSalary", label: "Basic Salary" },
  { value: "grossSalary", label: "Gross Salary" },
];

const occurrence = [
  { label: "1 times", value: 1 },
  { label: "2 times", value: 2 },
  { label: "3 times", value: 3 },
  { label: "4 times", value: 4 },
  { label: "5 times", value: 5 },
  { label: "more than 10 times", value: "more than 10 times" },
];
const occurrenceType = [
  { label: "Count", value: "count" },
  { label: "Time", value: "time" },
];
const DaysDivider = [
  { label: "30 Days", value: "30Days" },
  { label: "Calender Days", value: "calanderDays" },
  { label: "Working days", value: "workingDays" },
];

const DaysDividerPayrollConfiguration = [
  { label: "30 Days", value: "30Days" },
  { label: "Calender Days", value: "calanderDays" },
  { label: "Custom days", value: "CustomDays" },
  { label: "Exclude Week Offs", value: "excludeweekoffs" },
];

const lateentrypolicy = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If Employee Late More Than",
        type: "time",
        inputType: "lateEntryMinutesOne",
        description: "No late fine for _ mins",
        // line: true,
        display: true,
      },
      {
        title: "Deduction Type",
        type: "dropdown",
        inputType: "lateEntryDeductionTypeOne",
        description: "Description",
        // valuecheck: "DeductionType",
        // line: true,
        option: deductionTypeOption,
        // icon: true,
        // display: true,
      },
      {
        title: "Deduction From",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "lateEntryDeductionComponent",
        // description: "Lorem ipsum dolor sit amet",
        // line: true,
        changeValue: true,
        option: Deduction,
        // display: true,
      },
      // {
      //   title: "Deduction Component",
      //   type: "dropdown",
      //   inputType: "lateEntryDeductionTypeOne",
      //   description: "Lorem ipsum dolor sit amet",
      //   line: true,
      //   option: Deduction,
      //   display: false,
      // },
      {
        title: "Days",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "lateEntryDays",
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
      //   enter: "number",
      //   Occurrence: true,
      //   valuecheck: "SetOccurrence",
      //   inputType: "lateEntryOccurrenceOne",
      //   description: "Fine will effect after _ occurunce",
      //   line: true,
      //   display: true,
      // },
    ],
  },
];

const breakRule = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If Employee Late More Than",
        type: "time",
        inputType: "breakRuleMinutesTwo",
        description: "No late fine for _ mins",
        line: true,
      },
      {
        title: "Deduction Type",
        type: "dropdown",
        inputType: "breakRuleDeductionTypeTwo",
        description: "Description",
        line: true,
        option: deductionTypeOption,
      },
      {
        title: "Deduction From",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "breakRulDeductionComponent",
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
        inputType: "breakRuleDays",
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
      //     "breakRuleOccurrenceTwo" + e.clientX,
      //   description:
      //     "Fine will effect after _ occurunce",
      // },
    ],
  },
];

const exitRule = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If Employee Leave Early By",
        type: "time",
        inputType: "exitRuleMinutesOne",
        description: "No late fine for _ mins",
        line: true,
      },
      {
        title: "Deduction Type",
        type: "dropdown",
        inputType: "exitRuleDeductionTypeOne",
        description: "Description",
        // valuecheck: "DeductionComponent",
        line: true,
        option: deductionTypeOption,
        // icon: true,
      },
      {
        title: "Deduction From",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "exitRuleDeductionComponent",
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
        inputType: "exitRuleDay",
        // description:
        //   "Lorem ipsum dolor sit amet",
        divline: true,
        option: DaysDivider,
        display: true,
      },
      // {
      //   title: "Set Occurrence",
      //   valuecheck: "SetOccurrence",
      //   type: "dropdown",
      //   option: occurrence,
      //   Occurrence: true,
      //   inputType: "exitRuleOccurrenceOne",
      //   description: "Fine will effect after _ occurunce",
      // },
    ],
  },
];

const extraHoursOnWeekDays = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If Employee works more than",
        type: "time",
        inputType: "extraHoursMinutes",
        description: "Description",
        line: true,
      },
      // {
      //   title: "Deduction Type",
      //   type: "dropdown",
      //   inputType: "extraHoursAllowanceType",
      //   description: "Automate late fine for employee",
      //   line: true,
      //   option: deductionTypeOption,
      //   icon: true,
      // },
      // {
      //   title: "Set Occurrence",
      //   // valuecheck: "SetOccurrence",
      //   type: "dropdown",
      //   option: occurrence,
      //   inputType: "customRateOccurrence",
      //   description: "Fine will effect after _ occurunce",
      // },
      {
        title: "Amount Per Minute",
        type: "input",
        enter: "number",
        inputType: "extraHoursAmmount",
        placeholder: "Type here...",
        description: "Description",
      },
    ],
  },
];

const customRateExtraHours = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If Employee works more than",
        type: "time",
        inputType: "customRateMinutes",
        description: "Description",
        line: true,
      },
      {
        title: " Type",
        type: "dropdown",
        inputType: "customRateType",
        description: "Description",
        // line: true,
        option: customType,
      },
      // {
      //   title: "Deduction From",
      //   type: "dropdown",
      //   inputType: "customRateComponent",
      //   changeValue: true,

      //   option: Deduction,
      //   // display: true,
      // },
      // {
      //   title: "Amount",
      //   titleChange: true,
      //   type: "input",
      //   enter: "text",
      //   enterDigits: "6",
      //   inputType: "customRateAmmount",
      //   placeholder: "Type here...",
      //   description: "Description",
      // },
      // {
      //   title: "Deduction Type",
      //   type: "dropdown",
      //   inputType: "customRateDeductionType",
      //   description: "Automate late fine for employee",
      //   line: true,
      //   option: deductionTypeOption,
      //   icon: true,
      // },
      // {
      //   title: "Set Occurrence",
      //   // valuecheck: "SetOccurrence",
      //   type: "dropdown",
      //   option: occurrence,
      //   inputType: "customRateOccurrence",
      //   description: "Fine will effect after _ occurunce",
      // },
      // {
      //   inputCount: 1,
      //   title: "Multiply by ",
      //   type: "dropdown",
      //   inputType: "customRateMultiplyBy",
      //   // description: "amount will be deducted",
      // },
      // {
      //   inputCount: 2,
      //   title: "Multiply Component ",
      //   type: "dropdown",
      //   inputType: "customRateMultiplyComponent",
      //   description: "Lorem ipsum dolor sit amet",
      // },
    ],
  },
];
const attendanceHolidayOverTime = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If employee works more than",
        type: "time",
        inputType: "overtimeMinutes",
        description: "Description",
        line: true,
      },
      {
        title: "Type",
        type: "dropdown",
        inputType: "overtimeType",
        description: "Description",
        // line: true,
        option: customType,
      },
    ],
  },
];
const lessWorkinghours = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If employee works less than",
        type: "time",
        inputType: "lessWorkingemployee",
        description: "No fine for _ mins",
        line: true,
      },
      {
        title: "Deduction Type",
        type: "dropdown",
        inputType: "lessWorkingDeductionType",
        description: "Description",
        line: true,
        // valuecheck: "DeductionComponent",
        option: deductionTypeOption,
        // icon: true,
      },
      {
        title: "Deduction From",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "lessWorkinghoursDeductionComponent",
        description: "Lorem ipsum dolor sit amet",
        // line: true,
        changeValue: true,
        option: Deduction,
        // display: true,
      },
      {
        title: "Days",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "lessWorkinghoursDays",
        // description:
        //   "Lorem ipsum dolor sit amet",
        divline: true,
        option: DaysDivider,
        display: true,
      },
      // {
      //   title: "Set Occurrence",
      //   type: "dropdown",
      //   // valuecheck: "DeductionComponent",
      //   option: occurrence,
      //   Occurrence: true,
      //   inputType: "lessWorkingOccurrence",
      //   description: "Fine will effect after _ occurunce",
      // },
    ],
  },
];
const missPunchPolicy = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "If miss punch occurs more than",
        type: "input",
        enter: "number",
        // valuecheck: "DeductionComponent",
        // option: occurrence,
        inputType: "missPunchMinutes0",
        description: "No fine for _ mins",
        check: true,
      },
      {
        title: "Deduction Type",
        type: "dropdown",
        inputType: "missPunchDeductionType",
        description: "Description",
        option: missPunchDeductionTypeOption,
        // icon: true,
      },
      {
        title: "Deduction From",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "missPunchDeductionComponent",
        // description: "Lorem ipsum dolor sit amet",
        // line: true,
        changeValue: true,
        option: Deduction,
        // display: true,
      },
      {
        title: "Days",
        type: "dropdown",
        valuecheck: "DeductionComponent",
        inputType: "missPunchDays",
        // description:
        //   "Lorem ipsum dolor sit amet",
        divline: true,
        option: DaysDivider,
        display: true,
      },
      // {
      //   title: "Set Occurrence",
      //   type: "dropdown",
      //   // valuecheck: "DeductionComponent",
      //   option: occurrence,
      //   Occurrence: true,
      //   inputType: "missPunchOccurrence",
      //   description: "Fine will effect after _ occurunce",
      // },
    ],
  },
];

const addHolidayType = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "Holiday Name",
        type: "input",
        inputType: "holidayName",
        // description: "No fine for 15 mins",
        // line: true,
      },
      {
        title: "Holiday type",
        type: "dropdown",
        inputType: "holidayType",
        // description: "Description",
        // line: true,
      },
    ],
  },
];
const holidayHeader = [
  {
    Holidays: [
      {
        id: 1,
        title: "Policy Name",
        // value: ["company", "isActive"],
        value: "policyName",
        // flexColumn: true,
        subvalue: "policyName",
      },
      {
        id: 2,
        title: "Holiday Type",
        value: "holidayType",
        // block: true,
      },
      {
        id: 3,
        title: "Date",
        value: "address",
      },
      {
        id: 4,
        title: "Applicability",
        value: "",
        // actionToggle: true,
      },
      {
        id: 5,
        title: "Applicable to",
        value: "joiningDate",
      },
      {
        id: 6,
        title: "Modified by",
        value: "joiningDate",
      },
      {
        id: 7,
        title: "Modified On",
        value: "joiningDate",
      },

      {
        id: 8,
        title: "Status",
        value: "isActive",
      },
      {
        id: 9,
        title: "Status",
        value: "isActive",
      },
    ],
  },
];
const policiesMenu = [
  {
    id: 0,
    value: 0,
    title: "Policies",
    data: "policies",
  },
  {
    id: 1,
    value: 1,
    title: "Create Policy",
    data: "createPolicy",
  },
  {
    id: 2,
    value: 2,
    title: "Assign Policy",
    data: "assignPolicy",
  },
];

const HolidaySteps = [
  {
    id: 0,
    value: 0,
    title: "Holiday",
    data: "addHoliday",
  },
  {
    id: 1,
    value: 1,
    title: "Applicability",
    data: "applicability",
  },
];
const holidayApplicable = [
  {
    id: 1,
    label: "Employee",
    value: "employee",
    // value: 1,
    color: "primary",
  },
  {
    id: 2,
    label: "Department",
    value: "department",
    // value: 2,

    color: "green",
  },
  {
    id: 3,
    label: "Designation",
    value: "designation",
    // value: 3,

    color: "blue",
  },
  {
    id: 4,
    label: "Location",
    value: "location",
    // value: 4,

    color: "yellow",
  },
  {
    id: 5,
    label: "Entity",
    value: "entityId",
    // value: 5,
  },
  {
    id: 6,
    label: "Company",
    value: "company",
    // value: 6,
  },
  {
    id: 7,
    label: "Branch",
    value: "branch",
    // value: 7,
  },
  {
    id: 8,
    label: "Grade",
    value: "grade",
    // value: 8,
  },
];

const ApplicableOn = [
  {
    rowType: "First",
    titleOne: "Applicable On",
    inputTypeOne: "applicableOn",
    titleTwo: "Select",
    inputTypeTwo: "category",
    description: "Fine after 5 mins",
    line: true,
  },
];
const holidayType = [
  {
    label: "National",
    value: "national",
  },
  {
    label: "Restricted Holiday",
    value: "restricted_Holiday",
  },
  {
    label: "State",
    value: "state",
  },
  {
    label: "Public",
    value: "public",
  },
];
const remainingTasks = [
  {
    title: "Complete your profile details",
    description: "add your work, education, and other personal details",
    image: document,
    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#104FC9",
    colorTo: "#104FC9",
  },
  {
    title: "Complete your payroll onboarding",
    description: "add your bank details for seamless transactions",
    image: pricing,
    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#FDBF75",
    colorTo: "#FFAD62",
  },
  {
    title: "Upload your document details",
    description: "upload required document proofs ",
    image: document,
    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#4B5DFF",
    colorTo: "#654CFF",
  },
];
const teammates = [
  {
    image: Avatar,
    title: "Drew Cano",
    description: "Chief Operations Officer",
    medias: [whatsapp, linkedIn, Message],
  },
  {
    image: Avatar,
    title: "Drew Cano",
    description: "Chief Operations Officer",
    medias: [whatsapp, linkedIn, Message],
  },
  {
    image: Avatar,
    title: "Drew Cano",
    description: "Chief Operations Officer",
    medias: [whatsapp, linkedIn, Message],
  },
];
const upoadDocuments = [
  {
    title: "Complete your profile details",
    description: "add your work, education, and other personal details",
    image: passport,
    imageStyle: {
      width: "32px",
      height: " 44.884px",
    },
    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#104FC9",
    colorTo: "#104FC9",
  },
  {
    title: "Complete your payroll onboarding",
    description: "add your bank details for seamless transactions",
    image: group,
    imageStyle: {
      width: "40px",
      height: "40px",
    },

    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#FDBF75",
    colorTo: "#FFAD62",
  },
  {
    title: "Upload your document details",
    description: "upload required document proofs ",
    image: bank,
    imageStyle: {
      width: "40px",
      height: "40px",
    },
    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#4B5DFF",
    colorTo: "#654CFF",
  },
  {
    title: "Upload your document details",
    description: "upload required document proofs ",
    image: educationCertificate,
    imageStyle: {
      width: "28.276px",
      height: "40px",
    },

    profile: Avatar,
    buttonName: "Pending",
    colorFrom: "#4B5DFF",
    colorTo: "#654CFF",
  },
];
const policiesHeader = [
  {
    Work_Policy: [
      {
        id: 1,
        title: "Work Policy Name",
        value: "workPolicyName",
        notView: false,
        bold: true,
        customField: (
          <div className="flex">
            <div className=""></div>
            <div className=""></div>
          </div>
        ),
      },
      {
        id: 2,
        title: "Work Policy Type",
        value: "workPolicyType",
        notView: false,
      },
      {
        id: 3,
        title: "Employees",
        value: "multiImage",
        multiImage: true,
        view: true,
      },
      {
        id: 4,
        title: "Created On",
        value: "createdOn",
        dataIndex: "createdOn",
        sorter: (a, b) => {
          const dateA = new Date(a.createdOn);
          const dateB = new Date(b.createdOn);
          return dateA.getTime() - dateB.getTime();
        },
        sortOrder: "ascent",
      },
      {
        id: 5,
        title: "Status",
        value: "isActive",
        alterValue: "isActive",
        // actionToggle: true,
      },

      {
        id: 6,
        title: "Action",
        value: "action",
        action: true,
        // dotsVertical: true,
        // dotsVerticalContent: [
        //   {
        //     title: "View",
        //     value: "view",
        //   },
        // {
        //   title: "Delete",
        //   value: "delete",
        //   confirm: true,
        // },
        // ],
      },
    ],
  },
];
const holidayHeaderList = [
  {
    Holiday_Settings: [
      {
        id: 1,
        title: "Holiday Name",
        value: "holidayName",
        bold: true,
      },
      {
        id: 2,
        title: "Holiday Type",
        value: "holidayType",
      },
      {
        id: 3,
        title: "From Date",
        value: "fromDate",
      },
      {
        id: 4,
        title: "To Date",
        value: "toDate",
      },

      {
        id: 6,
        title: "Employees",
        value: "multiImage",
        multiImage: true,
        view: true,
      },
      {
        id: 7,
        title: "Status",
        value: "isActive",
        actionToggle: true,
      },
      // {
      //   id: 5,
      //   title: "",
      //   value: "isActive",
      //   alterValue: "isActive",
      // },
      {
        id: 8,
        title: "Action",
        value: "",
        action: true,
        // hideIcon: "delete",

        // dotsVertical: true,
        // dotsVerticalContent: [
        //   {
        //     title: "Update",
        //     value: "update",
        //   },
        //   {
        //     title: "Delete",
        //     value: "delete",
        //     confirm: true,
        //   },
        // ],
      },
    ],
  },
];
const holidayViewHeader = [
  {
    id: 1,
    title: "Holiday Name",
    value: "holidayName",
    bold: true,
  },
  {
    id: 2,
    title: "Holiday Type",
    value: "holidayType",
  },
  {
    id: 3,
    title: "Holiday Date",
    value: "holidayDate",
  },
  {
    id: 4,
    title: "Created On",
    value: "createdOn",
  },
  {
    id: 5,
    title: "Description",
    value: "description",
  },
  {
    id: 6,
    title: "From Date",
    value: "fromDate",
  },
  {
    id: 5,
    title: "To Date",
    value: "toDate",
  },
  {
    id: 6,
    title: "Status",
    value: "isActive",
    actionToggle: true,
  },
];

const myLeaveHeaderList = [
  {
    Request_History: [
      {
        id: 1,
        title: "Request",
        value: "createdOn",
      },
      {
        id: 2,
        title: "Leave Type",
        value: "leaveType",
      },

      // {
      //   id: 3,
      //   title: "Leave Type",
      //   value: "leaveType",
      // },
      {
        id: 3,
        title: "Leave From Date",
        value: "leaveDateFrom",
      },

      {
        id: 4,
        title: "Leave To Date",
        value: "leaveDateTo",
      },

      {
        id: 5,
        title: "Status",
        value: "requestStatusName",
        status: true,
        colour: "requestStatusColour",
      },
      // {
      //   id: 4,
      //   title: "Approved /Rejected by",
      //   value: "superpiorEmployeeName",
      // },

      {
        id: 6,
        title: "",

        width: 50,
        showvertical: true,
        key: "requestStatusName",
        dotsVerticalContent: [
          {
            title: "Update",
            value: "update",
          },
          {
            title: "Delete",
            value: "delete",
            confirm: true,
          },
        ],
      },
    ],
  },
];

const myAttendenceHeaderList = [
  {
    attendance: [
      {
        id: 1,
        title: "Date",
        value: "date",
      },
      {
        id: 2,
        title: "Shift Scheme",
        value: "shiftName",
      },
      {
        id: 3,
        title: "Status",
        value: "status",
      },

      {
        id: 4,
        title: "Check In",
        value: "firstCheckInTime",
      },
      {
        id: 5,
        title: "Check Out",
        value: "lastCheckOutTime",
      },
      {
        id: 6,
        title: "Hours Worked",
        value: "totalWorkHours",
      },
      {
        id: 7,
        title: "Extra Hours",
        value: "extraHours",
      },

      {
        id: 8,
        title: "",
        value: "isRegularizationNeeded",
        buttonName: "Regularize",
        Regularize: true,
      },
      // {
      //   id:9,
      //   title: "",
      //   value: "action",
      //   dotsVertical: true,
      //   dotsVerticalContent: [
      //     {
      //       title: "Present",
      //       value: "present",
      //     },
      //     {
      //       title: "Half Day",
      //       value: "halfDay",
      //     },
      //     {
      //       title: "Absent",
      //       value: "absent",
      //     },
      //     {
      //       title: "Fine",
      //       value: "fine",
      //     },
      //     {
      //       title: "Overtime",
      //       value: "overtime",
      //     },

      //     {
      //       title: "Leave",
      //       value: "leave",
      //     },
      //   ],
      // },
    ],
    regularizations: [
      {
        id: 1,
        title: "Date",
        value: "excuseDate",
      },
      {
        id: 2,
        title: "Type",
        // value: "excuseType",
        value: ["excuseType", "message"],
        flexColumn: true,
        classNames: [
          "text-xs font-normal bg-greenLight text-green px-2 py-1",
          "text-xs font-normal bg-redlight text-rose-600 px-2 py-1",
        ],
      },
      // {
      //   id: 3,
      //   title: "Occurence",
      //   value: "excuseReason",
      // },
      {
        id: 4,
        title: "Impact",
        value: "impact",
      },
      {
        id: 5,
        title: "Status",
        value: "status",
      },
    ],
  },
];

const accountType = [
  {
    title: "Current",
    value: "current",
  },
  {
    title: "Savings",
    value: "savings",
  },
];
const maritalStatus = [
  {
    title: "Married",
    value: "Married",
  },
  {
    title: "Unmarried",
    value: "unmarried",
  },
];
const stepSchemeSteps = [
  {
    id: 0,
    value: 0,
    title: "Shift Scheme",
    data: "addShiftScheme",
  },
  {
    id: 1,
    value: 1,
    title: "Assign Shift Scheme",
    data: "assignShiftScheme",
  },
];
const assignNavigateBtn = [
  { id: 1, value: "Employees", label: "Employees" },
  { id: 2, value: "Departments", label: "Departments" },
  { id: 3, value: "Locations", label: "Locations" },
];
const shiftSchemeNavigateBtn = [
  { id: 1, value: "variable", title: "Variable Schedule" },
  { id: 2, value: "roster", title: "Roster Schedule" },
  { id: 3, value: "rotational", title: "Rotational Schedule" },
  { id: 4, value: "cwl", title: "CWL" },
];
const navigateBtn = [
  { id: 1, value: "Employees", title: "Employees" },
  { id: 2, value: "Departments", title: "Departments" },
  { id: 3, value: "Locations", title: "Locations" },
];

const unusedLeaveRule = [
  {
    id: 1,
    label: "Carry Forward",
    value: "Carry Forward",
    description: "Leaves will be added to next cycle",
  },
  {
    id: 2,
    label: "Lapse",
    value: "Lapse",
    description: "Leaves will be cancelled after the cycle ends",
  },
  {
    id: 3,
    label: "Encash",
    value: "Encash",
    description: "Leaves can be encashed at the end of the cycle",
  },
];
const Paycalculation = [
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
];

const moreAssetsList = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "Asset Type",
        type: "dropdown",
        inputType: "assetId",
        required: true,
      },
      {
        title: "Asset",
        type: "input",
        inputType: "assetName",
        required: true,
      },
      {
        title: "Asset Serial Number",
        type: "input",
        inputType: "serialNumber",
        required: true,
      },
      {
        title: "Description",
        type: "textArea",
        inputType: "assetDescription",
      },
      {
        title: "Asset Renewal",
        type: "renewalDate",
        inputType: "assetRenewal",
        placeholder: "dd-mm-yyyy",
      },
      {
        title: "Is asset under warranty",
        description: "Set asset warrant informations",
        type: "radio",
        inputType: "isWarranty",
      },
      // {
      //   title: "Warranty Expiry",
      //   type: "date",
      //   inputType: "warrantyExpiry",
      //   placeholder: "dd-mm-yyyy",
      // },
    ],
  },
];

const moreDocumentList = [
  {
    id: 1,
    rowType: "First",
    field: [
      {
        title: "Document Types",
        type: "dropdown",
        inputType: "documentId",
      },
      {
        title: "Document",
        type: "input",
        inputType: "document",
      },
      {
        title: "Is asset under warranty",
        description: "Set asset warrant informations",
        type: "upload",
        inputType: "uploadFile",
      },
      {
        title: "Description",
        type: "textArea",
        inputType: "documentDescription",
      },
      {
        title: "Is document under renewal",
        description: "Set asset warrant informations",
        type: "radio",
        inputType: "isWarrantyDocument",
      },
      // {
      //   title: "Renewal Date",
      //   type: "date",
      //   inputType: "renewalDate",
      //   placeholder: "dd-mm-yyyy",
      // },
    ],
  },
];
const myDocumentHeader = [
  {
    My_Document: [
      {
        id: 1,
        title: "Document Name",
        value: "fileName",
        bold: true,
        // render: (record, text) => (
        //   <span className="font-medium">{text.fileName}</span>
        // ),
      },

      {
        id: 2,
        title: "Type",
        value: "documentType",
      },

      {
        id: 3,
        title: "Status",
        value: "isActive",
        alterValue: "isActive",
      },
      {
        id: 4,
        title: "Documents",
        value: "isActive",
        Download: true,
        width: 100,
        buttonName: "View",
        file: "documentName",
      },
    ],
  },
];
const employeeLeaveHeader = [
  {
    EmployeeLeaves: [
      {
        id: 1,
        title: "Leave Name",
        value: "leaveName",
      },
      {
        id: 2,
        title: "LeaveDays Type",
        value: "leaveDaysType",
      },
      {
        id: 3,
        title: "description",
        value: "description",
      },

      {
        id: 9,
        title: "Status",
        value: "isActive",
      },
    ],
  },
];

const employeeAssetsHeader = [
  {
    Company_Assets: [
      {
        id: 1,
        title: "Asset Name",
        value: "assetName",
      },
      {
        id: 2,
        title: "Asset Type Name",
        value: "assetTypeName",
      },
      {
        id: 3,
        title: "Employee Name",
        value: "employeeName",
      },
      {
        id: 4,
        title: "Description",
        value: "description",
        width: 400,
      },
      {
        id: 5,
        title: "Warranty Expiry",
        value: "validUpto",
      },

      // {
      //   id: 9,
      //   title: "Status",
      //   value: "isActive",
      // },
      // {
      //   id: 10,
      //   title: "Employee",
      //   value: "isActive",
      // },
      // {
      //   id: 11,
      //   title: "Creation Date",
      //   value: "isActive",
      // },
      // {
      //   id: 12,
      //   title: "Purchase Date",
      //   value: "isActive",
      // },
    ],
  },
];
const myAttendanceHeader = [
  {
    Attendance: [
      {
        id: 1,
        title: "Date",
        value: "date",
      },
      {
        id: 2,
        title: "Shift Scheme",
        value: "shiftScheme",
      },
      {
        id: 3,
        title: "Status",
        value: "Status",
      },
      {
        id: 4,
        title: "Check In",
        value: "CheckIn",
      },
      {
        id: 5,
        title: "Check Out",
        value: "CheckOut",
      },
      {
        id: 6,
        title: "Hours Worked",
        value: "HoursWorked",
      },
      {
        id: 7,
        title: "Extra Hours",
        value: "ExtraHours",
      },
      // {
      //   id: 4,
      //   title: "Action",
      //   value: "",
      // },
      {
        id: 8,
        title: "Regularize",
        value: "isRegularizationNeeded",
        Regularize: true,
      },
      // {
      //   id: 9,
      //   title: "",
      //   value: "action",
      //   dotsVertical: true,
      //   dotsVerticalContent: [
      //     {
      //       title: "Present",
      //       value: "present",
      //     },
      //     {
      //       title: "Half Day",
      //       value: "halfDay",
      //     },
      //     {
      //       title: "Absent",
      //       value: "absent",
      //     },
      //     {
      //       title: "Fine",
      //       value: "fine",
      //     },
      //     {
      //       title: "Overtime",
      //       value: "overtime",
      //     },

      //     {
      //       title: "Leave",
      //       value: "leave",
      //     },
      //   ],
      // },
    ],
  },
];
const employeeAttendance = [
  {
    Employee_Attendance: [
      {
        id: 1,
        title: "Employee Name",
        value: ["employeeName"],
        flexColumn: true,
        logo: true,
        // subvalue: "empId",
      },

      {
        id: 2,
        title: "Schedule",
        value: "schedule",
      },
      {
        id: 3,
        title: "Status",
        value: "status",
        colorChangeValue: [
          {
            value: "Present",
            className: "text-green-600 bg-green-100",
          },
          {
            value: "Absent",
            className: "text-rose-600  bg-red-100",
          },
          {
            value: "Leave",
            className: "text-orange-600 bg-orange-100",
          },
          {
            value: "Half Day",
            className: "text-yellow-600 bg-yellow-100",
          },

          {
            value: "Fine",
            className: "text-teal-600 bg-teal-100",
          },
          {
            value: "Overtime",
            className: "text-primary bg-primaryLight",
          },
        ],
      },

      {
        id: 4,
        title: "CheckIn Time",
        value: "firstCheckInTime",
      },
      {
        id: 5,
        title: "CheckOut Time",
        value: "lastCheckOutTime",
      },
      {
        id: 6,
        title: "Hours Worked",
        value: "totalWorkHours",
      },
      {
        id: 7,
        title: "Extra Hours",
        value: "extraHours",
      },

      // {
      //   id: 8,
      //   title: "Status",
      //   value: "isActive",
      // },
      // {
      //   id: 6,
      //   title: "Regularize",
      //   value: "isRegularizationNeeded",
      //   Regularize: true,
      // },
      {
        id: 9,
        title: "Action",
        value: "action",
        dotsVertical: true,
        dotsVerticalContent: [
          // {
          //   title: "Approved",
          //   value: "approved",
          // },
          {
            title: "Present",
            value: "present",
          },
          {
            title: "Half Day",
            value: "halfDay",
          },
          {
            title: "Absent",
            value: "absent",
          },
          {
            title: "Fine",
            value: "fine",
          },
          {
            title: "Overtime",
            value: "overtime",
          },

          {
            title: "Leave",
            value: "leave",
          },
        ],
      },
    ],
  },
];
const myAssets = [
  {
    asset_History: [
      {
        id: 1,
        title: "Asset",
        value: "assetName",
      },
      {
        id: 2,
        title: "Asset Type",
        value: "assetTypeName",
      },
      {
        id: 3,
        title: "Warranty Expiry",
        value: "warrantyExpiry",
      },
      {
        id: 4,
        title: "Asset Renewal",
        value: "validUpto",
      },
      {
        id: 4,
        title: "Description",
        value: "description",
        width: 450,
      },

      // {
      //   id: 9,
      //   title: "Status",
      //   value: "isActive",
      // },
      {
        id: 10,
        title: "Assigned/Unassigned Date",
        value: "createdOn",
      },
    ],

    request_History: [
      {
        id: 1,
        title: "Asset Type",
        value: "assetTypeName",
      },
      {
        id: 2,
        title: "Description",
        value: "requestDescription",
        width: 450,
      },
      {
        id: 4,
        title: "Status",
        value: "requestStatusName",
        status: true,
        colour: "requestStatusColour",
      },

      // {
      //   id: 9,
      //   title: "Approved By",
      //   value: "requestApprovedBy",
      // },

      {
        id: 7,
        title: "Approved Date",
        value: "requestApprovedDate",
      },
      {
        id: 10,
        title: "",

        width: 50,
        showvertical: true,
        key: "requestStatusName",

        dotsVerticalContent: [
          {
            title: "Update",
            value: "update",
          },
          {
            title: "Delete",
            value: "delete",
            confirm: true,
          },
        ],
      },
    ],
  },
];

const EmployeeRequestedHeader = [
  {
    Asset_requests: [
      {
        id: 1,
        title: "Name",
        value: ["employeeName"],
        flexColumn: true,
        logo: true,
        subvalue: "createdOn",
        bold: true,
      },
      {
        id: 2,
        title: "Asset Type",
        value: "assetTypeName",
      },

      {
        id: 3,
        title: "Description",
        value: "requestDescription",
        width: 400,
      },
      {
        id: 4,
        title: "Asset Serial No:",
        value: "serialNo",
      },
      {
        id: 5,
        title: "Status",
        value: "requestStatusName",
        status: true,
        colour: "requestStatusColour",
        mainStatus: "mainStatus",
        mainStatusColor: "mainStatusColor",
      },

      {
        id: 6,
        title: "Approving Employees",
        value: "multiImage",
        multiImage: true,
        view: true,
      },
      {
        id: 7,
        title: "Approved Date",
        value: "requestApprovedDate",
      },

      {
        id: 8,
        title: "",
        value: "action",
        status: "mainStatus",
        ThreeDots: true,
        key: "requestStatusName",
        dotsVerticalContent: [
          {
            title: "Approve",
            value: "approve",
          },
          {
            title: "Reject",
            value: "reject",
            // confirm: true,
          },
        ],
      },
    ],
  },
];

const excuseHeader = [
  {
    Regularizations_Details: [
      {
        id: 1,
        title: "Date",
        value: "excuseDate",
      },
      {
        id: 2,
        title: "Type",
        // value: "excuseType",
        value: ["excuseType", "message"],
        flex: true,
        classNames: [
          " bg-greenLight text-green-600 ",
          " bg-redlight text-rose-600 ",
        ],
      },
      // {
      //   id: 3,
      //   title: "Occurence",
      //   value: "excuseReason",
      // },
      {
        id: 4,
        title: "Impact",
        value: "impact",
      },
      {
        id: 5,
        title: "Status",
        value: "status",
      },
    ],
  },
];

const employeeExcuseHeader = [
  {
    Regularization: [
      {
        id: 1,
        title: "Employee Name",
        value: "employeeName",
      },
      {
        id: 2,
        title: "Type",
        // value: "excuseType",
        value: ["excuseType", "message"],
        flex: true,
        classNames: [
          //   "text-xs font-normal bg-greenLight text-green-600 px-2 py-1 w-fit",
          //   "text-xs font-normal bg-redlight text-rose-600 px-2 py-1 w-fit",
        ],
      },
      {
        id: 3,
        title: "Date",
        value: "excuseDate",
      },
      // {
      //   id: 4,
      //   title: "Occurrence",
      //   value: "Impact",
      // },
      {
        id: 5,
        title: "Impact",
        value: "impact",
      },

      {
        id: 6,
        title: "Status",
        value: "status",
        // className: " flex text-gray-300 bg-gray-100",
      },
      {
        id: 7,
        title: "",
        value: "action",
        // action: true,
        dotsVertical: true,
        dotsVerticalContent: [
          {
            title: "Approve",
            value: "approve",
          },
          {
            title: "Reject",
            value: "reject",
            // confirm: true,
          },
        ],
      },
    ],
  },
];
const employeeDocumentHeader = [
  {
    Employee_Document: [
      {
        id: 1,
        title: "Employee Name",
        value: "employeeName",
        bold: true,
      },
      {
        id: 2,
        title: "Document Type",
        value: "documentType",
      },
      {
        id: 3,
        title: "Document Name",
        value: "fileName",
      },
      {
        id: 4,
        title: "description",
        value: "description",
        width: "400px",
      },
      {
        id: 5,
        title: "Expiry Date",
        value: "validTo",
      },
      {
        id: 6,
        title: "Documents",
        value: "isActive",
        Download: true,
        buttonName: "View",
        file: "documentName",
      },
    ],
  },
];

const leaveViewHeader = [
  {
    id: 1,
    title: "Leave Type",
    value: "leaveType",
  },
  {
    id: 2,
    title: "leaveCount",
    value: "Leave Count",
    // block: true,
  },
  // {
  //   id: 3,
  //   title: "description",
  //   value: "description",
  // },
  // {
  //   id: 4,
  //   title: "maxLeaveLimit",
  //   value: "maxLeaveLimit",
  //   // actionToggle: true,
  // },

  // {
  //   id: 1,
  //   title: "isProrataProbationIncluded",
  //   value: "isProrataProbationIncluded",
  // },
  {
    id: 2,
    title: "Conditional",
    valueOne: "leavePayRate",
    valueTwo: "conditional",
    mapValue: true,
  },
  {
    id: 3,
    title: "Status",
    value: "isActive",
    actionToggle: true,
  },

  {
    id: 4,
    title: "Action",
    value: "action",
    dotsVertical: true,
    dotsVerticalContent: [
      {
        title: "Update",
        value: "update",
      },
      {
        title: "Delete",
        value: "delete",
        confirm: true,
      },
    ],
  },
];
const responsiveCarousel = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const loanPolicy = [
  {
    id: 1,
    title: "Education Loan",
    value: "educationLoan",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    minLoanAmount: "AED 500",
    maxLoanAmount: "AED 12000",
  },
  {
    id: 2,
    title: "Personal Loan",
    value: "personalLoan",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    minLoanAmount: "AED 10000",
    maxLoanAmount: "AED 20000",
  },
  {
    id: 3,
    title: "House Loan",
    value: "houseLoan",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    minLoanAmount: "AED 30000",
    maxLoanAmount: "AED 40000",
  },
];

const calculationType = [
  { id: 1, value: "Fixed", label: "Fixed" },
  // { id: 2, value: "PercentageofBasicPay", label: "Percentage of Basic Pay" },
];

const calculationTypeGrossPAy = [
  { id: 1, value: "Fixed", label: "Fixed" },
  // { id: 2, value: "PercentageofBasicPay", label: "Percentage of Basic Pay" },
  // {
  //   id: 3,
  //   value: "PercentageofTotalEarnings",
  //   label: "Percentage of Total Earnings",
  // },
];

const WorkExpenseHeader = [
  {
    pending_Request: [
      {
        id: 1,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 2,
        title: "Date of expense",
        value: "expenseDate",
      },
      {
        id: 3,
        title: "Amount",
        value: "amount",
      },

      {
        id: 4,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 5,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 6,
        title: "Receipt",
        value: "receipt",
      },
      {
        id: 7,
        title: "Action",
        value: "",
        action: true,
      },
      // {
      //   id: 7,
      //   title: "Action",
      //   value: "action",
      //   // action: true,
      //   dotsVertical: true,
      //   dotsVerticalContent: [
      //     {
      //       title: "Approve",
      //       value: "approve",
      //     },
      //     {
      //       title: "Reject",
      //       value: "reject",
      //       // confirm: true,
      //     },
      //   ],
      // },
    ],
  },
];

const WorkExpenseHeaderApproved = [
  {
    approved: [
      {
        id: 1,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 2,
        title: "Date of expense",
        value: "expenseDate",
      },
      {
        id: 3,
        title: "Amount",
        value: "amount",
      },

      {
        id: 4,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 5,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 6,
        title: "Receipt",
        value: "receipt",
      },
    ],
  },
];

const WorkExpenseHeaderRejected = [
  {
    rejected: [
      {
        id: 1,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 2,
        title: "Date of expense",
        value: "expenseDate",
      },
      {
        id: 3,
        title: "Amount",
        value: "amount",
      },

      {
        id: 4,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 5,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 6,
        title: "Receipt",
        value: "receipt",
      },
    ],
  },
];

const WorkExpenseHeaderSettled = [
  {
    settled: [
      {
        id: 1,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 2,
        title: "Date of expense",
        value: "expenseDate",
      },
      {
        id: 3,
        title: "Amount",
        value: "amount",
      },

      {
        id: 4,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 5,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 6,
        title: "Receipt",
        value: "receipt",
      },
    ],
  },
];

const EmployeeWorkExpenseHeader = [
  {
    pending_Requests: [
      {
        id: 1,
        title: "Employee Name",
        value: "employeeName",
      },
      {
        id: 2,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 3,
        title: "Date Of Spend",
        value: "expenseDate",
      },
      {
        id: 4,
        title: "Amount",
        value: "amount",
      },

      {
        id: 5,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 6,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 7,
        title: "Receipt",
        value: "receipt",
      },
      {
        id: 8,
        title: "Action",
        value: "action",
        // action: true,
        dotsVertical: true,
        dotsVerticalContent: [
          {
            title: "Approve",
            value: "approve",
          },
          {
            title: "Reject",
            value: "reject",
            // confirm: true,
          },
        ],
      },
    ],
  },
];
const EmployeeWorkExpenseApprovedHeader = [
  {
    approvals: [
      {
        id: 1,
        title: "Employee Name",
        value: "employeeName",
      },
      {
        id: 2,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 3,
        title: "Date Of Spend",
        value: "expenseDate",
      },
      {
        id: 4,
        title: "Amount",
        value: "amount",
      },

      {
        id: 5,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 6,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 7,
        title: "Receipt",
        value: "receipt",
      },
    ],
  },
];

const EmployeeWorkExpenseRejectedHeader = [
  {
    rejections: [
      {
        id: 1,
        title: "Employee Name",
        value: "employeeName",
      },
      {
        id: 2,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 3,
        title: "Date Of Spend",
        value: "expenseDate",
      },
      {
        id: 4,
        title: "Amount",
        value: "amount",
      },

      {
        id: 5,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 6,
        title: "Rejected By",
        value: "approvers",
      },
      {
        id: 7,
        title: "Receipt",
        value: "receipt",
      },
    ],
  },
];

const EmployeeWorkExpenseSettledHeader = [
  {
    settlements: [
      {
        id: 1,
        title: "Employee Name",
        value: "employeeName",
      },
      {
        id: 2,
        title: "Category Name",
        value: "categoryName",
      },
      {
        id: 3,
        title: "Date Of Spend",
        value: "expenseDate",
      },
      {
        id: 4,
        title: "Amount",
        value: "amount",
      },

      {
        id: 5,
        title: "Created On",
        value: "createdOn",
      },
      {
        id: 6,
        title: "Approvers",
        value: "approvers",
      },
      {
        id: 7,
        title: "Receipt",
        value: "receipt",
      },
    ],
  },
];

const AttendenceAccess = [
  {
    Access_List: [
      {
        id: 1,
        title: "Access",
        value: ["access"],
        flexColumn: true,
        logo: true,
      },
      {
        id: 2,
        title: "Employees",
        value: "multiImage",
        multiImage: true,
        view: true,
      },
      // {
      //   id: 3,
      //   title: "Status",
      //   value: "isActive",
      //   // actionToggle: true,
      // },
      {
        id: 4,
        title: "",
        value: "button",
        Regularize: true,
        buttonName: "Assign",
        multiButton: ["Settings"],
        multiButtonValue: {
          access: "Biometric",
        },
      },
    ],

    Users_List: [
      {
        id: 1,
        title: "Employees",
        value: ["fullName", "code"],
        flexColumn: true,
        logo: true,
      },
      // {
      //   id: 2,
      //   title: "Roles",
      //   value: "roleName",
      // },
      {
        id: 4,
        title: "",
        value: "isActive",
        Regularize: true,
        buttonName: "Edit Access",
      },
    ],
  },
];
const workEntryHeader = [
  {
    My_Work_Entries: [
      {
        id: 1,
        title: "Work Name",
        value: "workName",
        // profile: true,
        // subvalue: "createdOn",
        bold: true,
      },
      {
        id: 2,
        title: "Unit Count",
        value: "unitCount",
      },
      {
        id: 3,
        title: "Description",
        value: "description",
      },
      {
        id: 4,
        title: "Created On",
        value: "createdOn",
        dataIndex: "createdOn",
        sorter: (a, b) => {
          const dateA = new Date(a.createdOn);
          const dateB = new Date(b.createdOn);
          return dateA.getTime() - dateB.getTime();
        },
        sortOrder: "ascent",
      },
      // {
      //   id: 5,
      //   title: "Action",
      //   value: "action",
      //   dotsVertical: true,
      //   dotsVerticalContent: [
      //     {
      //       title: "Update",
      //       value: "update",
      //     },
      //     {
      //       title: "Delete",
      //       value: "delete",
      //       confirm: true,
      //     },
      //   ],
      // },
    ],
  },
];

const employeeAttendenceButtonList = [
  {
    id: 1,
    title: "Present",
    shortLeter: "P",
    value: "present",
    className: "bg-[#349C5E] text-white !border-[#349C5E]",
    bg: "#349C5E",
    text: "#fff",
    border: "#349C5E",
  },
  {
    id: 2,
    title: "Half-Day",
    shortLeter: "HD",
    value: "halfDay",
    className: "bg-[#E68E02] text-[#E68E02] !border-[#E68E02]",
    bg: "#E68E02",
    text: "#fff",
    border: "#E68E02",
  },
  {
    id: 3,
    title: "Absent",
    shortLeter: "A",
    value: "absent",
    className: "bg-[#C82920] text-white !border-[#C82920]",
    bg: "#C82920",
    text: "#fff",
    border: "#C82920",
  },
  {
    id: 4,
    title: "Fine",
    shortLeter: "F",
    value: "fine",
    className: "bg-[#dcecf7] text-[#2980BB] !border-[#C2E6FF]",
    bg: "#dcecf7",
    text: "#dcecf7",
    border: "#C2E6FF",
  },
  {
    id: 5,
    title: "Overtime",
    shortLeter: "OT",
    value: "overTime",
    className: "bg-[#7f50eef8] text-[#B736DC] !border-[#F8DEFF]",
    bg: "#7f50eef8",
    text: "#B736DC",
    border: "#F8DEFF",
  },
  {
    id: 6,
    title: "Paid Leave",
    shortLeter: "PL",
    value: "paidLeave",
    className: "bg-[#365DE0] text-[#365DE0] !border-[#365DE0]",
    bg: "#365DE0",
    text: "#365DE0",
    border: "#365DE0",
  },
];
const ExcuseDataList = [
  {
    id: 1,
    title: "Late Entry",
    value: "-3:20 hrs",
  },
  {
    id: 2,
    title: "Early Exit",
    value: "-3:20 hrs",
  },
  {
    id: 3,
    title: "Excess Break",
    value: "-3:20 hrs",
  },
];
const ExcuseDataList2 = [
  {
    id: 1,
    title: "Over Time",
    value: "+3:20 hrs",
  },
  {
    id: 2,
    title: "Over Time",
    value: "+3:20 hrs",
  },
  {
    id: 3,
    title: "Over Time",
    value: "+2:20 hrs",
  },
];
const BiometricDeviceList = [
  {
    Biometric: [
      {
        id: 1,
        title: "Device Name",
        value: "deviceName",
      },
      {
        id: 2,
        title: "Serial Number",
        value: "serialNumber",
      },
      {
        id: 3,
        title: "Employees",
        value: "multiImage",
        multiImage: true,
        view: true,
      },
    ],
  },
];
const leaveSection = [
  {
    label: "First Half",
    value: "firstHalf",
  },
  {
    label: "Second Half",
    value: "secondHalf",
  },
];

const workPolicyOvertimeCheck = [
  {
    label: "Early Overtime",
    value: "earlyOvertime",
  },
  {
    label: "Late Overtime",
    value: "lateOvertime",
  },
  {
    label: "Both",
    value: "both",
  },
];

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const weekOfMonth = [
  {
    id: 1,
    title: "Week 1",
    value: "WeekOne",
  },
  {
    id: 2,
    title: "Week 2",
    value: "WeekTwo",
  },
  {
    id: 3,
    title: "Week 3",
    value: "WeekThree",
  },
  {
    id: 4,
    title: "Week 4",
    value: "WeekFour",
  },
  {
    id: 5,
    title: "Week 5",
    value: "WeekFive",
  },
];
const weekDays = [
  {
    id: 1,
    title: "",
    // value: "Week1Monday",
    value: {
      week: 1,
      dayId: 1,
    },
  },
  {
    id: 2,
    title: "",
    // value: "Week1Tuesday",
    value: {
      week: 1,
      dayId: 2,
    },
  },
  {
    id: 3,
    title: "",
    value: {
      week: 1,
      dayId: 3,
    },
    // value: "Week1Wednesday",
  },
  {
    id: 4,
    title: "",
    // value: "Week1Thusday",
    value: {
      week: 1,
      dayId: 4,
    },
  },
  {
    id: 5,
    title: "",
    // value: "Week1Friday",
    value: {
      week: 1,
      dayId: 5,
    },
  },
  {
    id: 6,
    title: "",
    // value: "Week1Saturday",
    value: {
      week: 1,
      dayId: 6,
    },
  },
  {
    id: 7,
    title: "",
    // value: "Week1Sunday",
    value: {
      week: 1,
      dayId: 7,
    },
  },
  //
  {
    id: 8,
    title: "",
    // value: "Week2Monday",
    value: {
      week: 2,
      dayId: 1,
    },
  },
  {
    id: 9,
    title: "",
    // value: "Week2Tuesday",
    value: {
      week: 2,
      dayId: 2,
    },
  },
  {
    id: 10,
    title: "", // value: "Week2Wednesday",
    value: {
      week: 2,
      dayId: 3,
    },
  },
  {
    id: 11,
    title: "",
    // value: "Week2Thusday",
    value: {
      week: 2,
      dayId: 4,
    },
  },
  {
    id: 12,
    title: "",
    // value: "Week2Friday",
    value: {
      week: 2,
      dayId: 5,
    },
  },
  {
    id: 13,
    title: "",
    // value: "Week2Saturday",
    value: {
      week: 2,
      dayId: 6,
    },
  },
  {
    id: 14,
    title: "",
    // value: "Week2Sunday",
    value: {
      week: 2,
      dayId: 7,
    },
  },
  //
  {
    id: 15,
    title: "",
    // value: "Week3Monday",
    value: {
      week: 3,
      dayId: 1,
    },
  },
  {
    id: 16,
    title: "",
    // value: "Week3Tuesday",
    value: {
      week: 3,
      dayId: 2,
    },
  },
  {
    id: 17,
    title: "",
    // value: "Week3Wednesday",
    value: {
      week: 3,
      dayId: 3,
    },
  },
  {
    id: 18,
    title: "",
    // value: "Week3Thusday",
    value: {
      week: 3,
      dayId: 4,
    },
  },
  {
    id: 19,
    title: "",
    // value: "Week3Friday",
    value: {
      week: 3,
      dayId: 5,
    },
  },
  {
    id: 20,
    title: "",
    // value: "Week3Saturday",
    value: {
      week: 3,
      dayId: 6,
    },
  },
  {
    id: 21,
    title: "",
    // value: "Week3Sunday",
    value: {
      week: 3,
      dayId: 7,
    },
  },
  //
  {
    id: 22,
    title: "",
    // value: "Week4Monday",
    value: {
      week: 4,
      dayId: 1,
    },
  },
  {
    id: 23,
    title: "",
    // value: "Week4Tuesday",
    value: {
      week: 4,
      dayId: 2,
    },
  },
  {
    id: 24,
    title: "",
    // value: "Week4Wednesday",
    value: {
      week: 4,
      dayId: 3,
    },
  },
  {
    id: 25,
    title: "",
    // value: "Week4Thusday",
    value: {
      week: 4,
      dayId: 4,
    },
  },
  {
    id: 26,
    title: "",
    // value: "Week4Friday",
    value: {
      week: 4,
      dayId: 5,
    },
  },
  {
    id: 27,
    title: "",
    // value: "Week4Saturday",
    value: {
      week: 4,
      dayId: 6,
    },
  },
  {
    id: 28,
    title: "",
    // value: "Week4Sunday",
    value: {
      week: 4,
      dayId: 7,
    },
  },
  {
    id: 29,
    title: "",
    // value: "Week4Monday",
    value: {
      week: 5,
      dayId: 1,
    },
  },
  {
    id: 30,
    title: "",
    // value: "Week4Tuesday",
    value: {
      week: 5,
      dayId: 2,
    },
  },
  {
    id: 31,
    title: "",
    // value: "Week4Wednesday",
    value: {
      week: 5,
      dayId: 3,
    },
  },
  {
    id: 32,
    title: "",
    // value: "Week4Thusday",
    value: {
      week: 5,
      dayId: 4,
    },
  },
  {
    id: 33,
    title: "",
    // value: "Week4Friday",
    value: {
      week: 5,
      dayId: 5,
    },
  },
  {
    id: 34,
    title: "",
    // value: "Week4Saturday",
    value: {
      week: 5,
      dayId: 6,
    },
  },
  {
    id: 35,
    title: "",
    // value: "Week4Sunday",
    value: {
      week: 5,
      dayId: 7,
    },
  },
];

const leaveModal = [
  {
    title: "Leave Type",
    value: "leaveType",
  },
  {
    title: "Leave Count",
    value: "leaveCount",
  },
  {
    title: "Max Leave Limit",
    value: "maxLeaveLimit",
  },
  {
    title: "Leave Limit Per",
    value: "leaveLimitPer",
  },
  {
    title: "Description",
    value: "description",
    className: "col-span-4",
  },
];

export {
  leaveModal,
  bloodGroup,
  regularOvertime,
  attendanceOnHolidays,
  automationPolicies,
  allowanceType,
  MultiplyBy,
  lateentrypolicy,
  breakRule,
  exitRule,
  holidayHeader,
  HolidaySteps,
  holidayApplicable,
  ApplicableOn,
  holidayType,
  extraHoursOnWeekDays,
  customRateExtraHours,
  attendanceHolidayOverTime,
  lessWorkinghours,
  missPunchPolicy,
  remainingTasks,
  teammates,
  upoadDocuments,
  policiesMenu,
  policiesHeader,
  holidayHeaderList,
  holidayViewHeader,
  accountType,
  maritalStatus,
  stepSchemeSteps,
  assignNavigateBtn,
  shiftSchemeNavigateBtn,
  addHolidayType,
  leavelimitPer,
  unusedLeaveRule,
  Paycalculation,
  moreAssetsList,
  moreDocumentList,
  myDocumentHeader,
  employeeDocumentHeader,
  employeeLeaveHeader,
  employeeAssetsHeader,
  deductionTypeOption,
  missPunchDeductionTypeOption,
  occurrence,
  Deduction,
  Multiplyer,
  DaysDivider,
  myAttendanceHeader,
  employeeAttendance,
  myAttendenceHeaderList,
  myLeaveHeaderList,
  // employeeLeaveHeaderList,
  myAssets,
  excuseHeader,
  employeeExcuseHeader,
  occurrenceType,
  customType,
  leaveViewHeader,
  responsiveCarousel,
  loanPolicy,
  EmployeeRequestedHeader,
  calculationType,
  calculationTypeGrossPAy,
  navigateBtn,
  WorkExpenseHeader,
  WorkExpenseHeaderApproved,
  WorkExpenseHeaderRejected,
  WorkExpenseHeaderSettled,
  EmployeeWorkExpenseHeader,
  AttendenceAccess,
  workEntryHeader,
  employeeAttendenceButtonList,
  ExcuseDataList,
  ExcuseDataList2,
  BiometricDeviceList,
  DaysDividerPayrollConfiguration,
  leaveSection,
  EmployeeWorkExpenseApprovedHeader,
  EmployeeWorkExpenseRejectedHeader,
  EmployeeWorkExpenseSettledHeader,
  workPolicyOvertimeCheck,
  weekDays,
  weekOfMonth,
  daysOfWeek,
};

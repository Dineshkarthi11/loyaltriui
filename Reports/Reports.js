import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FlexCol from "../common/FlexCol";
import Accordion from "../common/Accordion";
import Heading from "../common/Heading";
import Doc from "../../assets/images/uploader/doc.png";
import Pdf from "../../assets/images/uploader/pdf.png";
import Excel from "../../assets/images/uploader/microsoft excel.svg";
import API, { action, fileActionDownload1, newaction } from "../Api";
import axios from "axios";
import FileSaver from "file-saver";
import ButtonClick from "../common/Button";
import { PiDownloadSimple } from "react-icons/pi";
import { RiLoader3Fill } from "react-icons/ri";
import RangeDatePicker from "../common/RangeDatePicker";
import Dropdown from "../common/Dropdown";
import RadioButton from "../common/RadioButton";
import { useFormik } from "formik";
import * as yup from "yup";
import DateSelect from "../common/DateSelect";
import PAYROLLAPI, { PayrollfileActionDownload1 } from "../PayRollApi";
import { format } from "date-fns";
import { TbReportAnalytics } from "react-icons/tb";
import { getEmployeeList } from "../common/Functions/commonFunction";
import { fetchCompanyDetails } from "../common/Functions/commonFunction";
import moment from "moment";
import ModalAnt from "../common/ModalAnt";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function Reports() {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [reportvalue, setreportvalue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Opengender, setOpenGender] = useState(false);
  const [OpenNational, setOpenNational] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [OpenDepartment, setOpenDepartment] = useState(false);
  const [OpenDesignation, setOpenDesignation] = useState(false);
  const [OpenWorkEntry, setOpenWorkEntry] = useState(false);
  const [OpenEmployeeLeave, setOpenEmployeeLeave] = useState(false);
  const [OpenEmployeeAttendence, setOpenEmployeeAttendence] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [OpenEmployeeDailyAttendence, setOpenEmployeeDailyAttendence] =
    useState(false);
  const [OpenEmployeeOverTime, setOpenEmployeeOverTime] = useState(false);
  const [OpenEmployeeLop, setOpenEmployeeLop] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [locationlist, setLocationList] = useState([]);
  const [categorylist, setCategorylist] = useState([]);
  const [openpayRollsummery, setOpenPayrollsummery] = useState(false);
  const [openpayrolladjustmentreport, setopenpayrolladjustmentreport] =
    useState(false);
  const [
    OpenpayrollSalaryStructurereport,
    setOpenpayrollSalaryStructurereport,
  ] = useState(false);
  const [
    payrollSalaryRevisionHistoryReport,
    setpayrollSalaryRevisionHistoryReport,
  ] = useState(false);
  const [
    payrollDepartmentEmployeeSalaryReport,
    setpayrollDepartmentEmployeeSalaryReport,
  ] = useState(false);
  const [payrollwps, setpayrollwps] = useState(false);
  const [payrollwpsKerala, setpayrollwpsKerala] = useState(false);
  const [payrollLoanOutstandingReport, setpayrollLoanOutstandingReport] =
    useState(false);
  const [payrollReviewReport, setpayrollReviewReport] = useState(false);
  const [
    DatewiseEmployeesAttendanceReport,
    setDatewiseEmployeesAttendanceReport,
  ] = useState(false);
  const [
    EmployeeMonthwiseAttendanceReport,
    setEmployeeMonthwiseAttendanceReport,
  ] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);


useEffect(() => {
 setCompanyId(localStorageData.companyId)
}, [])

  const closeModal = () => {
    setIsModalOpen(false);
    setLoadingIcon(false);
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
  const isPFESIEnabled = parseInt(companyDetails?.isPFESIenabled) === 1;
  const reportsAccordion = [
    {
      id: 1,
      title: t("Employee Reports"),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      document: Doc,
      report: [
        {
          id: 1,
          title: t("Employee"),
          description:
            "Detailed employees report with all key personal information",
          document: Doc,
          value: "employeeReport",
        },
        {
          id: 2,
          title: t("Employee Diversity"),
          description:
            "Summary report of employees categorized by gender and count",
          document: Pdf,
          value: "genderReport",
        },
        // {
        //   id: 3,
        //   title: t("National Diversity "),
        //   description:
        //     "Employee nationality report showing count and percentage data",
        //   document: Doc,
        //   value: "NationalReport",
        // },
        // {
        //   id: 4,
        //   title: t("Department"),
        //   description:
        //     "Report detailing department distribution by count and percent.",
        //   document: Pdf,
        //   value: "departmentReport",
        // },
        // {
        //   id: 5,
        //   title: t("Designation"),
        //   description:
        //     "Designation report listing counts and their percentages too.",
        //   document: Pdf,
        //   value: "designationReport",
        // },
        {
          id: 6,
          title: t("Work Entry"),
          description:
            "Report of work entries with date, time, units, and location.",
          document: Pdf,
          value: "workentryreport",
        },
      ],
    },
    {
      id: 2,
      title: t("Employee Leave Reports"),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      document: Pdf,
      report: [
        {
          id: 1,
          title: t("Employee Leave"),
          description:
            "Detailed Employee Leave Summary: Types, Approvals, and Balances",
          document: Pdf,
          value: "employeeLeaveReport",
        },
      ],
    },
    // {
    //   id: 2,
    //   title: t("Hiring_Reports"),
    //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    //   document: Pdf,
    //   report: [],
    // },

    {
      id: 4,
      title: t("Attendance Reports"),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      document: Pdf,
      report: [
        // {
        //   id: 1,
        //   title: "Datewise Employees Attendance ",
        //   description:
        //     "Daily Attendance Report with Check In, Check Out, Total Work Hours",
        //   document: Doc,
        //   value: "DatewiseEmployeesAttendanceReport",
        // },
        {
          id: 2,
          title: "Employee Monthwise Attendance ",
          description:
            "Individual Monthly Employee Attendance Report with Check-In, Check-Out, Total Work Hours",
          document: Doc,
          value: "EmployeeMonthwiseAttendanceReport",
        },
        {
          id: 3,
          title: t("Employee Attendance Muster"),
          description:
            "Monthly Muster Roll: Staff Name, Shift Type, Date-wise Attendance Summary.",
          document: Pdf,
          value: "employeeAttendenceReport",
        },
        {
          id: 4,
          title: t("Daily Attendance Report"),
          description:
            "Summary of overall and shift-wise staff attendance, leave, and work details",
          document: Pdf,
          value: "dailyattendancereport",
        },
        {
          id: 5,
          title: t("Overtime Report"),
          description:
            "Overtime Report: Staff details, dates, hours worked, rates, earnings, and payment dates.",
          document: Pdf,
          value: "overtimereport",
        },
        {
          id: 6,
          title: t("LOP Monthly Report"),
          description:
            "Overtime Report: Staff details, dates, hours worked, rates, earnings, and payment dates.",
          document: Pdf,
          value: "lopmonthlyreport",
        },
      ],
    },
    {
      id: 5,
      title: t("Payroll Reports"),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      document: Doc,
      report: [
        // {
        //   id: 1,
        //   title: "Payroll Summary",
        //   description:
        //     "Consolidated Monthly Payroll Summary: Pay Components, Amounts.",
        //   document: Doc,
        //   value: "payrollsummary",
        // },
        {
          id: 1,
          title: "Payroll Summary Review Reports",
          description:
            "Consolidated Monthly Payroll Summary: Pay Components, Amounts.",
          document: Doc,
          value: "payrollsummary",
        },
        {
          id: 2,
          title: "Payroll Adjustment Report",
          description:
            "Monthly Employee-wise Summary of Additions and Deductions.",
          document: Doc,
          value: "payrollAdjustmentReport",
        },
        {
          id: 3,
          title: "Payroll Salary Structure Report",
          description:
            "Organization-wide Payroll Salary Structure Report as per Contractual Terms.",
          document: Doc,
          value: "payrollSalaryStructureReport",
        },
        {
          id: 4,
          title: "Payroll Salary Revision History Report",
          description:
            "Salary Template Change Report: Employee transitions and gross salary changes within specified dates.",
          document: Doc,
          value: "payrollSalaryRevisionHistoryReport",
        },
        {
          id: 5,
          title: "Employees Payroll Report",
          description:
            "Employees Salary Report: Earnings, Deductions, Gross, Adjustments, Expenses, Allowances, Net.",
          document: Doc,
          value: "payrollDepartmentEmployeeSalaryReport",
        },
        parseInt(localStorageData.pfDetails) !== 1
          ? {
              id: 6,
              title: "Payroll WPS report",
              description:
                "Wage Protection System report as required by the Government",
              document: Doc,
              value: "payrollWPSReport",
            }
          : {
              id: 8,
              title: "Payroll WPS report",
              description:
                "Wage Protection System report as required by the Government",
              document: Doc,
              value: "payrollwpsreportkerala",
            },
        {
          id: 7,
          title: "Payroll Loan Outstanding Report",
          description: "Loan Status and Payment History Report for Employees.",
          document: Doc,
          value: "payrollloanoutstandingreport",
        },

        // {
        //   id: 8,
        //   title: "Payroll Review Report",
        //   description: "Comprehensive Staff Salary and Deduction Report.",
        //   document: Doc,
        //   value: "payrollreviewreport",
        // },

        // {
        //   id:7,
        //   title:"Employee salary structure",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:8,
        //   title:"Employee full and final settlement",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:9,
        //   title:"Salary revision report",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },

        // {
        //   id:10,
        //   title:"Salary withhold report",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:11,
        //   title:"Gratuity liability report",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:12,
        //   title:"social security summary",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:13,
        //   title:"Payroll Report",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:14,
        //   title:"Loan outstanding",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:15,
        //   title:"Employee wise asset",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:16,
        //   title:"WPS-Report",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
        // {
        //   id:17,
        //   title:"All Employee Report with status(approved or pending)",
        //   description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //   document:Doc,
        // },
      ],
    },
    ...(isPFESIEnabled
      ? [
          {
            id: 6,
            title: t("Statutory Reports"),
            description: "Statutory Reports",
            document: Pdf,
            report: [
              {
                id: 1,
                title:
                  "Monthly View of PF Contributions By Employee and Employer",
                description:
                  "Provide a monthly summary of PF contributions from employees and employers.",
                document: Doc,
                value: "monthlyviewreport",
              },
              {
                id: 2,
                title: "PF Report as per Government Norms",
                description:
                  "Produce a PF report in .txt format as required by government standards.",
                document: Doc,
                value: "pfreport",
              },
              {
                id: 3,
                title: "Professional State Tax Report",
                description:
                  "Prepare a professional tax report compliant with your state's regulations.",
                document: Doc,
                value: "professionalreport",
              },
              {
                id: 4,
                title: "LWF Report",
                description:
                  "Create a report for the Labour Welfare Fund, including contributions from staff and employers.",
                document: Doc,
                value: "lwfreport",
              },
              {
                id: 5,
                title: "ESI Report",
                description:
                  "Generate a report for ESI showing contributions made by both staff and employers.",
                document: Doc,
                value: "esireport",
              },
              {
                id: 6,
                title: "Monthly Report on ESIC Portal",
                description: (
                  <p>
                    Submit this monthly ESI report via the ESIC portal at{" "}
                    <a
                      href="https://www.esic.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.esic.gov.in/
                    </a>
                  </p>
                ),
                document: Doc,
                value: "monthlyESICreport",
              },
            ],
          },
        ]
      : []),
  ];

  const CheckBoxGroupOptions = [
    {
      label: "Sales Target",
      value: "salestarget",
    },
    {
      label: "Attendance Record",
      value: "attendancerecord",
    },
  ];
  const RadioGroupOptions = [
    {
      label: "PDF",
      value: "pdf",
      image: Pdf,
    },
    {
      label: "Excel",
      value: "excel",
      image: Excel,
    },
  ];
  const excelOnlyOptions = [
    {
      label: "Excel",
      value: "excel",
      image: Excel,
    },
  ];
  const RadioGroupOptions1 = [
    {
      label: "Additional Adjustment Report",
      value: 1,
    },
    {
      label: "Deduction",
      value: 2,
    },
  ];
  const getDepartment = async (e) => {
    try {
      const result = await action(API.GET_DEPARTMENT, { companyId: companyId });
      console.log(result);
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

  const getLocation = async () => {
    const result = await action(API.GET_LOCATION, { companyId: companyId });
    setLocationList(
      result.result?.map((each) => ({
        label: each.location,
        value: each.locationId,
      }))
    );
  };

  const getCategory = async () => {
    try {
      const result = await action(API.GET_CATEGORY, { companyId: companyId });
      console.log(result);
      setCategorylist([
        ...result.result.map((each) => ({
          label: each.category,
          value: each.categoryId,
        })),
      ]);
      console.log(result.data);
    } catch (error) {
      return error;
    }
  };

  const formik = useFormik({
    initialValues: {
      fromeToData: [
        moment().format("YYYY/MM/DD"),
        moment().format("YYYY/MM/DD"),
      ],
      perfomanceMetrics: "",
      department: null,
      downloadFormat: "pdf",
      category: null,
      location: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        if (e.downloadFormat === "excel") {
          const response = await newaction(API.GET_EMPLOYEE_DETAILS_IN_EXCEL, {
            companyId: companyId,
            filter: {
              departmentId: e.department || null,
              // joiningDate: {
              //   fromDate: e.fromeToData[0],
              //   toDate: e.fromeToData[1],
              // },
              locationId: e.location,
              categoryId: e.category,
              isActive: 1,
            },
          });
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setIsModalOpen(false);
        } else if (e.downloadFormat === "pdf") {
          const response = await newaction(API.GET_EMPLOYEE_DETAILS_IN_PDF, {
            companyId: companyId,
            filter: {
              departmentId: e.department || null,
              // joiningDate: {
              //   fromDate: e.fromeToData[0],
              //   toDate: e.fromeToData[1],
              // },
              locationId: e.location,
              categoryId: e.category,
              isActive: 1,
            },
          });
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/pdf",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setIsModalOpen(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik2 = useFormik({
    initialValues: {
      category: null,
      location: null,
      department: null,
      downloadFormat: "pdf",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      console.log(e);
      try {
        setLoadingIcon(true);
        const response = await fileActionDownload1(
          API.GET_DIVERTSITY_REPORTS,
          
          {
            companyId: companyId,
            locationId: e.location,
            departmentId: e.department,
            categoryId: e.category,
          }
        );
        if (response.data.status === 200) {
          const { filename, filecontent } = response.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const file = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", response.data.message);
        }

        setOpenGender(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik3 = useFormik({
    initialValues: {
      department: null,
      location: null,
      category: null,
      downloadFormat: "pdf",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      console.log(e);
      try {
        setLoadingIcon(true);
        if (e.downloadFormat === "excel") {
          const response = await axios.post(
            API.HOST + API.GET_NATIONAL_DIVERSITY_EXCEL,
            {
              companyId: companyId,
              filter: {
                departmentId: e.department,
                locationId: e.location,
                categoryId: e.category,
              },
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/pdf",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenNational(false);
        } else if (e.downloadFormat === "pdf") {
          console.log(e.downloadFormat);
          const response = await axios.post(
            API.HOST + API.GET_NATIONAL_DIVERSITY_PDF,
            {
              companyId: companyId,
              filter: {
                departmentId: e.department,
                locationId: e.location,
                categoryId: e.category,
              },
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenNational(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik4 = useFormik({
    initialValues: {
      location: null,
      downloadFormat: "pdf",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        if (e.downloadFormat === "excel") {
          const response = await axios.post(
            API.HOST + API.GET_DEPARTMENT_DIVERSITY_EXCEL,
            {
              companyId: companyId,
              filter: {
                locationId: e.location,
              },
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenDepartment(false);
        } else if (e.downloadFormat === "pdf") {
          console.log(e.downloadFormat);
          const response = await axios.post(
            API.HOST + API.GET_DEPARTMENT_DIVERSITY_PDF,
            {
              companyId: companyId,
              filter: {
                locationId: e.location,
              },
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/pdf",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenDepartment(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik5 = useFormik({
    initialValues: {
      downloadFormat: "pdf",
      location: null,
      department: null,
      category: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        if (e.downloadFormat === "excel") {
          const response = await axios.post(
            API.HOST + API.GET_DESIGNATION_DIVERSITY_EXCEL,
            {
              companyId: companyId,
              filter: {
                departmentId: e.department,
                locationId: e.location,
                categoryId: e.category,
              },
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenDesignation(false);
        } else if (e.downloadFormat === "pdf") {
          console.log(e.downloadFormat);
          const response = await axios.post(
            API.HOST + API.GET_DESIGNATION_DIVERSITY_PDF,
            {
              companyId: companyId,
              filter: {
                departmentId: e.department,
                locationId: e.location,
                categoryId: e.category,
              },
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/pdf",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenDesignation(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik6 = useFormik({
    initialValues: {
      location: null,
      department: null,
      downloadFormat: "pdf",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        if (e.downloadFormat === "excel") {
          const response = await newaction(API.GET_EMPLOYEE_LEAVE_EXCEL, {
            companyId: companyId,
           
            filter: {
              departmentId: e.department,
              locationId: e.location,
            },
          });
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }

          setOpenEmployeeLeave(false);
        } else if (e.downloadFormat === "pdf") {
          console.log(e.downloadFormat);
          const response = await newaction(API.GET_EMPLOYEE_LEAVE_PDF, {
            companyId: companyId,
           
            filter: {
              departmentId: e.department,
              locationId: e.location,
            },
          });
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/pdf",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenEmployeeLeave(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik7 = useFormik({
    initialValues: {
    
      date: moment().format("MMMM-YYYY"),
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const formattedDate = format(new Date(e.date), "yyyy-MM");
        const result = await action(API.GET_EMPLOYEE_ATTENDENCE_REPORT_EXCEL, {
          companyId: companyId,
          neededYearAndMonth: formattedDate,
        });
        if (result.status === 200) {
          const { filename, filecontent } = result.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }

        setOpenEmployeeAttendence(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  useEffect(() => {
    getDepartment();
    getCategory();
    getLocation();
  }, []);

  const formik8 = useFormik({
    initialValues: {
      location: null,
      department: null,
      monthdate: moment().format("MMMM-YYYY"),
      fileType: "excel",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const response = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_SUMMERY,

          {
            companyId: companyId,
            neededYearAndMonth: e.monthdate,
            locationId: e.location,
            departmentId: e.department,
            fileType: e.fileType,
          }
        );
        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;

          if (filecontent && filename) {
            // Decode base64 string to binary string
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const file = new Blob([byteArray], { type: "text/plain" });

            // Use FileSaver to save the file
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenPayrollsummery(false);
        }
      } catch (error) {
        return error;
      }
      setLoadingIcon(false);
    },
  });

  const formik9 = useFormik({
    initialValues: {
      monthdate: moment().format("MMMM-YYYY"),
      fileType: "excel",
      location: null,
      department: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        let apiEndpoint;
        switch (reportvalue) {
          case "esireport":
            apiEndpoint = PAYROLLAPI.GET_PAYROLL_ESI_REPORT;
            break;
          case "payrollAdjustmentReport":
            apiEndpoint = PAYROLLAPI.GET_PAYROLL_ADJUSTMENT_REPORT;
            break;
          case "pfreport":
            apiEndpoint = PAYROLLAPI.GET_PAYROLL_PF_REPORT;
            break;
          case "lwfreport":
            apiEndpoint = PAYROLLAPI.GET_LWF_REPORT;
            break;
          case "professionalreport":
            apiEndpoint = PAYROLLAPI.GET_PROFESSIONAL_STATE_TAX_REPORT;
            break;
          case "monthlyESICreport":
            apiEndpoint = PAYROLLAPI.GET_MONTHLY_ESI_REPORT;
            break;
          case "monthlyviewreport":
            apiEndpoint = PAYROLLAPI.GET_PAYROLL_MONTHLY_PF_CONTRIBUTION;
            break;
          default:
            apiEndpoint = PAYROLLAPI.GET_PAYROLL_ADJUSTMENT_REPORT;
        }

        const response = await PayrollfileActionDownload1(apiEndpoint, {
          companyId: companyId,
          neededYearAndMonth: e.monthdate,
          locationId: e.location,
          departmentId: e.department,
          fileType: e.fileType,
        });

        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;
          if (filecontent && filename) {
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const file = new Blob([byteArray], { type: "text/plain" });
            FileSaver.saveAs(file, filename);
          }
        } else {
          openNotification("error", "Info", response.data.message);
        }
        setopenpayrolladjustmentreport(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik10 = useFormik({
    initialValues: {
      
      location: null,
      department: null,
      fileType: "pdf",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const response = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_SLARY_STRUCTURE_REPORT,
          {
            companyId: companyId,
            locationId: e.location,
            departmentId: e.department,
          }
        );
        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;

          if (filecontent && filename) {
            // Decode base64 string to binary string
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const file = new Blob([byteArray], { type: "text/plain" });

            // Use FileSaver to save the file
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenpayrollSalaryStructurereport(false);
        }
        // }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik11 = useFormik({
    initialValues: {
      fromeToData: [
        moment().format("YYYY/MM/DD"),
        moment().format("YYYY/MM/DD"),
      ],
      fileType: "pdf",
      employeid: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const response = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_SALARY_REVISION_REPORT,
          {
            companyId: companyId,
            fromDate: e.fromeToData[0],
            toDate: e.fromeToData[1],
            employeeId: e.employeid,
            fileType: e.fileType,
          }
        );
        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;

          if (filecontent && filename) {
            // Decode base64 string to binary string
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const file = new Blob([byteArray], { type: "text/plain" });

            // Use FileSaver to save the file
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setpayrollSalaryRevisionHistoryReport(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik12 = useFormik({
    initialValues: {
      department: null,
      // date: "",
      salarydate: moment().format("MMMM-YYYY"),
      fileType: "excel",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const response = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_DEPARTMENT_EMPLOYEE_SALERY_REPORT,
          {
            companyId: companyId,
            // fromDate: e.fromeToData[0],
            // toDate: e.fromeToData[1],
            neededYearAndMonth: e.salarydate,
            departmentId: e.department || null,
            fileType: e.fileType,
          }
        );

        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;

          if (filecontent && filename) {
            // Decode base64 string to binary string
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const file = new Blob([byteArray], { type: "text/plain" });

            // Use FileSaver to save the file
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setpayrollDepartmentEmployeeSalaryReport(false);
        }
        // }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik13 = useFormik({
    initialValues: {
      salaryPayoutMonthYear: "",
      location: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        setLoadingIcon(true);
        const response = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PARROLL_payrollWPSReport,
          {
            companyId: companyId,
            salaryPayoutMonthYear: values.salaryPayoutMonthYear,
            locationId: values.location,
          }
        );
        // const response = await axios.post(
        //   "https://alpha-payroll-api.loyaltri.com/api/main",
        //   {
        //     action: "payrollWPSReport",
        //     method: "POST",
        //     kwargs: {
        //       companyId: companyId,
        //       salaryPayoutMonthYear: values.salaryPayoutMonthYear
        //     }
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       "Accept": "application/json"
        //     }
        //   }
        // );

        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;

          if (filecontent && filename) {
            // Decode base64 string to binary string
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const file = new Blob([byteArray], { type: "text/plain" });

            // Use FileSaver to save the file
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setpayrollwps(false);
        }
      } catch (error) {
        // Optionally, you can show an error notification here
        // openNotification("error", "Failed..", error.message || "An unknown error occurred");
      }
      setLoadingIcon(false);
    },
  });

  const formik14 = useFormik({
    initialValues: {
      neededYearAndMonthAndDate: moment().format("YYYY-MM-DD"),
      departmentId: null,
      fileType: "excel",
      location: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        // Format the date to "YYYY-MM-DD"
        const formattedDate = format(
          new Date(e.neededYearAndMonthAndDate),
          "yyyy-MM-dd"
        );

        const result = await fileActionDownload1(
          API.GET_EMPLOYEE_DatewiseEmployeesAttendanceReport,
          {
            companyId: companyId,
            neededYearAndMonthAndDate: formattedDate,
            locationId: e.location,
            departmentId: e.departmentId,
            fileType: e.fileType,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            e.fileType === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }
        setDatewiseEmployeesAttendanceReport(false);
      } catch (error) {
        return error;
      }
      setLoadingIcon(false);
    },
  });

  const formik15 = useFormik({
    initialValues: {
      neededYearAndMonthAndDate: moment().format("MMMM-YYYY"),
      fileType: "pdf",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        // if(e.fileType === "pdf"){
        const result = await fileActionDownload1(
          API.GET_EMPLOYEE_EmployeeMonthwiseAttendanceReport,
          {
            employeeId: e.employeeId,
            neededYearAndMonthAndDate: e.neededYearAndMonthAndDate || null,
            fileType: e.fileType,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;
          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            e.fileType === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }
        setEmployeeMonthwiseAttendanceReport(false);
      } catch (error) {
        return error;
      }
      setLoadingIcon(false);
    },
  });

  const formik16 = useFormik({
    initialValues: {
      fromeToData: [
        moment().format("YYYY/MM/DD"),
        moment().format("YYYY/MM/DD"),
      ],
      // perfomanceMetrics: "",
      // department: "",
      downloadFormat: "pdf",
      location: null,
      category: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        if (e.downloadFormat === "excel") {
          const response = await fileActionDownload1(
            API.GET_WORK_ENTRY_REPORT,
            {
              companyId: companyId,
              departmentId: e.department,
              locationId: e.location,
              categoryId: e.category,
              fileType: e.downloadFormat,
              fromDate: e.fromeToData[0],
              toDate: e.fromeToData[1],
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenWorkEntry(false);
        } else if (e.downloadFormat === "pdf") {
          console.log(e.downloadFormat);
          const response = await fileActionDownload1(
            API.GET_WORK_ENTRY_REPORT,
            {
              companyId: companyId,
              departmentId: e.department,
              locationId: e.location,
              categoryId: e.category,
              fileType: e.downloadFormat,
              fromDate: e.fromeToData[0],
              toDate: e.fromeToData[1],
            }
          );
          if (response.data.status === 200) {
            const { filename, filecontent } = response.data.result;

            // Decode base64 file content
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const file = new Blob([byteArray], {
              type: "application/pdf",
            });

            // Save the file using FileSaver.js
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setOpenWorkEntry(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik17 = useFormik({
    initialValues: {
      // fromeToData: [],
      // perfomanceMetrics: "",
      // department: "",
      date: moment().format("YYYY-MM-DD"),
      // downloadFormat: "",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const formattedDate = format(new Date(e.date), "yyyy-MM-dd");
        const result = await fileActionDownload1(
          API.GET_DAILY_ATTENDANCE_REPORT,
          {
            companyId: companyId,
            neededYearAndMonthAndDate: formattedDate,
            departmentId: e.departmentId || null,
            fileType: "excel",
            locationId: e.location,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }

        setOpenEmployeeDailyAttendence(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik18 = useFormik({
    initialValues: {
      // fromeToData: [],
      // perfomanceMetrics: "",
      department: null,
      date: moment().format("MMMM-YYYY"),
      // downloadFormat: "",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const formattedDate = format(new Date(e.date), "yyyy-MM");
        const result = await fileActionDownload1(
          API.GET_EMPLOYEE_OVERTIME_REPORT,
          {
            companyId: companyId,
            neededYearAndMonth: formattedDate,
            departmentId: e.department,
            fileType: "excel",
            locationId: e.location,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }

        setOpenEmployeeOverTime(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik19 = useFormik({
    initialValues: {
      // fromeToData: [],
      // perfomanceMetrics: "",
      // department: "",
      date: "",
      employeid: null,
      // downloadFormat: "",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const result = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_LOAN_OUTSTANDING_REPORT,
          {
            companyId: companyId,
            employeeId: e.employeid,
            // departmentId: e.department,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info.", result.data.message);
        }

        setpayrollLoanOutstandingReport(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik20 = useFormik({
    initialValues: {
      // fromeToData: [moment().format('YYYY/MM/DD'), moment().format('YYYY/MM/DD')],
      // perfomanceMetrics: "",
      // department: "",
      date: "",
      location: null,
      monthdate: moment().format("MMMM-YYYY"),
      // downloadFormat: "",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const result = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_REVIEW_REPORT,
          {
            companyId: companyId,
            // departmentId: e.department,
            // fromDate: e.fromeToData[0],
            // toDate: e.fromeToData[1],
            neededYearAndMonth: e.monthdate,
            locationId: e.location,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }

        setpayrollReviewReport(false);
      } catch (error) {
        openNotification("error", "Failed", error);
      }
      setLoadingIcon(false);
    },
  });

  const formik21 = useFormik({
    initialValues: {
      fromeToData: [
        moment().format("YYYY/MM/DD"),
        moment().format("YYYY/MM/DD"),
      ],
      // perfomanceMetrics: "",
      department: null,
      date: moment().format("MMMM-YYYY"),
      downloadFormat: "excel",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (e) => {
      try {
        setLoadingIcon(true);
        const formattedDate = format(new Date(e.date), "yyyy-MM");
        const result = await fileActionDownload1(
          API.GET_EMPLOYEE_LOPMONTHLY_REPORT,
          {
            companyId: companyId,
            // neededYearAndMonth: formattedDate,
            startDate: e.fromeToData[0],
            endDate: e.fromeToData[1],
            // departmentId: e.department,
            fileType: e.downloadFormat,
            locationId: e.location,
          }
        );

        if (result.data.status === 200) {
          const { filename, filecontent } = result.data.result;

          // Decode base64 file content
          const byteCharacters = atob(filecontent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          const mimeType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const file = new Blob([byteArray], { type: mimeType });

          // Save the file using FileSaver.js
          FileSaver.saveAs(file, filename);
        } else {
          openNotification("error", "Info", result.data.message);
        }

        setOpenEmployeeOverTime(false);
      } catch (error) {
        openNotification("error", "Failed", error.code);
      }
      setLoadingIcon(false);
    },
  });

  const formik22 = useFormik({
    initialValues: {
      salaryPayoutMonthYear: moment().format("MMMM-YYYY"),
      // downloadFormat: "pdf",
      location: null,
      department: null,
      category: null,
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        setLoadingIcon(true);
        const response = await PayrollfileActionDownload1(
          PAYROLLAPI.GET_PAYROLL_WPS_REPORTKERALA,
          {
            companyId: companyId,
            salaryPayoutMonthYear: values.salaryPayoutMonthYear,
            locationId: values.location,
            departmentId: values.department,
            categoryId: values.category,
            // fileType:values.downloadFormat,
          }
        );

        if (response.status === 200 && response.data && response.data.result) {
          const { filecontent, filename } = response.data.result;

          if (filecontent && filename) {
            // Decode base64 string to binary string
            const byteCharacters = atob(filecontent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const file = new Blob([byteArray], { type: "text/plain" });

            // Use FileSaver to save the file
            FileSaver.saveAs(file, filename);
          } else {
            openNotification("error", "Info", response.data.message);
          }
          setpayrollwpsKerala(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error.message);
      }
      setLoadingIcon(false);
    },
  });

  const getEmployessListForDropDown = async () => {
    const result = await getEmployeeList();

    if (result?.length > 0) {
      const options = result
        .filter(
          (employee) =>
            employee.employeeId !== undefined &&
            employee.firstName !== undefined &&
            employee.lastName !== undefined
        )
        .map(({ employeeId, firstName, lastName }) => ({
          id: employeeId,
          label: `${firstName} ${lastName}`,
          value: employeeId,
          employeeId: employeeId,
        }));
      setEmployeeList(options);
    }
  };

  useEffect(() => {
    getEmployessListForDropDown();
  }, []);


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

  return (
    <FlexCol>
      <div className="flex flex-col">
        {/* <div className="text-lg font-bold dark:text-white">
          {t("Reports")}
        </div>
        <div className="para">
          {t("some descripion here with some lorem ipsum")}
        </div> */}
        <Heading
          title={t("Reports")}
          description={t(
            "The Reports section offers customizable insights and analytics for HR management, facilitating data-driven decisions and improving efficiency."
          )}
        />
      </div>
      {/* <CommandPaletteComponent /> */}

      <Flex justify="space-between">
        {/* <div className="flex items-center gap-[7px]">
          <h1 className="h3 !font-semibold">{t("Total_Reports")}</h1>
          <p className="px-[9px] py-[3px] bg-primaryLight rounded-lg text-primary  font-medium">
            {reportsAccordion.length}
          </p>
        </div>
        <SearchBox placeholder="Search reports" /> */}
      </Flex>
      {reportsAccordion?.map((item, i) => (
        <Accordion
          title={item.title}
          initialExpanded={item.id === 1 && true}
          childrenGap={"gap-0"}
        >
          {item.report?.map((each, i) => (
            <div key={i}>
              <Flex justify="space-between">
                <div className="flex flex-col gap-1">
                  <p className="pblack !font-semibold">{each.title}</p>
                  <p className="para !font-normal">{each.description}</p>
                </div>
                <div className="flex items-center gap-5">
                  {/* <Tooltip placement="top" title={"Generate Pdf"}>
                    <div className=" size-9 2xl:size-10 rounded-full vhcenter borderb bg-black/[0.03]">
                      <img src={Pdf} alt="PDF" className="w-4 2xl:w-5" />
                    </div>
                  </Tooltip>
                  <Tooltip placement="top" title={"Generate Excel"}>
                    <div className=" size-9 2xl:size-10 rounded-full vhcenter borderb bg-black/[0.03]">
                      <img src={Excel} alt="EXCEL" className="w-4 2xl:w-5" />
                    </div>
                  </Tooltip> */}
                  <ButtonClick
                    buttonName={"Generate"}
                    handleSubmit={() => {
                      if (each.value === "employeeReport") {
                        // openModal(each);
                        setIsModalOpen(true);
                      } else if (each.value === "genderReport") {
                        setOpenGender(true);
                      } else if (each.value === "NationalReport") {
                        setOpenNational(true);
                      } else if (each.value === "departmentReport") {
                        setOpenDepartment(true);
                      } else if (each.value === "designationReport") {
                        setOpenDesignation(true);
                      } else if (each.value === "workentryreport") {
                        setOpenWorkEntry(true);
                      } else if (each.value === "employeeLeaveReport") {
                        setOpenEmployeeLeave(true);
                      } else if (each.value === "employeeAttendenceReport") {
                        setOpenEmployeeAttendence(true);
                      } else if (each.value === "dailyattendancereport") {
                        setOpenEmployeeDailyAttendence(true);
                      } else if (each.value === "overtimereport") {
                        setOpenEmployeeOverTime(true);
                      } else if (each.value === "lopmonthlyreport") {
                        setOpenEmployeeLop(true);
                      } else if (each.value === "payrollsummary") {
                        setOpenPayrollsummery(true);
                      } else if (each.value === "payrollAdjustmentReport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (each.value === "payrollSalaryStructureReport")
                        setOpenpayrollSalaryStructurereport(true);
                      else if (
                        each.value === "payrollSalaryRevisionHistoryReport"
                      )
                        setpayrollSalaryRevisionHistoryReport(true);
                      else if (
                        each.value === "payrollDepartmentEmployeeSalaryReport"
                      ) {
                        setpayrollDepartmentEmployeeSalaryReport(true);
                      } else if (each.value === "payrollWPSReport") {
                        setpayrollwps(true);
                      } else if (each.value === "payrollwpsreportkerala") {
                        setpayrollwpsKerala(true);
                      } else if (
                        each.value === "payrollloanoutstandingreport"
                      ) {
                        setpayrollLoanOutstandingReport(true);
                      } else if (each.value === "payrollreviewreport") {
                        setpayrollReviewReport(true);
                      } else if (each.value === "esireport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (each.value === "pfreport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (each.value === "monthlyviewreport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (each.value === "lwfreport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (each.value === "professionalreport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (each.value === "monthlyESICreport") {
                        setreportvalue(each.value);
                        setopenpayrolladjustmentreport(true);
                      } else if (
                        each.value === "DatewiseEmployeesAttendanceReport"
                      ) {
                        setDatewiseEmployeesAttendanceReport(true);
                      } else if (
                        each.value === "EmployeeMonthwiseAttendanceReport"
                      ) {
                        setEmployeeMonthwiseAttendanceReport(true);
                      }
                    }}
                  />
                </div>
              </Flex>
              {/* Add a horizontal line after each item except for the last one */}
              {i !== item.report.length - 1 && (
                <hr className="my-4 border-t border-black/10 dark:border-white/10" />
              )}
            </div>
          ))}
        </Accordion>
      ))}

      {/* employee report 1 */}
      <ModalAnt
        isVisible={isModalOpen}
        onClose={closeModal}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setIsModalOpen(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik.handleSubmit();
              }}
              className={loadingIcon && " cursor-no-drop"}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] h-full gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">All Employee Report</h2>
            <p className="para !font-normal text-center">
              Detailed employee report with all key personal information
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            {/* <RangeDatePicker
              title="From to"
                formik.setFieldValue("fromeToData", e);
              }}
              value={formik.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            /> */}
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                console.log(e);
                formik.setFieldValue("location", e);
              }}
              value={formik.values.location}
              SelectName="All Location"
            />
            <Dropdown
              title="Category"
              placeholder="Choose Category"
              options={categorylist}
              change={(e) => {
                console.log(e);
                formik.setFieldValue("category", e);
              }}
              value={formik.values.category}
              SelectName="All Category"
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik.setFieldValue("department", e);
              }}
              value={formik.values.department}
              SelectName="All Department"
            />

            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik.values.downloadFormat}
              change={(e) => {
                formik.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* employee report 2 */}
      <ModalAnt
        isVisible={Opengender}
        onClose={() => {
          setOpenGender(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenGender(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik2.handleSubmit();
              }}
              className={loadingIcon && " cursor-no-drop"}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Employee Diversity</h2>
            <p className="para !font-normal text-center">
              Summary report of employees
            </p>
          </div>

          <div className="flex-col flex gap-6 w-full">
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik2.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik2.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik2.setFieldValue("department", e);
              }}
              value={formik2.values.department}
              SelectName="All Department"
            />
            <Dropdown
              title="Category"
              placeholder="Choose Category"
              options={categorylist}
              change={(e) => {
                formik2.setFieldValue("category", e);
              }}
              value={formik2.values.category}
              SelectName="All Category"
            />
            {/* <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik2.values.downloadFormat}
              change={(e) => {
                formik2.setFieldValue("downloadFormat", e);
              }}
            /> */}
          </div>
        </div>
      </ModalAnt>

      {/* employee report 3 */}
      <ModalAnt
        isVisible={OpenNational}
        onClose={() => {
          setOpenNational(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenNational(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik3.handleSubmit();
              }}
              className={loadingIcon && " cursor-no-drop"}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">National Diversity Report</h2>
            <p className="para !font-normal text-center">
              Employee nationality report showing count and percentage data
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik3.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik3.values.location}
            />
            <Dropdown
              title="Category"
              placeholder="Choose Category"
              options={categorylist}
              change={(e) => {
                formik3.setFieldValue("category", e);
              }}
              SelectName="All Category"
              value={formik3.values.category}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik3.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik3.values.department}
            />
            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik3.values.downloadFormat}
              change={(e) => {
                formik3.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* employee report 4 */}
      <ModalAnt
        isVisible={OpenDepartment}
        onClose={() => {
          setOpenDepartment(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenDepartment(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik4.handleSubmit();
              }}
              className={loadingIcon && " cursor-no-drop"}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Department Report</h2>
            <p className="para !font-normal text-center">
              Report detailing department distribution by count and percent.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik4.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik4.values.location}
            />
            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik4.values.downloadFormat}
              change={(e) => {
                formik4.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* employee report 5 */}
      <ModalAnt
        isVisible={OpenDesignation}
        onClose={() => {
          setOpenDesignation(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenDesignation(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik5.handleSubmit();
              }}
              className={loadingIcon && " cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Designation Report</h2>
            <p className="para !font-normal text-center">
              Designation report listing counts and their percentages too.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik5.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik5.values.location}
            />
            <Dropdown
              title="Category"
              placeholder="Choose Category"
              options={categorylist}
              change={(e) => {
                formik5.setFieldValue("category", e);
              }}
              SelectName="All Category"
              value={formik5.values.category}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik5.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik5.values.department}
            />
            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik5.values.downloadFormat}
              change={(e) => {
                formik5.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* employee report 6 */}
      <ModalAnt
        isVisible={OpenWorkEntry}
        onClose={() => {
          setOpenWorkEntry(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenWorkEntry(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik16.handleSubmit();
              }}
              className={loadingIcon && " cursor-no-drop"}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Work Entry Report</h2>
            <p className="para !font-normal text-center">
              Report of work entries with date, time, units, and location.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <RangeDatePicker
              title="From to"
              change={(e) => {
                formik16.setFieldValue("fromeToData", e);
              }}
              maxdate={true}
              value={formik16.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik16.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik16.values.location}
            />
            <Dropdown
              title="Category"
              placeholder="Choose Category"
              options={categorylist}
              change={(e) => {
                formik16.setFieldValue("category", e);
              }}
              SelectName="All Category"
              value={formik16.values.category}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik16.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik16.values.department}
            />

            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik16.values.downloadFormat}
              change={(e) => {
                formik16.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* Employee Leave Report */}
      <ModalAnt
        isVisible={OpenEmployeeLeave}
        onClose={() => {
          setOpenEmployeeLeave(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenEmployeeLeave(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin " />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik6.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Employee Leave Report</h2>
            <p className="para !font-normal text-center">
              Detailed Employee Leave Summary: Types, Approvals, and Balances
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            {/* <RangeDatePicker
              title="From to"
              change={(e) => {
                formik.setFieldValue("fromeToData", e);
              }}
              value={formik.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            /> */}
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik6.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik6.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik6.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik6.values.department}
            />

            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik6.values.downloadFormat}
              change={(e) => {
                formik6.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* Employee Attendence Report 1 */}
      <ModalAnt
        isVisible={DatewiseEmployeesAttendanceReport}
        onClose={() => {
          setDatewiseEmployeesAttendanceReport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setDatewiseEmployeesAttendanceReport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik14.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Employee Attendence Report</h2>
            <p className="para !font-normal text-center">
              Daily Attendance Report with Check In, Check Out, Total Work Hours
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Date"
              change={(e) => {
                formik14.setFieldValue("neededYearAndMonthAndDate", e);
              }}
              value={formik14.values.neededYearAndMonthAndDate}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik14.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik14.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik14.setFieldValue("departmentId", e);
              }}
              SelectName="All Department"
              value={formik14.values.departmentId}
            />

            <RadioButton
              image={true}
              options={excelOnlyOptions}
              title="Download Format"
              value={formik14.values.fileType}
              change={(e) => {
                formik14.setFieldValue("fileType", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* Employee Attendence Report 2 */}
      <ModalAnt
        isVisible={EmployeeMonthwiseAttendanceReport}
        onClose={() => {
          setEmployeeMonthwiseAttendanceReport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setEmployeeMonthwiseAttendanceReport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik15.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Employee Monthwise Attendance</h2>
            <p className="para !font-normal text-center">
              Individual Monthly Employee Attendance Report with Check-In,
              Check-Out, Total Work Hours
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Month"
              change={(e) => {
                formik15.setFieldValue("neededYearAndMonthAndDate", e);
              }}
              maxdate={true}
              value={formik15.values.neededYearAndMonthAndDate}
              // onlyViewsomeDays={true}
              pickerType="month"
              dateFormat="MMMM-YYYY"
              className="w-full"
            />
            {/* <Dropdown
              title="Department"
              placeholder="Choose..."
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik15.setFieldValue("departmentId", e);
              }}
              value={formik15.values.departmentId}
            /> */}

            <Dropdown
              title={t("Employee ")}
              placeholder="Choose Employee Name"
              change={(selectedLeaveType) => {
                const selectedOption = employeeList.find(
                  (option) => option.value === selectedLeaveType
                );
                if (selectedOption) {
                  formik15.setFieldValue(
                    "employeename",
                    `${selectedOption.label}`
                  );
                  formik15.setFieldValue(
                    "employeeId",
                    selectedOption.employeeId
                  );
                }
              }}
              SelectName="Select Employee"
              value={formik15.values.employeeId}
              error={formik15.errors.employeename}
              options={employeeList}
            />
            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik15.values.fileType}
              change={(e) => {
                formik15.setFieldValue("fileType", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* Employee Attendence Report 3 */}
      <ModalAnt
        isVisible={OpenEmployeeAttendence}
        onClose={() => {
          setOpenEmployeeAttendence(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenEmployeeAttendence(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik7.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Employee Attendance Muster</h2>
            <p className="para !font-normal text-center">
              Monthly Muster Roll: Staff Name, Shift Type, Date-wise Attendance
              Summary.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Month"
              change={(e) => {
                formik7.setFieldValue("date", e);
              }}
              maxdate={true}
              value={formik7.values.date}
              // onlyViewsomeDays={true}
              dateFormat="MMMM-YYYY"
              pickerType="month"
              className="w-full"
            />
          </div>
        </div>
      </ModalAnt>

      {/* Employee Attendence Report 4 */}
      <ModalAnt
        isVisible={OpenEmployeeDailyAttendence}
        onClose={() => {
          setOpenEmployeeDailyAttendence(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenEmployeeDailyAttendence(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik17.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Daily Attendence Report</h2>
            <p className="para !font-normal text-center">
              Summary of overall and shift-wise staff attendance, leave, and
              work details
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik17.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik17.values.location}
            />
            <DateSelect
              title="Date"
              change={(e) => {
                formik17.setFieldValue("date", e);
              }}
              maxdate={true}
              value={formik17.values.date}
              // onlyViewsomeDays={true}
              dateFormat="YYYY-MM-DD"
              pickerType="date"
              className="w-full"
            />

            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik17.setFieldValue("departmentId", e);
              }}
              SelectName="All Department"
              value={formik17.values.departmentId}
            />
          </div>
        </div>
      </ModalAnt>

      {/* Employee Attendence Report 5 */}
      <ModalAnt
        isVisible={OpenEmployeeOverTime}
        onClose={() => {
          setOpenEmployeeOverTime(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenEmployeeOverTime(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik18.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Overtime Report</h2>
            <p className="para !font-normal text-center">
              Overtime Report: Staff details, dates, hours worked, rates,
              earnings, and payment dates.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Month"
              change={(e) => {
                formik18.setFieldValue("date", e);
              }}
              maxdate={true}
              value={formik18.values.date}
              // onlyViewsomeDays={true}
              dateFormat="MMMM-YYYY"
              pickerType="month"
              className="w-full"
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik18.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik18.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik18.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik18.values.department}
            />
          </div>
        </div>
      </ModalAnt>

      <ModalAnt
        isVisible={OpenEmployeeLop}
        onClose={() => {
          setOpenEmployeeLop(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenEmployeeLop(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik21.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">LOP Monthly Report</h2>
            <p className="para !font-normal text-center">
              Overtime Report: Staff details, dates, hours worked, rates,
              earnings, and payment dates.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <RangeDatePicker
              title="From to"
              change={(e) => {
                formik21.setFieldValue("fromeToData", e);
              }}
              maxdate={true}
              value={formik21.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            />
            {/* <DateSelect
              title="Month"
              change={(e) => {
                formik21.setFieldValue("date", e);
              }}
              maxdate={true}
              value={formik21.values.date}
              // onlyViewsomeDays={true}
              dateFormat="MMMM-YYYY"
              pickerType="month"
              className="w-full"
            /> */}
            {/* <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                console.log(e, "location data");
                formik21.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik21.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik21.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik21.values.department}
            /> */}
            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik21.values.downloadFormat}
              change={(e) => {
                formik21.setFieldValue("downloadFormat", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports  1 */}
      <ModalAnt
        isVisible={openpayRollsummery}
        onClose={() => {
          setOpenPayrollsummery(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenPayrollsummery(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik8.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll Summary Review Report</h2>
            <p className="para !font-normal text-center">
              Consolidated Monthly Payroll Summary: Pay Components, Amounts.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Salary Payout Month Year"
              change={(e) => {
                formik8.setFieldValue("monthdate", e);
              }}
              maxdate={true}
              value={formik8.values.monthdate}
              // onlyViewsomeDays={true}
              // dateFormat="YYYY/MM/DD"
              pickerType="month"
              dateFormat="MMMM-YYYY"
              className="w-full"
            />

            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik8.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik8.values.location}
            />
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik8.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik8.values.department}
            />

            {/* <RadioButton
              image={true}
              options={excelOnlyOptions}
              title="Download Format"
              value={formik8.values.fileType}
              change={(e) => {
                formik8.setFieldValue("fileType", e);
              }}
            /> */}
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports  2 */}
      <ModalAnt
        isVisible={openpayrolladjustmentreport}
        onClose={() => {
          setopenpayrolladjustmentreport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setopenpayrolladjustmentreport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik9.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">
              {reportvalue == "payrollAdjustmentReport"
                ? "Payroll Adjustment Report"
                : reportvalue == "esireport"
                ? "ESI Report"
                : reportvalue == "pfreport"
                ? "PF Report as per Government Norms"
                : reportvalue == "lwfreport"
                ? "LWF Report"
                : reportvalue == "professionalreport"
                ? "Professional State Tax Report"
                : reportvalue == "monthlyESICreport"
                ? "Monthly Report on ESIC Portal"
                : "Monthly View of PF Contributions By Employee and Employer"}
            </h2>
            <p className="para !font-normal text-center">
              {reportvalue == "payrollAdjustmentReport" ? (
                "Monthly Employee-wise Summary of Additions and Deductions."
              ) : reportvalue == "esireport" ? (
                "Generate a report for ESI showing contributions made by both staff and employers."
              ) : reportvalue == "pfreport" ? (
                "Produce a PF report in .txt format as required by government standards."
              ) : reportvalue == "lwfreport" ? (
                "Create a report for the Labour Welfare Fund, including contributions from staff and employers"
              ) : reportvalue == "professionalreport" ? (
                "Prepare a professional tax report compliant with your state's regulations."
              ) : reportvalue == "monthlyESICreport" ? (
                <p>
                  Submit this monthly ESI report via the ESIC portal at{" "}
                  <a
                    href="https://www.esic.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    https://www.esic.gov.in/
                  </a>
                </p>
              ) : (
                "Provide a monthly summary of PF contributions from employees and employers."
              )}
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Salary Payout Month Year"
              change={(e) => {
                formik9.setFieldValue("monthdate", e);
              }}
              maxdate={true}
              value={formik9.values.monthdate}
              dateFormat="MMMM-YYYY"
              pickerType="month"
              className="w-full"
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik9.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik9.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik9.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik9.values.department}
            />
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports 3 */}
      <ModalAnt
        isVisible={OpenpayrollSalaryStructurereport}
        onClose={() => {
          setOpenpayrollSalaryStructurereport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setOpenpayrollSalaryStructurereport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik10.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll Salary Structure Report</h2>
            <p className="para !font-normal text-center">
              Organization-wide Payroll Salary Structure Report as per
              Contractual Terms.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik10.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik10.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik10.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik10.values.department}
            />
            {/* <RangeDatePicker
              title="From to"
              change={(e) => {
                formik.setFieldValue("fromeToData", e);
              }}
              value={formik.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            /> */}
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}

            {/* <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik10.values.fileType}
              change={(e) => {
                formik10.setFieldValue("fileType", e);
              }}
            /> */}
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports 4 */}
      <ModalAnt
        isVisible={payrollSalaryRevisionHistoryReport}
        onClose={() => {
          setpayrollSalaryRevisionHistoryReport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setpayrollSalaryRevisionHistoryReport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik11.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll Salary Revision History Report</h2>
            <p className="para !font-normal text-center">
              Salary Template Change Report: Employee transitions and gross
              salary changes within specified dates.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <RangeDatePicker
              title="From to"
              change={(e) => {
                formik11.setFieldValue("fromeToData", e);
              }}
              maxdate={true}
              value={formik11.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            />
            <Dropdown
              title={"Employee"}
              placeholder="Choose Employee Name"
              change={(selectedLeaveType) => {
                const selectedOption = employeeList.find(
                  (option) => option.value === selectedLeaveType
                );
                if (selectedOption) {
                  formik11.setFieldValue(
                    "employeename",
                    `${selectedOption.label}`
                  );
                  formik11.setFieldValue(
                    "employeid",
                    selectedOption.employeeId
                  );
                }
              }}
              SelectName="Select Employee"
              value={formik11.values.employeid}
              error={formik11.errors.employeename}
              options={employeeList}
            />
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            {/* <Dropdown
              title="Department"
              placeholder="Choose..."
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik.setFieldValue("department", e);
              }}
              value={formik.values.department}
            /> */}

            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik11.values.fileType}
              change={(e) => {
                formik11.setFieldValue("fileType", e);
              }}
            />
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports 5 */}
      <ModalAnt
        isVisible={payrollDepartmentEmployeeSalaryReport}
        onClose={() => {
          setpayrollDepartmentEmployeeSalaryReport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setpayrollDepartmentEmployeeSalaryReport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik12.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Employee Payroll Report</h2>
            <p className="para !font-normal text-center">
              Employee Salary Report: Earnings, Deductions, Gross, Adjustments,
              Expenses, Allowances, Net.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Salary Payout Month Year"
              change={(e) => {
                formik12.setFieldValue("salarydate", e);
              }}
              maxdate={true}
              value={formik12.values.salarydate}
              // onlyViewsomeDays={true}
              pickerType="month"
              dateFormat="MMMM-YYYY"
              className="w-full"
            />
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                formik12.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik12.values.department}
            />
            {/* 
            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik12.values.fileType}
              change={(e) => {
                formik12.setFieldValue("fileType", e);
              }}
            /> */}
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports 6 */}
      <ModalAnt
        isVisible={payrollwps}
        onClose={() => {
          setpayrollwps(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setpayrollwps(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik13.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll WPS report</h2>
            <p className="para !font-normal text-center">
              Wage Protection System report as required by the Government
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            {/* <RangeDatePicker
              title="From to"
              change={(e) => {
                formik12.setFieldValue("fromeToData", e);
              }}
              value={formik12.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            /> */}
            <DateSelect
              pickerType="month"
              dateFormat="MMMM-YYYY"
              title="Salary payout month year"
              value={formik13.values.salaryPayoutMonthYear}
              maxdate={true}
              change={(e) => {
                formik13.setFieldValue("salaryPayoutMonthYear", e);
                // // setFromYear(e);
              }}
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik13.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik13.values.location}
            />
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            {/* <Dropdown
              title="Department"
              placeholder="Choose..."
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik12.setFieldValue("department", e);
              }}
              value={formik12.values.department}
            />

            <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik12.values.fileType}
              change={(e) => {
                formik12.setFieldValue("fileType", e);
              }}
            /> */}
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports 7 */}
      <ModalAnt
        isVisible={payrollLoanOutstandingReport}
        onClose={() => {
          setpayrollLoanOutstandingReport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setpayrollLoanOutstandingReport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik19.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll Loan Outstanding Report</h2>
            <p className="para !font-normal text-center">
              Loan Status and Payment History Report for Employees.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            {/* <RangeDatePicker
              title="From to"
              change={(e) => {
                formik12.setFieldValue("fromeToData", e);
              }}
              value={formik12.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            /> */}
            {/*  <DateSelect
              pickerType="month"
              dateFormat="MMMM-YYYY"
              title="Salary payout month year"
              value={formik13.values.salaryPayoutMonthYear}
              change={(e) => {
                formik13.setFieldValue("salaryPayoutMonthYear", e);
                // // setFromYear(e);
                console.log(e, "seleted to year");
              }}
            /> */}
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            {/* <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik19.setFieldValue("department", e);
              }}
              value={formik19.values.department}
            /> */}

            {/* <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik12.values.fileType}
              change={(e) => {
                formik12.setFieldValue("fileType", e);
              }}
            /> */}
            <Dropdown
              title="Employee"
              placeholder="Choose Employee Name"
              change={(selectedLeaveType) => {
                const selectedOption = employeeList.find(
                  (option) => option.value === selectedLeaveType
                );
                if (selectedOption) {
                  formik19.setFieldValue(
                    "employeename",
                    `${selectedOption.label}`
                  );
                  formik19.setFieldValue(
                    "employeid",
                    selectedOption.employeeId
                  );
                }
              }}
              SelectName="Select Employee"
              value={formik19.values.employeid}
              error={formik19.errors.employeename}
              options={employeeList}
            />
          </div>
        </div>
      </ModalAnt>

      {/* payroll reports 8 */}
      <ModalAnt
        isVisible={payrollReviewReport}
        onClose={() => {
          setpayrollReviewReport(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setpayrollReviewReport(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik20.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll Review Report</h2>
            <p className="para !font-normal text-center">
              Comprehensive Staff Salary and Deduction Report.
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            <DateSelect
              title="Salary Payout Month Year"
              change={(e) => {
                formik20.setFieldValue("monthdate", e);
              }}
              maxdate={true}
              value={formik20.values.monthdate}
              // onlyViewsomeDays={true}
              pickerType="month"
              dateFormat="MMMM-YYYY"
              className="w-full"
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik20.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik20.values.location}
            />
            {/* <DateSelect
              pickerType="month"
              dateFormat="MMMM-YYYY"
              title="Salary payout month year"
              value={formik13.values.salaryPayoutMonthYear}
              change={(e) => {
                formik13.setFieldValue("salaryPayoutMonthYear", e);
                // // setFromYear(e);
                console.log(e, "seleted to year");
              }}
            /> */}
            {/* <CheckboxGroup
              title="Perfomance Metrics"
              options={CheckBoxGroupOptions}
              defaultValue={formik.values.perfomanceMetrics}
              change={(e) => {
                formik.setFieldValue("perfomanceMetrics", e);
              }}
            /> */}
            {/* <Dropdown
              title="Department"
              placeholder="Choose Department"
              options={departmentList}
              change={(e) => {
                console.log(e);
                formik20.setFieldValue("department", e);
              }}
              value={formik20.values.department}
            /> */}

            {/* <RadioButton
              image={true}
              options={RadioGroupOptions}
              title="Download Format"
              value={formik12.values.fileType}
              change={(e) => {
                formik12.setFieldValue("fileType", e);
              }}
            /> */}
          </div>
        </div>
      </ModalAnt>

      <ModalAnt
        isVisible={payrollwpsKerala}
        onClose={() => {
          setpayrollwpsKerala(false);
        }}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={
          <div className="flex items-center gap-3">
            <ButtonClick
              buttonName={"Cancel"}
              handleSubmit={() => {
                setpayrollwpsKerala(false);
              }}
            />
            <ButtonClick
              BtnType={"primary"}
              buttonName={"Download"}
              icon={
                loadingIcon ? (
                  <RiLoader3Fill className="animate-spin" />
                ) : (
                  <PiDownloadSimple />
                )
              }
              handleSubmit={() => {
                formik22.handleSubmit();
              }}
              className={loadingIcon && " focus:cursor-no-drop "}
              loading={loadingIcon}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center md:w-[445px] 2xl:w-[553px] gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 vhcenter bg-primaryalpha/10">
              <TbReportAnalytics size={30} className="text-primary" />
            </div>
            <h2 className="h2">Payroll WPS Report</h2>
            <p className="para !font-normal text-center">
              Wage Protection System report as required by the Government
            </p>
          </div>
          <div className="flex-col flex gap-6 w-full">
            {/* <RangeDatePicker
              title="From to"
              change={(e) => {
                formik12.setFieldValue("fromeToData", e);
              }}
              value={formik12.values.fromeToData}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
              className="w-full"
            /> */}
            <DateSelect
              pickerType="month"
              dateFormat="MMMM-YYYY"
              title="Salary payout month year"
              value={formik22.values.salaryPayoutMonthYear}
              maxdate={true}
              change={(e) => {
                formik22.setFieldValue("salaryPayoutMonthYear", e);
                // // setFromYear(e);
              }}
            />
            <Dropdown
              title="Location"
              placeholder="Choose Location"
              options={locationlist}
              change={(e) => {
                formik22.setFieldValue("location", e);
              }}
              SelectName="All Location"
              value={formik22.values.location}
            />
            <Dropdown
              title="Department"
              placeholder="Select"
              options={departmentList}
              change={(e) => {
                formik22.setFieldValue("department", e);
              }}
              SelectName="All Department"
              value={formik22.values.department}
            />
            <Dropdown
              title="Category"
              placeholder="Select"
              options={categorylist}
              change={(e) => {
                formik22.setFieldValue("category", e);
              }}
              SelectName="All Category"
              value={formik22.values.category}
            />
          </div>
        </div>
      </ModalAnt>
    </FlexCol>
  );
}

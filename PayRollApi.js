import axios from "axios";
import config from "../config";

const PAYROLLAPI = {
  // HOST: "https://demo-payroll-api.loyaltri.com",

  //token

  GET_TOKEN: "/api/TokenSetting",

  //  BankAccountSettings

  GET_ALL_BANK_RECORDS: "getAllBanks",
  GET_ALL_EXCHANGE_HOUSE_RECORDS: "getAllExchange",
  COMPANYBANK_DETAILS_RECORDS: "CompanyBankDetails",
  EMPLOYEE_BANKACCOUNT_RECORDS: "getAllEmployeeBank",
  CREATE_BANK_BANKACCOUNTSETTING: "saveBank",
  CREATE_BANK_EXCHANGEHOUSE: "saveExchange",
  GET_BANK_RECORDS_BY_ID: "getBankById",
  UPDATE_BANKRECORD_BYID: "updateBank",
  GET_COMPANYBANK_DETAILS: "getAllCompanyBank",
  GET_EXCHANGEHOUSE_RECORDS_BY_ID: "getExchangeById",
  UPDATE_EXCHANGEHOUSERECORD_BYID: "updateExchange",
  UPDATE_WPSCONFIG_RECORD: "wpsConfigUpdate",
  UPDATE_EXCHANGEHOUSE_RECORD: "companyExchangeHouseUpdate",
  UPDATE_COMPANYBANKDETAILS_RECORD: "CompanyBankUpdate",
  GET_EMPLOYEEYBANK_DETAILS_BY_ID: "getEmployeeBankById",
  GET_ALL_EMPLOYEE_SALARY_PAYMENT_METHODS: "paymentMethodEmployeeBank",
  UPDATE_EMPLOYEEBANKDETAILS_RECORD: "updateEmployeeBank",

  // SalaryComponents

  GET_ALL_EARNINGS_RECORDS: "getAllEarnings",
  GET_ALL_VARIABLEPAYS_RECORDS: "getAllVariablePays",
  GET_ALL_ADDITIONS_RECORDS: "getAllAdditions",
  GET_ALL_DEDUCTIONS_RECORDS: "getAllDeductions",
  CREATE_SALARYCOMPONENTS_EARNINGS: "saveEarnings",
  CREATE_SALARYCOMPONENTS_VARIABLEPAYS: "saveVariablePays",
  CREATE_SALARYCOMPONENTS_ADDITIONS: "saveAdditions",
  CREATE_SALARYCOMPONENTS_DEDUCTIONS: "saveDeductions",
  GET_EARNINGS_RECORDS_BY_ID: "getEarningsById",
  UPDATE_EARNINGSRECORD_BY_ID: "updateEarnings",
  GET_VARIABLEPAYS_RECORDS_BY_ID: "getVariablePaysById",
  UPDATE_VARIABLEPAYS_BY_ID: "updateVariablePays",
  GET_ADDITIONS_RECORDS_BY_ID: "getAdditionsById",
  UPDATE_ADDITIONS_BY_ID: "updateAdditions",
  GET_DEDUCTIONS_RECORDS_BY_ID: "getDeductionsById",
  UPDATE_DEDUCTIONS_BY_ID: "updateDeductions",

  // SalaryComponents INDIA

  GET_ALL_EARNINGS_RECORDS_FOR_INDIAN_COMPONENT: "getAllEarningsHierarchyTypes",
  CREATE_SALARYCOMPONENTS_EARNINGS_INDIAN_COMPONENT: "saveEarnings",
  UPDATE_SALARYCOMPONENTS_EARNINGS_INDIAN_COMPONENT_BY_ID: "updateEarnings",

  // Statutory Configuration

  GET_STATUTORY_CONFIGURATIONS_RECORDS: "getCompanyStatutoryConfig",
  SAVE_EPF_IN_STATUTORY_COMFIGURATION: "saveStatutoryEPFconfig",
  SAVE_ESI_IN_STATUTORY_COMFIGURATION: "saveStatutoryESIconfig",
  SAVE_LWF_IN_STATUTORY_COMFIGURATION: "saveStatutoryLWFconfig",
  SAVE_PT_IN_STATUTORY_COMFIGURATION: "saveStatutoryPTconfig",
  STATUTORY_CONFIGURATIONS_RECORDS_TOGGLE_STATUS: "toggleStatutoryConfigStatus",
  GET_EMPLOYESS_FOR_ESI_ASSIGNED_LIST: "employeeListStatutoryEmployeeMaping",
  ASSIGN_EMPLOYEE_FOR_ESI: "updateStatutoryEmployeeMapingNew", // "updateStatutoryEmployeeMaping",
  GET_EMPLOYEE_DASHBOARD_PAYROLL_VIEW_DATA_FOR_STATUTORY_DATA:
    "employeeProfileStatutoryContribution",
  GET_EPF_RECORDS_BY_ID: "getStatutoryConfigById",

  // SocialSecurityContributions

  GET_ALL_SocialSecurityContributions_RECORDS: "getAllSSContributions",
  CREATE_SocialSecurityContributions_RECORD: "saveSSContributions",
  GET_SocialSecurityContributions_RECORD_BY_ID: "getSSContributionsById",
  UPDATE_SocialSecurityContributions_RECORD_BY_ID: "updateSSContributions",
  ASSIGN_EMPLOYEE_FOR_SocialSecurityContributions: "saveSSEmployee",
  UPDATE_SocialSecurityContributions_EMPLOYEES_BY_ID: "updateSSEmployee",

  // Salary Template Builder

  GET_ALL_Salary_Template_Builder: "getAllSalaryTemp",
  CREATE_Salary_Template_Builder_RECORD: "saveSalaryTemp",
  ASSIGN_EMPLOYEE_FOR_SALARYTEMPLATE: "saveSalaryTempEmployeeMaping",
  GET_Salarytemplate_RECORD_BY_ID: "getSalaryTempById",
  UPDATE_Salarytemplate_RECORD_BY_ID: "updateSalaryTemp",
  UPDATE_Salarytemplate_EMPLOYEES_BY_ID: "updateSalaryTempEmployeeMaping",
  GET_EMPLOYEE_LIST_FOR_SALARY_TEMPLATE: "employeeListSalaryTempEmployeeMaping",
  GET_EMPLOYEE_TEMPLATE_EARNINGS_AND_DEDUCTIONS_IN_EMPLOYEE_ONBOARDING:
    "TemplateEarningsAndDeductions",
  SAVE_Salary_Template_Employee_Mapping: "saveSalaryTempEmployeeMapingSingle",
  IMPORT_XLSX_FILE_FOR_BULK_TEMPLATE_UPLAOD_ENDPOINT: "BulkSalaryImport",

  // Payroll Configuration

  GET_ALL_PAYROLL_CONFIGURATIONS_DATA_BY_COMPANY: "getAllpayrollConfigurations",
  GET_PAYROLL_CONFIGURATIONS_DATA_BY_ID: "getpayrollConfigurationById",
  UPDATE_PAYROLL_CONFIGURATION_DATA_BY_COMPANY: "updatepayrollConfiguration",
  GET_ALL_FINANCIALYEAR_DATA: "getAllFinancialYear",

  // FinalSettlements

  GET_ALL_LeaveENCASHMENTRULES_RECORDS: "getAllLeaveEncashmentRules",
  CREATE_LeaveENCASHMENTRULES_RECORD: "saveLeaveEncashmentRules",
  GET_LeaveENCASHMENTRULES_RECORDS_BY_ID: "getLeaveEncashmentRulesById",
  UPDATE_LeaveENCASHMENTRULES_RECORD_BY_ID: "updateLeaveEncashmentRules",
  GET_ALL_Gratuity_Settings_RECORDS: "getAllGratutitySettings",
  CREATE_GratuitySettings_RECORD: "saveGratutitySettings",
  GET_Gratuity_Settings_RECORDS_BY_ID: "getGratutitySettingsById",
  UPDATE_Gratuity_Settings_RECORDS_BY_ID: "updateGratutitySettings",

  // Loan Settings

  GET_ALL_Loan_Settings_RECORDS: "getAllLoanPolicies",
  CREATE_Loan_Settings_RECORD: "saveLoanPolicies",
  GET_Loan_Settings_RECORDS_BY_ID: "getLoanPoliciesById",
  UPDATE_Loan_Settings_RECORD_BY_ID: "updateLoanPolicies",
  Employee_Final_Loan: "employeeFinalLoan",
  //Payroll Work Expense

  GET_ALL_WORK_EXPENSES_RECORD: "getAllEmployeeMyWorkExpense",
  CREATE_WORK_EXPENSES_RECORD: "saveEmployeeWorkExpense",
  GET_WORK_EXPENSE_CATEGORY_RECORD: "getAllWorkExpenseCategroy",
  UPDATE_EMPLOYEE_WORK_EXPENSE_CATEGORY_RECORD:
    "WorkExpenseApproveStatusChange",
  GET_ALL_WORK_EXPENSES: "getAllEmployeeWorkExpense",
  GET_EMPLOYEE_WORK_EXPENSES: "getEmployeeWorkExpenseById",
  UPDATE_EMPLOYEE_WORK_EXPENSES: "updateEmployeeWorkExpense",

  //Payroll Adjustments

  GET_ALL_EMPLOYEE_ADDITIONS_RECORD: "getAllEmployeeAdditions",
  CREATE_EMPLOYEE_ADDITIONS_RECORD: "saveEmployeeAdditions",
  GET_EMPLOYEE_ADDITIONS_RECORD_BY_ID: "getEmployeeAdditionsById",
  UPDATE_EMPLOYEE_ADDITIONS_RECORD_BY_ID: "updateEmployeeAdditions",
  GET_ALL_EMPLOYEE_DEDUCTIONS_RECORD: "getAllEmployeeDeductions",
  CREATE_EMPLOYEE_DEDUCTIONS_RECORD: "saveEmployeeDeductions",
  GET_EMPLOYEE_DEDUCTIONS_RECORD_BY_ID: "getEmployeeDeductionsById",
  UPDATE_EMPLOYEE_DEDUCTIONS_RECORD_BY_ID: "updateEmployeeDeductions",
  GET_ALL_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD:
    "getAllEmployeeReccuringAjdustments",
  CREATE_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD:
    "saveEmployeeReccuringAjdustments",
  GET_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD_BY_ID:
    "getEmployeeReccuringAjdustmentsById",
  UPDATE_EMPLOYEE_RECURRING_ADJUSTMENT_RECORD_BY_ID:
    "updateEmployeeReccuringAjdustments",

  //Payroll Table

  GET_ALL_COMPANY_GENERALDATA_RECORD_BY_MONTHS: "generalPayoutData",
  GET_COMPANY_GENERAL_PAYROLL_DATA_RECORD_BY_MONTH: "fetchAllEmployeePayouts",
  GET_PAYROLLTABLE_EMPLOYEE_DATA_EMPLOYEE_ADJUSTEMENTS:
    "fetchAllEmployeeAdjustements",
  GET_PAYROLLTABLE_EMPLOYEE_DATA_EMPLOYEE_ADJUSTEMENTS_FOR_SETTLED_OR_ISHOLD_EMPOYESS:
    "fetchAllEmployeeAdjustementsSettled",
  CHECK_UNCHECK_EMPLOYEE_WORK_EXPENSE: "ckeckUnckeckEmployeeWorkExpense",
  CHECK_UNCHECK_EMPLOYEE_Addition: "ckeckUnckeckEmployeeAdditions",
  CHECK_UNCHECK_EMPLOYEE_Deduction: "ckeckUnckeckEmployeeDeductions",
  GET_COMPANY_GENERAL_PAYROLL_DATA_RECORD_MONTHLY_COUNTS: "monthPayoutCounts",
  GET_SELECTED_EMPLOYEES_DETAILS_IN_POPUP: "selectedSummeryBeforeSubmitPayout",
  SAVE_SELECTED_EMPLOYEES_DETAILS_IN_POPUP: "savePayouts",
  DOWNLOAD_SALARYSLIP_PARTICULAR_EMPLOYEE: "employeeSalaryPaySlip",
  SALARY_RELEASE_FOR_PARTICULAR_EMPLOYEE_BY_ID: "releaseHoldedSalary",
  //Payroll MySalary

  Get_EMPLOYEE_SALARY_LIST_BASED_ON_MONTH: "fetchEmployeeByIdPayouts",
  Get_EMPLOYEE_ADJUSTEMENT_LIST_BASED_ON_MONTH: "fetchEmployeeByIdAdjustments",
  Get_EMPLOYEE_SALARY_DATA_UNTIL_CURRENT_DATE: "monthTillDateSalary",

  // Payroll API'S Used In DashBoard Or EmployeeCreate

  GET_EMPLOYEES_SALARY_PAYMENT_SUMARY_DETAILS: "EmployeePaymentSummary",
  GET_PAYROLL_DETAILS_FOR_NET_TRANSACTIONS_IN_DASHBOARD: "totalFigures",
  GET_PAYROLL_DETAILS_FOR_PAYROLL_STATUS_IN_DASHBOARD: "payrollStatus",
  GET_PAYROLL_DETAILS_FOR_PAYROLL_SUMMARY_IN_DASHBOARD: "payrollSummary",
  GET_getAllCompanyBank: "getAllCompanyBank",
  GET_EMPLOYEE_EMPLOYMENT_INFO: "getEmployeeStatutoryDetailsById",
  SAVE_EMPLOYEE_STATUTORY_INFO: "employeeProfileStatutorydetailsSave",
  SAVE_STATUTORY_TOGGLE_STATUS: "employeeStatutoryReviseSave",
  GET_EMPLOYEE_DASHBOARD_PAYROLL_VIEW_DATA: "employeeProfileMonthlySalary",
  GET_PARTICULAR_EMPLOYEE_ID_BASED_SALARY_REVISION_DATA:
    "salaryReviseGetByEmployee",
  REVISE_SALARY_FOR_PARTICULAR_EMPLOYEE_BY_ID:
    "saveSalaryTempEmployeeMapingSingle",
  EDIT_SALARY_FOR_PARTICULAR_EMPLOYEE_BY_ID: "editEmployeeSalary",
  GET_SALARY_TEMPLATE_CHECK_DATA_WHILE_UPDATE: "employeeSalaryTempStatusById",
  GET_ALL_SALARY_TEMPLATE_UNASSIGNED_LIST: "employeesWithoutSalaryTemp",
  GET_ALL_EMPLOYEE_SALARY_HOLD_LIST: "employeesHoldSalaryList",
  GET_EMPLOYEE_MONTHLY_PAID_LIST: "employeePaidMonthlyList",

  // Payroll EmployeeLoan and MyLoan

  SAVE_EMPLOYEE_LOAN_REQUEST: "employeeLoanRequestSave",
  GET_ALL_EMPLOYEE_LOAN_REQUESTS_LIST: "employeeLoanRequestGetList",
  GET_LOGGED_IN_EMPLOYEE_LOAN_REQUEST_LIST: "employeeLoanRequestGetListMy",
  ACCEPT_OR_REJECT_EMPLOYEE_LOAN: "employeeLoanApproveStatusChange",
  GET_EMPLOYEE_LOAN_REQUEST_RECORDS_BY_ID: "employeeLoanRequestGetById",
  ADD_APPROVED_EMPLOYEE_LOAN_DETIALS_TO_PAYROLL_TABLE:
    "employeeLoanRequestAddtoPayroll",

  //REPORTS

  // GET_PAYROLL_SUMMERY: "payrollSummaryReport",
  GET_PAYROLL_SUMMERY: "payrollSummaryReviewReport",
  GET_PAYROLL_ADJUSTMENT_REPORT: "payrollAdjustmentReport",
  GET_PAYROLL_SLARY_STRUCTURE_REPORT: "payrollSalaryStructureReport",
  GET_PAYROLL_SALARY_REVISION_REPORT: "payrollSalaryRevisionHistoryReport",
  GET_PAYROLL_DEPARTMENT_EMPLOYEE_SALERY_REPORT:
    "payrollDepartmentEmployeeSalaryReport",
  GET_PARROLL_payrollWPSReport: "payrollWPSReport",
  GET_PAYROLL_LOAN_OUTSTANDING_REPORT: "loanOutstandingReport",
  GET_PAYROLL_REVIEW_REPORT: "payrollReviewReport",
  GET_PAYROLL_ESI_REPORT: "generateESIReport",
  GET_PAYROLL_WPS_REPORTKERALA: "payrollWPSReportKerala",
  GET_PAYROLL_PF_REPORT: "generatePFReport",
  GET_PAYROLL_MONTHLY_PF_CONTRIBUTION: "monthlyPFcontributions",
  GET_LWF_REPORT: "generateLWFReport",
  GET_PROFESSIONAL_STATE_TAX_REPORT: "professionalStateTaxReport",
  GET_MONTHLY_ESI_REPORT: "uploadMonthlyReportESIC",

  //finalsettlement
  GET_FINALSETTLEMENT_employeeFinalLeaveEncashment:
    "employeeFinalLeaveEncashment",
  SAVE_employeeFinalLeaveEncashmentSave: "employeeFinalLeaveEncashmentSave",
  GET_EMPLOYEE_FINAL_GRATIVITY: "employeeFinalGratuity",
  GET_EMPLOYEE_FINALSUMMERY: "employeeFinalSummary",
  SAVE_EMPLOYEE_FINAL_GRATUITY: "employeeFinalGratuitySave",
  SAVE_EMPLOYEE_FINAL_SUMMARY: "employeeFinalSummarySave",
};

export default PAYROLLAPI;
let token = JSON.parse(localStorage.getItem("LoginData"));

// const urlMain = "https://web-payroll-api.loyaltri.com/api/main";
const urlMain = `${config.payRollUrl}/api/main`;
// const urlMain = `http://192.168.0.34/loyaltri-payroll-server/api/main`;
// const urlMain = "https://demo-payroll-api.loyaltri.com/api/main";

const Payrollaction = async (actionUrl, params = {}, url = urlMain) => {
  try {
    const result = await axios.post(
      url,
      {
        action: actionUrl,
        method: "POST",
        kwargs: params,
      },
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token?.userData.token}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    return error;
  }
};

export { Payrollaction };

// const urlFileHandler = "https://web-payroll-api.loyaltri.com/api/fileHandler";
const urlFileHandler = `${config.payRollUrl}/api/fileHandler`;
// const urlFileHandler = "https://demo-payroll-api.loyaltri.com/api/fileHandler";

const payrollFileAction = async (formData, actionUrl) => {
  try {
    const result = await axios.post(urlFileHandler, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token?.userData.token}`,
      },
      params: {
        action: actionUrl,
      },
    });
    return result.data;
  } catch (error) {
    return error;
  }
};
export { payrollFileAction };
const PayrollfileActionDownload = async (
  actionUrl,
  params = {},
  url = urlMain
) => {
  try {
    const result = await axios.post(
      url,
      {
        action: actionUrl,
        method: "POST",
        kwargs: params,
      },
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token?.userData.token}`,
        },
      }
    );

    return result.data;
  } catch (error) {
    return error;
  }
};
export { PayrollfileActionDownload };
const PayrollfileActionDownload1 = async (
  actionUrl,
  params = {},
  headers = {},
  url = urlMain
) => {
  try {
    const result = await axios.post(
      url,
      {
        action: actionUrl,
        method: "POST",
        kwargs: params,
      },
      {
        headers: {
          Authorization: `Bearer ${token?.userData.token}`,
        },
      }
    );
    return result;
  } catch (error) {
    return error;
  }
};
export { PayrollfileActionDownload1 };

// const urlFileHandlerForEmployeePaySlip = `${config.payRollUrl}`;

// const payrollFileActionForPayrollTableEmployeePaySlip = async (
//   actionUrl,
//   params = {},
//   url = urlFileHandlerForEmployeePaySlip
// ) => {
//   try {
//     const result = await axios.get(`${url}/Pdf/PaySlip/${actionUrl}`, {
//       params,
//       responseType: "blob",
//     });
//     return result.data;
//   } catch (error) {
//     return error;
//   }
// };

// export { payrollFileActionForPayrollTableEmployeePaySlip };

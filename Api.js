import axios from "axios";
import config from "../config";

const API = {
  // HOST: "http://192.168.29.111/loyaltri-server",
  // HOST: "http://192.168.0.6",

  // HOST: "https://demo-api.loyaltri.com",
  HOST: `${config.apiUrl}`,
  // HOST: "https://web-api.loyaltri.com",

  //FEEDS
  // FEEDS_HOST: "http://192.168.0.34/loyaltri-feeds-server",
  FEEDS_HOST: `${config.feedUrl}`,
  // FEEDS_HOST: "https://demo-feeds-api.loyaltri.com",
  // FEEDS_HOST: "https://web-feeds-api.loyaltri.com",

  FEEDS_MAIN: "/api/main",

  FEEDS_FILEHANDLER: "/api/fileHandler",
  //END FEEDS

  FORGOT_PASSWORD: "forgotPassword",
  RESET_PASSWORD: "resetPassword",
  UPDATE_PASSWORD: "changePassword",

  // TRANSFER EMPLOYEES
  GET_TRANSFER_LIST: "getAllTransferDetails",
  TRANSFER_EMPLOYEE: "getCompaniesByLocation",

  // appearnce page api

  GET_APPEARANCE_THEME: "getAppearanceByEmployeeId", // "getAppearanceThemeByEmployeeId",
  THEME_SETTINGS: "saveOrUpdateAppearance", //  "saveAppearanceTheme", // "/AppearanceTheme/create_appearanceTheme",
  UPDATE_THEME: "updateAppearanceTheme", // "/appearanceTheme/update_appearanceTheme",

  //notification page api
  NOTIFICATION_SETTINGS: "/Notification/create_notification",

  //  company
  ADD_COMPANY: "saveCompany", // "/company/create_company",
  // ADD_COMPANY: "/create_company",
  UPDATE_COMPANY: "updateCompany", // "/company/update_company",
  GET_COMPANY_RECORDS: "getAllCompany", // "/company",
  DELETE_COMPANY_RECORD: "deleteCompanyById", // "/company/delete_company",
  GET_COMPANY_ID_BASED_RECORDS: "getCompanyById", // "/company/show_company",
  UPDATE_ONLY_ISACTIVE: "toggleCompanyStatus", // "/company/updateisActive_company",

  // DESIGNATION

  ADD_DESIGNATION: "saveDesignation", //"/designation/create_designation",
  GET_DESIGNATION_RECORDS: "getAllDesignationByCompanyId", //"/designation",
  UPDATE_DESIGNATION: "updateDesignation", //"/designation/update_designation",
  GET_DESIGNATIONID_BASED_RECORDS: "getDesigationtById", //"/designation/show_designation",
  DELETE_DESIGNATION_RECORD: "deleteDesigationById", //"/designation/delete_designation",
  UPDATE_DESIGNATION_STATUS: "toggleDesignationStatus",

  // Document Types

  ADD_DOCUMENT_TYPES: "saveDocumentType", // "/documentType/create_documentType",
  UPDATE_DOCUMENT_TYPES: "updateDocumentType", // "/documentType/update_documentType",
  GET_DOCUMENTID_BASED_RECORDS: "getDocumentTypeById", //"/documentType/show_documentType",
  GET_DOCUMENT_TYPES_RECORDS: "getAllDocumentType", //"/documentType",
  DELETE_DOCUMENT_TYPES_RECORDS: "deleteDocumentTypeById", // "/documentType/delete_documentType",
  UPDATE_DOCUMENT_STATUS: "toggleDocumentTypeStatus",

  //  Assets Types

  ADD_ASSET_TYPE: "saveAsset",
  // ADD_ASSETS_TYPES: "getHierarchyEmployeesDocuments", // "/assetType/create_AssetType",
  UPDATE_ASSETS_TYPES: "updateAsset", // "/assetType/update_AssetType",
  GET_ASSETS_TYPESID_BASED_RECORDS: "getAssetById", //"/assetType/show_AssetType",
  GET_ASSETS_TYPES_RECORDS: "getAllCompanyAssetTypesByCompanyId", // "/assetType",
  DELETE_ASSETS_TYPES_RECORDS: "deleteAssetById", //"/assetType/delete_AssetType",
  UPDATE_ASSETS_STATUS: "toggleAssetStatus",
  UPDATE_EMPLOYEE_ASSETS_REQUEST: "updateEmployeeAssetsRequest",
  UPDATE_EMPLOYEE_ASSETS: "editEmployeeAssetRequest",
  DELETE_REQUESTED_ASSETS: "deleteEmployeeAssetRequest",
  //  Country

  ADD_COUNTRY: "saveCountry", // "/Country/create_country",
  UPDATE_COUNTRY: "updateCountry", // "/country/update_country",
  GET_COUNTRY_ALL_LIST: "getAllCountry", // "/country",
  GET_COUNTRY_LIST: "/country/active", //--------------------------
  GET_COUNTRY_BY_ID: "getCountryById", // "/country/show_country",
  DELETE_COUNTRY: "deleteCountryById", // "/country/delete_country",
  UPDATE_COUNTRY_STATUS: "togglecountryStatus",

  //  STATE/PROVINCE

  ADD_STATE: "saveStateWithCityBatch", // "saveState", // "/state/create_state",
  UPDATE_STATE: "updateStateWithCityBatch", // "updateState", // "/state/update_state",
  GET_STATE_LISTS: "getAllState", // "/state",
  GET_STATE_BY_ID: "getStateById", // "/state/show_state",
  DELETE_STATE: "deleteStateById", // "/state/delete_state",
  UPDATE_STATE_STATUS: "togglestateStatus",

  // Organisation

  // GET_ORGANISACTION_RECORDS: "/organisation",
  // GET_ORGANISACTION_RECORDS: "/organisation/show_org",
  // UPDATE_ORGANISACTION: "/organisation/update_org",

  GET_ALL_ORGANISATION: "getAllOrganisation",
  GET_ORGANISATION_BY_ID: "getOrganisationById",
  UPDATE_ORGANISATION: "updateOrganisation",
  UPDATE_ORGANISATION_STATUS: "toggleOrganisationStatus",

  // get organisationDocuments
  GET_ALL_ORGANISATION_DOCS: "getAllOrganisationDocument",
  DELETE_ORGANISATION_DOCS: "organizationDocumentDelete",
  // login

  LOGIN_USER: "/AdminLogin",

  // Location

  ADD_LOCATION: "saveLocation", // "/location/create_location",
  GET_LOCATION: "getAllLocation", // "/location",
  UPDATE_LOCATION: "updateLocation", // "/location/update_location",
  GET_LOCATIONID_BASED_RECORDS: "getLocationById", // "/location/show_Location",
  DELETE_LOCATION: "deleteLocationById", // "/location/delete_location",
  UPDATE_LOCATION_STATUS: "toggleLocationStatus",

  // department

  ADD_DEPARTMENT: "saveDepartment", // "/department/create_department",
  GET_DEPARTMENT: "getAllDepartment", // "/department",
  UPDATE_DEPARTMENT: "updateDepartment", // "/department/update_department",
  GET_DEPARTMENT_ID_BASED_RECORDS: "getDepartmentById", // "/department/show_department",
  DELETE_DEPARTMENT: "deleteDepartmentById", // "/department/delete_department",
  UPDATE_DEPARTMENT_STATUS: "toggleDepartmentStatus",

  // category

  ADD_CATEGORY: "saveCategory", // "/category/create_category",
  GET_CATEGORY: "getAllCategory", // "/category",
  UPDATE_CATEGORY: "updateCategory", // "/category/update_category",
  GET_CATEGORY_ID_BASED_RECORDS: "getCategoryById", // "/category/show_category",
  DELETE_CATEGORY: "deleteCategoryById", // "/category/delete_category",
  UPDATE_CATEGORY_STATUS: "toggleCategoryStatus",

  // subCategory

  ADD_SUB_CATEGORY: "saveSubCategory", // "/subCategory/create_subcategory",
  GET_SUB_CATEGORY: "getAllSubCategory", // "/subCategory",
  UPDATE_SUB_CATEGORY: "updateSubCategory",
  GET_SUB_CATEGORY_ID_BASED_RECORDS: "getSubCategoryById", // "/SubCategory/show_subcategory",
  DELETE_SUB_CATEGORY: "deleteSubCategoryById",
  UPDATE_SUB_CATEGORY_STATUS: "toggleSubCategoryStatus",

  // leaveType

  // ADD_LEAVE_TYPES: "/leaveType/create_leaveType",
  ADD_ASSIGN_EMPLOYEE_LEAVE_TYPES: "updateEmployeeLeave", //  "LeaveTypeAssignToEmployee", // "createEmployeeLeave", // "/employeeLeave/create_EmployeeLeave", // "/AssignleaveType/create_assignleaveType",
  UPDATE_ASSIGN_EMPLOYEE_LEAVE_TYPES: "UpdateLeaveTypeAssignToEmployee",
  UPDATE_LEAVE_TYPES: "/LeaveType/update_leaveType",
  DELETE_LEAVE_TYPES: "deleteLeaveTypeById", // "/leaveType/delete_leaveType",
  UPDATE_LEAVE_TYPES_STATUS: "toggleLeaveTypeStatus",

  //Assign LeavTyepes
  // ADD_ASSIGN_LEAVE_TYPES: "/AssignleaveType/create_assignleaveType",

  // shift

  GET_SHIFT_RECORDS: "getAllShift", // "/shift",
  UPDATE_SHIFT: "updateShift", // "/shift/update_shift",
  ADD_SHIFT: "saveShift", // "/shift/create_shift",
  DELETE_SHIFT_RECORD: "deleteShiftById", // "/shift/delete_shift",
  GET_SHIFT_ID_BASED_RECORDS: "getShiftById", // "/shift/show_shift",
  DELETE_SHIFT: "deleteShiftById", //"/shift/delete_shift",
  UPDATE_SHIFT_STATUS: "toggleShiftStatus",

  // shiftScheme

  ADD_SHIFT_SCHEME: "saveshiftScheme", // "/shiftScheme/create_shiftScheme",
  GET_SHIFT_SCHEME: "getAllShiftSchemesByCompanyId", // "/shiftScheme",
  UPDATE_SHIFT_SCHEME: "updateshiftScheme", // "/shiftScheme/update_shiftScheme",
  UPDATE_EMPLOYEE_SHIFT_SCHEME: "updateEmployeeShiftScheme",
  GET_SHIFT_SCHEME_ID_BASED_RECORDS: "getshiftSchemeById", // "/shiftScheme/show_shiftScheme",
  DELETE_SHIFT_SCHEME: "deleteShiftSchemeById", // "/shiftScheme/delete_shiftScheme",
  ADD_ASSIGN_SHIFT_SCHEME: "saveEmployeeShiftScheme", // "/employeeShiftScheme/create_EmployeeShiftScheme",

  // employee
  GET_EMPLOYEE: "getAllEmployee", // "/employee",
  ADD_EMPLOYEE: "saveEmployee", // "/employee/create_employee",
  UPDATE_EMPLOYEE_BASIC_DETAILS: "updateEmployee", // "/employee/update_employee",
  UPDATE_PERSONAL_INFORMATION: "updatePersonalInformation",
  GET_EMPLOYEE_ID_BASED_RECORDS: "getEmployeeById", // "/employee/show_employee",
  DELETE_EMPLOYEE_BY_ID: "deleteEmployeeById",

  ADD_EMPLOYEE_ADDRESS: "saveEmployeeAddress", // "/employeeAddress/create_employeeAddress", // "saveEmployeeAddress", //
  UPDATE_EMPLOYEE_ADDRESS: "/employeeAddress/update_employeeAddress",

  ADD_EMPLOYEE_BASIC_DETAILS: "/employeeBiodata/create_employeeBiodata",
  ADD_EMPLOYEE_COMPANY: "saveEmployeeCompany", // "/employeeCompany/create_employeeCompany", //"saveEmployeeCompany", //
  GET_EMPLOYEE_DOCUMENT: "getEmployeeDocuments", //employeeId
  // ADD_EMPLOYEE_DOCUMENT: "/employeeDocuments/create_EmployeeDocuments",
  GET_EMPLOYEE_ASSETS: "/employeeAssets", //employeeId

  EMPLOYEE_REPORTING_MANAGERS: "employeeRole",

  DOWNLOAD_XLSX: "/employee/employeeimporttemplate",
  // Master Admin

  ADD_MASTER_ADMIN: "addMasterAdmin",
  GET_ID_BASED_MASTER_ADMIN: "getMasterAdmin",
  UPDATE_MASTER_ADMIN: "updateMasterAdmin",
  GET_ALL_MASTER_ADMIN_LIST: "showMasterAdmin",
  UPDATE_MASTER_ADMIN_STATUS: "toggleMasterAdminStatus",
  DELETE_MASTER_ADMIN: "deleteMasterAdmin",
  SHOW_MASTER_ADMIN: "showMasterAdmin",

  // Employee Attendence

  // GET_EMPLOYEE_ATTENDENCE: "/employeeDailyAttendance",
  GET_EMPLOYEE_ATTENDENCE: "getHierachyEmployeeAttandanceDetails", // "/getHierachyEmployeeAttandanceDetails",
  CHECK_EMPLOYEE_MONTH_PAYOUT: "checkEmployeeMonthPayoutStat",

  // Regularize

  GET_REQULARIZE: "getRegularizatonRequestList", // "/getRegularizatonRequestList",
  GET_EMPLOYEE_REQULARIZE: "getHierarchyRegularizingRequestList", // "/getHierarchyRegularizingRequestList",
  GET_ID_BASED_REQULARIZE: "getRegularizingEmployeeDetail", // "/getRegularizingEmployeeDetail",
  CREATE_REQULARIZE: "regularizeAttendance",
  UPDATE_REGULARIZING_REQUEST: "UpdateHierarchyRegularizingRequestList",
  ADD_EMPLOYEE_PARDON: "attendancePardonOrFine",
  GET_EMPLOYEE_ATTENDENCE_DEDUCTION: "getEmployeeAttendanceDeductionById",
  GET_REDULARIZE_DETAILS: "getRegularizedAttendanceDetail",

  // My Attendance

  // GET_MY_ATTENDENCE: "/employeeDailyAttendance/myAttendance",
  GET_MY_ATTENDENCE: "getFilteredAttandanceDetails", // "/getFilteredAttandanceDetails",
  GET_ATTENDENCE_DETAILS: "getAttendanceDetails",
  GET_ATTENDANCE_LOG: "getAttendanceLogs",

  // Employee Leave

  GET_EMPLOYEE_LEAVE: "/employeeLeave",
  EMPLOYEE_LEAVES: "showEmployeeLeaveById", // "showsampleEmployeeLeaveById",
  GET_ALL_RESTRICTED_HOLIDAY: "getAllRestrictedHoliday",
  // My Leave

  CREATE_LEAVE_REQUEST:
    "/employeeLeaveApplication/create_EmployeeLeaveApplication",
  GET_EMPLOYEE_LEAVE_SUMMARY: "getEmployeeLeaveSummaryById", // "/employeeLeaveSummary/show_EmployeeLeaveSummary",
  GET_MY_LEAVE: "/employeeLeaveApplication",
  GET_MY_LEAVE_LIST: "showEmployeeLeaveDetails", //showSampleEmployeeLeaveDetails",
  EMPLOYEE_APPROVED: "updateEmployeeLeaveApplicationById", // "updatesampleEmployeeLeaveApplicationById",
  EMPLOYEE_LEAVE_APPROVE_LIST: "EmployeeLeaveApplicationById",
  LEAVE_CONFIGURATION: "updateParameters",
  GET_LEAVE_CONFIGURATION: "getParameters",

  // Work Policy
  GET_EMPLOYEE_WORK_POLICY: "getAllWorkPolicy", // "/workPolicy",
  ADD_EMPLOYEE_WORK_POLICY: "SaveworkPolicy", // "/WorkPolicy/create_workPolicy",
  ADD_EMPLOYEE_WORK_POLICY_DETAILS: "SaveworkPolicy", //"/WorkPolicyDetails/create_workPolicyDetails",
  GET_ID_BASED_EMPLOYEE_WORK_POLICY: "getWorkPolicyById", // "/WorkPolicy/show_workPolicy",
  ADD_ASSIGN_POLICY: "assignWorkPolicy", // "/employeeCompany/create_employeeCompany",
  UPDATE_WORK_POLICY_DEATILS: "/WorkPolicyDetails/update_workPolicyDetails",
  DELETE_EMPLOYEE_WORK_POLICY: "/WorkPolicy/delete_workPolicy",

  UPDATE_WORK_POLICY: "updateworkPolicyDetails",
  UPDATE_WORK_POLICY_APPLICABILITY: "updateWorkPolicyApplicability",

  // Less Working Hours

  // Candidate Onboarding

  CET_CANDIDATE_PERSIONAL: "/employeePersonal",
  ADD_CANDIDATE_PERSIONAL: "/candidatePersonal/create_candidatePersonal",
  ADD_CANDIDATE_WORK_EXPERIENCE:
    "/candidateworkExperience/create_workExperiece",
  ADD_CANDIDATE_BANK_DETAILS:
    "/CandidatebankDetails/create_candidatebankDetails",

  // Holiday

  GET_HOLIDAY: "getAllHoliday", // "/holiday",
  ADD_HOLIDAY_RECORDS: "saveHoliday", // "/holiday/create_Holiday",
  ADD_HOLIDAY_APPLICABLE: "saveHolidayApplicable", // "/holidayApplicable/create_HolidayApplicable",
  GET_ID_BASED_HOLIDAY_RECORDS: "getHolidayById", // "/holiday/show_Holiday",
  UPDATE_HOLIDAY_DETAILS: "updateHoliday", // "/holiday/update_Holiday",
  DELETE_HOLIDAT_BY_ID: "deleteHolidayById",
  UPDATE_HOLIDAY_STATUS: "toggleHolidayStatus",
  GET_EMPLOYEE_HOLIDAYS: "getEmployeeHolidays",

  // Time In out policy
  GET_EMPLOYEE_TIME_IN_OUT_POLICY: "/timeInOutPolicy",

  DELETE_ALL_POLICY: "deleteWorkPolicyById", // "/employee/delete_employee",

  // OverTime Policies

  GET_OVERTIME_POLICY: "/overtimePolicy",
  ADD_OVERTIME_POLICY: "/overtimePolicy/create_OvertimePolicy",

  //Short time

  GET_SHORT_TIME_POLICY: "/shortTimePolicy",
  ADD_LESS_WORKING_HOURS_POLICY: "/shortTimePolicy/create_ShorttimePolicy",

  // Miss Punch Policy

  GET_MISS_PUNCH_POLICY: "/misspunchPolicy",
  ADD_MISS_PUNCH_POLICY: "/MisspunchPolicy/create_MisspunchPolicy",

  // Leave Type

  GET_LEAVE_TYPE: "/leaveType/leavetype_Records",
  GET_EMPLOYEE_LEAVE_TYPES: "/leaveType",
  GET_EMPLOYEE_LEAVE_TYPE_LIST: "getEmployeeLeaveType", // "getLeaveTypesWithCompanyId", // "/leaveType/EmployeeLeaveType",

  // country List

  // GET_COUNTRY_LIST: "/country",

  // City List
  GET_COUNTRY_STATE_CITY_LIST: "getCountryStateCity",
  // GET_CITY_LIST: "getAllcity",
  GET_CITY_BY_ID: "getcityById",
  GET_CITY_LIST: "getCountryStateCity",

  // State List

  GET_STATE_LIST: "/StateProvince",

  // Religion List

  GET_RELIGION_LIST: "/religion",

  // -------------------------------Action Url---------------------------------------

  // Leave Type

  GET_LEAVE_TYPES: "getLeaveTypesWithCompanyId", // "/leaveType",
  CREATE_LEAVE_TYPE: "createLeaveType",
  UPDATE_LEAVE_TYPE: "updateLeaveTypeById",
  GET_LEAVE_TYPES_ID_BASED_RECORDS: "getLeaveTypeById",

  // EmployeeLeave Request

  EMPLOYEE_LEAVE_REQUEST: "createEmployeeLeaveApplication", // "createsampleEmployeeLeaveApplication",
  GET_EMPLOYEE_REQUEST_BY_ID: "getEmployeeLeaveByLeaveId",
  UPDATE_EMPLOYEE_LEAVE_REQUEST: "EditEmployeeLeaveApplication",
  DELETE_EMPLOYEE_LEAVE_REQUEST: "deleteEmployeeLeaveApplication",
  GET_LEAVE_CYCLE: "getLeaveParameters",
  GET_EMPLOYEE_LEAVE_DATA: "getEmployeeleaveData",

  // Employee Assets
  GET_EMPLOYEE_ASSETS_LIST: "getEmployeeAssets",
  GET_EMPLOYEE_REQUEST_HISTORY: "getEmployeeAssetRequests", // "getHierarchyEmployeesAssetRequests", //
  GET_EMPLOYEE_REQUESTED_ASST: "getHierarchyEmployeesAssetRequests",
  ADD_EMPLOYEE_ASSETS: "assignAssetBatchToEmployee", // "/employeeAssets/create_EmployeeAssets",
  REQUEST_EMPLOYEE_ASSETS: "createEmployeeAssetRequest",

  // Company Assets

  GET_COMPANY_EMPLOYEE_ASSETS: "getEmployeeAssetsByCompanyId",

  // Company Document
  GET_COMPANY_DOCUMENT_LIST: "getHierarchyEmployeesDocuments",

  // Employee Document

  ADD_EMPLOYEE_DOCUMENT: "createDocumentsBatchToEmployee",
  ADD_MY_DOCUMENT: "EmployeeDocumentFileUpload",

  // Employee Attendence

  // ADD_EMPLOYEE_STATUS: "employeeAttendanceAction",
  ADD_EMPLOYEE_STATUS: "employeeAttendanceAction",

  GET_EMPLOYEE_ATTENDENCE_ID_BASED: "getEmployeeAttendanceDetailById",
  GET_EMPLOYEE_ATTENDENCE_SUMMARY: "getEmployeeWiseAttendanceSummary",
  GET_SUPERIOR_EMPLOYEE_ATTENDENCE_SUMMARY:
    "getSuperiorEmployeeWiseAttendanceSummary",
  CALCULATE_AMOUNT_WITH_POLICYS: "calculateAmountWithPolicy",
  ADD_EMPLOYEE_PAID_LEAVE: "employeeLeaveFromAttendance",
  UPCOMING_LEAVES_SEVEN_DAYS: "upComingSevenDaysLeave",

  //User Privileges
  GET_ALL_ROLELIST: "getAllRoleByCompany",
  GET_ALL_USERLIST: "getAllUserRoleMapping",
  SAVE_USERPRIVILIGES_ROLE: "saveRole",
  ASSIGN_USER_ROLE: "updateUserRoleMapping",
  TOGGLE_UPDATE: "toggleRoleStatus",
  TOGGLE_USER_UPDATE: "toggleuseleMappingStatus",
  ASSIGN_EMPLOYEE_FOR_ROLES: "saveUserRoll",
  DELETE_ROLE_RECORD: "deleteRoleById",
  GET_DATA: "getAllFunctionbyParent",
  UPDATE_ROLE: "getRoleById",
  UPDATE_USERPRIVILIGES_ROLE: "UpdateRoleById",
  UPDATE_USERPRIVILIGES_EMPLOYEES: "UpdateUserRoleById",

  //Dashboard

  CHECK_IN_OUT: "checkInOut",
  DASHBOARD_EMPLOYEE_LEAVES: "EmployeeLeave",
  DASHBOARD_EMPLOYEE_DOCUMENT: "showEmployeeDocuments",
  DASHBOARD_EMPLOYEE_MISSING_DOCUMENT: "showEmployeeMissingDocuments", //"showEmployeeMisDocuments",
  DASHBOARD_EMPLOYEE_RENEWAL_DOCUMENT: "showEmployeeRenDocuments",
  DASHBOARD_EMPLOYEE_TEAMS: "showTeam",
  DASHBOARD_REPORTIG_EMPLOYEE_TEAM_MEMBERS: "getEmployeeTeamMembers",
  DASHBOARD_EMPLOYEE_HOLIDAY: "showHoliday", //getHolidayById
  DASHBOARD_EMPLOYEE_REQUEST: "request",
  DASHBOARD_EMPLOYEE_MEETINGS: "showMeeting",
  DASHBOARD_EMPLOYEE_TASK: "getAllWorkEntry", //"showTask",
  GET_MANAGER_ATTENDENCE_SUMMARY: "getManagerAttendanceSummary",
  GET_ATTENDANCE_SUMMARY_DETAILS_SHIFT_WISE: "getShiftWiseAttendanceSummary",
  GET_ATTENDANCE_SUMMARY_DETAILS_BY_DEPARTMENT:
    "getDepartmentWiseAttendanceSummary",
  GET_ATTENDANCE_SUMMARY_DETAILS_BY_BRANCH: "getLocationWiseAttendanceSummary",
  GET_UPCOMING_SHIFT_BY_EMPLOYEE: "getUpcomingShiftByEmployeeId",

  // Punch In

  EMPLOYEE_PUNCH_IN: "addEmployeePunch",
  GEI_ID_PUNCHIN_DETAILS: "getCheckIn",
  GET_PUNCH_METHOD: "getPunchMethods",
  GET_PUNCH_DEVICE_BY_ID: "getPunchDeviceById",
  SAVE_PUNCH_DEVICE: "savePunchDevice",
  GET_ALL_PUNCH_DEVICE: "getAllPunchDevices",
  GET_PUNCH_METHOD_EMPLOYEE_LIST: "getPunchMethodEmployees", //Access List
  SAVE_EMPLOYEE_PUNCHIN_METHOD: "saveEmployeePunchMethod",
  GET_EMPLOYEE_PUNCH_METHODS_LIST: "getEmployeePunchMethod", //User List
  SAVE_PUNCHIN_METHOD: "savePunchMethodEmployee",
  APPLY_BREAK: "applyBreak",

  SAVE_EMPLOYEE_SALARY_DETAILS_ACCESS: "createEmployeeSpecialAccess",
  GET_EMPLOYEE_SALARY_DETAILS_ACCESS: "getEmployeeSpecialAccessById",

  // shiftShedular

  EMPLOYEE_SHIFT_SCHEDULAR: "shiftSheduler",
  GET_SHIFT_SCHEDULAR: "getAllEmployeeWithShiftSchemeId", //getShiftSheduler",
  GET_SHIFT_SCHEDULAR_BY_FILTER: "getAllShiftSchemesByCompanyIdWithFilter",

  // Get Work entry
  GET_WORK_ENTRY: "getAllWorkEntry",
  GET_EMPLOYEE_ID_BASED_WORK_ENTRY: "getWorkEntryEmployeeById",

  //Get employee by country code in SocialSecurityContributions
  GET_EMPLOYEE_LIST_BY_COUNTRY_CODE: "getEmployeeByCompanyByCountry",

  // Hierachy

  GET_HIERARCHY: "hierarchyView",
  GET_HIERARCHY_EMPLOYEE_VIEW: "hierarchyEmpView",

  //xlsx action names

  DOWNLOAD_XLSX_ENDPOINT: "employee/employeeimporttemplate",
  IMPORT_XLSX_ENDPOINT: "/employee/employeebulkimport",

  //feeds endpoints

  GET_ALL_FEEDS: "getAllFeeds",
  SAVE_LIKES: "saveLikes",
  DELETE_LIKE_BY_ID: "deleteLikesById",
  SAVE_COMMENTS: "saveComments",
  GET_COMMENTS: "getCommentsById",
  DELETE_FEEDS_BY_ID: "deleteFeedsById",
  DELETE_COMMENTS_BY_ID: "deleteCommentsById",

  // ReportsREACT_APP_API_URL=https://alpha-api.loyaltri.com

  GET_EMPLOYEE_DETAILS_IN_EXCEL: "/employee/exportexcel",
  GET_EMPLOYEE_DETAILS_IN_PDF: "/employee/exportpdf",
  GET_GENDER_DIVERSITY_PDF: "/employee/genderdiversitypdf",
  GET_GENDER_DIVERSITY_EXCEL: "/employee/genderdiversityexcel",
  GET_DIVERTSITY_REPORTS: "DiversityReport",
  GET_NATIONAL_DIVERSITY_PDF: "/employee/nationaldiversitypdf",
  GET_NATIONAL_DIVERSITY_EXCEL: "/employee/nationaldiversityexcel",
  GET_DEPARTMENT_DIVERSITY_PDF: "/employee/departmentdiversitypdf",
  GET_DEPARTMENT_DIVERSITY_EXCEL: "/employee/departmentdiversityexcel",
  GET_DESIGNATION_DIVERSITY_PDF: "/employee/designationdiversitypdf",
  GET_DESIGNATION_DIVERSITY_EXCEL: "/employee/designationdiversityexcel",
  GET_EMPLOYEE_LEAVE_PDF: "/employee/employeeleavereportpdf",
  GET_EMPLOYEE_LEAVE_EXCEL: "/employee/employeeleavereportexcel",
  // GET_EMPLOYEE_ATTENDENCE_REPORT_EXCEL: "/employee/employeeattendancereport",
  GET_EMPLOYEE_ATTENDENCE_REPORT_EXCEL: "AttendanceMusterReport",
  GET_EMPLOYEE_DatewiseEmployeesAttendanceReport:
    "DatewiseEmployeesAttendanceReport",
  GET_EMPLOYEE_EmployeeMonthwiseAttendanceReport:
    "EmployeeMonthwiseAttendanceReport",
  UPDATE_EMPLOYEE_toggleEmployeeStatus: "toggleEmployeeStatus",
  GET_CALENDER_DEATILS: "calender",
  GET_WORK_ENTRY_REPORT: "getEmployeeWorkEntryReport",
  GET_DAILY_ATTENDANCE_REPORT: "DailyAttendanceReport",
  GET_EMPLOYEE_OVERTIME_REPORT: "getEmployeeOvertimeReport",
  GET_EMPLOYEE_LOPMONTHLY_REPORT: "LOPMonthlyReport",

  //OFFBOARDING

  GET_OFFBOARDING_getAllSepMode: "getAllSepMode",
  GET_OFFBOARDING_getAllSepType: "getAllSepType",
  GET_OFFBOARDING_getAllRehireReson: "getAllRehireReson",
  GET_OFFBOARDING_employeeResignationDetails: "employeeResignationDetails",
  GET_OFFBOARDING_employeeFeedback: "employeeFeedback",
  GET_OFFBOARDING_offboardingemployeeLeave:
    "insertOrUpdateOffboardingEmployeeLeaveBatch",
  GET_OFFBOARDING_employeeOffBoardingCounts: "employeeOffBoardingCounts",
  GET_OFFBOARDING_getEmployeeOffBoardingList: "getEmployeeOffBoardingList",
  GET_OFFBOARDING_getEmployeeOffBoarding: "getEmployeeOffBoarding",
  UPDATE_OFFBOARDING_updateEmployeeResignationDetails:
    "updateEmployeeResignationDetails",
  GET_OFFBOARDING_getEmployeeFeedbackWithOffboardingId:
    "getEmployeeFeedbackWithOffboardingId",
  UPDATE_OFFBOARDING_FEEDBACK_updateEmployeeFeedback: "updateEmployeeFeedback",
  GET_OFFBOARDING_ASSET_OFFBOARDINGID:
    "getOffboardingEmployeeAssetWithOffboardingId",

  OFF_BOARDING_DOWNLOAD_XLSX: "/employee/exportexcel",
  // My Request

  GET_WORK_FROM_HOME_REQUEST: "",
  GET_LEAVE_REQUEST: "",
  ADD_NEW_REQUEST: "",

  // Employee Request

  GET_EMPLOYEE_EXCUSES: "",
  GET_EMPLOYEE_OVERTIME: "getHierarchyOverTimeRequestList",
  GET_EMPLOYEE_ATTENDENCE_OVER_TIME_DETAILS:
    "getEmployeeAttendanceOverTimeById",
  GET_EMPLOYEE_PUNCH_APPUROVAL: "getHierarchyPunchRequestList",
  PUNCH_APPROVAL_REJECT: "rejectOrApprovePunch",
  OVER_TIME_APPROVE_REJECT: "rejectOrApproveOverTime",
  SAVE_OFFBOARDING_EMPLOYEEASSETS:
    "insertOrUpdateOffboardingEmployeeAssetBatch",
  UPDATE_EMPLOYEE_STATUS_OFFBAORDING: "updateEmployeeStatus",
  GET_REGULARIZING_APPROVE_REJECT_LIST:
    "getHierarchyCompletedRegularizingRequestList",
  GET_APPROVE_REJECT_DETAILS: "getRegularizedRequestById",
  GET_EXCUSES_COUNT: "excusesStatistics",

  //WORK FROM REQUEST
  GET_WORKFROMHOME_REQUEST: "getAllSpecialRequest",
  Save_SPECIAL_REQUEST: "saveSpecialRequest",
  GET_ALL_SPECIALREQUEST: "getAllSpecialRequestForApproval",
  GET_SPECIAL_REQUESTBY_ID: "getSpecialRequest",
  APPROVE_SPECIAL_REQUEST: "approveSpecialRequest",
  //Letter request
  GET_LETTER_REQUEST: "getLetterRequestForApproval",
  GET_EMPLOYEE_MONTHLY_PAID_LIST: "employeePaidMonthlyList",
  UPDATE_REQUEST_TYPE: "updateSpecialRequest",
  DELETE_REQUEST_TYPE: "deleteSpecialRequest",

  //social links
  SAVE_EMPLOYEE_SOCIALLINK: "saveEmployeeSocialLink",

  //APPROVELS

  GET_APPROVELS_TYPE: "getAllApprovalTypes",
  GET_APPROVES_TEMPLATE: "getAllApprovalTemplates",
  CREATE_UPDATE_APPROVEL_TEMPLATE: "createUpdateApprovalTemplates",
  CREATE_UPDATE_APPROVEL_MAPPING: "createUpdateApprovalEmployeeTemplateMapping",
  GET_APPROVED_EMPLOYEE: "getAllApprovalEmployeeTemplateMapping",
  GET_APPROVED_TEMPLATEBYID: "getApprovalTemplateById",
  GET_ALL_APPROVAL_DETAILS: "getAllApprovalDetails",
  UPDATE_STATUS_TEMPLATE: "toggleApprovalTemplate",
  DELETE_APPROVAL_TEMPLATE: "deleteApprovalTemplate",
  UPDATE_EMPLOYEE_OFF_BOARDING: "updateEmployeeeOffBoarding",
};

export default API;

const token = JSON.parse(localStorage.getItem("LoginData"));

// if (token?.userData?.token) {
//   const timeoutDuration = 10 * 60 * 1000;

//   setTimeout(() => {
//     token.userData.token += "A";
//     localStorage.setItem("LoginData", JSON.stringify(token));
//     console.log("Token has been updated in localStorage after 10 minutes.");
//   }, timeoutDuration);
// }

// const urlMain = "http://192.168.29.111/loyaltri-server/api/main";
// const urlMain = "http://192.168.0.32/loyaltri-server/api/main";
// const urlMain = "http://192.168.0.2/loyaltri-server/api/main";

// const urlMain = "https://demo-api.loyaltri.com/api/main";
const urlMain = `${config.apiUrl}/api/main`;
// const urlMain = `http://192.168.0.40:8090/api/main`;
// const urlMain = `http://192.168.0.40:8090/api/main`;
// const urlMain = "https://web-api.loyaltri.com/api/main";

const action = async (actionUrl, params = {}, url = urlMain, headers) => {
  // let returnValue;
  try {
    const result = await axios.post(
      // "http://192.168.0.61:82/loyaltri-server/api/main",
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
  // return returnValue;
};

export { action };

const newaction = async (
  actionUrl,
  params = {},
  url = config.apiUrl,
  headers
) => {
  try {
    const result = await axios.post(url + actionUrl, params, {
      headers: {
        Authorization: `Bearer ${token?.userData.token}`,
      },
    });

    return result;
  } catch (error) {
    return error;
  }
};

export { newaction };

// file handler code is here.
// const urlFileHandler = "https://demo-api.loyaltri.com/api/fileHandler";
const urlFileHandler = `${config.apiUrl}/api/fileHandler`;
// const urlFileHandler = `http://192.168.1.28:8090/api/fileHandler`;

// const urlFileHandler = "https://web-api.loyaltri.com/api/fileHandler";

const fileAction = async (formData, urlFileHandlerMain = urlFileHandler) => {
  try {
    const result = await axios.post(
      urlFileHandlerMain,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token?.userData.token}`,
        },
      }
      //    {
      //   "Content-Type": "multipart/form-data",
      // }
    );

    return result.data;
  } catch (error) {
    return error;
  }
};
export { fileAction };

const deleteFile = async (fileId, urlFileHandlerMain = urlFileHandler) => {
  try {
    const result = await axios.post(`${urlFileHandlerMain}/${fileId}`);
    return result.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error; // Optionally handle or rethrow the error
  }
};

export { deleteFile };

//file download  code here
const fileActionDownload = async (
  urlFileHandlerMain = API.HOST,
  endpoint,
  id
) => {
  try {
    const result = await axios.get(
      urlFileHandlerMain + "/" + endpoint + "/" + id,
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
export { fileActionDownload };

const fileActionDownload1 = async (actionUrl, params = {}, url = urlMain) => {
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
export { fileActionDownload1 };

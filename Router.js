import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Appearance from "./components/General/Appearance";
import Organisation from "./components/Organisation/Organisation";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login/Login";
import { rtl } from "./Redux/slice";
import Notification from "./components/General/Notification";
import { useTranslation } from "react-i18next";
import OrganisationSetup from "./components/Organisation/OrganisationSetup";
import EmployeeList from "./components/Employee/EmployeeList";
import EmployeeWorkEntries from "./components/Employee/EmployeeWorkEntries";

import EmployeeProfile from "./components/Employee/EmployeeProfile/EmployeeProfile";
import AddShiftScheme from "./components/Organisation/Payroll/Shift/AddShiftScheme";
import Shift from "./components/Organisation/Payroll/Shift/Shift";
import Sidebar from "./components/Menus/Sidebar";
import OvertimeRules from "./components/Policies/OvertimeRules";
import AddEmployee from "./components/Employee/AddEmployee";
import CompanyCard from "./components/Organisation/Company/CompanyCard";
import Master from "./components/Organisation/Master";
import Recruitment from "./components/Organisation/Recruitment/Recruitment";
import TasksOverview from "./components/Employee/TasksOverview";
import MasterCard from "./components/Organisation/Master/MasterCard";
import PayrollCard from "./components/Organisation/Payroll/PayrollCard";
import Leave from "./components/TIME AND ATTENDENCE/Leave";
import Holidays from "./components/TIME AND ATTENDENCE/Holidays";
import Onboarding from "./components/Employee/Onboarding";
import Policies from "./components/Policies/Policies";

import Leacecomponent from "./components/common/Leace-component";
import MyLeaves from "./components/Time/MyLeave/MyLeaves";
import EmployeeLeave from "./components/Time/EmployeeLeave/EmployeeLeave";
import EmployeeAttendance from "./components/Time/EmployeeAttendance/EmployeeAttendance";
import ShiftSchedular from "./components/Time/ShiftSchedular";
import Excuses from "./components/Time/ExcusesManagement/Excuses";
import EmployeeExcuses from "./components/Time/ExcusesManagement/EmployeeExcuses";
import BankAccountSettings from "./components/Organisation/Payroll/SettingsPayroll/BankAccount/BankAccountSettings";
import SalaryComponents from "./components/Organisation/Payroll/SettingsPayroll/SalaryComponent/SalaryComponents";
import SocialSecurityContributions from "./components/Organisation/Payroll/SettingsPayroll/SocialSecurity/SocialSecurityContributions";
import SalaryTemplateBuilder from "./components/Organisation/Payroll/SettingsPayroll/SalaryTemplateBuilder/SalaryTemplateBuilder";
import PayrollConfiguration from "./components/Organisation/Payroll/SettingsPayroll/PayrollConfiguration";
import Approvals from "./components/Organisation/Payroll/SettingsPayroll/Approvals";
import LoanSettings from "./components/Organisation/Payroll/SettingsPayroll/LoanSettings/LoanSettings";
import FinalSettlements from "./components/Organisation/Payroll/SettingsPayroll/FinalSettlements/FinalSettlements";
import Discover from "./components/Discover/Discover";
import MyAssets from "./components/Company/AssetsManagement/MyAssets";
import MyDocument from "./components/Company/DocumentManagemant/MyDocument";
import CompanyAssets from "./components/Company/AssetsManagement/CompanyAssets";
import EmployeeDocument from "./components/Company/DocumentManagemant/EmployeeDocument";
import Organization_Structure from "./components/Employee/Organization_Structure";
import Reports from "./components/Reports/Reports";
import CreateSalaryTemplate from "./components/Organisation/Payroll/SettingsPayroll/SalaryTemplateBuilder/CreateSalaryTemplate";
import InProgress from "./components/common/InProgres";
import AttendanceSettings from "./components/General/AttendanceSettings";
import PayrollOverview from "./components/Payroll/Dashboard/PayrollOverview";
import MySalary from "./components/Payroll/MySalary";
import PayrollTable from "./components/Payroll/PayrollTable";
import Adjustments from "./components/Payroll/Adjustments/Adjustments";
import EmployeeExpenses from "./components/Payroll/EmployeeExpenses";
import MyLoan from "./components/Payroll/MyLoan";
import EmployeeLoan from "./components/Payroll/EmployeeLoan";
import Calender from "./components/Time/Calender/Calender_old";
import MyWorkExpenses from "./components/Payroll/MyWorkExpenses/MyWorkExpenses";
import RequestedAssets from "./components/Company/AssetsManagement/RequestedAssets";
import MyAttendanceProfile from "./components/Time/MyAttendance/MyAttendanceProfile";
import UserPrivileges from "./components/General/userPrivileges/UserPrivileges";
import API, { action } from "./components/Api";
import { useTheme } from "./Context/Theme/ThemeContext";
import MyRequest from "./components/Company/Request/MyRequest";
import EmployeeRequest from "./components/Company/Request/EmployeeRequest";
import Offboarding from "./components/Employee/Offboarding";
import AssetRecovering from "./components/Employee/AssetRecovering";
import LoanFinalSettlement from "./components/Payroll/LoanFinalSettlement";
import SetNewPassword from "./Login/SetNewPassword";
import SalaryComponentsIND from "./components/Organisation/Payroll/SettingsPayroll/SalaryComponent/SalarycomponentIND";
import StatutoryConfiguration from "./components/Organisation/Payroll/SettingsPayroll/StatutoryConfig/StatutoryConfiguration";
import ApprovalTypes from "./components/Organisation/ApprovalTypes/ApprovalTypes";
import CommandMenu from "./components/common/CommandMenu";
import { fetchCompanyDetails } from "./components/common/Functions/commonFunction";
import PageNotFound from "./components/common/PageNotFound";
import TransferEmployee from "./components/Employee/EmployeeProfile/TransferEmployee";
import localStorageData from "./components/common/Functions/localStorageKeyValues";
import SubscriptionOverview from "./components/Header/subscriptions/SubscriptionOverview/SubscriptionOverview";

const LocationHandler = ({ children }) => {
  const location = useLocation();
  return children(location);
};
export default function Router() {
  const { t, i18n } = useTranslation();
  const layout = useSelector((state) => state.layout.value);
  const mode = useSelector((state) => state.layout.mode);
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState(
    JSON.parse(localStorage.getItem("LoginData"))
  );
  const { toggleTheme } = useTheme();
  const { changeColor } = useTheme();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  // const location = useLocation();
  // const pathname = location.pathname;

  // const [endload, setEndLoad] = useState();
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const layout = localStorage.getItem("layout");
    if (layout !== null) {
      dispatch(rtl(layout));
    }
    changeLanguage(layout === "rtl" ? "ar" : "en");
    // setTimeout(loderFun, 2000);
    setLoginData(JSON.parse(localStorage.getItem("LoginData")));
    if (employeeId) getAPPearance();
  }, []);
  // const loderFun = () => {
  //   setEndLoad(true);
  // };

  useEffect(() => {
    console.log(localStorageData, "localStorageData");
  }, []);

  const getAPPearance = async () => {
    try {
      const result = await action(API.GET_APPEARANCE_THEME, {
        employeeId: employeeId,
      });
      if (result.status === 200) {
        // localStorage.setItem("Appearance", JSON.stringify(result.result));

        toggleTheme(
          result.result?.appearanceDatas.interfaceTheme !== "" ||
            result.result?.appearanceDatas.interfaceTheme !== null
            ? result.result?.appearanceDatas.interfaceTheme
            : "light"
        );
        if (result.result?.appearanceDatas.interfaceTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        changeColor(
          result.result?.appearanceDatas.themeColor !== "" &&
            result.result?.appearanceDatas.themeColor !== null
            ? result.result?.appearanceDatas.themeColor
            : "#6A4BFC"
        );
        // localStorage.setItemI(
        //   "theme",
        //   result.result?.appearanceDatas.interfaceTheme !== "" &&
        //     result.result?.appearanceDatas.interfaceTheme !== null
        //     ? result.result?.appearanceDatas.interfaceTheme
        //     : "light"
        // );
        // localStorage.setItemI(
        //   "mainColor",
        //   result.result?.appearanceDatas.themeColor !== "" ||
        //     result.result?.appearanceDatas.themeColor !== null
        //     ? result.result?.appearanceDatas.themeColor
        //     : "#6A4BFC"
        // );

        localStorage.setItem(
          "layout",
          result.result?.appearanceDatas?.language?.selectLanguage === "ar"
            ? "rtl"
            : "ltr"
        );
        changeLanguage(
          result.result?.appearanceDatas?.language?.selectLanguage
        );
        dispatch(
          rtl(
            result.result?.appearanceDatas?.language?.selectLanguage === "ar"
              ? "rtl"
              : "ltr"
          )
        );
      }
    } catch (error) {}
  };

  const getCompanyById = async (id) => {
    try {
      const result = await fetchCompanyDetails(id);

      setCompanyDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    getCompanyById(companyId);
  }, [companyId]);

  const routes = [
    {
      path: "/",
      element: <Discover />,
      menuId: 1,
    },
    {
      path: "/companyProfile",
      element: <Organisation companyProfile={true} />,
      menuId: 27,
    },
    {
      path: "/employees",
      element: <EmployeeList />,
      menuId: 28,
    },
    {
      path: "/myProfile/:employeeId",
      element: <EmployeeProfile path="myProfile" />,
      menuId: 26,
    },
    {
      path: "/EmployeeWorkEntries",
      element: <EmployeeWorkEntries />,
      menuId: 3,
    },
    {
      path: "/Organization-Structure",
      element: <Organization_Structure />,
      menuId: 29,
    },
    // {
    //   path: "/taskOverview",
    //   element: <TasksOverview />,
    //   menuId: 3
    // },
    // {
    //   path: "/onboarding",
    //   element: <Onboarding />,
    //   menuId: 3
    // },
    {
      path: "/Offboarding",
      element: <Offboarding />,
      menuId: 3,
    },
    {
      path: "/transferEmployee",
      element: <TransferEmployee />,
      menuId: 82,
    },
    {
      path: "/assetRecovering",
      element: <AssetRecovering />,
      menuId: 3,
    },
    {
      path: "/employeeDocuments",
      element: <EmployeeDocument />,
      menuId: 33,
    },
    {
      path: "/companyAssets",
      element: <CompanyAssets />,
      menuId: 31,
    },
    {
      path: "/leavec",
      element: <Leacecomponent />,
      menuId: 3,
    },
    {
      path: "/myleaves",
      element: <MyLeaves path={"myleaves"} />,
      menuId: 34,
    },
    {
      path: "/employeeleave",
      element: <EmployeeLeave />,
      menuId: 35,
    },
    {
      path: "/myattendance",
      element: <MyAttendanceProfile />,
      menuId: 37,
    },
    {
      path: "/employee_attendance",
      element: <EmployeeAttendance />,
      menuId: 38,
    },
    {
      path: "/shiftschedular",
      element: <ShiftSchedular />,
      menuId: 39,
    },
    {
      path: "/excuses",
      element: <Excuses />,
      menuId: 40,
    },
    {
      path: "/employee_excuses",
      element: <EmployeeExcuses />,
      menuId: 41,
    },
    {
      path: "/appearance",
      element: <Appearance />,
      menuId: 8,
    },
    {
      path: "/subscriptions",
      element: <SubscriptionOverview />,
      menuId: 8,
    },
    {
      path: "/notification",
      element: <Notification />,
      menuId: 9,
    },
    {
      path: "/userPrivileges",
      element: <UserPrivileges />,
      menuId: 10,
    },
    {
      path: "/attendanceSettings",
      element: <AttendanceSettings />,
      menuId: 3,
    },
    {
      path: "/calendar",
      element: <Calender />,
      menuId: 36,
    },
    {
      path: "/Leave",
      element: <Leave />,
      menuId: 11,
    },
    {
      path: "/Shift",
      element: <Shift />,
      menuId: 12,
    },
    {
      path: "/policies",
      element: <Policies />,
      menuId: 13,
    },
    {
      path: "/holidays",
      element: <Holidays />,
      menuId: 3,
    },
    {
      path: "/organisation",
      element: <Organisation />,
      menuId: 14,
    },
    {
      path: "/organisationSetup",
      element: <OrganisationSetup />,
      menuId: 16,
    },
    {
      path: "/master",
      element: <Master />,
      menuId: 17,
    },
    {
      path: "/approvalTypes",
      element: <ApprovalTypes />,
      menuId: 69,
    },
    {
      path: "/recruitment",
      element: <Recruitment />,
      menuId: 4,
    },
    {
      path: "/bankAccountSettings",
      element: <BankAccountSettings />,
      menuId: 18,
    },
    {
      path: "/salaryTemplateBuilder",
      element: <SalaryTemplateBuilder />,
      menuId: 21,
    },
    {
      path: "/createsalaryTemplateBuilder",
      element: <CreateSalaryTemplate />,
      menuId: 21,
    },
    {
      path: "/payrollConfiguration",
      element: <PayrollConfiguration />,
      menuId: 22,
    },
    {
      path: "/approvals",
      element: <Approvals />,
      menuId: 25,
    },
    {
      path: "/finalSettlements",
      element: <FinalSettlements />,
      menuId: 23,
    },
    {
      path: "/loanSettings",
      element: <LoanSettings />,
      menuId: 24,
    },

    {
      path: "/employeeProfile/:employeeId",
      element: <EmployeeProfile />,
      menuId: 26,
    },
    // {
    //   path: "/shiftScheme",
    //   element: <AddShiftScheme />,
    //   menuId: 3
    // },
    // {
    //   path: "/overtimeRules",
    //   element: <OvertimeRules />,
    //   menuId: 3
    // },
    // {
    //   path: "/addEmployee",
    //   element: <AddEmployee />,
    //   menuId: 3
    // },
    // {
    //   path: "/companyCard",
    //   element: <CompanyCard />,
    //   menuId: 3
    // },
    // {
    //   path: "/masterCard",
    //   element: <MasterCard />,
    //   menuId: 3
    // },
    // {
    //   path: "/payrollCard",
    //   element: <PayrollCard />,
    //   menuId: 3
    // },
    // {
    //   path: "/taskOverview",
    //   element: <TasksOverview />,
    //   menuId: 3
    // },
    {
      path: "/myAssets",
      element: <MyAssets />,
      menuId: 45,
    },
    {
      path: "/myDocument",
      element: <MyDocument />,
      menuId: 32,
    },
    {
      path: "/reports",
      element: <Reports />,
      menuId: 6,
    },
    {
      path: "/requestedAssets",
      element: <RequestedAssets />,
      menuId: 47,
    },
    {
      path: "/myRequest",
      element: <MyRequest />,
      menuId: 3,
    },
    {
      path: "/employeeRequest",
      element: <EmployeeRequest />,
      menuId: 3,
    },
    {
      path: "/payrollOverview",
      element: <PayrollOverview />,
      menuId: 3,
    },
    {
      path: "/mySalary",
      element: <MySalary />,
      menuId: 3,
    },
    {
      path: "/payrollTable",
      element: <PayrollTable />,
      menuId: 3,
    },
    {
      path: "/adjustments",
      element: <Adjustments />,
      menuId: 3,
    },
    {
      path: "/myExpenses",
      element: <MyWorkExpenses />,
      menuId: 3,
    },
    {
      path: "/employeeExpenses",
      element: <EmployeeExpenses />,
      menuId: 3,
    },
    {
      path: "/myLoan",
      element: <MyLoan />,
      menuId: 3,
    },
    {
      path: "/employeeLoan",
      element: <EmployeeLoan />,
      menuId: 3,
    },
    {
      path: "/finalsettlement",
      element: <LoanFinalSettlement />,
      menuId: 46,
    },
    {
      path: "/inprogress",
      element: <InProgress />,
      menuId: 3,
    },
    {
      path: "*",
      element: <PageNotFound />,
      menuId: 3,
    },
    // {
    //   path: "/home",
    //   element: <Navigate to="/" />,
    //   menuId: 3,
    // },
  ];

  const additionalRoutes = companyDetails
    ? parseInt(companyDetails.isPFESIenabled) === 0
      ? [
          {
            path: "/socialSecurityContributions",
            element: <SocialSecurityContributions />,
            menuId: 20,
          },
          {
            path: "/salaryComponents",
            element: <SalaryComponents />,
            menuId: 19,
          },
        ]
      : [
          {
            path: "/salaryComponentsIND",
            element: <SalaryComponentsIND />,
            menuId: 67,
          },
          {
            path: "/statutoryConfiguration",
            element: <StatutoryConfiguration />,
            menuId: 68,
          },
        ]
    : [];

  return (
    <BrowserRouter basename="">
      <LocationHandler>
        {(location) => (
          <>
            {loginData ? (
              <div
                className={`main_content flex bg-white dark:bg-[#1B1B1B] h-full min-h-screen font-Inter zoomScreen ${mode}`}
                dir={layout}
              >
                {/* <div className="bg-[#6A4BFC] hidden"></div>
          <div className="bg-[#EE2E5E] hidden"></div> */}
                {/* <NavigationMenu /> */}
                {/* <div className="relative w-full dark:bg-black pink:bg-pink-600"> */}

                <Sidebar id={companyId} />
                <div className="absolute top-0 h-full overflow-auto transition-all duration-300 home dark:bg-[#1B1B1B] pink:bg-pink-600">
                  <div className="sticky top-0 z-[999]">
                    <Header
                      companyData={(e) => {
                        setCompanyId(e);
                        console.log(e, "companyDetailscompanyDetails");
                      }}
                    />
                  </div>
                  <div className="relative px-4 py-8 md:p-4 2xl:p-[25px] content">
                    <Routes>
                      {routes.map(
                        (each, i) =>
                          loginData?.userData?.permissions?.some(
                            (item) => parseInt(item) === parseInt(each.menuId)
                          ) && (
                            <>
                              <Route
                                key={i}
                                path={each.path}
                                element={
                                  each.element ? (
                                    each.element
                                  ) : (
                                    <Navigate to="/" />
                                  )
                                }
                              />
                            </>
                          )
                      )}
                      {additionalRoutes.map(
                        (each, i) =>
                          loginData?.userData?.permissions?.some(
                            (item) => parseInt(item) === parseInt(each.menuId)
                          ) && (
                            <Route
                              key={i}
                              path={each.path}
                              element={each.element}
                            />
                          )
                      )}
                    </Routes>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 p-2 opacity-40">
                  <h1 className="text-xs 2xl:text-md">{`Development Mode ${"10.2.25"}`}</h1>
                </div>
              </div>
            ) : loginData === null ? (
              <>
                {location.pathname !== "/setnewpassword" &&
                  !location.pathname.startsWith("/setnewpassword/") && (
                    <Login />
                  )}
                <Routes>
                  <Route
                    path="/setnewpassword/:id"
                    element={<SetNewPassword />}
                  />
                </Routes>
              </>
            ) : (
              ""
              // <Loader />
            )}
          </>
        )}
      </LocationHandler>
    </BrowserRouter>
  );
}

import { LiaMoneyCheckSolid } from "react-icons/lia";
// ICONS

import { IoMdCompass } from "react-icons/io";
import { RiBuildingFill } from "react-icons/ri";
import { HiCurrencyDollar, HiDocumentText, HiMiniClock } from "react-icons/hi2";
import { HiUsers } from "react-icons/hi2";
import { RiSettings4Fill } from "react-icons/ri";
import { IoHelpCircle } from "react-icons/io5";
import {
  PiBuildings,
  PiUser,
  PiUsersThree,
  PiSignOut,
  PiTreeStructure,
  PiCube,
  PiLaptop,
  PiFileText,
  PiFiles,
  PiCalendarX,
  PiUserMinus,
  PiCalendar,
  PiCheckSquare,
  PiListChecks,
  PiClockCountdown,
  PiPalette,
  PiBell,
  PiCheckSquareOffset,
  PiWatch,
  PiImage,
  PiUserCircle,
  PiNotepad,
  PiStack,
  PiWallet,
  PiStackOverflowLogo,
  PiHandCoins,
  PiCreditCard,
  PiReceipt,
  PiFilePlus,
  PiCalculator,
  PiMoney,
  PiPiggyBank,
  PiBank,
  PiKey,
  PiCardholder,
  PiVault,
  PiArrowsLeftRightLight,
} from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { fetchCompanyDetails } from "../common/Functions/commonFunction";
import localStorageData from "../common/Functions/localStorageKeyValues";

const encryptActionID = (actionID) => {
  return btoa(actionID?.toString());
};
const Navdata = () => {
  const { t } = useTranslation(); // Use translation function here
  const [loginData, setLoginData] = useState(localStorageData.LoginData);
  const encryptedActionID = encryptActionID(localStorageData.employeeId);

  const [companyDetails, setCompanyDetails] = useState(null);

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
  return [
    {
      topmenu: [
        {
          id: 1,
          title: t("Discover"),
          link: "/",
          icon: <IoMdCompass />,
          menuId: 1,
          directLink: true,
        },
        {
          id: 2,
          title: t("Company"),
          menuId: 2,

          icon: <RiBuildingFill />,
          submenus: [
            {
              catid: 2,
              id: 1,
              parentMenu: t("Company"),
              parentId: 2,
              title: t("Company_Management"),
              status: false,
              menuId: [26, 27, 28, 29, 44, 31, 82],
              subMenu: [
                {
                  id: 408,
                  title: t("My_Profile"),
                  icon: <PiUser className="" size={28} />,
                  link: `/myProfile/${encryptedActionID}`,
                  menuId: 26,
                },
                {
                  id: 409,
                  title: t("Company_Profile"),
                  icon: <PiBuildings className="" size={28} />,
                  link: "/companyProfile",
                  menuId: 27,
                },
                {
                  id: 410,
                  title: t("All_Employees"),
                  icon: <PiUsersThree className="" size={28} />,
                  link: "/employees",
                  menuId: 28,
                },
                {
                  id: 520,
                  title: t("Transfer Employee"),
                  icon: <PiArrowsLeftRightLight className="" size={28} />,
                  link: "/transferEmployee",
                  menuId: 82,
                },
                // {
                //   id: 411,
                //   title: t("Onboarding"),
                //   icon: <PiSignIn className="" size={28} />,
                //   link: "/Onboarding",
                //   menuId: 29,
                // },
                {
                  id: 411,
                  title: t("Offboarding"),
                  icon: <PiSignOut className="" size={28} />,
                  link: (() => {
                    const permissions = loginData.userData.permissions;
                    if (permissions.includes(44)) {
                      return "/Offboarding";
                    } else if (
                      !permissions.includes(44) &&
                      permissions.includes(45)
                    ) {
                      return "/assetRecovering";
                    }
                    return "/Offboarding";
                  })(),
                  menuId: 44,
                },
                // {
                //   id: 413,
                //   title: t("Organization_Structure"),
                //   icon: (
                //     <PiTreeStructure className="" size={28} />
                //   ),
                //   link: "/Organization-Structure",
                //   menuId: 31,
                // },
              ],
            },
            // {
            //   catid: 2,
            //   id: 2,
            //   parentMenu: "Company",
            //   parentId: 2,
            //   title: t("Employee_Profile"),
            //   icon: <LuUsers className="" size={28} />,
            //   status: false,
            //   link: "/employeeProfile",
            // },
            {
              catid: 2,
              id: 3,
              parentMenu: t("Company"),
              parentId: 2,
              title: t("Asset_Management"),
              status: false,
              menuId: [45, 47, 31],
              subMenu: [
                {
                  id: 414,
                  title: t("My_Assets"),
                  icon: <PiCube className="" size={28} />,
                  link: "/myAssets",
                  menuId: 30,
                },
                {
                  id: 418,
                  title: t("Requested_Assets"),
                  icon: <PiFilePlus className="" size={28} />,
                  link: "/requestedAssets",
                  menuId: 47,
                },
                {
                  id: 415,
                  title: t("Company_Assets"),
                  icon: <PiLaptop className="" size={28} />,
                  link: "/companyAssets",
                  menuId: 31,
                },
              ],
            },
            {
              catid: 2,
              id: 4,
              parentMenu: t("Company"),
              parentId: 2,
              title: t("Document_Management"),
              status: false,
              menuId: [32, 33],

              subMenu: [
                {
                  id: 416,
                  title: t("My_Documents"),
                  icon: <PiFileText className="" size={28} />,
                  link: "/myDocument",
                  menuId: 32,
                },
                {
                  id: 417,
                  title: t("Employee_Documents"),
                  icon: <PiFiles className="" size={28} />,
                  link: "/employeeDocuments",

                  menuId: 33,
                },
              ],
            },
          ],
        },
        {
          id: 3,
          title: t("Time"),
          menuId: 3,
          icon: <HiMiniClock />,
          submenus: [
            {
              catid: 3,
              id: 1,
              parentMenu: t("Time"),
              parentId: 3,
              title: t("Leaves"),
              status: false,
              menuId: [34, 35],
              subMenu: [
                {
                  id: 511,
                  title: t("My_Leaves"),
                  icon: <PiCalendarX className="" size={28} />,
                  link: "/myleaves",
                  menuId: 34,
                },
                {
                  id: 512,
                  title: t("Employee_Leave"),
                  icon: <PiUserMinus className="" size={28} />,
                  link: "/employeeleave",
                  menuId: 35,
                },
                // {
                //   id: 513,
                //   title: t("Calendar"),
                //   icon: <RiOrganizationChart className="" size={28} />,
                //   link: "/calender",
                // },
              ],
            },
            {
              catid: 3,
              id: 2,
              parentMenu: t("Time"),
              parentId: 3,
              title: t("Attendence"),
              status: false,
              menuId: [36, 37, 38],
              subMenu: [
                {
                  id: 513,
                  title: t("Calendar"),
                  icon: <PiCalendar className="" size={28} />,
                  link: "/calendar",
                  menuId: 36,
                },
                {
                  id: 514,
                  title: t("My_Attendance"),
                  icon: <PiCheckSquare className="" size={28} />,
                  link: "/myattendance",
                  menuId: 37,
                },
                {
                  id: 515,
                  title: t("Employee_Attendance"),
                  icon: <PiListChecks className="" size={28} />,
                  link: "/employee_attendance",
                  menuId: 38,
                },
              ],
            },
            {
              catid: 3,
              id: 3,
              parentMenu: t("Time"),
              parentId: 3,
              title: t("Shift"),
              status: false,
              menuId: [39],

              subMenu: [
                {
                  id: 516,
                  title: t("Shift_Schedular"),
                  icon: <PiClockCountdown className="" size={28} />,
                  link: "shiftschedular",
                  menuId: 39,
                },
              ],
            },
            // {
            //   catid: 3,
            //   id: 4,
            //   parentMenu: t("Time"),
            //   parentId: 3,
            //   title: t("Excuse_Management"),
            //   icon: <LuUsers className="!text-lg 2xl:!text-xl" />,
            //   status: false,
            //   menuId: [40, 41],

            //   subMenu: [
            //     {
            //       id: 517,
            //       title: t("Excuses"),
            //       icon: <PiChatDots className="" size={28} />,
            //       link: "/excuses",
            //       menuId: 40,
            //     },
            //     {
            //       id: 518,
            //       title: t("Employee_Excuses"),
            //       icon: (
            //         <PiChatCenteredText className="" size={28} />
            //       ),
            //       link: "/employee_excuses",
            //       menuId: 41,
            //     },
            //   ],
            // },
            {
              catid: 3,
              id: 5,
              parentMenu: t("Time"),
              parentId: 3,
              title: t("Request"),
              status: false,
              menuId: [34, 35],

              subMenu: [
                {
                  id: 419,
                  title: t("My Request"),
                  icon: <PiFileText className="" size={28} />,
                  link: "/myRequest",
                  menuId: 34,
                },
                {
                  id: 420,
                  title: t("Employee Request"),
                  icon: <PiFiles className="" size={28} />,
                  link: "/employeeRequest",

                  menuId: 35,
                },
              ],
            },
          ],
        },
        {
          id: 4,
          title: t("Recruitment"),
          menuId: 4,
          link: "https://alpha-jobs.loyaltri.com",
          tragetBlank: true,
          icon: <HiUsers />,
          directLink: true,
        },
        {
          id: 5,
          title: t("Payroll"),
          menuId: 5,

          icon: <HiCurrencyDollar />,
          submenus: [
            {
              catid: 5,
              id: 1,
              parentMenu: t("Payroll"),
              parentId: 5,
              title: t("Payroll"),
              status: false,
              menuId: [5, 46],
              subMenu: [
                {
                  id: 520,
                  title: t("Payroll Overview"),
                  icon: <PiCalendarX className="" size={28} />,
                  link: "/payrollOverview",
                  menuId: 70,
                },
                {
                  id: 521,
                  title: t("My_Salary"),
                  icon: <PiWallet className="" size={28} />,
                  link: "/mySalary",
                  menuId: 71,
                },
                {
                  id: 522,
                  title: t("Payroll_Table"),
                  icon: <PiStackOverflowLogo className="" size={28} />,
                  link: "/payrollTable",
                  menuId: 72,
                },
                {
                  id: 523,
                  title: t("Adjustments"),
                  icon: <PiHandCoins className="" size={28} />,
                  link: "/adjustments",
                  menuId: 73,
                },
                {
                  id: 524,
                  title: t("My_Work_Expenses"),
                  icon: <PiCreditCard className="" size={28} />,
                  link: "/myExpenses",
                  menuId: 74,
                },
                {
                  id: 525,
                  title: t("Employee_Work_Expenses"),
                  icon: <PiReceipt className="" size={28} />,
                  link: "/employeeExpenses",
                  menuId: 75,
                },
                // {
                //   id: 526,
                //   title: t("My Loan"),
                //   icon: <PiPiggyBank className="" size={28} />,
                //   link: "/myLoan",
                //   menuId: 5,
                // },

                {
                  id: 526,
                  title: t("My Loan"),
                  icon: <PiPiggyBank className="" size={28} />,
                  link: "/myLoan",
                  menuId: 76,
                },
                {
                  id: 527,
                  title: t("Employee_Loan"),
                  icon: <PiUsersThree className="" size={28} />,
                  link: "/employeeLoan",
                  menuId: 77,
                },
                {
                  id: 528,
                  title: t("Final Settlement"),
                  icon: <LiaMoneyCheckSolid className="" size={28} />,
                  link: "/finalsettlement",
                  menuId: 78,
                },
              ],
            },
          ],
        },
        // {
        //   id: 6,
        //   title: "",
        //   icon: (
        //     <HiDocumentText
        //       size={"100%"}
        //       className={`text-white transition-all duration-300 group-hover:text-primary ${selectedMenu === "Reports" ? "text-primary" : ""
        //         }`}
        //     />
        //   ),
        // },
        // {
        //   id: 7,
        //   title: "",
        //   icon: (
        //     <RiSettings4Fill
        //       size={"100%"}
        //       className={`text-white transition-all duration-300 group-hover:text-primary ${selectedMenu === "Settings" ? "text-primary" : ""
        //         }`}
        //     />
        //   ),
        // },

        {
          id: 6,
          title: t("Reports"),
          menuId: 6,

          icon: <HiDocumentText />,
          link: "/reports",
          directLink: true,
        },
        // {
        //   id: 7,
        //   title: "",
        //   icon: <RiSettings4Fill />,
        // },

        {
          id: 8,
          title: t("Settings"),
          menuId: 7,

          icon: <RiSettings4Fill />,
          submenus: [
            {
              catid: 1,
              id: 1,
              parentMenu: t("Settings"),
              parentId: 9,
              title: t("General"),
              status: false,
              menuId: [8, 9, 10],

              subMenu: [
                {
                  id: 112,
                  title: t("Appearance"),
                  icon: <PiPalette className="" size={28} />,
                  link: "/appearance",
                  menuId: 8,
                },
                {
                  id: 113,
                  title: t("Notification"),
                  icon: <PiBell className="" size={28} />,
                  link: "/notification",
                  menuId: 9,
                },
                {
                  id: 114,
                  title: t("User_Privileges"),
                  icon: <PiCheckSquareOffset className="" size={28} />,
                  link: "/userPrivileges",
                  menuId: 10,
                },
              ],
            },
            {
              catid: 1,
              id: 2,
              parentMenu: t("Settings"),
              parentId: 9,
              title: t("TIME_AND_ATTENDENCE"),
              status: false,
              menuId: [11, 12, 13, 14],

              subMenu: [
                // {
                //   id: 215,
                //   title: t("Calender"),
                //   icon: <PiCalendar className="" size={28} />,
                //   link: "/Calender",
                // },
                {
                  id: 220,
                  title: t("Leave"),
                  icon: <PiCalendarX className="" size={28} />,
                  link: "/Leave",
                  menuId: 11,
                },
                {
                  id: 217,
                  title: t("Shift"),
                  icon: <PiClockCountdown className="" size={28} />,
                  link: "/Shift",
                  menuId: 12,
                },
                {
                  id: 218,
                  title: t("Work_policys"),
                  icon: <PiWatch className="" size={28} />,
                  link: "/policies",
                  menuId: 13,
                },
                {
                  id: 219,
                  title: t("Holiday_Settings"),
                  icon: <PiImage className="" size={28} />,
                  link: "/holidays",
                  menuId: 14,
                },
              ],
            },
            {
              catid: 1,
              id: 3,
              parentMenu: t("Settings"),
              parentId: 9,
              title: t("Organisation"),
              status: false,
              menuId: [15, 16, 17, 69],
              subMenu: [
                {
                  id: 211,
                  title: t("Profile"),
                  icon: <PiUserCircle className="" size={28} />,
                  link: "/organisation",
                  menuId: 15,
                },
                {
                  id: 212,
                  title: t("Organisation_Setup"),
                  icon: <PiTreeStructure className="" size={28} />,
                  link: "/organisationSetup",
                  menuId: 16,
                },
                {
                  id: 213,
                  title: t("Masters"),
                  icon: <PiNotepad className="" size={28} />,
                  link: "/master",
                  menuId: 17,
                },
                {
                  id: 214,
                  title: t("Approval Types"),
                  icon: <PiCheckSquareOffset className="" size={28} />,
                  link: "/approvalTypes",
                  menuId: 69,
                },
                // {
                //   id: 221,
                //   title: t("Payroll"),
                //   icon: <PiMoney className="" size={28} />,
                //   link: "/payroll",
                // },
              ],
            },
            {
              catid: 1,
              id: 4,
              parentMenu: t("Settings"),
              parentId: 9,
              title: t("Payroll"),
              status: false,
              menuId: [18, 19, 20, 21, 22, 23, 24, 67, 68],
              subMenu: [
                {
                  id: 160,
                  title: t("Bank_Account_Settings"),
                  icon: <PiBank className="" size={28} />,
                  link: "/bankAccountSettings",
                  menuId: 18,
                },
                {
                  id: 161,
                  title: t("Salary_Components"),
                  icon: <PiMoney className="" size={28} />,
                  link: "/salaryComponents",
                  menuId:
                    parseInt(companyDetails?.isPFESIenabled) === 0 ? 19 : null,
                },
                {
                  //salaryComponentsIND
                  id: 168,
                  title: t("Salary_Components"),
                  icon: <PiMoney className="" size={28} />,
                  link: "/salaryComponentsIND",
                  menuId:
                    parseInt(companyDetails?.isPFESIenabled) === 1 ? 67 : null,
                },
                {
                  id: 162,
                  title: t("Statutory Configuration "),
                  icon: <PiKey className="" size={28} />,
                  link: "/statutoryConfiguration",
                  menuId:
                    parseInt(companyDetails?.isPFESIenabled) === 1 ? 68 : null,
                },
                {
                  id: 163,
                  title: t("Social_Security_Contributions"),
                  icon: <PiKey className="" size={28} />,
                  link: "/socialSecurityContributions",
                  menuId:
                    parseInt(companyDetails?.isPFESIenabled) === 0 ? 20 : null,
                },
                {
                  id: 164,
                  title: t("Salary_Template_Builder"),
                  icon: <PiCardholder className="" size={28} />,
                  link: "/salaryTemplateBuilder",
                  menuId: 21,
                },
                {
                  id: 165,
                  title: t("Payroll_Configuration"),
                  icon: <PiCalculator className="" size={28} />,
                  link: "/payrollConfiguration",
                  menuId: 22,
                },
                {
                  id: 166,
                  title: t("Approvals"),
                  icon: <PiCheckSquareOffset className="" size={28} />,
                  link: "/approvals",
                  // menuId: 23
                },
                {
                  id: 167,
                  title: t("Final_Settlements"),
                  icon: <PiCreditCard className="" size={28} />,
                  link: "/finalSettlements",
                  menuId: 23,
                },
                {
                  id: 168,
                  title: t("Loan_Settings"),
                  icon: <PiVault className="" size={28} />,
                  link: "/loanSettings",
                  menuId: 24,
                },
              ],
            },
            {
              catid: 1,
              id: 5,
              parentMenu: t("Settings"),
              parentId: 9,
              title: t("Request_and_Approvals"),
              status: false,
              subMenu: [
                {
                  id: 16,
                  title: t("Request"),
                  icon: <PiStack className="" size={28} />,
                  link: "/request",
                },
              ],
            },
          ],
        },
        {
          id: 9,
          title: t("Help"),
          icon: <IoHelpCircle />,
          directLink: true,
          dropdown: true,
        },
      ],
    },
  ];
};

export default Navdata;

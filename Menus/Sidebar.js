import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// IMAGES
import logo from "../../assets/images/logo.svg";

// TRANSLATION
import { useTranslation } from "react-i18next";

import { Menu } from "antd";
import { useTheme } from "../../Context/Theme/ThemeContext";
import { useDispatch } from "react-redux";
import { hamburger } from "../../Redux/slice";
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
  PiQuestion,
  PiWhatsappLogoFill,
  PiCalculator,
  PiMoney,
  PiChatsCircle,
  PiPiggyBank,
  PiBank,
  PiKey,
  PiCardholder,
  PiVault,
  PiArrowsLeftRightLight,
} from "react-icons/pi";
import { Dropdown } from "antd";
import { fetchCompanyDetails } from "../common/Functions/commonFunction";

const encryptActionID = (actionID) => {
  return btoa(actionID?.toString());
};
const Sidebar = ({ id = null }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [isHamburgerClicked, setHamburgerClicked] = useState(false);
  const [activeSubMenuLink, setActiveSubMenuLink] = useState(null);
  const [selectedMainMenu, setSelectedMainMenu] = useState(null);
  const submenuRef = useRef(null);
  const [storedSelectedMenu, setStoredSelectedMenu] = useState("");

  const encryptedActionID = encryptActionID(localStorage.getItem("employeeId"));
  const [loginData, setLoginData] = useState(
    JSON.parse(localStorage.getItem("LoginData"))
  );
  const [companyDetails, setCompanyDetails] = useState(null);
  const [navData, setNavData] = useState([]);

  const { theme } = useTheme();

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleSubmenuMouseEnter = (menuId) => {
      if (!isHamburgerClicked) {
        setActiveMenu(menuId);
        setShowSubmenu(true);
      }
    };

    const handleSubmenuMouseLeave = (menu) => {
      if (!isHamburgerClicked) {
        setShowSubmenu(false);
        setActiveMenu(null);
        setSelectedMainMenu(menu.title);
      }
    };

    if (submenuRef.current) {
      submenuRef.current.addEventListener(
        "mouseenter",
        handleSubmenuMouseEnter
      );
      submenuRef.current.addEventListener(
        "mouseleave",
        handleSubmenuMouseLeave
      );
    }
  }, []);

  // useEffect(() => {
  //   const handleSubmenuMouseEnter = () => {
  //     setShowSubmenu(true);
  //   };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.id);
    setSelectedMainMenu(menu.title);
    localStorage.setItem("selectedMainMenu", menu.title);
  };

  const handleMenuHover = (menuId) => {
    // const storedHamburgerClicked = JSON.parse(
    //   localStorage.getItem("hamburgerClicked")
    // );
    // if (storedHamburgerClicked !== null) {
    //   setHamburgerClicked(storedHamburgerClicked);
    // }

    const hoveredMenu = navData[0]?.topmenu.find(
      (menuItem) => menuItem.id === menuId
    );

    if (hoveredMenu) {
      if (!hoveredMenu.submenus || hoveredMenu.submenus.length === 0) {
        // Display the selected menu's submenus
        const storedSelectedMenu = localStorage.getItem("selectedMainMenu");

        const activeTopMenuData = navData[0]?.topmenu?.find(
          (menuItem) => menuItem.title === storedSelectedMenu
        );

        if (activeTopMenuData) {
          setActiveMenu(activeTopMenuData.id);
        } else {
          // Handle the case when the stored menu is not found in top menu
          setActiveMenu(null);
        }
      } else {
        setHamburgerClicked((prevClicked) => true); // hover time menu move to fixed, like top icon

        // Display the hovered menu's submenus
        setActiveMenu(menuId);
      }
    }
    //  if hamburger is not active
    if (hoveredMenu && !isHamburgerClicked) {
      if (hoveredMenu) {
        setActiveMenu(hoveredMenu.id);
        setShowSubmenu(true);
      } else {
        setActiveMenu(null);
      }
    }
  };

  // const handleMenuMouseLeave = () => {
  //   // Update selectedMainMenu based on the value in local storage
  //   const storedSelectedMenu = localStorage.getItem('selectedMainMenu');
  //   setSelectedMainMenu(storedSelectedMenu);

  //   // Find the active menu and set it
  //   const activeTopMenuData = navData[0].Sidebarmenus.find((menuItem) => menuItem.title === storedSelectedMenu);
  //   const activeBottomMenuData = navData[0].bottommenu.find((menuItem) => menuItem.title === storedSelectedMenu);

  //   if (activeTopMenuData) {
  //     setActiveMenu(activeTopMenuData.id);
  //   } else if (activeBottomMenuData) {
  //     setActiveMenu(activeBottomMenuData.id);
  //   }

  //   // Check if the mouse is still over the main menu or the submenu
  //   const isMouseOverMainMenu = document.querySelector('.top-menu:hover') !== null;
  //   const isMouseOverSubMenu = document.querySelector('.submenubar:hover') !== null;
  //   const isMouseOverBottomMenu = document.querySelector('.bottom-menu:hover') !== null; // Add this line

  //   clearTimeout(submenuTimeout);

  //   // Update the state accordingly with a delay before hiding the submenu
  //   setShowSubmenu(isMouseOverMainMenu || isMouseOverSubMenu || isMouseOverBottomMenu);
  // };

  // useEffect(() => {
  //   const topMenu = document.querySelector('.top-menu');
  //   const bottomMenu = document.querySelector('.bottom-menu');
  //   const submenuBar = document.querySelector('.submenubar');

  //   const handleSubMenuMouseLeave = () => {
  //     // Delay hiding the submenu to allow smooth transitions
  //     submenuTimeout = setTimeout(() => {
  //       setShowSubmenu(false);
  //     }, 300);
  //   };

  //   if (topMenu && bottomMenu && submenuBar) {
  //     topMenu.addEventListener('mouseleave', () => handleSubMenuMouseLeave());
  //     bottomMenu.addEventListener('mouseleave', () => handleSubMenuMouseLeave());
  //     submenuBar.addEventListener('mouseenter', () => clearTimeout(submenuTimeout));
  //   }

  //   // Cleanup the event listeners when the component unmounts
  //   return () => {
  //     if (topMenu) topMenu.removeEventListener('mouseleave', () => handleSubMenuMouseLeave());
  //     if (bottomMenu) bottomMenu.removeEventListener('mouseleave', () => handleSubMenuMouseLeave());
  //     if (submenuBar) submenuBar.removeEventListener('mouseenter', () => clearTimeout(submenuTimeout));
  //   };

  //   // Include dependencies Sidein the array if needed
  // }, [])
  const handleMenuMouseLeave = () => {
    // Update selectedMainMenu based on the value in local storage
    const storedSelectedMenu = localStorage.getItem("selectedMainMenu");
    setSelectedMainMenu(storedSelectedMenu);
    // setHamburgerClicked(false)

    // Find the active menu and set it
    const activeTopMenuData = navData[0]?.topmenu?.find(
      (menuItem) => menuItem.title === storedSelectedMenu
    );

    if (activeTopMenuData) {
      setActiveMenu(activeTopMenuData.id);
    } else {
      // Handle the case when the stored menu is not found in top menu
      setActiveMenu(null);
    }
    // Hide submenus when mouse leaves
    if (
      navData[0]?.topmenu[0]?.id === activeTopMenuData?.id ||
      navData[0]?.topmenu[5]?.id === activeTopMenuData?.id ||
      navData[0]?.topmenu[3]?.id === activeTopMenuData?.id
    ) {
      setHamburgerClicked(false);
    }

    if (!isHamburgerClicked) {
      setShowSubmenu(false);
    }
  };

  const handleHamburgerClick = (data) => {
    if (data === false) {
      setHamburgerClicked(false);
    }
    //  else if (
    //   selectedMainMenu !== "Discover" &&
    //   selectedMainMenu !== "Reports"
    // ) {
    //   setHamburgerClicked((prevClicked) => !prevClicked);
    // }
    setShowSubmenu(false);
    // const storedSelectedMenuId = localStorage.getItem("selectedMainMenuId");
    // if (storedSelectedMenuId) {
    //   setActiveMenu(storedSelectedMenuId);
    // } else {
    //   setActiveMenu(null);
    // }
    // // Save the hamburger state to localStorage
    // localStorage.setItem(
    //   "hamburgerClicked",
    //   JSON.stringify(!isHamburgerClicked)
    // );

    // Add or remove the 'sidebar-open' class to/from the body element
    // document.body.classList.toggle('sidebar-open', !isHamburgerClicked);
  };

  useEffect(() => {
    dispatch(hamburger(isHamburgerClicked));
  }, [isHamburgerClicked, dispatch]);

  useMemo(() => {
    const mainMenuTitle = navData[0]?.topmenu[0];
    if (!selectedMainMenu && mainMenuTitle && navData) {
      localStorage.setItem("selectedMainMenu", mainMenuTitle?.title);
      localStorage.setItem("selectedMainMenuId", mainMenuTitle?.id);
      setSelectedMainMenu(mainMenuTitle?.title);
    }
  }, [navData]);

  useEffect(() => {
    // Retrieve the hamburger state from localStorage when the component mounts
    const storedSelectedMenu = localStorage.getItem("selectedMainMenu");
    const storedSelectedMenuId = localStorage.getItem("selectedMainMenuId");

    if (storedSelectedMenu) {
      setSelectedMainMenu(storedSelectedMenu);
    }
    if (storedSelectedMenuId) {
      setActiveMenu(storedSelectedMenuId);
    }
    const storedHamburgerClicked = JSON.parse(
      localStorage.getItem("hamburgerClicked")
    );
    if (storedHamburgerClicked !== null) {
      setHamburgerClicked(storedHamburgerClicked);
    }
  }, []);

  useEffect(() => {
    if (isHamburgerClicked) {
      setShowSubmenu(false);
    }
  }, [isHamburgerClicked]);

  // const handleSubmenuMouseEnter = (menuId) => {
  //   if (!isHamburgerClicked) {
  //     setActiveMenu(menuId);
  //     setShowSubmenu(true);
  //   }
  // };

  // const handleSubmenuMouseLeave = (menu) => {
  //   if (!isHamburgerClicked) {
  //     setShowSubmenu(false);
  //     setActiveMenu(null);
  //     setSelectedMainMenu(menu.title);
  //   }
  // };

  const isSubmenuVisible = isHamburgerClicked || showSubmenu;
  useEffect(() => {
    const storedMenu = localStorage.getItem("selectedMainMenu");
    setStoredSelectedMenu(storedMenu);
  }, []); // Run this effect only once on mount

  const getCompanyById = async (id) => {
    try {
      const result = await fetchCompanyDetails(id);

      setCompanyDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    getCompanyById(id);
  }, [id]);

  // dropdown for help icon in sidebar
  const dropDownitems = [
    {
      key: "0",
      title: "Chat with MOHR",
      icon: (
        <PiWhatsappLogoFill
          size={18}
          className="text-[#32ba46] hover:scale-125 transform duration-300"
        />
      ),
    },
    {
      key: "1",
      title: "Help Center",
      icon: (
        <PiQuestion
          size={18}
          className="duration-300 transform text-grey hover:scale-125"
        />
      ),
    },
    {
      key: "3",
      title: "Contact Support",
      icon: (
        <PiChatsCircle
          size={18}
          className="duration-300 transform text-grey hover:scale-125"
        />
      ),
    },
  ];

  const menu = (
    <Menu className="!ml-5 2xl:!ml-7 dark:bg-secondaryDark !mb-4">
      {dropDownitems.map((item) => (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          className="!m-[2px] 2xl:!m-1 hover:text-primary"
          onClick={() => {
            // handleSelect(item.key);
          }}
        >
          <p className="text-xs 2xl:text-sm">{item.title}</p>
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    setNavData([
      {
        topmenu: [
          {
            id: 1,
            title: t("Discover"),
            link: "/",
            icon: (
              <IoMdCompass
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Discover") ? "text-primary" : ""
                }`}
              />
            ),
            menuId: 1,
            directLink: true,
          },
          {
            id: 2,
            title: t("Company"),
            menuId: 2,

            icon: (
              <RiBuildingFill
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Company") ? "text-primary" : ""
                }`}
              />
            ),
            submenus: [
              {
                catid: 2,
                id: 1,
                parentMenu: t("Company"),
                parentId: 2,
                title: t("Company_Management"),
                status: false,
                menuId: [26, 27, 28, 29, 43, 44, 31],
                subMenu: [
                  {
                    id: 408,
                    title: t("My_Profile"),
                    icon: <PiUser className="!text-base 2xl:!text-2xl" />,
                    link: `/myProfile/${encryptedActionID}`,
                    menuId: 26,
                  },
                  {
                    id: 409,
                    title: t("Company_Profile"),
                    icon: <PiBuildings className="!text-base 2xl:!text-2xl" />,
                    link: "/companyProfile",
                    menuId: 27,
                  },
                  {
                    id: 410,
                    title: t("All_Employees"),
                    icon: <PiUsersThree className="!text-base 2xl:!text-2xl" />,
                    link: "/employees",
                    menuId: 28,
                  },
                  // {
                  //   id: 411,
                  //   title: t("Onboarding"),
                  //   icon: <PiSignIn className="!text-base 2xl:!text-2xl" />,
                  //   link: "/Onboarding",
                  //   menuId: 29,
                  // },
                  {
                    id: 411,
                    title: t("Offboarding"),
                    icon: <PiSignOut className="!text-base 2xl:!text-2xl" />,
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
                  {
                    id: 560,
                    title: t("Transfer Employee"),
                    icon: (
                      <PiArrowsLeftRightLight className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/transferEmployee",
                    menuId: 82,
                  },
                  // {
                  //   id: 413,
                  //   title: t("Organization_Structure"),
                  //   icon: (
                  //     <PiTreeStructure className="!text-base 2xl:!text-2xl" />
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
              //   icon: <LuUsers className="!text-base 2xl:!text-2xl" />,
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
                    icon: <PiCube className="!text-base 2xl:!text-2xl" />,
                    link: "/myAssets",
                    menuId: 30,
                  },
                  {
                    id: 418,
                    title: t("Requested_Assets"),
                    icon: <PiFilePlus className="!text-base 2xl:!text-2xl" />,
                    link: "/requestedAssets",
                    menuId: 47,
                  },
                  {
                    id: 415,
                    title: t("Company_Assets"),
                    icon: <PiLaptop className="!text-base 2xl:!text-2xl" />,
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
                    icon: <PiFileText className="!text-base 2xl:!text-2xl" />,
                    link: "/myDocument",
                    menuId: 32,
                  },
                  {
                    id: 417,
                    title: t("Employee_Documents"),
                    icon: <PiFiles className="!text-base 2xl:!text-2xl" />,
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
            icon: (
              <HiMiniClock
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Time") ? "text-primary" : ""
                }`}
              />
            ),
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
                    icon: <PiCalendarX className="!text-base 2xl:!text-2xl" />,
                    link: "/myleaves",
                    menuId: 34,
                  },
                  {
                    id: 512,
                    title: t("Employee_Leave"),
                    icon: <PiUserMinus className="!text-base 2xl:!text-2xl" />,
                    link: "/employeeleave",
                    menuId: 35,
                  },
                  // {
                  //   id: 513,
                  //   title: t("Calendar"),
                  //   icon: <RiOrganizationChart className="!text-base 2xl:!text-2xl" />,
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
                    icon: <PiCalendar className="!text-base 2xl:!text-2xl" />,
                    link: "/calendar",
                    menuId: 36,
                  },
                  {
                    id: 514,
                    title: t("My_Attendance"),
                    icon: (
                      <PiCheckSquare className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/myattendance",
                    menuId: 37,
                  },
                  {
                    id: 515,
                    title: t("Employee_Attendance"),
                    icon: <PiListChecks className="!text-base 2xl:!text-2xl" />,
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
                    icon: (
                      <PiClockCountdown className="!text-base 2xl:!text-2xl" />
                    ),
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
              //       icon: <PiChatDots className="!text-base 2xl:!text-2xl" />,
              //       link: "/excuses",
              //       menuId: 40,
              //     },
              //     {
              //       id: 518,
              //       title: t("Employee_Excuses"),
              //       icon: (
              //         <PiChatCenteredText className="!text-base 2xl:!text-2xl" />
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
                    icon: <PiFileText className="!text-base 2xl:!text-2xl" />,
                    link: "/myRequest",
                    menuId: 34,
                  },
                  {
                    id: 420,
                    title: t("Employee Request"),
                    icon: <PiFiles className="!text-base 2xl:!text-2xl" />,
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
            icon: (
              <HiUsers
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Recruitment") ? "text-primary" : ""
                }`}
              />
            ),
            directLink: true,
          },
          {
            id: 5,
            title: t("Payroll"),
            menuId: 5,

            icon: (
              <HiCurrencyDollar
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Payroll") ? "text-primary" : ""
                }`}
              />
            ),
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
                    icon: <PiCalendarX className="!text-base 2xl:!text-2xl" />,
                    link: "/payrollOverview",
                    menuId: 70,
                  },
                  {
                    id: 521,
                    title: t("My_Salary"),
                    icon: <PiWallet className="!text-base 2xl:!text-2xl" />,
                    link: "/mySalary",
                    menuId: 71,
                  },
                  {
                    id: 522,
                    title: t("Payroll_Table"),
                    icon: (
                      <PiStackOverflowLogo className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/payrollTable",
                    menuId: 72,
                  },
                  {
                    id: 523,
                    title: t("Adjustments"),
                    icon: <PiHandCoins className="!text-base 2xl:!text-2xl" />,
                    link: "/adjustments",
                    menuId: 73,
                  },
                  {
                    id: 524,
                    title: t("My_Work_Expenses"),
                    icon: <PiCreditCard className="!text-base 2xl:!text-2xl" />,
                    link: "/myExpenses",
                    menuId: 74,
                  },
                  {
                    id: 525,
                    title: t("Employee_Work_Expenses"),
                    icon: <PiReceipt className="!text-base 2xl:!text-2xl" />,
                    link: "/employeeExpenses",
                    menuId: 75,
                  },
                  // {
                  //   id: 526,
                  //   title: t("My Loan"),
                  //   icon: <PiPiggyBank className="!text-base 2xl:!text-2xl" />,
                  //   link: "/myLoan",
                  //   menuId: 5,
                  // },

                  {
                    id: 526,
                    title: t("My Loan"),
                    icon: <PiPiggyBank className="!text-base 2xl:!text-2xl" />,
                    link: "/myLoan",
                    menuId: 76,
                  },
                  {
                    id: 527,
                    title: t("Employee_Loan"),
                    icon: <PiUsersThree className="!text-base 2xl:!text-2xl" />,
                    link: "/employeeLoan",
                    menuId: 77,
                  },
                  {
                    id: 528,
                    title: t("Final Settlement"),
                    icon: (
                      <LiaMoneyCheckSolid className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/finalsettlement",
                    menuId: 78,
                  },
                ],
              },
            ],
          },

          {
            id: 6,
            title: t("Reports"),
            menuId: 6,

            icon: (
              <HiDocumentText
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Reports") ? "text-primary" : ""
                }`}
              />
            ),
            link: "/reports",
            directLink: true,
          },
          // {
          //   id: 7,
          //   title: "",
          //   icon: (
          //     <RiSettings4Fill
          //       size={"100%"}
          //       className={`text-white transition-all duration-300 group-hover:text-primary ${
          //         selectedMainMenu === t("Settings") ? "text-primary" : ""
          //       }`}
          //     />
          //   ),
          // },

          {
            id: 7,
            title: t("Settings"),
            menuId: 7,

            icon: (
              <RiSettings4Fill
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Settings") ? "text-primary" : ""
                }`}
              />
            ),
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
                    icon: <PiPalette className="!text-base 2xl:!text-2xl" />,
                    link: "/appearance",
                    menuId: 8,
                  },
                  {
                    id: 113,
                    title: t("Notification"),
                    icon: <PiBell className="!text-base 2xl:!text-2xl" />,
                    link: "/notification",
                    menuId: 9,
                  },
                  {
                    id: 114,
                    title: t("User_Privileges"),
                    icon: (
                      <PiCheckSquareOffset className="!text-base 2xl:!text-2xl" />
                    ),
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
                  //   icon: <PiCalendar className="!text-base 2xl:!text-2xl" />,
                  //   link: "/Calender",
                  // },
                  {
                    id: 220,
                    title: t("Leave"),
                    icon: <PiCalendarX className="!text-base 2xl:!text-2xl" />,
                    link: "/Leave",
                    menuId: 11,
                  },
                  {
                    id: 217,
                    title: t("Shift"),
                    icon: (
                      <PiClockCountdown className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/Shift",
                    menuId: 12,
                  },
                  {
                    id: 218,
                    title: t("Work_policys"),
                    icon: <PiWatch className="!text-base 2xl:!text-2xl" />,
                    link: "/policies",
                    menuId: 13,
                  },
                  {
                    id: 219,
                    title: t("Holiday_Settings"),
                    icon: <PiImage className="!text-base 2xl:!text-2xl" />,
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
                    icon: <PiUserCircle className="!text-base 2xl:!text-2xl" />,
                    link: "/organisation",
                    menuId: 15,
                  },
                  {
                    id: 212,
                    title: t("Organisation_Setup"),
                    icon: (
                      <PiTreeStructure className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/organisationSetup",
                    menuId: 16,
                  },
                  {
                    id: 213,
                    title: t("Masters"),
                    icon: <PiNotepad className="!text-base 2xl:!text-2xl" />,
                    link: "/master",
                    menuId: 17,
                  },
                  {
                    id: 214,
                    title: t("Approval Types"),
                    icon: (
                      <PiCheckSquareOffset className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/approvalTypes",
                    menuId: 69,
                  },
                  // {
                  //   id: 221,
                  //   title: t("Payroll"),
                  //   icon: <PiMoney className="!text-base 2xl:!text-2xl" />,
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
                    icon: <PiBank className="!text-base 2xl:!text-2xl" />,
                    link: "/bankAccountSettings",
                    menuId: 18,
                  },
                  {
                    id: 161,
                    title: t("Salary_Components"),
                    icon: <PiMoney className="!text-base 2xl:!text-2xl" />,
                    link: "/salaryComponents",
                    menuId:
                      parseInt(companyDetails?.isPFESIenabled) === 0
                        ? 19
                        : null,
                  },
                  {
                    //salaryComponentsIND
                    id: 168,
                    title: t("Salary_Components"),
                    icon: <PiMoney className="!text-base 2xl:!text-2xl" />,
                    link: "/salaryComponentsIND",
                    menuId:
                      parseInt(companyDetails?.isPFESIenabled) === 1
                        ? 67
                        : null,
                  },
                  {
                    id: 162,
                    title: t("Statutory Configuration "),
                    icon: <PiKey className="!text-base 2xl:!text-2xl" />,
                    link: "/statutoryConfiguration",
                    menuId:
                      parseInt(companyDetails?.isPFESIenabled) === 1
                        ? 68
                        : null,
                  },
                  {
                    id: 163,
                    title: t("Social_Security_Contributions"),
                    icon: <PiKey className="!text-base 2xl:!text-2xl" />,
                    link: "/socialSecurityContributions",
                    menuId:
                      parseInt(companyDetails?.isPFESIenabled) === 0
                        ? 20
                        : null,
                  },
                  {
                    id: 164,
                    title: t("Salary_Template_Builder"),
                    icon: <PiCardholder className="!text-base 2xl:!text-2xl" />,
                    link: "/salaryTemplateBuilder",
                    menuId: 21,
                  },
                  {
                    id: 165,
                    title: t("Payroll_Configuration"),
                    icon: <PiCalculator className="!text-base 2xl:!text-2xl" />,
                    link: "/payrollConfiguration",
                    menuId: 22,
                  },
                  {
                    id: 166,
                    title: t("Approvals"),
                    icon: (
                      <PiCheckSquareOffset className="!text-base 2xl:!text-2xl" />
                    ),
                    link: "/approvals",
                    // menuId: 23
                  },
                  {
                    id: 167,
                    title: t("Final_Settlements"),
                    icon: <PiCreditCard className="!text-base 2xl:!text-2xl" />,
                    link: "/finalSettlements",
                    menuId: 23,
                  },
                  {
                    id: 168,
                    title: t("Loan_Settings"),
                    icon: <PiVault className="!text-base 2xl:!text-2xl" />,
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
                    icon: <PiStack className="!text-base 2xl:!text-2xl" />,
                    link: "/request",
                  },
                ],
              },
            ],
          },
          {
            id: 8,
            title: t("Help"),
            icon: (
              <IoHelpCircle
                size={"100%"}
                className={`text-white transition-all duration-300 group-hover:text-primary ${
                  selectedMainMenu === t("Help") ? "text-primary" : ""
                }`}
              />
            ),
            directLink: true,
            dropdown: true,
          },
        ],
      },
    ]);
  }, [companyDetails, selectedMainMenu]);

  // SIDEBAR MENU ARRAYS
  // const navData = [
  //   {
  //     topmenu: [
  //       {
  //         id: 1,
  //         title: t("Discover"),
  //         link: "/",
  //         icon: (
  //           <IoMdCompass
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Discover") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         menuId: 1,
  //         directLink: true,
  //       },
  //       {
  //         id: 2,
  //         title: t("Company"),
  //         menuId: 2,

  //         icon: (
  //           <RiBuildingFill
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Company") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         submenus: [
  //           {
  //             catid: 2,
  //             id: 1,
  //             parentMenu: t("Company"),
  //             parentId: 2,
  //             title: t("Company_Management"),
  //             status: false,
  //             menuId: [26, 27, 28, 29, 44, 31],
  //             subMenu: [
  //               {
  //                 id: 408,
  //                 title: t("My_Profile"),
  //                 icon: <PiUser className="!text-base 2xl:!text-2xl" />,
  //                 link: `/myProfile/${encryptedActionID}`,
  //                 menuId: 26,
  //               },
  //               {
  //                 id: 409,
  //                 title: t("Company_Profile"),
  //                 icon: <PiBuildings className="!text-base 2xl:!text-2xl" />,
  //                 link: "/companyProfile",
  //                 menuId: 27,
  //               },
  //               {
  //                 id: 410,
  //                 title: t("All_Employees"),
  //                 icon: <PiUsersThree className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employees",
  //                 menuId: 28,
  //               },
  //               // {
  //               //   id: 411,
  //               //   title: t("Onboarding"),
  //               //   icon: <PiSignIn className="!text-base 2xl:!text-2xl" />,
  //               //   link: "/Onboarding",
  //               //   menuId: 29,
  //               // },
  //               {
  //                 id: 411,
  //                 title: t("Offboarding"),
  //                 icon: <PiSignOut className="!text-base 2xl:!text-2xl" />,
  //                 link: (() => {
  //                   const permissions = loginData.userData.permissions;
  //                   if (permissions.includes(44)) {
  //                     return "/Offboarding";
  //                   } else if (
  //                     !permissions.includes(44) &&
  //                     permissions.includes(45)
  //                   ) {
  //                     return "/assetRecovering";
  //                   }
  //                   return "/Offboarding";
  //                 })(),
  //                 menuId: 44,
  //               },
  //               // {
  //               //   id: 413,
  //               //   title: t("Organization_Structure"),
  //               //   icon: (
  //               //     <PiTreeStructure className="!text-base 2xl:!text-2xl" />
  //               //   ),
  //               //   link: "/Organization-Structure",
  //               //   menuId: 31,
  //               // },
  //             ],
  //           },
  //           // {
  //           //   catid: 2,
  //           //   id: 2,
  //           //   parentMenu: "Company",
  //           //   parentId: 2,
  //           //   title: t("Employee_Profile"),
  //           //   icon: <LuUsers className="!text-base 2xl:!text-2xl" />,
  //           //   status: false,
  //           //   link: "/employeeProfile",
  //           // },
  //           {
  //             catid: 2,
  //             id: 3,
  //             parentMenu: t("Company"),
  //             parentId: 2,
  //             title: t("Asset_Management"),
  //             status: false,
  //             menuId: [45, 47, 31],

  //             subMenu: [
  //               {
  //                 id: 414,
  //                 title: t("My_Assets"),
  //                 icon: <PiCube className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myAssets",
  //                 menuId: 30,
  //               },
  //               {
  //                 id: 418,
  //                 title: t("Requested_Assets"),
  //                 icon: <PiFilePlus className="!text-base 2xl:!text-2xl" />,
  //                 link: "/requestedAssets",
  //                 menuId: 47,
  //               },
  //               {
  //                 id: 415,
  //                 title: t("Company_Assets"),
  //                 icon: <PiLaptop className="!text-base 2xl:!text-2xl" />,
  //                 link: "/companyAssets",
  //                 menuId: 31,
  //               },
  //             ],
  //           },
  //           {
  //             catid: 2,
  //             id: 4,
  //             parentMenu: t("Company"),
  //             parentId: 2,
  //             title: t("Document_Management"),
  //             status: false,
  //             menuId: [32, 33],

  //             subMenu: [
  //               {
  //                 id: 416,
  //                 title: t("My_Documents"),
  //                 icon: <PiFileText className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myDocument",
  //                 menuId: 32,
  //               },
  //               {
  //                 id: 417,
  //                 title: t("Employee_Documents"),
  //                 icon: <PiFiles className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employeeDocuments",

  //                 menuId: 33,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: 3,
  //         title: t("Time"),
  //         menuId: 3,
  //         icon: (
  //           <HiMiniClock
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Time") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         submenus: [
  //           {
  //             catid: 3,
  //             id: 1,
  //             parentMenu: t("Time"),
  //             parentId: 3,
  //             title: t("Leaves"),
  //             status: false,
  //             menuId: [34, 35],
  //             subMenu: [
  //               {
  //                 id: 511,
  //                 title: t("My_Leaves"),
  //                 icon: <PiCalendarX className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myleaves",
  //                 menuId: 34,
  //               },
  //               {
  //                 id: 512,
  //                 title: t("Employee_Leave"),
  //                 icon: <PiUserMinus className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employeeleave",
  //                 menuId: 35,
  //               },
  //               // {
  //               //   id: 513,
  //               //   title: t("Calendar"),
  //               //   icon: <RiOrganizationChart className="!text-base 2xl:!text-2xl" />,
  //               //   link: "/calender",
  //               // },
  //             ],
  //           },
  //           {
  //             catid: 3,
  //             id: 2,
  //             parentMenu: t("Time"),
  //             parentId: 3,
  //             title: t("Attendence"),
  //             status: false,
  //             menuId: [36, 37, 38],
  //             subMenu: [
  //               {
  //                 id: 513,
  //                 title: t("Calendar"),
  //                 icon: <PiCalendar className="!text-base 2xl:!text-2xl" />,
  //                 link: "/calendar",
  //                 menuId: 36,
  //               },
  //               {
  //                 id: 514,
  //                 title: t("My_Attendance"),
  //                 icon: <PiCheckSquare className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myattendance",
  //                 menuId: 37,
  //               },
  //               {
  //                 id: 515,
  //                 title: t("Employee_Attendance"),
  //                 icon: <PiListChecks className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employee_attendance",
  //                 menuId: 38,
  //               },
  //             ],
  //           },
  //           {
  //             catid: 3,
  //             id: 3,
  //             parentMenu: t("Time"),
  //             parentId: 3,
  //             title: t("Shift"),
  //             status: false,
  //             menuId: [39],

  //             subMenu: [
  //               {
  //                 id: 516,
  //                 title: t("Shift_Schedular"),
  //                 icon: (
  //                   <PiClockCountdown className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "shiftschedular",
  //                 menuId: 39,
  //               },
  //             ],
  //           },
  //           // {
  //           //   catid: 3,
  //           //   id: 4,
  //           //   parentMenu: t("Time"),
  //           //   parentId: 3,
  //           //   title: t("Excuse_Management"),
  //           //   icon: <LuUsers className="!text-lg 2xl:!text-xl" />,
  //           //   status: false,
  //           //   menuId: [40, 41],

  //           //   subMenu: [
  //           //     {
  //           //       id: 517,
  //           //       title: t("Excuses"),
  //           //       icon: <PiChatDots className="!text-base 2xl:!text-2xl" />,
  //           //       link: "/excuses",
  //           //       menuId: 40,
  //           //     },
  //           //     {
  //           //       id: 518,
  //           //       title: t("Employee_Excuses"),
  //           //       icon: (
  //           //         <PiChatCenteredText className="!text-base 2xl:!text-2xl" />
  //           //       ),
  //           //       link: "/employee_excuses",
  //           //       menuId: 41,
  //           //     },
  //           //   ],
  //           // },
  //           {
  //             catid: 3,
  //             id: 5,
  //             parentMenu: t("Time"),
  //             parentId: 3,
  //             title: t("Request"),
  //             status: false,
  //             menuId: [34, 35],

  //             subMenu: [
  //               {
  //                 id: 419,
  //                 title: t("My Request"),
  //                 icon: <PiFileText className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myRequest",
  //                 menuId: 34,
  //               },
  //               {
  //                 id: 420,
  //                 title: t("Employee Request"),
  //                 icon: <PiFiles className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employeeRequest",

  //                 menuId: 35,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: 4,
  //         title: t("Recruitment"),
  //         menuId: 4,
  //         link: "https://alpha-jobs.loyaltri.com",
  //         tragetBlank: true,
  //         icon: (
  //           <HiUsers
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Recruitment") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         directLink: true,
  //       },
  //       {
  //         id: 5,
  //         title: t("Payroll"),
  //         menuId: 5,

  //         icon: (
  //           <HiCurrencyDollar
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Payroll") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         submenus: [
  //           {
  //             catid: 5,
  //             id: 1,
  //             parentMenu: t("Payroll"),
  //             parentId: 5,
  //             title: t("Payroll"),
  //             status: false,
  //             menuId: [5, 46],
  //             subMenu: [
  //               {
  //                 id: 520,
  //                 title: t("Payroll Overview"),
  //                 icon: <PiCalendarX className="!text-base 2xl:!text-2xl" />,
  //                 link: "/payrollOverview",
  //                 menuId: 70,
  //               },
  //               {
  //                 id: 521,
  //                 title: t("My_Salary"),
  //                 icon: <PiWallet className="!text-base 2xl:!text-2xl" />,
  //                 link: "/mySalary",
  //                 menuId: 71,
  //               },
  //               {
  //                 id: 522,
  //                 title: t("Payroll_Table"),
  //                 icon: (
  //                   <PiStackOverflowLogo className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/payrollTable",
  //                 menuId: 72,
  //               },
  //               {
  //                 id: 523,
  //                 title: t("Adjustments"),
  //                 icon: <PiHandCoins className="!text-base 2xl:!text-2xl" />,
  //                 link: "/adjustments",
  //                 menuId: 73,
  //               },
  //               {
  //                 id: 524,
  //                 title: t("My_Work_Expenses"),
  //                 icon: <PiCreditCard className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myExpenses",
  //                 menuId: 74,
  //               },
  //               {
  //                 id: 525,
  //                 title: t("Employee_Work_Expenses"),
  //                 icon: <PiReceipt className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employeeExpenses",
  //                 menuId: 75,
  //               },
  //               // {
  //               //   id: 526,
  //               //   title: t("My Loan"),
  //               //   icon: <PiPiggyBank className="!text-base 2xl:!text-2xl" />,
  //               //   link: "/myLoan",
  //               //   menuId: 5,
  //               // },

  //               {
  //                 id: 526,
  //                 title: t("My Loan"),
  //                 icon: <PiPiggyBank className="!text-base 2xl:!text-2xl" />,
  //                 link: "/myLoan",
  //                 menuId: 76,
  //               },
  //               {
  //                 id: 527,
  //                 title: t("Employee_Loan"),
  //                 icon: <PiUsersThree className="!text-base 2xl:!text-2xl" />,
  //                 link: "/employeeLoan",
  //                 menuId: 77,
  //               },
  //               {
  //                 id: 528,
  //                 title: t("Final Settlement"),
  //                 icon: (
  //                   <LiaMoneyCheckSolid className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/finalsettlement",
  //                 menuId: 78,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       // {
  //       //   id: 6,
  //       //   title: "",
  //       //   icon: (
  //       //     <HiDocumentText
  //       //       size={"100%"}
  //       //       className={`text-white transition-all duration-300 group-hover:text-primary ${selectedMenu === "Reports" ? "text-primary" : ""
  //       //         }`}
  //       //     />
  //       //   ),
  //       // },
  //       // {
  //       //   id: 7,
  //       //   title: "",
  //       //   icon: (
  //       //     <RiSettings4Fill
  //       //       size={"100%"}
  //       //       className={`text-white transition-all duration-300 group-hover:text-primary ${selectedMenu === "Settings" ? "text-primary" : ""
  //       //         }`}
  //       //     />
  //       //   ),
  //       // },

  //       {
  //         id: 6,
  //         title: t("Reports"),
  //         menuId: 6,

  //         icon: (
  //           <HiDocumentText
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Reports") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         link: "/reports",
  //         directLink: true,
  //       },
  //       {
  //         id: 7,
  //         title: "",
  //         icon: (
  //           <RiSettings4Fill
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Settings") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //       },

  //       {
  //         id: 8,
  //         title: t("Settings"),
  //         menuId: 7,

  //         icon: (
  //           <RiSettings4Fill
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Settings") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         submenus: [
  //           {
  //             catid: 1,
  //             id: 1,
  //             parentMenu: t("Settings"),
  //             parentId: 9,
  //             title: t("General"),
  //             status: false,
  //             menuId: [8, 9, 10],

  //             subMenu: [
  //               {
  //                 id: 112,
  //                 title: t("Appearance"),
  //                 icon: <PiPalette className="!text-base 2xl:!text-2xl" />,
  //                 link: "/appearance",
  //                 menuId: 8,
  //               },
  //               {
  //                 id: 113,
  //                 title: t("Notification"),
  //                 icon: <PiBell className="!text-base 2xl:!text-2xl" />,
  //                 link: "/notification",
  //                 menuId: 9,
  //               },
  //               {
  //                 id: 114,
  //                 title: t("User_Privileges"),
  //                 icon: (
  //                   <PiCheckSquareOffset className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/userPrivileges",
  //                 menuId: 10,
  //               },
  //             ],
  //           },
  //           {
  //             catid: 1,
  //             id: 2,
  //             parentMenu: t("Settings"),
  //             parentId: 9,
  //             title: t("TIME_AND_ATTENDENCE"),
  //             status: false,
  //             menuId: [11, 12, 13, 14],

  //             subMenu: [
  //               // {
  //               //   id: 215,
  //               //   title: t("Calender"),
  //               //   icon: <PiCalendar className="!text-base 2xl:!text-2xl" />,
  //               //   link: "/Calender",
  //               // },
  //               {
  //                 id: 220,
  //                 title: t("Leave"),
  //                 icon: <PiCalendarX className="!text-base 2xl:!text-2xl" />,
  //                 link: "/Leave",
  //                 menuId: 11,
  //               },
  //               {
  //                 id: 217,
  //                 title: t("Shift"),
  //                 icon: (
  //                   <PiClockCountdown className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/Shift",
  //                 menuId: 12,
  //               },
  //               {
  //                 id: 218,
  //                 title: t("Work_policys"),
  //                 icon: <PiWatch className="!text-base 2xl:!text-2xl" />,
  //                 link: "/policies",
  //                 menuId: 13,
  //               },
  //               {
  //                 id: 219,
  //                 title: t("Holiday_Settings"),
  //                 icon: <PiImage className="!text-base 2xl:!text-2xl" />,
  //                 link: "/holidays",
  //                 menuId: 14,
  //               },
  //             ],
  //           },
  //           {
  //             catid: 1,
  //             id: 3,
  //             parentMenu: t("Settings"),
  //             parentId: 9,
  //             title: t("Organisation"),
  //             status: false,
  //             menuId: [15, 16, 17, 69],
  //             subMenu: [
  //               {
  //                 id: 211,
  //                 title: t("Profile"),
  //                 icon: <PiUserCircle className="!text-base 2xl:!text-2xl" />,
  //                 link: "/organisation",
  //                 menuId: 15,
  //               },
  //               {
  //                 id: 212,
  //                 title: t("Organisation_Setup"),
  //                 icon: (
  //                   <PiTreeStructure className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/organisationSetup",
  //                 menuId: 16,
  //               },
  //               {
  //                 id: 213,
  //                 title: t("Masters"),
  //                 icon: <PiNotepad className="!text-base 2xl:!text-2xl" />,
  //                 link: "/master",
  //                 menuId: 17,
  //               },
  //               {
  //                 id: 214,
  //                 title: t("Approval Types"),
  //                 icon: (
  //                   <PiCheckSquareOffset className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/approvalTypes",
  //                 menuId: 69,
  //               },
  //               // {
  //               //   id: 221,
  //               //   title: t("Payroll"),
  //               //   icon: <PiMoney className="!text-base 2xl:!text-2xl" />,
  //               //   link: "/payroll",
  //               // },
  //             ],
  //           },
  //           {
  //             catid: 1,
  //             id: 4,
  //             parentMenu: t("Settings"),
  //             parentId: 9,
  //             title: t("Payroll"),
  //             status: false,
  //             menuId: [18, 19, 20, 21, 22, 23, 24, 67, 68],
  //             subMenu: [
  //               {
  //                 id: 160,
  //                 title: t("Bank_Account_Settings"),
  //                 icon: <PiBank className="!text-base 2xl:!text-2xl" />,
  //                 link: "/bankAccountSettings",
  //                 menuId: 18,
  //               },
  //               {
  //                 id: 161,
  //                 title: t("Salary_Components"),
  //                 icon: <PiMoney className="!text-base 2xl:!text-2xl" />,
  //                 link: "/salaryComponents",
  //                 menuId:
  //                   parseInt(companyDetails?.isPFESIenabled) === 0 ? 19 : null,
  //               },
  //               {
  //                 //salaryComponentsIND
  //                 id: 168,
  //                 title: t("Salary_Components"),
  //                 icon: <PiMoney className="!text-base 2xl:!text-2xl" />,
  //                 link: "/salaryComponentsIND",
  //                 menuId:
  //                   parseInt(companyDetails?.isPFESIenabled) === 1 ? 67 : null,
  //               },
  //               {
  //                 id: 162,
  //                 title: t("Statutory Configuration "),
  //                 icon: <PiKey className="!text-base 2xl:!text-2xl" />,
  //                 link: "/statutoryConfiguration",
  //                 menuId:
  //                   parseInt(companyDetails?.isPFESIenabled) === 1 ? 68 : null,
  //               },
  //               {
  //                 id: 163,
  //                 title: t("Social_Security_Contributions"),
  //                 icon: <PiKey className="!text-base 2xl:!text-2xl" />,
  //                 link: "/socialSecurityContributions",
  //                 menuId:
  //                   parseInt(companyDetails?.isPFESIenabled) === 0 ? 20 : null,
  //               },
  //               {
  //                 id: 164,
  //                 title: t("Salary_Template_Builder"),
  //                 icon: <PiCardholder className="!text-base 2xl:!text-2xl" />,
  //                 link: "/salaryTemplateBuilder",
  //                 menuId: 21,
  //               },
  //               {
  //                 id: 165,
  //                 title: t("Payroll_Configuration"),
  //                 icon: <PiCalculator className="!text-base 2xl:!text-2xl" />,
  //                 link: "/payrollConfiguration",
  //                 menuId: 22,
  //               },
  //               {
  //                 id: 166,
  //                 title: t("Approvals"),
  //                 icon: (
  //                   <PiCheckSquareOffset className="!text-base 2xl:!text-2xl" />
  //                 ),
  //                 link: "/approvals",
  //                 // menuId: 23
  //               },
  //               {
  //                 id: 167,
  //                 title: t("Final_Settlements"),
  //                 icon: <PiCreditCard className="!text-base 2xl:!text-2xl" />,
  //                 link: "/finalSettlements",
  //                 menuId: 23,
  //               },
  //               {
  //                 id: 168,
  //                 title: t("Loan_Settings"),
  //                 icon: <PiVault className="!text-base 2xl:!text-2xl" />,
  //                 link: "/loanSettings",
  //                 menuId: 24,
  //               },
  //             ],
  //           },
  //           {
  //             catid: 1,
  //             id: 5,
  //             parentMenu: t("Settings"),
  //             parentId: 9,
  //             title: t("Request_and_Approvals"),
  //             status: false,
  //             subMenu: [
  //               {
  //                 id: 16,
  //                 title: t("Request"),
  //                 icon: <PiStack className="!text-base 2xl:!text-2xl" />,
  //                 link: "/request",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         id: 9,
  //         title: t("Help"),
  //         icon: (
  //           <IoHelpCircle
  //             size={"100%"}
  //             className={`text-white transition-all duration-300 group-hover:text-primary ${
  //               selectedMainMenu === t("Help") ? "text-primary" : ""
  //             }`}
  //           />
  //         ),
  //         directLink: true,
  //         dropdown: true,
  //       },
  //     ],
  //   },
  // ];

  const topMenus = navData[0]?.topmenu.filter(
    (menuItem) =>
      menuItem.title !== t("Settings") &&
      menuItem.title !== t("Help") &&
      menuItem.title !== ""
  );
  const bottomMenus = navData[0]?.topmenu.filter(
    (menuItem) =>
      menuItem.title === t("Settings") ||
      menuItem.title === t("Help") ||
      menuItem.title === ""
  );

  const items = [{ label: "Navigation One", key: "1", icon: "" }];

  navData.forEach((menuItem) => {
    if (menuItem.title === "") {
      menuItem.selectedMainMenu = storedSelectedMenu === menuItem.id;
    }
  });

  return (
    <aside
      className={`sidebar hidden lg:block  ${
        //!px-3
        isHamburgerClicked ? "open" : "close"
      }`}
    >
      <div className="z-[1000] fixed top-0 ltr:left-0 rtl:right-0 font-figtree dark:bg-dark1 bg-primaryalpha h-full w-16 2xl:w-[88px] !py-5 border-r border-black/10 dark:border-dark3">
        <div
          className="flex items-center justify-center px-5 brand-img"
          title="brand logo"
        >
          <img
            className="object-contain w-11 2xl:w-full "
            src={logo}
            alt="logo"
          />
        </div>
        <div className="flex items-center justify-center py-4">
          <div
            className="hamburger w-7 h-6 2xl:h-[38px] 2xl:w-[50px] rounded-md 2xl:rounded-xl bg-white dark:bg-dark3 bg-opacity-10 flex justify-center items-center p-[6px]"
            onClick={handleHamburgerClick}
          >
            <div
              className={`flex-col gap-[2px] 2xl:gap-1 vhcenter ${
                isHamburgerClicked ? "is-active" : ""
              } cursor-pointer`}
            >
              <span
                className={`line w-3 2xl:w-[18px] h-[1px] bg-gray-100 block mx-auto transition-all duration-300 ease-in-out transform ${
                  isHamburgerClicked ? "translate-x-[3px]" : ""
                }`}
              ></span>
              <span
                className={`line w-3 2xl:w-[18px] h-[1px] bg-gray-100 block mx-auto transition-all duration-300 ease-in-out transform ${
                  isHamburgerClicked ? "" : "translate-x-0"
                }`}
              ></span>
              <span
                className={`line w-3 2xl:w-[18px] h-[1px] bg-gray-100 block mx-auto transition-all duration-300 ease-in-out transform ${
                  isHamburgerClicked ? "-translate-x-[3px]" : ""
                }`}
              ></span>
            </div>
          </div>
        </div>
        <ul className="m-0 appearance-none h-[calc(100%_-_4.5rem)] 2xl:h-[calc(100%_-_6.5rem)] overflow-auto">
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex flex-col !gap-2 2xl:!gap-3 top-menu">
              {topMenus?.map((menuItem) => (
                // MAIN MENUS
                <li
                  key={menuItem.id}
                  className={`menu-link relative group ${
                    activeSubMenuLink === menuItem.id ? "active" : ""
                  }`}
                  onClick={() => {
                    if (menuItem?.directLink) {
                      handleHamburgerClick(false);
                      // setDirectMenu(true);
                    }
                    handleMenuClick(menuItem);
                  }}
                  onMouseEnter={() => {
                    if (menuItem?.directLink) {
                      handleHamburgerClick(false);
                    } else {
                      handleMenuHover(menuItem.id, true);
                    }
                  }}
                  style={{
                    opacity: menuItem.title === "" ? 0 : 1,
                    cursor: menuItem.title === "" ? "default" : "pointer",
                    // Add the following line to override the cursor for transparent items
                  }}
                >
                  {/* If topMenus have a direct link attached to their icon, then this works. */}
                  {loginData.userData.permissions
                    .map(Number)
                    .includes(menuItem.menuId) &&
                    (menuItem.link ? (
                      <div className="menu-item flex flex-col items-center gap-1 2xl:gap-[6px] ">
                        <Link
                          to={menuItem.link}
                          target={menuItem.tragetBlank ? "_blank" : null}
                        >
                          <div
                            className={`w-7 h-7 2xl:h-[50px] 2xl:w-[50px] rounded-md 2xl:rounded-xl bg-white bg-opacity-10 border border-white !border-opacity-20 flex justify-center items-center p-[6px] group-hover:bg-white transition-all duration-300 menu-item-cat${
                              selectedMainMenu === menuItem.title
                                ? "bg-white bg-opacity-100"
                                : ""
                            }`}
                          >
                            {menuItem.icon}
                          </div>
                        </Link>

                        <p className="text-[9px] 2xl:text-xs text-white">
                          {menuItem.title}
                        </p>
                      </div>
                    ) : (
                      <div className="menu-item flex flex-col items-center gap-1 2xl:gap-[6px] ">
                        <div
                          className={`w-7 h-7 2xl:h-[50px] 2xl:w-[50px] rounded-md 2xl:rounded-xl bg-white bg-opacity-10 border border-white !border-opacity-20 flex justify-center items-center p-[6px] group-hover:bg-white transition-all duration-300 menu-item-cat${
                            selectedMainMenu === menuItem.title
                              ? "bg-white bg-opacity-100"
                              : ""
                          }`}
                        >
                          {menuItem.icon}
                        </div>
                        <p className="text-[9px] 2xl:text-xs text-white">
                          {menuItem.title}
                        </p>
                      </div>
                    ))}
                </li>
              ))}
            </div>
            <div className="flex flex-col !gap-2 2xl:!gap-3 bottom-menu">
              {bottomMenus?.map((menuItem) => (
                <>
                  {menuItem.dropdown ? (
                    <Dropdown overlay={menu} placement="right">
                      <li
                        key={menuItem.id}
                        className={`menu-link relative group ${
                          activeSubMenuLink === menuItem.id ? "active" : ""
                        }`}
                        // onClick={() => handleMenuClick(menuItem)}
                        // onMouseEnter={() => handleMenuHover(menuItem.id, true)}
                        onClick={() => {
                          if (menuItem?.directLink) {
                            handleHamburgerClick(false);
                          }
                          handleMenuClick(menuItem);
                        }}
                        onMouseEnter={() => {
                          if (menuItem?.directLink) {
                            handleHamburgerClick(false);
                          } else {
                            handleMenuHover(menuItem.id, true);
                          }
                        }}
                        style={{
                          opacity: menuItem.title === "" ? 0 : 1,
                          cursor: menuItem.title === "" ? "default" : "pointer",
                          // Add the following line to override the cursor for transparent items
                        }}
                      >
                        <div className="menu-item flex flex-col items-center gap-1 2xl:gap-[6px] ">
                          <div
                            className={`w-7 h-7 2xl:h-[50px] 2xl:w-[50px] rounded-md 2xl:rounded-xl bg-white bg-opacity-10 border border-white !border-opacity-20 flex justify-center items-center p-[6px] group-hover:bg-white transition-all duration-300 menu-item-cat${
                              selectedMainMenu === menuItem.title
                                ? "bg-white bg-opacity-100"
                                : ""
                            }`}
                          >
                            {menuItem.icon}
                          </div>
                          <p className="text-[9px] 2xl:text-xs text-white">
                            {menuItem.title}
                          </p>
                        </div>
                      </li>
                    </Dropdown>
                  ) : (
                    <li
                      key={menuItem.id}
                      className={`menu-link relative group ${
                        activeSubMenuLink === menuItem.id ? "active" : ""
                      }`}
                      // onClick={() => handleMenuClick(menuItem)}
                      // onMouseEnter={() => handleMenuHover(menuItem.id, true)}
                      onClick={() => {
                        if (menuItem?.directLink) {
                          handleHamburgerClick(false);
                        }
                        handleMenuClick(menuItem);
                      }}
                      onMouseEnter={() => {
                        if (menuItem?.directLink) {
                          handleHamburgerClick(false);
                        } else {
                          handleMenuHover(menuItem.id, true);
                        }
                      }}
                      style={{
                        opacity: menuItem.title === "" ? 0 : 1,
                        cursor: menuItem.title === "" ? "default" : "pointer",
                        // Add the following line to override the cursor for transparent items
                      }}
                    >
                      <div className="menu-item flex flex-col items-center gap-1 2xl:gap-[6px] ">
                        <div
                          className={`w-7 h-7 2xl:h-[50px] 2xl:w-[50px] rounded-md 2xl:rounded-xl bg-white bg-opacity-10 border border-white !border-opacity-20 flex justify-center items-center p-[6px] group-hover:bg-white transition-all duration-300 menu-item-cat${
                            selectedMainMenu === menuItem.title
                              ? "bg-white bg-opacity-100"
                              : ""
                          }`}
                        >
                          {menuItem.icon}
                        </div>
                        <p className="text-[9px] 2xl:text-xs text-white">
                          {menuItem.title}
                        </p>
                      </div>
                    </li>
                  )}
                </>
              ))}
            </div>
            {/* ${isSubmenuVisible ? "block" : "hidden"} */}
          </div>
        </ul>
      </div>
      <div
        className={`${
          isHamburgerClicked
            ? "translate-x-0 rtl:-translate-x-0 transform transition-transform duration-300"
            : "-translate-x-full rtl:translate-x-full transform transition-transform duration-300"
        } ${
          theme === "pink" ? "bg-[#FEF5F7]" : "bg-white"
        } z-[999] fixed inset-y-0 opacity-100 dark:bg-dark1 ltr:left-[64px] rtl:right-[64px] ltr:2xl:left-[88px] rtl:2xl:right-[88px] p-2.5 2xl:p-2.5 ltr:rounded-tr-lg ltr:rounded-br-lg rtl:rounded-tl-lg rtl:rounded-bl-lg w-[196px] 2xl:w-[278px] top-0 h-full flex flex-col gap-3 border-r border-black/10 dark:border-dark3`}
        onMouseEnter={handleMenuHover}
        onMouseLeave={handleMenuMouseLeave}
        key={Menu.id}
      >
        <div className="py-2 brand-name">
          <h1 className="text-xl font-semibold 2xl:text-2xl text-primaryalpha dark:text-white">
            Loyaltri
          </h1>
        </div>

        {/* <SelectCompany /> */}
        {activeMenu !== null && (
          <Menu
            mode="inline"
            className="bg-transparent submenubar dark:text-white !border-e-0 overflow-auto"
            defaultOpenKeys={navData[0]?.topmenu.map((item) =>
              item.id.toString()
            )}
          >
            {navData[0]?.topmenu[activeMenu - 1]?.submenus?.map((submenuItem) =>
              submenuItem.link ? (
                <Menu.Item
                  key={submenuItem.id}
                  title={submenuItem.title}
                  icon={submenuItem.icon}
                  className={`submenu-link capitalize text-black dark:text-white dark:hover:!bg-secondaryDark dark:hover:!text-white !pl-3.5 !h-8 2xl:!h-10 text-sm ${
                    currentPath === submenuItem.link ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveSubMenuLink(submenuItem.catid);
                    setSelectedMainMenu(submenuItem.parentMenu);
                    localStorage.setItem(
                      "selectedMainMenu",
                      submenuItem.parentMenu
                    );
                  }}
                >
                  <Link
                    className="2xl:text-sm text-[10px] dark:text-white"
                    to={submenuItem.link}
                  >
                    {submenuItem.title}
                  </Link>
                </Menu.Item>
              ) : (
                loginData.userData.permissions?.filter((each) =>
                  submenuItem.menuId?.includes(parseInt(each))
                ).length > 0 && (
                  <Menu.SubMenu
                    key={submenuItem.id}
                    title={
                      loginData.userData.permissions?.filter((each) =>
                        submenuItem.menuId?.includes(parseInt(each))
                      ).length > 0 && submenuItem.title
                    }
                    className="text-[8px] 2xl:text-[12px] uppercase"
                  >
                    {submenuItem?.subMenu?.map(
                      (submenusubItem) =>
                        loginData.userData.permissions
                          .map(Number)
                          .includes(submenusubItem.menuId) && (
                          <Menu.Item
                            key={submenusubItem.id}
                            title={submenusubItem.title}
                            icon={submenusubItem.icon}
                            className={`submenu-link capitalize text-black dark:text-white dark:hover:!bg-secondaryDark dark:hover:!text-white !pl-3.5 !h-8 2xl:!h-10 2xl:text-sm text-[10px] ${
                              currentPath === submenusubItem.link
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setActiveSubMenuLink(submenuItem.catid);
                              setSelectedMainMenu(submenuItem.parentMenu);
                              localStorage.setItem(
                                "selectedMainMenu",
                                submenuItem.parentMenu
                              );
                            }}
                          >
                            <Link
                              className="2xl:text-sm text-[10px] dark:text-white"
                              to={submenusubItem.link}
                            >
                              {submenusubItem.title}
                            </Link>
                          </Menu.Item>
                        )
                      // )
                    )}
                  </Menu.SubMenu>
                )
              )
            )}
          </Menu>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

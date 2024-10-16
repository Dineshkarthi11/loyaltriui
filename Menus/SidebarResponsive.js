import React, { useEffect, useState } from "react";
import { PiCaretLeft, PiCaretRight, PiSignOut, PiX } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import NavData from "./NavData";
import { Link, useNavigate } from "react-router-dom";
import API, { action } from "../Api";
import ButtonClick from "../common/Button";
import Avatar from "../common/Avatar";
import ModalAnt from "../common/ModalAnt";
import Logout from "../../assets/images/Logout.svg";
import localStorageData from "../common/Functions/localStorageKeyValues";

export const SidebarResponsive = ({
  isHamburgerClicked,
  handleHamburgerClick,
}) => {
  const navData = NavData();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [loginData, setLoginData] = useState(localStorageData.LoginData);
  const [employeeData, setEmployeeData] = useState(null);
  const [open, setOpen] = useState(false);
  const Navigate = useNavigate();

  // FRAMER MOTION ANIMATIONS START HERE
  const containerVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.1, duration: 0.4, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const easeFunction = [0.25, 0.1, 0.25, 1]; // smooth easing function

  const titleVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: easeFunction },
    },
    closed: {
      x: "-10%",
      opacity: 0,
      transition: { duration: 0.3, ease: easeFunction },
    },
  };

  const backButtonVarients = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: easeFunction },
    },
    closed: {
      x: "70%",
      opacity: 0,
      transition: { duration: 0.4, ease: easeFunction },
    },
  };

  const mainMenuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: easeFunction },
    },
    closed: {
      x: "-5%",
      opacity: 0.5,
      transition: { duration: 0.4, ease: easeFunction },
    },
  };

  const subMenuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: easeFunction },
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.4, ease: easeFunction },
    },
  };
  // FRAMER MOTION ANIMATIONS END HERE

  const handleSetSubmenu = (mainMenu, submenu) => {
    if (mainMenu.directLink === true) {
      Navigate(mainMenu.link);
      setActiveMenu(null);
      setSubMenu(null);
      handleHamburger();
    } else {
      setSubMenu(submenu);
      setActiveMenu(mainMenu.title);
      setSubMenuOpen(true);
    }
  };

  const handleHamburger = () => {
    handleHamburgerClick();
    setSubMenuOpen(false);
  };

  useEffect(() => {
    getEmployee();
  }, []);
  const getEmployee = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: employeeId,
      });
      setEmployeeData(result.result);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem("LoginData");
    localStorage.clear();
    window.location.reload();
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <AnimatePresence>
        {isHamburgerClicked && (
          <motion.div
            className="h-screen bg-white dark:bg-[#1b1b1b] w-full lg:hidden fixed top-0 z-[9999] overflow-hidden"
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="flex flex-col h-full"
              variants={contentVariants}
            >
              {/*Menu Header Section */}
              <div className="flex items-center justify-between h-16 border-b border-black/10 dark:border-dark3 px-4 py-[18px]">
                <div className="relative w-32 h-full">
                  <motion.div
                    className="absolute w-full h-full -translate-y-1/2"
                    variants={titleVariants}
                    initial="open"
                    animate={subMenuOpen ? "closed" : "open"}
                  >
                    <p className="text-2xl font-bold text-primaryalpha dark:text-white">
                      Loyaltri
                    </p>
                  </motion.div>
                  <motion.div
                    className="absolute flex items-center w-full h-full -translate-y-1/2"
                    variants={backButtonVarients}
                    initial="closed"
                    animate={subMenuOpen ? "open" : "closed"}
                  >
                    <button
                      onClick={() => setSubMenuOpen(false)}
                      className="flex items-center gap-1 dark:text-white text-primaryalpha"
                    >
                      <PiCaretLeft size={18} />
                      <span className="text-sm font-medium">Back</span>
                    </button>
                  </motion.div>
                </div>
                <button onClick={handleHamburger}>
                  <PiX size={20} className="dark:text-white" />
                </button>
              </div>

              {/*Body Section  */}
              <div className="relative flex-1 w-full h-full">
                {/*Main Menu Section*/}
                <motion.div
                  className={`absolute w-full h-full px-4 py-[18px] ${
                    subMenuOpen
                      ? "bg-slate-200 dark:bg-dark3Soft"
                      : "bg-white dark:bg-[#1b1b1b]"
                  }`}
                  variants={mainMenuVariants}
                  initial="open"
                  animate={subMenuOpen ? "closed" : "open"}
                >
                  <div className="flex flex-col w-full h-full gap-4">
                    <p className="text-sm font-medium uppercase text-grey dark:text-darkText">
                      Main Menu
                    </p>
                    <ul className="flex flex-col gap-3">
                      {navData[0].topmenu.map(
                        (menu, index) =>
                          loginData.userData.permissions
                            .map(Number)
                            .includes(menu.menuId) && (
                            <>
                              <li
                                key={index}
                                onClick={() =>
                                  handleSetSubmenu(menu, menu.submenus)
                                }
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="size-11 rounded-lg border border-black/5 bg-[#F6F9FB] dark:bg-dark3 vhcenter text-[21px] text-[#7E8490]">
                                    {menu.icon}
                                  </div>
                                  <p className="text-base font-medium dark:text-white">
                                    {menu.title}
                                  </p>
                                </div>
                                <PiCaretRight size={20} />
                              </li>
                              {navData[0].topmenu.length - 1 !== index &&
                                loginData.userData.permissions
                                  .map(Number)
                                  .includes(menu.menuId) && (
                                  <div className="w-full border-t border-dashed border-black/10 dashed dark:border-dark3" />
                                )}
                            </>
                          )
                      )}
                    </ul>
                  </div>
                </motion.div>

                {/*Sub Menu Section*/}
                <motion.div
                  className="absolute w-full h-full px-4 py-[18px] bg-white dark:bg-[#1b1b1b] "
                  variants={subMenuVariants}
                  initial="closed"
                  animate={subMenuOpen ? "open" : "closed"}
                >
                  <div className="flex flex-col w-full h-full gap-4 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-w-1.5 scrollbar-thumb-[#E1E0E5] scrollbar-track-transparent overflow-y-scroll">
                    {/* ACTIVE MENU FROM THE MAIN MENU SECTION */}
                    <p className="text-sm font-medium uppercase text-primaryalpha dark:text-darkText">
                      {activeMenu}
                    </p>
                    <ul className="flex flex-col gap-8">
                      {subMenu &&
                        subMenu.map(
                          (menu, index) =>
                            loginData.userData.permissions?.filter((each) =>
                              menu.menuId?.includes(parseInt(each))
                            ).length > 0 && (
                              <div key={index} className="flex flex-col gap-5">
                                {/* SUBMENU TITLE  */}
                                <p className="text-xs font-medium uppercase text-grey dark:text-darkText">
                                  {menu.title}
                                </p>
                                {/* SUBMENUS  */}
                                <div className="flex flex-col gap-4">
                                  {menu.subMenu &&
                                    menu.subMenu.map(
                                      (subMenus, index) =>
                                        loginData.userData.permissions
                                          .map(Number)
                                          .includes(subMenus.menuId) && (
                                          <li
                                            key={index}
                                            className=""
                                            onClick={handleHamburger}
                                          >
                                            <Link
                                              to={subMenus.link}
                                              className="flex items-center gap-2"
                                            >
                                              <p className="text-[20px] opacity-80 dark:text-white">
                                                {subMenus.icon}
                                              </p>
                                              <p className="text-sm dark:text-white">
                                                {subMenus.title}
                                              </p>
                                            </Link>
                                          </li>
                                        )
                                    )}
                                </div>
                              </div>
                            )
                        )}
                    </ul>
                  </div>
                </motion.div>
              </div>

              {/* Menu Footer Section  */}
              <div className="px-4 py-[18px] border-t border-black/10 dark:border-dark3 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Avatar
                    name={
                      employeeData?.firstName + " " + employeeData?.lastName
                    }
                    image={employeeData?.profilePicture}
                    className="border-2 border-white shadow-lg dark:border-dark3 size-11"
                  />
                  <div className="overflow-hidden">
                    <p className="text-lg font-medium leading-none truncate dark:text-white">
                      {employeeData?.firstName + " " + employeeData?.lastName}
                    </p>
                    <p className="text-sm font-medium text-grey dark:text-darkText">
                      {employeeData?.designation}
                    </p>
                  </div>
                </div>
                <ButtonClick
                  handleSubmit={showModal}
                  buttonName={"Logout"}
                  BtnType="primary"
                  icon={<PiSignOut size={18} />}
                  iconPosition="end"
                  danger
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL FOR CONFIRMATION OF LOGOUT  */}
      <ModalAnt
        isVisible={open}
        onClose={handleCancel}
        title="Basic Modal"
        okText={"Logout Now"}
        cancelText="Not Now"
        width="435px"
        showOkButton={true}
        showCancelButton={true}
        showTitle={false}
        centered={true}
        showCloseButton={true}
        okButtonClass="w-full"
        cancelButtonClass="w-full"
        onOk={handleOk}
        okButtonDanger={true}
        dangerAlert={true}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center px-11 py-7">
          <img
            src={Logout}
            alt="Img"
            className="w-[70px] h-[65px] 2xl:w-[85px] 2xl:h-[80px]"
          />
          <h4 className="mb-0 text-base font-semibold 2xl:text-xl">
            Confirm Logout?
          </h4>
          <p className="text-xs italic font-medium 2xl:text-sm text-grey">
            Are you sure you want to logout?
          </p>
        </div>
      </ModalAnt>
    </>
  );
};

import React, { useEffect, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import API, { action } from "../Api";
import Logout from "../../assets/images/Logout.svg";

import { Divider, Dropdown, theme } from "antd";
import ButtonClick from "../common/Button";
import { PiPalette, PiQuestion, PiSignOut, PiUser } from "react-icons/pi";
import ModalAnt from "../common/ModalAnt";
import Avatar from "../common/Avatar";
import localStorageData from "../common/Functions/localStorageKeyValues";

const encryptActionID = (actionID) => {
  return btoa(actionID?.toString());
};

const { useToken } = theme;

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [employeeList, setemployeeList] = useState([]); //EMPLOYEE LIST
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const encryptedActionID = encryptActionID(localStorageData.employeeId);
  const items = [
    {
      key: 1,
      label: <Link to={`/myProfile/${encryptedActionID}`}>View Profile</Link>,
      icon: <PiUser size={18} />,
    },
    {
      key: 2,
      label: <Link to="/Appearance">Appearance</Link>,
      icon: <PiPalette size={18} />,
    },
    {
      key: 3,
      label: <Link to="/subscriptions">Subscription</Link>,
      icon: <PiPalette size={18} />,
    },
    {
      key: 4,
      label: <Link to="/help-support">Help & Support</Link>,
      icon: <PiQuestion size={18} />,
    },
  ];
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
  useEffect(() => {
    window.addEventListener("profileUpdated", getEmployee);

    return () => {
      window.removeEventListener("profileUpdated", getEmployee);
    };
  }, []);
  const getEmployee = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ID_BASED_RECORDS, {
        id: employeeId,
      });
      setemployeeList(result.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmployee();
  }, []);

  const { token } = useToken();
  const contentStyle = {
    width: "272px",
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow:
      "0px 25.6px 40.229px 0px rgba(6, 6, 6, 0.10), 0px 25.6px 40.229px 0px rgba(6, 6, 6, 0.10)",
  };
  const menuStyle = {
    boxShadow: "none",
  };

  return (
    <>
      <Dropdown
        placement="bottomLeft"
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            <div className="p-2">
              <div className="flex items-center h-full gap-2 dark:text-white ">
                <Avatar
                  image={employeeList?.profilePicture}
                  name={employeeList?.firstName}
                  alt={
                    employeeList?.firstName?.charAt(0).toUpperCase() +
                    employeeList?.firstName?.slice(1) +
                    " " +
                    employeeList?.lastName?.charAt(0).toUpperCase() +
                    employeeList?.lastName?.slice(1)
                  }
                  className=" size-[33px] 2xl:size-[43px]"
                />
                <div className="flex flex-col justify-start gap-1 leading-none">
                  <p className="text-sm font-semibold 2xl:text-base ">
                    {employeeList?.firstName?.charAt(0).toUpperCase() +
                      employeeList?.firstName?.slice(1) +
                      " " +
                      employeeList?.lastName?.charAt(0).toUpperCase() +
                      employeeList?.lastName?.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500 2xl:text-sm">
                    {employeeList?.email}
                  </p>
                </div>
              </div>
            </div>
            <Divider
              style={{
                margin: 0,
              }}
            />

            {React.cloneElement(menu, {
              style: menuStyle,
            })}

            <div className="p-2">
              <ButtonClick
                className="w-full"
                BtnType="primary"
                danger
                icon={<PiSignOut size={20} />}
                handleSubmit={showModal}
                buttonName="Log Out"
              ></ButtonClick>
            </div>
          </div>
        )}
        menu={{
          items,
          selectable: true,
        }}
        className="cursor-pointer "
      >
        <a onClick={(e) => e.preventDefault()}>
          {employeeList?.firstName && (
            <div className="flex items-center h-full  gap-2 2xl:p-1 px-1 py-0.5 text-black rounded-full justify-evenly bg-secondaryWhite dark:bg-dark2 dark:text-white ">
              <div className="overflow-hidden rounded-full size-7 2xl:size-8">
                {employeeList?.profilePicture ? (
                  <img
                    className="object-cover object-center w-full h-full"
                    src={employeeList?.profilePicture}
                    alt={employeeList?.firstName + " " + employeeList?.lastName}
                  />
                ) : (
                  <p className="flex items-center justify-center object-cover h-full p-2 text-white bg-primaryalpha ">
                    {employeeList?.firstName?.charAt(0).toUpperCase()}
                  </p>
                )}
              </div>
              <div className="flex-col justify-start hidden leading-none xl:flex">
                <p className="text-xs font-medium 2xl:text-sm truncate w-[127px]">
                  {employeeList?.firstName?.charAt(0).toUpperCase() +
                    employeeList?.firstName?.slice(1) +
                    " " +
                    employeeList?.lastName?.charAt(0).toUpperCase() +
                    employeeList?.lastName?.slice(1)}
                </p>
                <p className="text-[8px] 2xl:text-[10px]">
                  {employeeList?.email}
                </p>
              </div>
              <RiArrowDownSLine className="hidden text-xl ltr:pr-2 rtl:pl-2 xl:flex 2xl:text-2xl" />
            </div>
          )}
        </a>
      </Dropdown>

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

export default ProfileDropdown;

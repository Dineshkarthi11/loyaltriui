import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import CheckBoxInput from "../../common/CheckBoxInput";
import API, { action } from "../../Api";
import { NoData } from "../../common/SVGFiles";

import Biometric from "../../../assets/images/userPrivileges/Biometric.png";
import Approval from "../../../assets/images/userPrivileges/Approval.png";
import GeoFencing from "../../../assets/images/userPrivileges/GeoFencing.png";
import Normal from "../../../assets/images/userPrivileges/Normal.png";
import QrCode from "../../../assets/images/userPrivileges/QrCode.png";
import Selfie from "../../../assets/images/userPrivileges/Selfie.png";
import NotRequired from "../../../assets/images/userPrivileges/NotRequired.png";
import WebPunch from "../../../assets/images/userPrivileges/WebPunch.png";

import { useNotification } from "../../../Context/Notifications/Notification";
import Avatar from "../../common/Avatar";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function UserList({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
  data,
}) {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const [accessListData, setAccessListData] = useState([]);

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

  const getPunchMethod = async () => {
    try {
      const result = await action(API.GET_PUNCH_METHOD, {
        companyId: companyId,
        isActive: 1,
      });
      if (result.status === 200) {
        setAccessListData(
          result.result.map((each) => ({
            id: each?.punchMethodId,

            label: each?.punchMethod,

            value: each?.punchMethod,
            logo:
              each.punchMethodId === 1
                ? NotRequired
                : each.punchMethodId === 2
                ? WebPunch
                : each.punchMethodId === 3
                ? Selfie
                : each.punchMethodId === 4
                ? GeoFencing
                : each.punchMethodId === 5
                ? Normal
                : each.punchMethodId === 6
                ? QrCode
                : each.punchMethodId === 7
                ? Biometric
                : each.punchMethodId === 8 && Approval,

            assign: false,
          }))
        );

        try {
          const resultEmployeePunchMethod = await action(
            API.GET_EMPLOYEE_PUNCH_METHODS_LIST,
            {
              companyId: companyId,
              employeeId: updateId,
            }
          );
          setAccessListData(
            result.result.map((each) => ({
              id: each?.punchMethodId,

              label: each?.punchMethod,

              value: each?.punchMethod,
              logo:
                each.punchMethodId === 1
                  ? NotRequired
                  : each.punchMethodId === 2
                  ? WebPunch
                  : each.punchMethodId === 3
                  ? Selfie
                  : each.punchMethodId === 4
                  ? GeoFencing
                  : each.punchMethodId === 5
                  ? Normal
                  : each.punchMethodId === 6
                  ? QrCode
                  : each.punchMethodId === 7
                  ? Biometric
                  : each.punchMethodId === 8 && Approval,
              assign: resultEmployeePunchMethod?.result?.punchMethodId.includes(
                each.punchMethodId
              ),
            }))
          );
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      openNotification("error", "Failed", error);
    }
  };

  useEffect(() => {
    getPunchMethod();
  }, []);
  const handleToggleList = (id, checked) => {
    if (id === 0) {
      setAccessListData((prevSwitches) =>
        prevSwitches?.map((sw) => ({ ...sw, assign: checked }))
      );
    } else {
      setAccessListData((prevSwitches) =>
        prevSwitches?.map((sw) =>
          sw?.id === id ? { ...sw, assign: checked } : sw
        )
      );
    }
  };

  const savePunchInMethod = async () => {
    try {
      const result = await action(API.SAVE_PUNCHIN_METHOD, {
        companyId: companyId,
        employeeId: updateId,
        punchMethodId: accessListData
          ?.map((sw) => sw?.assign && sw.id)
          ?.filter((data) => parseInt(data)),
        createdBy: employeeId,
      });
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        openNotification("error", "Failed", result.message);
      }
    } catch (error) {
      openNotification("error", "Failed", error);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
      }}
      contentWrapperStyle={{
        maxWidth: "540px",
      }}
      handleSubmit={(e) => {
        console.log(e);
        savePunchInMethod();
      }}
      updateBtn={isUpdate}
      updateFun={() => {}}
      header={["Assign Attendance Methods", "Assign Attendance Methods"]}
      footerBtn={[t("Cancel"), t("Save")]}
    >
      <div className=" flex flex-col gap-6 ">
        <div className=" flex flex-col gap-2">
          <p className="text-grey font-medium text-[10px] 2xl:text-xs">
            Employee
          </p>
          <div className="flex justify-start items-center gap-2">
            <Avatar
              image={data?.profilePicture}
              name={data?.firstName}
              className="border-2 border-white size-10 2xl:size-12"
            />
            <div className="flex flex-col gap-0.5 2xl:gap-1">
              <p className=" h2">{data?.fullName}</p>
              <p className=" para">Emp Code : #{data?.code}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-medium text-sm 2xl:text-base">
            Manual Attendance Methods
          </div>
          {accessListData?.length > 0 ? (
            accessListData?.map((each, index) => (
              <div
                key={index}
                className={`flex justify-between items-center ${
                  each?.assign ? "border-primary" : ""
                } borderb p-1.5 rounded-lg cursor-pointer h-[60px] 2xl:h-[68px]`}
                onClick={() => {
                  handleToggleList(each?.id, !each?.assign);
                }}
              >
                <div className="flex items-center gap-3 h-full">
                  <div
                    className={`vhcenter h-full w-[55px] 2xl:w-[65px] rounded-md ${
                      each?.assign
                        ? "bg-primaryalpha/15 dark:bg-primaryalpha/30"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <img
                      src={each?.logo}
                      alt=""
                      className="size-8 2xl:size-10"
                    />
                  </div>
                  <div className=" flex flex-col gap-0.5">
                    <div className="font-medium text-xs 2xl:text-sm">
                      {each?.label}
                    </div>
                  </div>
                </div>
                <CheckBoxInput
                  change={(e) => {
                    handleToggleList(each?.id, e);
                  }}
                  value={each?.assign}
                />
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </DrawerPop>
  );
}

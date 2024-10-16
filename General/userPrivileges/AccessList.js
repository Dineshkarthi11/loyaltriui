import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import SearchBox from "../../common/SearchBox";
import { LuSearch } from "react-icons/lu";
import CheckBoxInput from "../../common/CheckBoxInput";
import API, { action } from "../../Api";
import { NoData } from "../../common/SVGFiles";
import { PiPlusCircle, PiXBold } from "react-icons/pi";
import MultiSelectDropDown from "../../common/MultiSelectDropDown";
import Avatar from "../../common/Avatar";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function AccessList({
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
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.companyId);
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const [searchValue, setSarchValue] = useState();
  const [searchData, setSearchData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [allSelect, setAllSelect] = useState(false);
  const [punchDevice, setPunchDevice] = useState([]);

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 500),
    [show]
  );

  const getEmployee = async () => {
    setLoading(true);
    try {
      const result = await action(API.GET_EMPLOYEE, {
        companyId: companyId,
        isActive: 1,
      });
      if (result.status === 200) {
        setLoading(false);

        setEmployeeList(
          result.result?.map((each) => ({
            id: each?.employeeId,
            profilepicture: each?.profilePicture,
            label: each?.fullName,
            empcode: each?.code,
            value: each?.email,
            punchDevice: null,

            assign: false,
          }))
        );
        setSearchData(
          result.result?.map((each) => ({
            id: each?.employeeId,
            profilepicture: each?.profilePicture,
            label: each?.fullName,
            empcode: each?.code,
            value: each?.email,
            punchDevice: null,

            assign: false,
          }))
        );
        try {
          const resultPunchMethodEmployee = await action(
            API.GET_PUNCH_METHOD_EMPLOYEE_LIST,
            {
              companyId: companyId,
              punchMethodId: updateId,
            }
          );

          if (resultPunchMethodEmployee.result?.employeeId?.length > 0) {
            setEmployeeList(
              result.result?.map((each) => ({
                id: each?.employeeId,
                profilepicture: each?.profilePicture,
                label: each?.fullName,
                value: each?.designation,
                empcode: each?.code,
                punchDevice:
                  parseInt(updateId) === 7
                    ? resultPunchMethodEmployee.result?.employeeId
                        .map(
                          (item) =>
                            item.employeeId === each.employeeId && item.deviceId
                        )
                        .filter((data) => data)[0]
                    : null,
                assign:
                  parseInt(updateId) === 7
                    ? resultPunchMethodEmployee.result?.employeeId
                        .map((item) => item.employeeId === each.employeeId)
                        .filter((data) => data)[0]
                    : resultPunchMethodEmployee?.result?.employeeId.includes(
                        each.employeeId
                      ),
              }))
            );
            setSearchData(
              result.result?.map((each) => ({
                id: each?.employeeId,
                profilepicture: each?.profilePicture,
                label: each?.fullName,
                value: each?.designation,
                empcode: each?.code,
                punchDevice:
                  parseInt(updateId) === 7
                    ? resultPunchMethodEmployee.result?.employeeId
                        .map(
                          (item) =>
                            item.employeeId === each.employeeId && item.deviceId
                        )
                        .filter((data) => data)[0]
                    : null,
                assign:
                  parseInt(updateId) === 7
                    ? resultPunchMethodEmployee.result?.employeeId
                        .map((item) => item.employeeId === each.employeeId)
                        .filter((data) => data)[0]
                    : resultPunchMethodEmployee?.result?.employeeId.includes(
                        each.employeeId
                      ),
              }))
            );
          }
        } catch (error) {
          openNotification("error", "Failed", error);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getPunchDeviceById = async () => {
    try {
      const result = await action(API.GET_ALL_PUNCH_DEVICE, {
        // companyId: companyId,
        isActive: 1,
      });
      if (result.status === 200) {
        setPunchDevice(
          result.result?.map((each) => ({
            label: each.deviceName,
            value: each.punchDeviceId,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
    getPunchDeviceById();
  }, []);

  const handleToggleList = (id, checked) => {
    if (id === 0) {
      setEmployeeList((prevSwitches) =>
        prevSwitches?.map((sw) => ({ ...sw, assign: checked }))
      );
      setSearchData((prevSwitches) =>
        prevSwitches?.map((sw) => ({ ...sw, assign: checked }))
      );
    } else {
      setEmployeeList((prevSwitches) =>
        prevSwitches?.map((sw) =>
          sw?.id === id ? { ...sw, assign: checked } : sw
        )
      );
      setSearchData((prevSwitches) =>
        prevSwitches?.map((sw) =>
          sw?.id === id ? { ...sw, assign: checked } : sw
        )
      );
    }
  };
  const dropDownChange = (id, employeeId) => {
    setEmployeeList((prevSwitches) =>
      prevSwitches?.map((sw) =>
        sw?.id === employeeId ? { ...sw, punchDevice: id } : sw
      )
    );

    setSearchData((prevSwitches) =>
      prevSwitches?.map((sw) =>
        sw?.id === employeeId ? { ...sw, punchDevice: id } : sw
      )
    );
  };

  const saveEmployeePunchInMethod = async () => {
    setLoading(true);
    try {
      const result = await action(API.SAVE_EMPLOYEE_PUNCHIN_METHOD, {
        companyId: companyId,
        punchMethodId: updateId,
        employeeId: employeeList
          ?.map(
            (sw) =>
              sw?.assign && {
                employeeId: sw.id,
                punchDeviceIds: sw.punchDevice,
              }
          )
          ?.filter((data) => data),

        createdBy: employeeId,
      });
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          setShow(false);
          setLoading(false);
        }, 1000);
      } else {
        openNotification("error", "Failed", result.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        setShow(e);
      }}
      contentWrapperStyle={{
        maxWidth: "540px",
      }}
      handleSubmit={(e) => {
        saveEmployeePunchInMethod();
      }}
      updateBtn={isUpdate}
      updateFun={() => {}}
      header={["Attendence Access", "Attendence Access"]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <div className=" flex flex-col gap-6 ">
        <div className="flex justify-between items-center">
          <p className="h2">Select Employees</p>
          <p className=" text-primary ">
            Employees{" (" + employeeList?.length + ")"}{" "}
          </p>
        </div>
        <SearchBox
          placeholder={`Search..`}
          value={searchValue}
          change={(e) => {
            setSarchValue(e);
          }}
          icon={<LuSearch className="text-[15px]" />}
          data={employeeList}
          onSearch={(value) => {
            setSearchData(value);
          }}
        />
        <div className="flex justify-start items-center">
          <CheckBoxInput
            titleRight="Select All"
            change={(e) => {
              handleToggleList(0, e);
              setAllSelect(e);
            }}
            value={allSelect}
          />
        </div>
        <div className=" flex flex-col gap-6">
          {searchData?.length !== 0 ? (
            searchData?.map((each) => (
              <div
                className={`flex flex-col gap-3 borderb rounded-md p-3 ${
                  each.assign == true
                    ? "bg-primaryalpha/5 dark:bg-primaryalpha/10 !border-transparent"
                    : ""
                } transition-all duration-300`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar
                      image={each.profilepicture}
                      name={each.label}
                      className="size-9 2xl:size-11"
                    />
                    <div className="flex flex-col">
                      <p className="pblack font-semibold">
                        {each.label?.charAt(0).toUpperCase() +
                          each.label?.slice(1)}
                      </p>
                      <p className="pblack !text-grey">
                        EMP Code: #{each.empcode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {each.assign && parseInt(updateId) === 7 ? (
                      <MultiSelectDropDown
                        options={punchDevice}
                        rightIcon={true}
                        menuclass={"w-[200px]"}
                        // onChange={handleDropdownChange}
                        onChange={(e) => {
                          dropDownChange(e, each.id);
                        }}
                        value={each.punchDevice}
                      >
                        <p className="text-grey flex items-center gap-1">
                          <PiPlusCircle size={16} />{" "}
                          <span className="text-sm lg:text-xs 2xl:text-sm">
                            Add access
                          </span>
                        </p>
                      </MultiSelectDropDown>
                    ) : null}
                    <CheckBoxInput
                      change={(e) => {
                        handleToggleList(each.id, e === 1 ? true : false);
                      }}
                      value={each.assign}
                    />
                  </div>
                </div>
                {each.assign && parseInt(updateId) === 7 ? (
                  <>
                    <div className={each.punchDevice ? "divider-h" : ""} />
                    <div className="flex gap-1.5 flex-wrap">
                      {punchDevice?.map(
                        (item) =>
                          each.punchDevice?.some(
                            (value) => parseInt(value) === parseInt(item.value)
                          ) && (
                            <div className=" bg-gray-100 px-2 py-0.5 rounded-full flex gap-1 items-center">
                              <span className="text-gray-700 text-xs font-medium">
                                {item.label}
                              </span>
                              <span className="cursor-pointer">
                                <PiXBold className="text-gray-500" size={12} />
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </>
                ) : null}
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

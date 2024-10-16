import React, { useEffect, useMemo, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import CheckBoxInput from "../common/CheckBoxInput";
import SearchBox from "../common/SearchBox";
import { LuSearch } from "react-icons/lu";
import API, { action } from "../Api";
import Avatar from "../common/Avatar";
import { useNotification } from "../../Context/Notifications/Notification";
import { NoData } from "../common/SVGFiles";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function AssignUserRole({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
  data,
}) {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [roleList, setRoleList] = useState([]);
  const [searchValue, setSarchValue] = useState();
  const [isAnyChecked, setIsAnyChecked] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [employeeSearchData, setEmployeeSearchData] = useState(data);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getRole = async () => {
    const result = await action(API.GET_ALL_ROLELIST, {
      id: companyId,
    });
    console.log(result);
    const activeRoles = result.result?.filter(
      (each) => parseInt(each.isActive) === 1
    );
    // console.log(activeRoles,"active")
    setRoleList(
      activeRoles.map((each) => ({
        id: each.roleId,
        label: each.roleName,
        value: each.roleName,
        assign: data.roles?.some(
          (item) => parseInt(each.roleId) === item.roleId
        ),
      }))
    );
    setEmployeeSearchData(
      activeRoles.map((each) => ({
        id: each.roleId,
        label: each.roleName,
        value: each.roleName,
        assign: data.roles?.some(
          (item) => parseInt(each.roleId) === item.roleId
        ),
      }))
    );
  };
  useEffect(() => {
    getRole();
  }, [data]);
  useEffect(() => {
    setRoleList(searchData);

    console.log(searchData);
  }, [searchData]);

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

  const assignRole = async (e) => {
    setLoading(true);
    try {
      const result = await action(API.ASSIGN_USER_ROLE, {
        id: updateId,
        roleId: roleList
          .map((each) => each.assign && each.id)
          .filter((data) => data),
        employeeId: data.employeeId,
        isActive: "1",
        createdBy: employeeId,
      });
      console.log(result);
      if (result.status === 200) {
        openNotification("success", "Successful", result.message);
        setTimeout(() => {
          handleClose();
          setLoading(false);
          // refresh();
        }, 1000);
      } else {
        openNotification("error", "Failed...", result.message);
        setLoading(false);
      }
    } catch (error) {
      openNotification("error", "Failed...", error);
      setLoading(false);
    }
  };

  const handleToggleList = (id, checked) => {
    setRoleList((prevSwitches) => {
      const updatedRoles = prevSwitches?.map((sw) =>
        sw?.id === id ? { ...sw, assign: checked } : sw
      );
      const anyChecked = updatedRoles.some((role) => role.assign);
      setIsAnyChecked(anyChecked);
      return updatedRoles;
    });
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose(e);
      }}
      contentWrapperStyle={{
        maxWidth: "540px",
      }}
      handleSubmit={(e) => {
        if (isAnyChecked) {
          assignRole();
        } else {
          openNotification(
            "warning",
            "Info",
            "Please select at least one role."
          );
        }
      }}
      updateBtn={isUpdate}
      updateFun={() => {}}
      header={["Assign Roles", "Assign Roles"]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <div className=" flex flex-col gap-4">
        <div className=" flex flex-col gap-2">
          <p className="text-grey text-[10px] 2xl:text-xs font-medium">
            Employee
          </p>
          <div className="flex justify-start items-center gap-2">
            <Avatar
              image={data?.profilePicture}
              name={data?.employeeName}
              className="border-2 border-white size-10 2xl:size-11"
            />
            <div className="flex flex-col gap:0.5 2xl:gap-1">
              <div className="font-semibold text-xs 2xl:text-sm">
                {data?.employeeName?.charAt(0).toUpperCase() +
                  data?.employeeName?.slice(1)}
              </div>
              <div className="text-grey text-[10px] 2xl:text-xs">
                {"Emp Code :# " + data?.code}
              </div>
            </div>
          </div>
        </div>
        <SearchBox
          placeholder={`Search..`}
          value={searchValue}
          change={(e) => {
            console.log(e);
            setSarchValue(e);
          }}
          icon={<LuSearch className="text-[20px]" />}
          data={employeeSearchData}
          onSearch={(value) => {
            console.log(value);
            setSearchData(value);
          }}
        />
        <div className="flex flex-col gap-6">
          <h1 className="font-semibold text-sm 2xl:text-base">Roles</h1>
          <div className="flex flex-col gap-3 ">
            {roleList?.length > 0 ? (
              roleList?.map((each, index) => (
                <div
                  key={index}
                  className={`flex gap-1 items-center cursor-pointer `}
                  onClick={() => {
                    handleToggleList(each?.id, !each?.assign);
                  }}
                >
                  <CheckBoxInput
                    change={(e) => {
                      handleToggleList(each?.id, e);
                    }}
                    value={each?.assign}
                  />

                  <div className="flex items-center gap-3">
                    <div className=" flex flex-col gap-0.5">
                      <h1
                        className={`font-medium text-[10px] 2xl:text-xs rounded-2xl bg-gray-100 px-2 py-0.5 w-fit ${
                          each?.assign ? "text-primary" : ""
                        } `}
                      >
                        {each?.label}
                      </h1>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </div>
    </DrawerPop>
  );
}

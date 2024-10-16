import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import users from "../../../assets/images/userPrivileges/users3d.png";
import noaccess from "../../../assets/images/userPrivileges/noaccess3d.png";
import staff from "../../../assets/images/userPrivileges/staff3d.png";
import DrawerPop from "../../common/DrawerPop";
import SearchBox from "../../common/SearchBox";
import CheckBoxInput from "../../common/CheckBoxInput";
import API, { action } from "../../Api";
import { getEmployeeList } from "../../common/Functions/commonFunction";
import Avatar from "../../common/Avatar";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function SalaryDetailModal({
  open,
  close = () => {},
  accessDetails,
  header,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [selectedCardType, setSelectedCardType] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [employee, setEmployee] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 500),
    [show]
  );

  const handleClose = () => {
    setShow(false);
    setSelectedCardType("");
  };

  const checkAll = employee?.length === selectedEmployees?.length;

  const handleIndividual = (employeeId) => {
    const isSelected = selectedEmployees?.includes(employeeId);
    if (isSelected) {
      setSelectedEmployees(
        selectedEmployees?.filter((id) => id !== employeeId)
      );
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allEmployeeIds = employee?.map((each) => each.id);
      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const getEmployee = async () => {
    const employeelist = await getEmployeeList();
    setEmployee(
      employeelist?.map((each) => ({
        id: parseInt(each.employeeId),
        name: each.fullName,
        empid: each.code,
        avatar: each.profilePicture,
      }))
    );
    setSearchEmployee(
      employeelist?.map((each) => ({
        id: parseInt(each.employeeId),
        name: each.fullName,
        empid: each.code,
        avatar: each.profilePicture,
      }))
    );
  };

  const getSpecialAccessListById = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_SALARY_DETAILS_ACCESS, {
        companyId: companyId,
        specialAccessDetails: accessDetails,
      });
      setSelectedCardType(parseInt(result.result?.type));
      if (result.result?.employees?.length > 0)
        setSelectedEmployees(
          result.result?.employees?.map((each) => parseInt(each.employeeId))
        );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
    getSpecialAccessListById();
  }, []);

  const saveSalaryDetailsAccess = async () => {
    setLoading(true);
    try {
      if (
        (selectedEmployees?.length > 0 && parseInt(selectedCardType) === 2) ||
        parseInt(selectedCardType) !== 2
      ) {
        const result = await action(API.SAVE_EMPLOYEE_SALARY_DETAILS_ACCESS, {
          companyId: companyId,
          specialAccessType: parseInt(selectedCardType),
          specialAccessDetails: accessDetails,
          empolyeeId: selectedEmployees || [],
        });
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            setShow(false);
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Info", result.message);
        }
      } else {
        openNotification("error", "Info", "Please select any employees.");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      openNotification("error", "Failed", error.message);
      setLoading(false);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      contentWrapperStyle={{
        maxWidth: "590px",
      }}
      header={header}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
      handleSubmit={() => {
        saveSalaryDetailsAccess();
      }}
    >
      <div className="flex flex-col gap-5">
        <p className="font-medium text-sm 2xl:text-base">
          {accessDetails === "salaryAccess"
            ? "Salary Detail Access"
            : accessDetails === "workEntryAccess"
            ? "Work Entry Access"
            : "Expense Reimbursement"}
        </p>
        <div className="grid grid-cols-2 gap-5">
          {/* card 1 */}
          <div
            className={`relative borderb rounded-xl p-2 hover:bg-primaryalpha/10 cursor-pointer transition duration-300'
                        ${selectedCardType === 1 ? "!border-primary" : ""}`}
            onClick={() => {
              setSelectedCardType(1);
              setSelectedEmployees([]);
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-16 w-16 rounded-md vhcenter shrink-0 ${
                  selectedCardType === 1 ? "bg-primaryalpha/5" : "bg-gray-100"
                }`}
              >
                <img
                  src={users}
                  alt="img"
                  className={`h-10 w-10 ${
                    selectedCardType === 1 ? "" : "saturate-0"
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-xs 2xl:text-sm">All Staff</p>
                <p className="font-medium text-grey text-[10px] 2xl:text-xs">
                  All employee can access.
                </p>
              </div>
            </div>

            <div
              className={`${selectedCardType === 1 && "border-primary"} 
                                border  rounded-full absolute right-2 top-2`}
            >
              <div
                className={`font-semibold text-base w-4 h-4 border-2 border-white 
                                dark:border-white/10 rounded-full
                                 ${
                                   selectedCardType === 1 &&
                                   "text-primary bg-primary"
                                 } 
                                    `}
              ></div>
            </div>
          </div>
          {/* card 2 */}
          <div
            className={`relative borderb rounded-xl p-2 hover:bg-primaryalpha/10 cursor-pointer transition duration-300
                         ${selectedCardType === 3 ? "!border-primary" : ""}`}
            onClick={() => {
              setSelectedCardType(3);
              setSelectedEmployees([]);
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-16 w-16 rounded-md vhcenter shrink-0 ${
                  selectedCardType === 3 ? "bg-primaryalpha/5" : "bg-gray-100"
                }`}
              >
                <img
                  src={noaccess}
                  alt="img"
                  className={`h-10 w-10 ${
                    selectedCardType === 3 ? "" : "saturate-0"
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-xs 2xl:text-sm">No Access</p>
                <p className="font-medium text-grey text-[10px] 2xl:text-xs">
                  All employee access denied.
                </p>
              </div>
            </div>

            <div
              className={`${selectedCardType === 3 && "border-primary"} 
                                border  rounded-full absolute right-2 top-2`}
            >
              <div
                className={`font-semibold text-base w-4 h-4 border-2 border-white 
                                dark:border-white/10 rounded-full
                                 ${
                                   selectedCardType === 3 &&
                                   "text-primary bg-primary"
                                 } 
                                    `}
              ></div>
            </div>
          </div>
        </div>
        {/* card 3 */}
        <div
          className={`relative borderb rounded-xl p-2 hover:bg-primaryalpha/10 cursor-pointer transition duration-300'
                     ${selectedCardType === 2 ? "!border-primary" : ""}`}
          onClick={() => {
            setSelectedCardType(2);
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-16 w-16 rounded-md vhcenter shrink-0 ${
                selectedCardType === 2 ? "bg-primaryalpha/5" : "bg-gray-100"
              }`}
            >
              <img
                src={staff}
                alt="img"
                className={`h-10 w-10 ${
                  selectedCardType === 2 ? "" : "saturate-0"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-medium text-xs 2xl:text-sm">
                Only Selected Staff
              </p>
              <p className="font-medium text-grey text-[10px] 2xl:text-xs">
                Selected Employee can access.
              </p>
            </div>
          </div>

          <div
            className={`${selectedCardType === 2 && "border-primary"} 
                                border  rounded-full absolute right-2 top-2`}
          >
            <div
              className={`font-semibold text-base w-4 h-4 border-2 border-white 
                                dark:border-white/10 rounded-full
                                 ${
                                   selectedCardType === 2 &&
                                   "text-primary bg-primary"
                                 } 
                                    `}
            ></div>
          </div>
        </div>
        {selectedCardType === 2 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm 2xl:text-base">
                Select Employees
              </p>
              <p className="font-medium text-sm 2xl:text-base text-primary">
                {selectedEmployees?.length} selected
              </p>
            </div>
            <SearchBox
              placeholder="Search Employee"
              value={searchValue}
              data={searchEmployee}
              change={(e) => {
                setSearchValue(e);
              }}
              onSearch={(e) => {
                setEmployee(e);
              }}
            />
            <div className="flex justify-start">
              <CheckBoxInput
                titleRight="Select All"
                value={checkAll}
                change={handleSelectAllChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              {employee?.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between hover:bg-primaryalpha/10 dark:hover:bg-primaryalpha/20 rounded-md transform duration-300 ${
                    selectedEmployees?.includes(item.id)
                      ? "bg-primaryalpha/5 dark:bg-primaryalpha/15"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2 p-3">
                    <Avatar name={item.name} image={item.avatar} />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-xs 2xl:text-sm">
                        {item.name?.charAt(0).toUpperCase() +
                          item.name?.slice(1)}
                      </p>
                      <p className="text-xs 2xl:text-sm text-grey">
                        {"Emp Code: " + item.empid}
                      </p>
                    </div>
                  </div>
                  <CheckBoxInput
                    value={selectedEmployees?.includes(item.id)}
                    change={() => handleIndividual(item.id)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </DrawerPop>
  );
}

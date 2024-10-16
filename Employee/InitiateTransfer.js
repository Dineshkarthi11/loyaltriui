/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import avatars from "../../assets/images/avatar-image.png";
import { getEmployeeList } from "../common/Functions/commonFunction";
import DrawerPop from "../common/DrawerPop";
import Stepper from "../common/Stepper";
import Heading2 from "../common/Heading2";
import SearchBox from "../common/SearchBox";
import Avatar from "../common/Avatar";
import ModalAnt from "../common/ModalAnt";
import DateSelect from "../common/DateSelect";
import FormInput from "../common/FormInput";
import { GoArrowRight } from "react-icons/go";
import Heading from "../common/Heading";
import user from "../../assets/images/user1.jpeg";
import { BsPersonLock } from "react-icons/bs";
import Dropdown from "../common/Dropdown";
import TabsNew from "../common/TabsNew";
import Heading3 from "../common/Heading3";
import MultiSelect from "../common/MultiSelect";
import TextArea from "../common/TextArea";
import FileUpload from "../common/FileUpload";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { PiHourglassMediumLight } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { TbRoad } from "react-icons/tb";
import { SlGlobe } from "react-icons/sl";
import CustomSelect from "../common/CustomSelect";
import Transfer from "../../assets/images/transfer.png";
import Success from "../../assets/images/success.png";
import API, { action } from "../Api";
import localStorageData from "../common/Functions/localStorageKeyValues";
import { useNotification } from "../../Context/Notifications/Notification";
import { useFormik } from "formik";
import * as yup from "yup";
import CascaderSelect from "../common/CascaderSelect";
import { Cascader } from "antd";

const EmployeeCard = ({ selectedEmployee }) => {
  return (
    <div className="rounded-[10px] dark:bg-dark px-4 py-1.5 bg-[#DBDAFF66] flex items-center gap-2">
      <Avatar name={selectedEmployee?.name} />
      <div className="dark:text-white">
        <p className="text-sm font-semibold 2xl:text-base whitespace-nowrap">
          {selectedEmployee?.name}
        </p>
        <p className="text-xs text-grey 2xl:text-sm">
          EMP ID: {selectedEmployee?.employeeId}
        </p>
      </div>
    </div>
  );
};

export default function InitiateTransfer({ open, close = () => {}, updateId }) {
  const { t } = useTranslation();

  const companyId = localStorageData.companyId;

  const [employeeList, setEmployeeList] = useState([]);

  const [presentage, setPresentage] = useState(0);

  const [nextStep, setNextStep] = useState(0);

  const [activeBtn, setActiveBtn] = useState(0);

  const [customRate, setCustomRate] = useState(1);

  const [transReason, setTransReason] = useState(1);

  const [locationType, setLocationType] = useState(1);

  const [tabValue, setTabValue] = useState("work");

  const [submitPop, setSubmitPop] = useState(false);

  const [successPop, setSuccessPop] = useState(false);

  const [searchFilter, setSearchFilter] = useState(
    employeeList.map((each) => ({
      key: each.username,
      ...each,
    }))
  );

  const [searchValue, setSearchValue] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [newOutletList, setNewOutletList] = useState([]);

  const [activeBtnValue, setActiveBtnValue] = useState("employeeDetails");

  const [designationList, setDesignationList] = useState([]);

  const [departmentList, setDepartmentList] = useState([]);

  const [shiftSchemeList, setShiftSchemeList] = useState([]);

  const [reportingStaffList, setReportingStaffList] = useState([]);

  const [holidayList, setHolidayList] = useState([]);

  const [leaveTypeList, setLeaveTypeList] = useState([]);

  const [approvalTypeList, setApprovalTypeList] = useState([]);

  const { showNotification } = useNotification();

  const { SHOW_CHILD } = Cascader;

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const formik = useFormik({
    initialValues: {
      transferLocation: null,
      transferDate: "",
      transferType: 1,
      reportsTo: null,
      designationId: null,
      departmentId: null,
      timeInOutPolicy: null,
      overtimePolicy: null,
      shortTimePolicy: null,
      missPunchPolicy: null,
      shiftSchemeId: [],
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      transferLocation: yup.string().required("New Company is required"),
      transferDate: yup
        .string()
        .required("Transfer Effective Date is required"),
      designationId: yup.string().when("transferType", (transferType) => {
        if (transferType[0] === 1) {
          return yup.string().required("Designation is required");
        } else {
          return yup.string().notRequired("");
        }
      }),
      departmentId: yup.string().when("transferType", (transferType) => {
        if (transferType[0] === 1) {
          return yup.string().required("Department is required");
        } else {
          return yup.string().notRequired("");
        }
      }),
    }),
    onSubmit: () => {
      setPresentage(3);
      handleNextStep();
      openNotification(
        "success",
        "Successful",
        "Transfer Details saved successfully"
      );
    },
  });

  const handleClose = () => {
    close(false);
    setActiveBtnValue("employeeDetails");
    setActiveBtn(0);
    setPresentage(0);
    setNextStep(0);
    setSelectedEmployee(null);
    setSearchValue("");
    setDesignationList([]);
    setDepartmentList([]);
    setShiftSchemeList([]);
    setReportingStaffList([]);
    setHolidayList([]);
    setLeaveTypeList([]);
    setApprovalTypeList([]);
    setCustomRate(1);
    formik.resetForm();
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  // GET ALL EMPLOYEES BY COMPANY ID
  const getEmployee = async () => {
    try {
      const result = await getEmployeeList();
      const response = result?.map((data) => ({
        employeeId: data.employeeId,
        profile: data.profilePicture,
        name: `${data.firstName} ${data.lastName}`,
        joiningdate: data.joiningDate,
        designation: data.designation,
        empid: data.code,
        noticePeriod: data.noticePeriod,
        offBoarding: data.offBoarding,
      }));
      setEmployeeList(response);
    } catch (error) {
      return error;
    }
  };

  // GET LOCATIONS BY LOCATION TYPE
  const getLocationsByType = async (empId, id) => {
    try {
      await action(API.TRANSFER_EMPLOYEE, {
        employeeId: empId,
        location: id,
      }).then((res) => {
        setNewOutletList(
          res?.result.map((data) => {
            return {
              label: data.company,
              value: data.companyId,
              image: data.logo,
              totalemployees: "",
              address: data.address,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET ALL DESIGNATION BY COMPANY ID
  const getDesignationByCompanyId = async () => {
    try {
      await action(API.GET_DESIGNATION_RECORDS, {
        companyId: formik.values.transferLocation,
        isActive: 1,
      }).then((res) => {
        setDesignationList(
          res.result.map((data) => {
            return {
              label: data.designation,
              value: data.designationId,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET DEPARTMENTS BY COMPANY ID
  const getDepartmentsByCompanyId = async () => {
    try {
      await action(API.GET_DEPARTMENT, {
        companyId: formik.values.transferLocation,
        isActive: 1,
      }).then((res) => {
        setDepartmentList(
          res.result.map((data) => {
            return {
              label: data.department,
              value: data.departmentId,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET SHIFTSCHEME BY COMPANY ID
  const getShiftSchemeByCompanyId = async () => {
    try {
      await action(API.GET_SHIFT_SCHEME, {
        companyId: formik.values.transferLocation,
        isActive: 1,
      }).then((res) => {
        setShiftSchemeList(
          res.result.map((data) => {
            return {
              label: data.shiftScheme,
              value: data.shiftSchemeId,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET REPORTING STAFF
  const getReportingStaff = async () => {
    try {
      await action(API.EMPLOYEE_REPORTING_MANAGERS, {
        companyId: formik.values.transferLocation,
        employeeId: selectedEmployee?.employeeId,
      }).then((res) => {
        setReportingStaffList(
          res.result.map((data) => {
            return {
              label: data.firstName,
              value: data.employeeId,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET HOLIDAY DATA
  const getHolidayData = async () => {
    try {
      await action(API.GET_HOLIDAY, {
        companyId: formik.values.transferLocation,
        isActive: 1,
      }).then((res) => {
        setHolidayList(
          res.result.map((data) => {
            return {
              label: data.holidayName,
              value: data.holidayId,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET ALL LEAVE TYPES
  const getLeaveTypes = async () => {
    try {
      await action(API.GET_LEAVE_TYPES, {
        companyId: formik.values.transferLocation,
        isActive: 1,
      }).then((res) => {
        const holidayType = res.result.map((data) => {
          if (data.basicLeaveType === "0") {
            return data;
          }
        });
        const filteredData = holidayType.filter((value) => value !== undefined);
        setLeaveTypeList(
          filteredData.map((data) => {
            return {
              label: data.leaveType,
              value: data.leaveTypeId,
            };
          })
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  // GET ALL APPROVAL TYPES
  const getAllApprovalTypes = async () => {
    try {
      await action(API.GET_ALL_APPROVAL_DETAILS, {
        companyId: formik.values.transferLocation,
        isActive: 1,
      }).then((res) => {
        setApprovalTypeList(
          res.result.map((data) => ({
            label: data.approvalTypeName,
            value: data.approvalTypeId,
            children: data.approvalTemplates.map((items) => ({
              label: items.templateName,
              value: items.approvalTemplateId,
            })),
          }))
        );
        return res;
      });
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    getDesignationByCompanyId();
    getDepartmentsByCompanyId();
    getShiftSchemeByCompanyId();
    getReportingStaff();
    getHolidayData();
    getLeaveTypes();
    getAllApprovalTypes();
  }, [formik.values.transferLocation]);

  useEffect(() => {
    if (!updateId) {
      getEmployee();
    }
  }, []);

  useEffect(() => {
    getLocationsByType(selectedEmployee?.employeeId, locationType);
  }, [selectedEmployee]);

  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Choose Employee"),
      data: "employeeDetails",
    },
    {
      id: 2,
      value: 1,
      title: "Transfer Type",
      data: "transferType",
    },
    {
      id: 3,
      value: 2,
      title: t("Transfer Detail"),
      data: "transferDetails",
    },
    {
      id: 4,
      value: 3,
      title: t("Feedbacks"),
      data: "feedback",
    },
  ]);

  const regularOvertime = [
    {
      id: 1,
      title: "Permanent Transfer",
      description: "Transfer movement within the same city",
      image: (
        <BsPersonLock
          className={`w-6 h-6 text-grey ${customRate === 1 && "text-primary"}`}
        />
      ),
    },
    {
      id: 2,
      title: "Temporary  Transfer",
      description:
        "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
      image: (
        <PiHourglassMediumLight
          className={`w-6 h-6 text-grey ${customRate === 2 && "text-primary"}`}
        />
      ),
    },
    {
      id: 3,
      title: "Project Based",
      description:
        "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
      image: (
        <IoExtensionPuzzleOutline
          className={`w-6 h-6 text-grey ${customRate === 3 && "text-primary"}`}
        />
      ),
    },
  ];

  const transferDetailsData = [
    {
      id: 1,
      title: "Intracity",
      description: "Transfer movement within the same city",
      image: (
        <CiLocationOn
          className={`w-6 h-6  text-grey ${
            locationType === 1 && "text-primary"
          }`}
        />
      ),
    },
    {
      id: 2,
      title: "Intercity transfer",
      description: "Transfer movement between different cities",
      image: (
        <TbRoad
          className={`w-6 h-6  text-grey ${
            locationType === 2 && "text-primary"
          }`}
        />
      ),
    },
    {
      id: 3,
      title: "International",
      description: "Transfer cross-border or global movement",
      image: (
        <SlGlobe
          className={`w-6 h-6  text-grey ${
            locationType === 3 && "text-primary"
          }`}
        />
      ),
    },
  ];

  const earnings = [
    {
      earningsname: "Basic Pay",
      calculationtype: "Fixed",
      amount: 200,
    },
    {
      earningsname: "Basic Pay",
      calculationtype: "Fixed",
      amount: 200,
    },
    {
      earningsname: "Basic Pay",
      calculationtype: "Fixed",
      amount: 200,
    },
  ];

  const deductions = [
    {
      deductionname: "Basic Pay",
      calculationtype: "Fixed",
      amount: 200,
    },
    {
      deductionname: "Basic Pay",
      calculationtype: "Fixed",
      amount: 200,
    },
    {
      deductionname: "Basic Pay",
      calculationtype: "Fixed",
      amount: 200,
    },
  ];

  const reason = [
    {
      id: 1,
      name: "Business Needs",
      Description:
        "Transfer initiated by the company to meet organizational goals",
    },
    {
      id: 2,
      name: "Employe Request",
      Description:
        "Transfer requested by the employee for personal or professional reasons.",
    },
  ];

  const header = [
    {
      id: 1,
      value: "work",
      title: "Work Details",
      navValue: "work",
    },
    {
      id: 2,
      value: "policy",
      title: "Policies & Approval Types",
      navValue: "policy",
    },
    {
      id: 3,
      value: "salarystructure",
      title: "Salary Structure",
      navValue: "salarystructure",
    },
  ];

  useEffect(() => {
    if (nextStep >= 0 && nextStep !== activeBtn) {
      setActiveBtn(nextStep);
      setActiveBtnValue(steps[nextStep]?.data);
    }
  }, [nextStep]);

  const handleNextStep = () => {
    const stepIndex = steps.findIndex((step) => step.data === activeBtnValue);
    if (stepIndex < steps.length - 1) {
      setPresentage(stepIndex + 1);
      setNextStep(stepIndex + 1);
    }
  };

  const handleSendApproval = () => {
    setSuccessPop(true);
  };

  return (
    <DrawerPop
      placement="bottom"
      open={open}
      close={() => {
        handleClose();
      }}
      background="#F8FAFC"
      // close={(e) => {
      //   // console.log(e);
      //   handleClose();
      //   close(e);
      // }}
      //   contentWrapperStyle={{
      //     maxWidth: "540px",
      //   }}
      contentWrapperStyle={{
        position: "absolute",
        height: "100%",
        top: 0,
        // left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        borderRadius: 0,
        borderTopLeftRadius: "0px !important",
        borderBottomLeftRadius: 0,
      }}
      handleSubmit={(e) => {}}
      buttonClick={(e) => {
        if (activeBtnValue === "employeeDetails") {
          if (selectedEmployee) {
            setPresentage(1);
            handleNextStep();
            openNotification(
              "success",
              "Successful",
              "Employee is selected successfully"
            );
          } else {
            openNotification("error", "Info", "Select an employee to continue");
          }
        }
        if (activeBtnValue === "transferType") {
          handleNextStep();
          setPresentage(2);
          openNotification(
            "success",
            "Successful",
            "Transfer Type saved successfully"
          );
        }
        if (activeBtnValue === "transferDetails") {
          formik.handleSubmit();
        }
        if (activeBtnValue === "feedback") {
          setSubmitPop(true);
        }
      }}
      header={[t("Employee Transfer"), t("Manage Employee Transfer")]}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setPresentage(presentage - 1);
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(steps?.[activeBtn - 1].data);
        }
        //   setBtnName("");
      }}
      //   stepsData={steps}
      footerBtn={[t("Cancel"), t("Save")]}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <div className="flex flex-col gap-10  max-w-[1045px] mx-auto">
        <div className="-top-6 w-4/5 mx-auto z-50 px-5  dark:bg-[#1f1f1f] pb-8  ">
          {steps && (
            <Stepper
              currentStepNumber={activeBtn}
              presentage={presentage}
              steps={steps}
            />
          )}
        </div>
        {activeBtnValue === "employeeDetails" ? (
          <div className="flex flex-col gap-6 box-wrapper">
            <div className="flex flex-col gap-3 p-1">
              <Heading2
                title="Select Employee"
                description="Search the employee for transfer.Complete the process by ensuring all required information and documentation are submitted."
              />
              <SearchBox
                placeholder="Search Employees"
                data={employeeList}
                value={searchValue}
                change={(value) => {
                  setSearchValue(value);
                  setSelectedEmployee(null);
                }}
                onSearch={(value) => {
                  setSearchFilter(value);
                  setSelectedEmployee(null);
                }}
              />
            </div>
            <div>
              {!selectedEmployee ? (
                <div>
                  {searchValue ? (
                    searchFilter.length > 0 ? (
                      searchFilter.map((item, index) => (
                        <div key={item.id}>
                          <div
                            className="flex justify-between p-2 duration-300 transform rounded-md cursor-pointer dark:text-white group hover:bg-primaryalpha/10 dark:hover:bg-primaryalpha/20"
                            onClick={() => handleEmployeeSelect(item)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                image={item?.profile}
                                name={item?.name}
                                className="size-10 2xl:size-12"
                              />
                              <span>
                                <h1 className="text-sm font-semibold 2xl:text-base">
                                  {item?.name}
                                </h1>
                                <p className="text-xs text-slate-500 2xl:text-sm">
                                  Emp ID:#{item?.empid}
                                </p>
                              </span>
                            </div>
                            <button>
                              <GoArrowRight className="text-2xl group-hover:text-primary text-[#C1C1C1]" />
                            </button>
                          </div>
                          {index < searchFilter.length - 1 && (
                            <hr className="my-2 border-t border-slate-200" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center">No results found</p>
                    )
                  ) : (
                    <div className="flex-col w-full gap-10 h-96 vhcenter">
                      <img
                        src={avatars}
                        alt="avatars"
                        className="w-64 lg:w-96"
                      />
                      <p className="text-grey text-sm lg:text-sm 2xl:text-base italic text-center max-w-[790px]">
                        Search the employee for transfer.Complete the process by
                        ensuring all required information and documentation are
                        submitted.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar
                    image={selectedEmployee?.profile}
                    name={selectedEmployee?.name}
                    className="size-12 2xl:size-[60px]"
                    textClassName="text-sm 2xl:text-base"
                    randomColor={false}
                  />
                  <p>{selectedEmployee?.name}</p>
                </div>
              )}
            </div>
          </div>
        ) : activeBtnValue === "transferType" ? (
          <div className="flex flex-col box-wrapper gap-9">
            <div className="flex justify-between">
              <Heading2
                title="Transfer Type"
                description="Choose the type of employee transfer & Please ensure the selected type aligns with the employee’s transfer requirements."
              />
              <EmployeeCard selectedEmployee={selectedEmployee} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium 2xl:text-sm ">
                Choose Transfer Types
              </p>
              <div className="flex flex-col grid-cols-12 gap-6 md:grid">
                {regularOvertime.map((items) => (
                  <div
                    className={`col-span-4 p-2 border rounded-2xl cursor-pointer showDelay  flex justify-between items-center ${
                      customRate === items.id &&
                      "border-primary bg-primaryalpha/[0.08]"
                    }`}
                    onClick={() => {
                      setCustomRate(items.id);
                      formik.setFieldValue("transferType", items.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`group-hover:border-white p-2.5 border vhcenter rounded-lg bg-white size-16 shrink-0 ${
                          customRate === items.id && "text-primary"
                        }`}
                      >
                        {items.image}
                      </div>

                      <p className="text-sm font-semibold 2xl:text-base">
                        {items.title}
                      </p>
                    </div>
                    <div
                      className={`${
                        customRate === items.id && "border-primary"
                      } border rounded-full`}
                    >
                      <div
                        className={`font-semibold text-base w-4 h-4 border-2 border-white dark:border-white/10   rounded-full ${
                          customRate === items.id && "text-primary bg-primary"
                        } `}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xs font-medium 2xl:text-sm ">
                Transfer Reason
              </p>
              <div className="grid grid-cols-3">
                {reason.map((res) => (
                  <div
                    className="flex items-start gap-2 cursor-pointer"
                    onClick={() => {
                      setTransReason(res.id);
                    }}
                  >
                    <div
                      className={`${
                        transReason === res.id && "border-primary"
                      } border  rounded-full`}
                    >
                      <div
                        className={`font-semibold text-base w-3 h-3 border-2 border-white dark:border-white/10   rounded-full ${
                          transReason === res.id && "text-primary bg-primary"
                        } `}
                      ></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium 2xl:text-sm ">
                        {res.name}
                      </div>
                      <div className="text-xs text-grey 2xl:text-sm">
                        {res.Description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeBtnValue === "transferDetails" ? (
          <>
            <div className="flex flex-col gap-5 box-wrapper">
              <div className="flex justify-between">
                <Heading2
                  title="Transfer Detail "
                  description="Enter transfer details: location type, new outlet, effective date, and handover timeline."
                />
                <EmployeeCard selectedEmployee={selectedEmployee} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium 2xl:text-sm ">
                  Location Type
                </p>
                <div className="flex flex-col grid-cols-12 gap-6 md:grid">
                  {transferDetailsData.map((each) => (
                    <div
                      className={`col-span-4 p-2 border rounded-2xl cursor-pointer showDelay flex justify-between items-start ${
                        locationType === each.id &&
                        "border-primary bg-primaryalpha/[0.08]"
                      }  `}
                      onClick={() => {
                        setLocationType(each.id);
                        getLocationsByType(each.id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`group-hover:border-white p-2.5 border rounded-lg w-fit bg-white size-12 vh-center`}
                        >
                          {each.image}
                        </div>
                        <span>
                          <p className="text-xs font-medium 2xl:text-sm">
                            {each.title}
                          </p>
                          <p className="text-grey text-[10px] 2xl:text-xs">
                            {each.description}
                          </p>
                        </span>
                      </div>
                      <div
                        className={`${
                          locationType === each.id && "border-primary"
                        } border  rounded-full cursor-pointer`}
                      >
                        <div
                          className={`font-semibold text-base w-3 h-3 border-2 border-white dark:border-white/10   rounded-full ${
                            locationType === each.id &&
                            "text-primary bg-primary"
                          } `}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <CustomSelect
                    title="Choose New Company"
                    required={true}
                    value={formik.values.transferLocation}
                    options={newOutletList}
                    placeholder="Select..."
                    onChange={(e) =>
                      formik.setFieldValue("transferLocation", e)
                    }
                    style={
                      formik.errors.transferLocation && {
                        border: "1px solid #fb7186",
                        borderRadius: "8px",
                        boxShadow:
                          "0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                      }
                    }
                    error={formik.errors.transferLocation}
                    optionRender={(option) => {
                      return (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center overflow-hidden">
                            <div className="mr-3 overflow-hidden border-2 border-white rounded-full shadow-md size-8 shrink-0">
                              <img
                                src={option.data.image}
                                alt=""
                                className="object-cover object-center w-full h-full"
                              />
                            </div>
                            <div className="flex flex-col ">
                              <p>{option.label}</p>
                              <p className="text-xs text-grey font-normaltruncate">
                                {option.data.address}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs">
                            <span className="font-normal text-grey">
                              Total Employees:{" "}
                            </span>
                            <span className="font-bold">
                              {option.data.totalemployees}
                            </span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <DateSelect
                    title="Transfer Effective Date"
                    placeholder="Select date..."
                    value={formik.values.transferDate}
                    required={true}
                    change={(e) => {
                      formik.setFieldValue("transferDate", e);
                    }}
                    error={formik.errors.transferDate}
                  />
                </div>
              </div>
              <div className="py-2.5 px-3 rounded-lg bg-primaryalpha/[0.08]">
                <p className="text-xs font-medium text-black 2xl:text-sm dark:text-white">
                  Transfer Timeline
                  <span className="text-xs italic font-normal 2xl:text-sm">
                    (estimate handover time):{" "}
                  </span>
                  <span className="font-bold text-primaryalpha"> 30 Days</span>
                </p>
              </div>
            </div>
            {customRate === 1 && (
              <div className="flex flex-col gap-4 box-wrapper">
                <div className="flex justify-between">
                  <Heading2
                    title="New Working Details"
                    description="Specify new job role, department, reporting manager, and other relevant details for the transfer."
                  />
                </div>
                <div>
                  <TabsNew
                    classNames="w-max"
                    tabs={header}
                    tabClick={(e) => {
                      setTabValue(e);
                    }}
                  />
                  {tabValue === "work" ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-2 mt-0 ">
                        <Dropdown
                          title="Designation"
                          required={true}
                          options={designationList}
                          value={formik.values.designationId}
                          change={(e) =>
                            formik.setFieldValue("designationId", e)
                          }
                          error={formik.errors.designationId}
                        />
                        <Dropdown
                          title="Department"
                          required={true}
                          options={departmentList}
                          value={formik.values.departmentId}
                          change={(e) =>
                            formik.setFieldValue("departmentId", e)
                          }
                          error={formik.errors.departmentId}
                        />
                        <Dropdown
                          title="Reports To"
                          options={reportingStaffList}
                          value={formik.values.reportsTo}
                          change={(e) => formik.setFieldValue("reportsTo", e)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Heading3
                          title="Shift Scheme"
                          description="Choose employee work timing"
                        />
                        <div className="grid grid-cols-2">
                          <MultiSelect
                            options={shiftSchemeList}
                            change={(e) => {
                              formik.setFieldValue("shiftSchemeId", e);
                            }}
                            placeholder={t("Select shift scheme")}
                            value={formik.values.shiftSchemeId}
                            // error={formik.errors.companyId}
                            // required={true}
                          />
                        </div>
                      </div>
                    </div>
                  ) : tabValue === "policy" ? (
                    <div className="flex flex-col gap-5">
                      <p className="text-sm font-semibold 2xl:text-base dark:text-white">
                        Work Policy Details
                      </p>
                      <div className="grid max-[320px]:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
                        <Dropdown title="Time-In out Policy" />
                        <Dropdown title="Over time Policy" />
                        <Dropdown title="Short time Policy" />
                        <Dropdown title="Miss Punch Policy" />
                      </div>
                      <div className="divider-h"></div>
                      <div className="grid max-[320px]:grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3">
                        <div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold 2xl:text-base dark:text-white">
                              Leave Type
                            </p>
                            <p className="text-xs font-medium 2xl:text-sm text-grey dark:text-white">
                              Choose applicable leave types
                            </p>
                          </div>
                          <MultiSelect
                            options={leaveTypeList}
                            placeholder={t("Select leave types")}
                            change={(e) => console.log(e, "gjhgjgj6666")}
                          />
                        </div>
                        <div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-semibold 2xl:text-base dark:text-white">
                              Holidays
                            </p>
                            <p className="text-xs font-medium 2xl:text-sm text-grey dark:text-white">
                              Choose applicable holiday types
                            </p>
                          </div>
                          <MultiSelect
                            options={holidayList}
                            placeholder={t("Select holiday types")}
                            change={(e) => console.log(e, "gjhgjgj6666")}
                          />
                        </div>
                        <div>
                          <div className="flex flex-col gap-1 mb-1">
                            <p className="text-sm font-semibold 2xl:text-base dark:text-white">
                              Approval Types
                            </p>
                            <p className="text-xs font-medium 2xl:text-sm text-grey dark:text-white">
                              Choose applicable approval types
                            </p>
                          </div>
                          <Cascader
                            className="w-full"
                            options={approvalTypeList}
                            onChange={(value) => {
                              // setapprovalFlowData(value);
                            }}
                            showCheckedStrategy={SHOW_CHILD}
                            multiple
                            maxTagCount="responsive"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-sm font-semibold 2xl:text-base dark:text-white">
                            Salary Policy Details
                          </p>
                          <p className="text-xs font-medium 2xl:text-sm text-grey dark:text-white">
                            Fill Policy details of employee for registration.
                          </p>
                        </div>
                        <Dropdown className="max-w-[338px] w-full" />
                      </div>
                      <p className="text-sm font-semibold text-primaryalpha 2xl:text-base">
                        Earnings
                      </p>
                      <div className="flex flex-col gap-4">
                        {earnings.map((item) => (
                          <div className="box-wrapper">
                            <div className="flex justify-between">
                              <div className="flex gap-5">
                                <div className="flex flex-col gap-1">
                                  <p className="text-[10px] 2xl:text-xs text-grey">
                                    Earnings Name
                                  </p>
                                  <p className="text-xs font-medium 2xl:text-sm">
                                    {item.earningsname}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-[10px] 2xl:text-xs text-grey">
                                    Calculation Type
                                  </p>
                                  <p className="text-xs font-medium 2xl:text-sm">
                                    {item.calculationtype}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-xs font-medium 2xl:text-sm text-grey">
                                  Amount:
                                </p>
                                <FormInput className="max-w-[124px] w-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-red-500 2xl:text-base">
                        Deductions
                      </p>
                      <div className="flex flex-col gap-4">
                        {deductions.map((deduct) => (
                          <div className="box-wrapper">
                            <div className="flex justify-between">
                              <div className="flex gap-5">
                                <div className="flex flex-col gap-1">
                                  <p className="text-[10px] 2xl:text-xs text-grey">
                                    Earnings Name
                                  </p>
                                  <p className="text-xs font-medium 2xl:text-sm">
                                    {deduct.deductionname}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-[10px] 2xl:text-xs text-grey">
                                    Calculation Type
                                  </p>
                                  <p className="text-xs font-medium 2xl:text-sm">
                                    {deduct.calculationtype}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-xs font-medium 2xl:text-sm text-grey">
                                  Amount:
                                </p>
                                <FormInput className="max-w-[124px] w-full" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-5">
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] 2xl:text-xs font-medium text-primaryalpha">
                              Total Earnings
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-bold">
                              AED 35678.00
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] 2xl:text-xs font-medium text-red-500">
                              Total Earnings
                            </p>
                            <p className="text-[10px] 2xl:text-xs font-bold">
                              AED 35678.00
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col ">
                          <p className="text-[17px] 2xl:text-[19px] font-semibold">
                            Gross Pay:
                            <span className="text-xl 2xl:text-2xl">
                              4066.00
                            </span>
                          </p>
                          <p className="text-xs font-medium text-right 2xl:text-sm">
                            48800.00 per annum{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4 box-wrapper">
            <div className="flex justify-between">
              <Heading2
                title="Feedbacks"
                description="Provide any additional comments or feedback regarding the transfer process to help improve future transfers"
              />
              <EmployeeCard selectedEmployee={selectedEmployee} />
            </div>

            <TextArea title="Description" placeholder="Description" />

            <FileUpload title="Document Upload" />
          </div>
        )}
      </div>
      <ModalAnt
        isVisible={submitPop}
        onClose={() => {
          setSubmitPop(false);
        }}
        // width="435px"
        showCancelButton={true}
        cancelButtonClass="w-full"
        showTitle={false}
        centered={true}
        padding="8px"
        showOkButton={true}
        okText={"Send for approval"}
        // okButtonDanger
        okButtonClass="w-full"
        onOk={handleSendApproval} // write submit logic
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-14 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img src={Transfer} alt="" className="rounded-full w-[28px]" />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Confirm Employee Transfer
            </p>
          </div>
          <div className="m-auto">
            <div className="text-xs text-center text-gray-500 2xl:text-sm">
              Are you sure you want to proceed with completing the employee
              transfer process? Once confirmed, all details will be updated, and
              the transfer will be finalized.
            </div>
          </div>
        </div>
      </ModalAnt>
      <ModalAnt
        isVisible={successPop}
        onClose={() => {
          setSuccessPop(false);
        }}
        // width="435px"
        showCancelButton={false}
        // cancelButtonClass="w-full"
        showTitle={false}
        centered={true}
        padding="8px"
        showOkButton={true}
        okText={"Back to previous entity"}
        // okButtonDanger
        okButtonClass="w-full"
        onOk={() => console.log("hi")} // write submit logic
      >
        <div className="flex flex-col gap-2.5 md:w-[400px] 2xl:w-[437px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="size-14 2xl:size-[60px]">
              <img
                src={Success}
                alt=""
                className="object-cover object-top w-full h-full"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Transfer Successful!
            </p>
          </div>

          <div className="m-auto">
            <div className="text-xs text-center text-gray-500 2xl:text-sm">
              <span className="text-primary font-medium">Alexandar</span> has
              been successfully transferred to
              <span className="text-primary font-medium">
                {" "}
                Info Solutions, Banglore
              </span>
              All related records and details have been updated accordingly.
            </div>
          </div>
        </div>
      </ModalAnt>
    </DrawerPop>
  );
}

export { EmployeeCard };

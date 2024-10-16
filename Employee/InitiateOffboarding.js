import React, { useEffect, useMemo, useRef, useState } from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import sickImg from "../../assets/images/LeaveBalanceImages/primary/sick-primary.png";

import sickImg1 from "../../assets/images/LeaveBalanceImages/theme/sick-theme.png";
import avatars from "../../assets/images/avatar-image.png";

import Stepper from "../common/Stepper";
import SearchBox from "../common/SearchBox";
import { RiCalendarLine } from "react-icons/ri";
import DateSelect from "../common/DateSelect";
import FileUpload from "../common/FileUpload";
import CheckBoxInput from "../common/CheckBoxInput";
import { GoArrowRight } from "react-icons/go";
import Heading2 from "../common/Heading2";
import {
  PiDiamondsFour,
  PiHandshakeLight,
  PiMinus,
  PiPlus,
} from "react-icons/pi";
import { GoAlert } from "react-icons/go";
import { CiCircleAlert } from "react-icons/ci";
import TextEditor from "../TextEditor";
import API, { action, fileAction } from "../Api";
import FormInput from "../common/FormInput";
import { format, addDays } from "date-fns";
import { useFormik } from "formik";
import ButtonClick from "../common/Button";
import { getEmployeeList } from "../common/Functions/commonFunction";
import Avatar from "../common/Avatar";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function InitiateOffboarding({
  open,
  close = () => {},
  updateId,
  refresh = () => {},
  setOpenModal = () => {},
}) {
  const { t } = useTranslation();
  const primaryColor = localStorageData.mainColor;
  const [show, setShow] = useState(open);
  const [selectedCheckbox, setselectedCheckbox] = useState([]);
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [activeBtn, setActiveBtn] = useState(0);
  const [addAdressstep, setAddAdressstep] = useState(true);
  const [activeBtnValue, setActiveBtnValue] = useState("employeeDetails"); // employeeDetails // seperationmode // leavebalance // eligibility // feedback
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [Mode, setMode] = useState(null);
  const [selectedRehireEligibility, setSelectedRehireEligibility] =
    useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeList, setemployeeList] = useState([]);
  const [ResignationsubmitDate, setResignationsubmitDate] = useState("");
  const [septype, setSeptype] = useState([]);
  const [offBoarding, setoffBoarding] = useState("");
  const [feedbackId, setFeedbackId] = useState("");
  const [searchFilter, setSearchFilter] = useState(
    employeeList.map((each) => ({
      key: each.username,
      ...each,
    }))
  );
  const [requiredNoticeperiod, setrequiredNoticeperiod] = useState("");
  const [actuallNoticeperiod, setactuallNoticeperiod] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [difference, setDifference] = useState(0);
  const [rehireEligibility, setrehireEligibility] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [leavebalanceData, setleavebalanceData] = useState([]);
  const [offboardingId, setoffboardingId] = useState("");
  const [content, setcontent] = useState("");
  const [resignationError, setResignationError] = useState("");
  const [noticeperiodError, setNoticeperiodError] = useState("");
  const [createdBy, setcreatedBy] = useState(localStorageData.employeeId);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  // check scroll to top

  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);

  // Scroll to the appropriate div when activeBtnValue changes
  useEffect(() => {
    if (activeBtnValue === "employeeDetails" && div1Ref.current) {
      div1Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "seperationmode" && div2Ref.current) {
      div2Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "leavebalance" && div3Ref.current) {
      div3Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (activeBtnValue === "eligibility" && div4Ref.current) {
      div4Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (div5Ref.current) {
      div5Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeBtnValue]);
  // \\\\\\\\\\\\ scroll to top end \\\\\\\\\\\\\\\\\\\\\\\
  useEffect(() => {
    if (ResignationsubmitDate && actuallNoticeperiod) {
      const startDate = new Date(ResignationsubmitDate);
      const endDate = addDays(startDate, parseInt(actuallNoticeperiod));
      const formattedDate = format(endDate, "yyyy-MM-dd");
      setDifference(formattedDate);
    }
  }, [ResignationsubmitDate, actuallNoticeperiod]);

  const handleClose = () => {
    setShow(false);
  };
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  const [steps, setSteps] = useState([
    {
      id: 1,
      value: 0,
      title: t("Employee_Details"),
      data: "employeeDetails",
    },
    {
      id: 2,
      value: 1,
      title: "Separation Mode",
      data: "seperationmode",
    },
    {
      id: 3,
      value: 2,
      title: t("Leave Balance Details"),
      data: "leavebalance",
    },
    {
      id: 4,
      value: 3,
      title: t("Rehire Eligibility"),
      data: "eligibility",
    },
    {
      id: 5,
      value: 4,
      title: t("Feedback"),
      data: "feedback",
    },
  ]);

  const [seperationMode, setseperationMode] = useState([]);

  const [selectedArray, setSelectedArray] = useState([]);
  const leavebalanceDataRef = useRef(leavebalanceData);
  const handleCheckboxChange = (id) => {
    setleavebalanceData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      leavebalanceDataRef.current = updatedData;
      updateSelectedArray(updatedData);
      return updatedData;
    });

    setselectedCheckbox((prevSelectedCheckbox) =>
      prevSelectedCheckbox.filter((cb) => cb.leaveTypeId !== id)
    );
  };

  const updateSelectedArray = (data) => {
    const newSelectedArray = data
      .filter((item) => item.selected) // Only include selected items
      .map((item) => ({
        employeeId: employeeId,
        leaveTypeId: item.id,
        leaveBalanceCount: item.leaveBalanceCount,
        leaveEncashmentCount: item.leaveEncashmentCount || 0,
        createdBy: createdBy,
      }));
    setSelectedArray(newSelectedArray);
  };

  useEffect(() => {
    setleavebalanceData((prevData) => {
      const updatedData = prevData.map((item) => {
        const matchedCheckbox = selectedCheckbox.find(
          (cb) => cb.leaveTypeId === item.id
        );
        if (matchedCheckbox) {
          return {
            ...item,
            selected: true,
            leaveEncashmentCount: matchedCheckbox.leaveEncashmentCount,
          };
        }
        return {
          ...item,
          selected: item.selected || false,
        };
      });
      leavebalanceDataRef.current = updatedData;
      updateSelectedArray(updatedData);
      return updatedData;
    });
  }, [leavebalanceData, selectedCheckbox, employeeId]);

  const handleIncrease = (id) => {
    setleavebalanceData((prevData) => {
      const updatedData = prevData.map((item) => {
        if (item.id === id) {
          const currentCount = Number(item.leaveEncashmentCount) || 0;
          return { ...item, leaveEncashmentCount: currentCount + 1 };
        }
        return item;
      });
      leavebalanceDataRef.current = updatedData;
      updateSelectedArray(updatedData);
      return updatedData;
    });
  };

  const handleDecrease = (id) => {
    setleavebalanceData((prevData) => {
      const updatedData = prevData.map((item) => {
        if (item.id === id) {
          const currentCount = Number(item.leaveEncashmentCount) || 0;
          return {
            ...item,
            leaveEncashmentCount: Math.max(0, currentCount - 1),
          };
        }
        return item;
      });
      leavebalanceDataRef.current = updatedData;
      updateSelectedArray(updatedData);
      return updatedData;
    });
  };
  useEffect(() => {
    if (activeBtn < 4 && activeBtn !== nextStep) {
      /// && activeBtn !== nextStep
      setActiveBtn(1 + activeBtn);
      // setNextStep(nextStep);
      setActiveBtnValue(steps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setactuallNoticeperiod(employee.noticePeriod);
    setEmployeeId(employee.id);
    setrequiredNoticeperiod(employee.noticePeriod);
    setoffBoarding(employee.offBoarding);
    if (employee.offBoarding === 1) {
      getEmployeeOffBoarding(employee.id);
    }
  };

  const getEmployee = async () => {
    try {
      const result = await getEmployeeList();
      setemployeeList(
        result?.map((items) => ({
          id: items.employeeId,
          profile: items.profilePicture,
          name: `${items.firstName} ${items.lastName}`,
          joiningdate: items.joiningDate,
          designation: items.designation,
          empid: items.code,
          noticePeriod: items.noticePeriod,
          offBoarding: items.offBoarding,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!updateId) {
      getEmployee();
    }
  }, []);
  const getAllSepMode = async () => {
    try {
      const result = await action(API.GET_OFFBOARDING_getAllSepMode, {
        isActive: 1,
      });
      setseperationMode(
        result.result.map((sepration) => ({
          id: sepration.sepModeId,
          title: sepration.seperationMode,
          description: sepration.description,
          image:
            sepration.seperationMode === "Voluntary Seperation" ? (
              <PiHandshakeLight className="active:text-primary focus:text-primary size-6" />
            ) : (
              <GoAlert className="size-6" />
            ),
          value: sepration.sepModeId,
        }))
      );
    } catch (error) {}
  };
  useEffect(() => {
    getAllSepMode();
  }, [activeBtnValue === "seperationmode"]);
  const selectedSeparationMode = seperationMode.find(
    (mode) => mode.id === Mode
  );

  const getAllSepType = async () => {
    try {
      const result = await action(API.GET_OFFBOARDING_getAllSepType, {
        isActive: 1,
        sepModeId: Mode,
      });
      setSeptype(
        result.result.map((sepType) => ({
          id: sepType.sepTypeId,
          heading: sepType.sepTypeName,
          description: sepType.description,
          sepModeId: sepType.sepModeId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllSepType();
  }, [Mode]);
  const getAllRehireReson = async () => {
    try {
      const result = await action(API.GET_OFFBOARDING_getAllRehireReson, {
        isActive: 1,
      });
      setrehireEligibility(
        result.result.map((rehire) => ({
          id: rehire.rehireReasonId,
          heading: rehire.rehireReason,
          description: rehire.description,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllRehireReson();
  }, [activeBtnValue === "eligibility"]);

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      companyId: "",
      leavingDate: "",
      resignationSubmittedOn: "",
      requireNoticePeriod: "",
      sepModeId: "",
      sepModetypeId: "",
      rehireReasonId: "",
    },
    onSubmit: async (e) => {
      try {
        const formData = new FormData();
        if (!updateId && offBoarding === 0) {
          formData.append(
            "action",
            API.GET_OFFBOARDING_employeeResignationDetails
          );
          formData.append(
            "jsonParams",
            JSON.stringify({
              employeeId: employeeId,
              companyId: companyId,
              leavingDate: difference,
              resignationSubmittedOn: ResignationsubmitDate,
              requireNoticePeriod: requiredNoticeperiod,
              sepModeId: Mode,
              sepModetypeId: selectedDetail,
              rehireReasonId: selectedRehireEligibility,
            })
          );
          formData.append("file", e.file || null);
          const result = await fileAction(formData);
          setoffboardingId(result.result);

          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Failed", result?.message);
          }
        } else {
          formData.append(
            "action",
            API.UPDATE_OFFBOARDING_updateEmployeeResignationDetails
          );
          formData.append(
            "kwargs",
            JSON.stringify({
              id: offboardingId,
              employeeId: employeeId,

              companyId: companyId,
              leavingDate: difference,
              resignationSubmittedOn: ResignationsubmitDate,
              requireNoticePeriod: requiredNoticeperiod,
              sepModeId: Mode,
              sepModetypeId: selectedDetail,
              rehireReasonId: selectedRehireEligibility,
            })
          );
          formData.append("file", e.file || null);
          const result = await fileAction(formData);
          // setoffboardingId(result.result)
          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Failed", result?.message);
          }
        }
      } catch (error) {
        openNotification("Failed", "Failed", error);
      }
    },
  });
  const formik2 = useFormik({
    initialValues: {
      feedback: "",
      offboardingId: "",
    },
    onSubmit: async (e) => {
      try {
        if (!updateId && offBoarding === 0) {
          const formData = new FormData();
          formData.append("action", API.GET_OFFBOARDING_employeeFeedback);
          formData.append(
            "jsonParams",
            JSON.stringify({
              feedback: content,
              offboardingId: offboardingId,
            })
          );
          formData.append("file", e.file);
          const result = await fileAction(formData);
          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setTimeout(() => {
              handleClose();
              refresh(true);
              setOpenModal(true);
            }, 1000);
          } else {
            openNotification("error", "Failed", result?.message);
          }
        } else {
          const formData = new FormData();
          formData.append(
            "action",
            API.UPDATE_OFFBOARDING_FEEDBACK_updateEmployeeFeedback
          );
          formData.append(
            "kwargs",
            JSON.stringify({
              feedback: content,
              id: feedbackId,
            })
          );
          formData.append("file", e.file);
          const result = await fileAction(formData);
          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setTimeout(() => {
              handleClose();
            }, 1000);
          } else {
            openNotification("error", "Failed", result?.message);
          }
        }
      } catch (error) {
        openNotification("error", "Failed", error);
      }
    },
  });

  const getEmployeeLeaveType = async (e) => {
    try {
      const result = await action(API.GET_EMPLOYEE_LEAVE_TYPE_LIST, {
        id: employeeId,
        companyId: companyId,
      });

      setleavebalanceData(
        result.result.map((leavebalanceData) => ({
          id: leavebalanceData.leaveTypeId,
          title: leavebalanceData.leaveType,
          leaveAssigned: leavebalanceData.totalLeave,
          leaveBalanceCount: leavebalanceData.leaveBalance,
          img: primaryColor === "#EE2E5E" ? sickImg1 : sickImg,
          leaveEncashmentCount: leavebalanceData.leaveBalance,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (activeBtnValue === "leavebalance") {
      getEmployeeLeaveType();
    }
  }, [activeBtnValue === "leavebalance"]);

  const formik3 = useFormik({
    initialValues: {
      employeeId: "",
      leaveTypeId: "",
      leaveBalanceCount: "",
      leaveEncashmentCount: "",
    },
    onSubmit: async (e) => {
      if (selectedArray.length === 0) {
        openNotification("error", "Info", "Choose a leave type");

        return;
      }
      try {
        const result = await action(
          API.GET_OFFBOARDING_offboardingemployeeLeave,
          selectedArray
        );
        if (result.status === 200) {
          openNotification("success", "Successful", result?.message);
          setNextStep(nextStep + 1);
        } else {
          openNotification("error", "Failed", result?.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  //GETOFFBOARDING
  const getEmployeeOffBoarding = async (employeeId) => {
    try {
      const result = await action(API.GET_OFFBOARDING_getEmployeeOffBoarding, {
        companyId: companyId,
        employeeId: updateId || employeeId,
      });
      const employee = [result.result];
      const Objectemployee = employee.map((items) => ({
        id: items.employeeId,
        profile: items.profilePicture,
        name: items.employeeName,
        joiningdate: items.joiningDate,
        designation: items.designation,
        empid: items.code,
        noticePeriod: items.requireNoticePeriod,
      }));
      handleEmployeeSelect(...Objectemployee);

      setResignationsubmitDate(employee[0].resignationSubmittedOn);
      setMode(employee[0].sepModeId);
      setSelectedDetail(employee[0].sepModetypeId);
      setSelectedRehireEligibility(employee[0].rehireReasonId);
      setselectedCheckbox(employee[0].offBoardingLeaves);
      setoffboardingId(employee[0].offboardingId);
    } catch (error) {}
  };
  const getEmployeeFeedbackWithOffboardingId = async (offboardingId) => {
    try {
      const result = await action(
        API.GET_OFFBOARDING_getEmployeeFeedbackWithOffboardingId,
        {
          offboardingId: offboardingId,
        }
      );
      setFeedbackId(result.result.feedBackId);
      setcontent(result.result.feedback);
    } catch (error) {}
  };
  useEffect(() => {
    if (updateId) {
      getEmployeeOffBoarding();
    }
  }, [updateId]);
  useEffect(() => {
    if (offboardingId) {
      getEmployeeFeedbackWithOffboardingId(offboardingId);
    }
  }, [offboardingId]);

  return (
    <DrawerPop
      placement="bottom"
      open={show}
      close={(e) => {
        handleClose();
      }}
      background="#F8FAFC"
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
      buttonClick={(e) => {
        switch (activeBtnValue) {
          case "employeeDetails":
            let hasError = false;
            if (!ResignationsubmitDate) {
              setResignationError("Resignation Submit Date is required");
              hasError = true;
            } else {
              setResignationError("");
            }
            if (!actuallNoticeperiod) {
              setNoticeperiodError("Actuall Noticeperiod is required");
              hasError = true;
            } else {
              setNoticeperiodError("");
            }
            if (hasError) {
              return;
            }
            setPresentage(1);
            setNextStep(nextStep + 1);
            break;
          case "seperationmode":
            // formik.handleSubmit()

            if (!Mode) {
              openNotification(
                "error",
                "Info",
                "Choose Voluntary or Involuntary Seperation "
              );
              return;
            } else if (!selectedDetail) {
              openNotification(
                "error",
                "Info",
                "Choose Voluntary or Involuntary Seperation details"
              );
              return;
            }
            setPresentage(presentage + 1);
            setNextStep(nextStep + 1);
            break;
          case "leavebalance":
            if (leavebalanceData.length === 0) {
              setPresentage(presentage + 1);
              setNextStep(nextStep + 1);
            } else formik3.handleSubmit();
            break;
          case "eligibility":
            setPresentage(presentage + 1);
            formik.handleSubmit();
            break;
          default:
            formik2.handleSubmit();
        }
      }}
      // updateBtn={isUpdate}
      // updateFun={() => {}}
      header={[t("Employee Offboarding"), t("Employee Offboarding")]}
      buttonClickCancel={(e) => {
        if (activeBtn > 0) {
          setActiveBtn(activeBtn - 1);
          setNextStep(nextStep - 1);
          setActiveBtnValue(steps?.[activeBtn - 1].data);
          setPresentage(presentage - 1);
        }
      }}
      stepsData={steps}
      footerBtn={[t("Cancel"), t("Save")]}
      nextStep={nextStep}
      activeBtn={activeBtn}
      saveAndContinue={true}
    >
      <div className="flex flex-col gap-10  ">
        <div className="-top-6 w-4/5 mx-auto z-50 px-5  dark:bg-[#1f1f1f] pb-8  ">
          {steps && (
            <Stepper
              currentStepNumber={activeBtn}
              presentage={presentage}
              // direction="left"
              // labelPlacement="vertical"
              steps={steps}
              addMore={addAdressstep}
              data={{
                id: 2,
                value: 1,

                title: "Address Details ",
                data: "addressDetails",
              }}
            />
          )}
        </div>
        {activeBtnValue === "employeeDetails" ? (
          <div
            ref={div1Ref}
            className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 bg-white dark:bg-dark xs:w-700px lg:w-[1045px] m-auto p-4 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3 p-1">
              <Heading2
                title="Select Employee"
                description="Search the employee for offboarding. Complete the process by ensuring all required information and documentation are submitted."
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
                    // Filter and render the employee list based on the search value
                    searchFilter.length > 0 ? (
                      searchFilter.map((item, index) => (
                        <div key={item.id}>
                          <div
                            className="flex justify-between p-2 dark:text-white group rounded-md hover:bg-primaryalpha/10 
                           transform duration-300 dark:hover:bg-primaryalpha/20 cursor-pointer"
                            onClick={() => handleEmployeeSelect(item)}
                          >
                            <div className="flex gap-3 items-center">
                              <Avatar
                                image={item?.profile}
                                name={item?.name}
                                className="size-10 2xl:size-12"
                              />
                              <span>
                                <h1 className="text-sm 2xl:text-base font-semibold">
                                  {item?.name}
                                </h1>
                                <p className="text-slate-500 text-xs 2xl:text-sm">
                                  Emp ID:#{item?.empid}
                                </p>
                              </span>
                            </div>
                            <button>
                              <GoArrowRight className="text-2xl group-hover:text-primary text-[#C1C1C1]" />
                            </button>
                          </div>
                          {index < searchFilter.length - 1 && (
                            <hr className="border-t border-slate-200 my-2" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center">No results found</p>
                    )
                  ) : (
                    <div className=" h-96 w-full vhcenter gap-10 flex-col">
                      <img
                        src={avatars}
                        alt="avatars"
                        className="w-64 lg:w-96"
                      />
                      <p className="text-grey text-sm lg:text-sm 2xl:text-base italic text-center max-w-[790px]">
                        Search and select the employee for offboarding. Complete
                        the process by ensuring all required information and
                        documentation are submitted.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="m-auto border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark p-2">
                  <div className="flex flex-col gap-3 p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="flex gap-2 items-center ">
                          <Avatar
                            image={selectedEmployee?.profile}
                            name={selectedEmployee?.name}
                            className="size-12 2xl:size-[60px]"
                            textClassName="text-sm 2xl:text-base"
                          />
                          <span className="flex flex-col dark:text-white">
                            <div className="flex items-center gap-2">
                              <h1 className="font-semibold text-base 2xl:text-lg">
                                {selectedEmployee?.name}
                              </h1>
                              <p className=" text-primary bg-primaryalpha/10 dark:bg-primaryalpha/30 text-[10px] 2xl:text-xs rounded-full px-3 py-1 vhcenter">
                                EMP ID:#{selectedEmployee?.empid}
                              </p>
                            </div>
                            <p className="font-medium text-sm 2xl:text-base text-grey">
                              {selectedEmployee?.designation}
                            </p>
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center dark:text-white">
                        <div className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark w-[46px] h-[46px] flex justify-center items-center">
                          <RiCalendarLine className="text-lg" />
                        </div>
                        <span>
                          <p className="text-xs 2xl:text-sm text-gray-500">
                            Joining Date
                          </p>
                          <p className="font-semibold text-sm 2xl:text-base">
                            {selectedEmployee?.joiningdate}
                          </p>
                        </span>
                      </div>
                    </div>
                    <div className="divider-h" />
                    <div className="flex flex-col gap-8 mt-2 ml-0">
                      <DateSelect
                        title="Resignation Submitted On"
                        className="w-96"
                        value={ResignationsubmitDate}
                        change={(e) => {
                          setResignationsubmitDate(e);
                        }}
                        joiningDate={selectedEmployee?.joiningdate}
                        error={resignationError}
                      />
                      <p className="flex flex-col gap-1">
                        {/* <p className='text-xs 2xl:text-sm font-medium dark:text-white'>Upload Resign Letter</p> */}
                        <FileUpload
                          title="Upload Resign Letter"
                          className="w-96"
                          change={(e) => {
                            formik.setFieldValue("file", e);
                          }}
                        />
                      </p>

                      <div className="flex flex-col lg:flex-row gap-2">
                        <FormInput
                          title="Required Notice Period"
                          className="w-[478px]"
                          value={selectedEmployee?.noticePeriod}
                          // change={(e)=>{
                          //   setrequiredNoticeperiod(e)
                          // }}
                        />
                        <FormInput
                          title="Actual notice Period"
                          className="w-[478px]"
                          value={actuallNoticeperiod}
                          change={(e) => {
                            setactuallNoticeperiod(e);
                          }}
                          error={noticeperiodError}
                        />
                      </div>
                      <div className="flex gap-2 items-center dark:text-white">
                        <div className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 dark:bg-dark w-[46px] h-[46px] flex justify-center items-center">
                          <RiCalendarLine className="text-lg" />
                        </div>
                        <span>
                          <p className="text-xs 2xl:text-sm text-gray-500">
                            Leaving Date
                          </p>
                          <p className="font-semibold text-sm 2xl:text-base">
                            {difference}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeBtnValue === "seperationmode" ? (
          <>
            <div
              ref={div2Ref}
              className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 bg-white dark:bg-dark  xs:w-700px lg:w-[1045px] m-auto p-5"
            >
              <div className="flex flex-col gap-6">
                <Heading2
                  title={"Select Separation Mode"}
                  description={"Select Separation Mode"}
                />
                <div className="md:grid grid-cols-8 flex flex-col gap-6 dark:text-white">
                  {seperationMode?.map((each, i) => (
                    <div
                      key={i}
                      className={`col-span-4 p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                        Mode === each?.id && "border-primary "
                      } `}
                      onClick={() => {
                        setMode(each?.id);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className=" flex flex-col gap-2">
                          <div
                            className={`p-2 border rounded-md w-fit dark:text-black
                            ${
                              each?.id === "2"
                                ? "bg-[#f6e1e1] text-red-500 border-red-200"
                                : "text-primary bg-[#F8FAFC] border-primaryalpha/30"
                            } 
                            `}
                          >
                            {each?.image}
                          </div>
                          <h3 className=" text-sm font-semibold">
                            {each?.title}
                          </h3>
                          <p className=" text-xs font-medium text-[#667085] ">
                            {each?.description}
                          </p>
                        </div>
                        <div
                          className={`${
                            Mode === each?.id && "border-primary"
                          } border  rounded-full cursor-pointer w-fit`}
                        >
                          <div
                            className={`font-semibold text-base w-4 h-4 border-2 border-white rounded-full ${
                              Mode === each?.id && "text-primary bg-primary"
                            } `}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-lg p-2"
                  style={{
                    background:
                      "linear-gradient(0deg, #E7E7E7 80%, #ECECEC 80%)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CiCircleAlert className="text-slate-700 size-5" />
                    <span className="text-xs 2xl:text-sm text-slate-500">
                      Select the accurate mode ensures proper handling and
                      documentation of the exit process.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {septype.length > 0 && (
              <div
                className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 bg-white dark:bg-dark xs:w-700px lg:w-[1045px] m-auto p-5"
              >
                {selectedSeparationMode && (
                  <Heading2
                    title={selectedSeparationMode?.title}
                    description={selectedSeparationMode?.description}
                  />
                )}
                <div className="mt-6">
                  <div className="flex flex-col gap-4">
                    {septype.map((item, index) => (
                      <React.Fragment key={index}>
                        <div
                          className={`transform duration-300 hover:bg-primaryalpha/10 rounded-lg p-4 cursor-pointer dark:text-white ${
                            selectedDetail === item?.id && "border-primary"
                          }`}
                          onClick={() => {
                            setSelectedDetail(item?.id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PiDiamondsFour className="size-5 -translate-y-2" />
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-sm 2xl:text-[16px]">
                                  {item?.heading}
                                </span>
                                <span className="font-medium text-xs 2xl:font-sm text-slate-500">
                                  {item?.description}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`${
                                selectedDetail === item?.id && "border-primary"
                              } border  rounded-full cursor-pointer`}
                            >
                              <div
                                className={`font-semibold text-base w-4 h-4 border-2 border-white rounded-full ${
                                  selectedDetail === item?.id &&
                                  "text-primary bg-primary"
                                } `}
                              ></div>
                            </div>
                          </div>
                        </div>
                        {index < septype.length - 1 && (
                          <div className="divider-h" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeBtnValue === "leavebalance" ? (
          <>
            <div
              ref={div3Ref}
              className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 bg-white dark:bg-dark  xs:w-700px lg:w-[1045px] m-auto p-5"
            >
              <Heading2
                title={"Leave Balance Details"}
                description={"Leave Balance Details"}
              />

              <div className="flex flex-col gap-5 mt-3">
                {leavebalanceData.length === 0 ? (
                  <div className="text-center text-slate-500 dark:text-white p-4">
                    No Leave found
                  </div>
                ) : (
                  leavebalanceData?.map((item) => (
                    <div
                      key={item.id}
                      className="borderb rounded-xl h-fit p-2 hover:bg-primaryalpha/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center gap-2 md:gap-16 2xl:gap-28 md:flex-row">
                          <div className="flex items-center gap-3">
                            <div className="vhcenter w-16 h-16 2xl:w-[69px] 2xl:h-[69px] rounded-md shrink-0 bg-primaryalpha/10 dark:bg-[#07A86D]/20">
                              <img
                                className="w-8 h-8 2xl:w-10 2xl:h-10"
                                src={item?.img}
                                alt="Profile"
                              />
                            </div>
                            <div className="flex flex-col gap-1 dark:text-white">
                              <p className="text-base font-semibold 2xl:text-lg">
                                {item?.title}
                              </p>
                              <p className="flex items-center font-medium text-xs 2xl:text-sm gap-0.5 md:gap-1">
                                <span className="text-slate-500">
                                  Total leave assigned:
                                </span>
                                <span>{item?.leaveAssigned}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 font-medium text-xs 2xl:text-sm">
                            <p className="text-slate-500">Balance Leave:</p>
                            <div className="flex items-center gap-1">
                              <span className="text-primary font-bold">
                                {item?.leaveBalanceCount || "0"}
                              </span>
                              <span className="text-slate-500">
                                leaves remaining
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 font-medium text-xs 2xl:text-sm">
                            <p className="text-slate-500">Encashment Leave:</p>
                            <div className="flex items-center gap-1">
                              <ButtonClick
                                handleSubmit={() => handleDecrease(item?.id)}
                                icon={<PiMinus />}
                              />

                              <span className="text-primary font-bold">
                                {item?.leaveEncashmentCount || "0"}
                              </span>
                              <ButtonClick
                                handleSubmit={() => handleIncrease(item?.id)}
                                icon={<PiPlus />}
                              ></ButtonClick>
                            </div>
                          </div>
                        </div>
                        <div className="mr-4">
                          <CheckBoxInput
                            value={item?.selected}
                            change={() => {
                              handleCheckboxChange(item?.id);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : activeBtnValue === "eligibility" ? (
          <>
            <div
              ref={div4Ref}
              className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 bg-white dark:bg-dark xs:w-700px lg:w-[1045px] m-auto p-5"
            >
              <div>
                <Heading2
                  title={"Rehire Eligibility"}
                  description={"Rehire Eligibility"}
                />
                <div className="mt-6">
                  <div className="flex flex-col gap-4">
                    {rehireEligibility.length === 0 ? (
                      <div className="text-center text-slate-500 dark:text-white p-4">
                        No RehireEligibility found
                      </div>
                    ) : (
                      rehireEligibility.map((item, index) => (
                        <React.Fragment key={index}>
                          <div
                            className="transform duration-300 hover:bg-primaryalpha/10 dark:hover:bg-primaryalpha/20 rounded-lg p-4 cursor-pointer dark:text-white"
                            onClick={() => {
                              setSelectedRehireEligibility(item?.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <PiDiamondsFour className="size-5 -translate-y-2" />
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-sm 2xl:text-[16px]">
                                    {item?.heading}
                                  </span>
                                  <span className="font-medium text-xs 2xl:font-sm text-slate-500">
                                    {item?.description}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`${
                                  selectedRehireEligibility === item?.id &&
                                  "border-primary"
                                } border  rounded-full cursor-pointer`}
                              >
                                <div
                                  className={`font-semibold text-base w-4 h-4 border-2 border-white   rounded-full ${
                                    selectedRehireEligibility === item?.id &&
                                    "text-primary bg-primary"
                                  } `}
                                ></div>
                              </div>
                            </div>
                          </div>
                          {index < rehireEligibility.length - 1 && (
                            <div className="divider-h" />
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              ref={div5Ref}
              className="border rounded-[10px] border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10 bg-white dark:bg-dark  xs:w-700px lg:w-[1045px] m-auto p-5"
            >
              <div className="flex flex-col gap-6">
                <Heading2 title={"Feedbacks"} description={"Feedbacks"} />
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold 2xl:text-base dark:text-white">
                    Comments
                  </div>
                  <TextEditor
                    placeholder="EnterComments"
                    initialValue={content}
                    onChange={(e) => {
                      setcontent(e);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold 2xl:text-base dark:text-white">
                    Document Upload
                  </div>
                  <FileUpload
                    change={(e) => {
                      formik2.setFieldValue("file", e);
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DrawerPop>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import FormInput from "../../../common/FormInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Flex, Popover } from "antd";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import * as yup from "yup";
import API, { action } from "../../../Api";
import MultiSelect from "../../../common/MultiSelect";
import CalendarDragDrop from "./Calendar/CalendarDragDrop";
import DrawerPop from "../../../common/DrawerPop";
import FlexCol from "../../../common/FlexCol";
import {
  navigateBtn,
  shiftSchemeNavigateBtn,
  stepSchemeSteps,
} from "../../../data";
import { LuAlertCircle } from "react-icons/lu";
import profile from "../../../../assets/images/shift-box.svg";
import Heading from "../../../common/Heading";
import { HiMiniClock } from "react-icons/hi2";
import Stepper from "../../../common/Stepper";
import AddShift from "./AddShift";
import DateSelect from "../../../common/DateSelect";
import TextArea from "../../../common/TextArea";
import { lightenColor } from "../../../common/lightenColor";
import Heading2 from "../../../common/Heading2";
import EmployeeCheck from "../../../common/EmployeeCheck";
import { dateFormater } from "../../../common/Functions/commonFunction";
import { useNotification } from "../../../../Context/Notifications/Notification";
import OffDaySetCalendar from "./Calendar/OffDaySetCalendar";
import RadioButton from "../../../common/RadioButton";
import { PiArrowsSplit } from "react-icons/pi";
import localStorageData from "../../../common/Functions/localStorageKeyValues";

export default function AddShiftScheme({
  open,
  close = () => {},
  shiftList = [],
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();
  const calendarDetails = useSelector((state) => state.layout.calendarDetails);

  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);

  const [activeBtnValue, setActiveBtnValue] = useState("addShiftScheme");

  const [show, setShow] = useState(open);
  const [openShift, setOpenShift] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radio, setRadio] = useState(null);

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
  const [shift, setShift] = useState(shiftList);
  const [shiftId, setShiftId] = useState(null);

  const [selectedShift, setSelectedShift] = useState([
    {
      label: "Off Day",
      color: "#667085",
      value: "0",
    },
  ]);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [locationList, setLocationList] = useState([]);

  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [departmentCheckList, setDepartmentCheckList] = useState([]);
  const [locationCheckList, setLocationCheckList] = useState([]);

  const [shiftSchemeList, setShiftSchemeList] = useState([]);
  const [shiftSchemeId, setShiftSchemeId] = useState();
  const [schemeCalanderDetails, setSchemeCalanderDetails] = useState("");
  const [isUpdate, setIsUpdate] = useState();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const [getIdBasedUpdatedRecords, setGetIdBasedUpdatedRecords] = useState();

  const { showNotification } = useNotification();

  const handleClick = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const getShift = async () => {
    const result = await action(API.GET_SHIFT_RECORDS, {
      companyId: companyId,
    });
    setShift(
      result.result?.map((each) => ({
        label: each.shift,
        value: each.shiftId,
        color: each.shiftColor,
      }))
    );
  };

  const formik = useFormik({
    initialValues: {
      shiftScheme: "",
      shiftSchemeType: "variable",
      chooseShift: [],
      startTime: "",
      endTime: "",
      allowBreaks: "",
      breakDuration: "",
      description: "",
      // schemedetailas: [],
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      shiftScheme: yup.string().required("Shift Scheme is required"),
      chooseShift: yup
        .array()
        .min(1, "Please choose at least one shift")
        .required("Please choose shift"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (calendarDetails !== "calendarDetails") {
          calendarDetails?.filter((each) => {
            if (each === undefined) {
              setSchemeCalanderDetails("Shift is Required");
            }
          });
        }

        if (
          calendarDetails?.filter((each) => each)?.length === 35 ||
          e.shiftSchemeType === "roster" ||
          e.shiftSchemeType === "rotational"
        ) {
          const result = await action(API.ADD_SHIFT_SCHEME, {
            companyId: companyDataId,
            shiftScheme: e.shiftScheme,
            shiftId: e.chooseShift,
            shiftSchemeType: e.shiftSchemeType,
            startTime: e.startTime,
            endTime: e.endTime,
            allowBreaks: e.allowBreaks,
            breakDuration: e.breakDuration,
            schemedetails: calendarDetails,
            description: e.description,
            createdBy: employeeId,
          });
          if (result.status === 200) {
            setPresentage(1);
            setNextStep(nextStep + 1);
            formik.resetForm();
            setShiftSchemeId(result.result.insertedId);
            handleClick("success", "Successful", result.message);
            setLoading(false);
          } else {
            handleClick("error", "Failed", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        handleClick("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });
  useEffect(() => {
    getShift();
  }, [updateId]);

  const formik2 = useFormik({
    initialValues: {
      assignShiftScheme: "",
      assignStartTime: "",
      assignEndTime: "",
    },
    validateOnChange: false,
    enableReinitialize: true,
    validateOnMount: false,

    validationSchema: yup.object().shape({
      assignStartTime: yup.string().required("With Effect From is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        if (!updateId) {
          const result = await action(API.ADD_ASSIGN_SHIFT_SCHEME, {
            companyId: companyDataId,
            employeeId: employeeCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            departmentId: departmentCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            locationId: locationCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            employeeCompanyId: companyDataId,
            shiftSchemeId: shiftSchemeId || null,
            withEffectFrom: e.assignStartTime,
            withEffectTo: e.assignEndTime,
          });
          if (result.status === 200) {
            formik2.resetForm();

            handleClick("success", "Successful", result.message, () => {
              setShow();
              refresh();
              setLoading(false);
            });

            formik.resetForm();
            handleClose();
          } else {
            handleClick("error", "Failed", result.message);
            setLoading(false);
          }
        } else {
          const result = await action(API.UPDATE_EMPLOYEE_SHIFT_SCHEME, {
            companyId: companyDataId,
            employeeId: employeeCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            departmentId: departmentCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            locationId: locationCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            employeeCompanyId: companyDataId,
            shiftSchemeId: updateId || null,
            withEffectFrom: formik2.values.assignStartTime,
            withEffectTo: formik2.values.assignEndTime,
          });
          if (result.status === 200) {
            handleClick("success", "Successful", result.message);
            setTimeout(handleClose, 2000);
            setLoading(false);
          } else {
            handleClick("error", "Failed", result.message);
            setLoading(false);
          }
        }
      } catch (error) {
        handleClick("error", "Failed", error.code);
        setLoading(false);
      }
    },
  });

  const getIdBasedShiftSchemeList = async (e) => {
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_SHIFT_SCHEME_ID_BASED_RECORDS, {
        id: e,
      });

      if (result.status === 200) {
        setCompanyId(result.result?.companyId);

        setShiftId(result.result?.shiftId);
        formik.setFieldValue("shiftScheme", result.result?.shiftScheme);
        formik.setFieldValue("shiftSchemeType", result.result?.shiftSchemeType);
        formik.setFieldValue("startTime", result.result?.startTime);
        formik.setFieldValue("endTime", result.result?.endTime);
        formik.setFieldValue("allowBreaks", result.result?.allowBreaks);
        formik.setFieldValue("breakDuration", result.result?.breakDuration);
        formik.setFieldValue("description", result.result?.description);
        formik.setFieldValue("description", result.result?.description);
        formik.setFieldValue("chooseShift", result.result?.shiftId);
        formik2.setFieldValue("assignStartTime", result.result?.withEffectFrom);
        formik2.setFieldValue("assignEndTime", result.result?.withEffectTo);

        setIsUpdate(true);
        setShiftSchemeList(
          result.result?.tbl_shiftSchemeDetails?.map((each) => ({
            title: each.shift,
            shiftId: each.shiftId,
            color: each.color,
            value: { week: each.week, dayId: each.dayId },
          }))
        );
        setEmployeeList(
          result.result?.tbl_shiftSchemeApplicability?.employeeId || []
        );
        setDepartmentList(
          result.result?.tbl_shiftSchemeApplicability?.departmentId || []
        );
        setLocationList(
          result.result?.tbl_shiftSchemeApplicability?.locationId || []
        );
      }
      setGetIdBasedUpdatedRecords(result.result);
    }
  };

  const getAssignShiftList = async (e) => {};
  useEffect(() => {
    getIdBasedShiftSchemeList(updateId);
    getAssignShiftList(updateId);
  }, [updateId]);

  useEffect(() => {
    const updatedSelectedShift = shift.filter((each, i) => {
      return shiftId?.includes(each.value);
    });

    setSelectedShift([
      {
        label: "Off Day",
        color: "#667085",
        value: "0",
      },
      ...updatedSelectedShift,
    ]);
  }, [shiftId, shift[0]]);

  const updateIdBasedShiftScheme = async () => {
    try {
      setPresentage(1);
      const result = await action(API.UPDATE_SHIFT_SCHEME, {
        description: formik.values.description,
        shiftSchemeId: updateId,
        companyId: companyDataId,
        shiftScheme: formik.values.shiftScheme,
        shiftId: formik.values.chooseShift,
        shiftSchemeType: formik.values.shiftSchemeType,
        startTime: formik.values.startTime,
        endTime: formik.values.endTime,
        allowBreaks: formik.values.allowBreaks,
        breakDuration: formik.values.breakDuration,
        schemedetails: calendarDetails || [],
        isActive: 1,
        createdBy: employeeId,
      });
      if (result.status === 200) {
        setNextStep(nextStep + 1);
        handleClick("success", "Successful", result.message);
      } else {
        handleClick("error", "Info", result.message);
      }
    } catch (error) {
      handleClick("error", "Failed", error.message);
    }
  };

  useEffect(() => {
    if (activeBtn < 2 && activeBtn !== nextStep) {
      setActiveBtn(1 + activeBtn);
      setActiveBtnValue(stepSchemeSteps?.[activeBtn + 1]?.data);
    }
  }, [nextStep]);

  const primaryColor = localStorageData.mainColor;
  const mode = localStorageData.theme;
  const lighterColor = lightenColor(primaryColor, 0.925);
  const lighterColor2 = lightenColor(primaryColor, 0.91);
  return (
    <div className="">
      {shift && (
        <DrawerPop
          open={show}
          close={(e) => {
            setShow(e);
          }}
          background="#F8FAFC"
          placement="bottom"
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
          className="widthFull"
          buttonClick={(e) => {
            switch (activeBtnValue) {
              case "addShiftScheme":
                if (updateId) {
                  updateIdBasedShiftScheme();
                } else {
                  formik.handleSubmit();
                }
                break;
              case "assignShiftScheme":
                formik2.handleSubmit();
                break;
              default:
                break;
            }
          }}
          updateBtn={isUpdate}
          header={[
            !isUpdate ? t("Add_a_New_Shift_Scheme") : t("Update_Shift_Scheme"),
            !isUpdate
              ? t("Add_a_New_Shift_Scheme_Description")
              : t("Update_a_New_Shift_Scheme_Description"),
          ]}
          footerBtn={[
            t("Cancel"),
            !isUpdate ? t("Add_Shift_Scheme") : t("Update_Shift_Scheme"),
          ]}
          footerBtnDisabled={loading}
          buttonClickCancel={(e) => {
            if (activeBtn > 0) {
              setActiveBtn(activeBtn - 1);
              setNextStep(nextStep - 1);
              setActiveBtnValue(stepSchemeSteps?.[activeBtn - 1].data);
            }
          }}
          nextStep={nextStep}
          activeBtn={activeBtn}
          saveAndContinue={true}
        >
          <Flex justify="center">
            <FlexCol gap={30} className=" lg:w-3/5 w-4/5">
              <Flex justify="center">
                <div className=" z-50 px-5  w-3/5 ">
                  <Stepper
                    steps={stepSchemeSteps}
                    currentStepNumber={activeBtn}
                    presentage={presentage}
                    className="mb-8"
                  />
                </div>
              </Flex>
              {activeBtnValue === "addShiftScheme" ? (
                <FlexCol>
                  <div className="bg-white dark:bg-dark dar borderb rounded-[10px] p-4 flex flex-col gap-6">
                    <Heading2
                      title={t("Shift_Scheme")}
                      description="Customized Shift Scheme with Multiple Templates for Optimal Workforce Management"
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <FormInput
                        title={t("Shift_Scheme")}
                        placeholder={t("Shift_Scheme_Name")}
                        value={formik.values.shiftScheme}
                        change={(e) => {
                          if (e) {
                            if (presentage < 0.2)
                              setPresentage(presentage + 0.2);
                          } else {
                            setPresentage(presentage - 0.2);
                          }

                          formik.setFieldValue("shiftScheme", e);
                        }}
                        error={
                          formik.values.shiftScheme
                            ? ""
                            : formik.errors.shiftScheme
                        }
                        required={true}
                      />

                      <MultiSelect
                        title={t("Shift")}
                        placeholder={t("Choose_Shift_from_here")}
                        value={formik.values.chooseShift}
                        options={shift}
                        required={true}
                        change={(e) => {
                          formik.setFieldValue("chooseShift", e);

                          const updatedSelectedShift = shift.filter(
                            (each, i) => {
                              return e.includes(each.value);
                            }
                          );

                          setSelectedShift([
                            {
                              label: "Off Day",
                              color: "#667085",
                              value: "0",
                            },
                            ...updatedSelectedShift,
                          ]);

                          if (e) {
                            if (presentage < 0.4)
                              setPresentage(presentage + 0.2);
                          } else {
                            setPresentage(presentage - 0.2);
                          }
                        }}
                        onSearch={(e) => {
                          // console.log(e);
                        }}
                        error={formik.errors.chooseShift}
                      />
                    </div>
                    <TextArea
                      title="Description"
                      value={formik.values.description}
                      placeholder="Description"
                      change={(e) => {
                        formik.setFieldValue("description", e);
                      }}
                    />
                  </div>
                  <div className="bg-white dark:bg-dark dar borderb rounded-[10px] p-4 flex flex-col gap-3">
                    {shiftSchemeNavigateBtn && (
                      <div className="md:flex justify-start items-center gap-1 ">
                        <div className="borderb rounded-lg p-2 w-full md:flex justify-start items-center  gap-2 ">
                          {shiftSchemeNavigateBtn.map((tab, i) => (
                            <button
                              key={tab.id}
                              onClick={() => {
                                formik.setFieldValue(
                                  "shiftSchemeType",
                                  tab.value
                                );
                                setShiftSchemeList([]);
                                setGetIdBasedUpdatedRecords(null);
                              }}
                              className={`${
                                formik.values.shiftSchemeType === tab.value
                                  ? ""
                                  : ""
                              } text-xs 2xl:text-sm font-medium whitespace-nowrap px-3 h-8 2xl:h-10 relative group`}
                            >
                              {formik.values.shiftSchemeType === tab.value && (
                                <motion.div
                                  layoutId="bubble"
                                  className="absolute inset-0 z-10 rounded-md bg-accent"
                                ></motion.div>
                              )}
                              <span
                                className={`${
                                  formik.values.shiftSchemeType === tab.value
                                    ? "relative z-20 text-white"
                                    : " text-black dark:text-white group-hover:text-primary"
                                }`}
                              >
                                {tab.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formik.values.shiftSchemeType === "variable" && (
                      <div className="flex flex-col gap-3">
                        <p
                          style={{
                            background:
                              mode === "dark"
                                ? `linear-gradient(90deg, rgb(44 44 44) 0.03%, rgb(50 50 50) 100.92%)`
                                : `linear-gradient(90deg, ${lighterColor} 0.03%, ${lighterColor2} 100.92%)`,
                          }}
                          className="p-4 border border-primaryalpha/20 rounded-[14px] text-sm 2xl:text-base font-semibold opacity-50 "
                        >
                          Timings for each day are predefined but customizable,
                          allowing different shifts for different days within a
                          month.
                        </p>
                        <div className=" ">
                          {selectedShift ? (
                            <CalendarDragDrop
                              shift={selectedShift}
                              error={schemeCalanderDetails}
                              updateData={shiftSchemeList}
                              update={getIdBasedUpdatedRecords && true}
                              addShift={(e) => {
                                setOpenShift(e);
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    )}
                    {formik.values.shiftSchemeType === "roster" && (
                      <div className="flex flex-col gap-3">
                        <p
                          style={{
                            background:
                              mode === "dark"
                                ? `linear-gradient(90deg, rgb(44 44 44) 0.03%, rgb(50 50 50) 100.92%)`
                                : `linear-gradient(90deg, ${lighterColor} 0.03%, ${lighterColor2} 100.92%)`,
                          }}
                          className="p-4 border border-primaryalpha/20 rounded-[14px] text-sm 2xl:text-base font-semibold opacity-50 "
                        >
                          Shifts must be assigned before the start of the day.
                          This option is useful for unpredictable or swappable
                          shifts.
                        </p>
                        <OffDaySetCalendar updateData={shiftSchemeList} />
                      </div>
                    )}
                    {formik.values.shiftSchemeType === "rotational" && (
                      <div className="flex flex-col gap-3">
                        <p
                          style={{
                            background:
                              mode === "dark"
                                ? `linear-gradient(90deg, rgb(44 44 44) 0.03%, rgb(50 50 50) 100.92%)`
                                : `linear-gradient(90deg, ${lighterColor} 0.03%, ${lighterColor2} 100.92%)`,
                          }}
                          className="p-4 border border-primaryalpha/20 rounded-[14px] text-sm 2xl:text-base font-semibold opacity-50 "
                        >
                          Shifts are automatically assigned based on the nearest
                          time of arrival. Ensure there is a reasonable time gap
                          between each shift.
                        </p>
                        <OffDaySetCalendar updateData={shiftSchemeList} />
                      </div>
                    )}
                    {formik.values.shiftSchemeType === "cwl" && (
                      <div className="flex flex-col gap-3">
                        <Heading2
                          title={"Continuous Work Leave (CWL) Configuration"}
                          description="Set conditions for automatic leave credit after continuous work days"
                        />
                        <div className="borderb rounded-lg bg-[rgb(250,250,250)] dark:bg-dark py-4">
                          <div className="borderb rounded-xl px-3 py-[10px] bg-white dark:bg-dark mx-auto w-fit">
                            <div className="flex flex-col gap-1">
                              <div className="text-grey text-[10px] 2xl:text-xs font-medium">
                                Set Frequency:
                              </div>
                              <RadioButton
                                title={""}
                                options={[
                                  {
                                    id: 1,
                                    label: t("Continuously"),
                                    value: "continuously",
                                  },
                                  {
                                    id: 2,
                                    label: t("Monthly"),
                                    value: "monthly",
                                  },
                                ]}
                                value={""}
                                error={""}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5 pt-4">
                            <div className="rounded-2xl pl-3 py-5 bg-white dark:bg-dark mx-auto w-[355px] 2xl:w-[383px] shadow-[0_4px_28px_0px_#CFCEFF59]">
                              <div className="flex items-start gap-3">
                                <div className="bg-[#F9F9F9] rounded-md flex vhcenter w-10 h-10 dark:bg-slate-800">
                                  <PiArrowsSplit className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-3">
                                  <div className="flex flex-col gap-1">
                                    <div className="text-grey text-[10px] 2xl:text-xs font-medium">
                                      Set Workdays
                                    </div>
                                    <div className="flex items-center text-xs 2xl:text-sm gap-1">
                                      <span>If an employee works</span>
                                      <span className="font-semibold">
                                        continuously
                                      </span>
                                      <span>for</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <FormInput
                                      value="06"
                                      placeholder="days"
                                      className="w-40"
                                    />
                                    <div className="text-xs 2xl:text-sm">
                                      days.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mx-auto v-divider bg-red-500 !h-6 !2xl:h-8"></div>

                            <div className="rounded-2xl pl-3 py-5 bg-white dark:bg-dark mx-auto shadow-[0_4px_28px_0px_#CFCEFF59] w-[355px] 2xl:w-[383px]">
                              <div className="flex items-start gap-3">
                                <div className="bg-[#F9F9F9] rounded-md flex vhcenter w-10 h-10 dark:bg-slate-800">
                                  <PiArrowsSplit className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-3">
                                  <div className="flex flex-col gap-1">
                                    <div className="text-grey text-[10px] 2xl:text-xs font-medium">
                                      Set Leave Credit
                                    </div>
                                    <div className="flex items-center text-xs 2xl:text-sm gap-1">
                                      <span className="rounded-md bg-[#F4F4F4] dark:bg-slate-800 w-6 h-6 vhcenter">
                                        06
                                      </span>
                                      <span>
                                        days of continuous work will credit
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <FormInput
                                      placeholder="leave days"
                                      className="w-40"
                                    />
                                    <div className="text-xs 2xl:text-sm">
                                      combo leaves.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mx-auto v-divider bg-red-500 !h-6 !2xl:h-8"></div>

                            <div className="rounded-2xl pl-3 py-5 bg-white dark:bg-dark mx-auto shadow-[0_4px_28px_0px_#CFCEFF59]  w-[355px] 2xl:w-[383px]">
                              <div className="flex flex-col gap-1">
                                <div className="text-grey text-[10px] 2xl:text-xs font-medium">
                                  Is there any accumulation limit?
                                </div>
                                <RadioButton
                                  title={""}
                                  options={[
                                    {
                                      id: 1,
                                      label: t("Yes"),
                                      value: "yes",
                                    },
                                    {
                                      id: 2,
                                      label: t("No"),
                                      value: "no",
                                    },
                                  ]}
                                  value={radio}
                                  change={(e) => {
                                    setRadio(e);
                                  }}
                                  error={""}
                                />
                                {radio === "yes" && (
                                  <div className="pt-2">
                                    <FormInput
                                      title="Set Limit"
                                      placeholder="limit days"
                                      required={true}
                                      className="w-40"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </FlexCol>
              ) : (
                <FlexCol>
                  <Heading
                    title={t("Assign_Shift_Scheme")}
                    description={t(
                      "Customized Shift Scheme with Multiple Templates for Optimal Workforce Management"
                    )}
                  />
                  <Flex
                    gap={10}
                    className="p-2.5 border border-primaryalpha/20 rounded-[14px] "
                    style={{
                      background:
                        mode == "dark"
                          ? `linear-gradient(90deg, rgb(44 44 44) 0.03%, rgb(50 50 50) 100.92%)`
                          : `linear-gradient(90deg, ${lighterColor} 0.03%, ${lighterColor2} 100.92%)`,
                    }}
                  >
                    <div className=" size-20 rounded-md border border-primaryalpha/30 bg-primaryalpha/10 shrink-0 overflow-hidden relative">
                      <img
                        src={profile}
                        alt=""
                        className="absolute rounded-lg -right-3 -bottom-1.5"
                      />
                    </div>
                    <div className=" flex flex-col gap-2 p-1.5">
                      <div className="flex items-center gap-5">
                        <h1 className=" text-xl font-medium whitespace-nowrap">
                          {formik.values.shiftScheme}
                        </h1>
                        <Flex gap={8} align="center" className="flex-wrap">
                          {selectedShift?.map((each) => (
                            <p
                              className={`px-2 py-1 rounded-full  border border-[${each.color}] text-xs font-medium  text-[${each.color}]`}
                              style={{
                                borderColor: `${each.color}50`,
                                color: each.color,
                                background: `${each.color}20`,
                              }}
                            >
                              {each.label}
                            </p>
                          ))}
                        </Flex>
                      </div>
                      <p className=" text-xs opacity-50 font-medium">
                        {t("This_shift_scheme_structure_description")}
                      </p>
                    </div>
                    <Popover
                      content={
                        <div className="w-[490px] h-[285px] p-[16px] flex flex-col gap-6">
                          <div className="flex gap-[17px] ">
                            <div className=" bg-primary p-2.5 rounded-full">
                              <HiMiniClock className=" text-xl text-white" />
                            </div>
                            <h2 className="text-2xl font-bold ">
                              {formik.values.shiftScheme}
                            </h2>
                          </div>
                          <div className="flex flex-col gap-4 ">
                            <h1 className=" text-sm font-medium">
                              {t("Scheme_Includes:")}
                            </h1>
                            <Flex gap={8} align="center">
                              {selectedShift?.map((each) => (
                                <p
                                  className={`px-2 py-1 rounded-full  border border-[${each.color}] text-xs font-medium  text-[${each.color}]`}
                                  style={{
                                    borderColor: each.color,
                                    color: each.color,
                                  }}
                                >
                                  {each.label}
                                </p>
                              ))}
                            </Flex>
                          </div>
                          <p className="text-sm font-normal text-gray-500 ">
                            {t("The_General_Shift_represents_description")}
                          </p>
                        </div>
                      }
                      style={{
                        borderRadius: "13.45px",
                      }}
                    >
                      <LuAlertCircle className=" text-xl text-[#98A2B3]" />
                    </Popover>
                  </Flex>

                  <div className="flex flex-wrap gap-6 md:flex-nowrap md:grid md:grid-cols-2">
                    <DateSelect
                      title={t("With_effect_from")}
                      change={(e) => {
                        formik2.setFieldValue("assignStartTime", e);
                      }}
                      value={formik2.values.assignStartTime}
                      className="w-full"
                      placeholder={t("Choose_Time")}
                      required={true}
                      error={formik2.errors.assignStartTime}
                      fromDate={dateFormater()}
                    />
                    <DateSelect
                      title="With effect to"
                      change={(e) => {
                        formik2.setFieldValue("assignEndTime", e);
                      }}
                      value={formik2.values.assignEndTime}
                      className="w-full"
                      placeholder={t("Choose_Time")}
                    />
                  </div>

                  <EmployeeCheck
                    title="Applicability"
                    description="Manage your companies holidays here"
                    employee={employeeList}
                    department={departmentList}
                    location={locationList}
                    navigateBtn={navigateBtn}
                    assignData={(employee, department, location) => {
                      setEmployeeCheckList(employee);
                      setDepartmentCheckList(department);
                      setLocationCheckList(location);
                    }}
                  />
                </FlexCol>
              )}
            </FlexCol>
          </Flex>
        </DrawerPop>
      )}

      {openShift && (
        <AddShift
          open={openShift}
          close={(e) => {
            setOpenShift(e);
            getShift();
          }}
          companyDataId={companyId}
        />
      )}
    </div>
  );
}

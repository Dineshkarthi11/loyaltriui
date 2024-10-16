import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DrawerPop from "../common/DrawerPop";
import { useTranslation } from "react-i18next";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { Flex, notification } from "antd";
import { ApplicableOn, HolidaySteps, holidayType } from "../data";
import FlexCol from "../common/FlexCol";
import Heading from "../common/Heading";
import FormInput from "../common/FormInput";
import CheckBoxInput from "../common/CheckBoxInput";
import TextArea from "../common/TextArea";
import Dropdown from "../common/Dropdown";
import DateSelect from "../common/DateSelect";
import AddMore from "../common/AddMore";
import { IoMdAdd } from "react-icons/io";
import API, { action } from "../Api";
import * as yup from "yup";
import { useFormik } from "formik";
import { RiDeleteBin5Line } from "react-icons/ri";
import Stepper from "../common/Stepper";
import RangeDatePicker from "../common/RangeDatePicker";
import EmployeeCheck from "../common/EmployeeCheck";
import { useNotification } from "../../Context/Notifications/Notification";
import RadioButton from "../common/RadioButton";
import { HalfDay } from "../common/SVGFiles";

export default function AddHoliday({
  open,
  close = () => { },
  updateId,
  refresh = () => { },
}) {
  const { t } = useTranslation();
  const [isUpdate, setIsUpdate] = useState();
  const [show, setShow] = useState(open);

  const [activeBtn, setActiveBtn] = useState(0);
  const [presentage, setPresentage] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  const [activeBtnValue, setActiveBtnValue] = useState("addHoliday"); //addHoliday
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  const [addRange, setAddRange] = useState(false);

  const [locationList, setLocationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [employeeCheckList, setEmployeeCheckList] = useState([]);
  const [departmentCheckList, setDepartmentCheckList] = useState([]);
  const [locationCheckList, setLocationCheckList] = useState([]);

  const [holidayId, setHolidayId] = useState();
  const { showNotification } = useNotification();

  const navigateBtn = [
    { id: 1, value: "Employees", title: "Employees" },
    // { id: 2, value: "Groups", title: "Groups" },
    { id: 2, value: "Departments", title: "Departments" },
    { id: 3, value: "Locations", title: "Locations" },
  ];

  useEffect(() => {
    // Scroll to the top of the page when the step changes
    window.scrollTo(0, 0);
    console.log("hghhhhhhhhhhh");
  }, [nextStep]);
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
      }, 800),
    [show]
  );
  const handleClose = () => {
    setShow(false);
  };
  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);

  useEffect(() => {
    // console.log(nextStep, activeBtn);
    if (activeBtn < 1 && activeBtn !== nextStep) {
      /// && activeBtn !== nextStep
      setActiveBtn(1 + activeBtn);
      setNextStep(nextStep);
      // console.log(1 + activeBtn);
      // console.log(HolidaySteps?.[activeBtn + 1].data, "data");
      setActiveBtnValue(HolidaySteps?.[activeBtn + 1].data);
    }
  }, [nextStep]);

  // const dynamicFieldsOne = addHolidayType.reduce((ac, each) => {
  //   each.field.reduce((acc, value) => {
  //     acc[each.inputType] = "";
  //     return acc;
  //   });
  // }, {});

  const initialValuesOne = {
    holidayName: "",
    holidayType: null,
    description: "",
    // from_date: "",
    // to_date: "",
    holidayDate: "",
    noOfdays: null,
    notifyApplicable: "",
    reprocessLeaveApplication: "",
    isHalfDay: 0,
    // ...dynamicFieldsOne,
  };

  const formik = useFormik({
    initialValues: {
      ...initialValuesOne,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: yup.object({
      holidayName: yup.string().required("Holiday Name is required"),
      holidayType: yup.string().required("Holiday Type is required"),
      description: yup.string().required("Description is required"),
      holidayDate: !addRange
        ? yup.string().required("Select Date is required")
        : yup
          .array()
          .of(yup.string().required("Each date is required"))
          .required("Date is required"),
      // holidayDate: yup.string().required("Select Date is required"),
      // from_date: yup.string().required("start date is Required"),
      // to_date: yup.string().required("End Date is required"),
    }),
    onSubmit: async (e) => {
      try {
        if (updateId) {

          setNextStep(nextStep + 1)
          setPresentage(1);

        } else {
          const result = await action(API.ADD_HOLIDAY_RECORDS, {
            companyId: companyId,
            holidayName: e.holidayName,
            holidayType: e.holidayType,
            description: e.description,
            // from_date: e.from_date,
            // to_date: e.to_date,
            holidayDate: e.holidayDate,
            noOfdays: e.noOfdays,
            isHalfDay: e.isHalfDay,
            notifyApplicable: e.notifyApplicable,
            reprocessLeaveApplication: e.reprocessLeaveApplication,
          });
          if (result.status === 200) {
            // setWorkPolicy({
            //   workPolicyId: result.data.data.workPolicyId,
            //   workPolicyType: result.data.data.workPolicyType,
            // });
            setHolidayId(result.result.insertedId);
            openNotification("success", "Success", result.message);
            setNextStep(nextStep + 1);
          } else {
            openNotification("error", "Failed...", result.message);
          }
          console.log(result)
        }
      } catch (error) {
        openNotification("error", "Failed...", error.code);
      }
    }
  },
  );

  const dynamicFields = ApplicableOn?.reduce((acc, each) => {
    acc[each.inputTypeOne] = "";
    acc[each.inputTypeTwo] = "";
    // console.log(each);
    // formikData?.map((value) => {
    //   acc[value] = [];
    // });
    return acc;
  }, {});

  const initialValues = {
    policyName: "",

    ...dynamicFields,
    // ...formikData,
  };

  const Formik2 = useFormik({
    initialValues,

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({}),
    onSubmit: async (e) => {
      try {
        if (updateId) {
          const holidayDate = Array.isArray(formik.values.holidayDate)
            ? formatDate(formik.values.holidayDate[0])
            : formatDate(formik.values.holidayDate);

          const payload = {
            id: updateId,
            companyId: companyId,
            holidayName: formik.values.holidayName,
            holidayType: formik.values.holidayType,
            description: formik.values.description,
            holidayDate: holidayDate, // Ensure it's a single date
            noOfdays: formik.values.noOfdays,
            isHalfDay: formik.values.isHalfDay,
            notifyApplicable: formik.values.notifyApplicable,
            reprocessLeaveApplication: formik.values.reprocessLeaveApplication,
            fromDate: Array.isArray(formik.values.holidayDate)
              ? formatDate(formik.values.holidayDate[0])
              : formatDate(formik.values.holidayDate),
            toDate: Array.isArray(formik.values.holidayDate)
              ? formatDate(formik.values.holidayDate[1])
              : formatDate(formik.values.holidayDate),
            employeeId: employeeCheckList
              ?.map((each) => each.assign && each.id)
              .filter((data) => data),
            departmentId: departmentCheckList
              ?.map((each) => each.assign && each.id)
              .filter((data) => data),
            locationId: locationCheckList
              ?.map((each) => each.assign && each.id)
              .filter((data) => data),
          };


          console.log("Payload: ", payload);

          const result = await action(API.UPDATE_HOLIDAY_DETAILS, payload);

          if (result.status === 200) {
            openNotification("success", "Success", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
            }, 1000);
          } else {
            openNotification("error", "Failed...", result.message);
          }
        } else {
          const result = await action(API.ADD_HOLIDAY_APPLICABLE, {
            holidayId: holidayId,
            // companyId: companyId,
            employeeId: employeeCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => parseInt(data)),
            departmentId: departmentCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
            locationId: locationCheckList
              .map((each) => each.assign && each.id)
              .filter((data) => data),
          });
          if (result.status === 200) {
            // setWorkPolicyId(result.data.workPolicyId);
            openNotification("success", "Success", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
            }, 1000);
            // setNextStep(3);
          } else {
            openNotification("error", "Failed...", result.message);
          }
          console.log(result);
        }
      } catch (error) {
        openNotification("error", "Failed...", error.code);
        console.log(error);
      }
    },
  });

  // Get Holiday

  const getHoliday = async () => {
    const result = await action(API.GET_ID_BASED_HOLIDAY_RECORDS, {
      id: updateId,
    });
    console.log(result, "getHolidayById");
    if (result.result) {
      formik.setFieldValue("holidayName", result.result.holidayName);
      formik.setFieldValue("holidayType", result.result.holidayType);
      formik.setFieldValue("description", result.result.description);
      formik.setFieldValue("noOfdays", result.result.noOfdays);
      formik.setFieldValue("notifyApplicable", result.result.notifyApplicable);
      formik.setFieldValue("isHalfDay", parseInt(result.result.isHalfDay));
      formik.setFieldValue(
        "reprocessLeaveApplication",
        result.result.reprocessLeaveApplication
      );
      // setEmployeeList(
      //   employeeList?.map((sw) =>
      //     result.data.holidayapplicable.employeeId.includes(sw?.id)
      //       ? { ...sw, assign: true }
      //       : sw
      //   )
      // );
      // console.log(employeeList);
      // if (result.result.toDate) {
      //   setAddRange(true);
      //   formik.setFieldValue("holidayDate", [
      //     result.result.fromDate,
      //     result.result.toDate,
      //   ]);
      // } else {
      //   formik.setFieldValue("holidayDate", result.result.fromDate);
      // }

      if (result.result.fromDate === result.result.toDate) {
        formik.setFieldValue("holidayDate", result.result.toDate);
      } else {
        setAddRange(true);
        formik.setFieldValue("holidayDate", [result.result.fromDate, result.result.toDate]);
      }

      // setEmployeeList((prevSwitches) =>
      //   prevSwitches?.map((sw) =>
      //     result.result?.HolidayApplicable[0]?.employeeId?.includes(sw?.id)
      //       ? { ...sw, assign: true }
      //       : sw
      //   )
      // );

      setEmployeeList(result.result?.HolidayApplicable?.employeeId);
      setLocationList(result.result?.HolidayApplicable?.locationId);
      setDepartmentList(result.result?.HolidayApplicable?.departmentId);
      // setLocationList((prevSwitches) =>
      //   prevSwitches?.map((sw) =>
      //     result.result?.HolidayApplicable[0]?.locationId?.includes(sw?.id)
      //       ? { ...sw, assign: true }
      //       : sw
      //   )
      // );
      // setDepartmentList((prevSwitches) =>
      //   prevSwitches?.map((sw) =>
      //     result.result?.HolidayApplicable[0]?.departmentId?.includes(sw?.id)
      //       ? { ...sw, assign: true }
      //       : sw
      //   )
      // );
      console.log(employeeList);
      console.log(result.result?.HolidayApplicable);

      // setEmployeeId(result.result?.HolidayApplicable[0].employeeId);
      // setLocationId(result.result?.HolidayApplicable.locationId);
      // setDepartmentId(result.result?.HolidayApplicable.departmentId);
    }
  };
  useEffect(() => {
    // console.log(updateId);
    if (updateId) getHoliday();
  }, [updateId]);

  const formatDate = (date) => {
    // Ensure the date is in 'YYYY-MM-DD' format
    if (typeof date === "object" && date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date;
  };

  const updateHoliday = async () => {
    try {
      console.log(typeof formik.values.holidayDate, formik.values.holidayDate);

      // Ensure holidayDate is correctly formatted
      const holidayDate = Array.isArray(formik.values.holidayDate)
        ? formatDate(formik.values.holidayDate[0])
        : formatDate(formik.values.holidayDate);

      const payload = {
        id: updateId,
        companyId: companyId,
        holidayName: formik.values.holidayName,
        holidayType: formik.values.holidayType,
        description: formik.values.description,
        holidayDate: holidayDate, // Ensure it's a single date
        noOfdays: formik.values.noOfdays,
        isHalfDay: formik.values.isHalfDay,
        notifyApplicable: formik.values.notifyApplicable,
        reprocessLeaveApplication: formik.values.reprocessLeaveApplication,
        fromDate: Array.isArray(formik.values.holidayDate)
          ? formatDate(formik.values.holidayDate[0])
          : formatDate(formik.values.holidayDate),
        toDate: Array.isArray(formik.values.holidayDate)
          ? formatDate(formik.values.holidayDate[1])
          : formatDate(formik.values.holidayDate),
        employeeId: employeeCheckList
          ?.map((each) => each.assign && each.id)
          .filter((data) => data),
        departmentId: departmentCheckList
          ?.map((each) => each.assign && each.id)
          .filter((data) => data),
        locationId: locationCheckList
          ?.map((each) => each.assign && each.id)
          .filter((data) => data),
      };

      console.log("Payload: ", payload);

      const result = await action(API.UPDATE_HOLIDAY_DETAILS, payload);

      if (result.status === 200) {
        openNotification("success", "Success", result.message);
        setTimeout(() => {
          handleClose();
          refresh();
        }, 1000);
      } else {
        openNotification("error", "Failed...", result.message);
      }
      console.log(result);
    } catch (error) {
      openNotification("error", "Failed...", error.code);
      console.log(error);
    }
  };

  // const containerRef = useRef(null);

  // useLayoutEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // }, [activeBtnValue]);

  return (
    <div>
      <DrawerPop
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
          // background: "#F8FAFC",
        }}
        open={show}
        close={(e) => {
          //   console.log(e);
          handleClose();
        }}
        //   // className={classNames}
        //   handleSubmit={(e) => {
        //     // console.log(e);
        //     formik.handleSubmit();
        //   }}
        //   updateBtn={isUpdate}
        //   updateFun={() => {
        //     // updateCompany();
        //   }}
        header={[
          !updateId
            ? t("Create_Holiday_Policy")
            : t("Update_Selected_Holiday_Policy"),
          t("Manage_your_companies_holidays_here"),
        ]}
        headerRight={
          <div className="flex items-center gap-10">
            <p className="text-sm font-medium text-gray-400">
              Draft Saved 10 Seconds ago
            </p>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-medium text-gray-400">{t("help")}</p>
              <RxQuestionMarkCircled className="text-2xl font-medium text-gray-400 " />
            </div>
          </div>
        }
        footerBtn={[
          t("Cancel"),
          !isUpdate ? t("Save&Continue") : t("Update  Company"),
        ]}
        className="widthFull"
        background="#F8FAFC"
        stepsData={HolidaySteps}
        buttonClick={(e) => {
          console.log("Save & Continue button clicked");
          // console.log(activeBtnValue);
          if (activeBtnValue === "addHoliday") {
            // if (!updateId && !holidayId) {
            formik.handleSubmit();
            // } else {
            // setNextStep(nextStep + 1);
            // setTimeout(() => {
            //   window.scrollTo(0, 0);
            // }, 100);
            // }
            console.log("click 1");
          } else if (activeBtnValue === "applicability") {
            console.log("click 2");
            // setNextStep(nextStep + 1);
            // if (!updateId) {
            Formik2.handleSubmit();
            // } else {
            //   updateHoliday();
            //   setTimeout(() => {
            //     window.scrollTo(0, 0);
            //   }, 100);
            // }
          }

          // if (activeBtn < 4 && activeBtn !== nextStep) {
          //   /// && activeBtn !== nextStep
          //   setActiveBtn(1 + activeBtn);
          //   setNextStep(activeBtn);
          //   console.log(1 + activeBtn);
          // }
        }}
        buttonClickCancel={(e) => {
          if (activeBtn > 0) {
            setActiveBtn(activeBtn - 1);
            setNextStep(nextStep - 1);
            setActiveBtnValue(HolidaySteps?.[activeBtn - 1].data);
            console.log(activeBtn - 1);
          }
          //   setBtnName("");
        }}
        nextStep={nextStep}
        activeBtn={activeBtn}
        saveAndContinue={true}
      >
        <FlexCol className={"max-w-[898px] mx-auto"}>
          {HolidaySteps && (
            <Flex justify="center">
              <div className="sticky z-50 w-full px-5 pb-6  -top-6">
                <Stepper
                  steps={HolidaySteps}
                  currentStepNumber={activeBtn}
                  presentage={presentage}
                />
              </div>
            </Flex>
          )}
          <Flex justify="center" align="center" className="w-full">
            {activeBtnValue === "addHoliday" ? (
              <FlexCol gap={24} className={"w-full box-wrapper"}>
                <Heading
                  className={"col-span-2 "}
                  title={t("Holiday")}
                  description={t("Set_rules_for_holiday_policies")}
                />
                <div className="w-full flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <FormInput
                      title={t("Holiday_Name")}
                      change={(e) => {
                        formik.setFieldValue("holidayName", e);
                        if (e) {
                          console.log(presentage);
                          if (presentage < 0.2) setPresentage(presentage + 0.2);
                        } else {
                          setPresentage(presentage - 0.2);
                        }
                      }}
                      value={formik.values.holidayName}
                      error={formik.errors.holidayName}
                      placeholder={t("Holiday Name")}
                      required={true}
                    />
                    <Dropdown
                      title={t("Holiday_type")}
                      change={(e) => {
                        console.log(e);
                        formik.setFieldValue("holidayType", e);
                        if (e) {
                          if (presentage < 0.4) setPresentage(presentage + 0.2);
                        } else {
                          setPresentage(presentage - 0.2);
                        }
                      }}
                      value={formik.values.holidayType}
                      error={formik.errors.holidayType}
                      placeholder={t("Select_Holiday_Type")}
                      required={true}
                      options={holidayType}
                    />
                  </div>
                  <TextArea
                    className="col-span-2"
                    title={t("Description")}
                    change={(e) => {
                      formik.setFieldValue("description", e);
                      if (e) {
                        if (presentage < 0.6) setPresentage(presentage + 0.2);
                      } else {
                        setPresentage(presentage - 0.2);
                      }
                    }}
                    value={formik.values.description}
                    error={formik.errors.description}
                    required={true}
                    placeholder={t("Description")}
                  />
                  <div className="grid grid-cols-2 gap-4 w-full items-end ">
                    {!addRange && (
                      <DateSelect
                        title={t("Select_Date")}
                        // value={formik.values.holidayDate}
                        value={formik.values.holidayDate}
                        placeholder="Select Date"
                        change={(e) => {
                          console.log(e);
                          formik.setFieldValue("holidayDate", e);
                          if (e) {
                            if (presentage < 0.8)
                              setPresentage(presentage + 0.2);
                          } else {
                            setPresentage(presentage - 0.2);
                          }
                        }}
                        error={formik.errors.holidayDate}
                        required={true}
                      />
                    )}
                    {addRange && (
                      // <DateSelect
                      //   title="End Date"
                      //   change={(e) => {
                      //     formik.setFieldValue("to_date", e);
                      //     if (e) {
                      //       if (presentage < 1) setPresentage(presentage + 0.2);
                      //     } else {
                      //       setPresentage(presentage - 0.2);
                      //     }
                      //   }}
                      //   value={formik.values.to_date}
                      //   error={formik.errors.to_date}
                      //   placeholder=""
                      //   required={true}
                      // />
                      <RangeDatePicker
                        title={t("Select_Date_Range")}
                        change={(e) => {
                          console.log(e, "eee");
                          formik.setFieldValue("holidayDate", e);
                          if (e) {
                            if (presentage < 1) setPresentage(presentage + 0.2);
                          } else {
                            setPresentage(presentage - 0.2);
                          }
                        }}
                        value={formik.values.holidayDate}
                        error={
                          formik.errors.holidayDate
                            ? "Select Date Range is required"
                            : ""
                        }
                        required={true}
                      />
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <AddMore
                        name={`${
                          !addRange
                            ? t("Add_Date_Range")
                            : t("Remove_Date_Range")
                        }`}
                        className={`col-span-1`}
                        change={() => {
                          formik.setFieldValue("holidayDate", "");
                          if (!addRange) {
                            setAddRange(true);
                          } else {
                            setAddRange(false);
                          }
                        }}
                        icon={
                          !addRange ? (
                            <IoMdAdd />
                          ) : (
                            <RiDeleteBin5Line className=" text-rose-600" />
                          )
                        }
                      />
                    </div>
                  </div>

                  {!addRange && (
                    <div className="borderb rounded-[10px] px-5 py-3 col-span-2 max-h-[108px] items-start justify-start bg-[#FAFAFA] dark:bg-dark">
                      <div className="borderb flex items-center gap-2 rounded-xs w-fit p-2 bg-white dark:bg-dark">
                        <HalfDay className="2xl:w-4 w-2" />
                        <p className="2xl:text-sm text-xs font-medium">
                          {t("Half_Day")}
                        </p>
                        <CheckBoxInput
                          change={(e) => formik.setFieldValue("isHalfDay", e)}
                          value={parseInt(formik.values.isHalfDay)}
                        />
                      </div>

                      {formik.values.isHalfDay ? (
                        <RadioButton
                          title={""}
                          options={[
                            {
                              id: 1,
                              label: t("Forenoon"),
                              value: "firstHalf",
                            },
                            {
                              id: 2,
                              label: t("Afternoon"),
                              value: "secondHalf",
                            },
                          ]}
                          value={formik.values.halfDaySession}
                          change={(e) => {
                            console.log(e);
                            formik.setFieldValue("halfDaySession", e);
                          }}
                          error={
                            formik.values.halfDaySession
                              ? ""
                              : formik.errors.halfDaySession
                          }
                        />
                      ) : null}
                    </div>
                  )}

                  <FlexCol
                    className={
                      "col-span-2 md:grid grid-cols-2 px-5 py-6 border dark:border-white/10 rounded-lg bg-[#FAFAFA] dark:bg-dark"
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-0">
                      <h1 className="font-medium text-sm 2xl:text-base">
                        {t(
                          "No_of_days_before_when_the_reminder_email_is_to_be_sent"
                        )}
                      </h1>
                      <Dropdown
                        title=""
                        placeholder="Choose No. of Days "
                        value={formik.values.noOfdays}
                        options={[
                          {
                            label: "1",
                            value: 1,
                          },
                          {
                            label: "2",
                            value: 2,
                          },
                          {
                            label: "3",
                            value: 3,
                          },
                          {
                            label: "4",
                            value: 4,
                          },
                          {
                            label: "5",
                            value: 5,
                          },
                        ]}
                        change={(e) => {
                          formik.setFieldValue("noOfdays", e);
                        }}
                      />
                    </div>
                    <div className="flex col-span-2 gap-3 ">
                      <CheckBoxInput
                        value={parseInt(formik.values.notifyApplicable)}
                        change={(e) => {
                          formik.setFieldValue("notifyApplicable", e);
                        }}
                      />
                      <div className="flex flex-col">
                        <h2 className="font-medium text-sm 2xl:text-base">
                          {t("Notify_applicable_employees_via_feeds")}
                        </h2>
                        <p className="text-grey text-sm 2xl:text-base">
                          {t(
                            "They_will_receive_a_feed_instantly_once_this_holiday_is_saved"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex col-span-2 gap-3 ">
                      <CheckBoxInput
                        value={parseInt(
                          formik.values.reprocessLeaveApplication
                        )}
                        change={(e) => {
                          formik.setFieldValue("reprocessLeaveApplication", e);
                        }}
                      />
                      <div className="flex flex-col">
                        <h2 className="font-medium text-sm 2xl:text-base ">
                          {t(
                            "Reprocess_leave_application_based_on_this_addded_holiday"
                          )}
                        </h2>
                        <p className="text-grey text-sm 2xl:text-base ">
                          {t(
                            "Reprocess_leave_application_based_on_this_addded_holiday_description"
                          )}
                        </p>
                      </div>
                    </div>
                  </FlexCol>
                </div>
              </FlexCol>
            ) : (
              <EmployeeCheck
                title="Applicability"
                description="Manage your companies holidays here"
                employee={employeeList}
                department={departmentList}
                location={locationList}
                navigateBtn={navigateBtn}
                assignData={(employee, department, location) => {
                  // console.log(employee, department, location, "hhhhhh");
                  setEmployeeCheckList(employee);
                  setDepartmentCheckList(department);
                  setLocationCheckList(location);
                }}
              />
            )}
          </Flex>
        </FlexCol>
      </DrawerPop>
    </div>
  );
}

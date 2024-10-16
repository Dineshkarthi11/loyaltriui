import React, { useEffect, useMemo, useState } from "react";
import FormInput from "../../../common/FormInput";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ColorPicker, Flex, Tooltip } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action } from "../../../Api";
import ToggleBtn from "../../../common/ToggleBtn";
import TimeSelect from "../../../common/TimeSelect";
import DrawerPop from "../../../common/DrawerPop";
import CheckBoxInput from "../../../common/CheckBoxInput";
import moment from "moment";
import { useNotification } from "../../../../Context/Notifications/Notification";

export default function AddShift({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
}) {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState(false);
  const [companyId, setCompanyId] = useState();

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

  const [checkintime, setCheckintime] = useState("");
  const [checkoutime, setCheckoutTime] = useState("");
  const [CheckoutError, setCheckouterror] = useState("");
  const [checkinError, setCheckinError] = useState("");
  const [flexibleTimingState, setFlexibleTimingState] = useState(0);
  const [hourerror, sethourerror] = useState("");
  const [minuteError, setminuteError] = useState("");
  const [hours, sethour] = useState("");
  const [minute, setMinutes] = useState("");
  const [shiftBreak, setShiftBreak] = useState("");
  const [shiftBreakerror, setShiftbreakerror] = useState("");
  const [breakto, setbreakto] = useState("");
  const [breakFrom, setBreakfrom] = useState("");
  const [breaktoerror, setbreaktoerror] = useState("");
  const [breakfromerror, setBreakfromerror] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [checkvalue, setCheckvalue] = useState(0);
  const [togglevalue, setToggle] = useState(0);
  const [flextoggle, setflextoggle] = useState(0);
  const validateTimes = (checkInTime, checkOutTime, isNightShift) => {
    if (isNightShift === 0) {
      if (checkInTime && checkOutTime) {
        if (checkInTime >= checkOutTime) {
          setCheckinError(
            t("Check-in time must be earlier than check-out time")
          );
          setCheckouterror(
            t("Check-out time must be later than check-in time")
          );
          setError(true);
        } else {
          setError(false);
          setCheckinError(null);
          setCheckouterror(null);
        }
      }
    } else {
      setError(false);
      setCheckinError(null);
      setCheckouterror(null);
    }
  };

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const colors = [
    {
      id: 1,
      title: "staleBlue",
      value: "#6A38EF",
    },
    {
      id: 2,
      title: "pink",
      value: "#7939EF",
    },
    {
      id: 3,
      title: "green",
      value: "#0A9250",
    },
    {
      id: 4,
      title: "skyBlue",
      value: "#2E90FB",
    },
  ];

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  };

  const timeToMinutes = ({ hours, minutes }) => {
    return hours * 60 + minutes;
  };

  const minutesToTime = (totalMinutes) => {
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24; // To wrap around the 24-hour clock
    const extraHours = Math.floor(totalHours / 24) * 24; // To track the number of hours past 24
    const mins = totalMinutes % 60;
    return {
      formatted: `${String(hours + extraHours).padStart(2, "0")}:${String(
        mins
      ).padStart(2, "0")}`,
      hours: hours + extraHours,
      minutes: mins,
    };
    // const hours = Math.floor(totalMinutes / 60);
    // const minutes = totalMinutes % 60;
    // return {
    //   hours,
    //   minutes,
    //   formatted: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    //     2,
    //     "0"
    //   )}`,
    // };
  };

  const getHalfTime = (startTimeStr, endTimeStr) => {
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);

    const startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);

    // Handle the case where the end time is on the next day
    if (endMinutes < startMinutes) {
      endMinutes += 1440; // Add 24 hours in minutes to end time
    }

    const halfDuration = (endMinutes - startMinutes) / 2;
    const halfTimeInMinutes = startMinutes + halfDuration;

    return minutesToTime(halfTimeInMinutes % 1440).formatted;
    // const startTime = parseTime(startTimeStr);
    // const endTime = parseTime(endTimeStr);

    // const startMinutes = timeToMinutes(startTime);
    // const endMinutes = timeToMinutes(endTime);

    // const halfDuration = (endMinutes - startMinutes) / 2;
    // const halfTimeInMinutes = startMinutes + halfDuration;

    // return minutesToTime(halfTimeInMinutes).formatted;
  };

  const formik = useFormik({
    initialValues: {
      shift: "",
      flexibleTiming: 0,
      color: "#000",
      checkInTime: "",
      checkOutTime: "",
      allowBreaks: 0,
      shiftBreakDuration: "",
      shiftHours: "",
      shiftMinutes: "",
      isNightShift: 0,
      fixedBreak: 0,
      breakFrom: "",
      breakTo: "",
      halfTime: "",
    },
    validateOnChange: false,
    enableReinitialize: true,
    // validate: (values) => {
    //   const errors = {};

    //   if (
    //     values.isNightShift === 0 &&
    //     values.checkInTime < values.checkOutTime
    //   ) {
    //     errors.remarks = t("Change checkout time");
    //   }
    //   // if (
    //   //   values.isNightShift === 0 &&
    //   //   values.checkInTime &&
    //   //   values.checkOutTime &&
    //   //   values.breakDuration
    //   // ) {
    //   // if (values.breakDuration < checkInTime || breakDuration > checkOutTime) {
    //   // setShiftbreakerror(
    //   console.log("dddddddddddddddddd");
    //   errors.shiftBreakDuration = t(
    //     "Break duration must be within the check-in and check-out times"
    //   );
    //   // );
    //   // }
    //   // }

    //   return errors;
    // },
    validationSchema: yup.object().shape({
      shift: yup.string().required("Shift is required"),
      // color: yup.string().required("Color is required"),
      checkInTime:
        flextoggle === 0
          ? yup.string().required("CheckInTime is required")
          : "",
      checkOutTime:
        flextoggle === 0
          ? yup.string().required("CheckInTime is required")
          : "",
      breakTo:
        checkvalue === 1 && togglevalue === 1
          ? yup.string().required("Break From is required")
          : "",
      breakFrom:
        checkvalue === 1 && togglevalue === 1
          ? yup.string().required("Break To is required")
          : "",
      // checkOutTime: yup.string().when("isNightShift", {
      //   is: 0,
      //   then: yup.string().required("CheckOutTime is required"),
      // }),
      // checkOutTime: formik.values.isNightShift===0?formik.values.isNightShift<yup.string().required("CheckOutTime Required"),
      shiftBreakDuration:
        checkvalue === 0 && togglevalue === 1
          ? yup.string().required("Break Duration Required")
          : "",
      // shiftHours: yup.string().required("shiftHours Required"),
      // shiftMinutes: yup.string().required("shiftMinutes Required"),
    }),
    // validate:()=>{},
    onSubmit: async (e) => {
      let hasError = false;
      if (formik.values.flexibleTiming === 0 && !formik.values.checkInTime) {
        setCheckinError("Checkin time required");
        hasError = true;
      } else {
        setCheckinError("");
      }
      if (formik.values.flexibleTiming === 0 && !formik.values.checkOutTime) {
        setCheckouterror("Checkout time required");
        hasError = true;
      } else {
        setCheckouterror("");
      }
      if (formik.values.flexibleTiming === 1 && !hours) {
        sethourerror("Hours is required");
        hasError = true;
      } else {
        sethourerror("");
      }
      if (formik.values.flexibleTiming === 1 && !minute) {
        setminuteError("Minutes is required");

        hasError = true;
      } else {
        setminuteError("");
      }

      if (
        formik.values.allowBreaks === 1 &&
        formik.values.fixedBreak === 0 &&
        !shiftBreak
      ) {
        setShiftbreakerror("Unpaidbreak Duration is required");
        hasError = true;
      } else {
        setShiftbreakerror("");
      }
      if (
        formik.values.allowBreaks === 1 &&
        formik.values.fixedBreak === 1 &&
        !breakto
      ) {
        setbreaktoerror("Break To is required");
        hasError = true;
      } else {
        setbreaktoerror("");
      }
      if (
        formik.values.allowBreaks === 1 &&
        formik.values.fixedBreak === 1 &&
        !breakFrom
      ) {
        setBreakfromerror("Break From is required");
        hasError = true;
      } else {
        setBreakfromerror("");
      }

      if (hasError || error) {
        return;
      }
      try {
        const result = await action(
          API.ADD_SHIFT,
          {
            companyId: companyDataId,
            shift: e.shift,
            flexibleTiming: e.flexibleTiming,
            shiftColor: e.color,
            startTime: e.checkInTime,
            endTime: e.checkOutTime,
            allowBreaks: e.allowBreaks,
            shiftBreakDuration: e.shiftBreakDuration,
            shiftHours: e.shiftHours,
            shiftMinutes: e.shiftMinutes,
            isNightShift: e.isNightShift,
            isFixedBreak: e.fixedBreak,
            halfTime: e.halfTime,
            breakFrom: e.breakFrom,
            breakTo: e.breakTo,
          }
          // "http://192.168.0.44/loyaltri-server/api/main"
        );
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          formik.resetForm();
          setLoading(true);
          setTimeout(() => {
            handleClose();
            refresh();
          }, 1000);
        } else {
          openNotification("error", "Info", result.message);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });
  useMemo(() => <TimeSelect />, [formik.values.checkInTime]);
  useEffect(() => {
    validateTimes(
      formik.values.checkInTime,
      formik.values.checkOutTime,
      formik.values.isNightShift
    );
  }, [
    formik.values.checkInTime,
    formik.values.checkOutTime,
    formik.values.isNightShift,
  ]);

  const validateBreakDuration = (
    breakDuration,
    checkInTime,
    checkOutTime,
    isNightShift
  ) => {
    // Parse the times using moment.js
    const format = "HH:mm";
    const checkIn = moment(checkInTime, format);
    const checkOut = moment(checkOutTime, format);

    // Calculate the duration in minutes
    const durationMinutes = checkOut.diff(checkIn, "minutes");

    // Convert minutes to hours and minutes
    // const hours = Math.floor(durationMinutes / 60);
    // const minutes = durationMinutes % 60;

    const DuractionMin = moment(breakDuration, format);
    const Duraction = moment("00:00", format);

    const BreakDuraction = DuractionMin.diff(Duraction, "minutes");

    if (
      isNightShift === 0 &&
      checkInTime &&
      checkOutTime &&
      breakDuration &&
      formik.values.fixedBreak === 0
    ) {
      // if (breakDuration < checkInTime || breakDuration > checkOutTime) {
      // console.log(`${hours}:${minutes}`, breakDuration);
      if (durationMinutes < BreakDuraction) {
        setShiftbreakerror(
          t("Break duration must be within the check-in and check-out times")
        );
      } else {
        setShiftbreakerror(null);
      }
    } else {
      setShiftbreakerror(null);
    }
  };

  const validateBreakTimes = (
    breakFrom,
    breakTo,
    checkInTime,
    checkOutTime,
    isNightShift
  ) => {
    // console.log(breakFrom);
    // console.log(new Date(new Date(dayjs(breakFrom, "HH:mm"))), "break From");
    // console.log(new Date(breakTo), "break To");
    const timeToMinutes = (time) => {
      if (time !== null) {
        const [hours, minutes] = time?.split(":").map(Number);
        return hours * 60 + minutes;
      }
    };
    const checkInMinutes = timeToMinutes(checkInTime);
    const checkOutMinutes = timeToMinutes(checkOutTime);

    const breakCheckIn = timeToMinutes(breakFrom);
    const breakCheckOut = timeToMinutes(breakTo);

    // if (
    //   checkInMinutes < breakCheckIn &&
    //   checkOutMinutes > breakCheckOut &&
    //   checkOutMinutes > breakCheckIn &&
    //   breakCheckIn < breakCheckOut
    // ) {
    //   console.log("Cccccccccccccccccccccc.");
    // } else {
    //   console.log("rrrrrrrrrrr");
    // }
    if (
      isNightShift === 0 &&
      checkInTime &&
      checkOutTime &&
      breakFrom &&
      breakTo
    ) {
      if (breakFrom < checkInTime || breakFrom > checkOutTime) {
        setBreakfromerror(
          t("Break From must be within the check-in and check-out time")
        );
      } else {
        setBreakfromerror(null);
      }
      if (breakTo < checkInTime || breakTo > checkOutTime) {
        setbreaktoerror(
          t("Break To must be within the check-in and check-out time")
        );
      } else {
        setbreaktoerror(null);
      }
      if (breakFrom >= breakTo) {
        setBreakfromerror(t("Break From must be earlier than Break To"));
        setbreaktoerror(t("Break To must be later than Break From"));
      }
    } else {
      setBreakfromerror(null);
      setbreaktoerror(null);
    }
  };
  useEffect(() => {
    validateBreakTimes(
      formik.values.breakFrom,
      formik.values.breakTo,
      formik.values.checkInTime,
      formik.values.checkOutTime,
      formik.values.isNightShift
    );
  }, [
    formik.values.breakFrom,
    formik.values.breakTo,
    formik.values.checkInTime,
    formik.values.checkOutTime,
    formik.values.isNightShift,
  ]);

  const getIdBasedShiftList = async (e) => {
    // console.log(updateId, "e");
    if (e !== "" && updateId !== false) {
      const result = await action(API.GET_SHIFT_ID_BASED_RECORDS, { id: e });
      // console.log(
      //   typeof parseInt(result.result.flexibleTiming),
      //   "esdddddddddddd"
      // );

      if (result.status === 200) {
        setCompanyId(result.result.companyId);
        formik.setFieldValue("shift", result.result.shift);
        formik.setFieldValue(
          "flexibleTiming",
          parseInt(result.result?.flexibleTiming)
        );
        formik.setFieldValue("color", result.result.shiftColor);
        formik.setFieldValue("shiftHours", result.result.shiftHours);
        formik.setFieldValue("shiftMinutes", result.result.shiftMinutes);
        formik.setFieldValue("checkInTime", result.result.startTime);
        formik.setFieldValue("checkOutTime", result.result.endTime);
        formik.setFieldValue(
          "allowBreaks",
          parseInt(result.result.allowBreaks)
        );
        formik.setFieldValue("halfTime", result.result.halfTime);
        formik.setFieldValue(
          "fixedBreak",
          parseInt(result.result.isFixedBreak)
        );
        formik.setFieldValue("breakFrom", result.result.breakFrom);
        formik.setFieldValue("breakTo", result.result.breakTo);

        // formik.setFieldValue("allowBreaks", result.result.allowBreaks);
        formik.setFieldValue(
          "shiftBreakDuration",
          result.result.shiftBreakDuration
        );
        formik.setFieldValue(
          "isNightShift",
          parseInt(result.result.isNightShift)
        );
        setIsUpdate(true);
      }
      // setGetIdBasedUpdatedRecords(result.data);
      // console.log("result.data");
    }
  };

  useEffect(() => {
    if (updateId) {
      // console.log(updateId, "updateData");
      getIdBasedShiftList(updateId);
    }
  }, [updateId]);

  const updateIdBasedShift = async () => {
    const result = await action(
      API.UPDATE_SHIFT,
      {
        shiftId: updateId,
        companyId: companyId,
        shift: formik.values.shift,
        flexibleTiming: formik.values.flexibleTiming,
        shiftColor: formik.values.color,
        startTime: formik.values.checkInTime,
        endTime: formik.values.checkOutTime,
        allowBreaks: formik.values.allowBreaks,
        shiftBreakDuration: formik.values.shiftBreakDuration,
        shiftHours: formik.values.shiftHours,
        shiftMinutes: formik.values.shiftMinutes,
        isNightShift: formik.values.isNightShift,
        halfTime: formik.values.halfTime,
        isFixedBreak: formik.values.fixedBreak,
        breakFrom: formik.values.breakFrom,
        breakTo: formik.values.breakTo,
      }
      // "http://192.168.0.44/loyaltri-server/api/main"
    );
    if (result.status === 200) {
      openNotification("success", "Successful", result.message);
      setTimeout(() => {
        handleClose();
        refresh();
      }, 1500);
    } else {
      openNotification("error", "Failed ", result.message);
    }
  };

  // useEffect(() => {
  //   console.log(isUpdate, "isUpdate");
  //   console.log(formik.values.shift, "formik.values.shift]");
  // }, [formik.values.shift, isUpdate]);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
        setIsUpdate(!isUpdate);

        // if (!e) {
        // console.log(isUpdate, "not e");
        //   // setFunctionRender(!functionRender);
        formik.setFieldValue("shift", "");
        formik.setFieldValue("flexibleTiming", 0);
        formik.setFieldValue("color", "#000");
        formik.setFieldValue("shiftHours", "");
        formik.setFieldValue("shiftMinutes", "");
        formik.setFieldValue("checkInTime", "");
        formik.setFieldValue("checkOutTime", "");
        formik.setFieldValue("allowBreaks", "");
        formik.setFieldValue("shiftBreakDuration", "");
        formik.setFieldValue("halfTime", "");
        // }
        // console.log(e);
        // close(e);
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      // handleSubmit={formik.handleSubmit()}
      updateBtn={isUpdate}
      updateFun={() => {
        updateIdBasedShift();
      }}
      header={[
        !isUpdate ? t("Add_a_New_Shift") : t("Update_Shift"),
        !isUpdate
          ? t("Add_a_New_Shift_Description")
          : t("Update_Selected_Shift"),
      ]}
      footerBtn={[t("Cancel"), !isUpdate ? t("Save") : t("Update_Shift")]}
      footerBtnDisabled={loading}
      // header={[t("Add a New Shift"), t("Add a New Shift Description")]}
      // footerBtn={[t("Cancel"), t("Add Shift")]}
    >
      <div className="relative flex flex-col w-full h-full gap-8">
        {/* <div className=""> */}
        <FormInput
          title={t("Shift_Name")}
          placeholder={t("Shift_Name")}
          value={formik.values.shift}
          change={(e) => {
            formik.setFieldValue("shift", e);
          }}
          error={formik.values.shift ? "" : formik.errors.shift}
          required={true}
          //   className="border-rose-600 "
        />

        {/* <div className="flex items-center gap-8 "> */}
        <div className="flex items-center col-span-3 dark:text-white">
          <p className="pr-2 mb-0 text-sm font-semibold font-Inter">
            {t("Choose_Color")}
          </p>

          <div className="flex items-center gap-2">
            {colors.map((each) => (
              <Tooltip title={each.title}>
                <div key={each.id}>
                  <div
                    className={`flex cursor-pointer ${
                      each.value === formik.values.color
                        ? `border-${each.value} border-2 rounded-full`
                        : ""
                    }`}
                    onClick={() => {
                      formik.setFieldValue("color", each.value);
                    }}
                    style={{ borderColor: each.value }}
                  >
                    <div
                      className={`2xl:w-6 2xl:h-6 w-5 h-5 rounded-full bg-${
                        each.value
                      } ${
                        each.value === formik.values.color
                          ? "border border-white"
                          : ""
                      }`}
                      style={{ backgroundColor: each.value }}
                    >
                      {/* {each.value} */}
                    </div>
                  </div>
                </div>
              </Tooltip>
            ))}
            <ColorPicker
              value={""}
              onChange={(e, i) => {
                formik.setFieldValue("color", i);
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center col-span-3 dark:text-white">
          <Flex>
            <ToggleBtn
              // title=" Flexible Working Timing"
              value={formik.values.flexibleTiming}
              change={(checked) => {
                setflextoggle(checked);
                formik.setFieldValue("shiftHours", "");
                formik.setFieldValue("shiftMinutes", "");
                formik.setFieldValue("checkInTime", "");
                formik.setFieldValue("checkOutTime", "");
                formik.setFieldValue("flexibleTiming", checked ? 1 : 0);
                const value = checked ? 1 : 0;
                setFlexibleTimingState(value);
              }}
              flexText={true}
            />
            <span className="px-3 text-sm font-semibold translate-y-0.5">
              {t("Flexible_Working_Timing")}
            </span>
          </Flex>
          {formik.values.flexibleTiming === 0 && (
            <Flex>
              <ToggleBtn
                // titleRight="Flexible Working Timing"
                value={formik.values.isNightShift}
                change={(checked) => {
                  // formik.setFieldValue("shiftHours", "");
                  // formik.setFieldValue("shiftMinutes", "");
                  // formik.setFieldValue("checkInTime", "");
                  // formik.setFieldValue("checkOutTime", "");
                  formik.setFieldValue("isNightShift", checked ? 1 : 0);
                  validateTimes(
                    formik.values.checkInTime,
                    formik.values.checkOutTime,
                    checked ? 1 : 0
                  );
                  validateBreakTimes(
                    formik.values.breakFrom,
                    formik.values.breakTo,
                    formik.values.checkInTime,
                    formik.values.checkOutTime,
                    checked ? 1 : 0
                  );
                  validateBreakDuration(
                    formik.values.shiftBreakDuration,
                    formik.values.checkInTime,
                    formik.values.checkOutTime,
                    checked ? 1 : 0
                  );
                }}
                flexText={true}
              />
              <span className="px-3 text-sm font-semibold translate-y-0.5">
                {t("Night_Shift")}
              </span>
            </Flex>
          )}
        </div>

        {/* </div> */}
        {parseInt(formik.values.flexibleTiming) === 1 ? (
          <div className="grid items-end grid-cols-6 gap-3">
            <div className="col-span-3 relative">
              <TimeSelect
                title="Hours employees needs to work"
                change={(e) => {
                  // console.log(e);
                  formik.setFieldValue("shiftHours", e);
                  sethour(e);
                }}
                value={formik.values.shiftHours}
                // value={"07"}
                className=""
                placeholder="Choose Hours"
                format={"HH"}
                error={hourerror}
                showErrorMessage={false}
              />
              <div className="absolute -bottom-4">
                {hourerror && (
                  <p className="flex justify-start items-center my-1 mb-0 text-[10px] text-red-500">
                    <span className="text-[10px] pl-1 pt-2">{hourerror}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-3 relative">
              <TimeSelect
                title=" "
                change={(e) => {
                  formik.setFieldValue("shiftMinutes", e);
                  setMinutes(e);
                }}
                value={formik.values.shiftMinutes}
                className=""
                placeholder="Choose Minutes"
                format={"mm"}
                error={minuteError}
                showErrorMessage={false}
              />
              <div className="absolute -bottom-4">
                {minuteError && (
                  <p className="flex justify-start items-center my-1 mb-0 text-[10px] text-red-500">
                    <span className="text-[10px] pl-1 pt-2">{minuteError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <TimeSelect
              title={t("Check_In_Time")}
              change={(e) => {
                formik.setFieldValue("checkInTime", e);
                setCheckintime(e);
                validateTimes(
                  e,
                  formik.values.checkOutTime,
                  formik.values.isNightShift
                );
                validateBreakDuration(
                  formik.values.shiftBreakDuration,
                  e,
                  formik.values.checkOutTime
                );
                validateBreakTimes(
                  formik.values.breakFrom,
                  formik.values.breakTo,
                  e,
                  formik.values.checkOutTime
                );
              }}
              required={true}
              value={formik.values.checkInTime}
              className=""
              placeholder={t("Choose Check In Time")}
              format={"HH:mm"}
              error={checkinError || formik.errors.checkInTime}
            />
            <TimeSelect
              title={t("Check_Out_Time")}
              change={(e) => {
                formik.setFieldValue("checkOutTime", e);
                formik.setFieldValue(
                  "halfTime",
                  getHalfTime(formik.values.checkInTime, e)
                );
                setCheckoutTime(e);
                validateTimes(
                  formik.values.checkInTime,
                  e,
                  formik.values.isNightShift
                );
                validateBreakDuration(
                  formik.values.shiftBreakDuration,
                  formik.values.checkInTime,
                  e
                );
                validateBreakTimes(
                  formik.values.breakFrom,
                  formik.values.breakTo,
                  formik.values.checkInTime,
                  e
                );
              }}
              required={true}
              value={formik.values.checkOutTime}
              className=""
              placeholder={t("Choose Check Out Time")}
              format={"HH:mm"}
              error={CheckoutError || formik.errors.checkOutTime}
            />
            <TimeSelect
              title={t("Half Time")}
              change={(e) => {
                formik.setFieldValue("halfTime", e);
              }}
              value={formik.values.halfTime}
              className=""
              placeholder={t("Choose Half Time ")}
              format={"HH:mm"}
              error={formik.errors.halfTime}
            />
          </div>
        )}

        {formik.values.flexibleTiming === 0 && (
          <>
            <div className="flex items-end dark:text-white">
              <ToggleBtn
                // title=" Flexible Working Timing"
                value={formik.values.allowBreaks}
                change={(checked) => {
                  setToggle(checked);
                  formik.setFieldValue("allowBreaks", checked);
                  formik.setFieldValue("shiftBreakDuration", "");
                  formik.setFieldValue("fixedBreak", 0);
                }}
                flexText={true}
              />
              <span className="px-3 text-sm font-semibold">
                {t("Allow_Breaks")}
              </span>
              <div className="color_hower"></div>
            </div>
            {formik.values.allowBreaks ? (
              <div className=" border-solid bg-[#fbfbfb] dark:bg-secondaryDark flex flex-col gap-4   justify-center p-6  items-start border-black/10 border rounded-lg">
                <CheckBoxInput
                  titleRight={t("Fixed Break")}
                  value={formik.values.fixedBreak}
                  // options={options}
                  change={(e) => {
                    setCheckvalue(e);
                    // console.log(e);
                    formik.setFieldValue("fixedBreak", e);
                    formik.setFieldValue("breakFrom", "");
                    formik.setFieldValue("breakTo", "");
                  }}

                  // error={formik.errors.shiftBreakDuration}
                />
                <div className=" grid grid-cols-2 gap-3">
                  {parseInt(formik.values.fixedBreak) === 1 ? (
                    <>
                      <TimeSelect
                        title={t("Break From")}
                        value={formik.values.breakFrom}
                        required={true}
                        // options={options}
                        change={(e) => {
                          // console.log(e);
                          formik.setFieldValue("breakFrom", e);
                          setBreakfrom(e);
                          validateBreakTimes(
                            e,
                            formik.values.breakTo,
                            formik.values.checkInTime,
                            formik.values.checkOutTime,
                            formik.values.isNightShift
                          );
                        }}
                        placeholder={t("Choose Break From")}
                        // description={t("Unpaid_break_duration_description")}
                        error={breakfromerror || formik.errors.breakFrom}
                      />
                      <TimeSelect
                        title={t("Break To")}
                        required={true}
                        value={formik.values.breakTo}
                        // options={options}
                        change={(e) => {
                          // console.log(e);
                          formik.setFieldValue("breakTo", e);
                          setbreakto(e);
                          validateBreakTimes(
                            formik.values.breakFrom,
                            e,
                            formik.values.checkInTime,
                            formik.values.checkOutTime,
                            formik.values.isNightShift
                          );
                        }}
                        placeholder={t("Choose Break To")}
                        // description={t("Unpaid_break_duration_description")}
                        error={breaktoerror || formik.errors.breakTo}
                      />
                    </>
                  ) : (
                    <TimeSelect
                      title={t("Unpaid_break_duration")}
                      value={formik.values.shiftBreakDuration}
                      required={true}
                      // options={options}
                      change={(e) => {
                        // console.log(e);
                        formik.setFieldValue("shiftBreakDuration", e);
                        setShiftBreak(e);
                        validateBreakDuration(
                          e,
                          formik.values.checkInTime,
                          formik.values.checkOutTime,
                          formik.values.isNightShift
                        );
                      }}
                      placeholder={t("Choose_Time")}
                      // description={t("Unpaid_break_duration_description")}
                      error={
                        shiftBreakerror || formik.errors.shiftBreakDuration
                      }
                    />
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </DrawerPop>
  );
}

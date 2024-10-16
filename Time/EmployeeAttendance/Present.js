import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import { Flex } from "antd";
import Dropdown from "../../common/Dropdown";
import TimeSelect from "../../common/TimeSelect";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Present({
  open,
  close = () => {},
  attendanceId,
  companyDataId,
  refresh = () => {},
  date,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [selectedShift, setSelectedShift] = useState(null);
  const [checkinError, setCheckinError] = useState("");
  const [CheckoutError, setCheckoutError] = useState("");
  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };
  const [shift, setShift] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  const handleClose = () => {
    close(false);
  };
  const validateTimes = (checkInTime, checkOutTime) => {
    if (parseInt(selectedShift?.isNightShift) === 0) {
      // Day shift validation
      if (checkInTime && checkOutTime) {
        if (checkInTime >= checkOutTime) {
          setCheckinError(
            t("Check-in time must be earlier than check-out time")
          );
          setCheckoutError(
            t("Check-out time must be later than check-in time")
          );
          return false;
        }
      }
    } else if (parseInt(selectedShift?.isNightShift) === 1) {
      // Night shift validation
      if (checkInTime && checkOutTime) {
        if (checkInTime <= checkOutTime) {
          setCheckinError(
            t(
              "Check-in time must be later than check-out time for a night shift"
            )
          );
          setCheckoutError(
            t(
              "Check-out time must be earlier than check-in time for a night shift"
            )
          );
          return false;
        }
      }
    }

    setCheckinError(null);
    setCheckoutError(null);
    return true;
  };

  const getShift = async () => {
    try {
      const result = await action(API.GET_SHIFT_RECORDS, {
        companyId: companyId,
      });
      setShift(
        result.result?.map((each) => ({
          label: each.shift,
          value: each.shiftId,
          color: each.shiftColor,
          isNightShift: parseInt(each.isNightShift),
        }))
      );
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getShift();
  }, []);
  const getEmployeeDetails = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_ATTENDENCE_ID_BASED, {
        id: attendanceId,
      });
      setEmployeeDetails(result.result);
      if (result.result.status === "Present") {
        formik.setFieldValue("shift", result.result.shiftId);
        formik.setFieldValue("checkInTime", result.result.firstCheckInTime);
        formik.setFieldValue("checkOutTime", result.result.lastCheckOutTime);
        setSelectedShift(
          shift.find(
            (shift) => parseInt(shift.value) === parseInt(result.result.shiftId)
          )
        );
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      shift: null,
      checkInTime: null,
      checkOutTime: null,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: yup.object().shape({
      shift: yup.string().required("Shift is Required"),
      checkInTime: yup.string().required("Check In Time is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      const validationComplete = validateTimes(e.checkInTime, e.checkOutTime);

      if (validationComplete) {
        try {
          const result = await action(API.ADD_EMPLOYEE_STATUS, {
            status: "Present", // Half Day, Absent, Fine, Overtime, Leave
            employeeAttendanceId: attendanceId,
            createdBy: employeeId,
            employeeAttendanceDate: date,
            employeeId: employeeDetails?.employeeId,
            shiftAssign: {
              // Present and Half Day
              employeeAttendanceId: attendanceId,
              shiftId: e.shift,
              firstCheckInTime: e.checkInTime,
              lastCheckOutTime: e.checkOutTime,
            },
          });

          console.log("result");

          if (result.status === 200) {
            openNotification("success", "Successful", result.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 500);
            formik.resetForm();
          } else {
            openNotification("error", "Failed..", result.message);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          openNotification("error", "Failed", error);
          setLoading(false);
        }
      } else {
        setLoading(false); // Stop loading if validation fails
      }
    },
  });

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        close(e);
      }}
      contentWrapperStyle={
        {
          // maxWidth: "600px",
        }
      }
      handleSubmit={(e) => {
        // console.log(e);
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[
        t("Present"),
        t("Adjust time by manually entering punch-in and punch-out times here"),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={""} gap={30}>
        <Flex justify="space-between" align="">
          <Flex gap={16} align="center">
            <h1 className=" relative font-semibold text-xl w-16 h-16 bg-primaryLight text-primary rounded-full flex items-center justify-center">
              {employeeDetails?.employeeName.charAt(0).toUpperCase()}
              {/* <div className=" absolute bottom-1 right-0 w-4 h-4 bg-green rounded-full border-2 border-white"></div> */}
            </h1>

            <div>
              <h1 className="h1">
                {employeeDetails?.employeeName.charAt(0).toUpperCase() +
                  employeeDetails?.employeeName?.slice(1)}
              </h1>
              <p className="para">{employeeDetails?.email}</p>
            </div>
          </Flex>
          <Flex
            gap={4}
            //   className=" px-3 py-1 rounded-full bg-[#F2F4F7] text-grey h-fit text-sm font-medium"
            align="center"
          >
            {/* <FiClock /> */}
            <p className=" flex gap-1 font-medium text-[10px] text-grey">
              <span>Date :</span>
              <span>
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </p>
          </Flex>
        </Flex>
        <FlexCol className={"p-4 grid grid-cols-2"} gap={20}>
          <Dropdown
            title="Shift Name"
            placeholder="Select Shift"
            required={true}
            className=" col-span-2"
            options={shift}
            change={(e) => {
              formik.setFieldValue("shift", e);
              setSelectedShift(shift.find((shift) => shift.value === e));
            }}
            value={formik.values.shift}
            error={formik.errors.shift}
          />
          {selectedShift && (
            <div className="col-span-2 text-primary text-xs 2xl:text-sm font-medium">
              {selectedShift.label} is a{" "}
              {selectedShift.isNightShift === 0 ? "Morning" : "Night"} shift
            </div>
          )}

          <TimeSelect
            title="Check In Time"
            placeholder="Choose Time"
            change={(e) => {
              formik.setFieldValue("checkInTime", e);
            }}
            value={formik.values.checkInTime}
            format="HH:mm"
            error={formik.errors.checkInTime || checkinError}
            required={true}
          />
          <TimeSelect
            title="Check Out Time"
            placeholder="Choose Time"
            change={(e) => {
              formik.setFieldValue("checkOutTime", e);
            }}
            value={formik.values.checkOutTime}
            format="HH:mm"
            error={formik.errors.checkOutTime || CheckoutError}
            // required={true}
          />
          {/* <Flex gap={10}>
            <ButtonClick buttonName={"Add Shift"} />
            <div className="p-2 rounded-md border cursor-pointer">
              <MdOutlineDelete className=" text-red-900" />
            </div>
          </Flex> */}
        </FlexCol>
      </FlexCol>
    </DrawerPop>
  );
}

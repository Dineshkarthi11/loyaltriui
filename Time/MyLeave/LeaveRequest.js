/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import PAYROLLAPI, { Payrollaction } from "../../PayRollApi";
import { DatePicker, Flex } from "antd";
import Dropdown from "../../common/Dropdown";
import FormInput from "../../common/FormInput";
import ToggleBtn from "../../common/ToggleBtn";
import TextArea from "../../common/TextArea";
import Heading from "../../common/Heading";
import { useFormik } from "formik";
import * as yup from "yup";
import API, { action, fileAction } from "../../Api";
import { leaveSection } from "../../data";
import moment from "moment";
import FileUpload from "../../common/FileUpload";
import { useNotification } from "../../../Context/Notifications/Notification";
import dayjs from "dayjs";
import { FaAsterisk } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function LeaveRequest({
  open,
  close = () => {},
  employeeId,
  updateId = null,
  companyDataId,
  refresh = () => {},
  leaveId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeLeave, setEmployeeLeave] = useState([]);
  const [employeeLeaveBalance, setEmployeeLeaveBalance] = useState(0);
  const [employeeLeaveApplied, setEmployeeLeaveApplied] = useState(0);
  const [employeeLeaveApproved, setEmployeeLeaveApproved] = useState(0);
  const [employeeLeaveTotal, setEmployeeLeaveTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disabledData, setDisabledData] = useState([]);
  const [restrictedHolidays, setRestrictedHolidays] = useState([]);
  const [leaveid, setLeaveid] = useState();
  const [employeeLeaveDataEnable, setEmployeeLeaveDataEnable] = useState(false);

  const { RangePicker } = DatePicker;

  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });

  const [leaveCycleStart, setLeaveCycleStart] = useState(null);

  const [leaveRequestDetails, setLeaveRequestDetails] = useState({});
  const [holiday, setHoliday] = useState([]);
  const [filterDays, setFilterDays] = useState(null);
  const [loginId, setloginId] = useState(localStorageData.employeeId);
  const [leaveSeactiondata, setLeaveSeactiondata] = useState(null);
  const [attachname, setAttachname] = useState();
  const [attachurl, setAttachurl] = useState();
  const [isRestrictedHoliday, setIsRestrictedHoliday] = useState(false);

  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  useMemo(
    () =>
      setTimeout(() => {
        show === false && close(false);
      }, 800),
    [show]
  );

  useEffect(() => {
    console.log(employeeId, "employeeId");
  }, [employeeId]);

  const handleClose = () => {
    setShow(false);
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
  const getEmployeeLeaveType = async () => {
    const result = await action(API.GET_EMPLOYEE_LEAVE_TYPE_LIST, {
      id: employeeId,
      companyId: companyId,
    });
    setEmployeeLeaveTypes(
      result.result?.map((each) => ({
        label: each.leaveType,
        value: each.leaveTypeId,
        other: each.basicLeaveType,
      }))
    );
    setEmployeeLeave(result.result);
  };
  const formik = useFormik({
    initialValues: {
      leaveType: null,
      from: [],
      to: "",
      noOfDays: null,
      leaveDays: null,
      halfDays: 0,
      reasonForLeave: "",
      document: "",
      isActive: true,
      file: "",
      maximumLeaveLimit: null,
      leaveApplied: "",
      leaveSection: null,
      basicLeaveType: 0,
      month: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      from: yup.array().of(yup.string().required()).min(1, "Date is required"),
      month: yup.string().required("Month is required"),
      leaveType: yup.string().required("Leave Type is required"),
      // from: yup.string().required("From Date is Required"),
      leaveSection:
        parseInt(leaveSeactiondata) === 1
          ? yup.string().required("Leave Session is Required")
          : "",
      reasonForLeave: yup.string().required("Reason for Leave is required"),
      // noOfDays: yup
      //   .number()
      //   .required("Leave days is required")
      //   .test(
      //     "noOfDays",
      //     "Leave days cannot be more than available balance",
      //     function (value) {
      //       return parseInt(employeeLeaveBalance) >= parseInt(value);
      //     }
      //   ),
    }),

    onSubmit: async (e) => {
      setLoading(true);

      try {
        if (
          parseFloat(employeeLeaveBalance) >= parseFloat(e.noOfDays) ||
          parseInt(e.basicLeaveType) === 1
        ) {
          const formData = new FormData();
          if (!updateId) {
            formData.append("action", API.EMPLOYEE_LEAVE_REQUEST);
            formData.append(
              "jsonParams",
              JSON.stringify({
                employeeId: employeeId,
                // employeeCompanyId: companyId,
                companyId: companyId,
                leaveDateFrom: e.from[0].format("YYYY-MM-DD"),
                leaveDateTo: e.from[1].format("YYYY-MM-DD"),
                totalLeaveDays: e.noOfDays,
                leaveTypeId: e.leaveType,
                leaveReason: e.reasonForLeave,
                appliedCount: "",
                // leaveAttachments: e.document || null   ,
                count: employeeLeaveBalance,
                isActive: 1,
                isLeave: 1,
                createdBy: loginId,
                // superpiorEmployeeId: "2",
                halfDay: e.halfDays,
                isRegularization: "0",
                isExtraDuty: "0",
                maximumLeaveLimit:
                  parseInt(e.basicLeaveType) === 1
                    ? e.noOfDays
                    : e.maximumLeaveLimit || null,
                leaveApplied: e.leaveApplied,
                leaveSection: e.leaveSection,
                // totalLeaveDays:e.noOfDays
                // isFinalHeirarchy: "1",
                // remarks: "Personal Reson",
              })
            );
          } else {
            formData.append("action", API.UPDATE_EMPLOYEE_LEAVE_REQUEST);
            formData.append(
              "jsonParams",
              JSON.stringify({
                employeeId: employeeId,
                // employeeCompanyId: companyId,
                companyId: companyId,
                leaveDateFrom: e.from[0].format("YYYY-MM-DD"),
                leaveDateTo: e.from[1].format("YYYY-MM-DD"),
                totalLeaveDays: e.noOfDays,
                leaveTypeId: e.leaveType,
                leaveReason: e.reasonForLeave,
                appliedCount: "",
                // leaveAttachments: e.document || null   ,
                count: employeeLeaveBalance,
                employeeLeaveApplicationId: leaveid || null,
                isActive: 1,
                isLeave: 1,
                createdBy: employeeId,
                // superpiorEmployeeId: "2",
                halfDay: e.halfDays,
                isRegularization: "0",
                isExtraDuty: "0",
                maximumLeaveLimit:
                  parseInt(e.basicLeaveType) === 1
                    ? e.noOfDays
                    : e.maximumLeaveLimit || null,
                leaveApplied: e.leaveApplied,
                leaveSection: e.leaveSection,
                // totalLeaveDays:e.noOfDays
                // isFinalHeirarchy: "1",
                // remarks: "Personal Reson",
              })
            );
          }

          if (e.file) formData.append("file", e.file);

          const result = await fileAction(formData);

          if (result.status === 200) {
            openNotification("success", "Successful", result?.message);
            setTimeout(() => {
              handleClose();
              refresh();
              setLoading(false);
            }, 1000);
            formik.resetForm();
          } else {
            openNotification("error", "Info", result?.message);
            setLoading(false);
          }
        } else {
          openNotification(
            "error",
            "Info",
            "Leave count exceeds the available leave balance."
          );
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        openNotification("success", "Failed", error);
        setLoading(false);
      }
    },
  });

  // GET EMPLOYEE LEAVE DATA
  const getEmployeeLeaveData = async (id, month) => {
    try {
      const result = await action(API.GET_EMPLOYEE_LEAVE_DATA, {
        employeeId: employeeId,
        companyId: companyId,
        leaveTypeId: id,
        leaveDateFrom: dayjs(month).format("YYYY-MM"),
      });
      if (result.status === 200) {
        if (updateId) setEmployeeLeaveDataEnable(true);

        setEmployeeLeaveBalance(result?.result?.leaveBalance);
        setEmployeeLeaveApplied(result?.result?.leaveApplied);
        setEmployeeLeaveApproved(result?.result?.leaveApproved);
        setEmployeeLeaveTotal(result?.result?.totalLeave);
        // }
        formik.setFieldValue(
          "maximumLeaveLimit",
          updateId
            ? result?.result?.leaveBalance + result?.result?.leaveApplied
            : result?.result?.leaveBalance
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(
      employeeId,
      companyId,
      formik.values.leaveType,
      formik.values.month,
      "emplou"
    );

    if (
      employeeId &&
      companyId &&
      formik.values.leaveType &&
      formik.values.month
    ) {
      getEmployeeLeaveData(formik.values.leaveType, formik.values.month);
    }
  }, [formik.values.leaveType, formik.values.month]);

  useEffect(() => {
    if (leaveId) {
      formik.setFieldValue("leaveType", leaveId);
    }

    employeeLeave?.map((each) => {
      if (
        each.leaveTypeId === formik.values.leaveType &&
        each.leaveTypeId === leaveId &&
        formik.values.from.length > 0
      ) {
        formik.setFieldValue("basicLeaveType", each.basicLeaveType);
        formik.setFieldValue("leaveApplied", each.leaveApplied);
      }
    });
  }, [formik.values.leaveType, employeeLeave, formik.values.from]);

  const getLeaveRequestIdBasedData = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_REQUEST_BY_ID, {
        id: updateId,
      });
      setupdateBtn(true);
      setLeaveRequestDetails(result.result);
      setLeaveid(result.result.employeeLeaveApplicationId);
      formik.setFieldValue("leaveType", result.result?.leaveTypeId);

      formik.setFieldValue("from", [
        dayjs(result.result?.leaveDateFrom),
        dayjs(result.result?.leaveDateTo),
      ]);
      formik.setFieldValue("noOfDays", result.result?.totalLeaveDays);
      formik.setFieldValue(
        "leaveDays",
        parseInt(result.result?.totalLeaveDays)
      );
      formik.setFieldValue("leaveSection", result.result?.leaveSession);
      formik.setFieldValue("halfDays", parseInt(result.result?.isHalfDay));
      formik.setFieldValue("reasonForLeave", result.result?.leaveReason);
      setAttachname(result.result?.attachmentName);
      setAttachurl(result.result?.attachmentUrl);
      const d = new Date(result.result?.leaveDateFrom);
      formik.setFieldValue("month", dayjs(d));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployeeLeaveType();

    console.log(updateId);
    if (updateId) {
      getLeaveRequestIdBasedData();
    }
  }, []);

  useMemo(() => {
    const startDate = moment(formik.values.from[0], "YYYY-MM-DD");
    const endDate = moment(formik.values.from[1], "YYYY-MM-DD");
    if (holiday?.length > 0) {
      const dateRange = [];
      let currentDate = startDate.clone();

      while (currentDate.isSameOrBefore(endDate)) {
        dateRange.push(currentDate.format("YYYY-MM-DD"));
        currentDate.add(1, "day"); //0
      }

      const filteredDates = dateRange.filter((date) => !holiday.includes(date));

      console.log(filteredDates?.length, "excludedDates");
      setFilterDays(filteredDates);
      const count = filterDays?.length;
      formik.setFieldValue("noOfDays", filteredDates?.length);
      formik.setFieldValue("leaveDays", filteredDates?.length);
    } else {
      const start = new Date(formik.values.from[0]);
      const end = new Date(formik.values.from[1]);

      const differenceInMilliseconds = end.getTime() - start.getTime();

      const differenceInDays =
        differenceInMilliseconds / (1000 * 3600 * 24) + 1;

      if (formik.values.halfDays === 1) {
        formik.setFieldValue("noOfDays", 0.5);
      } else {
        formik.setFieldValue(
          "noOfDays",
          Math.abs(Math.round(differenceInDays))
        );
      }
      formik.setFieldValue("leaveDays", Math.abs(Math.round(differenceInDays)));
    }
  }, [formik.values.from]);

  // GET SALARY BILLCYCLE DATE
  const getSalaryCycleDate = async () => {
    const bodyData = {
      companyId: localStorage.getItem("companyId"),
    };
    try {
      const resp = await action(`${API.GET_LEAVE_CYCLE}`, bodyData).then(
        (res) => {
          setLeaveCycleStart(res?.result?.leaveCycleStart);
          return res;
        }
      );
      return resp;
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    getSalaryCycleDate();
  }, []);

  let date;

  if (leaveCycleStart <= 20) {
    date = new Date(formik.values.month).setDate(leaveCycleStart);
  } else if (leaveCycleStart >= 21) {
    date = new Date(dayjs(formik.values.month)?.subtract(1, "month")).setDate(
      leaveCycleStart
    );
  }

  const modifiedDate = new Date(date);

  const currentMonth = modifiedDate.getMonth();

  const currentYear = modifiedDate.getFullYear();

  const nextMonth = (currentMonth + 1) % 12;

  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const lastDayOfNextMonth = new Date(nextYear, nextMonth, 0);

  const getDate = lastDayOfNextMonth.getDate();

  const dateDifference =
    parseInt(getDate) -
    parseInt(leaveCycleStart) +
    parseInt(leaveCycleStart) -
    1;

  const nextDate = new Date(
    new Date(date).setDate(new Date(date).getDate() + dateDifference)
  );

  const fetchEmployeePaidMonthlyData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const response = await Payrollaction(
        PAYROLLAPI.GET_EMPLOYEE_MONTHLY_PAID_LIST,
        {
          employeeId: employeeId,
          companyId: companyId,
          year: currentYear,
        }
      );
      const result = response?.result?.yearMonthPayouts;
      setDisabledData(result || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRestrictedHoliday = async () => {
    try {
      const result = await action(API.GET_ALL_RESTRICTED_HOLIDAY, {
        companyId: companyId,
        employeeId: employeeId,
        // companyId: 32,
        // employeeId: 5535,
      });
      if (result.status === 200) {
        setRestrictedHolidays(result.result);
        setIsRestrictedHoliday(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useMemo(() => {
    setIsRestrictedHoliday(false);
    if (employeeLeave?.length > 0) {
      employeeLeave?.map(
        (each) =>
          parseInt(each.leaveTypeId) === parseInt(formik.values.leaveType) &&
          parseInt(each.isRestrictedHoliday) &&
          getAllRestrictedHoliday()
      );
    }
  }, [formik.values.leaveType]);

  useEffect(() => {
    fetchEmployeePaidMonthlyData();
  }, []);

  // Disable Range picked days

  const disabled = (current) => {
    if (!current) return false; // To handle null cases

    // Check if current date is one of the specific disabled dates
    if (restrictedHolidays?.length > 0) {
      const isSpecificDisabled = restrictedHolidays?.some(
        (date) => current && current.isSame(moment(date), "day")
      );
      return !isSpecificDisabled;
    }
  };

  const disabledDate = (current) => {
    const filteredData = Object.fromEntries(
      Object.entries(disabledData).filter(([key, value]) => value !== null)
    );

    // Create an array of disabled months
    const disabledMonthsArray = Object.keys(filteredData).map(
      (date) => dayjs(date) // Assuming you're using dayjs
    );

    // Check if the current month is in the disabled months array
    const isDisabledMonth = disabledMonthsArray.some(
      (disabledMonth) => disabledMonth.isSame(current, "month") // Compare by month
    );

    return isDisabledMonth;
  };
  const handleMonthChange = (date, dateString) => {
    formik.setFieldValue("month", date);
    formik.setFieldValue("from", []);
  };

  useMemo(() => {
    if (
      parseInt(formik.values.leaveType) ===
        parseInt(leaveRequestDetails.leaveTypeId) &&
      dayjs(leaveRequestDetails.leaveDateFrom).format("YYYY-MM") ===
        dayjs(formik.values.month).format("YYYY-MM")
    )
      setEmployeeLeaveBalance(leaveRequestDetails?.leaveBalance);
    setEmployeeLeaveApplied(leaveRequestDetails?.leaveApplied);
    setEmployeeLeaveApproved(leaveRequestDetails?.leaveApproved);
    setEmployeeLeaveTotal(leaveRequestDetails?.totalLeave);
  }, [employeeLeaveDataEnable, formik.values.leaveType, formik.values.month]);

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      handleSubmit={() => {
        formik.handleSubmit();
      }}
      header={[
        !UpdateBtn ? t("Create_Leave_Request") : t("Update Leave Request"),
        UpdateBtn ? t("Leave Request") : t("Leave Request"),
      ]}
      footerBtn={[
        t("Cancel"),
        !UpdateBtn ? t("Request Leave") : t("Update Leave"),
      ]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={""} gap={20}>
        <Flex className="grid grid-cols-2 gap-[30px] items-center">
          <Dropdown
            title={t("Leave_Type")}
            placeholder={t("Choose Leave Type")}
            className=" col-span-2"
            options={employeeLeaveTypes}
            change={(e) => {
              formik.setFieldValue("leaveType", e);
              const selectedValue = employeeLeaveTypes.find(
                (option) => option.value === e
              );
              const basicLeaveType = selectedValue
                ? selectedValue?.other
                : null;
              formik.setFieldValue("basicLeaveType", basicLeaveType);
            }}
            value={formik.values.leaveType}
            required={true}
            error={formik.errors.leaveType}
          />

          <div className="col-span-1 flex flex-col gap-2 relative">
            <div className="flex items-center dark:text-white gap-0.5">
              <label
                htmlFor=""
                className="text-xs font-medium 2xl:text-sm dark:text-white"
              >
                Month
              </label>
              {<FaAsterisk className="text-[6px] text-rose-600" />}
            </div>
            <DatePicker
              size={isSmallScreen ? "default" : "large"}
              picker="month"
              value={formik?.values?.month}
              onChange={handleMonthChange}
              error={formik.errors.month}
              className={`${formik.errors.month && "border-rose-400"}`}
              style={
                formik.errors.month && {
                  boxShadow:
                    "0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                }
              }
              disabledDate={disabledDate}
            />
            {formik.errors.month && (
              <p className="flex justify-start my-1 mb-0 text-[10px] text-red-500">
                <span className="text-[10px] pl-1">{formik.errors.month}</span>
              </p>
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2 relative">
            <div className="flex items-center dark:text-white gap-0.5">
              <label
                htmlFor=""
                className="text-xs font-medium 2xl:text-sm dark:text-white"
              >
                Date
              </label>
              {<FaAsterisk className="text-[6px] text-rose-600" />}
            </div>
            <RangePicker
              size={isSmallScreen ? "default" : "large"}
              className={`${formik.errors.from && "border-rose-400"}`}
              value={formik?.values?.from}
              minDate={dayjs(date)}
              maxDate={dayjs(nextDate)}
              onChange={(e) => {
                if (e !== null) {
                  formik.setFieldValue("from", e);
                } else {
                  formik.setFieldValue("from", "");
                }
              }}
              disabledDate={isRestrictedHoliday ? disabled : null}
              style={
                formik.errors.from && {
                  boxShadow:
                    "0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                }
              }
            />
            {formik.errors.from && (
              <p className="flex justify-start my-1 mb-0 text-[10px] text-red-500">
                <span className="text-[10px] pl-1">{formik.errors.from}</span>
              </p>
            )}
          </div>

          {/* <RangeDatePicker
            className={"col-span-1"}
            title={t("Date")}
            change={(e) => {
              formik.setFieldValue("from", e);
            }}
            placeholder={t("Select_date")}
            value={formik.values.from}
            // value={["2024-04-26", "2024-04-26"]}
            // onlyViewsomeDays={true}
            dateFormat="YYYY/MM/DD"
            // disabledDates={holiday}
            picker="date"
            required={true}
            error={formik.errors.from}
            minDate={dayjs(date)}
            maxDate={dayjs(nextDate)}
          /> */}

          {/* <div className="w-full">
            <RangePicker
              // disabledDate={disabledDate}
              onChange={(e) => {
                formik.setFieldValue("from", e);
              }}
              placeholder={t("Select_date")}
              value={formik.values.from}
              // value={["2024-04-26", "2024-04-26"]}
              // onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
            />
          </div> */}
          <div className="grid grid-cols-4 gap-2 col-span-2">
            <FormInput
              title={t("Leave Applied")}
              className=""
              disabled={true}
              value={employeeLeaveApplied || 0}
            />
            <FormInput
              title={t("Leave Approved")}
              className=""
              disabled={true}
              value={employeeLeaveApproved || 0}
            />
            {parseInt(formik.values.basicLeaveType) === 0 && (
              <FormInput
                title={t("Total Leave")}
                className=""
                disabled={true}
                value={employeeLeaveTotal || 0}
              />
            )}
            {(parseInt(formik.values.basicLeaveType) === 0 ||
              parseInt(formik.values.basicLeaveType) === 2) && (
              <FormInput
                title={t("Leave Balance")}
                className=""
                disabled={true}
                value={employeeLeaveBalance || 0}
              />
            )}
          </div>
          {parseInt(formik.values.leaveDays) === 1 && (
            <div className="col-span-2">
              <ToggleBtn
                titleRight="Half Day"
                change={(e) => {
                  formik.setFieldValue("halfDays", e);
                  setLeaveSeactiondata(e);
                  if (e) {
                    formik.setFieldValue(
                      "noOfDays",
                      Number(formik.values.leaveDays) / 2
                    );
                  } else {
                    formik.setFieldValue("noOfDays", formik.values.leaveDays);
                  }
                }}
                value={formik.values.halfDays}
              />
            </div>
          )}

          <FormInput
            title={t("No_of_Days")}
            value={formik.values.noOfDays || ""}
            placeholder={t("No_of_Days")}
            disabled={true}
            error={formik.errors.noOfDays}
          />
          {formik.values.halfDays ? (
            <Dropdown
              title={t("Leave Session")}
              className=""
              value={formik.values.leaveSection}
              options={leaveSection}
              change={(e) => {
                formik.setFieldValue("leaveSection", e);
              }}
              error={formik.errors.leaveSection}
              required
            />
          ) : null}
          {/* </Flex> */}
          <TextArea
            title={t("Reason_for_leave")}
            className=" col-span-2"
            change={(e) => {
              formik.setFieldValue("reasonForLeave", e);
            }}
            value={formik.values.reasonForLeave}
            placeholder={t("Reason_for_leave")}
            required={true}
            error={formik.errors.reasonForLeave}
          />
          <FlexCol className={"col-span-2"}>
            <Heading
              title={t("Attachment")}
              description="Attach the leave request documents."
            />
            <FileUpload
              change={(e) => {
                formik.setFieldValue("file", e);
              }}
              defaultname={attachname}
              defaulturl={attachurl}
              multiple={false}
            />
          </FlexCol>
        </Flex>
      </FlexCol>
    </DrawerPop>
  );
}

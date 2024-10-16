/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import Dropdown from "../../common/Dropdown";
import FormInput from "../../common/FormInput";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import TimeSelect from "../../common/TimeSelect";
import ProfileHead from "../../common/ProfileHead";
import ModalAnt from "../../common/ModalAnt";
import popimage from "../../../assets/images/image 1467.png";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function Fine({
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
  const [viewOpen, setViewOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);

  const { showNotification } = useNotification();

  const openNotification = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      type: type,
    });
  };

  const [employeeDetails, setEmployeeDetails] = useState(null);

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
  const option = [
    {
      label: "Fixed",
      value: "fixedAmount",
    },
    {
      label: "Half Day",
      value: "halfDay",
    },
    {
      label: "Full Day",
      value: "fullDay",
    },
    {
      label: "Pardon",
      value: "pardon",
    },
    {
      label: "Per Minute",
      value: "perMinute",
    },
  ];
  const fineOption = [
    {
      label: "Fixed",
      value: "fixedAmount",
    },
    {
      label: "Half Day",
      value: "halfDay",
    },
    {
      label: "Full Day",
      value: "fullDay",
    },
    {
      label: "Pardon",
      value: "pardon",
    },
  ];

  const InputField = [
    {
      id: 1,
      title: "Late Entry",
      inputFieldName: "LateEntryfineRequest",
      value: [
        {
          id: 1,
          title: "Hours",
          inputFieldName: "LateEntryfineHours",
          type: "time",
          description: "",
        },
        {
          id: 2,
          title: "Deduction Type",
          inputFieldName: "LateEntryfineType",
          type: "dropDown",
        },
        {
          id: 2,
          title: "Amount",
          inputFieldName: "LateEntryfineAmount",
          type: "input",
        },
      ],
    },
    {
      id: 2,
      title: "Excess Break",
      inputFieldName: "ExcessBreakfineRequest",
      value: [
        {
          id: 1,
          title: "Hours",
          inputFieldName: "ExcessBreakfineHours",
          type: "time",
          description: "",
        },
        {
          id: 2,
          title: "Deduction Type",
          inputFieldName: "ExcessBreakfineType",
          type: "dropDown",
        },
        {
          id: 2,
          title: "Amount",
          inputFieldName: "ExcessBreakfineAmount",
          type: "input",
        },
      ],
    },
    // {
    //   id: 3,
    //   title: "Over Time",
    //   value: [
    //     {
    //       id: 1,
    //       title: "Hours",
    //       inputFieldName: "fineAmount",
    //       type: "input",
    //       description: "Amount:₹520.83",
    //     },
    //     {
    //       id: 2,
    //       title: "Fine Amount",
    //       inputFieldName: "fineType",
    //       type: "dropDown",
    //     },
    //   ],
    // },
    {
      id: 4,
      title: "Early Exit",
      inputFieldName: "EarlyExitfineRequest",
      value: [
        {
          id: 1,
          title: "Hours",
          inputFieldName: "EarlyExitfineHours",
          type: "time",
          description: "",
        },
        {
          id: 2,
          title: "Deduction Type",
          inputFieldName: "EarlyExitfineType",
          type: "dropDown",
        },
        {
          id: 2,
          title: "Amount",
          inputFieldName: "EarlyExitfineAmount",
          type: "input",
        },
      ],
    },
    {
      id: 5,
      title: "Miss Punch",
      inputFieldName: "MissPunchfineRequest",
      value: [
        {},
        {
          id: 1,
          title: "Deduction Type",
          inputFieldName: "MissPunchfineType",
          type: "dropDown",
          option: fineOption,
          description: "",
        },
        // {
        //   id: 2,
        //   title: "Deduction Type",
        //   inputFieldName: "LateEntryfineType",
        //   type: "dropDown",
        // },
        {
          id: 2,
          title: "Amount",
          inputFieldName: "MissPunchfineAmount",
          type: "input",
        },
      ],
    },
  ];

  const getEmployeeDetails = async () => {
    const result = await action(API.GET_EMPLOYEE_ATTENDENCE_ID_BASED, {
      id: attendanceId,
    });

    if (result.status === 200) {
      setEmployeeDetails(result.result);
      result.result?.deductions?.map((each) => {
        switch (each.deductionDetails) {
          case "Late Entry":
            formik.setFieldValue("LateEntryfineHours", each.timeDifference);
            formik.setFieldValue(
              "LateEntryfineType",
              each.deductionCalculationType
            );
            formik.setFieldValue("LateEntryfineAmount", each.deductionAmount);
            formik.setFieldValue("LateEntryfineRequest", each);
            break;
          case "Early Exit":
            formik.setFieldValue("EarlyExitfineHours", each.timeDifference);
            formik.setFieldValue(
              "EarlyExitfineType",
              each.deductionCalculationType
            );
            formik.setFieldValue("EarlyExitfineAmount", each.deductionAmount);
            formik.setFieldValue("EarlyExitfineRequest", each);

            break;
          case "Excess Break":
            formik.setFieldValue("ExcessBreakfineHours", each.timeDifference);
            formik.setFieldValue(
              "ExcessBreakfineType",
              each.deductionCalculationType
            );
            formik.setFieldValue("ExcessBreakfineAmount", each.deductionAmount);
            formik.setFieldValue("ExcessBreakfineRequest", each);
            break;
          case "Miss Punch":
            formik.setFieldValue("MissPunchfinetype", each.timeDifference);
            formik.setFieldValue(
              "MissPunchfineType",
              each.deductionCalculationType
            );
            formik.setFieldValue("MissPunchfineAmount", each.deductionAmount);
            formik.setFieldValue("MissPunchfineRequest", each);
            break;

          default:
            break;
        }
      });
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      LateEntryfineHours: "",
      LateEntryfineType: null,
      LateEntryfineAmount: null,
      LateEntryfineRequest: false,

      ExcessBreakfineHours: "",
      ExcessBreakfineType: null,
      ExcessBreakfineAmount: null,
      ExcessBreakfineRequest: false,

      EarlyExitfineHours: "",
      EarlyExitfineType: null,
      EarlyExitfineAmount: null,
      EarlyExitfineRequest: false,

      // MissPunchfinetype: "",
      MissPunchfineType: null,
      MissPunchfineAmount: null,
      MissPunchfineRequest: false,

      deductionDetails: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape(
      {
        // department: yup.string().required("Department Required"),
        // description: yup.string().required("Description Required"),
        LateEntryfineType: yup
          .string()
          .when("LateEntryfineHours", (LateEntryfineHours) => {
            if (LateEntryfineHours[0] !== undefined) {
              return yup.string().required("Deduction Type required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        LateEntryfineHours: yup
          .string()
          .when("LateEntryfineType", (LateEntryfineType) => {
            if (LateEntryfineType[0]) {
              return yup.string().required("Time required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        LateEntryfineAmount: yup
          .string()
          .when("LateEntryfineType", (LateEntryfineType) => {
            if (LateEntryfineType[0] === "fixedAmount") {
              return yup.string().required("Amount required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        ExcessBreakfineType: yup
          .string()
          .when("ExcessBreakfineHours", (ExcessBreakfineHours) => {
            if (ExcessBreakfineHours[0] !== undefined) {
              return yup.string().required("Deduction Type required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        ExcessBreakfineHours: yup
          .string()
          .when("ExcessBreakfineType", (ExcessBreakfineType) => {
            if (ExcessBreakfineType[0]) {
              return yup.string().required("Time required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        ExcessBreakfineAmount: yup
          .string()
          .when("ExcessBreakfineType", (ExcessBreakfineType) => {
            if (ExcessBreakfineType[0] === "fixedAmount") {
              return yup.string().required("Amount required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        EarlyExitfineType: yup
          .string()
          .when("EarlyExitfineHours", (EarlyExitfineHours) => {
            if (EarlyExitfineHours[0] !== undefined) {
              return yup.string().required("Deduction Type required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        EarlyExitfineHours: yup
          .string()
          .when("EarlyExitfineType", (EarlyExitfineType) => {
            if (EarlyExitfineType[0]) {
              return yup.string().required("Time required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        EarlyExitfineAmount: yup
          .string()
          .when("EarlyExitfineType", (EarlyExitfineType) => {
            if (EarlyExitfineType[0] === "fixedAmount") {
              return yup.string().required("Amount required");
            } else {
              return yup.string().notRequired("");
            }
          }),
        MissPunchfineAmount: yup
          .string()
          .when("MissPunchfineType", (MissPunchfineType) => {
            if (MissPunchfineType[0] === "fixedAmount") {
              return yup.string().required("Amount required");
            } else {
              return yup.string().notRequired("");
            }
          }),

        // LateEntryfineType: yup
        //   .string()
        //   .nullable()
        //   .test(
        //     "EarlyExitfineHours-required-if-LateEntryfineType",
        //     "EarlyExitfineHours is required when LateEntryfineType is entered",
        //     function (value) {
        //       const { EarlyExitfineHours } = this.parent;
        //       return !value || (value && EarlyExitfineHours);
        //     }
        //   ),
      },
      [
        ["LateEntryfineType", "LateEntryfineHours"],
        ["ExcessBreakfineType", "ExcessBreakfineHours"],
        ["EarlyExitfineType", "EarlyExitfineHours"],
        ["MissPunchfineType"],
      ]
    ),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.ADD_EMPLOYEE_STATUS, {
          status: "Fine", // Half Day,Absent,Fine,Overtime,Leave
          employeeAttendanceId: attendanceId,
          createdBy: employeeId || null,
          employeeAttendanceDate: date,
          employeeId: employeeDetails?.employeeId,
          companyId: companyId,

          fine: [
            {
              deductionDetails: "Late Entry",
              deductionType: e.LateEntryfineType,
              deductionHours: e.LateEntryfineHours,
              deductionAmount: e.LateEntryfineAmount,
            },
            {
              deductionDetails: "Excess Break",

              deductionType: e.ExcessBreakfineType,
              deductionHours: e.ExcessBreakfineHours,
              deductionAmount: e.ExcessBreakfineAmount,
            },
            {
              deductionDetails: "Early Exit",

              deductionType: e.EarlyExitfineType,
              deductionHours: e.EarlyExitfineHours,
              deductionAmount: e.EarlyExitfineAmount,
            },
            {
              deductionDetails: "Miss Punch",

              deductionType: e.MissPunchfineType,
              // deductionHours: e.MissPunchfinetype,
              deductionAmount: e.MissPunchfineAmount,
            },
          ],
        });

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            setLoading(false);
            handleClose();
            refresh();
          }, 1000);
          formik.resetForm();
        } else {
          openNotification("error", "Failed", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        openNotification("error", "Failed", error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (
      formik.values.LateEntryfineHours === "" &&
      formik.values.LateEntryfineType === null &&
      formik.values.ExcessBreakfineHours === "" &&
      formik.values.ExcessBreakfineType === null &&
      formik.values.EarlyExitfineHours === "" &&
      formik.values.EarlyExitfineType === null &&
      formik.values.MissPunchfineType === null
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [formik.values]);

  const calculateAmount = async (data, item) => {
    try {
      const result = await action(API.CALCULATE_AMOUNT_WITH_POLICYS, {
        method: data.title,
        hours: formik.values[data.value[0].inputFieldName],
        type: item,
        employeeDailyAttendanceId: attendanceId,
      });
      if (result.status === 200) {
        formik.setFieldValue(
          data.value[2]?.inputFieldName,
          result?.result?.amount === "0.00" ? null : result?.result?.amount
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        handleClose();
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn ? t("Fine") : t(""),
        !UpdateBtn
          ? t(
              "Adjust fine amounts by manually entering times for late arrivals, early departures, and excess breaks."
            )
          : t(""),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={""} gap={30}>
        <ProfileHead
          employeeDetails={employeeDetails}
          date={new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        />

        <FlexCol className={""} gap={20}>
          {InputField?.map((each) => (
            <div className="p-3 bg-primaryalpha/5 rounded-lg hover:bg-primaryalpha/10 transform duration-300">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm 2xl:text-base">
                  {each.title}
                </div>
                {parseInt(
                  formik.values[each.inputFieldName].regularizationApplied
                ) === 1 ? (
                  <div
                    className="bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-400 hover:text-white shadow-md text-xs cursor-pointer px-2 py-1 rounded-md"
                    onClick={() => {
                      setViewOpen(true);
                      setViewDetails(formik.values[each.inputFieldName]);
                    }}
                  >
                    View Request Details
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-3 items-center gap-2 mt-3">
                {each.value?.map((item) =>
                  item.type === "time" ? (
                    <TimeSelect
                      title={item.title}
                      className={`${
                        formik.errors[item.inputFieldName] && "mt-5"
                      }`}
                      placeholder="Time"
                      change={(e) => {
                        formik.setFieldValue(item.inputFieldName, e);
                      }}
                      value={formik.values[item.inputFieldName]}
                      error={formik.errors[item.inputFieldName]}
                    />
                  ) : item.type === "dropDown" ? (
                    <Dropdown
                      title={item.title}
                      placeholder="Choose Type"
                      required={true}
                      className={`${
                        formik.errors[item.inputFieldName] && "mt-5"
                      } "w-40"`}
                      options={item.option ? item.option : option}
                      change={(e) => {
                        calculateAmount(each, e);
                        formik.setFieldValue(item.inputFieldName, e);
                      }}
                      value={formik.values[item.inputFieldName]}
                      error={formik.errors[item.inputFieldName]}
                    />
                  ) : (
                    item.type === "input" && (
                      <div
                        className={`${
                          formik.errors[item.inputFieldName] && "mt-5"
                        }`}
                      >
                        <FormInput
                          type="number"
                          title={item.title}
                          placeholder="value"
                          change={(e) => {
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (regex.test(e))
                              formik.setFieldValue(item.inputFieldName, e);
                          }}
                          value={formik.values[item.inputFieldName]}
                          disabled={
                            formik.values[each.value[1].inputFieldName] !==
                            "fixedAmount"
                              ? true
                              : false
                          }
                          error={formik.errors[item.inputFieldName]}
                        />
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <p className="text-xs 2xl:text-sm text-slate-500">Total amount</p>
            <p className="text-sm 2xl:text-base font-medium">
              {"₹ " +
                (
                  Number(formik.values.LateEntryfineAmount) +
                  Number(formik.values.ExcessBreakfineAmount) +
                  Number(formik.values.EarlyExitfineAmount) +
                  Number(formik.values.MissPunchfineAmount)
                ).toFixed(2) || 0}
            </p>
          </div>
        </FlexCol>
      </FlexCol>
      <ModalAnt
        isVisible={viewOpen}
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        onClose={(e) => {
          setViewOpen(false);
        }}
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
          <div className="flex gap-3 items-center ">
            <div className="border-2 border-[#FFFFFF] size-[44px] rounded-full flex items-center justify-center bg-[#CBCAFC66]">
              <img
                src={popimage}
                alt="#PunchImage"
                className="rounded-full w-[28px]"
              />
            </div>
            <p className="font-semibold text-[18px] 2xl:text-[20px]">
              Requested Details
            </p>
          </div>
          <FlexCol gap={12}>
            <div className=" grid grid-cols-2 gap-3 items-center font-semibold ">
              <div className="flex justify-between opacity-55">
                <p>Deduction Type</p>
                <span>:</span>
              </div>
              <p>{viewDetails.deductionDetails}</p>
            </div>
            <div className=" grid grid-cols-2 gap-3 items-center font-semibold ">
              <div className="flex justify-between opacity-55">
                <p>Deduction Date</p>
                <span>:</span>
              </div>
              <p>{viewDetails.deductionDate}</p>
            </div>
            <div className=" grid grid-cols-2 gap-3 items-center font-semibold ">
              <div className="flex justify-between opacity-55">
                <p>Reason</p>
                <span>:</span>
              </div>
              <p>{viewDetails.excuseReason}</p>
            </div>
            <div className=" grid grid-cols-2 gap-3 items-center font-semibold ">
              <div className="flex justify-between opacity-55">
                <p>Time Difference</p>
                <span>:</span>
              </div>
              <p>{viewDetails.timeDifference}</p>
            </div>
            <div className=" grid grid-cols-2 gap-3 items-center font-semibold ">
              <div className="flex justify-between opacity-55 ">
                <p>Deduction Amount</p>
                <span>:</span>
              </div>
              <p>₹ {viewDetails.deductionAmount}</p>
            </div>
            <div className=" grid grid-cols-2 gap-3 items-center font-semibold ">
              <div className="flex justify-between opacity-55">
                <p>Status</p>
                <span>:</span>
              </div>
              <p
                className={`${
                  viewDetails.remarks === "approved" ||
                  viewDetails.remarks === "pardon"
                    ? "  text-green-700"
                    : " text-yellow-600"
                } p-1 rounded-full w-fit  text-[10px] opacity-100`}
              >
                {viewDetails.remarks}
              </p>
            </div>
          </FlexCol>
        </div>
      </ModalAnt>
    </DrawerPop>
  );
}

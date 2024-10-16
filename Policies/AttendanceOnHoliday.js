import React, { useState } from "react";
import FlexCol from "../common/FlexCol";
import Heading2 from "../common/Heading2";
import { Flex } from "antd";
import FormInput from "../common/FormInput";

export default function AttendanceOnHoliday() {
  const { t } = useTranslation();

  const [attendanceHolidayOvertimeList, setAttendanceHolidayOvertimeList] =
    useState([]);

  // Less working Hours policy

  const lessWorkingDynamicFields = lessWorkinghoursList.reduce((ac, each) => {
    each.field.reduce((acc, value) => {
      acc[each.inputType] = "";
      // console.log(acc[each.inputType]);
      // console.log(each);
      return acc;
    });
  }, {});
  const additionalValidations1 = Object.fromEntries(
    safeFlatMap(lessWorkinghoursList) || {}
  );

  const Formik4 = useFormik({
    initialValues: {
      lessWorkingHourseName: "",
      lessWorkingOccurrence: "",
      lessWorkingOccurrenceType: "",
      lessWorkingOccurrenceTypeValue: "",
      warrningEmail: "",

      ...lessWorkingDynamicFields,
      attendanceAndHolidayName: "",
      attendanceAndHolidayType: "salaryMultiplier",
      salaryMultiplier: null,
      salaryComponent: null,
      comboOffYes: "",
      comboOffNo: "",
      overTime: "",
      doNotConsider: null,
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object({
      attendanceAndHolidayName: yup
        .string()
        .required("Policy Name is required"),
      // ...Object.fromEntries(
      //   safeFlatMap(
      //     lessWorkinghoursList
      //     .flatMap((each) =>
      //       each.field.map((field) => [
      //         field.inputType,
      //         yup.string().required(`${field.title} is required`),
      //       ])
      //     )
      //   )
      // ),
      // ...additionalValidations1,
    }),
    onSubmit: async (e) => {
      try {
        if (updateId) {
          const result = await action(API.UPDATE_WORK_POLICY, {
            workPolicyDeatilsId: updateId,
            workPolicyId: workPolicyId,
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.attendanceAndHolidayName,
            warrningEmail: e.warrningEmail,
            workRules: {
              attendanceOnHoliday: {
                Type: e.attendanceAndHolidayType,
                values:
                  e.attendanceAndHolidayType === "salaryMultiplier"
                    ? {
                        salaryMultiplier: e.salaryMultiplier,
                        salaryComponent: e.salaryComponent,
                      }
                    : e.attendanceAndHolidayType === "comboOff"
                    ? { comboOff: e.comboOffYes ? "yes" : e.comboOffNo && "No" }
                    : e.attendanceAndHolidayType === "overtime"
                    ? attendanceHolidayOvertimeList?.map((each) => ({
                        minutes: e[each.field[0].inputType],
                        type: e[each.field[1].inputType],
                        salaryMultiplyer:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[2].inputType]
                            : null,
                        salaryComponent:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[3].inputType]
                            : null,
                        amount:
                          e[each.field[1].inputType] === "fixedAmount"
                            ? e[each.field[2].inputType]
                            : null,
                      }))
                    : { doNotConsider: e.doNotConsider },
              },

              // shortTime: {
              //   occurrence: {
              //     type: e.lessWorkingOccurrenceType,
              //     value: e.lessWorkingOccurrenceTypeValue,
              //   },
              //   rule: {},
              // rule: lessWorkinghoursList?.map((each) => ({
              //   minutes: e[each.field[0].inputType],
              //   deductionType: e[each.field[1].inputType],
              //   deductionComponent:
              //     e[each.field[1].inputType] === "halfDay" ||
              //     e[each.field[1].inputType] === "fullDay" ||
              //     e[each.field[1].inputType] === "perMinutes"
              //       ? e[each.field[2].inputType]
              //       : null,
              //   // : e[each.field[1].inputType] === "fixedAmount" &&
              //   //   e[each.field[3].inputType],
              //   // occurrence: e[each.field[4].inputType],
              //   days:
              //     e[each.field[1].inputType] === "fixedAmount"
              //       ? null
              //       : e[each.field[3].inputType],
              //   amount:
              //     e[each.field[1].inputType] === "fixedAmount"
              //       ? e[each.field[2].inputType] || e[each.field[4].inputType]
              //       : null,
              // })),
              //   },
            },
          });
          console.log(result);
          if (result.status === 200) {
            // setWorkPolicyId(result.result.insertedId);
            setNextStep(nextStep + 1);
            openNotification("success", "Success", result.message);

            console.log(nextStep);
          } else {
            openNotification("error", "Failed...", result.message);
          }
        } else {
          const result = await action(API.ADD_EMPLOYEE_WORK_POLICY_DETAILS, {
            companyId: companyId,
            workPolicyTypeId: formik.values.workPolicyType,
            workPolicyType: formik.values.workPolicyName,
            workPolicyName: e.attendanceAndHolidayName,
            warrningEmail: e.warrningEmail,
            workRules: {
              attendanceOnHoliday: {
                Type: e.attendanceAndHolidayType,
                values:
                  e.attendanceAndHolidayType === "salaryMultiplier"
                    ? {
                        salaryMultiplier: e.salaryMultiplier,
                        salaryComponent: e.salaryComponent,
                      }
                    : e.attendanceAndHolidayType === "comboOff"
                    ? { comboOff: e.comboOffYes ? "yes" : e.comboOffNo && "no" }
                    : e.attendanceAndHolidayType === "overtime"
                    ? attendanceHolidayOvertimeList?.map((each) => ({
                        minutes: e[each.field[0].inputType],
                        type: e[each.field[1].inputType],
                        salaryMultiplyer:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[2].inputType]
                            : null,
                        salaryComponent:
                          e[each.field[1].inputType] === "salaryMultiplyer"
                            ? e[each.field[3].inputType]
                            : null,
                        amount:
                          e[each.field[1].inputType] === "fixedAmount"
                            ? e[each.field[2].inputType]
                            : null,
                      }))
                    : { doNotConsider: e.doNotConsider },
              },
              // shortTime: {
              //   occurrence: {
              //     type: e.lessWorkingOccurrenceType,
              //     value: e.lessWorkingOccurrenceTypeValue,
              //   },
              //   rule: lessWorkinghoursList?.map((each) => ({
              //     minutes: e[each.field[0].inputType],
              //     deductionType: e[each.field[1].inputType],
              //     deductionComponent:
              //       e[each.field[1].inputType] === "halfDay" ||
              //       e[each.field[1].inputType] === "fullDay" ||
              //       e[each.field[1].inputType] === "perMinutes"
              //         ? e[each.field[2].inputType]
              //         : null,
              //     // : e[each.field[1].inputType] === "fixedAmount" &&
              //     //   e[each.field[3].inputType],
              //     // occurrence: e[each.field[4].inputType],
              //     days:
              //       e[each.field[1].inputType] === "fixedAmount"
              //         ? null
              //         : e[each.field[3].inputType],
              //     amount:
              //       e[each.field[1].inputType] === "fixedAmount"
              //         ? e[each.field[2].inputType]
              //         : null,
              //   })),
              // },
            },
          });

          if (result.status === 200) {
            setWorkPolicyId(result.result.insertedId);
            openNotification("success", "Success", result.message);
            console.log(nextStep);

            setNextStep(nextStep + 1);
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
  return (
    <FlexCol className={"w-full"}>
      <FlexCol className=" borderb rounded-xs p-4 bg-white dark:bg-dark">
        <Heading2
          // title="Short Time Policy "
          title="Attendance on Holidays"
          description="Manage and configure your organization's holiday attendance policies effectively."
        />
        <Flex
          className="grid items-start grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          gap={8}
        >
          <FormInput
            title={t("Policy Name")}
            placeholder={t("Policy Name")}
            value={Formik4.values.attendanceAndHolidayName}
            change={(e) => {
              Formik4.setFieldValue("attendanceAndHolidayName", e);
            }}
            className="lg:w-[80%]"
            required={true}
            error={Formik4.errors.attendanceAndHolidayName}
          />
          {/* <CheckBoxInput
          titleRight={"Send Notification Email to Employees"}
          // description={each.description}
          value={Formik4.values.warrningEmail}
          change={(e) => {
            Formik4.setFieldValue("warrningEmail", e);
          }}
        /> */}
        </Flex>
      </FlexCol>
      <div className="flex flex-col gap-10  borderb rounded-xl bg-white dark:bg-dark p-4">
        <div className="flex flex-col gap-4">
          <Heading2
            title={t("Calculation for attendance on holidays")}
            description={t(
              "Define how attendance on holidays should be managed within your organization. Choose from the options below:"
            )}
          />

          <div className="md:grid grid-cols-4 flex flex-col gap-6 dark:text-white">
            {attendanceOnHolidays?.map((each, i) => (
              <div
                key={i}
                className={` p-4 borderb rounded-2xl cursor-pointer showDelay dark:bg-dark  ${
                  Formik4.values.attendanceAndHolidayType === each.value &&
                  "border-primary "
                } `}
                onClick={() => {
                  // setCustomValue(each.value);
                  Formik4.setFieldValue("attendanceAndHolidayType", each.value);
                  console.log(each.value);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className=" flex flex-col gap-2">
                    {/* <GiReceiveMoney
                  className={`${
                    attendanceHolidayActive === each.id && "text-primary"
                  } `}
                /> */}
                    <div
                      className={`${
                        Formik4.values.attendanceAndHolidayType ===
                          each.value && " text-primary  "
                      } p-2 borderb rounded-mdx w-fit bg-[#F8FAFC] dark:bg-secondaryDark`}
                    >
                      {each.image}
                    </div>
                    {/* <img
                    src={customRate === each.id ? cash : cashGray}
                    alt=""
                    className=" w-6 h-6"
                  /> */}
                    <h3 className=" text-sm font-semibold">{each.title}</h3>
                    <p className=" text-xs font-medium text-[#667085] ">
                      {each.description}
                    </p>
                  </div>
                  <div
                    className={`${
                      Formik4.values.attendanceAndHolidayType === each.value &&
                      "border-primary"
                    } border  rounded-full`}
                  >
                    <div
                      className={`font-semibold text-base w-4 h-4 borderb   rounded-full ${
                        Formik4.values.attendanceAndHolidayType ===
                          each.value && "text-primary bg-primary"
                      } `}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="">
            {Formik4.values.attendanceAndHolidayType === "salaryMultiplier" && (
              <FlexCol className=" p-4 borderb rounded-xl bg-[#FAFAFA] dark:bg-secondaryDark">
                <Heading2
                  title={"Consider attendance on holiday as working day"}
                  description={
                    "Set a salary multiplier for considering attendance on holidays as a regular working day."
                  }
                />
                <div className=" grid grid-cols-4 gap-2">
                  <Dropdown
                    title={"Salary Multiplier"}
                    change={(e) => {
                      Formik4.setFieldValue("salaryMultiplier", e);
                    }}
                    value={Formik4.values.salaryMultiplier}
                    placeholder="Select"
                    options={Multiplyer}
                  />
                  <Dropdown
                    title={"Salary Component"}
                    change={(e) => {
                      Formik4.setFieldValue("salaryComponent", e);
                    }}
                    value={Formik4.values.salaryComponent}
                    placeholder="Select"
                    options={Deduction}
                  />
                </div>
              </FlexCol>
            )}
            {attendanceOnHolidaysValues?.map(
              (item) =>
                Formik4.values.attendanceAndHolidayType === item.value && (
                  <FlexCol className=" p-4 borderb rounded-xl bg-[#FAFAFA] dark:bg-secondaryDark">
                    <Heading2
                      title={item.HeadingTitle}
                      description={item.HeadingDescription}
                    />
                    <div className=" grid grid-cols-4">
                      {item.type === "dropDown" ? (
                        <div className=" col-span-1">
                          <Dropdown
                            title={item.options.title}
                            change={(e) => {
                              Formik4.setFieldValue(item.options.inputValue, e);
                              console.log(item.options.inputValue);
                            }}
                            value={Formik4.values[item.options.inputValue]}
                            placeholder="Select"
                            options={item.options.option}
                          />
                        </div>
                      ) : item.type === "checkBox" ? (
                        <CheckBoxInput
                          className=" col-span-4"
                          titleRight={item.options.title}
                          change={(e) => {
                            Formik4.setFieldValue(item.options.inputValue, e);
                          }}
                          value={Formik4.values[item.options.inputValue]}
                        />
                      ) : item.type === "checkBoxGrop" ? (
                        <div className=" col-span-4 grid grid-cols-2">
                          <CheckBoxInput
                            titleRight={item.options.option[0].title}
                            titleDescription={
                              item.options.option[0].description
                            }
                            className={"items-start"}
                            change={(e) => {
                              Formik4.setFieldValue(
                                item.options.option[0].inputValue,
                                e
                              );
                              Formik4.setFieldValue(
                                item.options.option[1].inputValue,
                                !e
                              );
                            }}
                            value={
                              Formik4.values[item.options.option[0].inputValue]
                            }
                            options={item.options.option}
                          />
                          <CheckBoxInput
                            titleRight={item.options.option[1].title}
                            titleDescription={
                              item.options.option[1].description
                            }
                            className={"items-start"}
                            change={(e) => {
                              Formik4.setFieldValue(
                                item.options.option[0].inputValue,
                                !e
                              );
                              Formik4.setFieldValue(
                                item.options.option[1].inputValue,
                                e
                              );
                            }}
                            value={
                              Formik4.values[item.options.option[1].inputValue]
                            }
                          />
                        </div>
                      ) : (
                        item.type === "time" && (
                          <div className=" col-span-1">
                            <TimeSelect
                              title={item.options.title}
                              change={(e) => {
                                Formik4.setFieldValue(
                                  item.options.inputValue,
                                  e
                                );
                              }}
                              value={Formik4.values[item.options.inputValue]}
                              placeholder="Choose Time"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </FlexCol>
                )
            )}
            {Formik4.values.attendanceAndHolidayType === "overtime" && (
              <div className="relative borderb rounded-xs bg-white dark:bg-secondaryDark">
                <FlexCol className={"  p-4 "}>
                  <Heading
                    title={t("Consider Attendance On Holidays as Overtime")}
                    description={t(
                      "Set a minimum number of work hours required to be eligible for overtime pay on holidays."
                    )}
                  />
                  <div className=" flex flex-col gap-6">
                    {attendanceHolidayOvertimeList?.map((customRate, i) => (
                      <div
                        key={i}
                        className="relative md:grid grid-cols-4  gap-4 flex flex-col"
                      >
                        {customRate.field?.map(
                          (each, index) =>
                            each.type !== null && (
                              <div key={index} className="col-span-1 ">
                                {each.type === "time" ? (
                                  <TimeSelect
                                    title={each.title}
                                    // description={each.description}
                                    placeholder={"Choose" + " " + each.title}
                                    format="HH:mm"
                                    value={Formik4.values[each.inputType]}
                                    change={(e) => {
                                      console.log(e);
                                      Formik4.setFieldValue(each.inputType, e);
                                    }}
                                    error={
                                      Formik4.values[each.inputType]
                                        ? ""
                                        : Formik4.errors[each.inputType]
                                    }
                                    required={true}
                                  />
                                ) : each.type === "dropdown" ? (
                                  <Dropdown
                                    title={each.title}
                                    // description={each.description}
                                    placeholder={"Choose" + " " + each.title}
                                    value={Formik4.values[each.inputType]}
                                    change={(e) => {
                                      if (!each.changeValue) {
                                        if (e === "fixedAmount") {
                                          attendanceHolidayOvertimeList.map(
                                            (item) => {
                                              item.id === customRate.id &&
                                                item.field.splice(2, 3, {
                                                  title: "Amount",
                                                  titleChange: true,
                                                  type: "input",
                                                  enter: "number",
                                                  enterDigits: "6",
                                                  inputType:
                                                    "OvertimeAmmount" + item.id,
                                                  placeholder: "Type here...",
                                                  description: "Description",
                                                });
                                            }
                                          );
                                        } else {
                                          attendanceHolidayOvertimeList.map(
                                            (item) => {
                                              item.id === customRate.id &&
                                                item.field.splice(
                                                  2,
                                                  3,
                                                  {
                                                    title: "Salary Multiplyer",
                                                    type: "dropdown",
                                                    inputType:
                                                      "overtimeMultiplyer" +
                                                      item.id,
                                                    // changeValue: true,
                                                    option: Multiplyer,
                                                    // display: true,
                                                  },
                                                  {
                                                    title: "Salary Component",
                                                    type: "dropdown",
                                                    inputType:
                                                      "overtimeComponent" +
                                                      item.id,
                                                    // changeValue: true,
                                                    option: Deduction,
                                                    // display: true,
                                                  }
                                                  // {
                                                  //   title: "Days",
                                                  //   type: "dropdown",
                                                  //   valuecheck:
                                                  //     "DeductionComponent",
                                                  //   inputType:
                                                  //     "exitRuleDays" +
                                                  //     item.id,
                                                  //   // description:
                                                  //   //   "Lorem ipsum dolor sit amet",
                                                  //   divline: true,
                                                  //   option: DaysDivider,
                                                  //   display: true,
                                                  // }
                                                );
                                            }
                                          );
                                        }
                                      }
                                      Formik4.setFieldValue(each.inputType, e);
                                    }}
                                    options={each.option}
                                    icondropDown={each.icon ? true : false}
                                    icon={
                                      each.icon && (
                                        <PiCloudWarningBold className="text-primary font-bold" />
                                      )
                                    }
                                    error={
                                      Formik4.values[each.inputType]
                                        ? ""
                                        : Formik4.errors[each.inputType]
                                    }
                                    required={true}
                                  />
                                ) : each.type === "input" ? (
                                  <FormInput
                                    title={
                                      Formik4.values[
                                        customRateExtraHoursList?.map(
                                          (each) =>
                                            Object.values(each.field)[1]
                                              .inputType
                                        )[i]
                                      ] === "salaryMultiplyer"
                                        ? "Multiplayer"
                                        : each.title
                                    }
                                    // description={each.description}
                                    placeholder={each.title}
                                    value={Formik4.values[each.inputType]}
                                    error={
                                      Formik4.values[each.inputType]
                                        ? ""
                                        : Formik4.errors[each.inputType]
                                    }
                                    type={each.enter}
                                    pattern="[0-9]*"
                                    inputmode="numeric"
                                    change={(e) => {
                                      console.log(e);
                                      if (each.enterDigits)
                                        if (/^\d*$/g.test(e))
                                          // if (
                                          //   toString(e)?.length() <
                                          //   each.enterDigits
                                          // )
                                          //  {
                                          Formik4.setFieldValue(
                                            each.inputType,
                                            e
                                          );
                                      // } else if (e === "") {
                                      //   Formik4.setFieldValue(
                                      //     each.inputType,
                                      //     "e"
                                      //   );
                                      // }
                                    }}
                                    maxLength={4}
                                    required={true}
                                  />
                                ) : null}
                              </div>
                            )
                        )}
                        {i !== 0 && (
                          <div className="absolute -right-14 top-0 pb-2 z-50 w-16">
                            <Tooltip placement="topLeft" title="Delete">
                              <MdOutlineDelete
                                className=" hover:bg-primary hover:text-white text-rose-600 p-1 text-[20px] bg-[#F4F4F4] rounded-md dark:bg-dark"
                                onClick={() => {
                                  const indexValue =
                                    attendanceHolidayOvertimeList.findIndex(
                                      (entry) => entry.id === customRate.id
                                    );

                                  if (indexValue !== -1) {
                                    const removedElement =
                                      attendanceHolidayOvertimeList.splice(
                                        indexValue,
                                        1
                                      );
                                    setReloadValueFirst([
                                      "attendanceHolidayOvertimeList",
                                      customRate.id,
                                    ]);
                                    console.log(
                                      "Removed element:",
                                      removedElement
                                    );
                                  } else {
                                    console.log("Element not found");
                                  }
                                }}
                              />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </FlexCol>
                <div className=" flex justify-between items-center border-t border-black/10 dark:border-white/20 px-4 py-2">
                  <div
                    className="flex justify-start items-center gap-[9px] cursor-pointer    "
                    onClick={(e) => {
                      console.log(e);
                      setAttendanceHolidayOvertimeList([
                        ...attendanceHolidayOvertimeList,
                        {
                          id: e.clientX,
                          rowType: "Two" + e.clientX,
                          field: [
                            {
                              title: "If Employee works more than",
                              type: "time",
                              inputType: "overtimeMinutes" + e.clientX,
                              description: "Description",
                              line: true,
                            },
                            {
                              title: " Type",
                              type: "dropdown",
                              inputType: "overtimeType" + e.clientX,
                              description: "Description",
                              line: true,
                              option: customType,
                            },
                          ],
                        },
                      ]);
                    }}
                  >
                    <IoMdAdd className="group-hover:bg-primary  group-hover:text-white  bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                    <p className="text-xs font-medium dark:text-white ">
                      {t("Add_Range")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FlexCol>
  );
}

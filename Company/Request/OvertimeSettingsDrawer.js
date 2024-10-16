import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../common/FlexCol";
import { Flex, notification } from "antd";
import Dropdown from "../../common/Dropdown";
import FormInput from "../../common/FormInput";
import RadioButton from "../../common/RadioButton";
import API, { action } from "../../Api";
import TimeSelect from "../../common/TimeSelect";
import { useFormik } from "formik";
import * as yup from "yup";
import { NoData } from "../../common/SVGFiles";
import Loader from "../../common/Loader";
import { useNotification } from "../../../Context/Notifications/Notification";
import DrawerPop from "../../common/DrawerPop";
import { useTranslation } from "react-i18next";
import ButtonClick from "../../common/Button";
import TextArea from "../../common/TextArea";
import dayjs from "dayjs";

const OvertimeSettingsDrawer = ({ data, open, close = () => {} }) => {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);
  const [overTimeDetails, setOvertimeDetails] = useState([]);
  const [actionData, setActionData] = useState("");

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

  const { showNotification } = useNotification();

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
      overtime: null,
      amount: "",
      remark: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      overtime: yup.string().required("overime is required"),
      amount: yup.string().required("Amount is required"),
      remark: yup.string().required("Remark is required"),
    }),

    onSubmit: async (e) => {
      console.log(action);
      try {
        const result = await action(API.OVER_TIME_APPROVE_REJECT, {
          selectedType: actionData,
          employeeOvertimeDataIds: [data.employeeOvertimeDataId],
          overtimeTime: e.overtime,
          OvertimeAmount: e.amount,
        });
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            formik.resetForm();
            handleClose();
          }, 1200);
        } else {
          openNotification("error", "Info ", result.message);
        }
      } catch (error) {
        openNotification("error", "Failed ", error.message);
      }
    },
  });

  const getAttendenceDeduction = async () => {
    try {
      const result = await action(
        API.GET_EMPLOYEE_ATTENDENCE_OVER_TIME_DETAILS,
        {
          id: data.employeeOvertimeDataId || null,
        }
        // "http://192.168.0.44/loyaltri-server/api/main"
      );
      if (result.status === 200) {
        setOvertimeDetails(result.result);
        formik.setFieldValue("amount", result.result?.amount);

        const timeString = result?.result?.timeExtra?.toString();
        const parsedTime = timeString.replace("h", ":").replace("m", "");

        formik.setFieldValue(
          "overtime",
          dayjs(parsedTime, "HH:mm").format("HH:mm")
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAttendenceDeduction();
  }, [data]);

  const calculateAmount = async (time) => {
    try {
      const result = await action(API.CALCULATE_AMOUNT_WITH_POLICYS, {
        method: "Overtime",
        hours: time,
        type: "1xSalary",
        employeeDailyAttendanceId: data.employeeOvertimeDataId,
      });
      if (result.status === 200) {
        formik.setFieldValue("amount", result?.result?.amount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DrawerPop
      open={show}
      close={handleClose}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        // console.log(e);
        // formik.handleSubmit();
      }}
      // updateBtn={UpdateBtn}
      updateFun={() => {
        //   UpdateIdBasedCountry();
      }}
      header={[t("Overtime"), t("Employee Overtime and Amount for Approval")]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      // footerBtn={[t("Cancel"), t("Save")]}
      customButton={
        <p className="flex items-center gap-2">
          <ButtonClick
            buttonName={"Approve"}
            BtnType="primary"
            // className={" bg-primary"}
            handleSubmit={() => {
              setActionData("approved");
              formik.handleSubmit();
            }}
          />
          <ButtonClick
            buttonName={"Reject"}
            BtnType="primary"
            danger
            handleSubmit={() => {
              setActionData("reject");

              formik.handleSubmit();
            }}
          />
        </p>
      }
    >
      <FlexCol className={""} gap={30}>
        {/* {Object.keys(overTimeDetails) > 0 ? ( */}
        <>
          <Flex justify="space-between">
            <Flex gap={16}>
              <div className=" size-12 2xl:size-14 rounded-full overflow-hidden bg-primaryalpha/20 vhcenter">
                {overTimeDetails?.profilePicture ? (
                  <img src={overTimeDetails?.profilePicture} alt="" />
                ) : (
                  <h1 className="text-primary font-semibold text-lg 2xl:text-xl">
                    {overTimeDetails?.employeeName?.charAt(0).toUpperCase()}
                  </h1>
                )}
              </div>

              <div>
                <h1 className="font-medium text-lg 2xl:text-xl">
                  {overTimeDetails?.employeeName?.charAt(0).toUpperCase() +
                    overTimeDetails?.employeeName?.slice(1)}
                </h1>
                <p className="para">EMP Code: {overTimeDetails?.code}</p>
              </div>
            </Flex>
            <Flex
              gap={4}
              //   className=" px-3 py-1 rounded-full bg-[#F2F4F7] text-grey h-fit text-sm font-medium"
              align="center"
            >
              {/* <FiClock /> */}
              <p className=" flex gap-1 font-medium text-xs 2xl:text-sm text-grey">
                <span>Date :</span>
                <span> {overTimeDetails?.overTimeDate}</span>
              </p>
            </Flex>
          </Flex>
          <FlexCol gap={20}>
            <Flex gap={12} align="center">
              <div class=" bg-primaryalpha/10 dark:bg-primaryalpha/30 text-primary rounded-full px-2.5 py-1 h-fit w-fit font-medium text-xs flex gap-1.5 vhcenter flex-nowrap">
                <div class="size-1 2xl:size-1.5 rounded-full bg-primary"></div>
                <p class="text-xs 2xl:text-sm font-medium leading-5">
                  <span>Overtime: </span>
                  <span>{overTimeDetails?.timeExtra}</span>
                </p>
              </div>
              <div className="v-divider !h-[15px]" />
              <div class=" bg-gray-500/10 dark:bg-gray-500/30 rounded-full px-2.5 py-1 h-fit w-fit font-medium text-xs flex gap-1.5 vhcenter flex-nowrap">
                <div class="size-1 2xl:size-1.5 rounded-full bg-gray-500"></div>
                <p class="text-xs 2xl:text-sm font-medium leading-5">
                  {overTimeDetails?.shiftName
                    ? overTimeDetails?.shiftName
                    : "Shift not Assigned"}
                </p>
              </div>
            </Flex>

            <div className="grid grid-cols-2 gap-8">
              <TimeSelect
                title="Overtime"
                placeholder="Number of hours"
                required={true}
                value={formik.values.overtime}
                change={(e) => {
                  calculateAmount(e);

                  formik.setFieldValue("overtime", e);
                }}
                error={formik.errors.overtime}
              />
              <FormInput
                title="Amount"
                placeholder="Amount Per Hour"
                value={formik.values.amount}
                change={(e) => {
                  formik.setFieldValue("amount", e);
                }}
                type="number"
                required
                error={formik.errors.amount}
              />
              <TextArea
                className="col-span-2"
                title="Remark"
                placeholder="Remark"
                value={formik.values.remark}
                change={(e) => {
                  formik.setFieldValue("remark", e);
                }}
                error={formik.errors.remark}
                required
              />
            </div>
          </FlexCol>
        </>
        {/* ) : Object.keys(overTimeDetails) === 0 ? (
        <NoData />
      ) : (
        <Loader />
      )} */}
      </FlexCol>
    </DrawerPop>
  );
};

export default OvertimeSettingsDrawer;

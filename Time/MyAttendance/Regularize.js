import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import TabsNew from "../../common/TabsNew";
import { Flex, notification } from "antd";
import { FiClock } from "react-icons/fi";
import TextArea from "../../common/TextArea";
import API, { action } from "../../Api";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import CheckBoxInput from "../../common/CheckBoxInput";
import Loader from "../../common/Loader";
import { useNotification } from "../../../Context/Notifications/Notification";

export default function Regularize({
  open,
  close = () => {},
  employeeId,
  companyDataId,
  // refresh,
  updateId,
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [regularize, setRegularize] = useState();

  useEffect(() => {
    console.log(open);
    setCompanyId(localStorage.getItem("companyId"));
  }, [open]);
  const handleClose = () => {
    // close(false);
    setShow(false);
  };
  // useEffect
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

  const getRegularize = async () => {
    const result = await action(API.GET_ID_BASED_REQULARIZE, {
      regularizingEmployeeAttendanceId: updateId,
    });
    result.result.deductions?.map((each, i) => {
      formik.setFieldValue(`excuseReason_${i}`, each.excuseReason);
    });
    setRegularize(result.result);

    console.log(result);
  };

  useEffect(() => {
    console.log(updateId);
    if (updateId) {
      getRegularize();
    }
    // console.log(updateId);
  }, [updateId]);

  const initialValues = {
    reason: "",
  };

  regularize?.deductions?.forEach((deduction, index) => {
    initialValues[`excuseReason_${index}`] = "";
    initialValues[`deductionType_${index}`] = "";
    initialValues[`excuseSelect_${index}`] = "";
  });

  const formik = useFormik({
    initialValues,

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      // department: yup.string().required("Department is Required"),
      // description: yup.string().required("Description is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      console.log(e);
      try {
        console.log(API.HOST + API.CREATE_REQULARIZE);
        const result = await action(
          API.CREATE_REQULARIZE,
          regularize?.deductions
            .map(
              (deduction, index) =>
                e[`excuseSelect_${index}`] && {
                  employeeId: employeeId,
                  employeeCompanyId: companyId,
                  employeeDailyAttendanceId:
                    regularize?.employeeDailyAttendanceId,
                  deductionDetails: e[`deductionType_${index}`],
                  excuseReason: e[`excuseReason_${index}`],
                }
            )
            .filter((data) => data)
          // "http://192.168.0.44/loyaltri-server/api/main"
        );

        console.log(result);

        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            // refresh();
            setLoading(false);
          }, 1000);
          formik.resetForm();
        }
      } catch (error) {
        console.log(error);
        openNotification("error", "Failed ", error.message);
        setLoading(false);
      }
    },
  });
  const isAnyTextAreaEmpty = () => {
    return regularize?.deductions?.every(
      (_, i) => !formik.values[`excuseReason_${i}`]
    );
  };
  return (
    <DrawerPop
      open={show}
      close={(e) => {
        // console.log(e);
        handleClose();
        // close(e);
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
        !UpdateBtn ? t("Regularize") : t(""),
        !UpdateBtn
          ? t("Standardizing Entry Request Procedures for Timely Accuracy")
          : t(""),
      ]}
      //   btnName="Submit"
      //   saveAndContinue={true}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("Update_Country")]}
      footerBtnDisabled={loading || isAnyTextAreaEmpty()}
    >
      {regularize ? (
        <FlexCol className={""} gap={20}>
          <Flex justify="space-between">
            <Flex gap={16}>
              <div className="flex justify-start items-center gap-2">
                {regularize?.profilePicture ? (
                  <img
                    src={regularize?.profilePicture}
                    alt=""
                    className="shadow-dashboard w-20 rounded-full"
                  />
                ) : (
                  <p className="flex items-center border-2 border-white shadow-dashboard justify-center size-14 font-semibold bg-primaryLight text-primary rounded-full">
                    {regularize?.employeeName?.charAt(0).toUpperCase()}
                  </p>
                )}
                <div className="flex flex-col gap-0.5">
                  <p className=" h2">{regularize?.employeeName}</p>
                  <p className=" para">{regularize?.employeeEmailId}</p>
                </div>
              </div>
            </Flex>
            <Flex
              gap={4}
              className=" px-3 py-1 rounded-full bg-primaryLight text-primary dark:text-secondary dark:bg-primaryLight h-fit text-sm font-medium"
              align="center"
            >
              <FiClock />
              <p className=" text-xs">{regularize?.shiftName}</p>
            </Flex>
          </Flex>
          <FlexCol gap={12}>
            <p className=" text-base font-medium text-grey dark:text-white">
              Attendance Date: {regularize?.date}
            </p>
            <Flex gap={12}>
              <div className="flex p-2 bg-greenLight dark:bg-green-600/30 rounded-full text-green-600 dark:text-green-300 justify-center items-center gap-1.5 text-xs font-medium">
                <FiClock />
                <p>Check In: {regularize?.firstCheckInTime}</p>
              </div>
              <div className="flex p-2 bg-redlight dark:bg-red-600/30 rounded-full text-rose-900 dark:text-rose-300 justify-center items-center gap-1.5 text-xs font-medium">
                <FiClock />
                <p>Check Out: {regularize?.lastCheckOutTime || "--"}</p>
              </div>
            </Flex>
            {/* </FlexCol>
        <FlexCol> */}
            {regularize?.deductions?.map((each, i) => (
              <div className="p-2 bg-secondaryWhite dark:bg-dark rounded-lg gap-2">
                <Flex gap={2} justify="space-between">
                  <FlexCol gap={8}>
                    <div className=" flex gap-2 ite">
                      <p className="text-grey font-medium dark:text-white">
                        Deduction Type:
                      </p>
                      {/* {regularize?.deductions.map((each) => ( */}
                      <p className="px-2.5 py-[2px] text-xs font-medium rounded-full text-[#B54708] bg-[#FFFAEB] dark:bg-yellow-600/30 dark:text-yellow-300">
                        {each?.deductionDetails}
                      </p>
                      {/* ))} */}
                      <p className="px-2.5 py-[2px] text-xs font-medium rounded-full text-[#B54708] bg-[#FFFAEB] dark:bg-yellow-600/30 dark:text-yellow-300">
                        {each?.timeDifference}
                      </p>
                    </div>
                    <div className=" flex ite">
                      <p className="text-grey font-medium dark:text-white">
                        Deduction Amount:
                      </p>
                      {/* {regularize?.deductions.map((each) => ( */}

                      <p className="px-2.5 py-[2px] text-xs font-medium rounded-full text-[#b92828] ">
                        {each?.deductionAmount}
                      </p>
                      {/* ))} */}
                      {/* <p className="px-2.5 py-[2px] text-xs font-medium rounded-full text-[#B54708] bg-[#FFFAEB]">
                    {regularize?.message}
                  </p> */}
                    </div>
                  </FlexCol>
                  <CheckBoxInput
                    titleRight="Select"
                    change={(e) => {
                      formik.setFieldValue(`excuseSelect_${i}`, e);
                      formik.setFieldValue(
                        `deductionType_${i}`,
                        each?.deductionDetails
                      );
                    }}
                    value={formik.values[`excuseSelect_${i}`]}
                    disabled={each.excuseReason ? true : false}
                  />
                </Flex>
                <TextArea
                  title="Reason"
                  change={(e) => {
                    formik.setFieldValue(`excuseReason_${i}`, e);
                  }}
                  value={
                    formik.values[`excuseReason_${i}`] || each.excuseReason
                  }
                  disabled={formik.values[`excuseSelect_${i}`] ? false : true}
                  placeholder="Reason"
                />
              </div>
            ))}
          </FlexCol>
        </FlexCol>
      ) : (
        <Loader />
      )}
    </DrawerPop>
  );
}

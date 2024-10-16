import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../common/FlexCol";
import FormInput from "../common/FormInput";
import TextArea from "../common/TextArea";
import ToggleBtn from "../common/ToggleBtn";
import { useTranslation } from "react-i18next";
import { Flex, Tag, notification } from "antd";
import DrawerPop from "../common/DrawerPop";
import API, { action } from "../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import Heading from "../common/Heading";
import ModalAnt from "../common/ModalAnt";
import { AiOutlineConsoleSql } from "react-icons/ai";
import popimage from "../../assets/images/image 1467.png";
import { getEmployeeList } from "../common/Functions/commonFunction";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function Approved({
  open,
  close = () => {},
  attendanceId,
  companyDataId,
  employeeId,
  refresh = () => {},
  details,
  employeeShowValue = [],
  actionApi,
}) {
  console.log(details, "details");
  console.log(employeeShowValue, "employeeShowValue");
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [loading, setLoading] = useState(false);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employee, setEmployee] = useState(localStorageData.employeeId);
  const [superiorEmployees, setSuperiorEmployees] = useState();
  const [showModal, setshowModal] = useState(false);

  const { showNotification } = useNotification();

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

  const getApproveList = async () => {
    const result = await action(API.EMPLOYEE_LEAVE_APPROVE_LIST, {
      employeeLeaveApplicationId: employeeId[0],
    });
    setSuperiorEmployees(result.result);
    console.log(result);
  };

  useEffect(() => {
    getApproveList();
  }, []);

  const formik = useFormik({
    initialValues: {
      remark: "",
    },

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(actionApi, {
          id: employeeId,
          employeeId: details[0].employeeId || null,
          remarks: e.remark,
          superiorEmployeeId: employee,
          requestStatus: "Approved",
          companyId: companyId,
          leaveTypeId: details[0].leaveType || null,
          employeeLeaveApplicationId:
            details[0].employeeLeaveApplicationId || null,
          isFinalHeirarchy: details[0].isFinalHeirarchy || null,
          createdBy: employee,
        });
        console.log(result);
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            refresh();
            setShow(false);
            setLoading(false);
          }, 1000);
        } else {
          openNotification("error", "Failed..", result.code);
          setLoading(false);
        }
      } catch (error) {
        openNotification("error", "Failed..", error.code);
        setLoading(false);
      }
    },
  });

  return (
    <DrawerPop
      open={show}
      close={(e) => {
        setShow(e);
      }}
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
      handleSubmit={(e) => {
        if (details.length > 0) {
          setshowModal(true);
        }
      }}
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn ? t("Approved") : t(""),
        !UpdateBtn
          ? t("Manage you companies here, and some lorem ipsu")
          : t(""),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <Flex justify="center" align="center" className="w-5/6 m-auto">
        <FlexCol className={"w-full"}>
          <FlexCol
            className={"border rounded-xl bg-white p-2 dark:bg-gray-600"}
          >
            <Heading
              title={"Approved"}
              description={"Supervisor Pay Description"}
              className={"bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"}
            />
            <div className="pt-0 dark:text-white dark:bg-dark">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  {/* Earnings Table */}
                  <thead>
                    <tr>
                      {employeeShowValue.map((item) => (
                        <th
                          key={item.value}
                          className="font-semibold text-primary text-left"
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-center text-xs">
                    {details &&
                      details.map((each, i) => (
                        <React.Fragment key={i}>
                          <tr className="border-b">
                            {employeeShowValue.map((item) => (
                              <td key={item.value} className="text-left py-2">
                                {each[item.value]?.charAt(0).toUpperCase() +
                                  each[item.value]?.slice(1) || "--"}
                              </td>
                            ))}
                          </tr>

                          {superiorEmployees
                            ?.filter(
                              (data) => data.employeeId === each.employeeId
                            )
                            .map((data) => (
                              <div key={data.employeeId} className="flex gap-3">
                                <span className="text-rose-500">
                                  {data.firstName?.charAt(0).toUpperCase() +
                                    data.firstName?.slice(1) || "--"}
                                </span>
                                <span
                                  className={`text-xs ${
                                    data.firstName &&
                                    "bg-yellow-100 text-yellow-500"
                                  } w-fit px-2 py-1 rounded-full font-normal`}
                                >
                                  {(data.firstName &&
                                    data.status?.charAt(0).toUpperCase() +
                                      data.status?.slice(1)) ||
                                    "--"}
                                </span>
                                <span className="text-primary">
                                  {data.remarks?.charAt(0).toUpperCase() +
                                    data.remarks?.slice(1) || "--"}
                                </span>
                              </div>
                            ))}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FlexCol>
        </FlexCol>
        {console.log(showModal, "showModal")}
        {showModal && (
          <ModalAnt
            isVisible={showModal}
            onClose={() => setshowModal(false)}
            centered={true}
            showOkButton="true"
            onOk={() => {
              formik.handleSubmit();
            }}
            padding="8px"
          >
            <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[506px] p-2">
              <div className="flex gap-3 items-center justify-center">
                <div className="border-2 border-[#FFFFFF] size-[44px] rounded-full flex items-center justify-center bg-[#CBCAFC66]">
                  <img
                    src={popimage}
                    alt="#PunchImage"
                    className="rounded-full w-[28px]"
                  />
                </div>
                <p className="font-semibold text-[18px] 2xl:text-[20px]">
                  Enter your Remarks
                </p>
              </div>

              <div className="flex items-center gap-2 ">
                <TextArea
                  title="Remark"
                  value={formik.values.remark}
                  change={(e) => {
                    formik.setFieldValue("remark", e);
                  }}
                  error={formik.errors.remark}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </ModalAnt>
        )}
      </Flex>
    </DrawerPop>
  );
}

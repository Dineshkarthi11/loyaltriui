import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../common/FlexCol";
import TextArea from "../common/TextArea";
import { useTranslation } from "react-i18next";
import { Flex } from "antd";
import DrawerPop from "../common/DrawerPop";
import API, { action } from "../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import Heading from "../common/Heading";
import ModalAnt from "../common/ModalAnt";
import popimage from "../../assets/images/image 1467.png";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function Rejected({
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
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [loading, setLoading] = useState(false);
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
  };

  useEffect(() => {
    getApproveList();
  }, []);

  const formik = useFormik({
    initialValues: {
      remark: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      remark: yup.string().required("Remark is Required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(actionApi, {
          id: employeeId,
          employeeId: details[0].employeeId || null,
          remarks: e.remark,
          superiorEmployeeId: employee,
          requestStatus: "Rejected",
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
        setshowModal(true);
      }}
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn ? t("Reject") : t(""),
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
              title={"Rejected"}
              description={"Rejected details"}
              className={"bg-primaryalpha/10 p-3 rounded-lg dark:bg-gray-800"}
            />
            <div
              className="pt-0 dark:text-white dark:bg-dark"
              style={{ border: "none" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      {employeeShowValue.map((item) => (
                        <th
                          key={item.value}
                          className="font-semibold text-red-600 text-left"
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-center p-2 text-xs">
                    {details &&
                      details.map((each, i) => (
                        <React.Fragment key={i}>
                          <tr className="border-b border-red-500">
                            {employeeShowValue.map((item) => (
                              <td
                                key={item.value}
                                className="text-left py-2 text-red-600"
                              >
                                {each[item.value] || "--"}
                              </td>
                            ))}
                            {superiorEmployees
                              ?.filter(
                                (data) => data.employeeId === each.employeeId
                              )
                              .map((data) => (
                                <React.Fragment key={data.employeeId}>
                                  <td className="text-red-600">
                                    {data.firstName?.charAt(0).toUpperCase() +
                                      data.firstName?.slice(1) || "--"}
                                  </td>
                                  <td className="text-xs bg-yellow-100 text-yellow-500 w-fit px-2 py-1 rounded-full font-normal">
                                    {data.status?.charAt(0).toUpperCase() +
                                      data.status?.slice(1) || "--"}
                                  </td>
                                  <td className="text-red-600">
                                    {data.remarks?.charAt(0).toUpperCase() +
                                      data.remarks?.slice(1) || "--"}
                                  </td>
                                </React.Fragment>
                              ))}
                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FlexCol>

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
        </FlexCol>
      </Flex>
    </DrawerPop>
  );
}

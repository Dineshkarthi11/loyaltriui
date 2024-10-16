import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FlexCol from "../../common/FlexCol";
import Avatar from "../../common/Avatar";
import TextArea from "../../common/TextArea";
import ButtonClick from "../../common/Button";
import * as yup from "yup";
import { action } from "../../Api";
import { useFormik } from "formik";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function LeaveApproveDrawer({
  open,
  close = () => {},
  data,
  actionApi,
  details,
  employeeId,
}) {
  console.log(data, "data here");
  const { t } = useTranslation();
  const [show, setShow] = useState(open);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employee, setEmployee] = useState(localStorageData.employeeId);
  const [isUpdate, setIsUpdate] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

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
  const handleClose = () => {
    setShow(false);
  };

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
      try {
        const result = await action(actionApi, {
          id: employeeId,
          employeeId: details?.map((each) => each.employeeId) || null,
          remarks: e.remark,
          superiorEmployeeId: employee,
          requestStatus: requestStatus,
          companyId: companyId,
          leaveTypeId: details?.map((each) => each.leaveType) || null,
          employeeLeaveApplicationId: employeeId || null,
          isFinalHeirarchy:
            details?.map((each) => each.isFinalHeirarchy) || null,
          createdBy: employee,
        });
        console.log(result, "rsss");
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            setShow(false);
          }, 1000);
        } else {
          openNotification("error", "Failed..", result.code);
        }
      } catch (error) {
        openNotification("error", "Failed..", error.code);
      }
    },
  });

  return (
    <div>
      <DrawerPop
        open={show}
        close={(e) => {
          handleClose();
        }}
        contentWrapperStyle={{
          width: "540px",
        }}
        handleSubmit={(e) => {
          console.log(e);
        }}
        updateBtn={isUpdate}
        header={[
          !isUpdate ? t("Leave Requeset") : t("Update"),
          !isUpdate ? t("Leave Requeset") : t("Update"),
        ]}
        customButton={
          <>
            <ButtonClick
              buttonName={"Reject Request"}
              BtnType="primary"
              danger
              handleSubmit={() => {
                console.log("reject");
                setRequestStatus("Rejected");
                formik.handleSubmit();
              }} // write your functionality here
            />
            <ButtonClick
              buttonName={"Approve Request"}
              BtnType="primary"
              handleSubmit={() => {
                console.log("Approve");
                setRequestStatus("Approved");
                formik.handleSubmit();
              }} // write your functionality here
            />
          </>
        }
      >
        <FlexCol>
          <div className="flex item-center justify-between">
            <div className="flex items-center gap-1">
              <Avatar
                image={data[0]?.profilePicture}
                name={data[0]?.employeeName}
                className="border-2 border-white shadow-md"
              />
              <div className="flex flex-col gap-0.5 2xl:gap-1">
                <p className="font-medium text-sm 2xl:text-base">
                  {data[0]?.employeeName || "--"}
                </p>
                <p className="text-grey text-[10px] 2xl:text-xs">
                  Emp Code: # {data[0]?.code || "--"}{" "}
                </p>
              </div>
            </div>
            <div className="text-grey text-xs 2xl:text-sm">
              Date : {data[0]?.requesteddate || "--"}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 text-sm 2xl:text-base">
            <div className="flex flex-col gap-0.5 2xl:gap-1">
              <p className="text-grey">Request Type</p>
              <p className="font-medium">Leave Request</p>
            </div>
            <div className="flex flex-col gap-0.5 2xl:gap-1">
              <p className="text-grey">Leave Type</p>
              <p className="font-medium">{data[0]?.LeaveTypeName || "--"}</p>
            </div>
            <div className="flex flex-col gap-0.5 2xl:gap-1">
              <p className="text-grey">No of Days</p>
              <p className="font-medium">{data[0]?.totalLeaveDays || "--"}</p>
            </div>
            <div className="flex flex-col gap-0.5 2xl:gap-1">
              <p className="text-grey">Leave Start Date</p>
              <p className="font-medium">{data[0]?.leaveDateFrom || "--"}</p>
            </div>
            <div className="flex flex-col gap-0.5 2xl:gap-1">
              <p className="text-grey">Leave End Date</p>
              <p className="font-medium">{data[0]?.leaveDateTo || "--"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 2xl:gap-2 text-start bg-[#F8F8FA] dark:bg-dark dark:borderb rounded-lg p-3">
            <p className="font-medium text-xs 2xl:text-sm dark:text-white">
              Reason
            </p>
            <p className="text-grey text-[10px] 2xl:text-xs">
              {data[0]?.leaveReason || "--"}
            </p>
          </div>
          <TextArea
            title="comments"
            placeholder="comments"
            value={formik.values.remark}
            change={(e) => {
              formik.setFieldValue("remark", e);
            }}
          />
        </FlexCol>
      </DrawerPop>
    </div>
  );
}

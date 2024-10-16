import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import { Payrollaction } from "../../PayRollApi";
import DrawerPop from "../../common/DrawerPop";
import TextArea from "../../common/TextArea";
import FlexCol from "../../common/FlexCol";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function RejectedMyWorkExpense({
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
  const [loggedEmployeeId, setLoggedEmployeeId] = useState(
    localStorageData.employeeId
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
      remark: "",
    },

    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      remark: yup.string().required("Remark is required"),
    }),

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await Payrollaction(actionApi, {
          employeeWorkExpenseId: employeeId,
          actionEmployeeId: loggedEmployeeId,
          actionStatus: 2,
          remarks: e.remark,
          modifiedBy: loggedEmployeeId,
        });
        console.log(result);
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            refresh();
            setLoading(false);
            console.log(refresh, "refreshhh wrking");
            close(false);
          }, 1000);
        } else {
          openNotification("error", "Info", result.code);
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
        close(e);
      }}
      handleSubmit={(e) => {
        formik.handleSubmit();
      }}
      updateBtn={UpdateBtn}
      header={[
        !UpdateBtn ? t("Rejected") : t(""),
        !UpdateBtn
          ? t("Manage you companies an review employee expense for rejection")
          : t(""),
      ]}
      footerBtn={[t("Cancel"), !UpdateBtn ? t("Submit") : t("")]}
      footerBtnDisabled={loading}
    >
      <FlexCol className={""} gap={8}>
        <div className="flex flex-col gap-2 ">
          <div className="grid grid-cols-2 gap-4 border border-primaryLight bg-primaryLight rounded-sm p-2">
            {employeeShowValue.map((item) => (
              <h2 className=" h2 text-primary">{item.title}</h2>
            ))}
          </div>
          <div
            className={` overflow-auto w-full ${
              employeeId?.length > 1 ? "h-56" : ""
            }`}
          >
            {details &&
              details?.map((each, i) => (
                <div className=" grid grid-cols-2 gap-4 p-2">
                  {employeeShowValue.map((item) => (
                    <div className=" flex items-center gap-2">
                      <p className=" text-xs text-primary">
                        {each[item.value]}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <TextArea
          title="Remark"
          value={formik.values.remark}
          change={(e) => {
            formik.setFieldValue("remark", e);
          }}
          error={formik.errors.remark}
          required
        />
      </FlexCol>
    </DrawerPop>
  );
}

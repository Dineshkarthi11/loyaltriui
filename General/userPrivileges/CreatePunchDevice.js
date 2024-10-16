import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DrawerPop from "../../common/DrawerPop";
import FormInput from "../../common/FormInput";
import API, { action } from "../../Api";
import { useFormik } from "formik";
import * as yup from "yup";
import CheckBoxInput from "../../common/CheckBoxInput";
import { NoData } from "../../common/SVGFiles";
import { getEmployeeList } from "../../common/Functions/commonFunction";
import Avatar from "../../common/Avatar";
import { useNotification } from "../../../Context/Notifications/Notification";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function CreatePunchDevice({
  open,
  close = () => {},
  updateId,
  companyDataId,
  refresh,
  data,
}) {
  const { t } = useTranslation();

  const [show, setShow] = useState(open);
  const [isUpdate, setIsUpdate] = useState();
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [employeeList, setEmployeeList] = useState([]);
  const [allSelect, setAllSelect] = useState(false);

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

  const getEmployee = async () => {
    try {
      const result = await getEmployeeList();
      setEmployeeList(
        result?.map((each) => ({
          id: each?.employeeId,

          label: each?.firstName,

          value: each?.designation,
          punchDevice: null,

          assign: false,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      deviceName: "",
      serialNumber: "",
      // employee: [],
    },
    validateOnChange: false,
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      deviceName: yup.string().required("Device Name is required"),
      serialNumber: yup.string().required("Serial Number is required"),
      // employee: yup
      //   .array()
      //   .min(1, "Please choose at least one Employee")
      //   .required("Please choose Employee"),
    }),
    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.SAVE_PUNCH_DEVICE, {
          deviceName: e.deviceName,
          serialNumber: e.serialNumber,
          createdBy: employeeId,
          employeeId: employeeList
            ?.map((sw) => sw?.assign && sw.id)
            ?.filter((data) => parseInt(data)),
          punchMethodId: updateId,
        });
        console.log(result);
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            handleClose();
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        openNotification("error", "Failed..", error);
        setLoading(false);
      }
    },
  });
  useEffect(() => {
    getEmployee();
  }, []);
  const handleToggleList = (id, checked) => {
    if (id === 0) {
      setEmployeeList((prevSwitches) =>
        prevSwitches?.map((sw) => ({ ...sw, assign: checked }))
      );
    } else {
      setEmployeeList((prevSwitches) =>
        prevSwitches?.map((sw) =>
          sw?.id === id ? { ...sw, assign: checked } : sw
        )
      );
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
      updateBtn={isUpdate}
      updateFun={() => {}}
      header={["Create Punch Device", "Punch Device"]}
      footerBtn={[t("Cancel"), t("Save")]}
      footerBtnDisabled={loading}
    >
      <div className="flex flex-col gap-6">
        <FormInput
          title="Device Name "
          placeholder="Device Name "
          value={formik.values.deviceName}
          change={(e) => {
            formik.setFieldValue("deviceName", e);
          }}
          error={formik.errors.deviceName}
          required
        />
        <FormInput
          title="Serial Number"
          placeholder="Serial Number"
          value={formik.values.serialNumber}
          change={(e) => {
            formik.setFieldValue("serialNumber", e);
          }}
          error={formik.errors.serialNumber}
          required
        />
        <div className="flex justify-start items-center">
          <CheckBoxInput
            titleRight="Select All"
            change={(e) => {
              handleToggleList(0, e);
              setAllSelect(e);
              console.log(e);
            }}
            value={allSelect}
          />
        </div>
        <div className=" flex flex-col gap-2 overflow-scroll">
          {employeeList?.length !== 0 ? (
            employeeList?.map((each) => (
              <div
                className={`grid grid-cols-4 items-center hover:bg-primaryalpha/10 dark:hover:bg-primaryalpha/20 p-3 rounded-md cursor-pointer
                  
                   ${
                     each.assign
                       ? "bg-primaryalpha/5 dark:bg-primaryalpha/15"
                       : ""
                   }
                  `}
              >
                <div
                  className=" col-span-3 flex items-center gap-3"
                  onClick={() => {
                    handleToggleList(each.id, !each.assign);
                  }}
                >
                  <Avatar
                    name={each.label}
                    image={each.profilePicture}
                    className="size-10"
                  />
                  <div className=" flex flex-col gap-0.5">
                    <h1 className="h2">
                      {each.label?.charAt(0).toUpperCase() +
                        each.label?.slice(1)}
                    </h1>
                    <p className=" text-grey text-sm">{each.value}</p>
                  </div>
                </div>

                <div className="col-span-1 flex justify-end items-center">
                  <CheckBoxInput
                    change={(e) => {
                      console.log(e);
                      handleToggleList(each.id, e === 1 ? true : false);
                    }}
                    value={each.assign}
                  />
                </div>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </DrawerPop>
  );
}

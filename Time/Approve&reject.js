import React, { useMemo, useState } from "react";
import FormInput from "../common/FormInput";
import DrawerPop from "../common/DrawerPop";
import TextArea from "../common/TextArea";
import RadioButton from "../common/RadioButton";
import ButtonClick from "../common/Button";
import FlexCol from "../common/FlexCol";
import Avatar from "../common/Avatar";
import DateSelect from "../common/DateSelect";
import { useFormik } from "formik";
import API, { action } from "../Api";
import { GoDotFill } from "react-icons/go";
import { useNotification } from "../../Context/Notifications/Notification";
import localStorageData from "../common/Functions/localStorageKeyValues";

const Approvereject = ({
  open,
  close = () => {},
  employeeId,
  details,
  refresh = () => {},
  reject = false,
}) => {
  const [show, setShow] = useState(open);
  const [selectedOption, setSelectedOption] = useState("No");
  const [showDate, setshowDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [superiorEmployeeId, setSuperiorEmployeeId] = useState(
    localStorageData.employeeId
  );
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' locale formats date as DD/MM/YYYY
  };
  const handleRadioChange = (e) => {
    setSelectedOption(e);
    if (e === "Yes") {
      setshowDate(true);
    } else {
      setshowDate(false);
    }
    console.log(e);
  };
  const formik = useFormik({
    initialValues: {
      assetName: details[0].assetTypeName || "",
      description: details[0].requestDescription || "",
      serialNo: "",
      validUpto: "",
      warrantyExpiry: "",
      remarks: "",
    },

    onSubmit: async (e) => {
      setLoading(true);
      try {
        const result = await action(API.UPDATE_EMPLOYEE_ASSETS_REQUEST, {
          companyId: companyId,
          id: employeeId,
          superiorEmployeeId: superiorEmployeeId,
          requestStatus: requestStatus,
          remarks: e.remarks || null,
          assetName: e.assetName || null,
          description: e.description || null,
          serialNo: e.serialNo || null,
          validUpto: e.validUpto || null,
          assetSpecification: details[0].assetSpecification || null,
          isUnderwarranty: selectedOption || null,
          warrantyExpiry: e.warrantyExpiry || null,
        });
        console.log(result);
        if (result.status === 200) {
          openNotification("success", "Successful", result.message);
          setTimeout(() => {
            refresh(true);
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
        handleClose();
      }}
      contentWrapperStyle={{
        width: "590px",
      }}
      handleSubmit={(e) => {
        console.log(e);
      }}
      // handleSubmit={formik.handleSubmit()}
      updateBtn={""}
      updateFun={() => {}}
      header={["Requested Asset", "Manage Requested Assets."]}
      footerBtnDisabled={loading}
      customButton={
        <p className="flex items-center gap-2">
          {reject ? (
            <ButtonClick
              buttonName={"Reject Request"}
              BtnType="primary"
              danger
              handleSubmit={() => {
                setRequestStatus("Rejected");
                formik.handleSubmit();
              }}
            />
          ) : (
            <ButtonClick
              buttonName={"Assign Asset"}
              BtnType="primary"
              handleSubmit={() => {
                setRequestStatus("Approved");
                formik.handleSubmit();
              }}
            />
          )}
        </p>
      }
      // header={[t("Add a New Shift"), t("Add a New Shift Description")]}
      // footerBtn={[t("Cancel"), t("Add Shift")]}
    >
      <FlexCol>
        {details?.map((items, index) => (
          <>
            <div
              key={index}
              class="self-stretch justify-start items-center gap-[30px] inline-flex"
            >
              <div class="flex-col justify-start items-center inline-flex">
                <div class="justify-start items-center gap-3.5 inline-flex">
                  <Avatar
                    image={""}
                    name={items?.employeeName}
                    className="border-2 border-white shadow-md size-10 2xl:size-12"
                  />
                  <div class="flex-col justify-start items-start gap-0.5 inline-flex">
                    <div class="self-stretch text-sm 2xl:text-base font-medium">
                      {items?.employeeName}
                    </div>
                    <div class="text-grey text-xs 2xl:text-sm">
                      EMP Code: #{items?.employeeAssetRequestId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-start md:items-center md:flex-row md:justify-between md:w-[380px]">
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Request Type</p>
                <p className="text-sm 2xl:text-base font-medium">
                  Asset Request
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Asset Type</p>
                <p className="text-sm 2xl:text-base font-medium">
                  {items?.assetTypeName}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-start md:items-center md:flex-row md:justify-between md:w-[400px]">
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Description</p>
                <p className="text-sm 2xl:text-base font-medium break-all">
                  {items?.requestDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-start md:items-center md:flex-row md:justify-between md:w-[380px]">
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">
                  {" "}
                  Requested Date
                </p>
                <p className="text-sm 2xl:text-base font-medium">
                  {formatDate(items?.createdOn)}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-grey text-sm 2xl:text-base">Assign Status</p>
                <p
                  className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-xl ${
                    items?.requestStatusName === "Pending"
                      ? "bg-orange-100 text-orange-500"
                      : items?.status === "Approved"
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  <GoDotFill size={12} />
                  <span className="text-xs 2xl:text-sm">
                    {items?.requestStatusName}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {!reject && (
                <>
                  <FormInput
                    title="Serial No"
                    placeholder="Serial No"
                    change={(e) => {
                      formik.setFieldValue("serialNo", e);
                    }}
                    value={formik.values.serialNo}
                  />

                  <FormInput
                    title="Asset Name"
                    placeholder="Asset Name"
                    change={(e) => {
                      formik.setFieldValue("assetName", e);
                    }}
                    value={formik.values.assetName}
                  />
                </>
              )}
            </div>

            <TextArea
              title="Description"
              placeholder="Description"
              change={(e) => {
                formik.setFieldValue("remarks", e);
              }}
              value={formik.values.remarks}
            />
            {!reject && (
              <div className="flex items-center gap-5">
                <p className="flex flex-col gap-0.5 2xl:gap-1">
                  <span className="text-xs 2xl:text-base font-medium">
                    Is asset under warranty
                  </span>
                  <span className="text-grey text-xs 2xl:text-sm">
                    {" "}
                    Set asset warrant informations
                  </span>
                </p>

                <RadioButton
                  options={[
                    {
                      label: "Yes",
                      value: "Yes",
                    },
                    {
                      label: "No",
                      value: "No",
                    },
                  ]}
                  value={selectedOption}
                  change={(e) => {
                    handleRadioChange(e);
                  }}
                />
              </div>
            )}
            {showDate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DateSelect
                  title="Warranty Expiry"
                  change={(e) => {
                    formik.setFieldValue("warrantyExpiry", e);
                  }}
                  value={formik.values.warrantyExpiry}
                />
                <DateSelect
                  title="Asset Renewal"
                  change={(e) => {
                    formik.setFieldValue("validUpto", e);
                  }}
                  value={formik.values.validUpto}
                />
              </div>
            )}

            <div class="flex flex-col gap-4">
              <div class="text-xs 2xl:text-sm font-semibold">
                Hierarchy Approval Status
              </div>
              {items?.statusdot?.map((status, i) => (
                <div class="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        image={items?.multiImage?.[i] || ""}
                        name={items?.name?.[i] || ""}
                        className="border-2 border-white shadow-md size-10 2xl:size-12"
                      />
                      <div className="text-xs font-semibold">
                        {items?.name?.[i]}{" "}
                      </div>
                    </div>
                    {/* <div className="w-fit px-2 py-0.5 rounded-xl bg-red-100 text-red-600">
                      pending
                    </div> */}
                    <div
                      className={`flex items-center gap-1 w-fit px-2 py-0.5 text-[11px] 2xl:text-[13px] rounded-full font-medium ${
                        status === "Pending"
                          ? "bg-orange-100 text-orange-500"
                          : status === "Approved"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ))}
      </FlexCol>
    </DrawerPop>
  );
};

export default Approvereject;

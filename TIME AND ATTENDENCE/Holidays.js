import React, { useEffect, useState } from "react";
import TableAnt from "../common/TableAnt";
import API, { action } from "../Api";
import PopImg from "../../assets/images/EmpLeaveRequest.svg"
import { holidayHeader, holidayHeaderList, holidayViewHeader } from "../data";
import { Button, Flex, notification } from "antd";
import Breadcrumbs from "../common/BreadCrumbs";
import ButtonClick from "../common/Button";
import FlexCol from "../common/FlexCol";
import AddHoliday from "./AddHoliday";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Heading from "../common/Heading";
import ModalAnt from "../common/ModalAnt";
import { useNotification } from "../../Context/Notifications/Notification";

export default function Holidays() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const [holidays, setHolidays] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);

  const [navigationValue, setNavigationValue] = useState(t("Holiday_Settings"));

  const breadcrumbItems = [
    { label: t("Settings"), url: "" },
    { label: t("Time_and_attendence"), url: "" },
    { label: navigationValue, url: "" },
  ];

  const handleShow = () => setShow(true);
  useEffect(() => {
    setCompanyId(localStorage.getItem("companyId"));
  }, []);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
      placement: "top",
      // stack: 2,
      style: {
        background: `${type === "success"
          ? `linear-gradient(180deg, rgba(204, 255, 233, 0.8) 0%, rgba(235, 252, 248, 0.8) 51.08%, rgba(246, 251, 253, 0.8) 100%)`
          : "linear-gradient(180deg, rgba(255, 236, 236, 0.80) 0%, rgba(253, 246, 248, 0.80) 51.13%, rgba(251, 251, 254, 0.80) 100%)"
          }`,
        boxShadow: `${type === "success"
          ? "0px 4.868px 11.358px rgba(62, 255, 93, 0.2)"
          : "0px 22px 60px rgba(134, 92, 144, 0.20)"
          }`,
      },
      // duration: null,
    });
  };
  const getHoliday = async () => {
    try {
      const result = await action(API.GET_HOLIDAY, { companyId: companyId });
      // console.log(result,"HolidayResult");
      setFetchedData(result?.result || []);
      setHolidays(result?.result?.map((each) => ({
        ...each,
        employeeName: each.employees?.map((data) => data.employeeName),
        name: each.employees?.map((data) => data.employeeName),
        multiImage: each.employees?.map((data) => data.profilePicture),
        employeeId: each.employees?.map((data) => data.employeeId),
      })));
    } catch (error) {
      openNotification("error", "Failed..", error.code);
    }
  };

  useEffect(() => {
    getHoliday();
  }, []);


  const { showNotification } = useNotification();

  const handleClick = () => {
    showNotification({
      placement: 'top',
      message: 'Profile updated successfully!',
      // description: 'Your update has been successfully saved, and all changes are now reflected on the page.',
      // style: { width: 400 },
      // type: 'error',
    });
  };
  return (
    <FlexCol>
      <Flex justify="space-between">
        {/* <Breadcrumbs
          items={breadcrumbItems}
          description={t("Main_Description")}
        /> */}
        <Heading
          title={t("Holiday_Settings")}
          description={t("Allow for the configuration of specific dates as holidays, ensuring proper employee compensation and scheduling adjustments.")}
        />
        <ButtonClick
          buttonName={t("Create_Holidays")}
          handleSubmit={() => {
            setShow(true);
          }}
          BtnType="Add"
        />
        {/* <Button type="primary" onClick={handleClick}>
        Show 
      </Button> */}
      </Flex>
      <TableAnt
        data={holidays}
        header={holidayHeaderList}
        actionID="holidayId"
        updateApi={API.UPDATE_HOLIDAY_STATUS}
        deleteApi={API.DELETE_HOLIDAT_BY_ID}
        path={"Holiday_Settings"}
        navigationValue={navigationValue}
        buttonClick={(e, company) => {
          setUpdateId(e);
        }}
        clickDrawer={(e) => {
          handleShow();
        }}
        referesh={() => {
          getHoliday();
        }}
        viewClick={(e, i) => {
          console.log(e, i);
          setViewOpen(true);

          setViewData(i);
        }}
        viewOutside={true}
      />

      {show && (
        <AddHoliday
          open={show}
          close={(e) => {
            setUpdateId(null);
            setShow(e);
            getHoliday();
          }}
          updateId={updateId}
          // refresh={() => {
          //   getHoliday();
          // }}
        />
      )}

      <ModalAnt
        isVisible={viewOpen}
        onClose={() => setViewOpen(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/5">
              <img
                src={PopImg}
                alt="Img"
                className="rounded-full w-5 2xl:w-[24px]"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Holiday
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              Details of Holiday
            </p>
          </div>
        </div>
        <div className="max-h-[320px] overflow-auto mt-2">
          <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
            <div className="grid grid-cols-3 justify-evenly gap-4">
              {holidayViewHeader.map((each, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <p className="text-xs 2xl:text-sm text-gray-500">{each.title}</p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    <>
                      {viewData[each.value] && viewData[each.value] !== "" ? (
                        typeof viewData[each.value] === "string"
                          ? viewData[each.value].charAt(0).toUpperCase() +
                          viewData[each.value].slice(1).replace(/([A-Z])/g, " $1")
                          : ""
                      ) : (<p>--</p>)}
                      {each.value === "isActive" ? (
                        viewData[each.value] === 1 ? (
                          <p className="text-xs 2xl:text-sm font-semibold text-emerald-600 bg-emerald-100 rounded-full text-green px-2 py-0.5 w-fit">
                            Active
                          </p>
                        ) : (
                          <p className="text-xs 2xl:text-sm font-semibold bg-rose-100 rounded-full text-rose-600 px-2 py-1 w-fit">
                            In Active
                          </p>
                        )
                      ) : (
                        " "
                      )}
                    </>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalAnt>

      {contextHolder}
    </FlexCol>
  );
}

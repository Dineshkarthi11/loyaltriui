import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../common/FlexCol";
import { Tooltip } from "antd";
import Assetimg from "../../../assets/images/FrameKeyboard.png";
import TableAnt from "../../common/TableAnt";
import API, { action } from "../../Api";
import { myAssets } from "../../data";
import ButtonClick from "../../common/Button";
import { useTranslation } from "react-i18next";
import RequestAssets from "./RequestAssets";
import AssignAsset from "./AssignAsset";

// SWIPER SLIDER
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { PiArrowCircleLeft, PiArrowCircleRight } from "react-icons/pi";
import Heading from "../../common/Heading";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function MyAssets({ path, employee = null }) {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(
    employee || localStorageData.employeeId
  );
  const [employeeAssetsList, setemployeeAssetsList] = useState([]);
  const [employeeRequestList, setemployeeRequestList] = useState([]);
  const [employeeFilterdRequestList, setEmployeefilterdRequestList] = useState(
    []
  );

  const [assignAssets, setAssignAssets] = useState();
  const [requestAssets, setrequestAssets] = useState(false);
  const [navigationPath, setNavigationPath] = useState("asset_History");
  const [FilterKey, setFilterKey] = useState("All");
  const [Filtershow, setFiltershow] = useState("");
  const [assetData, setAssetData] = useState({});
  const [counts, setCounts] = useState({
    All: 0,
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  });
  const statuses = [
    { label: "All", count: counts.All },
    { label: "Approved", count: counts.Approved },
    { label: "Pending", count: counts.Pending },
    { label: "Rejected", count: counts.Rejected },
  ];
  useEffect(() => {
    if (employee) setEmployeeId(employee);
    setCompanyId(localStorageData.companyId);
  }, [employee]);

  const getAssetsTypes = async (e) => {
    try {
      const result = await action(API.GET_EMPLOYEE_ASSETS_LIST, {
        employeeId: employeeId,
      });
      if (result.status === 200) {
        setemployeeAssetsList(result?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAssetsRequestHostory = async (e) => {
    try {
      const result = await action(API.GET_EMPLOYEE_REQUEST_HISTORY, {
        employeeId: employeeId, //employeeId
        companyId: companyId,
      });

      if (result.status === 200) {
        let filteredData = result?.result;
        setCounts({
          All: filteredData.length,
          Pending: filteredData.filter(
            (request) => request.requestStatus === "Pending"
          ).length,
          Approved: filteredData.filter(
            (request) => request.requestStatus === "Approved"
          ).length,
          Rejected: filteredData.filter(
            (request) => request.requestStatus === "Rejected"
          ).length,
        });

        setemployeeRequestList(filteredData);
        setEmployeefilterdRequestList(filteredData); //
      } else {
        // console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useMemo(() => {
    switch (FilterKey) {
      case "Pending":
        setEmployeefilterdRequestList(
          employeeRequestList.filter(
            (request) => request.requestStatus === "Pending"
          )
        );
        break;

      case "Approved":
        setEmployeefilterdRequestList(
          employeeRequestList.filter(
            (request) => request.requestStatus === "Approved"
          )
        );
        break;
      case "Rejected":
        setEmployeefilterdRequestList(
          employeeRequestList.filter(
            (request) => request.requestStatus === "Rejected"
          )
        );
        break;
      case "All":
        setEmployeefilterdRequestList(employeeRequestList);
        break;
      default:
        setEmployeefilterdRequestList(employeeRequestList);
        break;
    }
  }, [FilterKey]);
  useEffect(() => {
    switch (navigationPath) {
      default:
        getAssetsTypes();
        break;
      case "request_History":
        getAssetsRequestHostory();
        break;
      case "asset_History":
        getAssetsTypes();
        break;
    }
  }, [navigationPath, employeeId]);

  const tabs = [
    {
      id: 1,
      title: t("Asset"),
      value: "asset_History",
    },
    {
      id: 2,
      title: t("Request_History"),
      value: "request_History",
    },
  ];

  const actionData = [
    {
      asset_History: { id: 1, data: employeeAssetsList },
      request_History: { id: 2, data: employeeFilterdRequestList },
    },
  ];

  const actionId = [
    {
      asset_History: { id: "designationId" },
      request_History: { id: "employeeAssetRequestId" },
    },
  ];
  useEffect(() => {
    if (navigationPath === "request_History") {
      setFiltershow(true);
    } else {
      setFiltershow(false);
    }
  }, [navigationPath]);

  return (
    <FlexCol>
      <div className="flex flex-col items-start justify-between w-full gap-3 sm:items-center sm:flex-row">
        {path === "employeeProfile" ? (
          <Heading title={"Assets"} description={t("Main_dsc_Asset")} />
        ) : (
          <Heading title={"My Assets"} description={t("Main_dsc_Asset")} />
        )}
        {/* <Heading title={"My Assets"} description={t("Main_dsc_Asset")} /> */}
        <ButtonClick
          buttonName={t("Request_Asset")}
          BtnType="primary"
          handleSubmit={(e) => {
            setrequestAssets(true);
          }}
        />
      </div>
      {employeeAssetsList.length > 0 ? (
        <div className="flex flex-col items-center w-full gap-2 overflow-y-hidden lg:flex-row lg:gap-0">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            // onSlideChange={() => console.log("slide change")}
            // onSwiper={(swiper) => console.log(swiper)}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            // loop={true}
            className="relative w-full lg:w-[95%]"
            breakpoints={{
              700: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1316: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            // navigation={true}
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            {employeeAssetsList?.map((each) => (
              <SwiperSlide className="!bg-transparent">
                <div className="flex gap-3.5 borderb rounded-xl h-full max:h-[105px] p-1.5 bg-white dark:bg-black/50">
                  <div className="size-[80px] 2xl:size-[93px] rounded-md overflow-hidden shrink-0">
                    <img
                      src={Assetimg}
                      alt=""
                      className="object-cover object-center w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col items-start justify-between w-full py-1.5 pr-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4 2xl:gap-2">
                        <p className=" font-medium text-primary 2xl:text-sm text-[10px]">
                          {each.assetName}
                        </p>
                      </div>
                      <div className="text-lg cursor-pointer text-grey text-opacity-80"></div>
                    </div>
                    <p className="text-sm font-semibold capitalize 2xl:text-base">
                      {each.assetTypeName}
                    </p>

                    <div className=" flex gap-2 w-fit text-grey 2xl:text-sm text-[10px] bg-grayLight rounded-full px-[9px] py-[5px] font-medium ">
                      <p>Serial No:</p>
                      <p> {each.serialNo ? each.serialNo : "--"}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {employeeAssetsList.length > 3 && (
            <div className="z-50 w-full lg:w-[5%] h-full lg:h-[105px] bg-white dark:bg-black lg:shadow-[0px_4px_23px_0px] lg:shadow-[rgba(191,_183,_229,_0.38)] vhcenter flex-row-reverse  lg:flex-col">
              <div className="text-3xl cursor-pointer swiper-button-next text-primaryalpha dark:text-white">
                <Tooltip title={"Right"}>
                  <PiArrowCircleRight />
                </Tooltip>
              </div>
              <div className="text-3xl cursor-pointer swiper-button-prev text-primaryalpha dark:text-white">
                <Tooltip placement="bottom" title={"Left"}>
                  <PiArrowCircleLeft />
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      <TableAnt
        tab={tabs}
        handleTabChange={(e) => {
          setNavigationPath(e);
        }}
        path={navigationPath}
        header={myAssets}
        data={
          Object.keys(actionData[0]).includes(navigationPath)
            ? actionData[0]?.[navigationPath].data
            : null
        }
        actionID={
          Object.keys(actionId[0]).includes(navigationPath)
            ? actionId[0]?.[navigationPath].id
            : null
        }
        filterTools={Filtershow}
        statuses={statuses}
        FilterDataChange={(e) => {
          setFilterKey(e);
        }}
        clickDrawer={(rowData, Value, actionId, text) => {
          setAssetData(text);
          setrequestAssets(true);
        }}
        activeStatus={FilterKey}
        deleteApi={API.DELETE_REQUESTED_ASSETS}
        referesh={() => {
          getAssetsRequestHostory();
        }}
      />

      {requestAssets && (
        <RequestAssets
          open={requestAssets}
          close={(e) => {
            setrequestAssets(e);
            setAssetData({});
          }}
          refresh={() => {
            getAssetsRequestHostory();
          }}
          employee={employeeId}
          AssetData={assetData}
        />
      )}
      {assignAssets && (
        <AssignAsset
          open={assignAssets}
          close={(e) => {
            setAssignAssets(e);
          }}
          refresh={() => {
            getAssetsTypes();
          }}
        />
      )}
    </FlexCol>
  );
}

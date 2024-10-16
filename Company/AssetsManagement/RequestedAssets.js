import React, { useEffect, useMemo, useState } from "react";
import FlexCol from "../../common/FlexCol";
import TableAnt from "../../common/TableAnt";
import Heading from "../../common/Heading";
import { useTranslation } from "react-i18next";
import API, { action } from "../../Api";
import { EmployeeRequestedHeader } from "../../data";
import ButtonClick from "../../common/Button";
import { Flex } from "antd";
import Approved from "../../Time/Approved";
import Rejected from "../../Time/Rejected";
import Breadcrumbs from "../../common/BreadCrumbs";
import EmployeeAssetsView from "../../Time/EmployeeAssetsView";
import Approvereject from "../../Time/Approve&reject";
import PopImg from "../../../assets/images/ModalAntImg.svg";
import ModalAnt from "../../common/ModalAnt";
import Avatar from "../../common/Avatar";
import { GoDotFill } from "react-icons/go";
import localStorageData from "../../common/Functions/localStorageKeyValues";

export default function RequestedAssets() {
  const { t } = useTranslation();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [employeeRequestedList, setEmployeeRequestedList] = useState([]);
  const [approvedBtn, setApprovedBtn] = useState();
  const [approvedEmployeeIds, setApprovedEmployeeIds] = useState();
  const [approvedDetails, setApprovedDetails] = useState();
  const [approved, setApproved] = useState(false);
  const [reject, setReject] = useState(false);
  const [uncheckCheckbox, setuncheckCheckbox] = useState(false);
  const [navigationValue, setNavigationValue] = useState(t("Requested Assets"));
  const [view, setView] = useState(false);
  const [FilterKey, setFilterKey] = useState("All");
  const [ModalAntData, setModalAntData] = useState();
  const [SelectedId, setSelectedId] = useState();
  const [employeeRequestData, setEmployeeRequestData] = useState([]);

  const breadcrumbItems = [
    // { label: t("Company"), url: "" },
    // { label: t("Asset_Management"), url: "" },
    { label: navigationValue, url: "" },
  ];
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

  const getEmployeeRequestedList = async () => {
    try {
      const result = await action(API.GET_EMPLOYEE_REQUESTED_ASST, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
      });

      if (result.status === 200) {
        const modifiedResult = result.result.map((item) => {
          const employees = Array.isArray(item.approvalData)
            ? item.approvalData
            : [item.approvalData];
          const items = employees?.map((data) => data.status)
          if (item.AllotedAssetDetails && item.AllotedAssetDetails.serialNo) {
            return {
              ...item,
              serialNo: item.AllotedAssetDetails.serialNo,
              name: employees?.map((data) => data.firstName),
              multiImage: employees?.map((data) => data.profilePicture),
              employeeId: employees?.map((data) => data.employeeId),
              statusdot: items,
              // statusdot: employees?.map((data) => data.status),
              modifiedOn: employees?.map((data) => data.modifiedOn),
              designation: employees?.map((data) => data.designation),
              designation1: item?.designation,
              profilePicture1: item?.profilePicture,
              AllotedAssetDetails: {
                ...item.AllotedAssetDetails,
                serialNo: undefined,
              },
            };
          } else {
            return {
              ...item,

              name: employees?.map((data) => data.firstName),
              multiImage: employees?.map((data) => data.profilePicture),
              employeeId: employees?.map((data) => data.employeeId),
              statusdot: items,
              // statusdot: employees?.map((data) => data.status),
              modifiedOn: employees?.map((data) => data.modifiedOn),
              designation: employees?.map((data) => data.designation),
              designation1: item?.designation,
              profilePicture1: item?.profilePicture,
            };
          }
        });
        setCounts({
          All: modifiedResult.length,
          Pending: modifiedResult.filter(
            (request) =>
              request.requestStatusName === "Pending" &&
              request.mainStatus === "Pending"
          ).length,
          Approved: modifiedResult.filter(
            (request) =>
              request.requestStatusName === "Approved" ||
              request.mainStatus === "Approved"
          ).length,
          Rejected: modifiedResult.filter(
            (request) =>
              request.requestStatusName === "Rejected" ||
              request.mainStatus === "Rejected"
          ).length,
        });

        let filteredResult = modifiedResult;

        // if (FilterKey === 'Pending') {
        //   filteredResult = modifiedResult.filter(request => request.status === 'Pending');
        // } else if (FilterKey === 'Approved') {
        //   filteredResult = modifiedResult.filter(request => request.status === 'Approved');
        // } else if (FilterKey === 'Rejected') {
        //   filteredResult = modifiedResult.filter(request => request.status === 'Rejected');
        // }

        setEmployeeRequestedList(filteredResult);
        setEmployeeRequestData(filteredResult);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  useMemo(() => {
    switch (FilterKey) {
      case "Pending":
        setEmployeeRequestData(
          employeeRequestedList.filter(
            (request) =>
              request.requestStatusName === "Pending" &&
              request.mainStatus === "Pending"
          )
        );
        break;

      case "Approved":
        setEmployeeRequestData(
          employeeRequestedList.filter(
            (request) =>
              request.requestStatusName === "Approved" ||
              request.mainStatus === "Approved"
          )
        );
        break;
      case "Rejected":
        setEmployeeRequestData(
          employeeRequestedList.filter(
            (request) =>
              request.requestStatusName === "Rejected" ||
              request.mainStatus === "Rejected"
          )
        );
        break;
      case "All":
        setEmployeeRequestData(employeeRequestedList);
        break;
      default:
        setEmployeeRequestData(employeeRequestedList);
        break;
    }
  }, [FilterKey]);

  useEffect(() => {
    getEmployeeRequestedList();
  }, []);

  useEffect(() => {
    if (SelectedId && SelectedId.length > 0) {
      const filteredData = employeeRequestedList.filter((item) =>
        SelectedId.includes(item.employeeAssetRequestId)
      );
      const data = filteredData.map((each) => ({
        employeeName:
          each?.employeeName?.charAt(0).toUpperCase() +
          each?.employeeName?.slice(1),
        profilePicture: each?.multiImage,
        designation: each?.designation,
        designation1: each?.designation1,
        profilePicture1: each?.profilePicture1,
        assetTypeName: each?.assetTypeName,
        mainStatus: each?.mainStatus,
        requestDescription: each?.requestDescription,
        requestDate: each?.requestDate,
        serialNo: each?.serialNo,
        requestApprovedDate: each?.requestApprovedDate,
        name: each?.name,
        statusdot: each?.statusdot,
        adminData: each?.adminData,
        requestStatusName: each?.requestStatusName,
        modifiedOn: each?.modifiedOn,
      }))[0];
      setModalAntData(data);
    }
  }, [SelectedId]);

  return (
    <FlexCol>
      <Flex justify="space-between">
        <Heading
          title="Requested Assets"
          description="Requesting funding for asset procurement to enhance operational efficiency and productivity."
        />
        {/* <Breadcrumbs
          items={breadcrumbItems}
          description={t("requestedAsset_description")}
        /> */}
        {approvedBtn && (
          <Flex>
            <ButtonClick
              buttonName={t("Reject")}
              handleSubmit={() => {
                setReject(true);
              }}
              className={"bg-red-500 text-white"}
              // BtnType="Add"
            />
            <ButtonClick
              buttonName={t("Approve")}
              handleSubmit={() => {
                setApproved(true);
              }}
              className={"bg-primary text-white"}
              // BtnType="Add"
            />
          </Flex>
        )}
      </Flex>
      <TableAnt
        data={employeeRequestData}
        header={EmployeeRequestedHeader}
        path="Asset_requests"
        actionID="employeeAssetRequestId"
        clickDrawer={(e, i, value, details) => {
          // console.log(e, i, value, details);
          if (i === "approve") {
            setApproved(e);
          } else if (i === "reject") {
            setReject(true);
          } else if (i === "view") {
            setView(true);
          }
          setApprovedEmployeeIds([value]);
          setApprovedDetails([details]);
        }}
        selectedRow={(key, value, details) => {
          // console.log(value, details);

          setApprovedBtn(details.length !== 0 ? key : false);
          setApprovedEmployeeIds([value]);
          setApprovedDetails(details);
          setuncheckCheckbox(false);
        }}
        // headerTools={true}
        viewOutside={true}
        viewClick={(e) => {
          // console.log("true", e);
          setView(true);
          setApprovedEmployeeIds([parseInt(e)]);
          setSelectedId([parseInt(e)]);

          // getIdBasedEmployeeDetails(e, "vieClick");
        }}
        uncheckCheckbox={uncheckCheckbox}
        filterTools={true}
        statuses={statuses}
        FilterDataChange={(e) => {
          // console.log(e, "Key");
          setFilterKey(e);
        }}
        activeStatus={FilterKey}
      />

      {approved && (
        <Approvereject
          open={approved}
          close={() => {
            setApproved(false);
            setuncheckCheckbox(true);
          }}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          // attendanceId={attendanceId}
          refresh={() => {
            getEmployeeRequestedList();
          }}
          reject={false}
          // actionApi={API.UPDATE_EMPLOYEE_ASSETS_REQUEST}
        />
      )}
      {reject && (
        <Approvereject
          open={reject}
          close={() => {
            setReject(false);
            setuncheckCheckbox(true);
          }}
          employeeId={approvedEmployeeIds}
          details={approvedDetails}
          // attendanceId={attendanceId}
          refresh={() => {
            getEmployeeRequestedList();
          }}
          reject={true}
          // actionApi={API.UPDATE_EMPLOYEE_ASSETS_REQUEST}
        />
      )}

      {/* {view && (
        <EmployeeAssetsView
          viewOpen={view}
          approvedEmployeeId={approvedEmployeeIds}
          close={(e) => {
            setView(false);
          }}
        />
      )} */}

      <ModalAnt
        isVisible={view}
        onClose={() => setView(false)}
        // width="435px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 md:w-[445px] 2xl:w-[553px] p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="border-2 border-[#FFFFFF] size-12 2xl:size-[60px] rounded-full flex items-center justify-center bg-primaryalpha/10">
              <img
                src={PopImg}
                alt="Img"
                className="rounded-full w-6 2xl:w-7"
              />
            </div>
            <p className="font-semibold text-[17px] 2xl:text-[19px]">
              Requested Assets
            </p>
          </div>
          <div className="m-auto">
            <p className="text-center text-xs 2xl:text-sm text-gray-500">
              Requesting funding for asset procurement to enhance operational
              efficiency and productivity.
            </p>
          </div>

          <div className="max-h-[300px] overflow-auto flex flex-col gap-3 mt-2 pr-1.5">
            <div className="flex flex-col gap-4 borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="flex items-center gap-2">
                <Avatar
                  image={ModalAntData?.profilePicture1}
                  name={ModalAntData?.employeeName}
                  className="border-2 border-white shadow-md"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium text-xs 2xl:text-sm">
                    {ModalAntData?.employeeName}
                  </p>
                  <p className="text-[10px] 2xl:text-xs text-grey">
                    {ModalAntData?.designation1}
                  </p>
                </div>
              </div>
              <div className="divider-h"></div>
              <div className="grid grid-cols-3 justify-evenly gap-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">
                    Asset Type Name
                  </p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {ModalAntData?.assetTypeName}
                  </p>
                </div>
                {ModalAntData?.mainStatus !== "Pending" && (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs 2xl:text-sm text-grey">Serial No</p>
                    <p className="text-xs 2xl:text-sm font-semibold">
                      {ModalAntData?.serialNo ? ModalAntData.serialNo : "---"}
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">Status</p>
                  <p
                    className={`flex vhcenter w-fit px-1 py-0.5 rounded-full ${
                      ModalAntData?.requestStatusName === "Pending"
                        ? "bg-orange-100 text-orange-600"
                        : ModalAntData?.requestStatusName === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <GoDotFill size={12} />
                    <span className="font-medium text-xs 2xl:text-sm">
                      {ModalAntData?.requestStatusName}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs 2xl:text-sm text-grey">
                    Requested Date
                  </p>
                  <p className="text-xs 2xl:text-sm font-semibold">
                    {ModalAntData?.requestDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="borderb rounded-lg p-3 bg-[#F9F9F9] dark:bg-dark">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-xs 2xl:text-sm">Description</p>
                <p className="text-grey text-[10px] 2xl:text-xs">
                  {ModalAntData?.requestDescription}
                </p>
              </div>
            </div>
            {ModalAntData?.suemployees?.comment && (
              <div className="divider-h"></div>
            )}
            {ModalAntData?.suemployees?.comment && (
              <div className="flex flex-col gap-1">
                <div className="font-medium text-xs 2xl:text-sm text-grey">
                  Comment
                </div>
                <div className="font-medium text-xs 2xl:text-sm">
                  {ModalAntData?.suemployees?.comment}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {ModalAntData?.adminData && (
                <>
                  <div className="font-medium text-xs 2xl:text-sm text-grey">
                    Approval Flow Employee Status
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        image={ModalAntData?.adminData?.profilePicture}
                        name={ModalAntData?.adminData?.fullName}
                        className="border-2 border-white shadow-md"
                      />
                      <div className="flex flex-col gap-0.5">
                        <p className="font-medium text-xs 2xl:text-sm">
                          {ModalAntData?.adminData?.fullName}
                        </p>
                        <p className="text-grey text-[10px] 2xl:text-xs">
                          {ModalAntData?.adminData?.designation}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p
                        className={`flex items-center justify-end gap-1 text-[11px] 2xl:text-[13px] mr-1 ${
                          ModalAntData?.mainStatus === "Pending"
                            ? " text-orange-600"
                            : ModalAntData?.mainStatus === "Rejected"
                            ? " text-red-600"
                            : " text-green-600"
                        }`}
                      >
                        {ModalAntData?.mainStatus}
                      </p>
                      <p className="flex justify-end text-grey text-[10px] 2xl:text-xs mr-0">
                        {ModalAntData?.adminData?.modifiedOn?.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {ModalAntData?.name?.map((name, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      image={ModalAntData?.profilePicture[index]}
                      name={name}
                      className="border-2 border-white shadow-md"
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-xs 2xl:text-sm">{name}</p>
                      <p className="text-grey text-[10px] 2xl:text-xs">
                        {ModalAntData?.designation[index]}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {ModalAntData?.mainStatus !== "Pending" &&
                    ModalAntData?.statusdot[index] === "Pending" ? (
                      <div className="justify-end mr-1 whitespace-nowrap text-[11px] 2xl:text-[13px]">
                        No Action Required
                      </div>
                    ) : (
                      <div
                        className={`flex items-center justify-end gap-1 text-[11px] 2xl:text-[13px] mr-1 ${
                          ModalAntData?.statusdot[index] === "Pending"
                            ? "text-orange-600"
                            : ModalAntData?.statusdot[index] === "Rejected"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {ModalAntData?.statusdot[index]}
                      </div>
                    )}

                    <div className="flex text-grey text-[10px] 2xl:text-xs justify-end mr-0">
                      {ModalAntData?.modifiedOn[index]?.split(" ")[0] || ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalAnt>
    </FlexCol>
  );
}

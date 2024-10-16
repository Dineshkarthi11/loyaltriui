import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import DragCard from "./DragCard";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import ReqImg from "../../assets/images/discover/RequestsImg.png";
import Avatar from "../common/Avatar";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import localStorageData from "../common/Functions/localStorageKeyValues";

const SEGMENTS = [
  { label: "Excuses", type: "Excuses", permissionId: 54 },
  { label: "Punch Approval", type: "Punch Approval", permissionId: 55 },
  { label: "Work From Home", type: "Work From Home", permissionId: 56 },
  { label: "Letter Request", type: "Letter Request", permissionId: 57 },
  {
    label: "Leave Request",
    type: "Leave Request",
    permissionId: 58,
    Action: "Action",
    options: ["Approve", "Reject"],
  },
];

export default function RequestsCard() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [selectedSegment, setSelectedSegment] = useState("Excuses");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loginData = localStorageData.LoginData;
    if (
      loginData &&
      loginData.userData &&
      Array.isArray(loginData.userData.permissions)
    ) {
      setPermissions(loginData.userData.permissions);
    } else {
      setPermissions([]);
    }
  }, []);

  const getRequesList = async () => {
    try {
      const result = await action(API.DASHBOARD_EMPLOYEE_REQUEST, {
        superiorEmployeeId: employeeId,
        companyId: companyId,
      });
      const processedRequests =
        result?.result?.map((each) => ({
          employeeId: each.employeeId,
          specialRequestId: each.specialRequestId || null,
          name:
            each.employeeName?.charAt(0).toUpperCase() +
            each.employeeName?.slice(1),
          img: each.profilePicture,
          designation:
            each.designation?.charAt(0).toUpperCase() +
            each.designation?.slice(1),
          Type: each.type?.charAt(0).toUpperCase() + each.type?.slice(1),
          Action: each.typeSuffix,
          Date1: each.details,
          // Date2: each.toDate ? each.toDate : null,
          Status: each.status === "1" ? "Approved" : "Pending",
        })) || [];
      setRequests(processedRequests);
      filterRequests(processedRequests, selectedSegment);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const filterRequests = (requests, type) => {
    const filtered = requests.filter((request) => request.Type === type);
    setFilteredRequests(filtered);
  };

  const handleSegmentChange = (value) => {
    // console.log(value,"request")
    setSelectedSegment(value);
    filterRequests(requests, value);
  };

  useEffect(() => {
    getRequesList();
  }, []);

  useEffect(() => {
    filterRequests(requests, selectedSegment);
  }, [requests, selectedSegment]);

  const hasPermission = (permissionId) => permissions.includes(permissionId);

  const hasAnySegmentPermission = () =>
    SEGMENTS.some((segment) => hasPermission(segment.permissionId));

  const filteredSegmentOptions = SEGMENTS.filter((segment) =>
    hasPermission(segment.permissionId)
  ).map((segment) => ({
    label: segment.label,
    count: requests.filter((req) => req.Type === segment.type).length,
  }));

  if (!hasAnySegmentPermission()) {
    return null;
  }
  const handleRowClick = (data) => {
    // console.log(data,"data")
    if (data.Type === "Leave Request") {
      navigate("/employeeleave", { state: { data } });
    } else {
      navigate("/employeeRequest", { state: { data } });
    }
  };
  const handleActionClick = (action, data) => {
    // Implement action handling here
    // console.log(`Action ${action} clicked for data:`, data);
  };

  return (
    <DragCard
      imageIcon={ReqImg}
      header={t("Requests")}
      segment
      segmentSelected={selectedSegment}
      segmentOptions={filteredSegmentOptions}
      className="h-full p-2.5"
      segmentOnchange={handleSegmentChange}
    >
      <div className="overflow-y-auto h-[11rem] responsiveTable  pr-2.5">
        {filteredRequests.length > 0 ? (
          <table className="flex flex-row flex-no-wrap w-full">
            <thead className="text-gray-500">
              <tr className="flex flex-col mb-2 text-xs xl:text-[9px] 2xl:text-xs uppercase rounded-l-lg flex-no wrap sm:table-row sm:rounded-none sm:mb-0 bg-primaryalpha/10 dark:bg-white/20 sm:bg-transparent dark:sm:bg-transparent sm:sticky sm:top-0 sm:bg-white sm:dark:bg-slate-800">
                <th className="py-1 px-3 font-normal text-left">EMPLOYEE</th>
                <th className="py-1 px-3 font-normal text-left">TYPE</th>
                <th className="py-1 px-3 font-normal text-left">DETAILS</th>
                <th className="py-1 px-3 font-normal text-left">STATUS</th>
                <th className="py-1 px-3 font-normal text-left"></th>
              </tr>
            </thead>
            <tbody className="flex-1 sm:flex-none">
              {filteredRequests.map((data, index) => (
                <tr
                  key={index}
                  className="flex flex-col text-xs xl:text-[9px] 2xl:text-sm dark:text-white mb-2 flex-no-wrap sm:table-row sm:mb-0 hover:bg-slate-600/5 sm:border-t border-black/10 dark:border-white/20 cursor-pointer"
                  onClick={() => handleRowClick(data)}
                >
                  <td className="py-1.5 px-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        image={data?.img}
                        name={data?.name}
                        className="border-2 border-white shadow-md"
                      />
                      <div className="flex flex-col">
                        <p className="para !text-black dark:!text-white whitespace-nowrap">
                          {data.name}
                        </p>
                        <p className="para 2xl:!text-xs !text-[8px] sm:flex gap-2 whitespace-nowrap hidden ">
                          {data.designation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-1.5 px-3 truncate">
                    <div className="flex items-center gap-1.5 flex-nowrap ">
                      <p className="!font-medium para whitespace-nowrap">
                        {data.Type}
                      </p>
                      <span
                        className={`text-[9px] 2xl:text-[12px] px-2 py-0.5 rounded-full ${
                          data.Action === "Action"
                            ? "bg-indigo-50 text-indigo-700 dark:bg-[#171C28]"
                            : "bg-[#FDF2FA] text-[#C11574] dark:bg-[#171C28]"
                        }`}
                      >
                        {data.Action}
                      </span>
                    </div>
                  </td>
                  <td className="py-1.5 px-3 truncate">
                    <p className="flex !font-medium para">
                      <span>{data.Date1}</span>
                    </p>
                  </td>
                  <td className="px-3 py-2 truncate">
                    <div className="text-[9px] 2xl:text-[12px] px-2 py-0.5 rounded-full bg-redlight text-orange-500 w-fit dark:bg-[#171C28]">
                      {data.Status}
                    </div>
                  </td>
                  <td className="px-3 py-2 truncate">
                    {data.Type === "Leave Request" && (
                      <div className="relative flex items-center justify-center group">
                        <Dropdown
                          placement="bottomRight"
                          trigger={["hover"]}
                          overlay={
                            <Menu>
                              {SEGMENTS.find(
                                (seg) => seg.type === data.Type
                              )?.options.map((option, idx) => (
                                <React.Fragment key={idx}>
                                  <Menu.Item
                                    key={idx}
                                    onClick={() =>
                                      handleActionClick(option, data)
                                    }
                                  >
                                    {option}
                                  </Menu.Item>
                                </React.Fragment>
                              ))}
                            </Menu>
                          }
                        >
                          <PiDotsThreeVerticalBold className="text-gray-500 cursor-pointer" />
                        </Dropdown>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData />
        )}
      </div>
    </DragCard>
  );
}

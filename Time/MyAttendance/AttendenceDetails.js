import React, { useEffect, useMemo, useState } from "react";
import ModalPop from "../../common/ModalPop";
import API, { action } from "../../Api";
import { Table } from "antd";
import NoImagePlaceholder from "../../../assets/images/noImg.webp";
import ModalAnt from "../../common/ModalAnt";
import { PiTreeView, PiTrendUp } from "react-icons/pi";

export default function AttendenceDetails({
  employeeId,
  attendenceId,
  open,
  close = () => {},
}) {
  const [attendenceDetails, setAttendenceDetails] = useState([]);
  const [openModal, setOpenModal] = useState(open);

  const getAttendenceDetails = async () => {
    const result = await action(
      API.GET_ATTENDANCE_LOG,
      {
        employeeDailyAttendanceId: attendenceId,
        // employeeDailyAttendanceId: 4752,
      }
      // "http://192.168.0.44/loyaltri-server/api/main"
    );
    console.log(result);
    setAttendenceDetails(result.result);
  };
  useEffect(() => {
    getAttendenceDetails();
  }, []);

  const columns = [
    {
      title: "Check In Time",
      dataIndex: "checkInTime",
      key: "1",
      render: (text) => <div>{text || "--"}</div>,
    },
    {
      title: "Check In Image",
      dataIndex: "punchInImage",
      key: "2",
      render: (image, details) => (
        <div
          onClick={() => {
            console.log(details);
          }}
        >
          <img
            src={image || NoImagePlaceholder}
            alt=""
            className="rounded-full size-10"
          />
        </div>
      ),
    },
    {
      title: "Check Out Time",
      dataIndex: "checkOutTime",
      key: "3",
      render: (text) => <div>{text || "--"}</div>,
    },
    {
      title: "Check Out Image",
      dataIndex: "punchOutImage",
      key: "4",
      render: (image, details) => (
        <div
          onClick={() => {
            console.log(details);
          }}
        >
          <div className="flex items-center justify-center size-10 font-semibold bg-primaryLight text-primary rounded-full">
            <img
              src={image || NoImagePlaceholder}
              alt=""
              className="rounded-full size-10"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "punchRemarks",
      key: "5",
      render: (text) => (
        <p
          className={`${
            text === "office"
              ? " bg-orange-100 text-orange-600"
              : " bg-lime-100 text-lime-500"
          } rounded-full px-2 py-0.5  w-fit `}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Punch Type",
      dataIndex: "punchType",
      key: "6",
      render: (text) => (
        <p
          className={`${
            text === "web"
              ? " bg-cyan-100 text-cyan-600"
              : " bg-green-100 text-green-500"
          } rounded-full px-2 py-0.5  w-fit `}
        >
          {text}
        </p>
      ),
    },
  ];
  useMemo(
    () =>
      setTimeout(() => {
        openModal === false && close();
      }, 100),
    [openModal]
  );

  return (
    <>
      {/* <ModalPop
        width={1000}
        open={open}
        title={<h1 className="test-xl font-semibold">Attendence</h1>}
        close={(e) => {
          close();
        }}
      >
        <Table dataSource={attendenceDetails} columns={columns} />
      </ModalPop> */}
      <ModalAnt
        isVisible={openModal}
        onClose={() => {
          // close();
          setOpenModal(false);
        }}
        width="857px"
        showOkButton={false}
        showCancelButton={false}
        showTitle={false}
        // centered={true}
        padding="8px"
      >
        <div className="flex flex-col gap-2.5 p-2">
          <div className="flex flex-col gap-2.5 items-center m-auto">
            <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/10 text-primary">
              <PiTreeView size={20} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold text-text-lg 2xl:text-xl">
                Attendance History
              </p>
              <p className="font-medium text-xs 2xl:text-sm text-gray-500">
                Daily Punch In and Punch Out Attendance history
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse table-fixed">
              <thead>
                <tr className="text-[10px] 2xl:text-xs text-gray-500 h-11 2xl:h-12">
                  <th className="px-4 text-left border-b font-normal">
                    Check In Time
                  </th>
                  <th className="px-4 text-left border-b font-normal">
                    Check In Image
                  </th>
                  <th className="px-4 text-left border-b font-normal">
                    Check Out Time
                  </th>
                  <th className="px-4 text-left border-b font-normal">
                    Check Out Image
                  </th>
                  <th className="px-4 text-left border-b font-normal">
                    Remarks
                  </th>
                  <th className="px-4 text-left border-b font-normal">
                    Punch Type
                  </th>
                  <th className="px-4 text-left border-b font-normal">Punch</th>
                </tr>
              </thead>
              <tbody>
                {attendenceDetails?.map((item, index) => (
                  <tr
                    key={index}
                    className="text-[10px] 2xl:text-xs h-11 2xl:h-12"
                  >
                    <td className="px-4 !font-semibold">{item?.time}</td>
                    <td className="px-4 !font-semibold">
                      <div className="flex items-center justify-center size-10 rounded-lg overflow-hidden">
                        <img
                          src={
                            item?.attendanceData?.checkInImage ||
                            NoImagePlaceholder
                          }
                          alt=""
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </td>
                    <td className="px-4 !font-semibold">
                      {item?.checkOutTime}
                    </td>
                    <td className="px-4 !font-semibold">
                      <div className="flex items-center justify-center size-10 rounded-lg overflow-hidden">
                        <img
                          src={item?.checkOutImage || NoImagePlaceholder}
                          alt=""
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </td>
                    <td className="px-4 !font-semibold">
                      {item?.punchRemarks}
                    </td>
                    <td className="px-4 !font-semibold">{item?.punchType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModalAnt>
    </>
  );
}

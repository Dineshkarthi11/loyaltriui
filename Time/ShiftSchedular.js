import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import FlexCol from "../common/FlexCol";
import RangeDatePicker from "../common/RangeDatePicker";
import Dropdown from "../common/Dropdown";
import API, { action } from "../Api";
import TableDynamic from "../common/TableDynamic";
import Heading from "../common/Heading";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default function ShiftSchedular() {
  const { t } = useTranslation();
  const [departmentList, setDepartmentList] = useState([]);
  const [shiftSchemeList, setShiftSchemeList] = useState([]);
  const [companyId, setCompanyId] = useState(localStorageData.companyId);

  const [dateRange, setDateRange] = useState([]);
  const [UseListData, setUseListData] = useState([]);
  const [shiftSchemeId, setShiftSchemeId] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [shift, setShift] = useState();

  const [shiftScheme, setShiftScheme] = useState([]);

  const newShift = [
    {
      shiftId: "0",
      shift: "Off Day",
      startTime: "00:00",
      endTime: "00:00",
    },
  ];

  const getDepartmentList = async () => {
    try {
      const result = await action(API.GET_DEPARTMENT, { companyId: companyId });
      setDepartmentList(
        result.result.map((each) => ({
          label: each.department,
          value: each.departmentId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const getShiftScheme = async () => {
    try {
      const result = await action(API.GET_SHIFT_SCHEDULAR_BY_FILTER, {
        companyId: companyId,
        shiftSchemeType: "roster",
      });

      const schemeList = result.result.map((each) => ({
        label: each.shiftScheme,
        value: each.shiftSchemeId,
      }));

      setShiftScheme(result.result);
      setShiftSchemeList(schemeList);
      if (schemeList.length > 0) {
        setShiftSchemeId(schemeList[0].value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getShiftSchedular = async (e) => {
    try {
      const result = await action(
        API.GET_SHIFT_SCHEDULAR,
        {
          shiftSchemeId: e || null,
          startDate: dateRange[0],
          departmentId: departmentId || null,
          endDate: dateRange[1],
        }
        // "http://192.168.0.34/loyaltri-server/api/main"
      );
      setUseListData(
        result.result?.map((each, i) => ({
          key: `${i}`,
          name: {
            employeeName: each.firstName + " " + each.lastName,
            employeeId: each.employeeId,
            employeeProfile: each.profilePicture,
            designation: each.code,
          },
          money: "￥1,256,000.00",
          address: ["General Break Shift", "9:00 AM to 6:00 PM"],

          data:
            each?.shiftSheduledData?.length > 0
              ? each.shiftSheduledData?.map((item) => ({
                  shiftId: item?.shiftId,
                  shift: item?.shift,
                  startTime: item?.startTime,
                  endTime: item?.endTime,
                  date: item?.date,
                }))
              : [
                  {
                    shift: "",
                    startTime: "",
                    endTime: "",
                    date: "",
                  },
                ],
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartmentList();
    getShiftScheme();
  }, []);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Create the YYYY-MM-DD format
    const formattedDate = `${year}-${month}-${day}`;

    // After 7th Day
    const givenDate = new Date();
    givenDate.setDate(givenDate.getDate() + 6);

    const after7year = givenDate.getFullYear();
    const after7month = String(givenDate.getMonth() + 1).padStart(2, "0");
    const after7day = String(givenDate.getDate()).padStart(2, "0");

    const after7thDate = `${after7year}-${after7month}-${after7day}`;

    if (dateRange.length === 0) {
      setDateRange([formattedDate, after7thDate]);
    }
  }, []);

  useMemo(() => {
    setShift([
      ...newShift,
      ...shiftScheme
        ?.flatMap(
          (each) => each.shiftSchemeId === shiftSchemeId && each.shiftData
        )
        .filter((each) => each !== false),
    ]);
  }, [shiftSchemeId]);

  useEffect(() => {
    if (dateRange[0]) getShiftSchedular(shiftSchemeId);
  }, [shiftSchemeId, departmentId]);

  return (
    <FlexCol>
      <Heading
        title={t("Shift Scheduler")}
        description={t(
          "Simplifies the management and assignment of complex shifts, making it easier for companies to coordinate employee schedules efficiently."
        )}
      />
      <FlexCol>
        <div className="grid md:grid-cols-6  grid-cols-2 gap-4 bg-secondaryWhite rounded-md dark:bg-secondary p-3">
          <div className=" col-span-2">
            <RangeDatePicker
              title="Date"
              className={"w-90 "}
              change={(e) => {
                setDateRange(e);
              }}
              value={dateRange}
              onlyViewsomeDays={true}
              dateFormat="YYYY/MM/DD"
            />
          </div>
          <Dropdown
            title="Shift Scheme"
            placeholder="Shift Scheme"
            value={shiftSchemeId}
            change={(e) => {
              setShiftSchemeId(e);
              console.log(e);
            }}
            options={shiftSchemeList}
          />

          <Dropdown
            title="Department"
            placeholder="Department"
            className="w-48"
            options={departmentList}
            change={(e) => {
              setDepartmentId(e);
            }}
            value={departmentId}
          />
        </div>
        <TableDynamic
          // columns={columns}
          data={UseListData}
          shiftSchemeId={shiftSchemeId}
          date={dateRange}
          change={(e, i, j) => {
            getShiftSchedular(shiftSchemeId);
            // saveShiftScheduler(e, i, j);
          }}
          shiftData={shift}
        />
      </FlexCol>
    </FlexCol>
  );
}

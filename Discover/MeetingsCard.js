import React, { useState, useMemo, useEffect } from "react";
import DashboardAccordian from "../common/DashboardAccordian";
import DragCard from "./DragCard";
import { useSelector } from "react-redux";
import API, { action } from "../Api";
import { NoData } from "../common/SVGFiles";
import { SiGooglemeet } from "react-icons/si";
let usedColors = [];

const getRandomColorWithOpacity = () => {
  const colorNames = [
    // "#0095FF",
    // "#4437CC",
    // "#FF8A00",
    "#733710",
    "#305FBB",
    "#271860",
    // "#00D3E0",
    // "#4BB79D",
    // "#DFA510",
    // "#E546D5",
    // "#00E096",
    // "#884DFF",
    // "#FF4DB8",
  ];

  // If all colors have been used, reset the usedColors array
  if (usedColors.length === colorNames.length) {
    usedColors = [];
  }

  let randomColor;
  do {
    // Get a random color from colorNames array
    randomColor = colorNames[Math.floor(Math.random() * colorNames.length)];
  } while (usedColors.includes(randomColor)); // Repeat until a non-used color is found

  // Add the used color to the usedColors array
  usedColors.push(randomColor);

  // Generate colorWithOpacity1 and colorWithOpacity2
  const colorWithOpacity1 = `${randomColor}54`;
  const colorWithOpacity2 = `${randomColor}05`;

  const linearGradient = `linear-gradient(180deg, ${colorWithOpacity1} 0%, ${colorWithOpacity2} 100%)`;

  return {
    linearGradient,
    randomColor,
  };
};

export default function MeetingsCard({ employeeId }) {
  const [selectedOption, setSelectedOption] = useState("");
  const themeMode = useSelector((state) => state.layout.mode);
  const [selectedData, setSelectedData] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [task, setTask] = useState([]);
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  const optionsWithCount = [
    { label: "Meetings", count: meetings?.length },
    // { label: "Work Entry", count: task?.length },
  ];

  const handleSegmentChange = (value) => {
    setSelectedOption(value);
    // console.log(value);
    if (value === "Meetings") {
      getMeetings();
    } else {
      // getTask();
    }
  };

  // Memoize the array of random colors to ensure they don't change on re-renders
  // const randomColors = useMemo(
  //   () => Array.from({ length: 5 }, getRandomColorWithOpacity),
  //   []
  // );
  const randomColors = "#667085";
  const getMeetings = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_MEETINGS, {
      id: employeeId,
      companyId: companyId,
    });
    // console.log(result);
    setMeetings(result.result);
    if (selectedOption === "Meetings")
      setSelectedData(
        result.result.map((each) => ({
          title:
            "Meeting with " +
            each.employeeName?.charAt(0).toUpperCase() +
            each.employeeName?.slice(1),
          date: each.date,
          time: each.startTime + "-" + each.endTime,
          meetingType: each.meetingType + " Meeting",
          assignees: [
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          ],
        }))
      );
  };
  const getTask = async () => {
    const result = await action(API.DASHBOARD_EMPLOYEE_TASK, {
      id: employeeId,
      companyId: companyId,
    });
    // console.log(result);
    setTask(result.result);
    if (selectedOption === "Work Entry")
      setSelectedData(
        result.result.map((each) => ({
          title:
            each.workName?.charAt(0).toUpperCase() + each.workName?.slice(1),
          date: each.date,
          time: each.modifiedOn,
          meetingType: each.description,
          // assignees: [
          //   "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          //   "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          // ],
        }))
      );
  };
  useEffect(() => {
    getMeetings();
    // getTask();
  }, []);

  // Create an array of DashboardAccordian components based on accordianData
  const accordians = selectedData?.map((data, index) => (
    <DashboardAccordian
      key={index}
      title={`${data.title}`}
      date={data.date}
      time={data.time}
      initialExpanded={index === 0}
      className={"rounded-xl"}
      color={
        themeMode === "dark" ? "#ffffff" : randomColors[index]?.randomColor
      }
      style={{
        background:
          themeMode === "dark"
            ? "linear-gradient(180deg, rgba(197, 216, 255, 0.20) 0%, rgba(214, 226, 255, 0.20) 100%)"
            : randomColors[index]?.linearGradient,
        border:
          themeMode === "dark"
            ? `1px solid #000000`
            : `1px solid ${randomColors[index]?.randomColor}60`,
      }}
    >
      <div className="flex items-center justify-between ">
        <div className="flex gap-2">
          <p
            className=" 2xl:text-xs text-[9px]"
            style={{
              color:
                themeMode === "dark"
                  ? "#ffffff"
                  : randomColors[index]?.randomColor,
            }}
          >
            {data.meetingType}
          </p>
        </div>

        <div className="bg-white rounded-full p-0.5">
          <div className="-space-x-1">
            {data?.assignees?.length > 0 &&
              data?.assignees?.map((el, index) => {
                return (
                  <img
                    key={index}
                    className="relative z-30 inline object-cover w-[24px] h-[24px] border-2 border-white rounded-full"
                    src={el}
                    alt="Profileimage"
                  />
                );
              })}
          </div>
        </div>
      </div>
    </DashboardAccordian>
  ));

  return (
    <DragCard
      count={selectedData.length}
      icon={<SiGooglemeet size={18} />}
      header={"Meetings"}
      // segment
      // segmentSelected={selectedOption}
      // segmentOptions={optionsWithCount}
      // segmentOnchange={handleSegmentChange}
    >
      <div className="flex flex-col gap-2 p-2 mt-2 overflow-auto 2xl:max-h-[368px] h-72">
        {selectedData.length > 0 ? accordians : <NoData />}
      </div>
    </DragCard>
  );
}

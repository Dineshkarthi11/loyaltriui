import React, { memo, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { PiClockBold, PiMoon, PiSignOut, PiSun } from "react-icons/pi";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import { Sun } from "./SVG";
import DragCard from "./DragCard";
import { Progress } from "antd";
import API, { action } from "../Api";
import ModalAnt from "../common/ModalAnt";

import CheckOutImg from "../../assets/images/checkout-illustration-red.svg";
import CheckInImg from "../../assets/images/check-out-illustration-green.svg";
import moment from "moment";
import config from "../../config";
import { useNotification } from "../../Context/Notifications/Notification";
import axios from "axios";
import localStorageData from "../common/Functions/localStorageKeyValues";

export default memo(function WorkScheduleCard({
  employeeDeatils,
  refereshFun = () => {},
}) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  const [isRunning, setIsRunning] = useState(false);
  const [checkInTime, setCheckInTime] = useState(
    localStorage.getItem("currentTime") || null
  );
  const [progreessTime, setProgreessTime] = useState(
    localStorage.getItem("currentTime") || null
  );
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const primaryColor = localStorageData.mainColor;

  const [currentDate, setCurrentDate] = useState("");
  const [date, setDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const [getPunchDataId, setGetPunchDataId] = useState(null);
  const [getPunchinData, setGetPunchinData] = useState(null);
  const [checkInPrecentage, setCheckInPrecentage] = useState(null);

  const [remarks, setRemarks] = useState("office");

  const [start, setStart] = useState("08:00:00");
  const [end, setEnd] = useState("17:00:00");
  const [status, setStatus] = useState(false);
  const [startBreakTime, setStartBreakTime] = useState([]);
  const [endBreakTime, setEndBreakTime] = useState([]);
  const [remarksData, setRemarksData] = useState([
    { label: "Office", value: "office" },
  ]);

  const handleClick = (type, title, description) => {
    showNotification({
      placement: "top",
      message: title,
      description: description,
      // style: { width: 400 },
      type: type,
    });
  };
  useEffect(() => {
    setCompanyId(localStorageData.companyId);

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    setDate(`${day}-${month}-${year}`);
  }, []);

  useEffect(() => {
    // Update the current date when the component mounts
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      setCurrentDate(formattedDate);
    };
    updateDate();
  }, [employeeDeatils]);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // Move to the next day
      0,
      0,
      0 // Set the time to midnight
    );
    const timeUntilMidnight = midnight - now;

    const clearLocalStorageAtMidnight = () => {
      localStorage.removeItem("currentTime");
    };

    const timeoutId = setTimeout(
      clearLocalStorageAtMidnight,
      timeUntilMidnight
    );

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let timer;
    console.log(isRunning, checkInTime, "checkInTimecheckInTime");

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newSeconds = prevTime.seconds + 1;

          if (newSeconds === 60) {
            const newMinutes = prevTime.minutes + 1;
            return { hours: prevTime.hours, minutes: newMinutes, seconds: 0 };
          }

          // if (newSeconds < 60) {
          //   return { ...tempTime, seconds: newSeconds };
          // }

          // const newMinutes = tempTime.minutes + Math.floor(newSeconds / 60);
          const remainingSeconds = newSeconds % 60;

          if (prevTime.minutes === 60) {
            const newMinutes = 0;
            const newHours =
              prevTime.hours === 0 ? 1 : (prevTime.hours + 1) % 24; // Ensure hours wrap within 24
            // const newHours = prevTime.hours + 1;
            return { hours: newHours, minutes: newMinutes, seconds: 0 };
            // return { hours: newHours, minutes: 0, seconds: remainingSeconds };
          }
          // setTimer = [prevTime.hours, newMinutes, remainingSeconds];
          return {
            hours: prevTime.hours,
            // hours: newHours,
            // minutes: newMinutes,
            minutes: prevTime.minutes,
            seconds: remainingSeconds,
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, checkInTime]); // Include checkInTime in the dependencies array

  const formatTimeSegment = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  const toggleTimer = async () => {
    const currentTime = new Date();
    // const currentTime = dayjs(currentTime).format("HH:mm:ss"); // 24-hour format
    // localStorage.setItem("currentTime", formatted24HourTime);
    setFormattedTime(dayjs(checkInTime).format("HH:mm:ss"));

    if (!isRunning) {
      // Check if there was a previous check-out on the same punch-in date
      // if (
      //   checkOutTime &&
      //   (checkInTime?.getDate() === currentTime?.getDate() ||
      //     localStorage.getItem("currentTime"))
      // ) {
      //   // Continue the timer without resetting

      //   setCheckInTime(checkInTime); // Keep the same check-in time
      //   setProgreessTime(checkInTime);
      // } else {
      //   setProgreessTime(checkInTime);
      //   // Reset the timer and progress bar
      //   // setCheckInTime(currentTime); // Set new check-in time
      //   setCheckInTime(dayjs(currentTime).format("HH:mm:ss"));

      //   setTime({ hours: 0, minutes: 0, seconds: 0 });
      // }
      // // localStorage.setItem(
      // //   "currentTime",
      // //   dayjs(currentTime).format("HH:mm:ss")
      // // );
      setGetPunchDataId(""); //important
      // if (formattedTime) {
      try {
        const result = await axios.post(`${config.punchUrl}/api`, {
          action: API.EMPLOYEE_PUNCH_IN,
          method: "POST",
          kwargs: {
            employeeId: employeeDeatils.employeeId,
            companyId: employeeDeatils.companyId,
            punchDate: date,
            punchTime: dayjs(currentTime).format("HH:mm:ss"),
            punchType: "web",
            punchRemarks: remarks,
          },
        });

        if (result.data.status === 200) {
          // Check if there was a previous check-out on the same punch-in date
          if (
            checkOutTime &&
            (checkInTime?.getDate() === currentTime?.getDate() ||
              localStorage.getItem("currentTime"))
          ) {
            // Continue the timer without resetting

            setCheckInTime(checkInTime); // Keep the same check-in time
            setProgreessTime(checkInTime);
          } else {
            setProgreessTime(checkInTime);
            // Reset the timer and progress bar
            // setCheckInTime(currentTime); // Set new check-in time
            setCheckInTime(dayjs(currentTime).format("HH:mm:ss"));

            setTime({ hours: 0, minutes: 0, seconds: 0 });
          }
          getpunchTime();
          setIsRunning((prevIsRunning) => !prevIsRunning);
        } else {
          handleClick("error", "Info", result.data.message);
        }
      } catch (error) {
        console.log(error);
      }
      // }
    } else {
      // Check-out action
      try {
        const result = await axios.post(`${config.punchUrl}/api`, {
          action: API.EMPLOYEE_PUNCH_IN,
          method: "POST",
          kwargs: {
            employeeId: employeeDeatils.employeeId,
            companyId: employeeDeatils.companyId,
            punchDate: date,
            punchTime: dayjs(currentTime).format("HH:mm:ss"),
            punchType: "web",
            punchRemarks: remarks,
          },
        });
        if (result.data.status === 200) {
          setCheckOutTime(dayjs(checkInTime).format("HH:mm:ss")); // Set check-out time
          localStorage.setItem("currentTime", "");
          setTime({ hours: 0, minutes: 0, seconds: 0 });
          setCheckInTime(null);
          setProgreessTime(null);
          setIsRunning((prevIsRunning) => !prevIsRunning);
        } else {
          handleClick("error", "Info", result.data.message);
        }
        // resetTimer();
      } catch (error) {
        console.log(error);
      }
    }
  };

  function formatTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const currentDate = new Date();
    currentDate.setHours(hours, minutes, seconds);
    return currentDate.toString();
  }
  const format = "HH:mm";
  const startTime = moment(getPunchinData?.shiftDetails?.startTime, format);
  const endTime = moment(getPunchinData?.shiftDetails?.endTime, format);
  const twoColors = {
    // [`${startTime.diff(endTime, "minutes")}%`]: primaryColor,
    // [`${1}%`]: "#f55142",
    [`${1}%`]: primaryColor,
    // [`${2}%`]: primaryColor,
    // "100%": primaryColor,
    "100%": primaryColor,
  };
  const calculateProgress = () => {
    const [startHours, startMinutes, startSeconds] = start
      ?.split(":")
      .map(Number);
    const [endHours, endMinutes, endSeconds] = end?.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, startSeconds, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, endSeconds, 0);

    // calculateTimeDifference();

    if (checkInTime && isRunning) {
      const currentTime = new Date();
      // console.log(new Date(), "checkInTimecheckInTime");

      const [startHours, startMinutes, startSeconds] = start
        ?.split(":")
        .map(Number);
      const [endHours, endMinutes, endSeconds] = end?.split(":").map(Number);

      const [checkHours, checkMinutes, checkSeconds] = checkInTime
        ?.split(":")
        .map(Number);

      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, startSeconds, 0);

      const endDate = new Date();
      endDate.setHours(endHours, endMinutes, endSeconds, 0);

      const checkDate = new Date();
      checkDate.setHours(checkHours, checkMinutes, checkSeconds, 0);

      const elapsedMilliseconds =
        currentTime - checkDate || currentTime - progreessTime; //

      const now = new Date(); // checkIn time

      const totalDuration = endDate - startDate;
      const elapsedDuration = checkDate - startDate;

      const currentTimeDif = currentTime - startDate;
      const colorChange = currentTime - checkDate;

      const percentage = (currentTimeDif / totalDuration) * 100;

      const progress = (elapsedMilliseconds / totalDuration) * 100; //
      return Math.min(percentage, 100); // Ensure progress doesn't exceed 100%
    }
    return 0;
  };

  const calculatePercentage = () => {
    if (start && end) {
      const [startHours, startMinutes, startSeconds] = start
        ?.split(":")
        .map(Number);
      const [endHours, endMinutes, endSeconds] = end?.split(":").map(Number);

      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, startSeconds, 0);

      const endDate = new Date();
      endDate.setHours(endHours, endMinutes, endSeconds, 0);

      if (checkInTime) {
        const [checkHours, checkMinutes, checkSeconds] = checkInTime
          ?.split(":")
          .map(Number);

        const checkDate = new Date();
        checkDate.setHours(checkHours, checkMinutes, checkSeconds, 0);

        // const now = new Date(); // checkIn time

        const totalDuration = endDate - startDate;

        // presentage One
        const elapsedDuration = checkDate - startDate;

        const breakDuration = checkDate - startDate;

        const percentage = (elapsedDuration / totalDuration) * 100;

        setCheckInPrecentage(Math.round(percentage, 100));
      }
    }
  };
  useMemo(() => {
    calculatePercentage(
      getPunchinData?.shiftDetails?.startTime,
      getPunchinData?.shiftDetails?.endTime
    );
  }, [checkInTime]);

  useEffect(() => {
    if (!getPunchDataId) {
      // setFormattedTime();
      setFormattedTime(dayjs(checkInTime).format("HH:mm:ss"));
    } else {
      setFormattedTime(checkInTime);
    }
  }, [checkInTime]);

  useEffect(() => {}, [formattedTime]);

  const getTimeDifference = (time1, time2) => {
    // Adjusted regular expression pattern to match the time format correctly
    const [, hours1, minutes1, seconds1, period1] =
      /(\d{1,2}):(\d{2}):(\d{2})/.exec(time1);
    const [, hours2, minutes2, seconds2, period2] =
      /(\d{1,2}):(\d{2}):(\d{2})/.exec(time2);

    // Convert hours to 24-hour format if needed
    const parsedHours1 =
      period1 === "PM" ? parseInt(hours1, 10) + 12 : parseInt(hours1, 10);
    const parsedHours2 =
      period2 === "PM" ? parseInt(hours2, 10) + 12 : parseInt(hours2, 10);

    // Convert the times to milliseconds
    const time1Ms =
      (parsedHours1 * 60 * 60 +
        parseInt(minutes1, 10) * 60 +
        parseInt(seconds1, 10)) *
      1000;
    const time2Ms =
      (parsedHours2 * 60 * 60 +
        parseInt(minutes2, 10) * 60 +
        parseInt(seconds2, 10)) *
      1000;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(time1Ms - time2Ms);

    // Convert the difference back to hours, minutes, and seconds
    const hoursDiff = Math.floor(differenceMs / (1000 * 60 * 60));
    const minutesDiff = Math.floor(
      (differenceMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsDiff = Math.floor((differenceMs % (1000 * 60)) / 1000);

    setTime({ hours: hoursDiff, minutes: minutesDiff, seconds: secondsDiff });
    // setTime({ hours: hoursDiff, minutes: minutesDiff, seconds: secondsDiff });
    if (hoursDiff || minutesDiff || secondsDiff) {
      setIsRunning(true);
    }
    // }
  };
  useEffect(() => {
    getpunchTime();
    // if (checkInTime !== null) {
    // setFormattedTime(checkInTime);
    const time1 = checkInTime;
    const time2 = dayjs(new Date()).format("HH:mm:ss");
    if (time1 !== null && time2 !== null) {
      getTimeDifference(time1, time2);
    }

    // if (time) {
    //   setIsRunning(true);
    // }
    // }
  }, []);

  const getpunchTime = async () => {
    try {
      const result = await action(API.GEI_ID_PUNCHIN_DETAILS, {
        companyId: companyId,
        employeeId: employeeId,
        webRequest: 1,
      });
      if (result.status === 200) {
        setGetPunchinData(result.result);
        if (parseInt(result.result?.isWorkFromHome) === 1) {
          setRemarks("workFromHome");
          setRemarksData([{ label: "Work From Home", value: "workFromHome" }]);
        }

        if (
          result.result?.checkOutTime === null &&
          result.result?.status !== "checkOut"
        ) {
          // localStorage.setItem(
          //   "currentTime",
          //   dayjs(currentTime).format("HH:mm:ss")
          // );
          // localStorage.setItem("currentTime", result.result.firstCheckInTime + "AM");
          setGetPunchDataId(result.result);
          if (result.result.checkInTime) {
            refereshFun();
            // setIsRunning(true);
            setStatus(result.result.status === "startBreak" ? true : false); //false

            let checkInTime = result.result.checkInTime;

            if (checkInTime?.length === 5) {
              checkInTime += ":00"; // Convert "08:00" to "08:00:00"
            }

            console.log(checkInTime, "checkInTimecheckInTime");

            setCheckInTime(checkInTime);
            let start = result?.result?.shiftDetails?.startTime;
            let end = result?.result?.shiftDetails?.endTime;
            if (start?.length === 5) {
              start += ":00";
            }
            if (end?.length === 5) {
              end += ":00";
            }
            setStart(start);
            setEnd(end);
            setProgreessTime(new Date(formatTime(result.result.checkInTime)));
            // setProgreessTime(result.result?.checkInDateTime?.split(" ")[0]);
            setFormattedTime(result.result?.checkInTime);
          }
          // setFormattedTime(checkInTime);
          const time1 = result.result.checkInTime;
          const time2 = dayjs(new Date()).format("HH:mm:ss");
          if (time1 !== null && time2 !== null) {
            getTimeDifference(time1, time2);
          }
        } else if (result.result?.status === "checkOut") {
          setIsRunning(false);
        }
        // setCheckInTime(result.result.checkInTime + "AM");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const textItems = [
    "Your work today was truly outstanding. Thank you for giving it your all.",
    "We're really impressed with how you handled everything today. Thanks for your hard work.",
    "Your efforts today haven't gone unnoticed. Thank you for going above and beyond.",
    "Today wouldn't have been the same without your dedication. Thank you for being amazing.",
    "Your commitment today was remarkable. Thank you for all that you do.",
    "Your contributions today made a world of difference. Thank you for your excellence.",
    "We're grateful for your hard work and determination today. Thank you for shining so brightly.",
    "Your performance today was exceptional. Thank you for your outstanding efforts.",
    "Thank you for your tireless work today. We truly appreciate everything you do.",
    "Your work ethic today was truly impressive. Thank you for making a difference.",
    "Your contributions today were invaluable. Thank you for your dedication.",
    "Thanks for being such a reliable team player today. Your effort doesn't go unnoticed.",
    "We're thankful for your hard work and positive attitude today. You make a difference.",
    "Your commitment to excellence today was evident in everything you did. Thank you.",
    "Today, you really showed what it means to be a valuable asset to the team. Thank you.",
    "Your work ethic today was exemplary. Thank you for setting such a high standard.",
    "Thanks for giving your best today. Your efforts are appreciated more than you know.",
    "We're lucky to have someone as dedicated as you on our team. Thank you for your hard work.",
    "Thank you for your outstanding performance today. You truly exceeded expectations.",
    "Your work today made a significant impact. Thank you for your exceptional contributions.",
    "Your commitment to excellence today was truly inspiring. Thank you for your unwavering dedication.",
    "Thanks for your exceptional efforts today. Your hard work doesn't go unnoticed.",
    "Your professionalism and dedication today were remarkable. Thank you for your outstanding performance.",
    "We're grateful for your positive attitude and hard work today. Thank you for being such a valuable team member.",
    "Thank you for your relentless pursuit of excellence today. Your contributions make a real difference.",
    "Your hard work and determination today were exemplary. Thank you for going the extra mile.",
    "Your resilience and dedication today were a testament to your commitment. Thank you for your outstanding effort.",
    "Thanks for your tireless work ethic and dedication today. You truly make our team stronger.",
    "Your exceptional performance today didn't go unnoticed. Thank you for your dedication to excellence.",
    "We're appreciative of your efforts today. Thank you for consistently delivering your best work.",
  ];

  const startworkitems = [
    "Believe in yourself and your abilities. You have the power to achieve your dreams.",
    "Success is a journey, not a destination. Enjoy the process and celebrate your progress.",
    "Stay focused on your goals and keep moving forward. You're capable of great things.",
    "Every day is an opportunity to grow, learn, and become a better version of yourself.",
    "Challenges are just opportunities in disguise. Embrace them and watch yourself grow.",
    "Your potential is limitless. Don't let fear or doubt hold you back from pursuing your dreams.",
    "Hard work pays off. Keep pushing forward, and you'll reach your goals.",
    "Your attitude determines your altitude. Stay positive and keep reaching for the stars.",
    "Success is not about luck; it's about determination, perseverance, and hard work.",
    "You are stronger than you think. Trust yourself, and you'll overcome any obstacle.",
    "Make today count. Focus on what you can control and let go of what you can't.",
    "You have the power to create the life you desire. Believe in yourself and take action.",
    "The journey of a thousand miles begins with a single step. Take that step today.",
    "Don't be afraid to fail. It's all part of the process of becoming successful.",
    "Your dreams are within reach. Keep working hard, and they will become a reality.",
    "Success is not a destination; it's a state of mind. Believe in yourself, and you'll succeed.",
    "Be kind to yourself. Celebrate your accomplishments and learn from your mistakes.",
    "Every setback is a setup for a comeback. Keep moving forward, and you'll achieve greatness.",
    "Your potential is endless. Don't limit yourself with negative thoughts or beliefs.",
    "You have the power to change your life. Take control and make it happen.",
    "The only way to fail is to give up. Keep going, and you'll eventually reach your goals.",
    "Believe in the power of your dreams. With determination and perseverance, anything is possible.",
    "Stay focused, stay positive, and keep moving forward. Success is just around the corner.",
    "Don't let fear hold you back. Take risks, follow your passions, and chase your dreams.",
    "Your journey to success begins with a single step. Take that step today and watch yourself soar.",
    "Success is not about being the best; it's about doing your best and never giving up.",
    "You are capable of achieving amazing things. Believe in yourself and take action.",
    "Every day is a new opportunity to chase your dreams and make them a reality.",
    "Stay true to yourself and your dreams. With hard work and dedication, you'll achieve greatness.",
    "Don't wait for opportunities to come to you. Create your own opportunities and seize them.",
    "Success is not measured by how far you get but by how far you've come. Keep pushing forward.",
    "Believe in yourself, trust your instincts, and never give up on your dreams.",
    "Success is not about being perfect; it's about making progress and learning from your mistakes.",
    "Don't be afraid to take risks. The greatest achievements often come from the greatest risks.",
    "Your dreams are worth fighting for. Keep pushing forward, and you'll make them a reality.",
    "Stay focused on your goals, stay positive, and keep moving forward. You're capable of amazing things.",
    "Success is not about luck; it's about hard work, determination, and perseverance.",
    "Believe in yourself and your abilities. You have the power to achieve anything you set your mind to.",
    "The only way to fail is to give up. Keep pushing forward, and you'll eventually reach your goals.",
    "Success is not about being the best; it's about doing your best and never giving up.",
    "Stay true to yourself and your dreams. With hard work and dedication, you'll achieve greatness.",
    "Don't wait for opportunities to come to you. Create your own opportunities and seize them.",
    "Success is not measured by how far you get but by how far you've come. Keep pushing forward.",
    "Believe in yourself, trust your instincts, and never give up on your dreams.",
    "Success is not about being perfect; it's about making progress and learning from your mistakes.",
    "Don't be afraid to take risks. The greatest achievements often come from the greatest risks.",
    "Your dreams are worth fighting for. Keep pushing forward, and you'll make them a reality.",
    "Stay focused on your goals, stay positive, and keep moving forward. You're capable of amazing things.",
    "Success is not about luck; it's about hard work, determination, and perseverance.",
    "Believe in yourself and your abilities. You have the power to achieve anything you set your mind to.",
  ];

  const getRandomText = (items) => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  const [randomText, setRandomText] = useState("");
  const [randomText2, setRandomText2] = useState("");

  useEffect(() => {
    setRandomText(getRandomText(textItems));
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleChangeText = () => {
    isRunning
      ? setRandomText(getRandomText(textItems))
      : setRandomText2(getRandomText(startworkitems));
  };
  useEffect(() => {
    handleChangeText();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (target) => {
    handleChangeText();
    setIsModalOpen(target);
  };

  const startBreak = async (e) => {
    if (e === "startBreak") {
      setStartBreakTime([...startBreakTime, dayjs().format("HH:mm:ss")]);
    } else {
      setEndBreakTime([...endBreakTime, dayjs().format("HH:mm:ss")]);
    }
    try {
      const result = await axios.post(
        `${config.punchUrl}/api`,
        {
          action: API.APPLY_BREAK,
          method: "POST",
          kwargs: {
            employeeId: employeeId,
            type: e, // "startBreak", //endBreak
            punchDate: dayjs().format("YYYY-MM-DD"),
            time: dayjs().format("HH:mm:ss"),
          },
        }

        // "http://192.168.0.44/loyaltri-punch-server/api"
      );

      if (result.data.status === 200) {
        // openNotification("success", "Successful", result.message);
        // setStatus(e === "startBreak" ? true : false);
        getpunchTime();
        handleClick("success", "Successful", result?.data?.message);
      } else {
        // handleClick("error", "Info", result.message);
      }
    } catch (error) {
      // console.log(error);
      // handleClick("error", "Failed", error.code);
    }
  };

  return (
    <>
      <DragCard icon={<Sun />} header={t("Work Schedule")} className="h-full">
        {/* CONTENT  */}
        <div className="flex flex-col items-center justify-between h-full gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span
                  className="absolute inline-flex w-full h-full rounded-full opacity-75 "
                  style={{
                    backgroundColor: "#DC474C",
                    opacity: 0.7,
                  }}
                ></span>
                <span
                  className="relative inline-flex rounded-full size-2.5"
                  style={{
                    backgroundColor: "#DC474C",
                  }}
                ></span>
              </span>
              <p className="font-medium text-grey/80 text-md dark:text-white dark:opacity-85">
                {getPunchinData?.shiftDetails?.shift}
              </p>
            </div>
            <p className="para !font-medium !text-grey dark:!text-darkText">
              {currentDate}
            </p>
            <div className="flex items-center justify-center gap-2 dark:text-white">
              <div className="p-2 rounded-lg bg-primaryalpha/5 dark:bg-dark size-11  2xl:text-xl 4xl:size-[50px] 4xl:text-2xl text-xl vhcenter">
                <p className="font-bold ">{formatTimeSegment(time.hours)}</p>
                {/* <p className="font-bold ">{time.hours}</p> */}
                {/* <div className="text-sm">Hours</div> */}
              </div>
              <p className="text-2xl text-grey/50 dark:text-white/70">:</p>
              <div className="p-2 rounded-lg bg-primaryalpha/5 dark:bg-dark size-11  2xl:text-xl 4xl:size-[50px] 4xl:text-2xl text-xl vhcenter ">
                <p className="font-bold ">
                  {formatTimeSegment(time.minutes === 60 ? 0 : time.minutes)}
                </p>
                {/* <div className="text-sm">Minutes</div> */}
              </div>
              <p className="text-2xl text-grey/50 dark:text-white/70">:</p>
              <div className="p-2 rounded-lg bg-primaryalpha/5 dark:bg-dark size-11  2xl:text-xl 4xl:size-[50px] 4xl:text-2xl text-xl vhcenter">
                <p className="font-bold ">{formatTimeSegment(time.seconds)}</p>
                {/* <div className="text-sm">Seconds</div> */}
              </div>
              <p className="text-xl font-medium 2xl:text-xl 4xl:text-2xl text-grey/50 dark:text-white dark:text-opacity-70">
                Hrs
              </p>
            </div>
            {isRunning === true ? (
              <p className="text-[#027A48]/80 font-medium text-xs 2xl:text-sm">
                Check in Time:{" "}
                {dayjs(checkInTime, "HH:mm:ss").format("h:mm:ss A")}
              </p>
            ) : (
              ""
              // <p className="text-[#d63a3a] text-xs 2xl:text-sm">
              //   Check out Time: {checkOutTime}
              // </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full gap-2">
              <PiSun
                size={16}
                className="text-black text-opacity-50 dark:text-white shrink-0"
              />

              <Progress
                strokeColor={twoColors}
                percent={calculateProgress()}
                // strokeColor={primaryColor}
                strokeWidth={4}
                showInfo={false}
              />
              <PiMoon
                size={16}
                className="text-black text-opacity-50 dark:text-white shrink-0"
              />
            </div>
            <div className="flex items-center justify-between w-full text-black text-opacity-50 dark:text-white">
              <p className="text-xs font-medium text-nowrap leading-[18px]">
                {getPunchinData?.shiftDetails?.startTime}
                {/* {formattedTime === "Invalid Date" ? "9:00 AM" : formattedTime} */}
              </p>
              <p className="text-xs font-medium text-nowrap leading-[18px]">
                {getPunchinData?.shiftDetails?.endTime}
              </p>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 ">
            <div className="w-full" title="Choose Location">
              <Dropdown
                className="w-full"
                options={remarksData}
                change={(e) => {
                  setRemarks(e);
                }}
                value={remarks}
              />
            </div>

            {!isRunning ? (
              <div className="" title="Check In">
                <Button
                  danger={isRunning ? true : false}
                  BtnType="primary"
                  icon={<PiClockBold className="text-lg  2xl:text-xl" />}
                  buttonName={"Check In"}
                  className="w-full "
                  // handleSubmit={toggleTimer}
                  handleSubmit={() => {
                    // setOpen(true);
                    toggleModal(true);
                  }}
                  disabled={
                    (getPunchinData?.isWebPunch === 0 ||
                      getPunchinData === null) &&
                    true
                  }
                />
              </div>
            ) : (
              <>
                {!status ? (
                  <div className="flex items-center justify-end w-full gap-2">
                    <div className="" title="Start Break">
                      <Button
                        // danger={isRunning ? true : false}
                        // BtnType="primary"
                        icon={<PiClockBold />}
                        buttonName={"Start Break"}
                        className="text-primary"
                        // handleSubmit={toggleTimer}
                        handleSubmit={() => {
                          startBreak("startBreak");
                          // setOpen(true);
                          // toggleModal(true);
                        }}
                        disabled={
                          parseInt(
                            getPunchinData?.shiftDetails?.allowBreaks
                          ) === 1
                            ? false
                            : true
                        }
                      />
                    </div>
                    <div className="" title="Check Out">
                      <Button
                        danger={isRunning ? true : false}
                        BtnType="primary"
                        buttonName={<PiSignOut size={20} />}
                        className={"px-2"}
                        // handleSubmit={toggleTimer}
                        handleSubmit={() => {
                          // setOpen(true);
                          toggleModal(true);
                        }}
                        disabled={
                          (getPunchinData?.isWebPunch === 0 ||
                            getPunchinData === null) &&
                          true
                        }
                      />
                    </div>
                  </div>
                ) : (
                  parseInt(getPunchinData?.shiftDetails?.allowBreaks) === 1 && (
                    <div className="" title="End Break">
                      <Button
                        danger
                        // BtnType="primary"

                        icon={<PiClockBold />}
                        buttonName={"End Break"}
                        className="!text-[#C82920]"
                        // handleSubmit={toggleTimer}
                        handleSubmit={() => {
                          startBreak("endBreak");
                          // setOpen(true);
                          // toggleModal(true);
                        }}
                        disabled={
                          parseInt(
                            getPunchinData?.shiftDetails?.allowBreaks
                          ) === 1
                            ? false
                            : true
                        }
                      />
                    </div>
                  )
                )}
              </>
            )}
            {/* )} */}
          </div>
        </div>
        {/* <Modal
        open={open}
        // close={() => {
        //   setOpen(false);
        // }}
        title={isRunning ? "Check Out" : "Check In"}
        onOk={toggleTimer}
        onCancel={() => setOpen(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        // footer={(_, { OkBtn, CancelBtn }) => (
        //   <div className="flex items-start justify-end gap-2 ">
        //      <CancelBtn /> 
        //     <ButtonClick
        //       className={"bg-primary text-white font-semibold"}
        //       buttonName={
        //         isRunning
        //           ? `I'm signing off for now.`
        //           : "Sure, let's get started"
        //       }
        //     />
        //   </div>
        // )}
      >
        <p>
          {isRunning ? `${randomText}` : "Are you sure you want to  Check In"}?
        </p>
      </Modal> */}
        <ModalAnt
          isVisible={isModalOpen}
          onClose={() => toggleModal(false)}
          title="Basic Modal"
          okText={isRunning ? "Check Out" : "Check In"}
          cancelText="Not Now"
          width="435px"
          showOkButton={true}
          showCancelButton={true}
          showTitle={false}
          centered={true}
          showCloseButton={false}
          okButtonClass="w-full bg-error-600"
          cancelButtonClass="w-full"
          onOk={toggleTimer}
          okButtonDanger={isRunning ? true : false}
        >
          <div className="flex flex-col items-center justify-center gap-3 text-center px-11 py-7">
            <div>
              <img
                src={isRunning ? CheckOutImg : CheckInImg}
                alt="CheckImage"
              />
            </div>
            <p className="text-grey text-xs lg:text-[10px] 2xl:text-xs italic">
              {isRunning ? `"${randomText}"` : `"${randomText2}"`}
            </p>
            <h4 className="text-lg font-semibold lg:text-base 2xl:text-lg">
              {isRunning
                ? "Are you sure want to check out?"
                : "Are you sure want to check in?"}
            </h4>
          </div>
        </ModalAnt>
      </DragCard>
    </>
  );
});

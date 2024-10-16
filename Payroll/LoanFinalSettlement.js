import React, { useEffect, useState } from "react";
import { PiArrowSquareOutLight, PiStack, PiThumbsUp } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import Heading from "../common/Heading";
import TableAnt from "../common/TableAnt";
import ButtonClick from "../common/Button";
import StartFinalSettlement from "./StartFinalSettlement";
import API, { action } from "../Api";

export default function LoanFinalSettlement() {
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });

  const [show, setShow] = useState(false);
  const companyId = localStorage.getItem("companyId");
  const [employeelist, setEmployeeList] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [offBoardingId, setOffboardingId] = useState("");
  const [offBoardingStatusId, setOffboardingStatusId] = useState("");
  const [bordingcounts, setBordingcounts] = useState([]);
  const [cardData, setCardData] = useState([
    {
      icon: <PiStack className="text-[#EB7100]" />,
      bgcolor: "bg-[#ffe5cc]",
      title: "Pending",
      value: 0,
      text: "Employees",
    },
    {
      icon: <PiArrowSquareOutLight className="text-primary" />,
      bgcolor: "bg-primaryalpha/5",
      title: "Initiated",
      value: 0,
      text: "Employees",
    },
    {
      icon: <PiThumbsUp className="text-[#027A48]" />,
      bgcolor: "bg-[#E5FCEE]",
      title: "Completed",
      value: 0,
      text: "Employees",
    },
  ]);

  const header = [
    {
      Employee_Lists: [
        {
          id: 1,
          title: t("Name"),
          value: ["firstName", "employeeId"],
          flexColumn: true,
          logo: true,
          bold: true,
        },
        {
          id: 2,
          title: t("Designation"),
          value: "designation",
        },
        {
          id: 3,
          title: "Offboarding Status",
          value: "offBoardingStatus",
          status: true,
          colour: "colour",
        },

        {
          id: 4,
          title: t("Seperation"),
          value: "seperationMode",
        },
        // {
        //     id: 5,
        //     title: t("Action"),
        //     value: "action",
        //     dotsVertical: true,
        //     dotsVerticalContent: [
        //         {
        //             title: "Update",
        //             value: "update",
        //         },
        //         {
        //             title: "Delete",
        //             value: "delete",
        //             confirm: true,
        //         },
        //     ],
        // },
        {
          id: 5,
          title: "",
          value: 1,
          buttonName: "Start Final Settlement",
          Regularize: true,
        },
      ],
    },
  ];

  const getEmployeeBoradinglist = async () => {
    try {
      const result = await action(
        API.GET_OFFBOARDING_getEmployeeOffBoardingList,
        {
          companyId: companyId,
          offBoardingStatusId: 3,
          assetrecovery: 1,
        }
      );
      setEmployeeList(result.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmployeeBoradinglist();
  }, []);
  const getemployeeOffBoardingCounts = async () => {
    try {
      const result = await action(
        API.GET_OFFBOARDING_employeeOffBoardingCounts,
        {
          companyId: companyId,
        }
      );
      setBordingcounts(result.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getemployeeOffBoardingCounts();
  }, []);
  useEffect(() => {
    if (bordingcounts) {
      setCardData(
        cardData.map((card, index) => {
          const responseKeys = ["onHold", "initiated", "relieved"];
          return {
            ...card,
            value: bordingcounts[responseKeys[index]],
          };
        })
      );
    }
  }, [bordingcounts]);

  return (
    <div className={`  w-full flex flex-col gap-6 `}>
      <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
        <Heading
          title="Final Settlement"
          description="Efficiently manage the offboarding process, ensuring smooth transitions for departing employees and compliance with company policies."
        />

        {/* <ButtonClick
          BtnType="add"
          handleSubmit={() => {
            setShow(true);
            setUpdateId(133);
          }}
          buttonName="Start final settlement"
        ></ButtonClick> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cardData.map((item, index) => (
          <div
            key={index}
            className="borderb rounded-lg p-4 h-[119px] dark:text-white dark:bg-dark"
          >
            <div className="flex flex-col gap-2">
              <div
                className={`vhcenter size-[30px] rounded-full shrink-0 dark:bg-[#07A86D]/20 ${item.bgcolor}`}
              >
                {item.icon}
              </div>
              <div className="font-semibold text-[10px] 2xl:text-xs">
                {item.title}
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold  text-2xl 2xl:text-3xl">
                  {item.value}
                </div>
                <div className="text-primary text-xs 2xl:text-[14px]">
                  {item.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TableAnt
        header={header}
        data={employeelist}
        path="Employee_Lists"
        actionID="employeeId"
        clickDrawer={(e, actionId, text) => {
          setShow(e);
          setUpdateId(actionId);
          setOffboardingId(text.offboardingId);
          setOffboardingStatusId(text.offBoardingStatusId);
        }}
      />

      {show && (
        <StartFinalSettlement
          open={show}
          close={(e) => {
            setShow(e);
          }}
          updateId={updateId}
          offBoardingId={offBoardingId}
          offBoardingStatusId={offBoardingStatusId}
          refresh={() => {
            getEmployeeBoradinglist();
          }}
        />
      )}
    </div>
  );
}

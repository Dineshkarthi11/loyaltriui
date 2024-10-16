import React, { useState } from "react";
import ToggleBtn from "../common/ToggleBtn";
import { FaRegCircle } from "react-icons/fa";
import Accordion from "../common/Accordion";
import CheckBoxInput from "../common/CheckBoxInput";
import TimeSelect from "../common/TimeSelect";
import Dropdown from "../common/Dropdown";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import lineImage from "../../assets/images/Group 2516.png";
import cash from "../../assets/images/Cash.png";
import cashGray from "../../assets/images/CashGray.png";
import Wizard from "../common/Wizard";

export default function OvertimeRules() {
  const [activeBtn, setActiveBtn] = useState(1);
  const [customRate, setCustomRate] = useState(1);

  const regularOvertime = [
    {
      id: 1,
      title: "Fixed Rate",
      description:
        "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
      image: cash,
    },
    {
      id: 2,
      title: "Custom Rate",
      description:
        "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
      image: cash,
    },
    {
      id: 3,
      title: "Complimentary Off",
      description:
        "Fixed rate for all types (weekdays, weekends, public holidays and day offs) for extra hours",
      image: cash,
    },
  ];


  const breadcrumbItems = [
    { label: "Policies", url: "" },
    { label: "Add Policies" },
  ];

  const allowanceType = [
    { value: "fixedAmount", label: "Fixed Amount" },
    { value: "multiplier", label: "Multiplier" },
  ];
  const MultiplyBy = [
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
  ];

  return (
    <Wizard
      buttonClick={(e) => {
        setActiveBtn(1 + activeBtn);
        console.log(1 + activeBtn);
      }}
      buttonClickCancel={(e) => {
        setActiveBtn(activeBtn - 1);
        console.log(activeBtn - 1);
      }}
      items={breadcrumbItems}
    >
      {activeBtn === 1 ? (
        <div className=" flex flex-col gap-8">
          <div className="">
            <h1 className=" text-xl font-semibold pb-2.5">
              2. Create Value for Work Policy
            </h1>
            <p className=" text-sm font-normal opacity-70">
              Set rules for Late Entry, Early Exit, Breaks on punch-in and
              punch-out time.
            </p>
          </div>
          <div className="">
            <TimeSelect
              title="Overtime Policy Name *"
              placeholder="Enter Policy Name"
              value=""
              change={(e) => { }}
              className="lg:w-[50%] "
            />
            {/* <p className=" pb-3 text-base font-medium">Work Policy Name</p>
              <div className="border rounded-xl p-4">
                <p className=" text-base font-normal">Enter Policy Name</p>
              </div> */}
          </div>
          <div className="flex flex-col gap-10">
            <div className="md:grid grid-cols-4 flex flex-col md:items-center md:gap-[80px] gap-6">
              <div className="col-span-2 flex gap-3 items-center">
                <ToggleBtn className={""} />
                <p className="text-4 font-medium">
                  Allow your employees to track over time hours
                </p>
              </div>
              <div className="col-span-2 flex gap-3 tems-center">
                <ToggleBtn className={""} />
                <p className="text-4 font-medium">Allow to request over time</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className=" text-base font-semibold">
                Create hourly rate calculation for regular over time
              </h1>
              <div className="md:grid grid-cols-12 flex flex-col gap-6">
                {regularOvertime?.map((each, i) => (
                  <div
                    key={i}
                    className={`col-span-4 p-5 border rounded-2xl cursor-pointer showDelay  ${customRate === each.id && "border-primary "
                      } `}
                    onClick={() => {
                      setCustomRate(each.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className=" flex flex-col gap-2">
                        {/* <GiReceiveMoney
                          className={`${
                            customRate === each.id && "text-primary"
                          } `}
                        /> */}
                        <img
                          src={customRate === each.id ? cash : cashGray}
                          alt=""
                          className=" w-6 h-6"
                        />
                        <h3 className=" text-sm font-semibold">{each.title}</h3>
                        <p className=" text-xs font-semibold opacity-50">
                          {each.description}
                        </p>
                      </div>
                      <FaRegCircle
                        className={`font-semibold text-base ${customRate === each.id &&
                          "border-primary text-primary"
                          } `}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {customRate === 1 ? (
              <div data-aos="zoom-in" className={`flex flex-col gap-10  `}>
                <Accordion
                  title={"Create Early Exit Rule"}
                  description={
                    "Automate late fine for employees who are coming late to work"
                  }
                  padding={false}
                  toggleBtn={true}
                >
                  <div className="relative md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6   ">
                    <div className="flex items-center gap-2 ">
                      <CheckBoxInput />
                      <p>Late fine starts from the starting of the shift</p>
                    </div>

                    <div className="md:grid grid-cols-12 flex flex-col  gap-6">
                      <div className="col-span-3 ">
                        {/* <div className="w-[70%]"> */}
                        <TimeSelect
                          title="If Employee Late"
                          description={" Fine after 5 mins"}
                        />
                        {/* </div> */}
                      </div>
                      <div className=" hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        {/* <div className="w-[70%]"> */}
                        <TimeSelect
                          title="Deduction Type"
                          description={"No late fine for 30 mins"}
                        />
                        {/* </div> */}
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3">
                        {/* <div className="w-[70%]"> */}
                        <Dropdown
                          title={
                            <div className="flex items-center gap-2">
                              <CheckBoxInput />
                              <p className=" text-sm font-normal opacity-40 ">
                                Set Occurrence
                              </p>
                            </div>
                          }
                          description={
                            <p className="flex gap-2">
                              Effect after
                              <span className="text-14px font-bold">
                                2 Occurence
                              </span>
                            </p>
                          }
                        />
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="md:grid grid-cols-12  flex flex-col gap-6">
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="If Employee v"
                          description={" No late fine for 30 mins"}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="Deduction Type"
                          description={"No late fine for 30 mins"}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3">
                        <Dropdown
                          title={
                            <p className="flex items-center gap-2">
                              <CheckBoxInput />
                              <span className=" text-sm font-normal opacity-40">
                                Set Occurrence
                              </span>
                            </p>
                          }
                          description={
                            <p className="flex gap-2">
                              Effect after
                              <span className="text-14px font-bold">
                                2 Occurence
                              </span>
                            </p>
                          }
                        />
                      </div>
                    </div>
                    <div className="md:grid grid-cols-12  flex flex-col gap-6">
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="If Employee v"
                          description={" No late fine for 30 mins"}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="Deduction Type"
                          description={"No late fine for 30 mins"}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3">
                        <Dropdown
                          title={
                            <p className="flex items-center gap-2">
                              <CheckBoxInput />
                              <span className=" text-sm font-normal opacity-40">
                                Set Occurrence
                              </span>
                            </p>
                          }
                          description={
                            <p className="flex gap-2">
                              Effect after
                              <span className="text-14px font-bold">
                                2 Occurence
                              </span>
                            </p>
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative flex justify-between items-center border-t px-[25px] py-[15px]">
                    <div className="flex justify-start items-center gap-[9px]">
                      <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                      <p className="text-[17px] font-normal">Add Range</p>
                    </div>
                    <div className=" flex items-center gap-3">
                      <MdOutlineDelete className=" text-rose-600 p-[9px] text-[40px] bg-[#F4F4F4] rounded-md" />
                      <button className=" px-6 py-2.5 bg-[#F4F4F4] rounded-md text-base font-normal">
                        Save
                      </button>
                    </div>
                  </div>
                </Accordion>
                <div className="relative  flex flex-col   border rounded-xl ">
                  <div className="flex items-center gap-2  border-b py-[15px] px-[25px]">
                    <CheckBoxInput />
                    <p>Late fine starts from the starting of the shift</p>
                  </div>

                  <div className="md:grid grid-cols-12 flex flex-col md:p-6 p-3  md:items-center gap-6">
                    <div className="col-span-3 ">
                      <Dropdown
                        title="Set limit for"
                        description={"Automate late fine for employee"}
                      />
                    </div>
                    <div className="hidden col-span-1 md:flex justify-center items-center">
                      <img
                        src={lineImage}
                        alt=""
                        className="h-[69px] w-[1px]"
                      />
                    </div>
                    <div className="col-span-4">
                      <TimeSelect
                        title={"Maximum Overtime"}
                        description={
                          "overtime will not calculated after 30 mins "
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : customRate === 2 ? (
              <div className="flex flex-col gap-8">
                <div className="">
                  <h1 className=" text-xl font-semibold pb-2.5">
                    Custom Rate calculation settings
                  </h1>
                  <p className=" text-sm font-normal opacity-70">
                    Fixed rate for all types (weekdays, weekends, public
                    holidays and day offs) for extra hours
                  </p>
                </div>
                <Accordion
                  toggleBtn={true}
                  title="Extra hours on week days"
                  description="Automate late fine for employees who are coming late to work"
                  padding={false}
                >
                  <div className="relative md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6   ">
                    <div className="flex items-center gap-2 ">
                      <CheckBoxInput />
                      <p>Late fine starts from the starting of the shift</p>
                    </div>

                    <div className="md:grid grid-cols-12 flex flex-col  gap-6">
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="If Employee works more than"
                          description={"No late fine for 30 mins"}
                        />
                      </div>
                      <div className=" hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        <Dropdown
                          title="Allowance Type"
                          description={"Automate late fine for employee"}
                          options={allowanceType}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-4 flex justify-between items-center ">
                        <Dropdown
                          title="Multiply by"
                          description={"Automate"}
                          options={MultiplyBy}
                        />
                        <Dropdown
                          title={"Amount"}
                          description={"amount will be deducted"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex justify-between items-center border-t px-[25px] py-[15px]">
                    <div className="flex justify-start items-center gap-[9px]">
                      <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                      <p className="text-[17px] font-normal">Add Range</p>
                    </div>
                    <div className=" flex items-center gap-3">
                      <MdOutlineDelete className=" text-rose-600 p-[9px] text-[40px] bg-[#F4F4F4] rounded-md" />
                      <button className=" px-6 py-2.5 bg-[#F4F4F4] rounded-md text-base font-normal">
                        Save
                      </button>
                    </div>
                  </div>
                </Accordion>
                <Accordion
                  toggleBtn={true}
                  title="Extra hours on week ends"
                  description="Automate late fine for employees who are coming late to work"
                  padding={false}
                >
                  <div className="relative md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6   ">
                    <div className="flex items-center gap-2 ">
                      <CheckBoxInput />
                      <p>Late fine starts from the starting of the shift</p>
                    </div>

                    <div className="md:grid grid-cols-12 flex flex-col  gap-6">
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="If Employee works more than"
                          description={"No late fine for 30 mins"}
                        />
                      </div>
                      <div className=" hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        <Dropdown
                          title="Allowance Type"
                          description={"Automate late fine for employee"}
                          options={allowanceType}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3">
                        <Dropdown
                          title={"Amount"}
                          description={"amount will be deducted"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex justify-between items-center border-t px-[25px] py-[15px]">
                    <div className="flex justify-start items-center gap-[9px]">
                      <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                      <p className="text-[17px] font-normal">Add Range</p>
                    </div>
                    <div className=" flex items-center gap-3">
                      <MdOutlineDelete className=" text-rose-600 p-[9px] text-[40px] bg-[#F4F4F4] rounded-md" />
                      <button className=" px-6 py-2.5 bg-[#F4F4F4] rounded-md text-base font-normal">
                        Save
                      </button>
                    </div>
                  </div>
                </Accordion>
                <Accordion
                  toggleBtn={true}
                  title="Extra hours on public holidays"
                  description="Automate late fine for employees who are coming late to work"
                  padding={false}
                >
                  <div className="relative md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6   ">
                    <div className="flex items-center gap-2 ">
                      <CheckBoxInput />
                      <p>Late fine starts from the starting of the shift</p>
                    </div>

                    <div className="md:grid grid-cols-12 flex flex-col  gap-6">
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="If Employee works more than"
                          description={"No late fine for 30 mins"}
                        />
                      </div>
                      <div className=" hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        <Dropdown
                          title="Allowance Type"
                          description={"Automate late fine for employee"}
                          options={allowanceType}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3">
                        <Dropdown
                          title={"Amount"}
                          description={"amount will be deducted"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex justify-between items-center border-t px-[25px] py-[15px]">
                    <div className="flex justify-start items-center gap-[9px]">
                      <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                      <p className="text-[17px] font-normal">Add Range</p>
                    </div>
                    <div className=" flex items-center gap-3">
                      <MdOutlineDelete className=" text-rose-600 p-[9px] text-[40px] bg-[#F4F4F4] rounded-md" />
                      <button className=" px-6 py-2.5 bg-[#F4F4F4] rounded-md text-base font-normal">
                        Save
                      </button>
                    </div>
                  </div>
                </Accordion>
                <Accordion
                  toggleBtn={true}
                  title="Extra hours on day off"
                  description="Automate late fine for employees who are coming late to work"
                  padding={false}
                >
                  <div className="relative md:px-[25px] px-2 md:py-5 py-2 flex flex-col gap-6   ">
                    <div className="flex items-center gap-2 ">
                      <CheckBoxInput />
                      <p>Late fine starts from the starting of the shift</p>
                    </div>

                    <div className="md:grid grid-cols-12 flex flex-col  gap-6">
                      <div className="col-span-3 ">
                        <TimeSelect
                          title="If Employee works more than"
                          description={"No late fine for 30 mins"}
                        />
                      </div>
                      <div className=" hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3 ">
                        <Dropdown
                          title="Allowance Type"
                          description={"Automate late fine for employee"}
                          options={allowanceType}
                        />
                      </div>
                      <div className="hidden col-span-1 md:flex justify-center items-center">
                        <img
                          src={lineImage}
                          alt=""
                          className="h-[69px] w-[1px]"
                        />
                      </div>
                      <div className="col-span-3">
                        <Dropdown
                          title={"Amount"}
                          description={"amount will be deducted"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex justify-between items-center border-t px-[25px] py-[15px]">
                    <div className="flex justify-start items-center gap-[9px]">
                      <IoMdAdd className=" bg-slate-300 rounded-full text-2xl p-1 opacity-50 font-medium" />

                      <p className="text-[17px] font-normal">Add Range</p>
                    </div>
                    <div className=" flex items-center gap-3">
                      <MdOutlineDelete className=" text-rose-600 p-[9px] text-[40px] bg-[#F4F4F4] rounded-md" />
                      <button className=" px-6 py-2.5 bg-[#F4F4F4] rounded-md text-base font-normal">
                        Save
                      </button>
                    </div>
                  </div>
                </Accordion>
                <div className="relative  flex flex-col   border rounded-xl ">
                  <div className="flex items-center gap-2  border-b py-[15px] px-[25px]">
                    <CheckBoxInput />
                    <p>Late fine starts from the starting of the shift</p>
                  </div>

                  <div className="md:grid grid-cols-12 flex flex-col md:p-6 p-3  md:items-center gap-6">
                    <div className="col-span-3 ">
                      <Dropdown
                        title="Set limit for"
                        description={"Automate late fine for employee"}
                      />
                    </div>
                    <div className="hidden col-span-1 md:flex justify-center items-center">
                      <img
                        src={lineImage}
                        alt=""
                        className="h-[69px] w-[1px]"
                      />
                    </div>
                    <div className="col-span-3">
                      <TimeSelect
                        title={"Maximum Overtime"}
                        description={
                          "overtime will not calculated after 30 mins "
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">process....</div>
            )}
          </div>
        </div>
      ) : (
        <div className=""></div>
      )}
    </Wizard>
  );
}

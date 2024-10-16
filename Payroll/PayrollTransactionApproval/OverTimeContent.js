import React from 'react'
import CheckBoxInput from '../../common/CheckBoxInput'
import Avatar from '../../common/Avatar'
import userimg from "../../../assets/images/user2.jpeg"
import usertwoImg from "../../../assets//images/user1.jpeg"
import userThreeImg from "../../../assets/images/Rectangle 328(1).png"

import employeeone from "../../../assets/images/user1.jpeg";
import employetwo from "../../../assets/images/user.png";
import employeethree from "../../../assets/images/user2.jpeg";
import employeefour from "../../../assets/images/Rectangle 328(1).png";
import employeefive from "../../../assets/images/Rectangle 328.png";
import { PiSignIn, PiSignOut } from "react-icons/pi";
import { RxDotFilled } from "react-icons/rx";

function OverTimeContent() {
    const employeeApprovalData = [
        {
            date: "2024-10-07", // current date
            records: [
                {
                    image: userimg,
                    name: "Cohen Goodwin",
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Over Time", time: "+45 mins", Deduction: "1X Salary", amount: "-AED 123", checkIn: "9:00 AM", checkOut: "4:00 PM" },
                    ]
                },
                {
                    image: usertwoImg,
                    name: "Floyd Miles",
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Over Time", time: "+45 mins", Deduction: "1X Salary", amount: "-AED 123", checkIn: "9:00 AM", checkOut: "4:00 PM" }
                    ]
                }
            ]
        },
        {
            date: "2024-10-06", // previous date
            records: [
                {
                    image: userThreeImg,
                    name: "Cameron Williamson",
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Over Time", time: "+45 mins", Deduction: "1X Salary", amount: "-AED 123", checkIn: "9:00 AM", checkOut: "4:00 PM" },
                    ]
                },
                {
                    image: userimg,
                    name: "Floyd Jhon",
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Over Time", time: "+45 mins", Deduction: "1X Salary", amount: "-AED 123", checkIn: "9:00 AM", checkOut: "4:00 PM" }
                    ]
                }
            ]
        }
    ];
    const modalEmployedata = [{
        name: "abhi",
        image: employeeone,
        regularise: "pending", //pending
        brdrcolor: "border-yellow-500"
    }, {
        name: "abhi",
        image: employetwo,
        regularise: "pending",
        brdrcolor: "border-yellow-500"
    }, {
        name: "abhi",
        image: employeethree,
        regularise: "pending",
        brdrcolor: "border-green-500"

    }, {
        name: "abhi",
        image: employeefour,
        regularise: "pending",
        brdrcolor: "border-green-500"
    }, {
        name: "abhi",
        image: employeefive,
        regularise: "pending"
    }
    ]
    const sortedData = employeeApprovalData.sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div>
          {sortedData?.map((items, index) => (
              <div className='flex flex-col gap-5' key={index}>
                  {index == 0 ? (
                      <div className='flex justify-between mt-0'>
                          <p className='text-sm 2xl:text-base font-semibold'>{new Date(items.date).toDateString()}</p>
                          <div className='flex gap-2 items-center'>
                              <p className='font-medium text-grey'><span className='font-semibold text-black dark:text-white text-xs 2xl:text-sm'>1</span> employee selected </p>
                              <CheckBoxInput
                                  titleRight='Select all Employees'
                                  titleClassName="text-primaryalpha font-semibold text-sm 2xl:text-base"
                              />
                          </div>
                      </div>
                  ) : (
                      <div className='mt-4'>
                          <p className='text-sm 2xl:text-base font-semibold'>{new Date(items.date).toDateString()}</p>

                      </div>
                  )}
                  {items?.records?.map((employee, j) => (
                      <div key={j} className='box-wrapper !bg-[#B9B8FF0F] flex flex-col gap-3'>
                          <div className='flex justify-between'>
                              <div className='flex gap-1 items-center'>
                                  <CheckBoxInput />
                                  <div className='flex gap-2 items-start'>
                                      <div className='flex gap-1.5'>
                                          <Avatar
                                              className='shrink-0'
                                              image={employee.image}
                                              size={40} />
                                          <div>
                                              <td className='font-semibold text-xs 2xl:text-sm '>{employee.name}</td>
                                              <p className='text-grey text-xs 2xl:text-sm'>{employee.EmpId}</p>
                                          </div>
                                      </div>
                                      <div className='bg-[#F2F4F7] text-gray-700 text-[10px] 2xl:text-xs rounded-full px-3 py-1 vhcenter items-start '>
                                          <RxDotFilled className='text-base 2xl:text-lg' />
                                          <p className='font-medium text-[8px] 2xl:text-[10px]'> {employee.shift}</p>
                                      </div>
                                  </div>
                              </div>
                              <div className='flex gap-3'>
                                  <div>
                                      <p className='text-xs 2xl:text-sm font-medium'>Approval  Status: </p>
                                      <p className='text-[10px] 2xl:text-xs font-medium text-primaryalpha underline'>View Details</p>
                                  </div>
                                  <div className="flex -space-x-3 rtl:space-x-reverse">
                                      {modalEmployedata?.slice(0, 4).map((data, index) => (
                                          <div key={index} className={`overflow-hidden bg-white border-2 rounded-full size-8 ${data.brdrcolor}`}>
                                              <img
                                                  className="object-cover object-center w-full h-full"
                                                  src={data.image}
                                                  alt=""
                                                  title={data.name}
                                              />
                                          </div>
                                      ))}

                                  </div>
                              </div>
                          </div>
                          {employee?.missPunch?.map((punch, k) => (
                              <div key={k} className='box-wrapper flex justify-between'>
                                  <div className="flex flex-wrap gap-5">

                                      <button
                                          className={`borderb h-8 2xl:h-10 transition-all duration-300 min-w-[160px] xl:w-auto p-[3px] text-[10px] 2xl:text-sm rounded-md text-start leading-6 flex items-center font-semibold  bg-white dark:bg-dark gap-3 text-green-600`}

                                      >
                                          <div
                                              className="rounded px-2 py-1  h-full vhcenter bg-[#ECFDF3]"

                                          >
                                              <p className={`text-sm lg:text-xs 2xl:text-sm`}>
                                                  {punch.Type}
                                              </p>
                                          </div>
                                          <p>{punch.time}</p>

                                      </button>
                                      <div className='flex flex-col gap-0.5'>
                                          <p className='font-medium text-xs 2xl:text-sm text-grey'>Amount:</p>
                                          <p className='font-medium text-xs 2xl:text-sm text-green-600'>+AED 123</p>
                                      </div>

                                  </div>

                                  <div className='flex gap-5'>
                                      <div className="flex items-center gap-1">
                                          <PiSignIn size={16} className="text-grey" />
                                          <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                                              Check In:
                                          </p>
                                          <p className="text-xs lg:text-[10px] 2xl:text-xs leading-[20px] text-green-600 font-semibold dark:text-white space-x-1 vhcenter gap-1">
                                              {punch.checkIn}
                                          </p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                          <PiSignOut size={16} className="text-grey" />
                                          <p className="text-[10px] leading-[18px] 2xl:text-xs font-medium text-grey">
                                              Check Out:
                                          </p>
                                          <p className="text-xs lg:text-[10px] 2xl:text-xs leading-[20px] font-semibold text-red-600 dark:text-white space-x-1 vhcenter gap-1">
                                              {punch.checkOut}
                                          </p>
                                      </div>
                                  </div>

                              </div>
                          ))}
                      </div>
                  ))}
              </div>
          ))}

    </div>
  )
}

export default OverTimeContent

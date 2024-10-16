import React from 'react'
import CheckBoxInput from '../../common/CheckBoxInput'
import Avatar from '../../common/Avatar'
import userimg from "../../../assets/images/user2.jpeg"
import usertwoImg from "../../../assets//images/user1.jpeg"
import userThreeImg from "../../../assets/images/Rectangle 328(1).png"

import employeeone from "../../../assets/images/user1.jpeg";
import sickImg from "../../../assets/images/image 625.png"
import casualImg from "../../../assets/images/discover/my attendance.png"
import employetwo from "../../../assets/images/user.png";
import employeethree from "../../../assets/images/user2.jpeg";
import employeefour from "../../../assets/images/Rectangle 328(1).png";
import employeefive from "../../../assets/images/Rectangle 328.png";
import { PiSignIn, PiSignOut } from "react-icons/pi";
import { RxDotFilled } from "react-icons/rx";
function LeaveContent() {
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
                        { Type: "Sick Leave", leaveFrom: "29-01-2024", leaveTo: "30-01-2024", NoOfDays: "3", TypImg: sickImg },
                        
                    ]
                },
                {
                    image: usertwoImg,
                    name: "Floyd Miles",
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Sick Leave", leaveFrom: "29-01-2024", leaveTo: "30-01-2024", NoOfDays: "1", TypImg: sickImg }
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
                        { Type: "Casual Leave", leaveFrom: "29-01-2024", leaveTo: "30-01-2024", NoOfDays: "1", TypImg: casualImg },
                       
                    ]
                },
                {
                    image: userimg,
                    name: "Floyd Jhon",
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Casual Leave", leaveFrom: "29-01-2024", leaveTo: "30-01-2024", NoOfDays: "2", TypImg: casualImg }
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
                                    <div className="grid grid-cols-2 gap-5">

                                        <div className='flex gap-2 items-center'>
                                            <Avatar image={punch.TypImg}
                                                className="border border-white shadow-md size-7 2xl:size-9 object-center"
                                            />

                                            <p className='text-sm 2xl:text-base font-bold'>{punch.Type}</p>
                                        </div>
                                        <div className='flex gap-8 items-center'>
                                            <div className='flex gap-8 items-center'>
                                                <div className='flex flex-col gap-0.5'>
                                                    <p className='font-medium text-xs 2xl:text-sm'>Leave From</p>
                                                    <p className='font-semibold text-xs 2xl:text-sm'>{punch.leaveFrom}</p>
                                                </div>
                                                <div className="divider-h !w-[25px] hidden sm:block" />
                                                <div className='flex flex-col gap-0.5'>
                                                    <p className='font-medium text-xs 2xl:text-sm'>Leave To</p>
                                                    <p className='font-semibold text-xs 2xl:text-sm'>{punch.leaveTo}</p>
                                                </div>
                                            </div>
                                            <div className="v-divider !h-2/3 hidden sm:block"/>
                                            <div>
                                                <div className='flex flex-col gap-0.5'>
                                                    <p className='font-medium text-xs 2xl:text-sm '>No of Days</p>
                                                    <p className='font-semibold text-xs 2xl:text-sm'>{punch.NoOfDays} Day</p>
                                                </div>
                                            </div>
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

export default LeaveContent

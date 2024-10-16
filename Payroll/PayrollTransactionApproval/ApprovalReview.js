import React, { useState } from 'react'
import user from "../../../assets/images/user1.jpeg"
import TabsNew from '../../common/TabsNew';
import Avatar from '../../common/Avatar';
import userimg from "../../../assets/images/user2.jpeg"
import usertwoImg from "../../../assets/images/user1.jpeg"
import userThreeImg from "../../../assets/images/Rectangle 328(1).png"

function ApprovalReview() {
    const [tabValue, setTabValue] = useState("work");

    const header = [
        {
            id: 1,
            value: "work",
            title: "Attendance",
            navValue: "work",
        },
        {
            id: 2,
            value: "policy",
            title: "Net Pay Review",
            navValue: "policy",
        },

    ];

    const employees = [
        {
            id: '#CM2382',
            image: userimg,
            name: "Cohen Goodwin",// Replace with actual image source for the avatar
            present: '28',
            absent: '0',
            halfDay: '2',
            paidLeave: '2',
            notMarked: '0',
            overtime: '162 ',
            fine: '162 '
        },
        {
            id: '#CM2391',
            image: usertwoImg,
            name: "Floyd Miles", // Replace with actual image source for the avatar
            present: '26',
            absent: '2',
            halfDay: '1 ',
            paidLeave: '3',
            notMarked: '0',
            overtime: '130 ',
            fine: '150 '
        },
        {
            id: '#CM2405',
            image: userThreeImg,
            name: "Cameron Williamson", // Replace with actual image source for the avatar
            present: '27',
            absent: '1 ',
            halfDay: '3',
            paidLeave: '1 ',
            notMarked: '0',
            overtime: '100 ',
            fine: '200 '
        }
    ];
    const employeesNetpay = [
        {
            id: '#CM2382',
            image: userimg,
            name: "Cohen Goodwin",// Replace with actual image source for the avatar
            Earnings: '4,500',
            Additions: '300',
            Deductions: '-150',
            Payments: '4,650',
            Adjustments: '50',
            incomeTax: '300 ',
            NetSalary: '4250 '
        },
        {
            id: '#CM2391',
            image: usertwoImg,
            name: "Floyd Miles", // Replace with actual image source for the avatar
            Earnings: '4,500',
            Additions: '300',
            Deductions: '-150 ',
            Payments: '4,650',
            Adjustments: '50',
            incomeTax: '300 ',
            NetSalary: '4250 '
        },
        {
            id: '#CM2405',
            image: userThreeImg,
            name: "Cameron Williamson", // Replace with actual image source for the avatar
            Earnings: '4,500',
            Additions: '300 ',
            Deductions: '-150',
            Payments: '4,650 ',
            Adjustments: '50',
            incomeTax: '300 ',
            NetSalary: '4250 '
        }
    ];

  return (
      <div className="flex flex-col gap-2 box-wrapper">
          <div className='flex justify-between '>
              <div className='flex flex-col gap-2'>
                  <div className='dark:text-white flex gap-2 items-center'>
                      <p className='font-semibold text-base 2xl:text-lg '>Approval Review</p>
                      <div className='bg-[#F2F4F7] text-gray-600 text-[10px] 2xl:text-xs rounded-full px-3 py-1 vhcenter'>
                          <p className='font-medium text-[8px] 2xl:text-[10px]'>Payroll Cycle: 2024 January</p>
                      </div>
                  </div>
                  <p className='font-medium text-xs 2xl:text-sm text-grey'>Review all pending approvals and verify details to ensure accurate payroll processing.</p>
              </div>
              <TabsNew
                  tabs={header}
                  tabClick={(e) => {
                      setTabValue(e);
                  }}
              />
          </div>
          {tabValue == "work" ? (
          <table className='flex flex-col gap-4'>
              <div className='box-wrapper grid grid-cols-9 !bg-[#F8F8F8] font-medium text-[10px] 2xl:text-xs'>
                  <td className='col-span-2 text-grey'>Name</td>
                  <td className='text-grey'>Present</td>
                  <td className='text-grey'>Absent</td>
                  <td className='text-grey'>Half day</td>
                  <td className='text-grey'>Paid Leave</td>
                  <td className='text-grey'>Not Marked</td>
                  <td className='font-semibold text-green-500'>Overtime</td>
                  <td className='font-bold text-red-500'>Fine</td>
              </div>
              {employees.map((data, index)=>(
                  <div key={index} className='box-wrapper grid grid-cols-9 font-medium items-center text-[10px] 2xl:text-xs'>
                  <div className='flex gap-2 col-span-2'>
                      <Avatar
                          className='shrink-0'
                          image={data.image}
                          size={40} />
                      <div>
                              <td className='font-semibold text-xs 2xl:text-sm '>{data.name}</td>
                              <p className='text-grey font-normal text-xs 2xl:text-sm'>{data.id}</p>
                      </div>
                  </div>
                      <td className='text-grey'>{data.present} days</td>
                      <td className='text-grey'>{data.absent} days</td>
                      <td className='text-grey'>{data.halfDay} days</td>
                      <td className='text-grey'>{data.paidLeave} days</td>
                      <td className='text-grey'>{data.notMarked} days</td>
                      <td className='font-semibold text-green-500'>{data.overtime} mins</td>
                      <td className='font-bold text-red-500'>{data.overtime} mins</td>
              </div>
              ))}
          </table>
          ) : (
                  <table className='flex flex-col gap-4'>
                      <div className='box-wrapper grid grid-cols-9 !bg-[#F8F8F8] font-medium text-[10px] 2xl:text-xs'>
                          <td className='col-span-2 text-grey'>Name</td>
                          <td className='text-grey'>Earnings</td>
                          <td className='text-grey'>Additions</td>
                          <td className='text-red-500'>Deductions</td>
                          <td className='text-grey'>Payments</td>
                          <td className='text-grey'>Adjustments</td>
                          <td className=' text-grey'>income Tax</td>
                          <td className='font-bold text-primaryalpha'>Net Salary</td>
                      </div>
                      {employeesNetpay.map((data, index) => (
                          <div key={index} className='box-wrapper grid grid-cols-9 items-center font-semibold text-[10px] 2xl:text-xs'>
                              <div className='flex gap-2 col-span-2'>
                                  <Avatar
                                      className='shrink-0'
                                      image={data.image}
                                      size={40} />
                                  <div>
                                      <td className='font-semibold text-xs 2xl:text-sm '>{data.name}</td>
                                      <p className='text-grey font-normal text-xs 2xl:text-sm'>{data.id}</p>
                                  </div>
                              </div>
                              <td className='text-grey'>{data.Earnings}</td>
                              <td className='text-grey'>{data.Additions}</td>
                              <td className='text-red-500'>{data.Deductions}</td>
                              <td className='text-grey'>{data.Payments}</td>
                              <td className='text-grey'>{data.Adjustments}</td>
                              <td className='text-grey'>{data.incomeTax}</td>
                              <td className='text-primaryalpha'>{data.NetSalary}</td>
                          </div>
                      ))}
                  </table>
          )}
      </div>
  )
}

export default ApprovalReview

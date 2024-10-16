import React, { useState } from 'react'
import ExcusesCard from './ExcusesCard';
import Dropdown from '../../common/Dropdown';
import ButtonClick from '../../common/Button';
import CheckBoxInput from '../../common/CheckBoxInput';
import { IoFilterSharp } from 'react-icons/io5';
import { ExcuseDataList } from "../../data";
import LateEntrySettings from './LateEntrySettings';

export default function Excuses() {
  const [employeeAttendenceList, setEmployeeAttendenceList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [show, setShow] = useState(false);


  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allEmployeeIds = employeeAttendenceList.map(
        (each) => each.employeeId
      );
      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleByDateChange = (employeeId) => {
    const isSelected = selectedEmployees.includes(employeeId);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const [excusesList, setExcusesList] = useState([
    {
      id: 1,
      date: "Dec 01,2024",
      details: [{
        "employeeDailyAttendanceId": 1167,
        "employeeId": 132,
        "employeeCompanyId": 0,
        "date": "2024-06-05",
        "shiftId": 0,
        "firstCheckInTime": "",
        "lastCheckOutTime": "",
        "totalWorkHours": "",
        "dutyType": null,
        "isRegularizationNeeded": 0,
        "excuseType": 0,
        "isActive": 1,
        "createdBy": 1,
        "createdOn": "2024-06-05 12:00 AM",
        "modifiedBy": 1,
        "modifiedOn": "2024-06-05 12:00 AM",
        "companyId": 8,
        "isHoliday": "0",
        "isOffDay": 0,
        "isLeave": 0,
        "isExcused": 0,
        "status": "Absent",
        "leaveTypeId": null,
        "description": null,
        "shiftName": null,
        "shiftStartTime": null,
        "shiftEndTime": null,
        "shiftWorkHours": null,
        "profilePicture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYP-KKtRJXm9qK7k2_PA1utxbxWdpzGIdulQ&s",
        "employeeName": "DDKaa",
        "designation": "Ghg",
        "extraHours": "",
        "hoursWorkedMessage": "0m less",
        "schedule": ""
      },
      {
        "employeeDailyAttendanceId": 1167,
        "employeeId": 132,
        "employeeCompanyId": 0,
        "date": "2024-06-05",
        "shiftId": 0,
        "firstCheckInTime": "",
        "lastCheckOutTime": "",
        "totalWorkHours": "",
        "dutyType": null,
        "isRegularizationNeeded": 0,
        "excuseType": 0,
        "isActive": 1,
        "createdBy": 1,
        "createdOn": "2024-06-05 12:00 AM",
        "modifiedBy": 1,
        "modifiedOn": "2024-06-05 12:00 AM",
        "companyId": 8,
        "isHoliday": "0",
        "isOffDay": 0,
        "isLeave": 0,
        "isExcused": 0,
        "status": "Absent",
        "leaveTypeId": null,
        "description": null,
        "shiftName": null,
        "shiftStartTime": null,
        "shiftEndTime": null,
        "shiftWorkHours": null,
        "profilePicture": null,
        "employeeName": "DDKaa",
        "designation": "Ghg",
        "extraHours": "",
        "hoursWorkedMessage": "0m less",
        "schedule": ""
      }]
    },
    {
      id: 2,
      date: "Dec 02,2024",
      details: [{
        "employeeDailyAttendanceId": 1168,
        "employeeId": 133,
        "employeeCompanyId": 0,
        "date": "2024-06-05",
        "shiftId": 0,
        "firstCheckInTime": "",
        "lastCheckOutTime": "",
        "totalWorkHours": "",
        "dutyType": null,
        "isRegularizationNeeded": 0,
        "excuseType": 0,
        "isActive": 1,
        "createdBy": 1,
        "createdOn": "2024-06-05 12:00 AM",
        "modifiedBy": 1,
        "modifiedOn": "2024-06-05 12:00 AM",
        "companyId": 8,
        "isHoliday": "0",
        "isOffDay": 0,
        "isLeave": 0,
        "isExcused": 0,
        "status": "Absent",
        "leaveTypeId": null,
        "description": null,
        "shiftName": null,
        "shiftStartTime": null,
        "shiftEndTime": null,
        "shiftWorkHours": null,
        "profilePicture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYP-KKtRJXm9qK7k2_PA1utxbxWdpzGIdulQ&s",
        "employeeName": "John Doe",
        "designation": "Developer",
        "extraHours": "",
        "hoursWorkedMessage": "0m less",
        "schedule": ""
      },
      {
        "employeeDailyAttendanceId": 1168,
        "employeeId": 133,
        "employeeCompanyId": 0,
        "date": "2024-06-05",
        "shiftId": 0,
        "firstCheckInTime": "",
        "lastCheckOutTime": "",
        "totalWorkHours": "",
        "dutyType": null,
        "isRegularizationNeeded": 0,
        "excuseType": 0,
        "isActive": 1,
        "createdBy": 1,
        "createdOn": "2024-06-05 12:00 AM",
        "modifiedBy": 1,
        "modifiedOn": "2024-06-05 12:00 AM",
        "companyId": 8,
        "isHoliday": "0",
        "isOffDay": 0,
        "isLeave": 0,
        "isExcused": 0,
        "status": "Absent",
        "leaveTypeId": null,
        "description": null,
        "shiftName": null,
        "shiftStartTime": null,
        "shiftEndTime": null,
        "shiftWorkHours": null,
        "profilePicture": null,
        "employeeName": "John Doe",
        "designation": "Developer",
        "extraHours": "",
        "hoursWorkedMessage": "0m less",
        "schedule": ""
      }]
    },
    {
      id: 3,
      date: "Dec 03,2024",
      details: [{
        "employeeDailyAttendanceId": 1167,
        "employeeId": 132,
        "employeeCompanyId": 0,
        "date": "2024-06-05",
        "shiftId": 0,
        "firstCheckInTime": "",
        "lastCheckOutTime": "",
        "totalWorkHours": "",
        "dutyType": null,
        "isRegularizationNeeded": 0,
        "excuseType": 0,
        "isActive": 1,
        "createdBy": 1,
        "createdOn": "2024-06-05 12:00 AM",
        "modifiedBy": 1,
        "modifiedOn": "2024-06-05 12:00 AM",
        "companyId": 8,
        "isHoliday": "0",
        "isOffDay": 0,
        "isLeave": 0,
        "isExcused": 0,
        "status": "Absent",
        "leaveTypeId": null,
        "description": null,
        "shiftName": null,
        "shiftStartTime": null,
        "shiftEndTime": null,
        "shiftWorkHours": null,
        "profilePicture": null,
        "employeeName": "DDKaa",
        "designation": "Ghg",
        "extraHours": "",
        "hoursWorkedMessage": "0m less",
        "schedule": ""
      },
      {
        "employeeDailyAttendanceId": 1167,
        "employeeId": 132,
        "employeeCompanyId": 0,
        "date": "2024-06-05",
        "shiftId": 0,
        "firstCheckInTime": "",
        "lastCheckOutTime": "",
        "totalWorkHours": "",
        "dutyType": null,
        "isRegularizationNeeded": 0,
        "excuseType": 0,
        "isActive": 1,
        "createdBy": 1,
        "createdOn": "2024-06-05 12:00 AM",
        "modifiedBy": 1,
        "modifiedOn": "2024-06-05 12:00 AM",
        "companyId": 8,
        "isHoliday": "0",
        "isOffDay": 0,
        "isLeave": 0,
        "isExcused": 0,
        "status": "Absent",
        "leaveTypeId": null,
        "description": null,
        "shiftName": null,
        "shiftStartTime": null,
        "shiftEndTime": null,
        "shiftWorkHours": null,
        "profilePicture": null,
        "employeeName": "DDKaa",
        "designation": "Ghg",
        "extraHours": "",
        "hoursWorkedMessage": "0m less",
        "schedule": ""
      }]
    },
  ]);


  const items = [
    { code: 'LE', description: 'Late Entries', count: "03" },
    { code: 'EB', description: 'Excess Break', count: "03" },
    { code: 'EE', description: 'Early Exit', count: "03" },
    { code: 'MP', description: 'Miss Punch', count: "03" },
  ];

  return (
    <div className='flex flex-col gap-6'>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CheckBoxInput
              value={selectAll}
              change={handleSelectAllChange}
            />
            <p className='font-medium text-sm 2xl:text-base text-primary'>Select All Employees</p>
          </div>
          <div className='flex items-center gap-1 text-slate-500 dark:text-slate-400'>
            <p className='font-medium text-xs 2xl:text-sm'>Sort by</p>
            <IoFilterSharp />
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-around bg-primaryalpha/5 rounded-lg	p-2'>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div className='flex items-center gap-2 text-xs 2xl:text-sm'>
                <div>
                  <div className='flex items-center justify-center w-8 h-8 2xl:w-10 2xl:h-10 bg-red-100 rounded	'>
                    <p className='font-bold text-red-500'>{item.code}</p>
                  </div>
                  <p className='flex items-center justify-center text-red-500 font-medium text-[10px] 2xl:text-sm rounded-full w-6 h-6 drop-shadow-xl -translate-y-14 translate-x-6 bg-gradient-to-r from-[#FFFFFF] to-[#F4F4F4]'>{item.count}</p>
                </div>
                <p className='font-medium hover:text-primary transform duration-300 underline dark:text-white'>{item.description}</p>
              </div>
              {index < items.length - 1 && <div className='v-divider'></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-8'>
        {excusesList.map((data, index) => (
          <div key={index} className='flex flex-col gap-3 bg-primaryalpha/5 rounded-lg p-3.5'>
            <div className='font-medium text-xs 2xl:text-sm dark:text-white'>{data.date}</div>
            <div className='flex items-center gap-2 mt-4'>
              <CheckBoxInput
                value={selectedEmployees.includes(data.id)}
                change={() => handleByDateChange(data.id)}
              />
              <p className='font-medium text-xs 2xl:text-sm text-slate-500 dark:text-slate-400'>Select All</p>
            </div>
            <ExcusesCard
              data={data.details}
              data2={ExcuseDataList}
              ButtonClick={(e, value, id) => {
                //   setAttendanceId(id);
                if (value === "Over Time") {
                  setShow(e);
                  //   } else if (value === "halfDay") {
                  //     setHalfDay(e);
                  //   } else if (value === "absent") {
                  //     // if (attendanceId !== null) {
                  //     //   addAbsent();
                  //     // }
                  //     addAbsent(id);
                  //     // setAbsent(value);
                  //   } else if (value === "fine") {
                  //     setFine(e);
                  //   } else if (value === "overTime") {
                  //     setOvertime(e);
                  //   } else if (value === "paidLeave") {
                  //     setLeave(e);
                  //   } else if (value === "approved") {
                  //     setApproved(e);
                  //   }
                }
              }
              }
            />
          </div>
        ))}
      </div>

      <div className="sticky p-4 h-20 w-full bottom-8 bg-white/60 borderb rounded-lg overflow-hidden backdrop-blur-[24px] shadow-footerdiv flex flex-col items-center md:flex-row md:justify-between dark:bg-black px-4"
      >
        <p className='flex items-center gap-8'>
          <span className='text-sm 2xl:text-base font-semibold text-primary'>03 Request Selected</span>
          <p className='flex items-center gap-1'>
            <span className='font-medium text-xs 2xl:text-sm text-slate-500 dark:text-slate-300'>Fine Type</span>
            <Dropdown
              placeholder='dropdown'
            />
          </p>
        </p>
        <p className='flex items-center gap-2'>
          <ButtonClick
            buttonName={"Reject Selected"}
            BtnType="primary"
            danger
          />
          <ButtonClick
            buttonName={"Approve Selected"}
            BtnType="primary"
          />
        </p>
      </div>
      {show && (
        <LateEntrySettings
          open={show}
          close={() => {
            setShow(false);
          }}
        // attendanceId={attendanceId}
        // refresh={() => {
        //   getEmployeeAttendence();
        // }}
        // employeeDetails={employeeDetails}
        />
      )}
    </div>
  )
}

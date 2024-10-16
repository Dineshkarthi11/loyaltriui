import React, { useEffect, useMemo, useState } from 'react'
import DrawerPop from '../common/DrawerPop';
import { useTranslation } from 'react-i18next';
import reminderimg from "../../assets/images/Reminder.png";
import mnthoverview from "../../assets/images/mnthoverview.png";
import Stepper from '../common/Stepper';
import ButtonClick from '../common/Button';
import TabsNew from '../common/TabsNew';
import SearchBox from '../common/SearchBox';
import { LuListFilter } from "react-icons/lu";
import { RxDotFilled } from "react-icons/rx";
import { Button, Dropdown } from 'antd';
import { useMediaQuery } from 'react-responsive';
import CheckBoxInput from '../common/CheckBoxInput';
import Avatar from '../common/Avatar';
import userimg from "../../assets/images/user2.jpeg"
import usertwoImg from "../../assets/images/user1.jpeg"
import userThreeImg from "../../assets/images/Rectangle 328(1).png"
import { PiSignIn, PiSignOut } from "react-icons/pi";
import { PiPlusThin } from "react-icons/pi";
import { PiMinusLight } from "react-icons/pi";

import employeeone from "../../assets/images/user1.jpeg";
import modalAntImg from "../../assets/images/ModalAntImg.svg";
import employetwo from "../../assets/images/user.png";
import employeethree from "../../assets/images/user2.jpeg";
import employeefour from "../../assets/images/Rectangle 328(1).png";
import employeefive from "../../assets/images/Rectangle 328.png";
import ExcusesCard from '../Company/Request/ExcusesCard';
import FineContent from './PayrollTransactionApproval/FineContent';
import LeaveContent from './PayrollTransactionApproval/LeaveContent';
import MisspunchContent from './PayrollTransactionApproval/MisspunchContent';
import OverTimeContent from './PayrollTransactionApproval/OverTimeContent';
import ModalAnt from '../common/ModalAnt';
import TextArea from '../common/TextArea';
import sickImg from "../../assets/images/image 625.png"
import casualImg from "../../assets/images/discover/my attendance.png"
import ComboImg from "../../assets/images/discover/comboOff.png"
import ApprovalReview from './PayrollTransactionApproval/ApprovalReview';


function TransactionApproval({ open = "",
    close = () => { }, }) {
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
    const [activeBtn, setActiveBtn] = useState(0);
    const [nextStep, setNextStep] = useState(0);
    const [presentage, setPresentage] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeBtnValue, setActiveBtnValue] = useState("pendingapprovals"); // employeeDetails // transferType // transferDetails // feedback
    const [expanded, setExpanded] = useState({});
    const [tabValue, setTabValue] = useState("fine");
    const [count, setCount] = useState(0);

    const handleIncrement = (Id, leaveType) => {
        setCount((prevCounts) => ({
            ...prevCounts,
            [Id]: {
                ...prevCounts[Id],
                [leaveType]: (prevCounts[Id]?.[leaveType] || 0) + 1,
            },
        }));
    };

    // Function to decrement the encash count
    const handleDecrement = (Id, leaveType) => {
        setCount((prevCounts) => ({
            ...prevCounts,
            [Id]: {
                ...prevCounts[Id],
                [leaveType]: Math.max((prevCounts[Id]?.[leaveType] || 0) - 1, 0),
            },
        }));
    };
    const [show, setShow] = useState(open);
    useMemo(
        () =>
            setTimeout(() => {
                show === false && close(false);
            }, 800),
        [show]
    );
    const handleClose = () => {
        setShow(false);
    };
    const [steps, setSteps] = useState([
        {
            id: 1,
            value: 0,
            title: t("Pending Approvals"),
            data: "pendingapprovals",
        },
        {
            id: 2,
            value: 1,
            title: "Unused Leaves",
            data: "unusedleave",
        },
        {
            id: 3,
            value: 2,
            title: t("Approval Review"),
            data: "approvalreview",
        },

    ]);
    const modalEmployedata = [{
        name: "abhi",
        image: employeeone,
        regularise: "pending"  //pending
    }, {
        name: "abhi",
        image: employetwo,
        regularise: "pending"
    }, {
        name: "abhi",
        image: employeethree,
        regularise: "pending"
    }, {
        name: "abhi",
        image: employeefour,
        regularise: "pending"
    }, {
        name: "abhi",
        image: employeefive,
        regularise: "pending"
    }
    ]
    useEffect(() => {
        if (nextStep >= 0 && nextStep !== activeBtn) {
            setActiveBtn(nextStep);
            setActiveBtnValue(steps[nextStep]?.data); // Make sure to update based on the nextStep
        }
    }, [nextStep]);
    const handleNextStep = () => {
        const stepIndex = steps.findIndex((step) => step.data === activeBtnValue);
        if (stepIndex < steps.length - 1) {
            setPresentage(stepIndex + 1); // Updating presentage
            setNextStep(stepIndex + 1);
        }
    };
    const handleToggle = (employeeId) => {
        setExpanded((prevState) => ({
            ...prevState,
            [employeeId]: !prevState[employeeId],
        }));
    };
    const header = [
        {
            id: 1,
            value: "fine",
            title: "Fine",
            navValue: "fine",
            count: 3
            // content:(
            //     <FineContent />
            // )
        },
        {
            id: 2,
            value: "leave",
            title: "leave",
            navValue: "leave",
            count: 3
        }, {
            id: 3,
            value: "misspunch",
            title: "Miss Punch",
            navValue: "misspunch",
            count: 3
        }, {
            id: 4,
            value: "overtime",
            title: "Overtime",
            navValue: "overtime",
            count: 3
        },

    ];
    const Reviewheader = [
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
    const ReviewTableHeader = [
        {
            id: 1,
            value: "Name",
            title: "Name",
            class: "!pl-3 text-grey col-span-2"
        },
        {
            id: 2,
            value: "Present",
            title: "Present",
            class: "text-grey"
        }, {
            id: 1,
            value: "Absent",
            title: "Absent",
            class: "text-grey"
        },
        {
            id: 2,
            value: "halfday",
            title: "Half day",
            class: "text-grey"
        }, {
            id: 1,
            value: "paidleave",
            title: "Paid Leave",
            class: "text-grey"

        },
        {
            id: 2,
            value: "notmarked",
            title: "Not Marked",
            class: "text-grey"
        }, {
            id: 2,
            value: "Overtime",
            title: "Overtime",
            class: "font-semibold text-green-500"
        }, {
            id: 2,
            value: "Fine",
            title: "Fine",
            class: "font-bold text-red-500"
        }

    ];

    const employeeApprovalData = [
        {
            date: "2024-10-07", // current date
            records: [
                {
                    image: userimg,
                    name: "Cohen Goodwin",
                    Id: 1,
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Sick Leave", leaveLimit: "02", leaveRule: "Encash", EncashLimit: "01", TypImg: sickImg },
                        { Type: "Casual Leave", leaveLimit: "03", leaveRule: "Carry Forward", EncashLimit: "01", TypImg: casualImg },
                        { Type: "Casual Leave", leaveLimit: "03", leaveRule: "Carry Forward", EncashLimit: "01", TypImg: casualImg }

                    ]
                },
                {
                    image: usertwoImg,
                    name: "Floyd Miles",
                    Id: 2,
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Sick Leave", leaveLimit: "02", leaveRule: "Encash", EncashLimit: "01", TypImg: sickImg }
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
                    Id: 3,
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Casual Leave", leaveLimit: "29-01-2024", leaveRule: "30-01-2024", EncashLimit: "1", TypImg: casualImg },

                    ]
                },
                {
                    image: userimg,
                    name: "Floyd Jhon",
                    Id: 4,
                    EmpId: "#CM2382",
                    shift: "General Shift Scheme",
                    missPunch: [
                        { Type: "Combo Off", leaveLimit: "1", leaveRule: "Lapse", EncashLimit: "", TypImg: ComboImg }
                    ]
                }
            ]
        }
    ];

    return (
        <DrawerPop
            open={show}
            background="#F8FAFC"
            avatar={true}
            src={mnthoverview}
            contentWrapperStyle={{
                position: "absolute",
                height: "100%",
                top: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                borderRadius: 0,
                borderTopLeftRadius: "0px !important",
                borderBottomLeftRadius: 0,
            }}
            close={handleClose}
            buttonClick={(e) => {
                if (activeBtnValue === "pendingapprovals") {
                    setPresentage(1);
                    handleNextStep();
                }
                if (activeBtnValue === "unusedleave") {
                    handleNextStep();
                    setPresentage(2);
                }
                if (activeBtnValue === "approvalreview") {
                    // setSubmitPop(true);
                }
                // if (activeBtnValue === "feedback") {
                //     //   setPresentage(3);
                //     //   handleNextStep();
                //     setSubmitPop(true);
                // }
            }}
            buttonClickCancel={(e) => {
                if (activeBtn > 0) {
                    setPresentage(presentage - 1);
                    setActiveBtn(activeBtn - 1);
                    setNextStep(nextStep - 1);
                    setActiveBtnValue(steps?.[activeBtn - 1].data);
                    console.log(activeBtn - 1);
                }
                //   setBtnName("");
            }}
            header={[
                t("Payroll Transactions"),
                t("Manage pending payroll approvals for accurate payroll processing"),
            ]}
            footerBtn={[t("Cancel"), t("Save")]}
            nextStep={nextStep}
            activeBtn={activeBtn}
            saveAndContinue={true}
        >
            <div className="flex flex-col gap-10  max-w-[1045px] mx-auto">
                <div className="-top-6 w-4/5 mx-auto z-50 px-5  dark:bg-[#1f1f1f] pb-8  ">
                    {steps && (
                        <Stepper
                            currentStepNumber={activeBtn}
                            presentage={presentage}
                            steps={steps}
                        />
                    )}
                </div>
                {activeBtnValue == "pendingapprovals" ? (
                    <div className="flex flex-col gap-6 box-wrapper">
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-2'>
                                <div className='dark:text-white flex gap-2 items-center'>
                                    <p className='font-semibold text-base 2xl:text-lg '>Approvals for Payroll Transaction</p>
                                    <div className='bg-[#F2F4F7] text-gray-600 text-[10px] 2xl:text-xs rounded-full px-3 py-1 vhcenter'>
                                        <p className='font-medium text-[8px] 2xl:text-[10px]'>Payroll Cycle: 2024 January</p>
                                    </div>
                                </div>
                                <p className='font-medium text-xs 2xl:text-sm text-grey w-full max-w-[500px] '>Manage pending payroll approvals for fines, missed punches, overtime, and leave requests. Review and take action to ensure accurate payroll processing.</p>
                            </div>
                            <ButtonClick
                                buttonName="Sent Reminder for All "
                                icon={<img
                                    src={reminderimg}
                                    alt="emoji"
                                    className="size-7 2xl:size-6 shrink-0"
                                />}
                            />
                            {/* <div className='flex gap-3'>
                                <ButtonClick
                                    buttonName="Reject Selected "
                                    BtnType="primary"                //admin view
                                    danger
                                />
                                <ButtonClick
                                    buttonName="Approve Selected "
                                    handleSubmit={()=>{
                                        setIsModalVisible(true);
                                    }}
                                    BtnType='primary'
                                />
                            </div> */}
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex justify-between items-baseline'>
                                <TabsNew
                                    classNames="w-max"
                                    count={true}
                                    tabs={header}
                                    tabClick={(e) => {
                                        setTabValue(e);
                                    }}

                                />
                                <div className='flex gap-2'>
                                    <SearchBox
                                        placeholder='Search Employess' />
                                    <Dropdown

                                        // menu={{ items }}
                                        placement="bottomRight"
                                        trigger={["click"]}

                                    >
                                        <Button
                                            className="flex items-center justify-center h-fit font-medium bg-white dark:bg-black dark:text-white flex-nowrap"
                                            onClick={(e) => {

                                            }}
                                            size={isSmallScreen ? "default" : "large"}
                                        >
                                            <span className="mr-2">{t("Filters")}</span>
                                            <span className="ml-auto">
                                                <LuListFilter className="text-base 2xl:text-lg" />
                                            </span>
                                        </Button>
                                    </Dropdown>
                                </div>
                            </div>
                            {tabValue === "fine" ? (
                                <FineContent />
                            ) : tabValue === "leave" ? (
                                <LeaveContent />
                            ) : tabValue === "misspunch" ? (
                                <MisspunchContent />
                            ) : (
                                <OverTimeContent />
                            )}


                        </div>

                    </div>
                ) : activeBtnValue == "unusedleave" ? (
                    <div className="flex flex-col gap-6 box-wrapper">
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-2'>
                                <div className='dark:text-white flex gap-2 items-center'>
                                    <p className='font-semibold text-base 2xl:text-lg '>Unused Leaves</p>
                                    <div className='bg-[#F2F4F7] text-gray-600 text-[10px] 2xl:text-xs rounded-full px-3 py-1 vhcenter'>
                                        <p className='font-medium text-[8px] 2xl:text-[10px]'>Payroll Cycle: 2024 January</p>
                                    </div>
                                </div>
                                <p className='font-medium text-xs 2xl:text-sm text-grey w-full max-w-[500px] '>Manage unused leave balances and handle carryover or adjustment requests.</p>
                            </div>
                        </div>
                        {employeeApprovalData?.map((items, index) => (
                            <div className='flex flex-col gap-5' key={index}>

                                {items?.records?.map((employee, j) => (
                                    <div key={j} className='box-wrapper !bg-[#B9B8FF0F] flex flex-col gap-3'>
                                        <div className=''>
                                            <div className='items-center'>
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

                                        </div>
                                        {(expanded[employee.Id] ? employee?.missPunch : employee?.missPunch.slice(0, 2)).map((leave, k) => (
                                            <div key={k} className='box-wrapper'>
                                                <div className="grid grid-cols-5 gap-5 items-center">

                                                    <div className='flex gap-2 items-center col-span-2'>
                                                        <Avatar image={leave.TypImg}
                                                            className="border border-white shadow-md size-7 2xl:size-9 object-center"
                                                        />
                                                        <div>
                                                            <p className='text-sm 2xl:text-base font-medium'>{leave.Type}</p>
                                                            <p className='text-xs 2xl:text-sm font-medium text-grey'>Total leave assigned : <span className='font-bold text-black dark:text-white'>5</span></p>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col gap-0.5'>
                                                        <p className='font-medium text-[10px] 2xl:text-xs text-grey'>Monthly Limit</p>
                                                        <p className='font-semibold text-xs 2xl:text-sm'>{leave.leaveLimit}</p>
                                                    </div>
                                                    <div className='flex flex-col gap-0.5'>
                                                        <p className='font-medium text-[10px] 2xl:text-xs text-grey'>Unused Leave Rule</p>
                                                        <p className='font-semibold text-xs 2xl:text-sm'>{leave.leaveRule}</p>
                                                    </div>
                                                    {leave.EncashLimit ? (
                                                        <div className='flex flex-col gap-0.5'>
                                                            <p className='font-medium text-[10px] 2xl:text-xs text-grey '>Encash Limit</p>
                                                            <p className='font-semibold text-xs 2xl:text-sm'>{leave.EncashLimit} Day</p>
                                                        </div>
                                                    ) : (
                                                        <div>

                                                        </div>
                                                    )}
                                                    {/* {leave.EncashLimit ? (     ///admin view
                                                        <div className='flex flex-col gap-0.5'>
                                                            <p className='font-medium text-[10px] 2xl:text-xs text-grey '>Encash Limit</p>
                                                            <div className='flex gap-2 items-center'>
                                                                <button onClick={() => handleIncrement(employee.Id, leave.Type)} className='box-wrapper !p-0 size-8  hover:opacity-50'><PiPlusThin className='text-base m-auto'/>
                                                                </button>
                                                                <p className='font-bold text-xs 2xl:text-sm text-primaryalpha'>{count[employee.Id]?.[leave.Type] || 0}</p>
                                                                <button onClick={() => handleDecrement(employee.Id, leave.Type)} className='box-wrapper !p-0 size-8 hover:opacity-50'><PiMinusLight className='text-base m-auto' />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>

                                                        </div>
                                                    )} */}


                                                </div>



                                            </div>
                                        ))}
                                        {employee?.missPunch.length > 2 && (
                                            <p onClick={() => handleToggle(employee.Id)} 
                                            className='text-xs 2xl:text-sm font-semibold text-primaryalpha underline cursor-pointer'>
                                                {expanded[employee.Id] ? `View less` : `View ${employee.missPunch.length - 2} more`}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : activeBtnValue == "approvalreview" ? (
                    <ApprovalReview
                        
                    />
                ) : ("")}



                <ModalAnt
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    centered={true}
                    padding="8px"
                    // onClose={handleCancel}
                    // onOk={handleSave}
                    okButtonClass='w-full'
                    cancelButtonClass='w-full'
                    okText={"Confirm Approval"}
                >
                    <div className="flex flex-col gap-5 md:w-[445px] 2xl:w-[553px] p-2">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-1 overflow-hidden border-2 border-white rounded-full 2xl:size-14 size-12 bg-primaryalpha/10">
                                <img
                                    src={modalAntImg}
                                    alt="modalimg"
                                    className="object-cover object-center w-full h-full"
                                />
                            </div>
                            <p className="font-semibold text-[17px] 2xl:text-[19px] text-center">
                                Confirm Approvals of Selected Employees
                            </p>
                            <p className="text-xs 2xl:text-sm text-center text-grey">
                                Are you sure you want to approve the selected pending approvals? Once approved, these records will be processed
                            </p>
                        </div>
                        <TextArea title='Remarks' />
                        <p className='font-semibold text-xs 2xl:text-sm text-primaryalpha'>Total 03 Request Selected</p>

                    </div>
                </ModalAnt>

            </div>
        </DrawerPop>
    )
}

export default TransactionApproval

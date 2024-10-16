import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import mnthoverview from "../../assets/images/mnthoverview.png";
import DrawerPop from '../common/DrawerPop'
import FlexCol from '../common/FlexCol';
import ButtonClick from '../common/Button';
import { PiCalendarBlank, PiEye, PiEyeBold, PiNotebook, PiNotebookBold } from 'react-icons/pi';
import Heading2 from '../common/Heading2';
import SearchBox from '../common/SearchBox';
import { LuListFilter } from 'react-icons/lu';
import { HiMiniInformationCircle } from 'react-icons/hi2';
import CheckBoxInput from '../common/CheckBoxInput';
import Avatar from '../common/Avatar';
import FormInput from '../common/FormInput';
import ToggleBtn from '../common/ToggleBtn';
import Stepper from '../common/Stepper';
import { Tooltip } from 'antd';
import ModalAnt from '../common/ModalAnt';
import CustomDropDown from '../common/CustomDropDown';
import TextArea from '../common/TextArea';

import img1 from "../../assets/images/PayrollTablePayment/Cash.png"
import img2 from "../../assets/images/PayrollTablePayment/Cheque.png"
import img3 from "../../assets/images/PayrollTablePayment/Bank.png"
import Img from '../../assets/images/PayrollTablePayment/payment.png'
import Msg from '../../assets/images/PayrollTablePayment/Messages.png'
import Notes from '../../assets/images/PayrollTablePayment/Notes.png'
import Bulk from '../../assets/images/Bulk.png'

export default function GroupPaymentDrawer({
    open = "",
    close = () => { },
}) {
    const { t } = useTranslation();
    const [presentage, setPresentage] = useState(0);
    const [show, setShow] = useState(open);
    const [activeBtn, setActiveBtn] = useState(0);
    const [addAdressstep, setAddAdressstep] = useState(true);
    const [nextStep, setNextStep] = useState(0);
    const [openFilter, setOpenFilter] = useState("");
    const [paymentMode, setPaymentMode] = useState(false);
    const [addNote, setAddNote] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [activeBtnValue, setActiveBtnValue] = useState("groupPayment");
    const [method, setMethod] = useState('');
    const [fieldValue, setFieldValue] = useState("");


    const paymentMethods = [
        {
            id: 1,
            name: "Cash Payment",
            imgSrc: img1
        },
        {
            id: 2,
            name: "Cheque",
            imgSrc: img2
        },
        {
            id: 3,
            name: "Bank Payment(DBT)",
            imgSrc: img3
        }
    ];
    const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);


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
            title: t("Group Payment"),
            data: "groupPayment",
        },
        {
            id: 2,
            value: 1,
            title: "Review",
            data: "review",
        },

    ]);
    useEffect(() => {
        // console.log(nextStep, activeBtn);
        if (activeBtn < 4 && activeBtn !== nextStep) {
            /// && activeBtn !== nextStep
            setActiveBtn(1 + activeBtn);
            // setNextStep(nextStep);
            // console.log(1 + activeBtn);
            // console.log(steps?.[activeBtn + 1].data, "data");
            setActiveBtnValue(steps?.[activeBtn + 1].data);
        }
    }, [nextStep]);



    const options3 = [
        {
            key: '1',
            label: (<div>July 2024</div>),
        },
        {
            key: '2',
            label: (<div>June 2024</div>),
        },
        {
            key: '3',
            label: (<div>May 2024</div>),
        },
    ];

    const items = [
        {
            id: 1,
            name: "Ralph Edwards",
            role: "Senior Programming Analyst",
            image: "",
            amount1: 134.00,
            amount2: 134.00,
            addNote: 1,
        },
        {
            id: 2,
            name: "Eleanor Pena",
            role: "Visual Designer",
            image: "https://publishing.insead.edu/sites/publishing/files/Pavel-Kireyev-12767_5.jpg",
            amount1: 134.00,
            amount2: 134.00,
            addNote: 0,
        },
        {
            id: 3,
            name: "Darlene Robertson",
            role: "Senior Product Manager",
            image: "https://assets-global.website-files.com/636b968ac38dd1495ec4edcd/64c3997613204b77e3a4aa03_IMG_3746.webp",
            amount1: 134.00,
            amount2: 134.00,
            addNote: 0,
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
            bodyPadding={0}
            close={handleClose}
            buttonClick={(e) => {
                // formik.handleSubmit()
                if (activeBtnValue == "groupPayment") {
                    setNextStep(nextStep + 1)
                    setPresentage(1);
                } else {
                    setConfirm(true)
                }
            }}
            buttonClickCancel={(e) => {
                if (activeBtn > 0) {
                    setActiveBtn(activeBtn - 1);
                    setNextStep(nextStep - 1);
                    setActiveBtnValue(steps?.[activeBtn - 1].data);
                    console.log(activeBtn - 1);
                }
            }}
            ClickfooterBackButton={handleClose}
            nextStep={nextStep}
            activeBtn={activeBtn}
            saveAndContinue={true}
            footerBackButton={true}
            footerBackButtonName="Back to payments"
            header={[
                t("Group Payment"),
                t("lorem ipsum dummy text dolar sit."),
            ]}
            footerBtn={[t("Cancel"), t("")]}
        >
            <div className=" bg-[#F8FAFC] m-auto max-w-[606px] w-full p-6 dark:bg-[#1f1f1f]">
                {steps && (
                    <Stepper
                        currentStepNumber={activeBtn}
                        presentage={presentage}
                        // direction="left"
                        // labelPlacement="vertical"
                        steps={steps}
                        addMore={addAdressstep}
                    // data={{
                    //     id: 2,
                    //     value: 1,

                    //     title: "Address Details ",
                    //     data: "addressDetails",
                    // }}
                    />
                )}
            </div>

            <FlexCol className={"max-w-[1096px] mx-auto p-5 pb-[100px]"}>

                <div className='borderb rounded-xl bg-white dark:bg-dark px-3 py-4'>
                    <div className='flex flex-col md:flex-row gap-2 md:gap-0 items-center md:justify-between'>
                        <Heading2
                            title='Group Payment-Save Transaction'
                            description='Group Payment-Save Transaction'
                        />
                        <ButtonClick
                            buttonName={
                                <div className='flex items-center gap-1'>
                                    <PiCalendarBlank size={18} />
                                    <p>20 May,2024</p>
                                </div>
                            }
                            handleSubmit={() => {
                                console.log("sdfsdf")
                            }}
                        />
                    </div>
                </div>
                {activeBtnValue === "groupPayment" ? (
                    <div className='borderb rounded-xl bg-white dark:bg-dark'>
                        <div className='flex flex-col md:flex-row gap-2 md:gap-0 items-center md:justify-between px-3 py-4'>
                            {selectedMethod ? (
                                <div className='flex flex-col sm:flex-row items-center gap-2'>
                                    <ButtonClick
                                        buttonName={
                                            <div className='flex items-center gap-1.5 vhcenter'>
                                                <img src={selectedMethod.imgSrc} alt="" className="w-7 h-7" />
                                                <div>{selectedMethod.name}</div>
                                            </div>
                                        }
                                        handleSubmit={() => {
                                            console.log(selectedMethod, "selectedMethod");
                                        }}
                                    />
                                    <ButtonClick
                                        buttonName={
                                            <div className='flex items-center gap-2 vhcenter'>
                                                <div className='text-grey text-xs 2xl:text-sm'>{`Ref N0: ${"123456"}`}</div>
                                                <div className='text-primary underline text-[10px] 2xl:text-xs'>Change Mode</div>
                                            </div>
                                        }
                                        handleSubmit={() => {
                                            setPaymentMode(true);
                                        }}
                                    />
                                </div>
                            ) : (
                                <ButtonClick
                                    buttonName={"Select Payment Mode"}
                                    handleSubmit={() => setPaymentMode(true)}
                                />
                            )}

                            <div className='flex items-center gap-3'>
                                <SearchBox
                                    placeholder='search here...'
                                />
                                <ButtonClick
                                    buttonName={t("Filters")}
                                    icon={<LuListFilter />}
                                    handleSubmit={() => {
                                        setOpenFilter(true);
                                    }}
                                />
                            </div>
                        </div>


                        <div className='divider-h p-0'></div>
                        <div className='grid grid-cols-12 gap-2 px-2 py-4 text-grey text-xs 2xl:gap-0 2xl:flex-nowrap'>
                            <div className='col-span-4'>Employees</div>
                            <div className='flex items-center w-fit gap-0 lg:gap-1 col-span-2'>
                                <Tooltip placement="top" title={<div className='text-xs'>Till Previous Month</div>}>
                                    <HiMiniInformationCircle className={'text-grey w-4 h-4 cursor-pointer'} />
                                </Tooltip>
                                <div className='w-fit'>Previous Dues.</div>
                                <div className='text-primary underline font-medium'>Auto Fill</div>
                            </div>
                            <div className='flex items-center gap-0 lg:gap-1 col-span-2'>
                                <div>Cycle Wise Dues.</div>

                                <CustomDropDown
                                    triggerText={<p className='text-primary underline font-medium'>Auto Fill</p>}
                                    items={options3}
                                />
                            </div>
                            <div className='pl-4 col-span-2 vhcenter'>Amount</div>
                            <div className='col-span-2'>Notes</div>
                        </div>
                        <div className='divider-h p-0'></div>

                        {items.map((item, index) => (
                            <div key={index} className='grid grid-cols-12 px-3 py-4'>
                                <div className='flex items-center gap-0.5 col-span-4'>
                                    <CheckBoxInput />
                                    <div className='flex items-center gap-1 2xl:gap-1.5'>
                                        <Avatar
                                            image={item.image}
                                            name={item.name}
                                            className='rounded-md'
                                        />
                                        <div className='flex flex-col gap-0.5 2xl:gap-1'>
                                            <div className='font-semibold text-xs 2xl:text-sm'>{item.name}</div>
                                            <div className='text-grey text-[10px] 2xl:text-xs'>{item.role}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='vhcenter col-span-2'>{item.amount1}</div>
                                <div className='vhcenter col-span-2'>{item.amount2}</div>
                                <div className='col-span-2 vhcenter'>
                                    <FormInput
                                        placeholder='Amount'
                                        className='w-3/4'
                                    />
                                </div>
                                {item?.addNote ? (
                                    <div className="flex items-center gap-1.5 cursor-pointer col-span-2" onClick={() => { setAddNote(true); }}>
                                        <PiEyeBold className='text-primary w-4 h-4' />
                                        <div className='text-primary underline text-xs 2xl:text-sm font-semibold'>View Note</div>
                                    </div>
                                ) : (
                                    <div className='col-span-2'>
                                        <ButtonClick
                                            buttonName={t("Add Note")}
                                            icon={<PiNotebookBold size={16} />}
                                            handleSubmit={() => {
                                                setAddNote(true);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className='borderb rounded-xl bg-white dark:bg-dark'>
                        <div className='flex items-center px-3 py-4'>

                            <div className='flex items-center gap-2'>
                                <ButtonClick
                                    buttonName={
                                        <div className='flex items-center gap-1.5 vhcenter'>
                                            <img src={selectedMethod.imgSrc} alt="" className="w-7 h-7" />
                                            <div>{selectedMethod.name}</div>
                                        </div>
                                    }
                                />
                                <ButtonClick
                                    className={"bg-slate-100"}
                                    buttonName={
                                        <div className='text-grey text-xs 2xl:text-sm'>{`Ref N0: ${"123456"}`}</div>
                                    }
                                />
                            </div>
                        </div>


                        <div className='divider-h p-0'></div>
                        <div className='grid grid-cols-4 gap-3 px-2 py-4 text-grey text-xs 2xl:text-sm'>
                            <div className='col-span-2'>Employees</div>
                            <div className=''>Amount</div>
                            <div>Notes</div>
                        </div>
                        <div className='divider-h p-0'></div>

                        {items.map((item, index) => (
                            <div key={index} className='grid grid-cols-4 gap-4 px-3 py-4'>
                                <div className='flex items-center gap-1 2xl:gap-1.5 col-span-2'>
                                    <Avatar
                                        image={item.image}
                                        name={item.name}
                                        className='rounded-md'
                                    />
                                    <div className='flex flex-col gap-0.5 2xl:gap-1'>
                                        <div className='font-semibold text-xs 2xl:text-sm'>{item.name}</div>
                                        <div className='text-grey text-[10px] 2xl:text-xs'>{item.role}</div>
                                    </div>
                                </div>

                                <div className='text-xs 2xl:text-sm'>4569.00</div>
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => { setAddNote(true); }}>
                                    <PiEye className='text-primary w-4 h-4' />
                                    <div className='text-primary underline text-xs 2xl:text-sm'>View Note</div>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </FlexCol>

            {activeBtnValue === "groupPayment" ? (
                <div className='absolute bottom-[68px] 2xl:bottom-[70px] borderb w-full bg-white dark:bg-dark dark:border-t dark:border-white dark:border-opacity-20'>
                    <div className='max-w-[1076px] mx-auto flex flex-col md:flex-row gap-3 md:gap-0 items-center md:justify-between px-8 py-3'>
                        <div className='flex gap-1'>
                            <ToggleBtn />
                            <div className='flex flex-col gap-1 text-xs 2xl:text-sm'>
                                <div className='flex items-center gap-1'>
                                    <p className='font-semibold'>Send notification to staff</p>
                                    <img src={Msg} alt="" className='w-7 h-7' />
                                </div>
                                <p className='text-grey'>Allow staff to receive important notification via message</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='font-bold text-xs 2xl:text-sm'>Payable Amount</p>
                            <p className='font-semibold text-lg 2xl:text-xl text-red-600 text-end'>28894.00</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='absolute bottom-[68px] 2xl:bottom-[70px] borderb w-full bg-white dark:bg-dark dark:border-t dark:border-white dark:border-opacity-20'>
                    <div className='max-w-[1076px] mx-auto flex flex-col md:flex-row gap-4 md:gap-0 items-center md:justify-between px-8 py-3'>
                        <div className='flex gap-1'>
                            <ToggleBtn />
                            <div className='flex flex-col gap-1 text-xs 2xl:text-sm'>
                                <div className='flex items-center gap-1'>
                                    <p className='font-semibold'>Send notification to staff</p>
                                    <img src={Msg} alt="" className='w-7 h-7' />
                                </div>
                                <p className='text-grey'>Allow staff to receive important notification via message</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-8'>
                            <div className='flex flex-col gap-1'>
                                <p className='text-xs 2xl:text-sm'>Total Employee Selected</p>
                                <p className='font-semibold text-lg 2xl:text-xl text-primary text-start'>{`${"05"} Employees`}</p>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p className='font-bold text-xs 2xl:text-sm'>Payable Amount</p>
                                <p className='font-semibold text-lg 2xl:text-xl text-red-600 text-end'>28894.00</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}




            <ModalAnt
                isVisible={paymentMode}
                onClose={() => {
                    setPaymentMode(false);
                    setFieldValue("");
                    setMethod('')
                }}
                width="453px"
                showTitle={false}
                centered={true}
                padding="8px"
                showOkButton={true}
                showCancelButton={true}
                okText="Continue"
                okButtonClass="w-full"
                cancelButtonClass="w-full"
                onOk={() => {
                    //    function here
                }}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2.5 items-center m-auto">
                        <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/5 text-primary">
                            <img src={Img} alt=" " className='w-8 h-8' />
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2">
                            <p className="font-semibold text-text-lg 2xl:text-xl">
                                Choose Group Payment Mode
                            </p>
                            <p className="flex text-center text-xs font-medium text-gray-500 2xl:text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                                facilisi. Sed sed lectus in enim tristique fringilla.
                            </p>
                        </div>
                    </div>
                    <div className="borderb bg-[#F9F9F9] dark:bg-dark rounded-lg p-2 flex flex-col gap-5">
                        <div className='flex flex-col gap-1'>
                            <div className='font-medium text-xs 2xl:text-sm'>Payment Mode</div>
                            <div className="grid grid-cols-3 gap-3">
                                {paymentMethods.map((each, index) => (
                                    <div key={index} className={`relative borderb rounded-lg px-2 py-1 ${method === each.id && "border-primary"}`}
                                        onClick={() => {
                                            setMethod(each.id);
                                        }}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <img src={each.imgSrc} alt={each.name} className="w-7 h-7" />
                                            <p className="text-[10px] 2xl:text-xs font-medium">{each.name}</p>
                                        </div>

                                        <div
                                            className={`${method === each.id && "border-primary"
                                                } border-primaryalpha/30 border rounded-full w-fit right-1 top-1 absolute`}
                                        >
                                            <div
                                                className={`font-semibold text-base w-3 h-3 border-2 border-white dark:border-white/10   rounded-full ${method === each.id &&
                                                    "text-primary bg-primary"
                                                    } `}
                                            >
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                        <FormInput
                            title='Reference Number'
                            placeholder='Number'
                            value={fieldValue}
                            change={(e) => {
                                const value = e.replace(/[^0-9.]/g, "");
                                if (!isNaN(value)) {
                                    setFieldValue(value);
                                }
                            }}
                        />
                    </div>
                </div>
            </ModalAnt>

            <ModalAnt
                isVisible={addNote}
                onClose={() => {
                    setAddNote(false);
                }}
                width="453px"
                showTitle={false}
                centered={true}
                padding="10px"
                showOkButton={true}
                showCancelButton={true}
                okText="Save"
                okButtonClass="w-full"
                cancelButtonClass="w-full"
                onOk={() => {
                    //    function here
                }}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2.5 items-center m-auto">
                        <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/5 text-primary">
                            <img src={Notes} alt=" " className='w-8 h-8' />
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2">
                            <p className="font-semibold text-text-lg 2xl:text-xl">
                                Add Note
                            </p>
                            <p className="flex text-center text-xs font-medium text-gray-500 2xl:text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                                facilisi. Sed sed lectus in enim tristique fringilla.
                            </p>
                        </div>
                    </div>
                    <div className="p-2 flex flex-col gap-5">
                        <TextArea
                            title='Note'
                            placeholder='Type Here'
                        />
                    </div>
                </div>
            </ModalAnt>

            <ModalAnt
                isVisible={confirm}
                onClose={() => {
                    setConfirm(false);
                }}
                width="523px"
                showTitle={false}
                centered={true}
                padding="8px"
                showOkButton={true}
                showCancelButton={true}
                okText="Confirm Payment"
                okButtonClass="w-full"
                cancelButtonClass="w-full"
                onOk={() => {
                    //    function here
                }}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2.5 items-center m-auto">
                        <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/5 text-primary">
                            <img src={Bulk} alt=" " className='w-8 h-8' />
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2">
                            <p className="font-semibold text-text-lg 2xl:text-xl">
                                Confirm Group Payment
                            </p>
                            <p className="flex text-center text-xs font-medium text-gray-500 2xl:text-sm">
                                Are you sure you want to confirm the group payment?
                            </p>
                        </div>
                    </div>
                    <div className="borderb bg-[#F9F9F9] dark:bg-dark  rounded-lg px-3 py-4">
                        <div className="grid grid-cols-3 gap-1">
                            <div className='flex flex-col gap-1'>
                                <div className='text-xs 2xl:text-sm'>Payable Amount</div>
                                <div className='font-semibold text-sm 2xl:text-base'>28894.00</div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <div className='text-xs 2xl:text-sm'>Payable Mode</div>
                                <div className='font-semibold text-sm 2xl:text-base'>Cash Payment</div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <div className='text-xs 2xl:text-sm'>Total employee selected</div>
                                <div className='font-semibold text-sm 2xl:text-base'>{`${"05"} Employees`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalAnt>

        </DrawerPop >
    )
}

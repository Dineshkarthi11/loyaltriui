import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DrawerPop from '../../common/DrawerPop';
import avathar from "../../../assets/images/mnthoverview.png";
import user from "../../../assets/images/user1.jpeg";
import user1 from "../../../assets/images/Rectangle 328(1).png";
import user2 from "../../../assets/images/user.png";
import msg from "../../../assets/images/image 1489.png";
import money from "../../../assets/images/PayrollTablePayment/Cash.png"
import Img from "../../../assets/images/Bulk.png"

import { Divider, Flex } from 'antd';
import FlexCol from '../../common/FlexCol';
import Dropdown from '../../common/Dropdown';
import TabsNew from '../../common/TabsNew';
import DateSelect from '../../common/DateSelect';
import SearchBox from '../../common/SearchBox';
import CheckBoxInput from '../../common/CheckBoxInput';
import FormInput from '../../common/FormInput';
import ToggleBtn from '../../common/ToggleBtn';
import ButtonClick from '../../common/Button';
import { PiCalendarBlank } from "react-icons/pi";
import { PiEyeBold } from "react-icons/pi";
import Avatar from '../../common/Avatar';
import AdjustmentSelect from '../../common/AdjustmentSelect';
import Stepper from '../../common/Stepper';
import ModalAnt from '../../common/ModalAnt';

function BulkactionDrawer({ open, close = () => { } }) {
    const { t } = useTranslation();
    const [activeBtn, setActiveBtn] = useState(0);
    const [presentage, setPresentage] = useState(0);
    const [nextStep, setNextStep] = useState(0);
    const [show, setShow] = useState(open);
    const [viewmodal, setViewmodal] = useState(false)
    const [addAdressstep, setAddAdressstep] = useState(true);
    const [activeBtnValue, setActiveBtnValue] = useState("groupPayment");
    const [tabvalue, setTabvalue] = useState("addsame");
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [bulkAmount, setBulkAmount] = useState('');
    const [persondata, setPersonData] = useState([
        {
            image: user,
            name: "Akhil",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user1,
            name: "Nimisha",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user2,
            name: "Suhara",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user2,
            name: "Suhara",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user2,
            name: "Suhara",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user2,
            name: "Suhara",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user2,
            name: "Suhara",
            domain: "Junior software Developer",
            amount: 23000
        },
        {
            image: user2,
            name: "Suhara",
            domain: "Junior software Developer",
            amount: 23000
        }
    ]);

    const handleClose = () => {
        close(false);
    };

    const handleCheckboxChange = (index) => {
        setSelectedItems((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleBulkAmountChange = (e) => {
        const newAmount = e.target.value;
        setBulkAmount(newAmount);

        // Update the amount for all selected users
        setPersonData((prevData) =>
            prevData.map((person, index) =>
                selectedItems.includes(index) ? { ...person, amount: newAmount } : person
            )
        );
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedItems([]); // Clear all selections
        } else {
            setSelectedItems(persondata.map((_, index) => index)); // Select all items
        }
        setSelectAll(!selectAll);
    };

    const tab = [{
        id: 0,
        title: "Add same amount to all employee",
        value: "addsame"
    },
    {
        id: 1,
        title: "Add different amount",
        value: "adddiff"
    }];

    const options =
        [
            {
                label: <span>Earnings</span>,
                title: 'manager',
                options: [
                    {
                        label: <span>Allowance</span>,
                        value: 'Jack',
                    },
                    {
                        label: <span>Bonus</span>,
                        value: 'Lucy',
                    },
                ],
            },
            {
                label: (
                    <>
                        <Divider style={{ margin: '8px 0' }} />
                        <span>Deductions</span>
                    </>
                ),
                title: 'engineer',
                options: [
                    {
                        label: <span>Deduction</span>,
                        value: 'Chloe',
                    },
                ],
            },
        ];

    const options2 =
        [
            {
                label: "July 2024",
                value: "one"

            },
            {
                label: "June 2024",
                value: "two"
            }, {
                label: "May 2024",
                value: "three",
                disabled: true,
            },
            {
                label: "April 2024",
                value: "four",
                disabled: true,

            },

        ];
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
    useMemo(() => {
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

    return (
        <DrawerPop
            open={show}
            close={(e) => {
                handleClose();
                close(e);
            }}
            bodyPadding={0}
            background={"#f8fafc"}
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
            updateFun={() => { }}
            avatar={true}
            buttonClick={(e) => {
                // formik.handleSubmit()
                if (activeBtnValue == "groupPayment") {
                    setNextStep(nextStep + 1)
                    setPresentage(1);
                } else {
                    // setConfirm(true)
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
            nextStep={nextStep}
            activeBtn={activeBtn}
            saveAndContinue={true}
            footerBackButton={true}
            src={avathar}
            header={[
                t("Adjustment Bulk Action"),
                t("lorem ipsum dummy text dolar sit.")
            ]}
            footerBtn={[t("Cancel"), t("Save")]}
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

                    />
                )}
            </div>
            {activeBtnValue === "groupPayment" ? (
                <FlexCol className=" ">

                    <FlexCol className="max-w-[880px] w-full mx-auto p-3">
                        <Flex gap={4}

                            className="flex flex-col sm:flex-row md:flex-row md:justify-between w-full borderb rounded-xl bg-white p-3 dark:bg-gray-600 items-center">

                            <div className='flex flex-col gap-1'>
                                <p className='text-sm 2xl:text-base font-semibold'>Adjustment Bulk action</p>
                                <p className='text-xs 2xl:text-sm font-medium text-grey'>
                                    lorem ipsum dummy text dolar sit.
                                </p>
                            </div>

                            <div className='grid grid-cols-2 gap-2 w-full sm:w-96'>

                                <AdjustmentSelect title="Type" options={options} />
                                <AdjustmentSelect options={options2}
                                    title='Payment Cycle' />
                            </div>

                        </Flex>
                        <FlexCol gap={1} className="w-full borderb rounded-xl bg-white p-3 dark:bg-gray-600 space-y-4">
                            <div >
                                <div className='flex flex-col sm:flex-row justify-between'>
                                    <TabsNew
                                        tabs={tab}
                                        tabClick={(e) => {
                                            setTabvalue(e);
                                        }} />
                                    <ButtonClick
                                        buttonName={
                                            <div className='flex items-center gap-1'>
                                                <PiCalendarBlank size={18} />
                                                <p>20 May,2024</p>
                                            </div>
                                        }
                                        handleSubmit={() => {
                                            console.log('click');
                                        }}
                                    />
                                </div>

                                <SearchBox />
                            </div>

                            <CheckBoxInput titleRight='Select All' value={selectAll}
                                change={handleSelectAllChange} />

                            {tabvalue === "addsame" ? (
                                <table className='w-full border-collapse'>
                                    <tbody>
                                        {persondata.map((items, index) => (
                                            <tr key={index} >
                                                <td className='flex gap-2 items-center p-2'>
                                                    <div className='flex gap-0.5 items-center'>
                                                        <CheckBoxInput
                                                            value={selectedItems.includes(index)}
                                                            change={() => handleCheckboxChange(index)}
                                                        />
                                                        <Avatar image={items.image} className='rounded-lg' />
                                                    </div>
                                                    <div className='flex flex-col gap-1'>
                                                        <p className='font-semibold text-xs 2xl:text-sm'>{items.name}</p>
                                                        <p className='text-[10px] 2xl:text-xs text-grey'>{items.domain}</p>
                                                    </div>
                                                </td>
                                                <td className='p-2'>
                                                    {editingIndex === index ? (
                                                        <FormInput
                                                            className='w-36'
                                                            type='number'
                                                            value={items.amount}
                                                            onBlur={() => setEditingIndex(null)}
                                                        />
                                                    ) : (
                                                        <p
                                                            className='text-xs 2xl:text-sm text-grey italic cursor-pointer'
                                                            onClick={() => setEditingIndex(index)}
                                                        >
                                                            Amount: {items.amount}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className='p-2'>
                                                    {selectedItems.includes(index) ? (
                                                        <p className='text-xs 2xl:text-sm text-grey italic'>Selected</p>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            ) : (

                                <table className='w-full '>
                                    <tbody>
                                        {persondata.map((items, index) => (
                                            <tr key={index} >
                                                <td className='flex gap-2 items-center p-2'>
                                                    <div className='flex gap-0.5 items-center'>
                                                        <CheckBoxInput
                                                            value={selectedItems.includes(index)}
                                                            change={() => handleCheckboxChange(index)}
                                                        />
                                                        <Avatar image={items.image} className='rounded-lg' />
                                                    </div>
                                                    <div className='flex flex-col gap-1'>
                                                        <p className='font-semibold text-xs 2xl:text-sm'>{items.name}</p>
                                                        <p class='text-[10px] 2xl:text-xs text-grey'>{items.domain}</p>
                                                    </div>
                                                </td>
                                                <td className='p-2'>
                                                    {tabvalue === "addsame" ? (
                                                        <FormInput className='w-36' type='number' />
                                                    ) : (
                                                        selectedItems.includes(index) ? (
                                                            <FormInput
                                                                className='w-36'
                                                                type='number'
                                                                defaultValue={items.amount}
                                                                onBlur={() => setEditingIndex(null)}
                                                            />
                                                        ) : (
                                                            <></>
                                                        )
                                                    )}
                                                </td>
                                                <td className='p-2'>
                                                    {selectedItems.includes(index) ? (
                                                        <p className='text-xs 2xl:text-sm text-grey italic'>Selected</p>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>


                            )}

                        </FlexCol>

                    </FlexCol>



                </FlexCol>
            ) : (
                
                <FlexCol className="max-w-[880px] w-full mx-auto p-3">
                    <Flex gap={4}

                        className="flex flex-col sm:flex-row md:flex-row md:justify-between w-full borderb rounded-xl bg-white p-4 dark:bg-gray-600 items-center">

                        <div className='flex flex-col gap-1'>
                            <p className='text-sm 2xl:text-base font-semibold'>Group Payment Review-Save Transaction</p>
                            <p className='text-xs 2xl:text-sm font-medium text-grey'>
                                lorem ipsum dummy text dolar sit.                            </p>
                        </div>

                        <div className=''>

                            <ButtonClick
                                buttonName={
                                    <div className='flex items-center gap-1'>
                                        <PiCalendarBlank size={18} />
                                        <p>20 May,2024</p>
                                    </div>
                                }
                                handleSubmit={() => {
                                    console.log('click');
                                }}
                            />
                        </div>

                    </Flex>
                    <FlexCol gap={1} className="w-full borderb rounded-xl bg-white p-0 dark:bg-gray-600 space-y-4">

                        <div className='flex gap-2 p-3'>
                            <ButtonClick
                                buttonName={
                                    <div className='flex items-center gap-1 '>
                                        <img src={money} className='size-7' />
                                        <p>Cash Payment</p>
                                    </div>
                                }
                                handleSubmit={() => {
                                    console.log('click');
                                }}
                            />
                            <ButtonClick
                                className={"bg-slate-50"}
                                buttonName={
                                    <div className='flex items-center text-grey gap-1'>
                                        <p>Ref No: 255367</p>
                                    </div>
                                }
                                handleSubmit={() => {
                                    console.log('click');
                                }}
                            />

                        </div>



                        <table className='w-full '>

                            <thead className='bordert borderbot text-xs 2xl:text-sm text-grey'>
                                <td className='p-3'>Employees</td>
                                <td className='p-3'>Amount</td>
                                <td className='p-3'>Notes</td>
                            </thead>
                            <tbody >
                                {persondata.map((items, index) => (
                                    <tr key={index} >
                                        <td className='flex gap-2 items-center p-3'>
                                            <div className='flex gap-0.5 items-center'>

                                                <Avatar image={items.image} className='rounded-lg size-10' />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <p className='font-semibold text-xs 2xl:text-sm'>{items.name}</p>
                                                <p className='text-[10px] 2xl:text-xs text-grey'>{items.domain}</p>
                                            </div>
                                        </td>
                                        <td className='p-2'>
                                            <p
                                                className='text-xs 2xl:text-sm text-grey italic cursor-pointer'
                                            >
                                                569.8
                                            </p>
                                        </td>
                                        <td className='p-2'>
                                            <div className="flex items-center gap-1.5 cursor-pointer col-span-2" onClick={() => { setViewmodal(true); }}>
                                                <PiEyeBold className='text-primary w-4 h-4' />
                                                <div className='text-primary underline text-xs 2xl:text-sm font-semibold'>View Note</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </FlexCol>


                </FlexCol>
            )}
            <div
                className='flex  flex-col sm:flex-row md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-600 bordert border-black dark:border-white border-opacity-10 dark:border-opacity-20 p-3 sticky  '>
                <div className='flex justify-between max-w-[880px] w-full mx-auto '>
                    <div className='flex gap-2'>
                        <ToggleBtn className="py-1" />
                        <div className='flex flex-col'>
                            <div className='flex gap-2 items-center'>
                                <p className='font-semibold text-xs 2xl:text-sm'>Send notification to staff</p>
                                <img src={msg} className='w-7 h-7' />
                            </div>
                            <p className='text-grey text-xs 2xl:text-sm'>Allow staff to receive important notification via message</p>
                        </div>
                    </div>
                    {activeBtnValue === "groupPayment" ? (
                        <div className='flex justify-between gap-5 items-center'>
                            {tabvalue === "addsame" ? (
                                <FormInput
                                    title='Amount'
                                    value={bulkAmount}
                                    onChange={handleBulkAmountChange}
                                    className='w-36'
                                />
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <p className='text-xs 2xl:text-sm'>
                                        Total employee selected
                                    </p>
                                    <p className='font-semibold text-xs 2xl:text-sm text-primaryalpha'>
                                        {selectedItems.length} Employees
                                    </p>
                                </div>
                            )}
                            <p className='text-grey py-4'>|</p>
                            <div className='flex flex-col gap-2'>
                                <p className='text-right font-bold text-xs 2xl:text-sm'>
                                    Total Amount
                                </p>
                                <p className='font-semibold text-lg 2xl:text-xl'>
                                    {selectedItems.reduce((total, index) => total + Number(persondata[index].amount || 0), 0)}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex justify-between gap-5 items-center'>


                            <div className='flex flex-col gap-2'>
                                <p className='text-right font-bold text-xs 2xl:text-sm'>
                                    Payable Amount
                                </p>
                                <p className='font-semibold text-lg 2xl:text-xl'>
                                    28894.00
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ModalAnt
                isVisible={viewmodal}
                onClose={() => {
                    setViewmodal(false);
                }}
                width="523px"
                showTitle={false}
                centered={true}
                padding="8px"
                showOkButton={true}
                showCancelButton={true}
                okText="Continue Payment"
                okButtonClass="w-full"
                cancelButtonClass="w-full"

            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2.5 items-center m-auto">
                        <div className="size-[46px] borderb rounded-full vhcenter bg-primaryalpha/5 text-primary">
                            <img src={Img} alt=" " className='w-8 h-8' />
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2">
                            <p className="font-semibold text-text-[17px] 2xl:text-[19px]">
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
                                <div className='text-xs 2xl:text-sm'>Bulk Mode </div>
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
        </DrawerPop>
    )
}

export default BulkactionDrawer;

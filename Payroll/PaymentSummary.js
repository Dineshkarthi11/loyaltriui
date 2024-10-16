import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';
import DrawerPop from '../common/DrawerPop';
import FlexCol from '../common/FlexCol';
import mnthoverview from "../../assets/images/mnthoverview.png";
import ButtonClick from '../common/Button';
import { PiStack } from 'react-icons/pi';
import Heading2 from '../common/Heading2';
import SearchBox from '../common/SearchBox';
import { LuListFilter } from 'react-icons/lu';
import Avatar from '../common/Avatar';
import PayrollFilterDrawer from './PayrollFilterDrawer';
import PaymentDrawerPOP from './PaymentDrawerPOP';
import GroupPaymentDrawer from './GroupPaymentDrawer';


export default function PaymentSummary({
    open = "",
    close = () => { },
}) {
    const { t } = useTranslation();
    const [show, setShow] = useState(open);
    const [openFilter, setOpenFilter] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);
    const [groupPayment, setGroupPayment] = useState(false);

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



    const people = [
        {
            image: "https://eclatsuperior.com/wp-content/uploads/2021/04/man3.jpg",
            name: "Ralph Edwards",
            title: "Senior Programming Analyst",
            status: "Pending",
            amount: "(-)8902.00"
        },
        {
            image: "https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=",
            name: "Darlene Robertson",
            title: "Senior Product Analyst",
            status: "Advance",
            amount: "(-)8902.00"
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9F7aRc0I5KJxVfeKHxNg0T0PGtfzc59ixpA&s",
            name: "Eleanor Pena",
            title: "Visual Designer",
            status: "Advance",
            amount: "(-)8902.00"
        },
        {
            image: "https://eclatsuperior.com/wp-content/uploads/2021/04/man3.jpg",
            name: "Ralph Edwards",
            title: "Senior Programming Analyst",
            status: "Pending",
            amount: "(-)8902.00"
        },
        {
            image: "https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=",
            name: "Darlene Robertson",
            title: "Senior Product Analyst",
            status: "Advance",
            amount: "(-)8902.00"
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9F7aRc0I5KJxVfeKHxNg0T0PGtfzc59ixpA&s",
            name: "Eleanor Pena",
            title: "Visual Designer",
            status: "Advance",
            amount: "(-)8902.00"
        },
    ];


    const filterArray = [
        {
            category: "Shift Scheme",
            options: [
                {
                    name: "Morning Shift",
                    time: "6:00 AM - 2:00 PM",
                },
                {
                    name: "Afternoon Shift",
                    time: "2:00 PM - 2:00 AM",
                },
                {
                    name: "Night Shift",
                    time: "10:00 PM - 6:00 AM",
                },
                {
                    name: "Day Shift",
                    time: "8:00 AM - 4:00 PM",
                },
                {
                    name: "Evening Shift",
                    time: "4:00 PM - 12:00 AM",
                }
            ]
        },
        {
            category: "Salary Template",
            options: [
                { name: "Hourly Rate" },
                { name: "Monthly Salary" },
                { name: "Freelance" },
                { name: "Commission Based" }
            ]
        },
        {
            category: "Department",
            options: [
                { name: "Human Resource" },
                { name: "Finance" },
                { name: "Operations" }
            ]
        },
        {
            category: "Location",
            options: [
                { name: "Branch A" },
                { name: "Branch B" }
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
            header={[
                t("Payment Summary"),
                t("lorem ipsum dummy text dolar sit."),
            ]}
            footer={false}
        >
            <FlexCol className={"max-w-[1096px] mx-auto"}>

                <div className='borderb rounded-xl bg-white dark:bg-dark px-3 py-4'>
                    <div className='flex flex-col md:flex-row gap-2 md:gap-0 items-center md:justify-between'>
                        <div className='flex items-center gap-7'>
                            <p className='flex flex-col gap-1'>
                                <span className='text-xs 2xl:text-sm text-red-500 font-medium'>Pending(-)</span>
                                <span className='font-semibold text-xl 2xl:text-[22px]'>3904579.00</span>
                            </p>
                            <p className='flex flex-col gap-1'>
                                <span className='text-xs 2xl:text-sm text-primary font-medium'>Advance(+)</span>
                                <span className='font-semibold text-xl 2xl:text-[22px]'>1579.00</span>
                            </p>
                        </div>
                        <ButtonClick
                            buttonName={
                                <div className='flex items-center gap-1'>
                                    <PiStack size={18} />
                                    <p>Group Payments</p>
                                </div>
                            }
                            handleSubmit={() => {
                                setGroupPayment(true);
                            }}
                        />
                    </div>
                </div>

                <div className='borderb rounded-xl bg-white dark:bg-dark'>
                    <div className='flex flex-col md:flex-row gap-2 md:gap-0 items-center md:justify-between px-3 py-4'>
                        <Heading2
                            title={
                                <div className='flex items-center gap-2'>
                                    <p>Total Employees</p>
                                    <p className='borderb border-4 p-1 rounded-md vhcenter bg-slate-100'>20</p>
                                </div>
                            }
                            description='lorem ipsum dummy text dolar sit.'
                        />
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

                    <div>
                        {people.map((person, index) => (
                            <div key={index} className='items-center grid grid-cols-2 gap-2 md:gap-0 md:grid-cols-4 px-3 py-4'>
                                <div className='flex items-center gap-2 col-span-2'>
                                    <Avatar
                                        image={person.image}
                                        name={person.name}
                                        className='rounded-md'
                                    />
                                    <p className='flex flex-col gap-1'>
                                        <span className='font-semibold text-xs 2xl:text-sm'>{person.name}</span>
                                        <span className='text-[10px] 2xl:text-xs text-grey'>{person.title}</span>
                                    </p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <p className={`rounded-2xl px-2 py-0.5 w-fit text-xs 2xl:text-sm font-medium ${person.status === "Pending" ? ('bg-red-100 text-red-600 dark:bg-red-200') : ("bg-primaryalpha/10 text-primary")} `}>{person.status}</p>
                                    <p className='v-divider !h-3'></p>
                                    <p className={`font-medium text-xs 2xl:text-sm ${person.status === "Pending" ? ('text-red-600') : ("text-primary")}`}>$ {person.amount}</p>
                                </div>

                                <div className='flex items-center justify-end'>
                                        <ButtonClick
                                            buttonName={"Add Payment"}
                                            handleSubmit={() => {
                                                setOpenPayment(true);
                                            }}
                                        />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </FlexCol>

            {openFilter && (
                <PayrollFilterDrawer
                    open={openFilter}
                    filterArray={filterArray}
                    close={() => setOpenFilter(false)}
                />
            )}

            {openPayment && (
                <PaymentDrawerPOP
                    open={openPayment}
                    close={() => setOpenPayment(false)}
                />
            )}

            {groupPayment && (
                <GroupPaymentDrawer
                    open={groupPayment}
                    close={() => setGroupPayment(false)}
                />
            )}

        </DrawerPop>
    )
}

import React, { useState } from 'react'
import MoneyLetter from "../../../assets/images/moneyLetter.png";
import { PiCaretRight } from 'react-icons/pi';
import { RxDotFilled } from 'react-icons/rx';
import LoanSummary from './LoanSummary';


export default function LoanBigCard({
    data,
}) {
    const [loanisOpen, setLoanIsOpen] = useState(false);
    const LoansumModal = (target) => {
        setLoanIsOpen(target);
    };

    if (!data) {
        return <p>No Data</p>;
    }

    return (
        <>
            <div className="flex flex-col gap-2 p-3 rounded-lg borderb">
                <div className="flex flex-col justify-between gap-4 sm:items-center sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded vhcenter bg-[#F9F6EC]">
                            <img src={MoneyLetter} alt="MoneyLetter" />
                        </div>
                        <p className="font-semibold pblack">{data.type}</p>
                        <div
                            className={`rounded-full px-1.5 pr-2.5 py-0.5 w-fit font-medium text-xs 2xl:text-sm vhcenter flex-nowrap ${data.status === "Open"
                                ? "text-green-700 bg-green-700/20 dark:bg-green-200"
                                : "text-red-700 bg-red-700/20 dark:bg-red-200"
                                }`}
                        >
                            <RxDotFilled size={16} />
                            {data.status}
                        </div>
                    </div>

                    <button
                        className="text-sm border-none outline-none text-primary lg:text-xs 2xl:text-sm vhcenter"
                        onClick={() => LoansumModal(true)}
                    >
                        View Details <PiCaretRight size={16} className="" />
                    </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 lg:gap-0 lg:flex items-center justify-between bg-[#F9F9F9] dark:bg-dark p-3.5 rounded-md">
                    <p className="text-sm lg:text-xs 2xl:text-sm">
                        <span className="text-grey">Principal: </span>
                        <span className="font-semibold"> {data.principal}</span>
                    </p>
                    <div className="v-divider !h-4 !bg-black/10 dark:!bg-white/10 hidden lg:block" />
                    <p className="text-sm lg:text-xs 2xl:text-sm">
                        <span className="text-grey">Interest Type: </span>
                        <span className="font-semibold"> {data.interestType}</span>
                    </p>
                    <div className="v-divider !h-4 !bg-black/10 dark:!bg-white/10 hidden lg:block" />
                    <p className="text-sm lg:text-xs 2xl:text-sm">
                        <span className="text-grey">Annual Interest Rate: </span>
                        <span className="font-semibold"> {data.annualInterestRate}</span>
                    </p>
                    <div className="v-divider !h-4 !bg-black/10 dark:!bg-white/10 hidden lg:block" />
                    <p className="text-sm lg:text-xs 2xl:text-sm">
                        <span className="text-grey">Balance: </span>
                        <span className="font-semibold"> {data.balance}</span>
                    </p>
                </div>
            </div>

            {loanisOpen && (
                <LoanSummary
                    open={loanisOpen}
                    close={(e) => {
                        setLoanIsOpen(e);
                    }}
                />
            )}
        </>
    );

}

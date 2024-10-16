import React from "react";
import { PiInfo } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import trial from "../../assets/images/trial.svg";

const Trial = ({ trialCount = 3, className = "" }) => {
  const subscriptionMessage = localStorage.getItem("subscriptionMessage");
  if (!subscriptionMessage ) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "relative overflow-hidden flex items-center justify-center gap-0.5 px-2.5 border border-[#FFD6D6] dark:bg-gradient-to-b dark:from-[#FF5757] dark:to-[#E22424] dark:text-white dark:border-none h-8 rounded-full cursor-pointer 2xl:h-10 ltr:mr-4 rtl:ml-4 text-darkred bg-gradient-to-r from-[#FFE5E5] to-[#FFF6F6]",
        className
      )}
    >
      <PiInfo size={18} />
      <p className="text-xxs 2xl:text-xs font-medium">{subscriptionMessage}</p>
      <img
        src={trial}
        alt="trial"
        className="absolute top-0 -right-[4%] dark:opacity-20"
      />
    </div>
  );
};

export default Trial;

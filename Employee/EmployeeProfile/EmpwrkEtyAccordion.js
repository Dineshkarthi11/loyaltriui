import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import ToggleBtn from "../../common/ToggleBtn";
import { lightenColor } from "../../common/lightenColor";
import Avatar from "../../common/Avatar";

export default function EmpwrkEtyAccordion({
  children,
  data = [],
  padding = true,
  toggleBtn = false,
  profileImg,
  name,
  designation,
  Id,
  msg,
  count,
  click = () => { },
  className,
  initialExpanded = false,
  childrenGap = "gap-4",
}) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const primaryColor = localStorage.getItem("mainColor");
  const mode = localStorage.getItem("theme");

  useEffect(() => {
    // console.log(expanded[1]);
  }, [expanded]);

  const lighterColor = lightenColor(primaryColor, 0.925);
  const lighterColor2 = lightenColor(primaryColor, 0.91);

  const handleExpand = () => {
    if (count !== 0) {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className={`relative flex flex-col gap-6 ${className}`}
      onClick={() => click()}
    >
      <div className="borderb rounded-[10px] dark:bg-dark">
        <h2 className="p-2">
          <button
            type="button"
            className={`flex items-center justify-between w-full p-2 font-semibold text-left rounded dark:bg-[#242424] dark:text-white ${count !== 0 ? "bg-[#F9FAFB]" : "opacity-45 dark:opacity-30"}`}
            // style={{
            //     background:
            //         mode == "dark"
            //             ? `linear-gradient(90deg, rgb(44 44 44) 0.03%, rgb(50 50 50) 100.92%)`
            //             : `linear-gradient(90deg, ${lighterColor} 0.03%, ${lighterColor2} 100.92%)`,
            // }}
            onClick={handleExpand}
            aria-controls={`acco-text-item`}
          >
            <div className="text-left rtl:text-right">
              <p className="flex items-center gap-2">
                <Avatar
                  image={profileImg}
                  name={name}
                  className={`size-10 2xl:size-12 ${count !== 0 ? ("border-2 border-white shadow-md") : ("")}`}
                />
                <p className="gap-1">
                  <div className="font-semibold text-sm 2xl:text-base ">
                    {name?.charAt(0).toUpperCase() + name?.slice(1)}
                  </div>
                  <p className="text-[10px] 2xl:text-xs text-grey">
                    Emp Code: #{Id}
                  </p>
                </p>
              </p>
            </div>

            <div className="flex items-center gap-8">
              <p className="flex items-center gap-2">
                <p className="font-medium font text-xs 2xl:text-sm text-grey">
                  {msg?.charAt(0).toUpperCase() + msg?.slice(1) || ""}
                </p>
                <p className="rounded-md font-normal bg-primaryalpha/10 py-[3px] px-[9px] text-primary dark:font-semibold">
                  {count}
                </p>
              </p>

              <div
                className={`rounded-[4px] ${!toggleBtn && "bg-secondaryWhite dark:bg-secondaryDark"
                  }  p-[5px]`}
              >
                {toggleBtn ? (
                  <ToggleBtn value={expanded ? 1 : 0} />
                ) : (
                  <IoIosArrowForward
                    size={18}
                    className={`transition duration-300 ease-out origin-center transform text-black text-opacity-20 dark:text-white dark:text-opacity-20 ${expanded ? "!rotate-90" : ""
                      }`}
                  />
                )}
              </div>
            </div>
          </button>
        </h2>
        <div
          id={`acco-text-item`}
          role="region"
          aria-labelledby={`acco-title-item`}
          className={`grid text-sm transition-all duration-300 ease-in-out ${expanded
            ? `grid-rows-[1fr] opacity-100 ${padding ? "p-6" : ""
            } border-t border-secondaryDark dark:border-secondaryWhite border-opacity-10 dark:border-opacity-10`
            : "grid-rows-[0fr] opacity-0 "
            }`}
        >
          <div className={`flex flex-col ${childrenGap} overflow-hidden`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

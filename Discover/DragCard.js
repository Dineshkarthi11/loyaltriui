import React from "react";
import SegmentedTab from "../common/Segmented";
import { PiDotsSixVertical } from "react-icons/pi";

const DragCard = ({
  icon,
  imageIcon,
  header,
  count,
  children,
  segment = false,
  segmentOptions = [],
  segmentSelected = "",
  segmentOnchange = () => {},
  className = "",
}) => (
  <div
    className={`flex flex-col gap-2.5 p-2 bg-white dark:border dark:border-dark3 shadow-dashboard rounded-xl dark:bg-dark2 overflow-hidden ${className}`}
  >
    {/* IMAGE AND HEADER */}
    <div className="bg-[#F8FAFC] rounded-md h-10 dark:bg-dark3 p-2 flex items-center justify-between react-grid-dragHandle cursor-move">
      <div className="flex items-center gap-2.5">
        {icon && <div className="w-5 h-5 dark:text-white">{icon}</div>}
        {imageIcon && (
          <div className="w-5 h-5 dark:text-white">
            <img
              src={imageIcon}
              className="object-cover object-center w-full h-full"
              alt=""
            />
          </div>
        )}
        <h3 className="h3">{header}</h3>
        {count && (
          <p className="text-[11px] text-white rounded bg-primary size-4 vhcenter">
            {count}
          </p>
        )}
      </div>
      <PiDotsSixVertical className="text-lg dark:text-darkText" />
    </div>

    {/* SEGMENTS */}
    {segment && (
      <SegmentedTab
        options={segmentOptions}
        onChange={segmentOnchange}
        selectedOption={segmentSelected}
      />
    )}

    {/* CONTENT */}
    {children}
  </div>
);

export default DragCard;

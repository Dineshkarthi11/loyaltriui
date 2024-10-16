import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "antd";
import { twMerge } from "tailwind-merge";

const ProgressBarMulti = ({
  categories,
  showPercentage = true,
  className = "",
  barClassName = "",
  tooltip = false,
  tooltipData,
  tooltipPlacement = "topRight",
  colors = [],
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  const total = categories.reduce(
    (acc, category) => acc + category.percentage,
    0
  );

  return (
    <div className={twMerge("z-0 w-full h-20 rounded-full", className)}>
      <div className="flex w-full h-full">
        {categories.map((category, index) => {
          const color = colors[index % colors.length];
          const toolTipDAta = () => {
            return (
              <>
                <div className="p-2 flex flex-col gap-2">
                  <p className="text-[10px] 2xl:text-xs font-semibold">
                    {category.shiftname}
                  </p>
                  <p className="flex items-center">
                    <span
                      className="inline-block size-2.5 mr-1 rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0px 4px 4px ${color}66`,
                      }}
                    />
                    <span className="text-[7px] 2xl:text-[10px] font-medium">
                      {category.label}: {category.percentage.toFixed(0)}%
                    </span>
                  </p>
                </div>
              </>
            );
          };
          return (
            <Tooltip
              title={tooltip && toolTipDAta}
              placement={tooltipPlacement}
              key={index}
            >
              <motion.div
                className={twMerge(
                  "h-full border-r border-t border-b dark:border-black relative border-white rounded-r-full first:rounded-full group",
                  barClassName
                )}
                style={{
                  width: `${(category.percentage / total) * 100}%`,
                  minWidth: `${showPercentage ? "20%" : "0%"}`,
                  backgroundColor: color || category.color,
                  position: "relative",
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(category.percentage / total) * 100}%`,
                  ease: "linear",
                }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="absolute h-full group-first:hidden size-6 -left-3"
                  style={{
                    backgroundColor: color || category.color,
                    zIndex: -1,
                    position: "absolute",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%", ease: "linear" }}
                  transition={{ duration: 0.8 }}
                />
                {showPercentage && (
                  <div className="absolute flex h-full gap-2 top-10">
                    <div
                      className="rounded-full size-3 shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex flex-col">
                      <p className="text-xs font-semibold leading-3 dark:text-white">
                        {category.percentage}%
                      </p>
                      <p className="text-xs md:text-[9px] 2xl:text-xs font-normal leading-3 text-grey">
                        {category.label}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBarMulti;

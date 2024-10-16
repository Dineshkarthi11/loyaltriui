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
    <div className={twMerge("z-0 w-full h-3 2xl:h-4 rounded-full", className)}>
      <div className="flex w-full h-full overflow-hidden">
        {categories.map((category, index) => {
          const color = colors[index % colors.length];
          const toolTipDAta = () => {
            return (
              <>
                <div className="p-2 flex flex-col gap-2">
                  <p className="text-[10px] 2xl:text-xs font-semibold">
                    {category?.shiftname}
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
                      {category?.label}: {category?.percentage.toFixed(0)}%
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
                  `h-full border-r border-t border-b dark:border-black relative border-white rounded-full first:rounded-full group ${
                    category?.percentage == 0 && "hidden"
                  }`,
                  barClassName
                )}
                style={{
                  width: `${(category?.percentage / total) * 100}%`,
                  minWidth: `${showPercentage ? "20%" : "0%"}`,
                  backgroundColor: color || category?.color,
                  position: "relative",
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(category?.percentage / total) * 100}%`,
                  ease: "linear",
                }}
                transition={{ duration: 0.8 }}
              >
                {/* <motion.div
                  className="absolute h-full group-first:hidden size-6 -left-3"
                  style={{
                    backgroundColor: color || category.color,
                    zIndex: -1,
                    position: "absolute",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%", ease: "linear" }}
                  transition={{ duration: 0.8 }}
                /> */}
                {showPercentage && (
                  <div className="flex justify-between items-center">
                    {categories.map((category, index) => (
                      <div className=" flex h-full gap-2 top-8 flex-col" key={index}>
                        <p className="text-xs md:text-[9px] 2xl:text-xs font-normal leading-3 text-grey">
                          {category?.label}
                        </p>
                        <div className="flex items-center gap-2">
                          <span class="relative flex size-2.5">
                            <span
                              class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{
                                backgroundColor: category?.color,
                                opacity: 0.7,
                              }}
                            ></span>
                            <span
                              class="relative inline-flex rounded-full size-2.5"
                              style={{
                                backgroundColor: category?.color,
                              }}
                            ></span>
                          </span>
                          <p className="text-xs font-semibold leading-3 dark:text-white">
                            {category?.percentage}
                          </p>
                        </div>
                      </div>
                    ))}
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

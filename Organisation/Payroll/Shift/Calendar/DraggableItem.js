import React from "react";
import { useDrag } from "react-dnd";
import { HiPlus } from "react-icons/hi2";
import { PiDotsSixVerticalBold } from "react-icons/pi";

const DraggableItem = ({ title, color, text, shift }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "DRAGGABLE_ITEM",
    item: { title, shift, color, text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        // padding: "8px",
        // border: "1px solid #000",
        // backgroundColor: "#eee",
        // marginBottom: "8px",
      }}
      ref={drag}
    >
      <div className="flex justify-start gap-2">
        <div className="col-span-2 ">
          <div
            className={`relative min-w-32 max-w-[174px] flex rounded-lg border text-[${color}] text-[12px] font-semibold border-[${color}] overflow-hidden`}
            style={{
              backgroundColor: `${color}15`,
              color: text,
              borderColor: `${color}50`,
            }}
          >
            <div
              className="vhcenter py-3 border-r"
              style={{
                borderColor: `${color}30`,
              }}
            >
              <PiDotsSixVerticalBold className="text-xl" />
            </div>
            <div className=" vhcenter p-3 overflow-hidden">
              <p className="  truncate" title={title}>
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableItem;

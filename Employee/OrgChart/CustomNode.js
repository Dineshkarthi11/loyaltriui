import { Popconfirm } from "antd";
import React, { memo } from "react";
import { PiDotsSixVertical, PiTrash } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { Handle, Position, useReactFlow } from "reactflow";
import { sethierarchyEmployeevalues } from "../../../Redux/action";

const CustomNode = ({ data, id, isConnectable, viewClick = () => {} }) => {
  // console.log(data);
  const instance = useReactFlow();
  const dispatchRedux = useDispatch();

  return (
    <>
      {id == "1" ? (
        <div className="w-full vhcenter">
          {/* <Handle
          type="target"
          position={Position.Top}
          onConnect={(params) => console.log("handle onConnect", params)}
          // isConnectable={isConnectable}
        /> */}
          <div className="overflow-hidden rounded-full size-20 border-[5px] border-white shadow-[0px_10px_20px_0px] shadow-primaryalpha/20">
            <img
              src={data.imageurl}
              alt=""
              className="object-cover object-center w-full h-full"
            />
          </div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="a"
            isConnectable={isConnectable}
            className=" opacity-0 !bg-white rounded-full border size-4 group-hover:opacity-100 ring-2 ring-white border-primary text-primary vhcenter justify-center items-center text-xs"
          />
        </div>
      ) : (
        <div
          className="pl-0 pr-8 py-3 bg-white dark:bg-[#131827] borderb rounded-lg transition-all duration-100 shadow-[0px_4px_4px_0px] hover:border-primary shadow-black/5 backdrop-blur-md group relative hover:shadow-[0px_12px_30px_0px] hover:shadow-[#C6CFD6]/80 dark:hover:shadow-primaryalpha/50"
          onClick={() => {
            // console.log(data.employeeId, id, "dddddddddddddddddddddd");
            viewClick();
            dispatchRedux(sethierarchyEmployeevalues({ id: id, ...data }));
          }}
        >
          <div className="flex items-center">
            <div className="px-2 vhcenter">
              <PiDotsSixVertical />
            </div>

            <div className="flex items-center">
              {data.imageurl ? (
                <div className="flex items-center justify-center overflow-hidden bg-gray-100 rounded-full size-9 2xl:size-11">
                  {
                    <img
                      src={data.imageurl}
                      alt=""
                      className="object-cover object-center w-full h-full"
                    />
                  }
                </div>
              ) : (
                <p className="flex items-center justify-center font-semibold text-xl text-primary bg-primaryLight rounded-full size-9 2xl:size-11 p-2">
                  {data.name?.charAt(0).toUpperCase()}
                </p>
              )}
              <div className="ml-2">
                <div className="text-sm font-medium 2xl:text-base">
                  {data.name}
                </div>
                <div className="text-[9px] 2xl:text-xs font-medium text-grey">
                  {data.job}
                </div>
              </div>
            </div>
          </div>

          <Handle
            type="target"
            position={Position.Top}
            className="!bg-primaryalpha/50 rounded-full size-2"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="opacity-0 !bg-white rounded-full border size-4 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-white border-primary text-primary vhcenter justify-center items-center text-xs  "
          >
            +
          </Handle>

          {data.itemCount > 0 && (
            <div className="px-2.5 py-0.5 opacity-100 rounded-full text-[10px] text-white group-hover:opacity-0 transition duration-200 absolute -bottom-2 -translate-x-1/2 left-1/2 bg-primaryalpha shadow-lg shadow-primaryalpha/30 group-hover:-z-[10]">
              + {data.itemCount}
            </div>
          )}
          {/* To delete Node  */}
          <Popconfirm
            placement="topRight"
            title="Are you sure to delete this Employee?"
            description="Delete this Employee"
            okText="Yes, Delete"
            cancelText="No"
            onConfirm={() => instance.deleteElements({ nodes: [{ id: id }] })}
          >
            <div className="absolute hidden text-lg text-red-500 cursor-pointer top-2 right-2 group-hover:block deleteNode">
              <PiTrash />
            </div>
          </Popconfirm>
        </div>
      )}
    </>
  );
};

export default memo(CustomNode);

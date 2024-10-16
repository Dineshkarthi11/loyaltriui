import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(({ data, isConnectable }) => {
    // console.log(data);
  return (
    <>
      {/* <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        // isConnectable={isConnectable}
      /> */}
      <div className="overflow-hidden rounded-full size-20 border-[5px] border-white shadow-[0px_10px_20px_0px] shadow-primaryalpha/20">
        <img
          src={data.image.url}
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
    </>
  );
});

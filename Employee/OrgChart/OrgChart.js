import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Background,
  updateEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  ConnectionLineType,
  Controls,
} from "reactflow";

import "reactflow/dist/base.css";
import { Drawer, Input, Button, notification, Tooltip } from "antd";
import CustomNode from "./CustomNode";
import ButtonClick from "../../common/Button";
import {
  PiMagnifyingGlassMinus,
  PiMagnifyingGlassPlus,
  PiPlusCircle,
} from "react-icons/pi";
import ImageNode from "./ImageNode";
import { AiOutlineColumnWidth } from "react-icons/ai";
import DownloadButton from "./DownloadButton";
import API, { action } from "../../Api";
import { useSelector } from "react-redux";
import localStorageData from "../../common/Functions/localStorageKeyValues";

const nodeTypes = {
  custom: CustomNode,
  imageNode: ImageNode,
};

const OrgChart = ({ employee }) => {
  const edgeUpdateSuccessful = useRef(true);
  const [initialNode, setInitialNode] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  useEffect(() => {
    // console.log(employee);
    if (employee) getHierachy();
  }, [employee]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [newNodeData, setNewNodeData] = useState({ name: "", job: "" });
  const [rfInstance, setRfInstance] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [companyId, setCompanyId] = useState(localStorageData.companyId);
  const [employeeId, setEmployeeId] = useState(localStorageData.employeeId);
  const selectedAccordionItem = useSelector(
    (state) => state.hirearchy.employeeId
  );

  const [hirearchyDetails, setHirearchyDeatils] = useState([]);

  const { setViewport, zoomIn, zoomOut, fitView } = useReactFlow();

  const handleTransform = useCallback(() => {
    setViewport({ x: 50, y: 50, zoom: 1 }, { duration: 800 });
  }, [setViewport]);

  const flowKey = "FlowChartKey";
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      // console.log(flow);
      api.success({
        message: "Chart Saved",
        description: "Organization Chart has been successfully saved.",
      });
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      // const flow = JSON.parse(localStorage.getItem(flowKey));
      // if (flow) {
      //   const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      //   setNodes(flow.nodes || []);
      //   setEdges(flow.edges || []);
      //   setViewport({ x, y, zoom });
      // }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  useEffect(() => {
    onRestore();
    const flow = JSON.parse(localStorage.getItem(flowKey));
    // console.log(flow);
  }, [onRestore]);

  const onConnect = useCallback(
    // (params) => setEdges((eds) => addEdge(params, eds)),
    (params) =>
      setEdges((eds) =>
        addEdge({
          ...params,
          type: ConnectionLineType.SmoothStep,
          animated: true,
        })
      ),
    []
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  // Calculate the count of items under each node
  // Calculate the count of items under each node
  // Function to calculate the count of items under a node
  const calculateNodeItemCount = (nodeId, edges) => {
    // Get the immediate children of the node
    const children = edges.filter((edge) => edge.source === nodeId);
    let count = children.length;

    // Recursively calculate the count of items for each child node
    children.forEach((child) => {
      count += calculateNodeItemCount(child.target, edges);
    });

    return count;
  };

  useEffect(() => {
    if (hirearchyDetails.length > 0) {
      getHierachyEmployeeView(selectedAccordionItem);
    }
  }, [selectedAccordionItem]);

  const generatePositions = (nodes, initialX, initialY, xSpacing, ySpacing) => {
    console.log(nodes, "nodes====");

    return nodes.map((node, index) => {
      // Calculate row and column based on the index
      // const row = Math.floor(index / 1); // Change '2' to the desired number of nodes per row
      // const col = index % 2;

      const lOfNodes = nodes.length / 2;

      const oddEven = parseInt(nodes.length) % 2 === 0;

      const row =
        node.data.job === "Admin" || node.data.job === "Super Admin" ? 0 : 1; // Change '2' to the desired number of nodes per row
      const col =
        node.data.job === "Admin" || node.data.job === "Super Admin"
          ? 0
          : parseInt(-lOfNodes) + index;

      // Calculate position
      const x =
        node.data.job === "Admin" || node.data.job === "Super Admin"
          ? oddEven === true
            ? -95.32
            : 10.87
          : initialX + col * xSpacing - (row % 2 === 0 ? 0 : xSpacing / 2); // Adjust x for staggered rows

      const y =
        node.data.job === "Admin" || node.data.job === "Super Admin"
          ? oddEven === true
            ? -7.48
            : 10.87
          : ySpacing + 200;

      // const x = initialX * xSpacing; // Adjust x for staggered rows
      // const y = initialY * ySpacing;

      // const x = initialX + col * xSpacing - (row % 2 === 0 ? 0 : xSpacing / 2); // Adjust x for staggered rows
      // const y = initialY + row * ySpacing;

      // Assign position to node
      return {
        ...node,
        position: { x, y },
      };
    });
  };

  // Generate dynamic positions
  const initialX = 0;
  const initialY = 0;
  const xSpacing = 200;
  const ySpacing = 200;
  const nodesWithPositions = generatePositions(
    nodes,
    initialX,
    initialY,
    xSpacing,
    ySpacing
  );

  const [hierArchyData, setHireArchyData] = useState([]);

  const getHierachy = async () => {
    try {
      const result = await action(API.GET_HIERARCHY, {
        companyId: companyId,
        employeeId: employee || null,
        listType: "lm",
      });
      setHirearchyDeatils(result.result);
      setHireArchyData(result.result);

      const subbEmployeeData = result?.result[0]?.subbEmployeeData ?? [];
      const nodesPositions = generatePositions(
        [
          {
            id: "2",
            type: "custom",
            data: {
              name: result?.result[0]?.employeeName,
              employeeId: result?.result[0]?.employeeId,
              job: result?.result[0]?.designation,
              emoji: "😎",
              // imageurl: "https://source.unsplash.com/300x400?logos",
            },
            // position: { x: 0, y: 200 },
          },
          ...subbEmployeeData.map((each, i) => ({
            id: `${i + 3}`,
            type: "custom",
            data: {
              name: each.employeeName,
              employeeId: each.employeeId,
              job: each?.designation,

              emoji: "😎",
              // imageurl: "https://source.unsplash.com/300x400?logos",
            },
            // position: { x: -100 * i, y: 400 + i * 5 },
          })),
        ],
        initialX,
        initialY,
        xSpacing,
        ySpacing
      );

      setNodes(nodesPositions);
      // setNodes([
      //   // {
      //   //   id: "1",
      //   //   type: "custom",
      //   //   data: {
      //   //     name: result?.result[0]?.employeeName,
      //   //     job: result?.result[0]?.designation,
      //   //     emoji: "😎",
      //   //     imageurl: "https://source.unsplash.com/300x400?logos",
      //   //   },
      //   //   position: { x: 0, y: 0 },
      //   // },
      //   {
      //     id: "2",
      //     type: "custom",
      //     data: {
      //       name: result?.result[0]?.employeeName,
      //       employeeId: result?.result[0]?.employeeId,
      //       job: result?.result[0]?.designation,

      //       emoji: "😎",
      //       // imageurl: "https://source.unsplash.com/300x400?logos",
      //     },
      //     position: { x: 0, y: 200 },
      //   },
      //   ...subbEmployeeData.map((each, i) => ({
      //     id: `${i + 3}`,
      //     type: "custom",
      //     data: {
      //       name: each.employeeNames,
      //       employeeId: each.employeeId,
      //       job: each?.designation,

      //       emoji: "😎",
      //       // imageurl: "https://source.unsplash.com/300x400?logos",
      //     },
      //     position: { x: -100 * i, y: 400 + i * 5 },
      //   })),
      // ]);
      setEdges([
        // {
        //   id: "1",
        //   source: "1",
        //   target: "2",
        //   animated: true,
        //   type: "smoothstep",
        //   label: "Cordova Educational Solutions",
        //   labelStyle: {
        //     fontSize: 22,
        //     fontWeight: "bold",
        //   },
        // },
        ...result.result.map((each, i) => ({
          id: `${i + 1}`,
          source: `${i + 1}`, //conition link
          target: `${i + 1}`,
          animated: true,
          type: "smoothstep",
          label: each.employeeName,
          labelStyle: {
            fontSize: 22,
            fontWeight: "bold",
          },
        })),
        ...subbEmployeeData.map((data, i) => ({
          id: `${i + 3}`,
          // id: "2",
          source: "2",
          target: `${i + 3}`,
          animated: true,
          type: "smoothstep",
          // label: data.employeeNames,
          labelStyle: {
            fontSize: 22,
            fontWeight: "bold",
          },
        })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(edges, "hjgkkglhgkj");

  const baseOffsetX = -600;
  const baseOffsetY = 500;

  const incrementalX = 100;
  const incrementalY = 100;

  const getHierachyEmployeeView = async (e) => {
    const result = await action(API.GET_HIERARCHY_EMPLOYEE_VIEW, {
      employeeId: e.employeeId,
      companyId: localStorageData.companyId,
    });
    const mergedArray = [
      ...hierArchyData[0]?.subbEmployeeData,
      ...result?.result,
    ];

    // hirearchyDetails
    // console.log(hirearchyDetails);
    if (hirearchyDetails) {
      const existingIds = nodes.map((node) => parseInt(node.id, 10));
      const maxId = Math.max(...existingIds);
      console.log(
        ...nodes,
        ...result?.result?.map((each, i) => ({
          id: `${maxId + i + 1}`,
          type: "custom",
          data: {
            name: each.firstName,
            employeeId: each.employeeId,
            job: each.designation,
            emoji: "😎",
            // imageurl: "https://source.unsplash.com/300x400?logos",
          },
          position: { x: -600 + i, y: 500 + i },
        }))
      );

      let nodesWithPosition;
      if (!result?.result) {
        nodesWithPosition = generatePositions(
          [
            ...nodes,
            ...result?.result?.map((each, i) => ({
              // id: `${i + 1 + nodes?.length}`,
              id: `${maxId + i + 1}`,
              type: "custom",
              data: {
                name: each.firstName,
                employeeId: each.employeeId,
                job: each.designation,
                emoji: "😎",
                // imageurl: "https://source.unsplash.com/300x400?logos",
              },
              // position: {
              //   x: baseOffsetX + i * maxId,
              //   y: baseOffsetY + i * maxId,
              // },
            })),
          ],
          initialX,
          initialY,
          xSpacing,
          ySpacing
        );
      } else {
        nodesWithPosition = generatePositions(
          [
            {
              id: "2",
              type: "custom",
              data: {
                name: hierArchyData[0]?.employeeName,
                employeeId: hierArchyData[0]?.employeeId,
                job: hierArchyData[0]?.designation,
                emoji: "😎",
                // imageurl: "https://source.unsplash.com/300x400?logos",
              },
              // position: { x: 0, y: 200 },
            },
            ...mergedArray.map((each, i) => ({
              id: `${i + 3}`,
              type: "custom",
              data: {
                name: each.employeeName,
                employeeId: each.employeeId,
                job: each?.designation,
                emoji: "😎",
                // imageurl: "https://source.unsplash.com/300x400?logos",
              },
              // position: { x: -100 * i, y: 400 + i * 5 },
            })),
          ],
          initialX,
          initialY,
          xSpacing,
          ySpacing
        );
      }

      // const nodesWithPosition = generatePositions(
      //   [
      //     ...nodes,
      //     ...result?.result?.map((each, i) => ({
      //       // id: `${i + 1 + nodes?.length}`,
      //       id: `${maxId + i + 1}`,
      //       type: "custom",
      //       data: {
      //         name: each.firstName,
      //         employeeId: each.employeeId,
      //         job: each.designation,
      //         emoji: "😎",
      //         // imageurl: "https://source.unsplash.com/300x400?logos",
      //       },
      //       // position: {
      //       //   x: baseOffsetX + i * maxId,
      //       //   y: baseOffsetY + i * maxId,
      //       // },
      //     })),
      //   ],
      //   initialX,
      //   initialY,
      //   xSpacing,
      //   ySpacing
      // );
      setNodes(nodesWithPosition);
      // setNodes([
      //   ...nodes,
      //   ...result?.result?.map((each, i) => ({
      //     // id: `${i + 1 + nodes?.length}`,
      //     id: `${maxId + i + 1}`,
      //     type: "custom",
      //     data: {
      //       name: each.firstName,
      //       employeeId: each.employeeId,
      //       job: each.designation,
      //       emoji: "😎",
      //       imageurl: "https://source.unsplash.com/300x400?logos",
      //     },
      //     position: {
      //       x: baseOffsetX + i * maxId,
      //       y: baseOffsetY + i * maxId,
      //     },
      //   })),
      // ]);

      if (!result?.result) {
        setEdges([
          ...edges,
          ...result?.result?.map((data, i) => ({
            id: `${maxId + i + 1}`,
            // id: "2",
            source: `${selectedAccordionItem.id}`,
            target: `${maxId + i + 1}`,
            // target: `${selectedAccordionItem.id}`,

            // target: `${selectedAccordionItem.id}`,
            animated: true,
            type: "smoothstep",
            // label: data.employeeNames,
            labelStyle: {
              fontSize: 22,
              fontWeight: "bold",
            },
          })),
        ]);
      } else {
        setEdges([
          ...hierArchyData.map((each, i) => ({
            id: `${i + 1}`,
            source: `${i + 1}`, //conition link
            target: `${i + 1}`,
            animated: true,
            type: "smoothstep",
            label: each.employeeName,
            labelStyle: {
              fontSize: 22,
              fontWeight: "bold",
            },
          })),
          ...mergedArray.map((data, i) => ({
            id: `${i + 3}`,
            // id: "2",
            source: "2",
            target: `${i + 3}`,
            animated: true,
            type: "smoothstep",
            // label: data.employeeNames,
            labelStyle: {
              fontSize: 22,
              fontWeight: "bold",
            },
          })),
        ]);
      }

      // setEdges([
      //   ...edges,
      //   ...result?.result?.map((data, i) => ({
      //     id: `${maxId + i + 1}`,
      //     // id: "2",
      //     source: `${selectedAccordionItem.id}`,
      //     target: `${maxId + i + 1}`,
      //     // target: `${selectedAccordionItem.id}`,

      //     // target: `${selectedAccordionItem.id}`,
      //     animated: true,
      //     type: "smoothstep",
      //     // label: data.employeeNames,
      //     labelStyle: {
      //       fontSize: 22,
      //       fontWeight: "bold",
      //     },
      //   })),
      // ]);
    }
  };

  // Update nodes with items count
  const nodesWithCount = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      itemCount: calculateNodeItemCount(toString(node.id), edges),
    },
  }));

  const onAdd = useCallback(() => {
    const containerRect = document
      .querySelector(".react-flow__renderer")
      .getBoundingClientRect(); // Get the bounding rectangle of the container

    const newNode = {
      // id: String(nodes.length + 1),
      // type: "custom",
      // data: {
      //   ...newNodeData,
      //   emoji: "🤔",
      //   imageurl: "https://randomuser.me/api/portraits/men/51.jpg",
      // },
      position: {
        x: containerRect.width / 3.5, // Set x position to the center of the container
        y: containerRect.height / 3.5, // Set y position to the center of the container
      },
    };
    // Calculate itemCount for the new node
    const itemCount = edges.filter((edge) => edge.source === newNode.id).length;

    // Add itemCount to the new node data
    newNode.data.itemCount = itemCount;

    // Add the new node to the nodes array
    setNodes((nds) => nds.concat(newNode));
    setDrawerVisible(false);
    setNewNodeData({ name: "", job: "" });
  }, [nodes, edges, newNodeData, setNodes, setDrawerVisible, setNewNodeData]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  console.log(nodes, "nodes=====");

  const defaultEdgeOptions = {
    type: "smoothstep",
    animated: true,
    style: {
      // stroke: `${primaryColor}30`,
    },
  };

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center gap-4">
          <ButtonClick
            buttonName="Employee View"
            icon={<PiUsers size={18} />}
          />
          <ButtonClick buttonName="Department View" />
        </div> */}
        <div className="flex items-center gap-4">
          {/* <SearchBox
            data={""}
            placeholder={t("Search_Employees")}
            // value={searchValue}
            // icon={<CiSearch className=" dark:text-white" />}
            className="mt-0 w-ful md:w-auto"
            error=""
            change={(value) => {
              // setSearchValue(value);
            }}
            onSearch={(value) => {
              // console.log(value);
              // setSearchFilter(value);
            }}
          /> */}
          {/* <ButtonClick
            BtnType="primary"
            buttonName="Save Changes"
            handleSubmit={onSave}
          /> */}
          {/* <ButtonClick >
            <PiDownloadSimple size={20} />
          </ButtonClick> */}
          <DownloadButton />
          {/* ADD NEW NODE WITH OPEN DRAWER BY CLICKINHG THIS BUTTON  */}
          {/* <Tooltip placement="topRight" title="Add New Employee">
            <ButtonClick handleSubmit={() => setDrawerVisible(true)}>
              <PiPlusCircle
                size={20}
                className="text-primaryalpha dark:text-white"
              />
            </ButtonClick>
          </Tooltip> */}
        </div>
      </div>

      <div className="h-[80vh] rounded-[20px] overflow-hidden">
        <ReactFlow
          nodes={nodesWithCount}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          connectionLineType={ConnectionLineType.SmoothStep}
          // onClick={() => {
          //   console.log("ghhhhhhhhhhhhhhhhhhh");
          // }}
          // defaultEdgeOptions={defaultEdgeOptions}
          nodeTypes={nodeTypes}
          fitView
          onInit={setRfInstance}
          className="bg-primaryalpha/[0.01] dark:bg-black zoom-10"
        >
          <Controls position="top-left" />
          <Background />
          <MiniMap className="hidden 2xl:block" />
          {/* <Controls position="top-right" /> */}
          <Panel position="top-right" className="flex flex-col gap-2">
            <ButtonClick
              className="h-full p-1.5 text-base bg-white 2xl:p-2 2xl:text-xl dark:bg-[#131827] dark:text-white"
              handleSubmit={() => zoomIn({ duration: 300 })}
            >
              <PiMagnifyingGlassPlus />
            </ButtonClick>
            <ButtonClick
              className="h-full p-1.5 text-base bg-white 2xl:p-2 2xl:text-xl dark:bg-[#131827] dark:text-white"
              handleSubmit={() => zoomOut({ duration: 300 })}
            >
              <PiMagnifyingGlassMinus />
            </ButtonClick>
            <ButtonClick
              className="h-full p-1.5 text-base bg-white 2xl:p-2 2xl:text-xl dark:bg-[#131827] dark:text-white"
              handleSubmit={() => fitView({ duration: 300 })}
            >
              <AiOutlineColumnWidth />
            </ButtonClick>
            {/* <button onClick={handleTransform}>pan to center(0,0,1)</button> */}
          </Panel>
        </ReactFlow>
      </div>
      <Drawer
        title="Add New Employee"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Input
          type="text"
          value={newNodeData.name}
          onChange={(e) =>
            setNewNodeData({ ...newNodeData, name: e.target.value })
          }
          placeholder="Employee Name"
          className="mt-2"
        />
        <Input
          type="text"
          value={newNodeData.job}
          onChange={(e) =>
            setNewNodeData({ ...newNodeData, job: e.target.value })
          }
          placeholder="Employee Role"
          className="mt-2"
        />
        <Button type="primary" onClick={onAdd} className="mt-2">
          Add Employee
        </Button>
      </Drawer>
    </div>
  );
};

// export default OrgChart;
// export default () => (
//   <ReactFlowProvider>
//     <OrgChart employee={employee} />
//   </ReactFlowProvider>
// );

const WrapperOrgChart = ({ employee }) => (
  <ReactFlowProvider>
    <OrgChart employee={employee} />
  </ReactFlowProvider>
);

export default WrapperOrgChart;

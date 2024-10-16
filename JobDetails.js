import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {getAllCandidatesByjobId,saveRecruitmentJobResumesStage } from "../Api1";
// import BoardData from "../../data/board.json";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Dropdown, Tooltip, Radio, Alert } from "antd";
import Breadcrumbs from "../common/BreadCrumbs";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import ButtonClick from "../common/Button";
import SearchBox from "../common/SearchBox";
import { FilterBtn } from "../common/FilterBtn";
import { useNavigate } from 'react-router-dom';

import User from "../../assets/images/user1.jpeg";
// ICONS
import { GoClock } from "react-icons/go";
import {
  PiArrowSquareOut,
  PiBookmarkSimpleFill,
  PiCalendarFill,
  PiDotsThreeOutlineFill,
  PiDotsThreeOutlineVerticalFill,
  PiMapPinFill,
  PiNavigationArrowFill,
  PiTrashBold,
  PiTreeStructureFill,
  PiUsersThreeFill,
} from "react-icons/pi";
import {
  FcEngineering,
  FcHighPriority,
  FcMms,
  FcProcess,
} from "react-icons/fc";
import { BsGrid, BsListUl } from "react-icons/bs";


import Createjob from "./Createjob";
import { ColumnChooserSelection } from "devextreme-react/data-grid";
import JobCard from "../common/JobCard";
import FlexCol from "../common/FlexCol";
import TableAnt from "../common/TableAnt";

const customColors = [
  "#00B23C",
  "#FE4949",
  "#4437CC",
  "#FF8A00",
  "#4976FE",
  "#E0115F",
  "#DFA510",
  "#E546D5",
  "#00E096",
  "#884DFF",
  "#FF4DB8",
];

const JobDetails = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
  const [viewType, setViewType] = useState("grid");
   // Initial view type
  const breadcrumbItems = [{ label: "Jobs",
  url:"/AllJobs" }, { label: "Assign stages" }];
  const handleshow =()=>setShow(true);
  const handleClose =()=>setShow(false)
  const [show, setShow] = useState(false);
  const gridListoptions = [
    {
      label: <BsListUl />,
      value: "list",
    },
    {
      label: <BsGrid />,
      value: "grid",
    },
  ];

  const onChangeView = (e) => {
    setViewType(e.target.value);
    // Additional logic if needed when view type changes
  };
  const customMessage = (
    <p>
      <span>
        <strong>Shift + Mouse Scroll Wheel</strong>
      </span>
      <span> to scroll horizontally</span>
    </p>
  );
  return (
    <div className="flex flex-col gap-5">
      {/* BREADCRUMB AND BUTTONS */}
      <div className="flex flex-col items-baseline justify-between gap-4 lg:items-center lg:gap-0 lg:flex-row">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex gap-2.5 items-center">
          <Link className="flex gap-2">
            <span className="!text-primary para">View career page</span>{" "}
            <PiArrowSquareOut size={15} className="dark:text-white" />
          </Link>
          {/* <ButtonClick buttonName="Edit" /> */}
          {/* <ButtonClick BtnType="add" buttonName="Create a Job"   handleSubmit={() => {
            setShow(true);
          }}
          ></ButtonClick> */}
        </div>
      </div>
      {show && (
         <motion.div initial="hidden" animate="visible" >
        <Createjob
        open={show}
        close={(e) => {
          setShow(e);
          
          handleClose();

        }}
       
       
          // updateId={updateId}
          refresh={() => {
            // getLocationList();
          }}
          // openPolicy={openPop} 
          // updateId={updateId}
        />
        </motion.div>
      )}
      {/* FILTER SECTON AND DETAILS  */}
      <div className="flex flex-col items-baseline justify-between gap-4 lg:items-center lg:gap-0 lg:flex-row">
        <div className="flex flex-wrap items-center gap-7">
          <div className="px-2.5 py-1 bg-emerald-500 bg-opacity-10 dark:bg-opacity-50 rounded-[18px] gap-[7px] vhcenter">
            <div className="w-2.5 h-2.5 relative bg-emerald-500 rounded-[5px] border border-white shrink-0" />
            <p className="para dark:text-white !font-normal">Open</p>
          </div>
          <div className="gap-2 vhcenter ">
            <PiUsersThreeFill size={20} className="text-[#DFDFDF]" />
            <p className="para !text-black dark:!text-white !font-normal">
              250
            </p>
          </div>
          <div className="gap-2 vhcenter ">
            <PiTreeStructureFill size={20} className="text-[#DFDFDF]" />
            <p className="para !text-black dark:!text-white !font-normal">
              General
            </p>
          </div>
          <div className="gap-2 vhcenter ">
            <PiCalendarFill size={20} className="text-[#DFDFDF]" />
            <p className="para !text-black dark:!text-white !font-normal">
              Jan 12, 2024
            </p>
          </div>
          <div className="gap-2 vhcenter ">
            <PiNavigationArrowFill size={20} className="text-[#DFDFDF]" />
            <p className="para !text-black dark:!text-white !font-normal">
              Remote
            </p>
          </div>
          <div className="gap-2 vhcenter ">
            <PiMapPinFill size={20} className="text-[#DFDFDF]" />
            <p className="para !text-black dark:!text-white !font-normal">
              Dubai,UAE
            </p>
          </div>
          <div className="vhcenter gap-2.5">
            <img
              className="w-6 h-6 border-2 rounded-full border-stone-50"
              src={User}
            />
            <div className="para !text-black dark:!text-white !font-normal">
              Cody Fisher
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <SearchBox
            className="text-[#667085]"
            placeholder="Search candidate"
          />
          <FilterBtn colors={customColors} />
          <Radio.Group
            options={gridListoptions}
            onChange={onChangeView}
            value={viewType}
            optionType="button"
            className="flex items-center py-1.5 h-full"
            size={isSmallScreen ? "" : "large"}
          />
        </div>
      </div>

      <Alert
        message={customMessage}
        type="info"
        showIcon
        className="hidden w-fit lg:flex"
      />

      {/* MAIN CONTENT BASED ON DRAG VIEW AND LIST VIEW */}
      {viewType === "grid" ? (
        // Render grid view components
        <DragView />
      ) : (
        // Render list view components
        <ListView
        
        />
      )}
    </div>
  );
};

const DragView = () => {
  

  const[candidatelist,setcandidatelist]=useState([])
  const[Workflow,setWorkflow]=useState([])
  // const selectedDataId = useSelector((state) => state.dataId.selectedDataId);
  const selectedDataId = localStorage.getItem('selectedDataId');
  const jobId = selectedDataId
  const [boardData, setBoardData] = useState([]);
  const getCandidatesById = async () => {
    try {
      const response = await getAllCandidatesByjobId(jobId);
      
      setBoardData(response.result.map((item) => ({
        id: item.stageId,
        name: item.stageName,
        items: item.stageCandidates.map((candidate)=>({
          id:candidate.resumeId,
          name:candidate.candidateName,
          image:candidate.image,
        }))
      })));
       
      // response.result.forEach((item) => {
      //   item.stageCandidates.forEach((candidate) => {
      //     // Call saveRecruitmentJobResumesStage with jobId, stageId, and resumeId
      //     saveRecruitmentJobResumesStage(jobId, item.stageId, candidate.resumeId);
      //   });
      // });
    } catch (error) {
      console.error('Error updating workflow ID:', error);
    }
  };



  // const getCandidatesById = async () => {
  //   try {
  //     const response = await getAllCandidatesByjobId(jobId);
  //     setcandidatelist(response.result);
  //     // boardData.push( Workflow.map((workflowItem) => ({
  //     //   id: workflowItem.id,
  //     //   name: workflowItem.name,
  //     //   items: response?.result?.map((candidate) => ({
  //     //     id: candidate.jobResumeMappingId,
  //     //     name: candidate.candidateName,
  //     //     image: candidate.candidateEmail
  //     //   }))
  //     // })));

  //     // setBoardData(newBoardData);
  //   } catch (error) {
  //     console.error('Error updating workflow ID:', error);
  //   }
  // };

    useEffect(() => {

        // Create the desired array structure
        // getRecruitmentWorkflow()
        getCandidatesById(jobId)
       


      
    }, [jobId]);
    
    useEffect(()=>{
      // const newBoardData = Workflow.map((workflowItem) => ({
      //   id: workflowItem.id,
      //   name: workflowItem.name,
      //   items: candidatelist.map((candidate) => ({
      //     id: candidate.jobResumeMappingId,
      //     name: candidate.candidateName,
      //     image: candidate.candidateEmail
      //   }))
      // }));

      // setBoardData(Workflow.map((workflowItem) => ({
      //   id: workflowItem.id,
      //   name: workflowItem.name,
      //   items: candidatelist.map((candidate) => ({
      //     id: candidate.jobResumeMappingId,
      //     name: candidate.candidateName,
      //     image: candidate.candidateEmail
      //   }))
      // })));
    },[candidatelist])
  // const BoardData=[
  //   {
  //     "id" : "",
  //     "name": "",
  //     "items": [
  //       {
  //         "id": "",
  //         "name": "",
  //         "image": ""
  //       }
        
  //     ]
  //   }
  
  //  ]
  
  
  const [ready, setReady] = useState(false);
 
  const [draggingPosition, setDraggingPosition] = useState(null);
  

  const [currentStageId, setCurrentStageId] = useState(null);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const resumeId = currentResumeId
  const stageId =currentStageId


  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }
  }, []);

  const JobResumesStage = async (jobId,stageId,resumeId) => {
    try {
      const response = await saveRecruitmentJobResumesStage(jobId, stageId, resumeId);

    } catch (error) {
      console.error('Error updating workflow ID:', error);
    }
  };
 useEffect(()=>{
  JobResumesStage(jobId,stageId,resumeId)
 },[jobId,stageId,resumeId])
 const onDragEnd = (re) => {
  if (!re.destination) return;
  setBoardData((prevData) => {
    const newBoardData = [...prevData];
    const sourceStageId = newBoardData[re.source.droppableId].id;
    const destinationStageId = newBoardData[re.destination.droppableId].id;

    const dragItem =
      newBoardData[re.source.droppableId].items[re.source.index];

    setCurrentResumeId(destinationStageId);
    setCurrentStageId(dragItem.id);

    newBoardData[re.source.droppableId].items.splice(re.source.index, 1);
    newBoardData[re.destination.droppableId].items.splice(
      re.destination.index,
      0,
      dragItem
    );

    return newBoardData;
  });

  // Reset dragging position after drop
  setDraggingPosition(null);
};
  const onDragOver = (snapshot) => {
    if (snapshot.isDraggingOver) {
      // Set the top position of the dropping div based on clientY
      const topPosition = snapshot.clientOffset ? snapshot.clientOffset.y : 0;
      setDraggingPosition(topPosition);
    }
  };

  const colors = boardData.map(
    (_, index) => customColors[index % customColors.length]
  );

  const items = [
    {
      label: "Automate",
      key: "0",
      icon: <FcEngineering size={20} />,
    },
    {
      label: "Message",
      key: "1",
      icon: <FcMms size={20} />,
      children: [
        {
          key: "1-1",
          label: "SMS",
        },
        {
          key: "1-2",
          label: "Email",
        },
      ],
    },
  ];
  
  return (
    <div className="flex flex-col gap-5">
      {/* BREADCRUMB AND BUTTONS */}
      {/* <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex gap-2.5 items-center">
          <Link className="flex gap-2">
            <span className="!text-primary para">View career page</span>{" "}
            <PiArrowSquareOut size={15} className="dark:text-white" />
          </Link>
          <ButtonClick buttonName="Edit" />
          <ButtonClick BtnType="add" buttonName="Create a Job"   handleSubmit={() => {
            setShow(true);
          }}
          ></ButtonClick>
        </div>
      </div> */}
      

      {/* FILTER SECTON AND DETAILS  */}
      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-7"> */}
          {/* <div className=" flex-col justify-start items-start gap-2.5 inline-flex"> */}
          {/* <div className="w-[70px] h-[26px] px-2.5 py-1 bg-emerald-500 bg-opacity-10 dark:bg-opacity-50 rounded-[18px] gap-[7px] vhcenter">
            <div className="w-2.5 h-2.5 relative bg-emerald-500 rounded-[5px] border border-white shrink-0" />
            <p className="para dark:text-white !font-normal">Open</p>
          </div>
          <div className="gap-2 vhcenter ">
            <PiUsersThreeFill size={20} className="text-[#DFDFDF]"/>
            <p className="para dark:text-white !font-normal">250</p>
          </div>
          <div className="vhcenter gap-2.5">
            <img
              className="w-6 h-6 border-2 rounded-full border-stone-50"
              src={User}
            />
            <div className="para dark:text-white !font-normal">Cody Fisher</div>
          </div>
          {/* </div> */}
        {/* </div>
        <div className="flex">
          <SearchBox
            className="text-[#667085]"
            placeholder="Search candidate"
          />
        </div>
      </div> */} 

      {/* DRAG N DROP SECTION START  */}
      <div className="flex flex-col lg:h-[85vh] overflow-auto">
        {ready && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex w-full h-full gap-3">
              {boardData.map((board, bIndex) => (
                <div key={board.name} className="flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-2 p-3 bg-white border rounded-md w-[270px] 2xl:w-[303px] border-borderlight dark:border-borderdark dark:bg-secondaryDark dark:text-white">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div
                        className="w-4 h-4 overflow-hidden rounded-full vhcenter shrink-0"
                        style={{ backgroundColor: `${colors[bIndex]}30` }}
                      >
                        <span
                          className=" w-2.5 h-2.5 rounded-full "
                          style={{ backgroundColor: colors[bIndex] }}
                        ></span>
                      </div>
                      <p className="!font-semibold h6 !text-black dark:!text-white truncate">
                        {board.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-[26px] h-[26px] p-1 bg-violet-100 rounded-md flex-col justify-center items-center gap-2.5 inline-flex">
                        <p className=" text-gray-900 text-[13px] font-['SF Pro'] leading-[18.20px]">
                          {board?.items?.length}
                        </p>
                      </div>
                      <Dropdown
                        menu={{
                          items,
                        }}
                        placement="bottomRight"
                      >
                        <a
                          onClick={(e) => e.preventDefault()}
                          className="p-1 border border-transparent rounded cursor-pointer text-primary hover:border-primary"
                        >
                          <PiDotsThreeOutlineFill className="text-xl" />
                        </a>
                      </Dropdown>
                    </div>
                  </div>
                  <Droppable droppableId={bIndex.toString()} key={bIndex}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`bg-[#F7FBFF] dark:bg-lightdark h-full flex flex-col relative overflow-hidden p-1.5 border border-solid border-borderlight dark:border-borderdark 
                        2xl:w-[303px] w-[270px] rounded-lg
                      ${
                        snapshot.isDraggingOver &&
                        "bg-[#FBF7F1] dark:bg-[#1B1B1B]"
                      }`}
                        onDragOver={() => onDragOver(snapshot)}
                      >
                        <div
                          className="flex flex-col h-auto overflow-x-hidden overflow-y-auto"
                          style={{ maxHeight: "calc(100vh - 50px)" }}
                        >
                          {
                            board.items.map((item, iIndex) => (
                              <CardItem
                                key={item.id}
                                data={item}
                                index={iIndex}
                                color={colors[bIndex]}
                                className="m-3"
                              />
                            ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
        {/* Dropping div outside the DragDropContext */}
        {draggingPosition !== null && (
          <div
            className="dropping-div"
            style={{ top: `${draggingPosition}px` }}
          >
            Drop here to place the item
          </div>
        )}
      </div>
    </div>
  );
};

const CardItem = ({ data, index, color }) => {
  const [bookmarkState, setBookmarkState] = useState({});
  const navigate = useNavigate();

  const toggleBookmark = (cardId) => {
    setBookmarkState((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };
  const navigateToCandidateProfile = () => {
    // Set data.id as the selectedId in localStorage
    localStorage.setItem("selectedDataId", data.id);
    
    // Navigate to candidateprofile page with data.id
    navigate(`/candidateprofile/${data.id}`)
    
    // Optionally, update the state with the selectedId
    
  };
  const items = [
    {
      label: "Disqualify",
      key: "0",
      icon: <FcHighPriority size={20} />,
    },
    {
      label: "Change Stage",
      key: "1",
      icon: <FcProcess size={20} />,
      children: [
        {
          key: "1-1",
          label: "Sourced",
        },
        {
          key: "1-2",
          label: "Applied",
        },
        {
          key: "1-3",
          label: "Personal Interviews",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      label: "Delete this Applicant",
      key: "3",
      icon: <PiTrashBold size={20} className="text-red-600 " />,
    },
  ];

  const firstLetter = data?.name ? data.name.charAt(0).toUpperCase() : "";
 
 
 
 
  return (
    <Draggable
      index={index}
      draggableId={data.id.toString()}
      isDragDisabled={bookmarkState[data.id]}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // style={{
          //   ...provided.draggableProps.style,
          //   transform: snapshot.isDragging
          //     ? `${provided.draggableProps.style.transform} rotate(-5.827deg)`
          //     : provided.draggableProps.style.transform,
          // }}
          className={`${
            snapshot.isDragging &&
            "shadow-dragShadow dark:shadow-dragShadowDark"
          } p-3 mb-1.5 bg-white border rounded-md ${
            bookmarkState[data.id] ? " cursor-default" : "cursor-grab"
          }  border-borderlight dark:border-borderdark dark:bg-secondaryDark dark:text-white`}
          onClick={navigateToCandidateProfile}
        >
          <div className="flex flex-col gap-1 2xl:gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`2xl:w-8 2xl:h-8 w-6 h-6 overflow-hidden rounded-full vhcenter`}
                style={{
                  backgroundColor: `${data?.image ? "" : color}`,
                }}
              >
                {data?.image ? (
                  <img
                    src={data?.image}
                    alt={data?.image}
                    className="object-cover object-center w-full h-full"
                  />
                ) : (
                  <span className="h6 !text-white !font-medium leading-none">
                    {firstLetter}
                  </span>
                )}
              </div>
              <p className="!font-semibold h6 !text-black dark:!text-white">
                {" "}
                {data?.name && data?.name}
              </p>
            </div>
            <div className="flex justify-between gap-3">
              <div className="flex items-center gap-2">
                <GoClock className="text-lg 2xl:text-2xl opacity-30" />
                <p className="para !text-black !font-normal dark:!text-white">
                  4d ago
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip
                  title={`${
                    bookmarkState[data.id]
                      ? "Unsave Candidate"
                      : "Save Candidate"
                  }`}
                  color={color}
                  key={color}
                >
                  <span
                    className={` p-1 ${
                      bookmarkState[data.id]
                        ? "text-[#15A61B]"
                        : "text-[#DFDFDF]"
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark(data.id);
                    }}
                  >
                    <PiBookmarkSimpleFill className="text-xl" />
                  </span>
                </Tooltip>

                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="p-1 border border-transparent rounded cursor-pointer text-primary hover:border-primary"
                  >
                    <PiDotsThreeOutlineVerticalFill className="text-xl" />
                  </a>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const ListView = () => {
  
  
  const selectedDataId = localStorage.getItem('selectedDataId');
  const[stageId,setStageId]=useState(null)
  const jobId = selectedDataId
  const [boardData, setBoardData] = useState([]);
  const getCandidatesById = async () => {
    try {
      const response = await getAllCandidatesByjobId(jobId);
      
      setBoardData(response.result.map((item) => ({
        id: item.stageId,
        title:item.stageName,
        items: item.stageCandidates.map((candidate)=>({
          id:candidate.resumeId,
          name:candidate.candidateName,
          image:candidate.image,
          contact:candidate.candidateContact,
          source:candidate.candidateSource,
          appliedDate:candidate.createdOn,
          stageName: item.stageName,
        }))
      })));
       
     
      // response.result.forEach((item) => {
      //   item.stageCandidates.forEach((candidate) => {
      //     // Call saveRecruitmentJobResumesStage with jobId, stageId, and resumeId
      //     saveRecruitmentJobResumesStage(jobId, item.stageId, candidate.resumeId);
      //   });
      // });
    } catch (error) {
      console.error('Error updating workflow ID:', error);
    }
  };
  const selectedStageItems = boardData.find((board) => board.id === stageId)?.items || [];
  useEffect(()=>{
    getCandidatesById(jobId)
    
  },[jobId])
  const handleSelectCard = (selectedStageId) => {
    // Handle the selected stageId in your parent component
    setStageId(selectedStageId);
  };
  
  const header = [
    {
      CandidateProfile: [
        {
          id: 1,
          title: "NAME",
          value: "name",
        },
        {
          id: 2,
          title: "CONTACT",
          value: "contact",
        },
        {
          id: 3,
          title: "stage",
          value: "stageName",
        },

        {
          id: 4,
          title: "source",
          value: "source",
         
        },
        {
          id: 5,

          title: "applied date",
          value: "appliedDate",
         
        },
        {
          id: 7,
          title: "action",
          value: "action",
          dotsVertical: true,
        },
        
       
      ],
    },
  ];
  
  return (
  
  <FlexCol>
  <div>

  
  <JobCard 
  options={boardData}
  selectcard={handleSelectCard}
  />
</div>
<div>

<TableAnt 
header={header} 
path='CandidateProfile' 
actionID="resumeId"
data={selectedStageItems}

/>
</div>

</FlexCol>

)};

export default JobDetails;

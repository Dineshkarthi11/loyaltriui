import React, { useEffect, useState } from 'react'
import { PiBookmarkSimpleLight, PiDownloadSimple, PiPuzzlePieceLight, PiStack, PiStackSimple, PiThumbsUp } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import Heading from '../common/Heading';
import TableAnt from '../common/TableAnt';
import ButtonClick from '../common/Button';
import AssetRecoveringModal from './AssetRecoveringModal';
import API, { action } from '../Api';


export default function AssetRecovering() {
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery({ maxWidth: 1439 });
    const [openPop, setOpenPop] = useState("");
    const [show, setShow] = useState(false);
    const primaryColor = localStorage.getItem("mainColor");
    const companyId = localStorage.getItem("companyId");
    const [employeelist,setEmployeeList] = useState([])
    const[updateId,setupdateId]= useState("") 
    const[offboardingId,setoffboardingId] = useState("")
    const [bordingcounts, setBordingcounts] = useState("");
    
    const header = [
        {
            Employee_Lists: [
                {
                    id: 1,
                    title: t("Employee Name"),
                    value: ["firstName", "employeeId"],
                    flexColumn: true,
                    logo: true,
                    bold: true,
                },
                {
                    id: 2,
                    title: t("Designation"),
                    value: "designation",
                },
                {
                    id: 3,
                    title: "Offboarding Status",
                    value: "offBoardingStatus",
                    status: true,
                    colour: "colour",
                  },

                {
                    id: 4,
                    title: t("Asset Count"),
                    value: "assetCount",
                    progressBar: true,
                    progressType: 'circle',
                    strokeColor: '#9C77F7',
                    size:50,
                    
                },
                {
                    id: 5,
                    title: t("Seperation"),
                    value: "seperationMode",
                },
                {
                    id: 6,
                    title: "",
                    value: "assetCount",
                    assetRecoveredCount:"assetRecoveredCount",
                    assetrecovery:true
                    
                },
            ],
        },
    ];

    const [cardData, setCardData] = useState([
        {
            icon: <PiStack className='text-[#EB7100]' />,
            bgcolor: "bg-[#ffe5cc]",
            title: "Pending",
            value: "2",
            text: "employees"
        },
        {
            icon: <PiThumbsUp className='text-primary' />,
            bgcolor: "bg-primaryalpha/5",
            title: "Initiated",
            value: "50",
            text: "employees"
        },
      
        {
            icon: <PiThumbsUp className='text-[#027A48]' />,
            bgcolor: "bg-[#E5FCEE]",
            title: "Completed",
            value: "3",
            text: "employees"
        }
    ])

    // const dummyData = [
    //     {
    //         id: 1,
    //         title: "Mae Griffin",
    //         logo: "https://randomuser.me/api/portraits/women/36.jpg",
    //         employeeId: "2204",
    //         designation: "Developer",
    //         status: "On Hold",
    //         seperation: "Voluntary",
    //         assetCount: 0,
    //         assetRecovered: 0,
           
    //         isRegularizationNeeded: 1
    //     },
    //     {
    //         id: 2,
    //         title: "Mable Reyes",
    //         logo: "https://randomuser.me/api/portraits/men/37.jpg",
    //         employeeId: "4578",
    //         designation: "Developer",
    //         status: "Completed",
    //         seperation: "Voluntary",
    //         assetCount: 3,
    //         assetRecovered: 2,
            
    //         isRegularizationNeeded:1
    //     },
    //     {
    //         id: 3,
    //         title: "Mitchell Gregory",
    //         logo: "https://randomuser.me/api/portraits/women/25.jpg",
    //         employeeId: "1799",
    //         designation: "Developer",
    //         status: "Asset Pending",
    //         seperation: "Voluntary",
    //         assetCount: 2,
    //         assetRecovered: 1,
           
    //         isRegularizationNeeded: 1
    //     },
    //     {
    //         id: 4,
    //         title: "Winifred Wilson",
    //         logo: "https://randomuser.me/api/portraits/men/9.jpg",
    //         employeeId: "4090",
    //         designation: "Developer",
    //         status: "Initiated",
    //         seperation: "Voluntary",
    //         assetCount: 1,
    //         assetRecovered: 0,
            
    //         isRegularizationNeeded: 1
    //     },
    //     {
    //         id: 5,
    //         title: "Jeremiah Perkins",
    //         logo: "https://randomuser.me/api/portraits/women/20.jpg",
    //         employeeId: "1034",
    //         designation: "Developer",
    //         status: "Asset Recovered",
    //         seperation: "Voluntary",
    //         assetCount: 4,
    //         assetRecovered: 1,
          
    //         isRegularizationNeeded: 1
    //     },
    //     {
    //         id: 6,
    //         title: "Aaron Frazier",
    //         logo: "https://randomuser.me/api/portraits/men/28.jpg",
    //         employeeId: "2647",
    //         designation: "Manager",
    //         status: "Draft",
    //         seperation: "Voluntary",
    //         assetCount: 6,
    //         assetRecovered: 2,
           
    //         isRegularizationNeeded: 1
    //     }
    
    // ];
    const getEmployeeBoradinglist = async () => {
        try {
          const result = await action(
            API.GET_OFFBOARDING_getEmployeeOffBoardingList,
            {
              companyId: companyId,
              offBoardingStatusId:1,
              assetrecovery:1

            }
          );
    
          // console.log(result.result,"Employeelist");
          setEmployeeList(result.result);
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
        getEmployeeBoradinglist();
      }, []);
      const getemployeeOffBoardingCounts = async () => {
        try {
          const result = await action(
            API.GET_OFFBOARDING_employeeOffBoardingCounts,
            {
              companyId: companyId,
            }
          );
          // console.log(result);
          setBordingcounts(result.result);
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
        getemployeeOffBoardingCounts();
      }, []);
      useEffect(() => {
        if (bordingcounts) {
          setCardData(
            cardData.map((card, index) => {
              const responseKeys = [
                "ffPending",
                "initiated",
                "relieved",
              ];
              return {
                ...card,
                value: bordingcounts[responseKeys[index]],
              };
            })
          );
        }
      }, [bordingcounts]);

    return (
        <div className={`  w-full flex flex-col gap-6 `}>
            <div className="flex flex-col justify-between gap-6 lg:items-center lg:flex-row">
                <Heading
                    title='Asset Recovering'
                    description='Efficiently manage the offboarding process, ensuring smooth transitions for departing employees and compliance with company policies.'
                />

                <div className="flex flex-col xss:flex-row sm:items-center gap-4">
                    {/* <ButtonClick
                        handleSubmit={() => {
                            setOpenPop("assetRecoveringModal");
                            setShow(true);
                        }}
                        buttonName={t(`Asset Recovery Report`)}
                        icon={<PiDownloadSimple />}
                    /> */}
                    {/* <ButtonClick
                        BtnType="add"
                        handleSubmit={() => {
                            setOpenPop("offboarding");
                            setShow(true);
                        }}
                        buttonName="Initiate Offboarding"
                    >
                    </ButtonClick> */}
                </div>
            </div>

            <div className='grid  grid-cols-1 xss:grid-cols-2 sm:grid-cols-3 gap-4'>
                {cardData.map((item, index) => (
                    <div key={index} className='borderb rounded-lg p-4 h-[119px] dark:text-white dark:bg-dark'>
                        <div className='flex flex-col gap-2'>
                            <div className={`vhcenter size-[30px] rounded-full shrink-0 dark:bg-[#07A86D]/20 ${item.bgcolor}`}>{item.icon}</div>
                            <div className='font-semibold text-[10px] 2xl:text-xs'>{item.title}</div>
                            <div className='flex items-center gap-2'>
                                <div className='font-semibold  text-2xl 2xl:text-3xl'>{item.value}</div>
                                <div className='text-primary text-xs 2xl:text-[14px]'>{item.text}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <TableAnt
                header={header}
                data={employeelist}
                path="Employee_Lists"
                actionID="employeeId"
                // handleSubmit={() => {
                //     setOpenPop("assetRecoveringModal");
                //     setShow(true);
                // }}
                clickDrawer={(e,actionId,text)=>{
                   
                    setShow(true);
                    setOpenPop("assetRecoveringModal");
                    setupdateId(actionId)
                    setoffboardingId(text.offboardingId)
                }}
                
            />


            {openPop === "assetRecoveringModal" && show && (
                <AssetRecoveringModal
                    open={show}
                    updateId={updateId}
                    close={(e) => {
                        setShow(e);
                        setOpenPop("");
                    }}
                    offboardingId={offboardingId}
                    refresh={()=>{getEmployeeBoradinglist()}}
                />
            )}

        </div>
    )
}

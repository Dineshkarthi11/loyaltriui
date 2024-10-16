import React, { useRef, useState } from "react";
import company_img from "../../assets/images/Rectangle 363.png";
import Arrow_Top from "../../assets/images/Vector.svg";
import Arrow_Bottom from "../../assets/images/Vector_bottom.svg";
// import Overlay from "react-bootstrap/Overlay";
import { PiDotOutlineFill, PiDotsSixVerticalBold } from "react-icons/pi";
import { useSelector } from "react-redux";

export default function OrganisactionMenu() {
  const layout = useSelector((state) => state.layout.value);
  const [company, setCompany] = useState({
    image: company_img,
    title: "Cordova Solutions",
    members: "Team plan",
  });
  //   const [companyImage,setCompanyImage]=useState()
  //   const [title,setTitle]=useState()
  //   const []
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const companyList = [
    {
      id: 1,
      title: "Cordova  Solutions",
      team: "Team plan",
      members: "4.5K members",
      img: company_img,
    },
    {
      id: 2,
      title: "Cordova Solutions",
      team: "persional plan",
      members: "230 members",
      img: company_img,
    },
    {
      id: 3,
      title: "Cordova Educational ",
      team: "Team plan",
      members: "450 members",
      img: company_img,
    },
  ];

  return (
    <div className="">
      {/* <div className="company_list flex items-center justify-between ">
          <div className="flex items-center">
            <img src={company_img} alt="" className="p-2" />
            <div className="block ">
              <p className="mb-0 text-sm">Cordova Cloud</p>
              <p className="mb-0 text-xs opacity-50">230 members</p>
            </div>
          </div>
          <div className=" pr-2">
            <img src={Arrow_Top} alt="" className="pb-1 px-2" />
            <img src={Arrow_Bottom} alt="" className="px-2" />
          </div>
        </div> */}
      <>
        <button ref={target} onClick={() => setShow(!show)}>
          <div className="company_list dark:bg-ash flex items-center justify-between group ">
            <div className="flex items-center">
              <img src={company.image} alt="" className="p-2" />
              <div className="block ">
                <p className="mb-0 text-xs p-0 group-hover:text-white  dark:text-white">
                  {company.title}
                </p>
                <p className="mb-0 text-xs opacity-50 dark:text-white">
                  {company.members}
                </p>
              </div>
            </div>
            <div className=" pr-2">
              <img src={Arrow_Top} alt="" className="pb-1 px-2" />
              <img src={Arrow_Bottom} alt="" className="px-2" />
            </div>
          </div>
        </button>
        {/* <Overlay
          target={target.current}
          show={show}
          placement={layout === "ltr" ? "right" : "left"}
        >
          {({
            placement: _placement,
            arrowProps: _arrowProps,
            show: _show,
            popper: _popper,
            hasDoneInitialMeasure: _hasDoneInitialMeasure,
            ...props
          }) => (
            <div
              {...props}
              // style={{
              //   position: 'absolute',
              //   left:20,
              //   backgroundColor: 'rgba(255, 100, 100, 0.85)',
              //   padding: '2px 10px',
              //   color: 'white',
              //   borderRadius: 3,
              //   ...props.style,
              // }}
              className="z-50 dark:bg-ash"
            >
              <div className=" m-7 block rounded-xl dark:bg-ash bg-[#f4f4f4] p-2 ">
                {companyList.map((each, i) => (
                  <div
                    key={i}
                    className=" flex items-center justify-between cursor-pointer "
                    onClick={() => {
                      setCompany({
                        image: each.img,
                        title: each.title,
                        members: each.members,
                      });
                      setShow(!show);
                    }}
                  >
                    <div className="flex items-center m-2">
                      <PiDotsSixVerticalBold className="mr-2 text-xl text-[#d6d6d6] " />
                      <img
                        src={each.img}
                        alt=""
                        className="p-1 bg-slate-100 rounded-xl"
                      />
                      <div className="block px-2 ">
                        <p className="mb-0 text-sm font-Graphik">
                          {each.title}
                        </p>
                        <div className="flex">
                          <p className="mb-0 text-sm opacity-50 font-Graphik">
                            {each.team}
                          </p>
                          <PiDotOutlineFill className="mb-0 text-2xl opacity-40 " />
                          <p className="mb-0 text-sm opacity-50">
                            {each.members}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Overlay> */}
      </>
    </div>
  );
}

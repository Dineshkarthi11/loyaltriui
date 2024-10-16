import { useState } from "react";
// import Collapse from "react-bootstrap/Collapse";
import { AiOutlineHome } from "react-icons/ai";

import Arrow_Top from "../../assets/images/Vector.svg";
import Arrow_Bottom from "../../assets/images/Vector_bottom.svg";
import { Link } from "react-router-dom";

function Menus({ subMenus }) {
  const [menuOne, setMenuOne] = useState(false);
  const [menuTwo, setMenuTwo] = useState(false);

  const [open, setOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);

  return (
    <>
      {/* <div className="">
  
        <button
              onClick={(e) => {
                setMenuOne(!menuOne);
                // console.log(e);
              }}
              aria-controls="example-collapse-text"
              aria-expanded={menuOne}
              className=" hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 p-2 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:hs-accordion-active:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              General
              {menuOne ? (
                <img
                  src={Arrow_Top}
                  className="ms-auto block w-3 h-3 mr-2 text-gray-600 "
                  alt=""
                />
              ) : (
                <img
                  className="ms-auto block w-3 h-3 mr-2 text-gray-600 "
                  src={Arrow_Bottom}
                  alt=""
                />
              )}
            </button>
            <Collapse in={menuOne}>
              <div id="example-collapse-text">
                {subMenus?.map((each) => (
                  <div className=" cursor-pointer ms-auto flex mb-2 items-center hover:bg-primary active:bg-primary focus:bg-primary focus:text-white hover:text-white p-2 rounded-lg">
                    <AiOutlineHome className="mx-2" />
                    <span>{each.title}</span>
                  </div>
                ))}
              </div>
            </Collapse>
      </div> */}
      {/* <Button
      onClick={() => setOpen(!open)}
      aria-controls="example-collapse-text"
      aria-expanded={open}
    >
      click
    </Button>
    <Collapse in={open}>
      <div id="example-collapse-text">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident.
      </div>
    </Collapse> */}
      {subMenus?.map((each, i) => (
        <>
          <button
            key={i}
            onClick={() => {
              // setMenuTwo(!menuTwo);
              setMenuTwo(each.title);
              // console.log(menuTwo);
            }}
            aria-controls="example-collapse-text"
            aria-expanded={menuTwo}
            className={`flex justify-between items-center w-full ${
              each.title !== menuTwo ? "pb-2 " : ""
            } px-2 dark:text-white text-[11px] opacity-50 uppercase font-Graphik`}
            // style={{ fontSize: "16px", opacity: 0.5 }}
          >
            {/* <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> */}
            {each.title}
            {each.title === menuTwo ? (
              <img
                src={Arrow_Top}
                className="ltr:ms-auto block w-3 h-3 mr-2 text-gray-600 dark:text-white"
                alt=""
              />
            ) : (
              <img
                className="ltr:ms-auto block w-3 h-3 mr-2 text-gray-600 dark:text-white"
                src={Arrow_Bottom}
                alt=""
              />
            )}
          </button>
          {/* <Collapse in={each.title === menuTwo ? true : false}>
            <div id="example-collapse-text" className="py-3">
              {each.subMenu?.map((data, i) => (
                <Link to={data.link} className="no-underline text-black">
                  <div
                    key={i}
                    className={` ${
                      activeBtn === data.title ? " bg-accent text-white" : ""
                    } group my-1 no-underline cursor-pointer ms-auto flex  items-center  hover:bg-primary active:bg-primary focus:bg-primary  py-2  rounded-md `}
                    onClick={() => {
                      setActiveBtn(data.title);
                    }}
                  >
                    <p className=" mb-0 group-hover:text-[#fff] dark:text-white ">
                      {data.icon}
                    </p>
                    <p className=" mb-0 no-underline group-hover:text-[#fff] dark:text-white font-Poppins text-[12px] ">
                      {data.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Collapse> */}
        </>
      ))}
    </>
  );
}
export default Menus;

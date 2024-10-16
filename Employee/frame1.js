import React, { useState } from "react";
import FormInput from "../common/FormInput";
import { Tree, TreeNode } from "react-organizational-chart";
import _ from "lodash";
import clsx from "clsx";
// import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
// import IconButton from "@material-ui/core/IconButton";
// import BusinessIcon from "@material-ui/icons/Business";
// import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
// import MoreVertIcon from "@material-ui/icons/MoreVert";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MdExpandMore } from "react-icons/md";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import organization from "./org.json";
import { Card, notification } from "antd";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { HiMiniStar } from "react-icons/hi2";
import { useFormik } from "formik";
import MultiSelect from "../common/MultiSelect";
import image10 from "../../assets/images/Frame 427319200.svg";
import DrawerPop from "../common/DrawerPop";
import { createTheme } from '@material-ui/core/styles'
import image from '../../assets/images/dot-bg.png'
// import img from "../../assets/images/dot-bg.png"

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: 'url("../images/dot-bg.png")',
    display: "inline-block",
    borderRadius: 16
  },
  expand: {
    transform: "rotate(0deg)",
    marginTop: -10,
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.short
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: "#ECECF4"
  },
  backgroundContainer: {
    backgroundImage: 'url("../images/dot-bg.png")',
    backgroundSize: 'cover',  // Adjust based on your requirements
    minHeight: '100vh',       // Adjust to cover the entire viewport height
  }
  
}));

function Organization({ org, onCollapse, collapsed }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const [UpdateBtn, setupdateBtn] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [openPop, setOpenPop] = useState(null);
  const handleCloseModal = () => setOpenPop(false);


  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 

  const handleOpenModal = () => {
    // Set the state to trigger the rendering of AddLeaveType
    setOpenPop("HirearchyType");
    setShow(true);
    setAnchorEl(null)
    // You might want to set updateId and companyId here if needed
  };

  const formik = useFormik({
    initialValues: {
      name: "", // Update the field name to match your form
      companyId: [],
      description: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: yup.object().shape({
      name: yup.string().required("Employee Name is required"), // Update the field name
      companyId: yup.array().required("CompanyId is required"),
      description: yup.string().required("Employee Role is required"), // Update the field name
    }),
    onSubmit: async (e) => {
      setLoading(true);
      if (!e.name || !e.companyId || !e.description) {
        // Update the field names
        // openNotification(
        //   "error",
        //   "Please fill the form properly",
        //   "All fields are required."
        // );
        return;
      } else {
        // openNotification(
        //   "success",
        //   "Saved successfully",
        //   "Employee profile update saved. Changes are now reflected."
        // );
      }
      // const result = await axios.post(API.HOST + API.ADD_DESIGNATION, {
      //   designation: e.designation,
      //   companyId: e.companyId,
      //   description: e.description,
      // });
      formik.submitForm();
      handleClose();
      setLoading(false);
    },
  });



  return (
    <>
      <Card variant="outlined" className={classes.root}>
        <CardHeader
          avatar={
            <Tooltip
              title={`${_.size(
                org.organizationChildRelationship
              )} Sub Profile, ${_.size(org.account)} Sub Account`}
              arrow
            >
              <Badge
                style={{ cursor: "pointer" }}
                color="secondary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                showZero
                invisible={!collapsed}
                overlap="circle"
                badgeContent={_.size(org.organizationChildRelationship)}
                onClick={onCollapse}
              >
                <Avatar className={classes.avatar}>
                  {/* <BusinessIcon color="primary" /> */}
                </Avatar>
              </Badge>
            </Tooltip>
          }
          title={org.tradingName}
          // action={<IconButton size="small" onClick={handleClick}>
          //   <MoreVertIcon />
          // </IconButton>
          // }
        />

        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <MenuItem onClick={handleOpenModal}>
            <ListItemIcon>
              {/* <BusinessIcon color="primary" /> */}
            </ListItemIcon>
            <ListItemText primary="Add Sub Profile" />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              {/* <AccountBalanceIcon color="secondary" /> */}
            </ListItemIcon>

            <ListItemText primary="Add Sub Account" />
          </MenuItem>

          {/* <img
                className="vector"
                alt="vector"
                src={image10}
                onClick={handleOpenModal}
              ></img> */}
        </Menu>
        {/* <IconButton
        size="small"
        onClick={onCollapse}
        className={clsx(classes.expand, {
          [classes.expandOpen]: !collapsed
        })}
      >
        <ExpandMoreIcon />
        
      </IconButton> */}
        {/* <MdExpandMore /> */}
        <div className="job-wrapper">
          <div className="job-2">
            {" "}
            <img
              className="vector"
              alt="vector"
              src={image10}
              onClick={handleOpenModal}
            ></img>
          </div>
        </div>
      </Card>
      <div>
        {openPop === "HirearchyType" && show && (
          // <EmploymentAdd
          //   open={show}
          //   close={setShow}

          //   // shiftList={shift}
          // />
          <DrawerPop
            open={openPop}
            close={(e) => {
              // console.log(e);
              handleCloseModal();
            }}
            contentWrapperStyle={{
              width: "850px",
            }}
            handleSubmit={(e) => {
              // console.log(e);
              formik.handleSubmit();
            }}
            updateBtn={UpdateBtn}
            // updateFun={() => {
            //   UpdateAssetsTypes();
            // }}
            header={[
              !UpdateBtn ? t("Add Hirearchy") : t("Update  Assets"),
              t("Add peoples to your company hierarchy"),
            ]}
            footerBtn={[
              t("Cancel"),
              !UpdateBtn ? t("Add Hirearchy") : t("Update  Assets"),
            ]}
            footerBtnDisabled={loading}
          >
            <div className="relative h-full w-full">
              <FormInput
                title="Employee Name"
                placeholder="Enter Name"
                change={(e) => {
                  formik.setFieldValue("name", e);
                }}
                value={formik.values.name}
                error={formik.errors.name}
              />
              <div className="grid grid-cols-2 gap-4 pt-[30px]">
                <div className=" col-span-1">
                  <FormInput
                    title="Employee Role"
                    placeholder="Enter Description"
                    change={(e) => formik.setFieldValue("description", e)}
                    value={formik.values.description}
                    error={formik.errors.description}
                  />
                </div>
                <div className="col-span-1 ">
                  <label className=" text-sm pb-1">Choose Company</label>
                  <MultiSelect
                    value={formik.values.companyId}
                    // defaultValue={ {value: "cordova", label: "Cordova"}}
                    change={(e) => {
                      // console.log(e);
                      formik.setFieldValue("companyId", e);
                    }}
                    onSearch={(e) => {
                      // console.log(e);
                    }}
                    options={companyList}
                    placeholder="Choose Company"
                    className=" text-sm"
                    error={formik.errors.companyId}
                  />
                  {formik.errors.companyId && (
                    <p className=" flex justify-start items-center my-1 mb-0 text-[10px] text-red-500">
                      <HiMiniStar className="text-[10px]" />
                      <span className="text-[10px] pl-1">
                        {formik.errors.companyId}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              {contextHolder}
            </div>
          </DrawerPop>
        )}
      </div>
    </>
  );
}
function Account({ a }) {
  const classes = useStyles();
  return (
    <Card variant="outlined" className={classes.root}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {/* <AccountBalanceIcon color="secondary" /> */}
          </Avatar>
        }
        title={a.name}
      />
    </Card>
  );
}
function Product({ p }) {
  const classes = useStyles();
  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Typography variant="subtitle2">{p.name}</Typography>
      </CardContent>
    </Card>
  );
}
function Node({ o, parent }) {
  const [collapsed, setCollapsed] = React.useState(o.collapsed);
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  React.useEffect(() => {
    o.collapsed = collapsed;
  });
  const T = parent
    ? TreeNode
    : props => (
        <Tree
          {...props}
          lineWidth={"2px"}
          lineColor={"#bbc"}
          lineBorderRadius={"12px"}
        >
          {props.children}
        </Tree>
      );
  return collapsed ? (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    />
  ) : (
    <T
      label={
        <Organization
          org={o}
          onCollapse={handleCollapse}
          collapsed={collapsed}
        />
      }
    >
      {_.map(o.account, a => (
        <TreeNode label={<Account a={a} />}>
          <TreeNode label={<Product p={a.product} />} />
        </TreeNode>
      ))}
      {_.map(o.organizationChildRelationship, c => (
        <Node o={c} parent={o} />
      ))}
    </T>
  );
}
const theme = createMuiTheme({
  palette: {
    background: "#ECECF4"
  },
  fontFamily: "Roboto, sans-serif"
});

export default function Frame1(props) {
    const boxStyle = {
        backgroundImage: `url(${image})`
        
        
      };
  
    return (
    <ThemeProvider theme={theme}>
      <Box style={boxStyle}  height="80vh">
        <Node o={organization} />
      </Box>
    </ThemeProvider>
  );
}
// // import React, { useState } from 'react';

// // const Employee = ({manager, employee, onDelete, onAddSubordinate }) => {
// //   if (!employee) {
// //     return null;
// //   }

// //   return (
// //     <div className='employee'>
// //     <div>
// //       {Employee.name}{' '}
// //       <button onClick={() => onAddSubordinate(Employee.id)}>Add Subordinate</button>
// //     </div>
// //     <button onClick={() => onDelete(Employee.id)}>Delete</button>
// //     {Employee.subordinates && (
// //       <div className='subordinates'>
// //         {Employee.subordinates.map((subordinate) => (
// //           <Employee
// //             key={subordinate.id}
// //             CEO={manager}
// //             Manager={employee}
// //             Employee={subordinate}
// //             onDelete={onDelete}
// //             onAddSubordinate={onAddSubordinate}
// //           />
// //         ))}
// //       </div>
// //     )}
// //   </div>
// //   );
// // };

// // const OrganizationChart = () => {
// //     const [organization, setOrganization] = useState({
// //         id: 1,
// //         name: 'CEO',
// //         managers: [
// //           {
// //             id: 2,
// //             name: 'Manager A',
// //             employees: [
// //               {
// //                 id: 3,
// //                 name: 'Employee A1',
// //                 subordinates: [],
// //               },
// //               {
// //                 id: 4,
// //                 name: 'Employee A2',
// //                 subordinates: [
// //                   {
// //                     id: 8,
// //                     name: 'Sub Employee A2.1',
// //                   },
// //                   {
// //                     id: 9,
// //                     name: 'Sub Employee A2.2',
// //                   },
// //                 ],
// //               },
// //             ],
// //           },
// //           {
// //             id: 5,
// //             name: 'Manager B',
// //             employees: [
// //               {
// //                 id: 6,
// //                 name: 'Employee B1',
// //                 subordinates: [
// //                   {
// //                     id: 10,
// //                     name: 'Sub Employee B1.1',
// //                   },
// //                 ],
// //               },
// //               {
// //                 id: 7,
// //                 name: 'Employee B2',
// //                 subordinates: [],
// //               },
// //             ],
// //           },
// //         ],
// //       });
// //   const handleDelete = (employeeId) => {
// //     const updatedOrganization = deleteEmployee(organization, employeeId);
// //     setOrganization(updatedOrganization);
// //   };

// //   const handleAddEmployee = (managerId, newEmployee) => {
// //     const updatedOrganization = addEmployee(organization, managerId, newEmployee);
// //     setOrganization(updatedOrganization);
// //   };

// //   const deleteEmployee = (org, employeeId) => {
// //     if (org.id === employeeId) {
// //       return null;
// //     }

// //     if (org.subordinates) {
// //       const updatedSubordinates = org.subordinates
// //         .map((subordinate) => deleteEmployee(subordinate, employeeId))
// //         .filter(Boolean);

// //       return { ...org, subordinates: updatedSubordinates };
// //     }

// //     return org;
// //   };

// //   const addEmployee = (org, managerId, newEmployee) => {
// //     if (org.id === managerId) {
// //       return { ...org, subordinates: [...(org.subordinates || []), newEmployee] };
// //     }

// //     if (org.subordinates) {
// //       const updatedSubordinates = org.subordinates.map((subordinate) =>
// //         addEmployee(subordinate, managerId, newEmployee)
// //       );

// //       return { ...org, subordinates: updatedSubordinates };
// //     }

// //     return org;
// //   };

// //   const handleAddSubordinate = (managerId) => {
// //     const newEmployee = { id: Date.now(), name: 'New Employee' };
// //     handleAddEmployee(managerId, newEmployee);
// //   };

// //   return (
// //     <div className='organization-chart'>
// //       <h1>Organization Chart</h1>
// //       <div className='ceo-card'>
// //         <Employee
// //           employee={organization}
// //           onDelete={handleDelete}
// //           onAddSubordinate={handleAddSubordinate}
// //         />
// //       </div>
// //       {organization.subordinates &&
// //         organization.subordinates.map((manager) => (
// //           <div key={manager.id} className='manager-card'>
// //             <Employee
// //               employee={manager}
// //               onDelete={handleDelete}
// //               onAddSubordinate={handleAddSubordinate}
// //             />
// //             <svg className='connecting-lines'>
// //               {manager.subordinates &&
// //                 manager.subordinates.map((employee) => (
// //                   <line key={`line-${employee.id}`} x1='50%' y1='100%' x2='50%' y2='50%' />
// //                 ))}
// //             </svg>
// //             <div className='employees-container'>
// //               {manager.subordinates &&
// //                 manager.subordinates.map((employee) => (
// //                   <div key={employee.id} className='employee-card'>
// //                     <Employee
// //                       employee={employee}
// //                       onDelete={handleDelete}
// //                       onAddSubordinate={handleAddSubordinate}
// //                     />
// //                   </div>
// //                 ))}
// //             </div>
// //           </div>
// //         ))}
// //     </div>
// //   );
// // };

// // export default OrganizationChart;
// import React from 'react'
// import { Avatar, Card, Divider  } from 'antd';
// import images from '../../assets/images/Frame 427319141.png';



// const { Meta } = Card;

// const frame1 = () => {
   
//     const data = [
//         {
//           image: images,
//           name: 'John Doe',
//           jobTitle: 'Software Engineer',
//           subdata: [
           
//            {
//             image: images,
//             name: 'ashik',
//             jobTitle: 'Software Engineer',
//             // Add more subdata properties as needed
//            },
//            {
//             image: images,
//           name: 'ashok',
//           jobTitle: 'Software Engineer',
//             // Add more subdata properties as needed
//           },
//           {
//             image: images,
//           name: 'sravan',
//           jobTitle: 'Software Engineer',
//             // Add more subdata properties as needed
//           },
//           {
//             image: images,
//           name: 'surya',
//           jobTitle: 'Software Engineer',
//             // Add more subdata properties as needed
//           }
//     ]
//         },
        
//       ];
//       return (
//         <>
//           <div>
//             {data.map((individual, index) => (
//               <div key={index} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
//                 <Card style={{ width: 300, marginRight: 16 }}>
//                   <Meta
//                     avatar={<Avatar src={individual.image} />}
//                     title={individual.name}
//                     description={individual.jobTitle}
//                   />
//                 </Card>
//                 {index > 0 && (
//                   <svg
//                     height="100%"
//                     width="30px"
//                     style={{ position: 'absolute', left: '-15px', zIndex: -1 }}
//                   >
//                     <line
//                       x1="15"
//                       y1="0"
//                       x2="15"
//                       y2="100%"
//                       stroke="red"
//                       strokeWidth="2"
//                     />
//                   </svg>
//                 )}
//                 <div style={{ display: 'flex', flexDirection: 'column' }}>
//                   {individual.subdata.map((sub, subIndex) => (
//                     <div key={subIndex} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
//                       <Card style={{ width: 300, marginLeft: 16 }}>
//                         <Meta
//                           avatar={<Avatar src={sub.image} />}
//                           title={sub.name}
//                           description={sub.jobTitle}
//                         />
//                       </Card>
//                       {subIndex < individual.subdata.length - 1 && (
//                         <svg
//                           height="100%"
//                           width="30px"
//                           style={{ position: 'absolute', left: '15px', zIndex: -1 }}
//                         >
//                           <line
//                             x1="15"
//                             y1="0"
//                             x2="15"
//                             y2="100%"
//                             stroke="red"
//                             strokeWidth="2"
//                           />
//                         </svg>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       );
// }

// export default frame1

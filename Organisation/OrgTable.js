import React, { useState } from "react";
import {
  Button,
  Table,
  Input,
  Dropdown,
  Space,
  Menu,
  Checkbox,
  Radio,
  Switch,
  Tooltip,
} from "antd";
import FormInput from "../common/FormInput";

// ICONS
import { RxDotFilled } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { TbDotsVertical } from "react-icons/tb";
import { LuListFilter } from "react-icons/lu";
import { BsListUl } from "react-icons/bs";
import { BsGrid } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { RiPhoneFill } from "react-icons/ri";
import { FiMail } from "react-icons/fi";

// IMAGES
import Logo1 from "../../assets/images/logos/logo1.png";
import Logo2 from "../../assets/images/logos/logo2.png";
import Logo3 from "../../assets/images/logos/logo3.png";
import Logo4 from "../../assets/images/logos/logo4.png";

// Table Header And Style
const columns = [
  {
    title: (
      <span className="text-xs text-[#667085] dark:text-white font-medium">
        Company
      </span>
    ),
    dataIndex: "company",
    render: (text, record) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full">
          <img
            src={record?.logo}
            className="object-cover object-center w-full h-full"
            alt=""
          />
        </div>
        <div className="">
          <p className="font-semibold text-black dark:text-white">
            {record?.company}
          </p>
          <p className="!font-normal para">{record?.website}</p>
        </div>
        <div className="pl-4">
          <div
            className={`${
              record?.status === 1
                ? " bg-emerald-100 text-emerald-600"
                : " bg-rose-100 text-rose-600"
            } rounded-full px-3 py-[2px] w-fit font-medium text-sm vhcenter flex-nowrap`}
          >
            <RxDotFilled
              className={`${
                record?.status === 1 ? "text-emerald-600" : "text-rose-600"
              } text-lg`}
            />{" "}
            {record?.status === 1 ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: (
      <span className="text-xs text-[#667085] dark:text-white font-medium">
        Description
      </span>
    ),
    dataIndex: "description",
    render: (text, record) => (
      <div>
        <p className="font-medium text-black dark:text-white">
          {record.description.line1}
        </p>
        <p className="!font-normal para">{record.description.line2}</p>
      </div>
    ),
  },
  {
    title: (
      <span className="text-xs text-[#667085] dark:text-white font-medium">
        Contact
      </span>
    ),
    dataIndex: "contact",
    render: (text, record) => (
      <div className="font-medium text-black dark:text-white">
        <p className="flex items-center gap-3">
          <RiPhoneFill />
          {record.contact.email}
        </p>
        <p className="flex items-center gap-3">
          <FiMail />
          {record.contact.phone}
        </p>
      </div>
    ),
  },
  {
    title: (
      <span className="text-xs text-[#667085] dark:text-white font-medium">
        Location
      </span>
    ),
    dataIndex: "location",
    render: (text, record) => (
      <div className="font-medium text-black dark:text-white">
        <p className="flex items-center gap-3">
          <IoLocationOutline />
          {record.location}
        </p>
      </div>
    ),
  },
  {
    title: (
      <span className="text-xs text-[#667085] dark:text-white font-medium">
        Status
      </span>
    ),
    dataIndex: "status",
    render: (status) => (
      <Switch
        checked={status === 1}
        className={`${
          status === 1
            ? "ant-switch-checked" // Add your checked class if needed
            : "ant-switch-unchecked" // Add your unchecked class if needed
        }`}
      />
    ),
  },
  {
    title: "",
    dataIndex: "",
    render: () => (
      <Space size="middle">
        <Dropdown
          menu={{
            items,
          }}
        >
          <a>
            <TbDotsVertical className="text-gray-400 " />
          </a>
        </Dropdown>
      </Space>
    ),
  },
];

// Table Rows Data
const data = [
  {
    key: 1,
    logo: Logo1,
    company: "Company 1",
    website: "catalogapp.io",
    description: {
      line1: "Content curating app",
      line2: "Brings all your news into one place",
    },
    status: 1,
    contact: {
      email: "khadija@loyaltri.com",
      phone: "+971 50521252",
    },
    location: "368 Al Qusais, Dubai, UAE",
  },
  {
    key: 2,
    logo: Logo2,
    company: "Company 2",
    website: "example.com",
    description: {
      line1: "Description for Company 2",
      line2: "Additional details for Company 2",
    },
    status: 0,
    contact: {
      email: "contact@example.com",
      phone: "+1 123456789",
    },
    location: "123 Main Street, City, Country",
  },
  {
    key: 3,
    logo: Logo3,
    company: "Company 3",
    website: "anotherexample.com",
    description: {
      line1: "Description for Company 3",
      line2: "Additional details for Company 3",
    },
    status: 1,
    contact: {
      email: "info@company3.com",
      phone: "+44 987654321",
    },
    location: "456 Broad Avenue, Town, Country",
  },
  {
    key: 4,
    logo: Logo4,
    company: "Company 4",
    website: "company4.com",
    description: {
      line1: "Description for Company 4",
      line2: "Additional details for Company 4",
    },
    status: 0,
    contact: {
      email: "info@company4.com",
      phone: "+1 987654321",
    },
    location: "789 High Street, Village, Country",
  },
  // Add more items as needed
];

// Dropdown Items In each Rows
const items = [
  {
    key: "1",
    label: "Edit",
  },
  {
    key: "2",
    label: "Update",
  },
  {
    key: "3",
    label: "Delete",
  },
];

const gridListoptions = [
  {
    label: <BsListUl size={20} />,
    value: 1,
  },
  {
    label: <BsGrid size={20} />,
    value: 2,
  },
];

const OrgTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.dataIndex)
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [gridList, setGridList] = useState(1);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleColumnVisibilityChange = (column) => (e) => {
    e.stopPropagation();
    setVisibleColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((col) => col !== column)
        : [...prevColumns, column]
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // FILTER DROPDOWN SEARCH
  const handleColumnSearch = (searchValue) => {
    // Convert searchValue to lowercase for case-insensitive search
    const lowerSearchValue = searchValue.toLowerCase();

    // Filter columns based on whether their titles contain the searchValue
    const filteredColumns = columns.filter((column) => {
      const titleText =
        typeof column.title === "string"
          ? column.title
          : column.title.props.children;

      return titleText.toLowerCase().includes(lowerSearchValue);
    });

    // Set the visible columns to the filtered columns
    setVisibleColumns(filteredColumns.map((col) => col.dataIndex));
  };

  const hasSelected = selectedRowKeys.length > 0;

  // Filter Dropdown Menus and Search Input
  const columnMenu = (
    <Menu>
      <Menu.Item key="selectAll">
        <Checkbox
          checked={visibleColumns.length === columns.length}
          onChange={() =>
            setVisibleColumns(
              visibleColumns.length === columns.length
                ? []
                : columns.map((col) => col.dataIndex)
            )
          }
        >
          Select All
        </Checkbox>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="search">
        <Input
          placeholder="Search columns"
          onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
          onChange={(e) => handleColumnSearch(e.target.value)}
        />
      </Menu.Item>
      <Menu.Divider />
      {columns.map((column) => (
        <Menu.Item key={column.dataIndex}>
          <Checkbox
            value={column.title}
            checked={visibleColumns.includes(column.dataIndex)}
            onChange={handleColumnVisibilityChange(column.dataIndex)}
          >
            {column.title}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  const onChangeGridlist = ({ target: { value } }) => {
    setGridList(value);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col justify-between gap-3 xl:items-center xl:flex-row">
        <div className="flex items-center gap-3">
          <p className="h2">Company List</p>
          <div style={{ marginLeft: 8 }} className="text-primary">
            {hasSelected
              ? `${selectedRowKeys.length} Companies Selected`
              : "All Companies"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FormInput
            // title="Search"
            placeholder="Search"
            value=""
            icon={<CiSearch />}
            className="w-full mt-0 md:w-auto"
            error=""
            onSearch={(value) => {
              setSearchValue(value);
            }}
          />
          <div>
            <Dropdown
              menu={columnMenu}
              placement="bottomRight"
              trigger={["click"]}
              open={dropdownVisible}
              onOpenChange={(visible) => setDropdownVisible(visible)}
            >
              <Button
                className="flex items-center justify-center h-full px-4 py-2 font-medium flex-nowrap rounded-lg bg-[#FAFAFA] text-sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dropdown from closing
                  setDropdownVisible(!dropdownVisible);
                }}
              >
                <span className="mr-2">Filters</span>
                <span className="ml-auto">
                  <LuListFilter size={20} />
                </span>
              </Button>
            </Dropdown>
          </div>
          <Radio.Group
            options={gridListoptions}
            onChange={onChangeGridlist}
            value={gridList}
            optionType="button"
            className="flex items-center h-full"
          />
          <Button className="flex items-center justify-center h-full px-4 py-2 text-sm font-medium bg-white rounded-lg flex-nowrap">
            <FiSettings size={20} />
          </Button>
        </div>
      </div>
      <div className="border rounded-lg border-[#E7E7E7] dark:border-secondary relative overflow-auto">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    </div>
  );
};

export default OrgTable;

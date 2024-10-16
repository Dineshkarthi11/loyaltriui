import React from 'react'
import TableAnt from '../../common/TableAnt'
import { RxDotFilled } from 'react-icons/rx';
import { Dropdown, Space } from 'antd';
import { TbDotsVertical } from 'react-icons/tb';

const TableDocuments = () => {

    const columns = [
        {
          title: (
            <span className="text-xs text-[#667085] dark:text-white font-medium">
              Location & Description
            </span>
          ),
          render: (record) => (
            <div>
              <span className="font-medium">{record.location_name}</span>
              <br />
              <div className="text-[#667085] dark:text-white font-medium">
                <p>{record.description.eng}</p>
                <p>{record.description.arab}</p>
              </div>
            </div>
          ),
          responsive: ["xs"],
        },
        {
          title: (
            <span className="text-xs text-[#667085] dark:text-white font-medium">
              Location Name
            </span>
          ),
          dataIndex: "location_name",
          render: (text) => <span className="font-medium">{text}</span>,
          responsive: ["sm"],
        },
        {
          title: (
            <span className="text-xs text-[#667085] dark:text-white font-medium">
              Description
            </span>
          ),
          dataIndex: "description",
          render: (text, record) => (
            <div className="text-[#667085] dark:text-white font-medium">
              <p>{record.description.eng}</p>
              <p>{record.description.arab}</p>
            </div>
          ),
          responsive: ["sm"],
        },
        {
          title: (
            <span className="text-xs text-[#667085] dark:text-white font-medium">
              Status
            </span>
          ),
          dataIndex: "status",
          render: (status) => (
            <div
              className={`${
                status === 1
                  ? " bg-emerald-100 text-emerald-600"
                  : " bg-rose-100 text-rose-600"
              } rounded-full px-3 py-1 w-fit font-medium text-sm vhcenter flex-nowrap`}
            >
              <RxDotFilled
                className={`${
                  status === 1 ? "text-emerald-600" : "text-rose-600"
                } text-lg`}
              />{" "}
              {status === 1 ? "Active" : "Inactive"}
            </div>
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
          location_name: "Dubai",
          description: {
            eng: "Coordinates the planning, execution, and completion of projects...",
            arab: "ينسق التخطيط والتنفيذ والانتهاء من المشاريع...",
          },
          status: 1,
        },
        {
          key: 2,
          location_name: "New York",
          description: {
            eng: "Manages financial operations and provides strategic financial advice...",
            arab: "يدير العمليات المالية ويقدم نصائح مالية استراتيجية...",
          },
          status: 2,
        },
        {
          key: 3,
          location_name: "Tokyo",
          description: {
            eng: "Develops innovative solutions and oversees the implementation of new technologies...",
            arab: "يطور حلاً مبتكرًا ويراقب تنفيذ التقنيات الجديدة...",
          },
          status: 3,
        },
        {
          key: 4,
          location_name: "London",
          description: {
            eng: "Leads marketing campaigns and analyzes market trends for effective strategies...",
            arab: "يقود حملات التسويق ويحلل اتجاهات السوق لاستراتيجيات فعالة...",
          },
          status: 1,
        },
        {
          key: 5,
          location_name: "Sydney",
          description: {
            eng: "Manages human resources and implements employee development programs...",
            arab: "يدير الموارد البشرية وينفذ برامج تطوير الموظفين...",
          },
          status: 2,
        },
        {
          key: 6,
          location_name: "Paris",
          description: {
            eng: "Designs and develops user-friendly software applications...",
            arab: "يصمم ويطور تطبيقات البرمجيات سهلة الاستخدام...",
          },
          status: 3,
        },
        {
          key: 7,
          location_name: "Berlin",
          description: {
            eng: "Manages supply chain logistics and optimizes distribution processes...",
            arab: "يدير لوجستيات سلسلة التوريد ويحسن عمليات التوزيع...",
          },
          status: 1,
        },
        {
          key: 8,
          location_name: "Seoul",
          description: {
            eng: "Coordinates international business partnerships and negotiates agreements...",
            arab: "ينسق شراكات الأعمال الدولية ويتفاوض على الاتفاقيات...",
          },
          status: 2,
        },
        {
          key: 9,
          location_name: "Mumbai",
          description: {
            eng: "Researches market trends and provides insights for product development...",
            arab: "يبحث في اتجاهات السوق ويقدم رؤى لتطوير المنتجات...",
          },
          status: 3,
        },
        {
          key: 10,
          location_name: "Toronto",
          description: {
            eng: "Manages customer relations and ensures satisfaction through quality service...",
            arab: "يدير علاقات العملاء ويضمن الرضا من خلال خدمة عالية الجودة...",
          },
          status: 1,
        },
        // Additional demo contents
        {
          key: 11,
          location_name: "Hong Kong",
          description: {
            eng: "Leads research and development initiatives for cutting-edge technologies...",
            arab: "يقود مبادرات البحث والتطوير لتقنيات متقدمة...",
          },
          status: 2,
        },
        {
          key: 12,
          location_name: "Singapore",
          description: {
            eng: "Manages corporate communications and public relations for brand reputation...",
            arab: "يدير الاتصالات الشركية والعلاقات العامة لسمعة العلامة التجارية...",
          },
          status: 3,
        },
        {
          key: 13,
          location_name: "Cape Town",
          description: {
            eng: "Oversees environmental sustainability initiatives and promotes eco-friendly practices...",
            arab: "يشرف على مبادرات الاستدامة البيئية ويعزز الممارسات الصديقة للبيئة...",
          },
          status: 1,
        },
        {
          key: 14,
          location_name: "Rio de Janeiro",
          description: {
            eng: "Coordinates cultural events and community outreach programs for social impact...",
            arab: "ينسق الفعاليات الثقافية وبرامج التواصل مع المجتمع لتحقيق تأثير اجتماعي...",
          },
          status: 2,
        },
        {
          key: 15,
          location_name: "Moscow",
          description: {
            eng: "Manages legal affairs and ensures compliance with international regulations...",
            arab: "يدير الشؤون القانونية ويضمن الامتثال للتشريعات الدولية...",
          },
          status: 3,
        },
        // Add more as needed
      ];
      
      // Dropdown Items In each Rows
      const items = [
        {
          key: "1",
          label: "Action 1",
        },
        {
          key: "2",
          label: "Action 2",
        },
      ];



  return (
    <TableAnt
    data={data}
    header={columns}
    // tabValue={tab.value}
    // buttonClick={buttonClick}
    // clickDrawer={clickDrawer}
    // path={path}
    // activeOrNot={activeOrNot}
    // actionToggle={false}
    // addButtonName={addButtonName}
    // exportButton={false}
    title="Documents"
    // arabic = true,
    // checkBox = true
  />
  )
}

export default TableDocuments
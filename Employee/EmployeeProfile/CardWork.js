import React from "react";
import ButtonClick from "../../common/Button";

// Employee information object
let employeeInfo = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  nationality: "American",
  maritalStatus: "Single",
  address: {
    streetName: "123 Main St",
    unitSuite: "Apt 456",
    city: "Cityville",
    postalCode: "12345",
    provinceState: "State",
    country: "USA",
  },
  contact: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  },
};

const CardPersonal = () => {
  const renderInfo = (label, value) => (
    <div className="flex flex-col gap-1">
      <p className="para !font-medium">
       {label}
      </p>
      <p className="para !font-medium !text-black dark:!text-white">{value}</p>
    </div>
  );

  return (
    <>
      <div className="flex flex-col justify-between gap-6 box-wrapper">
        <div className="flex items-center justify-between">
          <p className="subhead">Work Information</p>
          <ButtonClick buttonName="Edit Details" />
        </div>
        <div className="v-divider"></div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-6">
          {renderInfo("First Name", employeeInfo.firstName)}
          {renderInfo("Last Name", employeeInfo.lastName)}
          {renderInfo("Date of Birth", employeeInfo.dateOfBirth)}
          {renderInfo("Gender", employeeInfo.gender)}
          {renderInfo("Nationality", employeeInfo.nationality)}
          {renderInfo("Marital Status", employeeInfo.maritalStatus)}
        </div>
      </div>


      <div className="flex flex-col justify-between gap-6 box-wrapper">
        <div className="flex items-center justify-between">
          <p className="subhead">Current Compensation</p>
          <ButtonClick buttonName="Edit Details" />
        </div>
        <div className="v-divider"></div>

        {/* Address Information */}
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(employeeInfo.address).map(([key, value]) =>
            renderInfo(`${key}`, `${value}`)
          )}
        </div>
      </div>


      <div className="flex flex-col justify-between gap-6 box-wrapper">
        <div className="flex items-center justify-between">
          <p className="subhead">Contact Information</p>
          <ButtonClick buttonName="Edit Details" />
        </div>
        <div className="v-divider"></div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(employeeInfo.contact).map(([key, value]) =>
            renderInfo(`${key}`, `${value}`)
          )}
        </div>
      </div>
    </>
  );
};

export default CardPersonal;

import React, { useState } from "react";
import ExpiryNotification from "./ExpiryNotification";
import UserCount from "./UserCount";
import RequestMoreUsers from "./RequestMoreUsers";
import ModalAnt from "../../../common/ModalAnt";
import UserCountInput from "../RequestAdditionalUser/UserCountInput";
import CouponCodeInput from "../RequestAdditionalUser/CouponCodeInput";
import HeaderSecond from "../RequestAdditionalUser/HeaderSecond";
import ActiveInactiveUsers from "../ActiveInactiveUsers/ActiveInactiveUsers";
import Secondcard from "../../../../assets/images/Secondcard.png";

function LoyaltriMobileApplication() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [showActiveInactiveUsers, setShowActiveInactiveUsers] = useState(false); // State for ActiveInactiveUsers popup

  // Close ActiveInactiveUsers page
  const closeActiveInactiveUsers = () => {
    setShowActiveInactiveUsers(false);
  };

  // Function to handle applying the coupon code
  const handleApplyCoupon = () => {
    // Logic for applying coupon code
    // ...
    // After applying coupon, close the modal
    setIsModalOpen(false);
  };

  return (
    <article className="relative flex flex-col w-[450px] h-[250px] min-w-[320px] min-h-[250px] bg-white rounded-2xl border-violet-600 border-opacity-20 overflow-hidden">
      <div className="relative flex flex-col h-full w-full p-5">
        {/* Background Image */}
        <img
          loading="lazy"
          src={Secondcard}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Top-left: Title and Validity */}
        <div className="absolute top-6 left-7 z-10">
          <h1 className="text-xl w-[150px] font-semibold text-violet-600">
            Loyaltri Web Application
          </h1>
          <p className="mt-4 text-gray-500">Valid till 06 Jan, 2025</p>
        </div>

        {/* Top-right: Expiry Notification */}
        <div className="absolute top-4 right-6 z-10">
          <ExpiryNotification />
        </div>

        {/* Bottom-left: User Count */}
        <div className="absolute bottom-4 left-5 z-10">
          <UserCount onsubmit={() => setShowActiveInactiveUsers(true)} />
        </div>

        {/* Bottom-right: Request More Users */}
        <div className="absolute bottom-4 right-5 z-10">
          <RequestMoreUsers onsubmit={() => setIsModalOpen(true)} />
        </div>
      </div>

      {/* Single Modal for Coupon Code and User Request */}
      <ModalAnt
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal
        showOkButton={true}
        cancelText="Request"
        okText="Apply Coupon"
        okButtonClass="mx-[15px] w-[190px]"
        cancelButtonClass="w-[190px]"
        showCancelButton={true}
        showTitle={false}
        centered={true}
        padding="8px"
        customButton={false}
      >
        <section className="flex overflow-hidden relative flex-col items-center py-5 w-[437px] h-[320px] rounded-2xl max-w-[437px]">
          <HeaderSecond />
          <UserCountInput />
          <CouponCodeInput 
            closeRequestAdditionalUserModal={() => setIsModalOpen(false)} 
            onApplyCoupon={handleApplyCoupon} // Pass the apply coupon handler
          />
        </section>
      </ModalAnt>

      {/* Conditionally render ActiveInactiveUsers */}
      {showActiveInactiveUsers && (
        <ActiveInactiveUsers closePopup={closeActiveInactiveUsers} show={showActiveInactiveUsers} />
      )}
    </article>
  );
}

export default LoyaltriMobileApplication;

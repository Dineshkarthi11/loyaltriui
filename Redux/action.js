export const setAccordionItem = (item) => ({
  type: "SET_ACCORDION_ITEM",
  payload: item,
});

export const sethierarchyEmployeevalues = (item) => ({
  type: "HIERARCHY",
  payload: item,
});
export const setApperanceTheme = (item) => ({
  type: "APPERANCE_THEME",
  payload: item,
});
// export const handleLeaveTemplateAction = (action, handleCardClick) => {
//   switch (action) {
//     case "CreatePolicy":
//       console.log("Navigating to CreatePolicy");
//       handleCardClick("Start from scratch");
//       break;
//     // Add more cases as needed
//     default:
//       console.log("Unknown action");
//       break;
//   }
// };

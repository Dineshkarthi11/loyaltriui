const initialState = {
  accordionItem: {},
};

export const accordionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ACCORDION_ITEM":
      return {
        ...state,
        accordionItem: action.payload,
      };
    default:
      return state;
  }
};
const hierarchyValue = {
  employeeId: "",
};
export const hierarchyEMployee = (state = hierarchyValue, action) => {
  switch (action.type) {
    case "HIERARCHY":
      return {
        ...state,
        employeeId: action.payload,
      };
    default:
      return state;
  }
  // return {
  //   employeeId: action.payload,
  // };
};

const initialApperance = {
  apperanceData: {},
};

export const apperanceReducer = (state = initialApperance, action) => {
  switch (action.type) {
    case "APPERANCE_THEME":
      return {
        ...state,
        apperanceData: action.payload,
      };
    default:
      return state;
  }
};

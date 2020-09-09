const initialState = {
  authenticated: false,
  profile: false,
};
// Reducers (Modifies The State And Returns A New State)
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Login
    case 'AUTH': {
      return {
        ...state,
        authenticated: true,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        authenticated: false,
        profle: false,
      };
    }
    // Default
    default: {
      return state;
    }
  }
};
// Exports
export default authReducer;

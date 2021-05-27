// modules
// imports
// action type
const TYPE = type => "planner/Preferences/" + type;

// action types
export const CHANGE_LOCALE = TYPE("CHANGE_LOCALE");

// initial state
const initialState = {
    locale: "ru"
};

// reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        // change locale
        case CHANGE_LOCALE:
            return { ...state, locale: action.payload };
        default:
            return state;
    }
}

// action creators
export const changeLocale = locale => dispatch => {
    // save locale to local storage
    localStorage.setItem("planner-locale", locale);

    dispatch({
        type: CHANGE_LOCALE,
        payload: locale
    });
};

import { createStore, combineReducers } from "redux";

const initState = {
    user: sessionStorage.getItem("userinfo") ? JSON.parse(sessionStorage.getItem("userinfo")): "",
}

const userReducer = (state = initState, action) => {
    const { type, payload } = action
    switch (type) {
        case "SET_USER":
            state.user = payload;
            if (payload) {
                sessionStorage.setItem("userinfo", JSON.stringify(payload));
            }
            return { ...state };
        case "LOGOUT":
            state.user = "";
            return { ...state };
        default:
            return state;
    }
}

const globalReducer = function (state = { data: "" }, action) {
    const { type, payload } = action;
    switch (type) {
        case "SET_GLOBAL":
            state.data = payload;
            return { ...state };
        default:
            return state;
    }
};
// combineReducers 可以把多个reducer合并在一起，reducer产生的state会代上key(键)前缀,相当于把state数据隔离了。
const reducers = combineReducers({
    user: userReducer,
    global: globalReducer,
});
const store = createStore(reducers);
export default store;
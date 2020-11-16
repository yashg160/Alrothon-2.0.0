import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

const rootReducer = combineReducers({
	/* global: Global,
	country: Country,
	india: India, */
});
export const ConfigureStore = () => {
	return createStore(rootReducer, applyMiddleware(...[thunk, logger]));
};

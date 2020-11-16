import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import Usage from "./Usage";
import Threshold from "./Threshold";

const rootReducer = combineReducers({
	usage: Usage,
	threshold: Threshold,
	/* global: Global,
	country: Country,
	india: India, */
});
export const ConfigureStore = () => {
	return createStore(rootReducer, applyMiddleware(...[thunk, logger]));
};

import * as ActionTypes from "./ActionTypes";

export const fetchUsageData = () => (dispatch) => {
	dispatch({
		type: ActionTypes.FETCH_ALL_USAGE_DATA,
		payload: null,
	});

	fetch("http://localhost:5000/power")
		.then((res) => res.json())
		.then((res) => {
			dispatch({
				type: ActionTypes.FETCH_ALL_USAGE_DATA_SUCCESS,
				payload: res,
			});
		});
};

export const updateThreshold = (thresh) => (dispatch) => {
	dispatch({
		type: ActionTypes.UPDATE_THRESHOLD,
		payload: thresh,
	});
};

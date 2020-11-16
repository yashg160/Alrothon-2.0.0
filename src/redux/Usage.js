import * as ActionTypes from "./ActionTypes";

export default function Usage(
	state = {
		error: {},
		loading: true,
		data: [],
		msg: "",
		status: true,
	},
	action
) {
	switch (action.type) {
		case ActionTypes.FETCH_ALL_USAGE_DATA:
			return { ...state, loading: true };
		case ActionTypes.FETCH_ALL_USAGE_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				...action.payload,
			};
		default:
			return {
				...state,
			};
	}
}

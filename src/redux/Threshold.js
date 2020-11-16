import * as ActionTypes from "./ActionTypes";

export default function Threshold(
	state = {
		threshold: 100,
	},
	action
) {
	switch (action.type) {
		case ActionTypes.UPDATE_THRESHOLD:
			return { ...state, threshold: action.payload };

		default:
			return {
				...state,
			};
	}
}

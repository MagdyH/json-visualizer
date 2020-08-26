import ActionType from '../constants/actionTypes';

export default function uploadJsonReducer(state = { json: {} }, action) {
    switch (action.type) {
        case ActionType.UPLOAD_JSON:
            return { ...state, json: action.playload }
        default:
            return state;
    }
}
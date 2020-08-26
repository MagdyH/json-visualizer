import ActionType from '../constants/actionTypes'

export const uploadJsonActions = {
    uploadJSON: (json) => {
        return { type: ActionType.UPLOAD_JSON,playload : json }
    }
}
export default uploadJsonActions;
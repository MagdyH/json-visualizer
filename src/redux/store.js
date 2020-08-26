import {createStore, combineReducers, applyMiddleware} from "redux";
import uploadJSONReducer from './reducers/uploadJSON';
import thunk from 'redux-thunk';

const combined =  combineReducers({uploadJSONReducer})  ; 
const store = createStore(combined,applyMiddleware(thunk));

export default store;
import { createActions } from 'redux-actions';

const prefix = 'APP';
const actionTypes = ['TOGGLE_DRAWER', 'QUERY_LOAD_START', 'QUERY_LOAD_END']; 
export default createActions(...actionTypes, { prefix });

import { handleActions } from 'redux-actions';

import actions from 'src/actions/app';

export const name = 'app';

const initialState = {
    drawer: null,
    overlay: false,
    queryLoading: false,
    loadMessage: null,
    pending: {}
};

const reducerMap = {
    [actions.toggleDrawer]: (state, { payload }) => {
        return {
            ...state,
            drawer: payload,
            overlay: !!payload
        };
    },
    [actions.queryLoadStart]: (state, { payload }) => {
        return {
            ...state,
            queryLoading: true,
            loadMessage: payload
        };
    },
    [actions.queryLoadEnd]: (state) => {
        return {
            ...state,
            queryLoading: false,
            loadMessage: null
        };
    }
};

export default handleActions(reducerMap, initialState);

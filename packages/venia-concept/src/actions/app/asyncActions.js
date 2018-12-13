import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

export const queryLoadStart = message => async dispatch =>
    dispatch(actions.queryLoadStart(message));

export const queryLoadEnd = () => async dispatch =>
    dispatch(actions.queryLoadEnd(null));

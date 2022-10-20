import { MenuActionTypes } from './menu.types';

export const setCurrentMenu = menu => ({
  type: MenuActionTypes.SET_ACTIVE_MENU,
  payload: menu
});


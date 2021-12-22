import {
  AnyAction,
  createDraftSafeSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import snapshotService from "../../services/snapshot/snapshotService";
import { addNotification } from "../notifications/notificationsSlice";

interface ICategories {
  categories: string[];
}

const initialState: ICategories = {
  categories: [
    "Travel",
    "Food",
    "Electronics",
    "Entertainment",
    "Groceries",
    "Gifts",
    "Drinks",
    "Tickets",
    "Sports",
    "Education",
  ],
};

export const updateCategories =
  (categories: string[]): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    try {
      dispatch(setCategories(categories));
      await snapshotService.createEncryptedSnapshot(getState());
      dispatch(
        addNotification({
          msg: "Categories Updated Successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          msg: (error as Error).message,
          type: "error",
        })
      );
    }
  };

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload.sort((a, b) => (a > b ? 1 : -1));
    },
  },
});

// SELECTORS

const selectSelf = (state: RootState) => state;

export const selectCategories = createDraftSafeSelector(
  selectSelf,
  (state: RootState) => state.categories.categories
);

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;

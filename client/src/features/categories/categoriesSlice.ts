import {
  AnyAction,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { RootState } from "@app/store";
import snapshotService from "@services/snapshot/snapshotService";
import { addNotification } from "@features/notifications/notificationsSlice";

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
      console.log(error);
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
    resetCategories: (state) => {
      state = {
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
    },
  },
});

// SELECTORS

const selectCategoryState = (state: RootState) => state.categories;

export const selectCategories = createSelector(
  selectCategoryState,
  (categories: ICategories) => categories.categories
);

export const { setCategories, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;

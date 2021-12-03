import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_TYPE = "";
const DEFAULT_DURATION = 4000;

interface AddNotificationType {
  msg: string;
  type?: string;
  duration?: number;
}

const initialState: INotification[] = [];

export const notificationReducer = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AddNotificationType>) => {
      state = [
        ...state,
        {
          id: Math.random().toString(),
          msg: action.payload.msg,
          type: action.payload.type || DEFAULT_TYPE,
          duration: action.payload.duration || DEFAULT_DURATION,
        },
      ];
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state = state.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { addNotification, removeNotification } = notificationReducer.actions;
export default notificationReducer.reducer;

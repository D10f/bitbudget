import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_TYPE = '';
const DEFAULT_DURATION = 4000;

interface InitialState {
  notifications: INotification[];
  isModalOpen: boolean;
}

interface AddNotificationType {
  msg: string;
  type?: string;
  duration?: number;
}

const initialState: InitialState = {
  notifications: [],
  isModalOpen: false,
};

export const uiReducer = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AddNotificationType>) => {
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Math.random().toString(),
            msg: action.payload.msg,
            type: action.payload.type || DEFAULT_TYPE,
            duration: action.payload.duration || DEFAULT_DURATION,
          },
        ],
      };
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { addNotification, removeNotification, openModal, closeModal } =
  uiReducer.actions;
export default uiReducer.reducer;

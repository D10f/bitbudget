import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import { addNotification } from "../../../features/notifications/notificationsSlice";
import Button from "../../../common/components/Button/Button";
import Icon from "../../../common/components/Icon/Icon";
import Popup from "../../../common/components/Popup/Popup";
import Modal from "../../../common/components/Modal/Modal";
import ExpenseForm from "../../../features/expenses/ExpenseForm/ExpenseForm";
import Row from "../../../common/components/Row/Row";

interface IExpenseSubMenuProps {
  expense: IExpense;
  wallet: IWallet;
  closeSubMenu: () => void;
}

// Prompts
const initialState = {
  editing: false,
  delete: false,
};

const ExpenseSubMenu = ({
  expense,
  wallet,
  closeSubMenu,
}: IExpenseSubMenuProps) => {
  
  const [prompts, setPrompts] = useState(initialState);
  const clearPrompts = useCallback(() => setPrompts(initialState), []);

  const dispatch = useAppDispatch();
  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;

  useClickOutside(popupRef, () => {
    if (prompts.editing || prompts.delete) {
      return;
    }
    closeSubMenu();
  });

  const createExpenseModal = () => (
    <Modal title="Edit Expense" requestClose={clearPrompts}>
      <ExpenseForm
        expense={expense}
        submitCallback={() => {
          dispatch(
            addNotification({
              msg: "Expense Updated Successfully",
              type: "success",
            })
          );
          setPrompts(initialState);
        }}
      />
    </Modal>
  );

  const confirmDeleteModal = () => (
    <Modal requestClose={clearPrompts}>
      <p>Are you sure you want to delete this expense?</p>
      <Row>
        <Button
          variant="action"
          onClick={() => {
            dispatch(
              addNotification({
                msg: "Expense Deleted Successfully",
                type: "success",
              })
            );
          }}
        >
          Confirm
        </Button>
        <Button variant="link" onClick={clearPrompts}>
          Cancel
        </Button>
      </Row>
    </Modal>
  );

  return (
    <Popup ref={popupRef} align="top">
      <Button
        variant="link"
        icon={<Icon name="edit" />}
        onClick={() => setPrompts({ editing: true, delete: false })}
      >
        Edit Expense
      </Button>
      <Button
        variant="link"
        icon={<Icon name="trash" />}
        onClick={() => setPrompts({ editing: false, delete: true })}
      >
        Delete Expense
      </Button>

      <AnimatePresence>
        {prompts.editing && createExpenseModal()}
      </AnimatePresence>
      <AnimatePresence>
        {prompts.delete && confirmDeleteModal()}
      </AnimatePresence>
    </Popup>
  );
};

export default ExpenseSubMenu;

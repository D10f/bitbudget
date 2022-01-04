import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useAppDispatch } from "@hooks/useAppDispatch";
import { useClickOutside } from "@hooks/useClickOutside";
import { addNotification } from "@features/notifications/notificationsSlice";
import { deleteExpense } from "@features/expenses/expensesSlice";

import ExpenseForm from "@features/expenses/ExpenseForm";
import Button from "@components/Button/Button";
import Icon from "@components/Icon/Icon";
import Popup from "@components/Popup/Popup";
import Modal from "@components/Modal/Modal";
import Row from "@components/Row/Row";

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
        walletId={wallet.id}
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
            setPrompts(initialState);
            dispatch(deleteExpense(expense));
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

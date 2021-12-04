import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../../../common/hooks/useAppDispatch";
import { useClickOutside } from "../../../common/hooks/useClickOutside";
import { addNotification } from "../../../features/notifications/notifications.reducer";
import Button from "../../../common/components/Button/Button";
import Icon from "../../../common/components/Icon/Icon";
import Popup from "../../../common/components/Popup/Popup";
import Modal from "../../../common/components/Modal/Modal";
import ExpenseForm from "../../../common/components/ExpenseForm/ExpenseForm";
import Row from "../../../common/components/Row/Row";

interface IExpenseSubMenuProps {
  expense: IExpense;
  wallet: IWallet;
  closeSubMenu: () => void;
}

const ExpenseSubMenu = ({ expense, wallet, closeSubMenu }: IExpenseSubMenuProps) => {
  const [editing, setEditing] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const dispatch = useAppDispatch();
  const popupRef = useRef() as React.MutableRefObject<HTMLElement>;

  const closeOnClickOutside = () => {
    closeSubMenu();
  };
  useClickOutside(popupRef, closeOnClickOutside);

  const createExpenseModal = () => (
    <Modal title="Edit Expense" requestClose={() => setEditing(false)}>
      <ExpenseForm
        expense={expense}
        submitCallback={() => {
          dispatch(
            addNotification({
              msg: "Expense Updated Successfully",
              type: "success",
            })
          );
          setEditing(false);
        }}
      />
    </Modal>
  );

  const confirmDeleteModal = () => (
    <Modal requestClose={() => setDeletePrompt(false)}>
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
        <Button variant="link" onClick={() => setDeletePrompt(false)}>
          Cancel
        </Button>
      </Row>
    </Modal>
  );

  return (
    <Popup ref={popupRef}>
      <Button
        variant="link"
        icon={<Icon name="edit" />}
        onClick={() => setEditing(true)}
      >
        Edit Expense
      </Button>
      <Button
        variant="link"
        icon={<Icon name="trash" />}
        onClick={() => setDeletePrompt(true)}
      >
        Delete Expense
      </Button>

      <AnimatePresence>
        {editing && createExpenseModal()}
        {deletePrompt && confirmDeleteModal()}
      </AnimatePresence>
    </Popup>
  );
};

export default ExpenseSubMenu;

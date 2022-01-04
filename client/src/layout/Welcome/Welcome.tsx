import React, { useState } from "react";
import styled from "styled-components";
import Button from "@components/Button/Button";
import Modal from "@components/Modal/Modal";
import LoginForm from "@features/user/LoginForm";
import SignupForm from "@features/user/SignupForm";

enum AUTH_ACTION {
  LOGIN,
  SIGNUP,
}

const StyledButton = styled(Button)`
  margin-top: 2rem;
`;

const Welcome = () => {
  const [action, setAction] = useState(AUTH_ACTION.LOGIN);
  return (
    <Modal
      title={
        action === AUTH_ACTION.LOGIN ? "Login to continue" : "Create an account"
      }
      requestClose={() => {}}
    >
      {action === AUTH_ACTION.LOGIN ? <LoginForm /> : <SignupForm />}

      <StyledButton
        variant="link"
        onClick={() => {
          action === AUTH_ACTION.LOGIN
            ? setAction(AUTH_ACTION.SIGNUP)
            : setAction(AUTH_ACTION.LOGIN);
        }}
      >
        {action === AUTH_ACTION.LOGIN
          ? "Don't have an account yet?"
          : "Already have an account?"}
      </StyledButton>
    </Modal>
  );
};

export default Welcome;
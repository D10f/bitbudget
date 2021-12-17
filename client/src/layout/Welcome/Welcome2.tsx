import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../common/components/Button/Button";
import LoginForm from "../../common/components/LoginForm/LoginForm";
import Modal from "../../common/components/Modal/Modal";
import SignupForm from "../../common/components/SignupForm/SignupForm";

enum AUTH_ACTION {
  LOGIN,
  SIGNUP,
}

const StyledButton = styled(Button)`
  margin-top: 2rem;
`;

const Welcome2 = () => {
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

export default Welcome2;

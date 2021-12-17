import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Button from "../../common/components/Button/Button";
import Icon from "../../common/components/Icon/Icon";
import Modal from "../../common/components/Modal/Modal";
import Row from "../../common/components/Row/Row";
import SignupForm from "../../common/components/SignupForm/SignupForm";
import Popup from '../../common/components/Popup/Popup';

const WelcomeSection = styled.section`
  position: absolute;
  top: 3rem;
  left: 20rem;
  right: 20rem;
`;

const Hero = styled.header`
  width: 100%;
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Fira Code";
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 4rem;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
`;

const Showcase = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5rem;
  height: 100%;
`;

const FeatureDescription = styled.p``;

const Description = styled.div`
  font-family: "Fira Code";
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const FeatureList = styled.ul`
  margin: 3rem 1rem;
`;

const Feature = styled.li`
  list-style: disc;
`;

const LoginButton = styled(Button)`
  font-size: 1.2rem;
`;

const StyledLinkButton = styled(Button)`
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const HelperPopup = styled.div`
position: relative;`;

const StyledIcon = styled(Icon)`
  width: 2rem;
  height: 2rem;
  fill: ${({ theme }) => theme.colors.dark.default};
  &:hover {
    fill: ${({ theme }) => theme.colors.light.default};
  }
`;

const Screenshot = styled.img``;

const Footer = styled.footer`
  position: absolute;
  bottom: -10rem;
  left: 50%;
`;

const Links = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 2.5rem;
    height: 2.5rem;
    fill: ${({ theme }) => theme.colors.light.default};
  }
`;

const Welcome = () => {
  const [signupPrompt, setSignupPrompt] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [helperPopup, setHelperPopup] = useState(false);

  return (
    <WelcomeSection>
      <Hero>
        <Title>Gadget Budget</Title>
        <Subtitle>Manage your expenses, privately.</Subtitle>
      </Hero>

      <Showcase>
        <Description>
          <FeatureDescription>
            A modern expense management web-application built for{" "}
            <em>your eyes</em> only.
          </FeatureDescription>
          <FeatureList>
            <Feature>Multiple Wallets</Feature>
            <Feature>Dashboard overview</Feature>
            <Feature>End-to-end encryption</Feature>
          </FeatureList>
          <Row>
            <Button
              variant="action"
              onClick={() => {
                setSignupPrompt(true);
              }}
            >
              Sign up now
            </Button>
            <LoginButton variant="link" onClick={() => setLoginPrompt(true)}>
              Already have an account?
            </LoginButton>
          </Row>

          <HelperPopup>
            <>
              <StyledLinkButton
                icon={<StyledIcon name="help" />}
                iconPosition="start"
                variant="link"
                onMouseEnter={() => setHelperPopup(true)}
                onMouseLeave={() => setHelperPopup(false)}
              >
                Test credentials
              </StyledLinkButton>
              {helperPopup && (
                <Popup align="right">
                  <p>Username</p>
                  <p>Hello</p>
                </Popup>
              )}
            </>
          </HelperPopup>
        </Description>
        <Screenshot
          src="https://via.placeholder.com/400x200.webp"
          alt="Screenshot of the application"
        />
      </Showcase>

      <Footer>
        <Links>
          <li>
            <a
              href="https://github.com/herokunt/gadget-budget"
              aria-label="Link to GitHub repository"
            >
              <Icon name="github" />
            </a>
          </li>
        </Links>
      </Footer>

      <AnimatePresence>
        {signupPrompt && (
          <Modal
            title="Signup"
            requestClose={() => {
              setSignupPrompt(false);
            }}
          >
            <SignupForm />
          </Modal>
        )}
        {loginPrompt && (
          <Modal
            title="Login"
            requestClose={() => {
              setLoginPrompt(false);
            }}
          >
            <SignupForm />
          </Modal>
        )}
      </AnimatePresence>
    </WelcomeSection>
  );
};

export default Welcome;

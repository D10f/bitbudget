import styled from 'styled-components';

interface ITitleProps {
    children: string | React.ReactChild[]
}

const StyledTitle = styled.h3`
    margin-block: 1em;
    font-size: 2rem;
`;

const Title = ({ children }: ITitleProps) => {

    return (
        <StyledTitle>
            {children}
        </StyledTitle>
    );
};

export default Title;

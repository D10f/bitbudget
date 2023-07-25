import styled from 'styled-components';

interface IParagraphProps {
    children: string | React.ReactChild[]
}

const StyledParagraph = styled.p`
    margin-block-end: 0.75em;
    font-size: 1.7rem;
`;

const Paragraph = ({ children }: IParagraphProps) => {

    return (
        <StyledParagraph>
            {children}
        </StyledParagraph>
    );
};

export default Paragraph;

import styled from 'styled-components';

export const Background = styled.div`
    position: absolute;
    inset: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.1rem);
    z-index: 10;
`;

export const Container = styled.div`
    position: relative;
    margin-inline: auto;
    margin-block: 2rem;
`;

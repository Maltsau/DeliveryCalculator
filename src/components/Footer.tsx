import styled from 'styled-components';

import { useStore } from '../store';

import gitIcon from '/github.svg';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: 5px 0px;
`;

const FooterLink = styled.div<{ $background: string }>`
  background-image: url(${(props) => props.$background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export default function Footer() {
  const version = useStore((state) => state.version);
  return (
    <FooterContainer>
      <span>{version}</span>
      <a href="https://github.com/Maltsau" target="_blank">
        <FooterLink $background={gitIcon} />
      </a>
    </FooterContainer>
  );
}

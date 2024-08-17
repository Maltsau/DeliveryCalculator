import styled from 'styled-components';

const InlineButton = styled.div<{ $background: string; $isInline?: boolean }>`
  margin: 0px ${(props) => (props.$isInline ? 'auto' : '0px')};
  background-image: url(${(props) => props.$background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export { InlineButton };

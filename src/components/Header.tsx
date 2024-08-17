import styled from 'styled-components';
import { useEffect } from 'react';

import { useStore } from '../store';
import { InlineButton } from './commonElements';

import clearIcon from '/delete.png';

const HeaderStyled = styled.header`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  & div {
    display: flex;
    gap: 10px;
  }
`;

const StyledCheckbox = styled.div<{ $isAdvansedMode: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.$isAdvansedMode ? 'start' : 'end')};
  border: 2px solid ${(props) => (props.$isAdvansedMode ? 'red' : 'gray')};
  border-radius: 12px;
  background-color: ${(props) => (props.$isAdvansedMode ? 'red' : 'gray')};
  width: 48px;
`;

const CheckboxPoint = styled.div`
  background-color: white;
  width: 24px;
  border-radius: 12px;
`;

function Header() {
  const delivery = useStore((state) => state.delivery);
  const isAdvansedMode = useStore((state) => state.isAdvansedMode);
  const setDelivery = useStore((state) => state.setDelivery);
  const setAdvansedMode = useStore((state) => state.setAdvansedMode);
  const clearForm = useStore((state) => state.clearForm);

  useEffect(() => {
    if (localStorage.getItem('isAdvansedMode') === 'true')
      setAdvansedMode(true);
  }, [isAdvansedMode, setAdvansedMode]);

  const handleDeliveryChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = formattedValue.split('.');
    const finalValue =
      decimalPart && decimalPart.length > 2
        ? parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`)
        : parseFloat(formattedValue);

    setDelivery(isNaN(finalValue) ? 0 : finalValue);
  };

  return (
    <HeaderStyled>
      <div>
        <span>Введите стоимость Вашей доставки в это поле:</span>
        <input
          type="number"
          step="any"
          value={delivery}
          onChange={(e) => handleDeliveryChange(e.target.value)}
        />
      </div>
      <div>
        <StyledCheckbox
          $isAdvansedMode={isAdvansedMode}
          onClick={() => {
            localStorage.getItem('isAdvansedMode') === 'true'
              ? localStorage.setItem('isAdvansedMode', 'false')
              : localStorage.setItem('isAdvansedMode', 'true');
            setAdvansedMode(!isAdvansedMode);
          }}
        >
          <CheckboxPoint />
        </StyledCheckbox>
        <span>
          {isAdvansedMode ? 'В обычный режим' : 'В продвинутый режим'}
        </span>
      </div>
      <InlineButton
        $background={clearIcon}
        onClick={() => clearForm()}
      ></InlineButton>
    </HeaderStyled>
  );
}

export default Header;

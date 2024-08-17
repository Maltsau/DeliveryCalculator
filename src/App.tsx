import styled from 'styled-components';
import { useEffect } from 'react';

import plusIcon from '/plus.svg';
import minusIcon from '/minus.svg';
import clearIcon from '/delete.png';
import gitIcon from '/github.svg';

import { useStore } from './store';

const Header = styled.header`
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

const TableStyled = styled.table`
  min-width: 100%;
  margin: 0 auto;
  text-align: center;
  border: 1px solid black;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  & th {
    color: black;
  }
`;

const TableLine = styled.tr`
  & :nth-child(1) {
    min-width: 70px;
  }
  & td:nth-child(7) {
    color: green;
  }
  & td:nth-child(8) {
    color: yellowgreen;
  }
`;

const TableHeadCell = styled.th`
  border: 1px solid black;
  margin: 0;
  padding: 10px;
`;

const TableCell = styled.td`
  border: 1px solid black;
  margin: 0;
  padding: 10px;
`;

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

const Footer = styled.footer`
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

function App() {
  const version = useStore((state) => state.version);
  const delivery = useStore((state) => state.delivery);
  const lines = useStore((state) => state.lines);
  const isAdvansedMode = useStore((state) => state.isAdvansedMode);
  const setDelivery = useStore((state) => state.setDelivery);
  const addLine = useStore((state) => state.addLine);
  const removeLine = useStore((state) => state.removeLine);
  const changeDatum = useStore((state) => state.changeDatum);
  const clearForm = useStore((state) => state.clearForm);
  const setAdvansedMode = useStore((state) => state.setAdvansedMode);

  const handlePriceChange = (position: number, value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = formattedValue.split('.');
    const finalValue =
      decimalPart && decimalPart.length > 2
        ? parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`)
        : parseFloat(formattedValue);

    changeDatum('price', position, isNaN(finalValue) ? 0 : finalValue);
  };

  const handleDeliveryChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = formattedValue.split('.');
    const finalValue =
      decimalPart && decimalPart.length > 2
        ? parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`)
        : parseFloat(formattedValue);

    setDelivery(isNaN(finalValue) ? 0 : finalValue);
  };

  const validateCalculated = (value: number) => {
    return value && !isNaN(value) ? value.toFixed(2) : '0.00';
  };

  const totalNettoPrice = lines.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.quantity * currentValue.price,
    0
  );

  const deliveryPerPosition =
    totalNettoPrice > 0
      ? lines.map(
          (line) => (line.price * line.quantity * delivery) / totalNettoPrice
        )
      : lines.map(() => 0);

  const newPrices = lines.map(
    (line, i) => line.price + deliveryPerPosition[i] / line.quantity
  );

  const newCosts = lines.map((line, i) =>
    !isNaN(newPrices[i] * line.quantity) ? newPrices[i] * line.quantity : 0
  );

  useEffect(() => {
    if (localStorage.getItem('isAdvansedMode') === 'true')
      setAdvansedMode(true);
  }, [isAdvansedMode, setAdvansedMode]);

  return (
    <>
      <Header>
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
      </Header>
      <main>
        <TableStyled>
          <TableHead>
            <TableLine>
              <TableHeadCell>№ п/п</TableHeadCell>
              <TableHeadCell>Описание (наименование)</TableHeadCell>
              <TableHeadCell>Цена без НДС, руб.</TableHeadCell>
              <TableHeadCell>Количество</TableHeadCell>
              <TableHeadCell>Стоимость без НДС, руб.</TableHeadCell>
              <TableHeadCell>Наценка на позицию без НДС, руб.</TableHeadCell>
              <TableHeadCell>Наценка на единицу без НДС, руб.</TableHeadCell>
              <TableHeadCell>Новая цена без НДС, руб.</TableHeadCell>
              <TableHeadCell>Новая стоимость без НДС, руб.</TableHeadCell>
              <TableHeadCell>Действие</TableHeadCell>
            </TableLine>
          </TableHead>
          <tbody>
            {lines.map((line, i) => (
              <TableLine key={line.position + 'key'}>
                <TableCell>{line.position}</TableCell>
                <TableCell>
                  <input
                    value={line.description}
                    onChange={(e) => {
                      changeDatum('description', line.position, e.target.value);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    step="any"
                    value={line.price}
                    onChange={(e) =>
                      handlePriceChange(line.position, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    step="any"
                    value={line.quantity}
                    onChange={(e) => {
                      changeDatum(
                        'quantity',
                        line.position,
                        Number(e.target.value)
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <span>{validateCalculated(line.price * line.quantity)}</span>
                </TableCell>
                <TableCell>
                  <span>
                    {'+' + validateCalculated(deliveryPerPosition[i])}
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    {line.price}
                    <sup>
                      {'+' +
                        validateCalculated(
                          deliveryPerPosition[i] / line.quantity
                        )}
                    </sup>
                  </span>
                </TableCell>
                <TableCell>
                  <span>{validateCalculated(newPrices[i])}</span>
                </TableCell>
                <TableCell>{validateCalculated(newCosts[i])}</TableCell>
                <TableCell>
                  <InlineButton
                    $background={minusIcon}
                    $isInline={true}
                    onClick={() => {
                      removeLine(line.position);
                    }}
                  ></InlineButton>
                </TableCell>
              </TableLine>
            ))}
            <TableLine>
              <TableCell colSpan={10}>
                <InlineButton
                  $background={plusIcon}
                  $isInline={true}
                  onClick={() => {
                    addLine();
                  }}
                ></InlineButton>
              </TableCell>
            </TableLine>
            <TableLine>
              <TableCell colSpan={4}>ИТОГО:</TableCell>
              <TableCell>{validateCalculated(totalNettoPrice)}</TableCell>
              <TableCell>
                {validateCalculated(
                  deliveryPerPosition.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                {validateCalculated(
                  newCosts.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
                )}
              </TableCell>
              <TableCell></TableCell>
            </TableLine>
          </tbody>
        </TableStyled>
      </main>
      <Footer>
        <span>{version}</span>
        <a href="https://github.com/Maltsau" target="_blank">
          <FooterLink $background={gitIcon} />
        </a>
      </Footer>
    </>
  );
}

export default App;

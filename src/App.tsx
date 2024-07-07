import styled from 'styled-components';

import plusIcon from './assets/plus.svg';
import minusIcon from './assets/minus.svg';

import { useStore } from './store';

const Header = styled.header`
  padding: 10px 0;
  display: flex;
  gap: 10px;
`;

const TableStyled = styled.table`
  min-width: 100%;
  margin: 0 auto;
  text-align: center;
  border: 1px solid black;
  border-collapse: collapse;
`;

const TableHead = styled.thead``;

const TableLine = styled.tr``;

const TableCell = styled.td`
  border: 1px solid black;
  margin: 0;
  padding: 10px;
`;

const InlineButton = styled.div<{ $background: string }>`
  margin: 0px auto;
  background-image: url(${(props) => props.$background});
  background-repeat: no-repeat;
  background-position: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

function App() {
  const delivery = useStore((state) => state.delivery);
  const lines = useStore((state) => state.lines);
  const setDelivery = useStore((state) => state.setDelivery);
  const addLine = useStore((state) => state.addLine);
  const removeLine = useStore((state) => state.removeLine);
  const changeDatum = useStore((state) => state.changeDatum);

  const handlePriceChange = (position: number, value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = formattedValue.split('.');
    if (decimalPart && decimalPart.length > 2) {
      changeDatum(
        'price',
        position,
        parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`)
      );
    } else {
      changeDatum('price', position, parseFloat(formattedValue));
    }
  };

  const handleDeliveryChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = formattedValue.split('.');
    if (decimalPart && decimalPart.length > 2) {
      setDelivery(parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`));
    } else {
      setDelivery(parseFloat(formattedValue));
    }
  };

  const validateCalculated = (value: number) => {
    if (value && !isNaN(value)) return value;
    else return 0;
  };

  // const handleNumericInput = (position?: number, value: string, callBack: ())

  const totalNettoPrice = lines.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.quantity * currentValue.price,
    0
  );

  const deliveryPerPosition = lines.map(
    (line) => (line.price * line.quantity * delivery) / totalNettoPrice
  );

  return (
    <>
      <Header>
        <div>Введите стоимость Вашей доставки в это поле:</div>
        <input
          type="number"
          onChange={(e) => handleDeliveryChange(e.target.value)}
        />
      </Header>
      <main>
        <TableStyled>
          <TableHead>
            <TableLine>
              <TableCell>№ п/п</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Стоимость</TableCell>
              <TableCell>Наценка на позицию</TableCell>
              <TableCell>Наценка на единицу</TableCell>
              <TableCell>Новая цена</TableCell>
              <TableCell>Действие</TableCell>
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
                    value={line.price === 0 ? '' : line.price}
                    onChange={(e) =>
                      handlePriceChange(line.position, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    step="any"
                    value={line.quantity === 0 ? '' : line.quantity}
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
                    {'+' +
                      validateCalculated(deliveryPerPosition[i]).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    {'+' +
                      validateCalculated(
                        deliveryPerPosition[i] / line.quantity
                      ).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    {validateCalculated(
                      line.price + deliveryPerPosition[i] / line.quantity
                    ).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <InlineButton
                    $background={minusIcon}
                    onClick={() => {
                      removeLine(line.position);
                    }}
                  ></InlineButton>
                </TableCell>
              </TableLine>
            ))}
            <TableLine>
              <TableCell>
                <InlineButton
                  $background={plusIcon}
                  onClick={() => {
                    addLine();
                  }}
                ></InlineButton>
              </TableCell>
            </TableLine>
            <TableLine>
              <TableCell colSpan={4}>ИТОГО:</TableCell>
              <TableCell>
                {validateCalculated(totalNettoPrice).toFixed(2)}
              </TableCell>
              <TableCell>
                {validateCalculated(
                  deliveryPerPosition.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
                ).toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableLine>
          </tbody>
        </TableStyled>
      </main>
    </>
  );
}

export default App;

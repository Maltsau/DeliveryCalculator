import styled from 'styled-components';

import { useStore } from './store';

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
      <span>{JSON.stringify(delivery)}</span>
      <span>{JSON.stringify(deliveryPerPosition)}</span>
      <div>
        <input
          type="number"
          step="any"
          onChange={(e) => handleDeliveryChange(e.target.value)}
        />
      </div>
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
                  {'+' + validateCalculated(deliveryPerPosition[i]).toFixed(2)}
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
                <button
                  onClick={() => {
                    removeLine(line.position);
                  }}
                >
                  Remove
                </button>
              </TableCell>
            </TableLine>
          ))}
          <TableLine>
            <TableCell>
              <button
                onClick={() => {
                  addLine();
                }}
              >
                Add Line
              </button>
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
    </>
  );
}

export default App;

import styled from 'styled-components';
import { useEffect } from 'react';

import plusIcon from '/plus.svg';
import minusIcon from '/minus.svg';
import muteIcon from '/mute.png';
import unmuteIcon from '/unmute.svg';

import { useStore } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import { InlineButton } from './components/commonElements';

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
  & td:nth-child(1) {
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

const TableCell = styled.td<{ $isMuted: boolean }>`
  border: 1px solid black;
  margin: 0;
  padding: 10px;
  text-decoration: ${(props) => (props.$isMuted ? 'line-through' : 'none')};
  color: ${(props) => (props.$isMuted ? 'gray !important' : 'black')};
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function App() {
  const delivery = useStore((state) => state.delivery);
  const lines = useStore((state) => state.lines);
  const isAdvansedMode = useStore((state) => state.isAdvansedMode);
  const addLine = useStore((state) => state.addLine);
  const removeLine = useStore((state) => state.removeLine);
  const changeDatum = useStore((state) => state.changeDatum);
  const setAdvansedMode = useStore((state) => state.setAdvansedMode);
  const toggleMuteLine = useStore((state) => state.toggleMuteLine);

  const handlePriceChange = (position: number, value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, '');
    const [integerPart, decimalPart] = formattedValue.split('.');
    const finalValue =
      decimalPart && decimalPart.length > 2
        ? parseFloat(`${integerPart}.${decimalPart.slice(0, 2)}`)
        : parseFloat(formattedValue);

    changeDatum('price', position, isNaN(finalValue) ? 0 : finalValue);
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
      <Header />
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
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  {line.position}
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  {line.isMuted && isAdvansedMode ? (
                    line.description
                  ) : (
                    <input
                      value={line.description}
                      onChange={(e) => {
                        changeDatum(
                          'description',
                          line.position,
                          e.target.value
                        );
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  {line.isMuted && isAdvansedMode ? (
                    line.price
                  ) : (
                    <input
                      type="number"
                      step="any"
                      value={line.price}
                      onChange={(e) =>
                        handlePriceChange(line.position, e.target.value)
                      }
                    />
                  )}
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  {line.isMuted && isAdvansedMode ? (
                    line.quantity
                  ) : (
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
                  )}
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  <span>{validateCalculated(line.price * line.quantity)}</span>
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  <span>
                    {'+' + validateCalculated(deliveryPerPosition[i])}
                  </span>
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
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
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  <span>{validateCalculated(newPrices[i])}</span>
                </TableCell>
                <TableCell
                  $isMuted={line.isMuted && isAdvansedMode ? true : false}
                >
                  {validateCalculated(newCosts[i])}
                </TableCell>
                <TableCell $isMuted={false}>
                  <div>
                    {isAdvansedMode &&
                      (line.isMuted ? (
                        <InlineButton
                          $background={unmuteIcon}
                          $isInline={true}
                          onClick={() => {
                            toggleMuteLine(line.position);
                          }}
                        ></InlineButton>
                      ) : (
                        <InlineButton
                          $background={muteIcon}
                          $isInline={true}
                          onClick={() => {
                            toggleMuteLine(line.position);
                          }}
                        ></InlineButton>
                      ))}
                    <InlineButton
                      $background={minusIcon}
                      $isInline={true}
                      onClick={() => {
                        removeLine(line.position);
                      }}
                    ></InlineButton>
                  </div>
                </TableCell>
              </TableLine>
            ))}
            <TableLine>
              <TableCell colSpan={10} $isMuted={false}>
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
              <TableCell colSpan={4} $isMuted={false}>
                ИТОГО:
              </TableCell>
              <TableCell $isMuted={false}>
                {validateCalculated(totalNettoPrice)}
              </TableCell>
              <TableCell $isMuted={false}>
                {validateCalculated(
                  deliveryPerPosition.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
                )}
              </TableCell>
              <TableCell $isMuted={false}></TableCell>
              <TableCell $isMuted={false}></TableCell>
              <TableCell $isMuted={false}>
                {validateCalculated(
                  newCosts.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
                )}
              </TableCell>
              <TableCell $isMuted={false}></TableCell>
            </TableLine>
          </tbody>
        </TableStyled>
      </main>
      <Footer />
    </>
  );
}

export default App;

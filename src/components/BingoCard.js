import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const BingoCard = ({ cards, idx }) => {
  console.log(cards);
  return (
    <div>
      {cards.map((cardObj, index) => (
        <TableContainer component={Paper} key={index}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={cardObj.card[0].length} align="center">
                  {idx + 1} <strong>Playcard Token: </strong>
                  {cardObj.pctoken}
                </TableCell>
              </TableRow>
              {cardObj.card.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    // const isGreen = cardObj.greenNumbers.includes(cell);
                    return (
                      <TableCell
                        key={cellIndex}
                        align="center"
                        style={{
                          fontWeight: rowIndex === 0 ? "bold" : "normal",
                          //   backgroundColor: isGreen ? "green" : "white",
                        }}
                      >
                        {cell}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </div>
  );
};

export default BingoCard;

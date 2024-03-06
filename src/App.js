import "./App.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BasicCard from "./components/BingoCard";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const gameCode = "yIh5fvuJ";
  const [cards, setCards] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [, forceUpdate] = useState();
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://www.hyeumine.com/getcard.php?bcode=yIh5fvuJ"
      );
      return response;
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  const checkWinnerData = async (player) => {
    const checkwin = await axios.get(
      `http://www.hyeumine.com/checkwin.php?playcard_token=${
        player.cards[player.cards.length - 1].pctoken
      }`
    );
    if (checkwin.data === 1 && !winner) {
      setWinner(player.name);
      alert(
        `${player.name}, [${
          player.cards[player.cards.length - 1].pctoken
        }] won!`
      );
    }
  };

  useEffect(() => {
    if (tokens.length > 0) {
      const interval = setInterval(() => {
        for (const player of players) {
          if (player.cards.length > 0) {
            checkWinnerData(player);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tokens, players]);

  const addCard = async () => {
    try {
      const cardData = await fetchData();
      const data = cardData.data;
      if (data.card && data.playcard_token !== "") {
        const transformedCard = transformCardData(data.card);
        const cardObjects = {
          pctoken: data.playcard_token,
          card: transformedCard,
        };
        setTokens((prevTokens) => [...prevTokens, data.playcard_token]);
        setCards((prevCards) => [
          ...prevCards,
          { pctoken: data.playcard_token, card: transformedCard },
        ]);
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const transformCardData = (cardData) => {
    const card = [["B", "I", "N", "G", "O"]];
    for (let i = 0; i < 5; i++) {
      const row = [];
      Object.keys(cardData).forEach((key) => {
        row.push(cardData[key][i]);
      });
      card.push(row);
    }
    return card;
  };

  const addPlayer = () => {
    setPlayers([
      ...players,
      { name: `Player ${players.length + 1}`, cards: [] },
    ]);
  };

  useEffect(() => {
    addCard();
  }, [players]);

  const addCardToPlayer = (playerIndex) => {
    const playerTokens = players[playerIndex].cards.map((card) => card.pctoken);
    if (playerTokens.includes(tokens[tokens.length - 1])) {
      alert("This card has already been added to this player.");
      return;
    }
    setPlayers(
      players.map((player, index) => {
        if (index === playerIndex) {
          return {
            ...player,
            cards: [...player.cards, cards[cards.length - 1]],
          };
        }
        return player;
      })
    );
  };

  console.log(players);
  return (
    <div
      className="App"
      style={{ backgroundColor: "#f0f0f0", padding: "20px" }}
    >
      <h1>GAME CODE: {gameCode}</h1>
      <button
        onClick={addPlayer}
        style={{
          padding: "10px 20px",
          margin: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add Player
      </button>
      {players.map((player, index) => (
        <div key={index}>
          <h2>{player.name}</h2>
          <button
            onClick={() => addCardToPlayer(index)}
            style={{
              padding: "5px 10px",
              margin: "5px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Card
          </button>
          <Box sx={{ flexGrow: 1, margin: "2rem" }}>
            <Grid container spacing={2}>
              {player.cards.map((card, cardIndex) => (
                <React.Fragment key={cardIndex}>
                  {cardIndex % 3 === 0 && <Grid item xs={12}></Grid>}
                  <Grid item xs={4}>
                    <BasicCard cards={[card]} idx={cardIndex} />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        </div>
      ))}
    </div>
  );
}

export default App;

import React, { useState } from "react";
import Board from "./Board";
import "./Chat.css";
import { Window, MessageList, MessageInput } from "stream-chat-react";
function Game({ channel, setChannel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel.state.watcher_count === 2
  );
  const [result, setResult] = useState({ winner: "none", state: "none" });

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2);
  });

  if (!playersJoined) {
    return <div>Waiting for another player to join</div>;
  }

  return (
    <div className="gameContainer">
      <Board result={result} setResult={setResult} />
      <Window>
        <MessageList
          disableDateSeparator
          hideDeletedMessages
          closeReactionSelectorOnClick
          messageActions={["react"]}
        />
        <MessageInput noFiles />
        <button
          onClick={async () => {
            await channel.stopWatching();
            setChannel(null);
          }}
        >
          Leave Game
        </button>
        {result.state === "won" && <div> {result.winner} won the game </div>}
        {result.state === "tie" && <div> Game Tied </div>}
      </Window>
    </div>
  );
}

export default Game;

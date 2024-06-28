import React, { useState } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";
import CustomInput from "./CustomInput";

function JoinGame({ apiUrl }) {
  const [rivalUsername, setRivalUsername] = useState("");
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  const createChannel = async () => {
    try {
      // Backend API call to validate user or other tasks
      const backendResponse = await fetch(`${apiUrl}/validate-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: rivalUsername }),
      });

      if (!backendResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await backendResponse.json();

      if (!data.exists) {
        alert("User Not Found");
        return;
      }

      // Step 2: Stream Chat API call to query users
      const streamResponse = await client.queryUsers({
        name: { $eq: rivalUsername },
      });

      if (streamResponse.users.length === 0) {
        alert("User Not Found");
        return;
      }

      const newChannel = await client.channel("messaging", {
        members: [client.userID, streamResponse.users[0].id],
      });

      await newChannel.watch();
      setChannel(newChannel);
    } catch (error) {
      console.error("Error creating channel:", error);
      alert("An error occurred while creating the channel.");
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <h4>Create Game</h4>
          <input
            placeholder="Username of Rival"
            onChange={(event) => {
              setRivalUsername(event.target.value);
            }}
          />
          <button onClick={createChannel}>Join/Start Game</button>
        </div>
      )}
    </>
  );
}

export default JoinGame;

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { Link } from "react-router";

import * as messageService from "../../services/messageService.js";

const UserConversations = () => {
  const { user } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const conversationData = await messageService.getConversations(user._id);
      setConversations(conversationData);
    };
    fetchConversations();
  }, [user]);

  const getOtherUser = (participants) => {
    return participants.find((participant) => participant._id !== user._id);
  };

  return (
    <main>
      <h2>Your Conversations</h2>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {conversations.map((convo) => {
            const otherUser = getOtherUser(convo.participants);
            const lastMessage = convo.messages[0];

            return (
              <li key={convo._id}>
                <Link to={`/messages/${convo._id}`}>
                  <h4>{otherUser.username}</h4>
                  <p>{lastMessage?.message || "No messages yet"}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default UserConversations;

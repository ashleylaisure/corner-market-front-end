import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";

import * as messageService from "../../services/messageService.js";
import UserConversations from "../UserConversations/UserConversations.jsx";

const ConversationDetails = () => {
  const { user } = useContext(UserContext);
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const AllMessages = await messageService.getMessages(
          conversationId,
          user._id
        );

        setMessages(AllMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, user._id]);

  return (
    <main>
      <div>
        <UserConversations />
      </div>

      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            {msg.senderId._id === user._id ? "You" : msg.senderId.username}:{" "}
            {msg.message}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ConversationDetails;

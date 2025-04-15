import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";

import * as messageService from "../../services/messageService.js";
import UserConversations from "../UserConversations/UserConversations.jsx";

const ConversationDetails = () => {
  const { user } = useContext(UserContext);
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const allMessages = await messageService.getMessages(
          conversationId,
          user._id
        );
        setMessages(allMessages);

        if (allMessages.length > 0) {
          const first = allMessages[0];
          const other =
            first.senderId._id === user._id ? first.receiverId : first.senderId;
          setOtherUser(other);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, user._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      await messageService.sendMessage(conversationId, {
        senderId: user._id,
        receiverId: otherUser._id,
        message: newMessage,
      });

      const updatedMessages = await messageService.getMessages(
        conversationId,
        user._id
      );
      setMessages(updatedMessages);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

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

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a Message"
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
};

export default ConversationDetails;

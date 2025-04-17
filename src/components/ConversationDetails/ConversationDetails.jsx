import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";

import * as messageService from "../../services/messageService.js";
import UserConversations from "../UserConversations/UserConversations.jsx";

import styles from './ConversationDetails.module.css'
import defaultPhoto from '../../assets/images/default-profile-picture.png'

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

        const conversation = await messageService.getConversation(
          conversationId
        );
        const other = conversation.participants.find((p) => p._id !== user._id);
        setOtherUser(other);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, user._id]);

  console.log(messages);

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
    <main className={styles.container}>
      <div className={styles.containerBackdrop}>
        <div>
          <UserConversations />
        </div>

        <div className={styles.rightContainer}>

          <div className={styles.topRight}>
            <div className={styles.sentContainer}>
              <img src={defaultPhoto} alt="default user photo"/>
              <h4>{otherUser?.username}</h4>
            </div>
            <div className={styles.sectionDivider}></div>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.messageingCentral}>
              <ul className={styles.convoCentral}>
                {messages.map((msg) => (
                  <li key={msg._id} className={msg.senderId._id === user._id ? styles.userSent : styles.otherUserSent}>
                    {/* {msg.senderId._id === user._id ? "You" : msg.senderId.username}:{" "} */}
                    <h5>{msg.message}</h5>
                  </li>
                ))}
              </ul>
      

              <div >
                <form onSubmit={handleSendMessage} className={styles.sendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                  />
                  <button type="submit"><p>Send</p></button>
                </form>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  );
};

export default ConversationDetails;

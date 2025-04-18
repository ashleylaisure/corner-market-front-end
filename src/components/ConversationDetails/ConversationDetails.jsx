import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";

import * as messageService from "../../services/messageService.js";
import * as userService from "../../services/userService.js";
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
        await messageService.markMessagesAsRead(conversationId, user._id);

        const allMessages = await messageService.getMessages(
          conversationId,
          user._id
        );
        setMessages(allMessages);

        const conversation = await messageService.getConversation(
          conversationId
        );
        const other = conversation.participants.find((p) => p._id !== user._id);
        // console.log("10", other)
        const userProfile = await userService.getUserProfile(other._id);
        // console.log("userProfile,", userProfile)

        setOtherUser(userProfile);

      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, user._id]);

  console.log("now this", otherUser)

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      await messageService.sendMessage(conversationId, {
        senderId: user._id,
        receiverId: otherUser.user._id,
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
        <div className={styles.jointContainer}>
          <UserConversations />
        

        <div className={styles.rightContainer}>

          <div className={styles.topRight}>
            <div className={styles.sentContainer}>
              {/* <img src={defaultPhoto} alt="default user photo"/> */}
              <img src={ 
                otherUser?.user?.profile?.profilePicture 
                    ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${otherUser.user.profile.profilePicture}`
                    : defaultPhoto
                    } alt={`${otherUser?.user?.username || '' }'s profile pic`}

              />
              {otherUser && otherUser.user &&
                <Link to={`/users/${otherUser.user._id}`}>
                  {otherUser.user.username}'s Profile
                </Link>
              }

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

      </div>

    </main>
  );
};

export default ConversationDetails;

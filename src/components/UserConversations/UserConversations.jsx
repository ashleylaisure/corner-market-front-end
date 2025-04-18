import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext.jsx";
import { Link, useLocation, matchPath } from "react-router";
import styles from "./UserConversations.module.css";
import defaultPhoto from "../../assets/images/default-profile-picture.png";

import * as messageService from "../../services/messageService.js";

import * as userService from "../../services/userService.js";
import { GiConsoleController } from "react-icons/gi";


const UserConversations = () => {
  const { user } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [sender, setSender] = useState([])
  

  const location = useLocation();
  // check if path matches /messages/:conversationId
  const userMessages = matchPath(
    "/messages/:conversationId",
    location.pathname
  );

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

  useEffect(() => {
    const fetchOtherUser = async () => {

      try {
        const userListPromises = conversations.map(async (convo) => {
          const otherUserId = getOtherUser(convo.participants);
          // console.log("1", otherUserId)
          
          const userProfile = await userService.getUserProfile(otherUserId._id);
          // console.log("2", userProfile)

          return userProfile.user
        })

        const userList = await Promise.all(userListPromises)
        setSender(userList)

      } catch (error) {
        console.error("Error fetching sent user profile", error)
      }

    }
    
    fetchOtherUser();
  } , [conversations])

  console.log("sender", sender)

  return (
    <div className={styles.container}>

      <main className={styles.containerBackdrop}>

        <div className={styles.userConversations}>
          <h4>Your Conversations</h4>
          {conversations.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            <ul >
              {conversations.map((convo) => {
                const lastMessage = convo.messages[0];

                const otherUserId = getOtherUser(convo.participants)
                // console.log("otherUser", otherUserId)
                const currentSender = sender.find((p) => p._id === otherUserId._id);

                // console.log("sender", currentSender)

                return (
                  <li key={convo._id} >
                    <Link to={`/messages/${convo._id}`}>


                    <div className={styles.userConvoContainer}>
                      {/* <img src={defaultPhoto} alt="default user photo"/> */}

                      <img src={currentSender?.profile.profilePicture
                          ? `${import.meta.env.VITE_BACK_END_SERVER_URL}${currentSender.profile.profilePicture}`
                          : defaultPhoto
                        } alt={`${currentSender ? currentSender.username : ""}'s profile pic`}
                        />
                      
                      <div className={styles.userConvo}>
                        <h4>{currentSender ? currentSender.username : "loading"}</h4>
                        

                        <h6>{lastMessage?.message || "No messages yet"}</h6>

                      </div>
                    </div>
                      
                      
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {!userMessages &&
          <div className={styles.rightSection}>

            <div className={styles.rightMessage}>
              <i className='bx bxs-message-rounded-edit'></i>
              <h3>Your Messages</h3>
              <h5>Select a Conversation to send a message</h5>
            </div>

        </div>
        }
        

      </main>

    </div>
  );
};

export default UserConversations;

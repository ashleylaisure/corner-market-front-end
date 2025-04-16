const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/conversations`;

//Get all conversations for a user
const getConversations = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const getConversation = async (conversationId) => {
  try {
    const res = await fetch(`${BASE_URL}/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

// Get all messages for a conversation
const getMessages = async (conversationId) => {
  try {
    const res = await fetch(`${BASE_URL}/${conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

// Create or resume conversation with another user
const createOrGetConversation = async (senderId, receiverId) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId, receiverId }),
    });

    return res.json();
  } catch (error) {
    console.error(error);
  }
};

// Send a message to another user
const sendMessage = async (conversationId, messageData) => {
  try {
    const res = await fetch(`${BASE_URL}/${conversationId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export {
  getConversations,
  getMessages,
  sendMessage,
  createOrGetConversation,
  getConversation,
};

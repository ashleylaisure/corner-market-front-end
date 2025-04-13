const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/conversations`;

//Get all conversations for a user
const getConversations = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

export { getConversations, getMessages };

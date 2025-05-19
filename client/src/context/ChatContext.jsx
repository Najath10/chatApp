import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      console.log("Response from /users:", data);
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users", error.response || error);
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
  try {
    const { data } = await axios.get(`/api/messages/${userId}`);
    if (data.success) {
      setMessages(data.messages);
      // Clear unseen message entry for that user
      setUnseenMessages((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  } catch (error) {
    toast.error(error.message);
  }
};


 const sendMessage = async (messageData) => {
  try {
    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData
    );
    console.log("Sending to:", `/api/messages/send/${selectedUser?._id}`);
    if (data.success) {
       console.log("Returned message:", data.newMessage);
      setMessages((prev) => [...prev, data.newMessage]);
    } else {
      toast.error("Failed to send message.");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseeMessages) => ({
          ...prevUnseeMessages,
          [newMessage.senderId]: prevUnseeMessages[newMessage.senderId]
            ? prevUnseeMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getMessages,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

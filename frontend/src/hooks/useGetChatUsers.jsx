import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetChatUsers = () => {
    const [loading, setLoading] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/messages/users");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setChatUsers(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, chatUsers };
};
export default useGetChatUsers;
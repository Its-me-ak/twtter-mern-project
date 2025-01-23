import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsImage, BsEmojiSmile } from "react-icons/bs";
import { MdSend, MdCancel } from "react-icons/md";
import LoadingSpinner from "../common/LoadingSpinner";
import { getSocket } from "../../utils/socket";

const ChatMessageInput = ({ selectedUserId }) => {
    const [message, setMessage] = useState("")
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const queryClient = useQueryClient()

    const { mutate: sendMessage, isPending: isMessageSending } = useMutation({
        mutationFn: async ({text, image}) => {
            try {
                const response = await fetch(`/api/messages/send/${selectedUserId._id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text,
                        image
                    })
                })
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to send message");
                return data;
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
            setMessage('');
            setImagePreview(null);
        },
        onError: (err) => {
            toast.error(err.message || "Failed to send a message");
        }
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const removeImagePreview = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if(!message.trim() && !imagePreview ) return
        sendMessage({ text: message.trim(), image: imagePreview});
        const socket = getSocket();
        if (socket) {
            socket.emit("send_message", {
                recipientId: selectedUserId._id, // ID of the user to send the message to
                message: message.trim(),
            });
        }
    }
    return (
        <div className="p-2 w-full absolute bottom-0 left-0 border-t border-gray-700 bg-base-300">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-28 h-24 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImagePreview}
                            className="absolute top-0 right-1 w-6 h-6 rounded-full bg-black/70
              flex items-center justify-center"
                            type="button"
                        >
                            <MdCancel className="size-5" />
                        </button>
                    </div>
                </div>
            )}
            <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                {/* Left icons */}
                <div className="flex gap-3 text-blue-500">
                    <button type="button" className="hover:text-blue-400"
                    onClick={() => fileInputRef.current?.click()}
                    >
                        <BsImage size={20} />
                    </button>
                    <button type="button" className="hover:text-blue-400">
                        <BsEmojiSmile size={20} />
                    </button>
                </div>

                {/* Input field */}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full input input-bordered rounded-full input-sm sm:input-md bg-base-200 placeholder-gray-400 text-white"
                        placeholder="Start a new message..."
                    />
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!message.trim() && !imagePreview}
                    className="btn btn-circle btn-sm sm:btn-md border-none text-white bg-primary hover:bg-cyan-600"
                >
                    {isMessageSending ? <LoadingSpinner size="sm"/> : <MdSend />}
                  
                </button>
            </form>
        </div>
    );
};

export default ChatMessageInput;

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsImage, BsEmojiSmile } from "react-icons/bs";
import { MdSend, MdCancel } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import EmojiPicker from 'emoji-picker-react';
import { useSocketContext } from "../../context/SoketContext";

const ChatMessageInput = () => {
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const { sendMessage, loading } = useSendMessage()
    const { message, setMessage, showEmojiPicker, setShowEmojiPicker, handleEmojiClick, emojiPickerRef } = useSocketContext()

    useEffect(() => {
        const handler = (event) => {
            if (!emojiPickerRef.current) {
                return;
            }
            if (!emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false)
            }
        }
        document.addEventListener("click", handler, true)

        return () => {
            document.removeEventListener("click", handler)
        }
    }, [])

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
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() && !imagePreview) return
        try {
            await sendMessage({
                text: message.trim(),
                image: imagePreview,
            })
            setMessage('');
            setImagePreview(null);
        } catch (error) {
            toast.error(error.message || "Failed to send a message");
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
                    <button type="button" className="hover:text-blue-400"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
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
                    {showEmojiPicker && (
                        <div className="absolute bottom-16 left-0 z-10" ref={emojiPickerRef}>
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                previewConfig={{ showPreview: false }}
                            />
                        </div>
                    )}
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!message.trim() && !imagePreview}
                    className="btn btn-circle btn-sm sm:btn-md border-none text-white bg-primary hover:bg-cyan-600"
                >
                    {loading ? <LoadingSpinner size="sm" /> : <MdSend />}

                </button>
            </form>
        </div>
    );
};

export default ChatMessageInput;

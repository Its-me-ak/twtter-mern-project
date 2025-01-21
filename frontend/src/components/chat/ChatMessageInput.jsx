import { BsImage, BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";

const ChatMessageInput = () => {
    return (
        <div className="p-2 w-full absolute bottom-0 left-0 border-t border-gray-700 bg-base-300">
            <form className="flex items-center gap-2">
                {/* Left icons */}
                <div className="flex gap-3 text-blue-500">
                    <button type="button" className="hover:text-blue-400">
                        <BsImage size={20} />
                    </button>
                    <button type="button" className="hover:text-blue-400">
                        <BsEmojiSmile size={20} />
                    </button>
                </div>

                {/* Input field */}
                <div className="flex-1">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-full input-sm sm:input-md bg-base-200 placeholder-gray-400 text-white"
                        placeholder="Start a new message..."
                    />
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    className="btn btn-circle btn-sm sm:btn-md border-none text-white"
                >
                    <MdSend/>
                </button>
            </form>
        </div>
    );
};

export default ChatMessageInput;

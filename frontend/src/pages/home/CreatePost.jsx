import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';
import { useSocketContext } from "../../context/SoketContext";


const CreatePost = () => {
  const { emojiPickerRef, showEmojiPicker, setShowEmojiPicker } = useSocketContext()
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"]
  })

  const queryClient = useQueryClient()

  const { mutate: createPost, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, image }) => {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, image }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create post");
      return data;
    },
    onSuccess: () => {
      setText("");
      setImage(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({
      text,
      image,
    });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji)
  }

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

  const navigate = useNavigate()
  const isDisabled = !text && !image

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      <div className='avatar cursor-pointer' onClick={() => navigate(`/profile/${authUser.user.username}`)}>
        <div className='w-8 rounded-full'>
          <img src={authUser?.user?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        <textarea
          className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
          placeholder='What is happening?!'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {image && (
          <div className='relative w-72 mx-auto'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
              onClick={() => {
                setImage(null);
                imgRef.current.value = null;
              }}
            />
            <img src={image} className='w-full mx-auto h-72 object-contain rounded' />
          </div>
        )}

        <div className='flex justify-between border-t py-2 border-t-gray-700 relative'>
          <div className='flex gap-1 items-center'>
            <CiImageOn
              className='fill-primary w-6 h-6 cursor-pointer'
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer'
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            />
          </div>
          <input type='file'
            accept="image/*"
            hidden ref={imgRef} onChange={handleImgChange} />
          <button className='btn btn-primary rounded-full btn-sm text-white px-4'
            disabled={isDisabled}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-0 left-0 z-10" ref={emojiPickerRef}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>
        {isError && <div className='text-red-500'>{error.message}</div>}
      </form>
    </div>
  );
};
export default CreatePost;
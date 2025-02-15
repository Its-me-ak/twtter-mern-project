import { Link } from "react-router-dom";
import { useState } from "react";
import XSvg from "../../../components/svg/X";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { QueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const queryClient = new QueryClient()
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });
    // useMutation() - when modifying the data
    // useQuery() - when fetching the data
    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, fullName, password }),
                // usecase: when we want to send data to the server using api we have to send it in string format using stringify
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to create account");
            console.log(data);
            return data;
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to register user');
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            // refetch the authUser data as stale
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData)
        console.log(formData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <XSvg className=' lg:w-2/3 fill-white' />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow '
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                        <button
                            type='button'
                            onClick={togglePasswordVisibility}
                            className='flex items-center justify-center'
                        >
                            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </button>
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? 'Loading...' : 'Sign Up'}
                    </button>
                    {isError && <p className='text-red-500 text-sm'>{error.message}</p>}
                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;
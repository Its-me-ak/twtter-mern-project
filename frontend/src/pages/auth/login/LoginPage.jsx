import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svg/X";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

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
          <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>

          <div className='flex gap-4 flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
              <FaUser />
              <input
                type='text'
                className='grow '
                placeholder='Username or email'
                name='username'
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
          <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
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
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </label>
              </div>
          <button className='btn rounded-full btn-primary text-white'>Sign up</button>
          {isError && <p className='text-red-500'>Something went wrong</p>}
        </form>
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>{"Don't"} have an account?</p>
          <Link to='/signup'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
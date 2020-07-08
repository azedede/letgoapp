import React from "react";
import Burger from "./burger";
import Link from "next/link";
const navbar = ({ currentuser }) => {
  return (
    <header
      className='flex justify-center bg-gray-800  text-orange-400 border-b-8 border-red-400 object-cover bg-fixed '
      style={{ backgroundImage: "url(../../shop.jpg)" }}
    >
      <div className='max-w-6xl w-full'>
        <div className=' select-none flex justify-between items-center  w-full px-4 py-4'>
          <div className='flex flex-1 '>
            <img
              src='./logo.png'
              className='select-none sm:w-24 rounded-full border-2 border-red-500 w-12'
              alt='local market logo'
            />
          </div>

          <Burger currentuser={currentuser} />
        </div>
        {/*  className=' w-full h-auto py-32 object-cover bg-fixed flex flex-col justify-center items-center ' */}

        {/* website title */}

        <div className='px-4 py-4 text-gray-400'>
          <h1 className='select-none text-2xl  sm:text-5xl font-extrabold text-orange-500'>
            Reliability, Fast and Accurate!
          </h1>
          <p className=' select-none sm:text-2xl text-gray-400 font-bold'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consectetur labore quia molestias, facere excepturi dolorem esse quo
            laborum sapiente? Ipsa!
          </p>
        </div>

        <div className='relative py-4 my-2 flex'>
          <div>
            <a
              href='/product'
              className='select-none sm:text-2xl mx-2 font-bold bg-transparent border p-4 rounded-tl-full rounded-br-full capitalize text-white hover:bg-white hover:text-gray-900 '
            >
              {" "}
              goto store
            </a>
          </div>
          <div className='select-none bg-gray-300 m absolute rounded-full items-center justify-center flex h-32 w-32 border-8  border-red-400 invisible md:visible right-0'>
            <img
              src='./logo.png'
              className='h-24 w-24 rounded-full '
              alt='local market logo'
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default navbar;

import React from "react";
import { about, testimony } from "../utility/constant";
import Navbar from "../component/nav/navbar";

const index = ({ currentuser }) => {
  const About = () => {
    return about.map((abt) => (
      <div className='h-full bg-gray-100 shadow-xl  rounded-lg select-none '>
        <div className='  flex flex-col justify-center items-center py-2 rounded-lg'>
          <img
            src={abt.image}
            className='sm:h-24 w-24 rounded-full border-2 border-red-500 h-22 w-20'
            alt='local market logo'
          />

          <h1 className=' text-orange-900 text-2xl sm:text-3xl font-extrabold my-2'>
            {abt.title}
          </h1>
          <p className='px-2 text-center text-gray-600'>{abt.description}</p>
        </div>
      </div>
    ));
  };

  const Testimony = () => {
    return testimony.map((tst) => (
      <div className='  select-none  rounded-lg bg-white flex-col flex justify-center items-center py-2 '>
        <img
          src={tst.image}
          className='sm:h-24 sm:w-24 h-22 w-20 rounded-full border '
          alt='local market logo'
        />

        <h1 className='text-gray-900 font-bold sm:text-2xl py-4 '>
          {tst.name}
        </h1>
        <p className=' px-4 font-semibold text-center  text-gray-700'>
          {tst.description}
        </p>
        <p className='italic text-base text-gray-600'>~{tst.role}</p>
      </div>
    ));
  };

  const AboutUs = () => {
    return (
      <div className=' px-4 sm:px-64 mb-2'>
        <p className="text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum magnam
          necessitatibus quis error accusamus autem consequuntur excepturi, sed
          explicabo facilis voluptates ullam fugiat velit iusto eius nostrum rem
          nihil illo vitae voluptate officia hic, voluptatum vero suscipit.
          Ipsam reiciendis minima quibusdam. Eligendi laboriosam aut nobis
          recusandae eaque repellat explicabo saepe!
        </p>
      </div>
    );
  };

  return (
    <div>
      <Navbar currentuser={currentuser} />
      {/* About section */}
      <div className=' flex flex-col  justify-center items-center py-6 sm:py-40'>
        <div className=' max-w-6xl w-full'>
          <h1 className='text-center select-none text-gray-900 text-xl  sm:text-2xl font-bold underline'>
            About <span className='text-orange-500'>us</span>
          </h1>
          {AboutUs()}
          <h1 className='text-center select-none text-gray-900 text-xl  sm:text-2xl font-bold underline'>
            How it <span className='text-orange-500'>works?</span>
          </h1>

          <div className=' grid-3 px-2'>{About()}</div>
        </div>
      </div>

      {/* Testimony section */}

      <div
        className=' select-none flex flex-col justify-center items-center bg-gray-900 sm:pb-20 border-t-8 border-red-400 object-cover bg-fixed '
        style={{ backgroundImage: "url(../../shop.jpg)" }}
      >
        <div className=' w-full max-w-6xl px-2 sm:px-2'>
          <div className='relative py-4'>
            <h1 className=' select-none text-xl sm:text-3xl text-orange-500 font-bold '>
              Testimonies
            </h1>
            <div className='bg-gray-300 m absolute rounded-full items-center justify-center flex h-32 w-32 border-8  border-red-400 invisible md:visible right-0 bottom-0'>
              <img
                src='./logo.png'
                className='h-24 w-24 rounded-full '
                alt='local market logo'
              />
            </div>
          </div>

          <div className=' grid-3 py-2'>{Testimony()}</div>
        </div>
      </div>
      {/*  footer */}
   
    </div>
  );
};

export default index;

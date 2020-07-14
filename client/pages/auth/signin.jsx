import React, { useState, Fragment } from "react";
import useRequest from "../../hooks/use-request";

import { returnMessage, clearMessage } from "../../action/error";
import Router from "next/router";
import { connect } from "react-redux";
import Link from 'next/link'

const Signin = ({ message, returnMessage, currentuser,ctx }) => {
  const [input, setinput] = useState({
    email: "",
    password: "",
  });
//console.log(ctx);

  //request hooks
  const { doRequest } = useRequest({
    body: { email: input.email, password: input.password },
    method: "post",
    url: "/api/user/signin",
    onSuccess: (data) => {
    data && location.reload();
    },
    onError: ({ msg, status }) => returnMessage(msg, status),
  });

  //onchange text
  const onChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  //login user
  const onLogin = () => {
    if (input.email === "" && input.password === "") return;
    doRequest();
  };
  return (
    <div className='h-screen'>
      <p
        className={
          message.msg &&
          "transition duration-700 ease-in-out  transform -translate-y-1 scale-100"
        }
      >
       
      </p>
      <div className='flex flex-col justify-center items-center '>
        <div className=' max-w-6xl flex flex-col w-full'>
          <a
            href=''
            className=' text-gray-500 hover:underline text-lg p rounded  w-16 ml-4 sm:ml-0'
          >
            Home
          </a>
        </div>
        <div className=' max-w-6xl w-full '>
          <h1 className='text-4xl sm:text-6xl text-gray-900 font-bold px-2 sm:px-0 ml-2 sm:ml-0'>
            Login
          </h1>

          <div className='grid-2 px-2 sm:px-0 py-16'>
            <div className=' hidden sm:block text-center bg-gray-100 shadow-xl py-16'>
              <h1 className='font-bold text-gray-900 text-xl sm:text-2xl capitalize my-4'>
                Get accross all buyer arcross every states{" "}
              </h1>
              <p className='px-4 text-center text-gray-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias iure quibusdam esse fugit debitis ipsa itaque maxime
                ipsum. Porro sint sit rerum debitis blanditiis sunt error
                perferendis fugit possimus ullam.
              </p>
            </div>
            <div className='max-w-xs  sm:block ml-4 sm:ml-0 '>
              <form>
                <div className='mb-4'>
                  <label htmlFor='email' className='text-gray-500 font-bold'>
                    Email
                  </label>
                  <input 
                    onChange={onChange}
                    name='email'
                    type='email'
                    placeholder='email'
                    className=' focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none focus:shadow-outline appearance-none'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='text-gray-500 font-bold'>
                    Password
                  </label>
                  <input
                    onChange={onChange}
                    name='password'
                    type='password'
                    placeholder='password'
                    className='focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none focus:shadow-outline appearance-none'
                  />
                </div>
                <a className='text-right text-green-600 '>forget password?</a>
                <input
                  onClick={onLogin}
                  type='button'
                  value='Login'
                  className='bg-blue-600 py px w-full text-gray-200 hover:bg-blue-400 rounded'
                />
              </form>
              <p className='text-gray-500'>
                Don't have an account?{" "}
               <Link href='/auth/signup' >
               <a className='text-green-600'> Sign up.</a>
               </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  message: state.message,
});

Signin.getInitialProps = async (context, client, currentuser) => {
  //check and return if req header is undefined
  console.log(context);
  
    if (currentuser!==null) {
    context.res.writeHead(301, { Location: "/profile" });
    context.res.end();
  }  
     return{}
 
};

export default connect(mapStateToProps, { returnMessage })(
  Signin
);

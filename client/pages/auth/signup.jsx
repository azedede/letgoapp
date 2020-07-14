import React, { useState, Fragment } from "react";
import { returnMessage, clearMessage } from "../../action/error";
import { connect } from "react-redux";
import useRequest from "../../hooks/use-request";

import Link from "next/link";
import Router from "next/router";
const Signup = (props) => {
  const [input, setinput] = useState({
    name:"",
    email: "",
    password: "",
    password2: "", 
  });
  const { returnMessage, message } = props;

  //hooks
  const { doRequest } = useRequest({
    body: {
      name:input.name,
      email: input.email,
      password: input.password,
      password2: input.password2,
    },
    method: "post",
    onSuccess: (data) => {
      returnMessage("registration successful.please login", 201);
      setinput({ ...input, email: "", password: "", password2: "" });
      Router.push("/auth/signin");
    },

    url: "/api/user/signup",
    onError: ({ msg, status }) => returnMessage(msg, status),
  });

  const onChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  //creating account
  const createAccount = (e) => {
    doRequest();
  };

  //jsx rendering
  return (
    <div className='h-screen '>
      <p
        className={
          message.msg &&
          "transition duration-500 ease-in-out  transform -translate-y-1 scale-100"
        }
      >
       
      </p>
      <div className='flex flex-col justify-center items-center '>
        <div className=' max-w-6xl flex flex-col w-full '>
          <button className='bg-red-400 text-white p rounded ml-4 sm:ml-0 w-16 '>
            Home
          </button>
        </div>
        <div className=' max-w-6xl'>
          <h1 className='text-4xl pb-8 sm:pb-0 sm:text-4xl text-gray-900 font-bold px-2 sm:px-0 ml-2 sm:ml-0'>
            Create an Account
          </h1>

          <div className='grid-2 px-2 sm:px-0'>
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

            <div className='max-w-xs  sm:block '>
              <div className=''>
                <form>
                  <div className='mb-4'>
                    <label htmlFor='email' className='text-gray-500 font-bold'>
                      Full name
                    </label>
                    <input
                      value={input.name}
                      onChange={onChange}
                      name='name'
                      type='text'
                      placeholder='full name'
                      className=' focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none focus:shadow-outline appearance-none'
                    />
                  </div> 
                  <div className='mb-4'>
                    <label htmlFor='email' className='text-gray-500 font-bold'>
                      Email
                    </label>
                    <input
                      value={input.email}
                      onChange={onChange}
                      name='email'
                      type='email'
                      placeholder='email'
                      className=' focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none focus:shadow-outline appearance-none'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='password'
                      className='text-gray-500 font-bold'
                    >
                      Password
                    </label>
                    <input
                      value={input.password}
                      onChange={onChange}
                      name='password'
                      type='password'
                      placeholder='password'
                      className='focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none focus:shadow-outline appearance-none'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='password'
                      className='text-gray-500 font-bold'
                    >
                      repeat password
                    </label>
                    <input
                      value={input.password2}
                      onChange={onChange}
                      name='password2'
                      type='password'
                      placeholder='password'
                      className='focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none focus:shadow-outline appearance-none'
                    />
                  </div>

                  <input
                    onClick={createAccount}
                    type='button'
                    value='create'
                    className='bg-blue-600 py px w-full text-gray-200 hover:bg-blue-400 rounded'
                  />
                </form>
                <p className='text-gray-500'>
                  Already have an account?{" "}
                  <Link href='/auth/signin'>
                    <a className='text-green-600'>Sign In.</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//redux state props
const mapstateToProps = (state) => ({
  message: state.message,
});

 //next ssr
Signup.getInitialProps = (context, client, currentuser) => {
  //check and return if req header is undefined

  if (currentuser !== null) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
  }

  return {};
};

export default connect(mapstateToProps, { returnMessage })(
  Signup
);

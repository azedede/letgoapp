import { connect } from "react-redux";
import React from "react";
import { clearMessage } from "../../action/error";

const Alert = ({ message, clearMessage }) => {
  if (!message.msg) return <div className=''></div>;
  console.log(message);

  if (Array.isArray(message.msg)) {
    //true
    return (
      <div
        className=' flex z-20 relative justify-between items-center bg-red-100 border border-red-400 text-red-800  font-bold pl-1 bg-transparent fixed w-full px-4'
        role='alert'
      >
        <div className='flex flex-col w-full'>
          <strong className=' font-extrabold'>OOPs...</strong>
          <ul className=''>
            {message.msg.map((msg) => {
              return (
                <li key={msg.feild} className='font-extrabold '>
                  {msg.message}
                </li>
              );
            })}
          </ul>
        </div>
        <svg
        onClick={clearMessage}
          class='fill-current h-6 w-6 text-red-500'
          role='button'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <title>Close</title>
          <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
        </svg>
      </div>
    );
  }
  //false
  else if (message.status === 200 || 201) {
    return (
      <div className=' flex z-20 font-extrabold justify-between items-center bg-green-200 border border-green-900 text-green-900 px-1 font-bold fixed w-full '>
        <p className='font-extrabold '>{message.msg}</p>
        <button className=' ' onClick={clearMessage}>
          X
        </button>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  message: state.message,
});

export default connect(mapStateToProps, { clearMessage })(Alert);

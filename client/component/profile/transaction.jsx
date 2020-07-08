import React from "react";
import { Transaction } from "../../utility/constant";

const transaction = () => {
  const myOrder = () => {
    return Transaction.map((trans) => {
      return (
        <div className='px-4 btranser-b-2 p'>
          <p className='text-gray-900 text-sm'><span className="text-red-700 font-bold">referenceId</span>: #{trans.referenceId}</p>
          <h1 className='font-bold text-xl'>{trans.title}</h1>
          <h1 className='font-bold text-gray-600'>${trans.price}</h1>
        </div>
      );
    });
  };

  return (
    <div className='border-dotted border border-gray-700 px-2'>
      <h1 className='font-bold text-gray-900 text-2xl my-4'>Transactions</h1>
      {myOrder()}
    </div>
  );
};

export default transaction;

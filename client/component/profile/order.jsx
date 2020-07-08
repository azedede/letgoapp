import React from "react";
import { order } from "../../utility/constant";

const Order = ({ orders }) => {
  console.log(orders);

  const myOrder = () => {
    if (orders.length === 0) return <p>you have no order at the moment</p>;
    let orderStatus;
    return orders.reverse().map((ord) => {
      if (ord.orderStatus === "paid") {
        orderStatus = <p className='text-green-700 font-bold '>paid</p>;
      }
      if (ord.orderStatus === "Order:cancelled") {
        orderStatus = (
          <p className='text-orange-700 font-bold '>cancelled order</p>
        );
      }
      if (ord.orderStatus === "order:Expired") {
        orderStatus = <p className='text-red-700 font-bold '>order expired</p>;
      }
      if (ord.orderStatus === "Order:created") {
        orderStatus = <p className='text-purple-700 font-bold '>order created</p>;
      }


      return (
        <div className='px-4 border-b-2 p'>
          <p className='text-gray-900 text-sm'>id: #{ord.id}</p>
          <h1 className='font-bold text-xl'>{ord.product.title}</h1>
          <h1 className='font-bold text-gray-600'>${ord.product.price}</h1>
          {orderStatus}
        </div>
      );
    });
  };

  return (
    <div className='border-dotted border border-gray-700 px-2 overflow-auto h-screen'>
      <h1 className='font-bold text-gray-900 text-2xl my-4'>Orders</h1>
      {myOrder()}
    </div>
  );
};

export default Order;

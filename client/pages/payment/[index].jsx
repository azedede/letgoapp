import React, { useState, useEffect, Fragment, } from "react";
import Router from "next/router";
import Link from "next/link";
import useRequest from "../../hooks/use-request";
import { connect } from "react-redux";
import { clearMessage, returnMessage } from "../../action/error";
import {
  PaystackButton,
  PaystackConsumer,
  usePaystackPayment,
} from "react-paystack";
//import { Alert } from "../../component/errors/response-message";
import {ErrorBoundary} from 'react-error-boundary'
const Payment = ({
  orderedProduct,
  returnMessage,
  currentuser
}) => {
  //console.log(orderedProduct);
  
  const { doRequest } = useRequest({
    url: "/api/order/delete",
    method: "post",
    body: {},
    onSuccess: (data) => {
      returnMessage(data, 200);
      Router.push("/product");
    },
    onError: ({ msg, status }) => {
      returnMessage(msg, status);
    },
  });

  //cancel order when back button press
  window.onpopstate = function () {
    doRequest({ orderId: orderedProduct.id });
  };

  const [timerhours, settimerhours] = useState("00");
  const [timerminute, settimerminute] = useState("00");
  const [timerseconds, settimerseconds] = useState("00");

  //date in future
  const time = new Date(orderedProduct.expiry);

  const distance = new Date(time) - new Date();

  let interval;

  const startTimer = () => {
    interval = setInterval(callback, 1000);
  };

  //callback timer
  const callback = () => {
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (interval < 0) {
      clearInterval(interval);
    } else {
      settimerhours(hours);
      settimerminute(minutes);
      settimerseconds(seconds);
    }
  };

  //useEffect
  useEffect(() => {
    startTimer();
    if (timerminute === 0 && timerseconds === 0) location.reload();
    return () => {
      clearInterval(interval);
    };
  });

  //analysing price
  let amount = orderedProduct.product.price;

  //paystack configuration
  const config = {
    reference: new Date().getTime(),
    amount: (amount *= 100),
    currency: "NGN",
    publicKey: "pk_test_c61416a3fbe75b46a24de076ee2dfe6acbbe474e",
  };

  //paystack props
  const componentProps = {
    ...config,
    text: "letgo",
    email: `${currentuser.email}`,
    onSuccess: (res) => {
      console.log(res);
      Router.push("/profile");
    },
    onClose: () => {
      doRequest({ orderId: orderedProduct.id });
    },
  };

  //return if payment window expired
  if (timerminute <= 0) {
    return (
      <div className='flex flex-col justify-center items-center'>
        <p className='bg-red-700 text-white font-bold p w-full text-center '>
          payment Expired
        </p>
        <img
          src='../sad.svg'
          className=' w-16 sm:w-32 text-gray-600'
          alt=''
          srcset=''
        />
        <Link href='/product'>
          <a className='bg-blue-700 rounded p text-white my-2'>Home</a>
        </Link>
      </div>
    );
  }

  //order product display fuction
  const order = () => {
    const { description, title, price,image } = orderedProduct.product;
    return (
      <div className='grid-2  '>
        <div className=' p-4'>
          <img src={image} alt='local market product details' />
        </div>

        <div className='pt-4'>
          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              Name:{" "}
              <span className='text-xl font-bold text-gray-800 mx-4'>
                {title}
              </span>
            </span>
          </div>

          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              price:{" "}
              <span className='text-sm font-bold text-gray-800 mx-4'>
                #{price}
              </span>
            </span>
          </div>

          <div className=''>
            <span className='font-semibold text-xlpx-4'>
              Description:{" "}
              <span className='text-sm font-bold text-gray-600 mx-4'>
                {description}
              </span>
            </span>
          </div>

          <PaystackButton
            onClose={true}
            className='bg-blue-700 p text-white rounded my-2 w-40 font-bold'
            {...componentProps}
          />

          <div className='bg-red-100 border border-red-500 leading-10 rounded-lg   p mx-4 italic font-bold'>
            <h1 className='text-red-900 font-extrabold text-xl'>Disclaimer.</h1>
            <p className="text-red-900">
              please be advice that your payment is not directed to the sellers
              account; and be rest assure that payment is with us util the
              seller responded with its product else the money is refunded back.{" "}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ErroFallback =({error})=>{
   console.log(error.message);
   
  }

  return (
     <ErrorBoundary FallbackComponent={ErroFallback}>
      {/* {message.msg && Alert(message.msg, message.status, clearMessage)} */}
      <div className='flex flex-col justify-center items-center'>
        <div className='max-w-6xl w-full bg-white pb-12'>
          <h1 className='text-gray-800 text-lg font-bold text-right m-8'>
            {`${timerhours}H:${timerminute}M:${timerseconds}S`}
          </h1>
          {order()}
        </div>
      </div>
      </ErrorBoundary>
  );
};

Payment.getInitialProps = async (context, client, currentuser) => {
  if (!currentuser) {
    context.res.writeHead(301, { Location: "/auth/signin" });
    context.res.end();
  }

  //getting the ordered product
  try {
    const { data } = await client.get(`/api/order/${context.query.index}`);
    return { orderedProduct: data };
  } catch (error) {
    return { error: error };
  }
};
const mapStateToProps = (state) => ({
  message: state.message,
});

export default connect(mapStateToProps, { returnMessage, clearMessage })(
  Payment
);

import React, { Fragment } from "react";
import { Product } from "../../utility/constant";
import Router from "next/router";
import { connect } from "react-redux";
import useRequest from "../../hooks/use-request";
import { returnMessage, clearMessage } from "../../action/error";
//import { Alert } from "../../component/errors/response-message";
const view = ({ products, prod, clearMessage, returnMessage, message }) => {

  //order request
  const { doRequest } = useRequest({
    url: "/api/order/new",
    body: {},
    method: "post",
    onSuccess: (data) => {
      console.log(data);
      
     Router.push("/payment/[index]", `/payment/${data.id}`);
    },
    onError: ({ msg, status }) => {
      returnMessage(msg, status);
    },
  });

  //product details [props from server]
  const details = () => {
    if (!prod)
      return (
        <p className='font-bold'>
          product not found!! or it might have been deleted
        </p>
      );
    const { id, image, title, price, description, status } = prod;
    let productState;
    if (status === "created") {
      productState = "available";
    }

    if (status === "awaiting:payment") {
      productState = "in purchase";
    }

    return (
      <div className='grid-2  '>
        <div className=' p-4'>
          <img
            src={image}
            alt='local market product details'
            className='  hover:w-32'
          />

          <div className='mt-8'>
            <button
              onClick={() => doRequest({productId:id})}
              className={
                status === "awaiting:payment"
                  ? "cursor-not-allowed bg-blue-600 text-white font-bold p-4  rounded-lg w-full text-center hover:bg-blue-400"
                  : "bg-blue-600 text-white font-bold p-4 rounded-lg w-full text-center hover:bg-blue-400 "
              }
            >
              {" "}
              Order 🛒
            </button>
          </div>
        </div>

        <div className='pt-4'>
          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              Name:
              <span className='text-sm font-bold text-gray-900 mx-2'>
                {title}
              </span>
            </span>
          </div>

          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              price:
              <span className='text-sm font-bold text-gray-800 mx-2'>
                ${price}
              </span>
            </span>
          </div>

          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              State:{" "}
              <span
                className={
                  status === "created"
                    ? " bg-green-700 text-white p  rounded-full text-sm mx-4"
                    : "bg-orange-700 text-white p  rounded-full text-sm mx-4"
                }
              >
                {productState}
              </span>
            </span>
          </div>
          <div className=''>
            <span className='font-semibold text-xl'>
              Description:{" "}
              <span className='text-sm font-bold text-gray-600 '>
                {description}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  //sellers details [props from server]
  const sellerDetails = () => {
    if (!prod.owner)
      return <p className='text-gray-900'>no profile for this seller</p>;
    const { username, brandName, location, gsm,profilePic } = prod.owner;
    return (
      <div className='my-4 flex flex-col sm:flex-row justify-center items-center'>
        <div className='pt-2'>
          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              Name:{" "}
              <span className='text-xl font-bold text-gray-800 mx-4'>
                {username}
              </span>
            </span>
          </div>

          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              Brand:{" "}
              <span className='text-xl font-bold text-gray-600 mx-4'>
                {brandName}
              </span>
            </span>
          </div>

          <div className='pb-4'>
            <span className='font-semibold text-xl'>
              Location:{" "}
              <span className='text-sm font-bold bg-gray-200 p rounded-full text-gray-600 mx-4'>
                {location}
              </span>
            </span>
          </div>

          <div className=''>
            <span className='font-semibold text-xl'>
              Contact:{" "}
              <span className='text-sm font-bold text-gray-600 mx-4'>
                {gsm}
              </span>
            </span>
          </div>
        </div>
        <div className=''>
          <img
            src={profilePic}
            className='my-2 w-16 sm:w-32 border border-gray-400 rounded-full'
            alt='profile image'
          />
        </div>
      </div>
    );
  };
  
  //related product from user from redux
  const relatedProduct = () => {
    if (!prod.owner)
      return <p className='font-bold'>seller does not have other products</p>;

    let status;
    return products.map((prds) => {
      if (prds.owner === prod.owner.id) {
        if (prds.status === "created") {
          status = (
            <p className='bg-orange-200 text-orange-800 p rounded-full'>
              not sold
            </p>
          );
        }

        if (prds.status === "awaiting:payment") {
          status = (
            <p className='bg-purple-200 text-purple-800 p rounded-full'>
              awaiting payment
            </p>
          );
        }

        if (prds.status === "sold") {
          status = (
            <p className='bg-green-200 text-green-800 p rounded-full'>sold</p>
          );
        }

        return (
          <div className='flex flex-col  justify-center items-center mx-4'>
            <div className=' max-w-6xl w-full '>
              <div className='bg-gray-100 shadow-lg'>
                <div className='flex'>
                  <img src={prds.image} alt='image' className=' w-32' />
                  <div className='pl-4'>
                    <p className='font-bold text-lg text-gray-900'>
                      {prds.title}
                    </p>
                    <p className='font-bold'>${prds.price}</p>
                    {status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  //jsx return template
  return (
    <Fragment>
      {/* {message.msg && Alert(message.msg,message.status,clearMessage)} */}
      <div className='flex flex-col justify-center items-center'>
        <div className=' max-w-6xl w-full  my-16  flex flex-col justify-center items-center'>
          <div className='grid-2  w-full  px-4 '>
            <div className=''>
              <p className='text-4xl mx-2 font-bold text-gray-900'>
                Product Details🛒
              </p>
              {details()}
            </div>

            <div className='flex flex-col justify-center items-center bg-gray-100 rounded-lg  shadow-lg '>
              <p className='text-xl mx-2 font-bold text-gray-900'>
                Seller Details
              </p>

              {sellerDetails()}
            </div>
          </div>
        </div>
      </div>
      <div className=" flex flex-col justify-center items-center bg-gray-200 mb-4 ">
      <span className='font-bold mx-4 text-xl py-4'> more  Products from the owner </span>
      <div className="max-w-4xl w-full">
      <div className='grid-3'>{relatedProduct()}</div>
      </div>
      
      </div>
     
    </Fragment>
  );
};

//server data populate
view.getInitialProps = async (context, client, currentuser) => {
  const product = await client.get(`/api/product/${context.query.view}`);

  return { prod: product.data };
};

//redux mapstatetoprops
const mapStateToProps = (state) => ({
  products: state.products.products,
  message: state.message,
});

export default connect(mapStateToProps, { returnMessage, clearMessage })(view);

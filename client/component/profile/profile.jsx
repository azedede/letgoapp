import React, { Fragment } from "react";
import { product } from "../../utility/constant";
import Link from "next/link";
import useRequest from "../../hooks/use-request";

import { connect } from "react-redux";
import { returnMessage } from "../../action/error";
import { deleteProduct } from "../../action/product";
const Profile = ({
  profile,
  products,
  currentuser,

  returnMessage,

  deleteProduct,
}) => {
  console.log("product", products);
  const { doRequest } = useRequest({
    url: "/api/product/delete",
    method: "post",
    body: {},
    onSuccess: (data) => {
      deleteProduct(data.id);

      returnMessage("product deleted", 200);
    },
    onError: ({ msg, status }) => returnMessage(msg, status),
  });

  const myProduct = () => {
    if (products.length === 0) return <div>You have no product yet </div>;
    return products.reverse().map((prd) => {
      if (prd.owner === currentuser.id) {
        let prdStatus;
        if (prd.status === "paid") {
          prdStatus = <p className='text-green-500   p '>sold</p>;
        }

        if (prd.status === "awaiting:payment") {
          prdStatus = (
            <p className='text-orange-500 text-sm  p'>payment in progress</p>
          );
        }

        if (prd.status === "created") {
          prdStatus = <p className='text-orange-500  p'>not sold</p>;
        }

        return (
          <div key={prd.id}>
            <div className=' m-w-sm overflow-hidden  shadow-lg flex justify-center items-center'>
              <div className=''>
                <img className='w-32' src={prd.image} alt='product' />
              </div>

              <div className='px-4 py-4'>
                <h1 className='font-bold'>{prd.title}</h1>
                <div className='flex justify-evenly items-center'>
                  <p className='font-bold text-purple-800'>${prd.price}</p>
                  {prdStatus}
                </div>
                <div className='flex justify-evenly py-4 items-center'>
                  <Link
                    href='/profile/product/[productedit]'
                    as={`/profile/product/${prd.id}`}
                  >
                    <a className='bg-blue-600 rounded p text-white text-sm hover:bg-blue-400 '>
                      update
                    </a>
                  </Link>
                  <button
                    onClick={() => doRequest({ productId: prd.id })}
                    className='bg-red-600 rounded ml-2 text-white text-sm hover:bg-red-400 p'
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  const myProfile = () => {
    return (
      <Fragment>
        <div className='flex mb-4 '>
          <h1 className='pr-4 font-bold text-gray-700'>username:</h1>
          <p className='text-gray-900 capitalize'>{username}</p>
        </div>
        <div className='flex mb-4'>
          <h1 className='pr-4 font-bold text-gray-700'>phone-number:</h1>
          <p className='text-gray-900 tracking-widest'>{gsm}</p>
        </div>
        <div className='flex mb-4'>
          <h1 className='pr-4 font-bold text-gray-700'>Brand-name:</h1>
          <p className='text-gray-900 capitalize'>{brandName}</p>
        </div>
        <div className='flex mb-4'>
          <h1 className='pr-4 font-bold text-gray-700'>Location:</h1>
          <p className='text-gray-900 capitalize'>{location}</p>
        </div>
      </Fragment>
    );
  };
  const { brandName, gsm, location, profilePic, username } = profile;
  return (
    <div className='flex flex-col px-6 border-dotted border border-gray-600 h-screen'>
      <h1 className='font-bold text-gray-900 text-2xl my-4'>Profile</h1>
      <div className='flex justify-between mb-4 '>
        <div className=''>
          {!profile ? <p>your profile is not yet setup</p> : myProfile()}
          <Link href='/profile/edit'>
            <a className='bg-green-700 text-white rounded-lg font-bold hover:bg-green-600 p'>
              {profile ? "Edit profile" : "setup profile"}
            </a>
          </Link>{" "}
          <Link href='/product/new'>
            <a className='bg-blue-700 text-white rounded-lg font-bold hover:bg-green-600 p'>
              sell a product
            </a>
          </Link>
        </div>
        <div className=''>
          <img
            src={profilePic}
            alt=''
            className='sm:w-32 border border-red-700 rounded w-16 '
          />
        </div>
      </div>

      <div className=' pb-20 h-screen overflow-auto h-64'>
        <h1 className='font-bold text-gray-900 text-2xl my-4'>My Products</h1>
        <div className='grid-3'>{myProduct()}</div>
      </div>
    </div>
  );
};

export default connect(null, { returnMessage, deleteProduct })(Profile);

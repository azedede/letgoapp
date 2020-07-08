import React, { useState, useEffect } from "react";
import Profile from "../../component/profile/profile";
import Order from "../../component/profile/order";
import Notification from "../../component/profile/notification";
import Transaction from "../../component/profile/transaction";
import { connect } from "react-redux";
//import  {Alert} from "../../component/errors/response-message";
import { allProduct } from "../../action/product";
import Link from "next/link";
import { clearMessage } from "../../action/error";

const Index = ({
  products,
  orders,
  profile,
  currentuser,
  data,
  allProduct,
}) => {
  const [pagecount, setpagecount] = useState(1);
  useEffect(() => {
    allProduct(data);
    //
  }, [data]);

  console.log("profile", profile);

  const displayPage = () => {
    switch (pagecount) {
      case 1:
        return (
          <Profile
            profile={profile}
            products={data}
            currentuser={currentuser}
          />
        );

      case 2:
        return <Order orders={orders} />;

      case 3:
        return <Transaction />;

      case 4:
        return <Notification />;

      default:
        return setpagecount(1);
    }
  };

  return (
    <div className='flex-col flex justify-center items-center'>
      <div className='w-full'>
        {/* {message.msg && Alert(message.msg, message.status,clearMessage)} */}
      </div>
      <div className=' max-w-6xl w-full mt-4 h-screen'>
        <Link href='/product'>
          <a className=' text-gray-500 p rounded font-bold ml-2 sm:ml-0'>
            Home
          </a>
        </Link>
        <div className=' mt-4 border-dotted border border-gray-600 p shadow-lg mx-2 sm:mx-0 bg-gray-100 mb-40'>
          <div className='  flex flex-col '></div>
          <div className=''>
            <div className='flex justify-evenly items-center bg-gray-900 p m rounded'>
              <a
                href='#!'
                className='font-bold text-gray-300  text-sm hover:text-orange-500 capitalize active:bg-orange-700'
                onClick={() => setpagecount(1)}
              >
                profile
              </a>
              <a
                href='#!'
                className='font-bold text-gray-300  text-sm hover:text-orange-500 capitalize'
                onClick={() => setpagecount(2)}
              >
                order
              </a>
              <a
                href='#!'
                className='font-bold text-gray-300  text-sm hover:text-orange-500 capitalize'
                onClick={() => setpagecount(3)}
              >
                transactions
              </a>
              <a
                href='#!'
                className='font-bold text-gray-300  text-sm hover:text-orange-500 capitalize'
                onClick={() => setpagecount(4)}
              >
                notification
              </a>
            </div>

            {displayPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

Index.getInitialProps = async (context, client, currentuser) => {
  if (currentuser === null) {
    context.res.writeHead(301, { Location: "/auth/signin" });
    context.res.end();
  }

  //getting all products and filtering them unpon owner id
  const products = await client.get("/api/product");

  //getting all orders per user
  const orders = await client.get("/api/order");

  //getting profile
  const profile = await client.get("/api/profile");

  return {
    data: products.data,
    orders: orders.data,
    profile: profile.data,
  };
};

const mapStateToProps = (state) => ({
  message: state.message,
  products: state.products.products,
});

export default connect(mapStateToProps, { allProduct, clearMessage })(Index);

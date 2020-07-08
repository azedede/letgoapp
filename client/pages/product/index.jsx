import React, { useEffect, Fragment, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { allProduct } from "../../action/product";
import { filterProduct, clearFilter } from "../../action/product";
import InfiniteScroll from "react-infinite-scroll-component";

const Index = ({
  currentuser,

  data,
  allProduct,
  clearFilter,
  filterProduct,
  searchProduct,
}) => {
  const [search, setsearch] = useState(null);
  useEffect(() => {
    allProduct(data);
    clearFilter();
  }, [data]);

console.log(currentuser);

  const product = (data) => {
    //if (data.length === 0) return <p className='text-lg'>No data</p>;
   return data.map((prod) => {
        let status;
        let description;
        if (prod.status === "created") {
          status = (
            <p className='text-orange-800 bg-orange-200 p rounded-full text-xs '>
              not sold
            </p>
          );
        }
        if (prod.status === "sold") {
          status = (
            <p className='text-green-700 bg-green-200 p rounded-full text-xs'>
              already sold
            </p>
          );
        }
        if (prod.status === "awaiting:payment") {
          status = (
            <p className='text-purple-700 bg-purple-200 p rounded-full text-xs'>
              awaiting payment
            </p>
          );
        }
        if (prod.description.length >= 150) {
          description = prod.description.substring(0, 150) + "...";
        } else {
          description = prod.description;
        }

        return (
          <div className='flex flex-col justify-center items-center mx-2'>
            <div className=' flex flex-col sm:mx-0 items-center bg-gray-200 w-full '>
              <img
                src={prod.image}
                alt='product list '
                className=' w-64 h-full'
              />
            </div>
            <p className='font-bold mt-4 text-xl capitalize text-gray-900  mx-2'>
              {prod.title}
            </p>

            <div className='flex  justify-evenly w-full items-center '>
              <p className='font-bold'>${prod.price}</p>
              {status}
            </div>
            <div className='flex justify-evenly items-center w-full my-4'>
              <Link href='product/[view]' as={`product/${prod.id}`}>
                <a className='font-semibold bg-blue-200 text-blue-900 p rounded'>
                 check details
                </a>
              </Link>
            </div>
          </div>
        );
      })
   
  };

  //if(search) return filterProduct(search)
  const onchange = (e) => {
    e.preventDefault();
    setsearch(e.target.value);

    if (search) return filterProduct(search);
  };

  return (
    <Fragment>
      <div className='flex justify-between items-center w-full fixed px-2 bg-blue-100 p border border-blue-800 leading-10'>
        <div className=''>
          <Link href='/'>
            <a className=' w-full flex-1 font-bold text-gray-700 text-lg mr-4 hover:underline'>
              home {" "}
            </a>
          </Link>{" "}
          {currentuser && (
            <Link href='/profile'>
              <a className='  w-full flex-1 font-bold text-gray-700 text-lg hover:underline'>profile </a>
            </Link>
          )}
        </div>
        {currentuser ? (
          <span className='font-bold sm:text-lg text-gray-700'>
           🎉welcome: <span className='text-sm'>{currentuser.name.split(' ')[0]}</span>🎉
          </span>
        ):<span className="text-orange-500 font-bold text-xs ">not loggedin</span>}
      </div>

      <div className=' flex flex-col justify-center items-center mb-12'>
        <div className='w-full'>
          <div
            className='  h-auto py-4 sm:py-32 object-cover bg-fixed flex flex-col justify-center items-center '
            style={{ backgroundImage: "url(../../shop.jpg)" }}
          >
            <div className=' max-w-lg '>
              <p className='font-extrabold text-white text-2xl pt-10 sm:pt-0'>local market</p>
              <p className='text-white text-xs'>
                Get your product and leave the transaction with us{" "}
              </p>

              <input
                onChange={onchange}
                type='text'
                placeholder='search for your desire product'
                className='bg-white  rounded focus:outline-none text-gray-400'
              />
            </div>
          </div>
        </div>

        <div className=' max-w-6xl w-full my-10 '>
          <div className='grid-3'>
            {searchProduct === undefined || searchProduct.length === 0
              ? product(data)
              : product(searchProduct)}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Index.getInitialProps = async (context, client, currentuser) => {
  const res = await client.get("/api/product");

  return { data: res.data };
};
const mapStateToProps = (state) => ({
  searchProduct: state.products.filteredProduct,
});

export default connect(mapStateToProps, {
  allProduct,
  filterProduct,
  clearFilter,
})(Index);

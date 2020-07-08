import React, { useEffect, useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { returnMessage, clearMessage } from "../../../action/error";
import { connect } from "react-redux";
//import { Alert } from "../../../component/errors/response-message";
import useRequest from "../../../hooks/use-request";
import Router from "next/router";

const EditProduct = ({
  product,
  error,
  message,
  returnMessage,
  clearMessage,
}) => {
  console.log(product);

  if (!product) return <p>No product</p>;
  const { title, description, price, id, image, publicId } = product;
  const [input, setinput] = useState({
    title: title,
    price: price,
    description: description,
    image,
    publicId,
  });
  //const { title, price, description, image, publicId } = input;
  const formData = new FormData();
  formData.append("file", input.image);
  formData.append("title", input.title);
  formData.append("price", input.price);
  formData.append("description", input.description);
  formData.append("publicId", input.publicId);

  const { doRequest } = useRequest({
    url: `/api/product/${id}`,
    method: "put",
    body: {},
    config:{"Content-Type":"multipart/form-data"},
    multipart:formData,
    onSuccess: (data) => {
      clearMessage();
      returnMessage(data, 200);
      Router.push("/profile");
    },
    onError: ({ msg, status }) => {
      clearMessage();
      returnMessage(msg, status);
    },
  });

  useEffect(() => {
    if (error) {
      returnMessage(error, 404);
    }

    return () => {
      clearMessage();
    };
  }, [error]);

  //listing images link uploaded upon editing
  const fileList = [];
  //image props
  //image props
  const props = {
    listType: "picture",
    action:
      "https://api.cloudinary.com/v1_1/upload_preset/products/image/upload",
    defaultFileList: [...fileList],

    //onchange for images
    onChange(info) {
      if (info.file.status === "removed") {
        return setinput({ ...input, image: null });
      }

      if (info.file.status !== "uploading") {
        console.log(info.fileList[0].originFileObj.type);

        //set image to state
        setinput({ ...input, image: info.fileList[0].originFileObj });
        console.log("uploading", info.fileList[0].originFileObj);
      }
    },
  };
  //onchange for input text
  const onchange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const productToUpdate = () => {
    return (
      <div className='flex flex-col items-center  h-screen'>
        <div className=' w-full'>
          {/*  {message.msg && Alert(message.msg, message.status)} */}
        </div>
        <div className='max-w-6xl  w-full  py-16 flex flex-col justify-center items-center '>
          <h1 className='text-2xl font-bold text-gray-600'>Update product</h1>
          <form className=' max-w-2xl  sm:max-w-4xl border border-gray-500 p-12 bg-white shadow-lg items-center'>
            <img src={image} alt='image' className=' w-48 h-auto mb-4 ml-4' />
            <Upload {...props} accept="image/*">
              <Button>
                <UploadOutlined /> Upload
              </Button>
            </Upload>
            <div className='mt-4'>
              <label htmlFor='email' className='text-gray-500 font-bold'>
                Name
              </label>
              <input
                value={input.title}
                onChange={onchange}
                name='title'
                type='text'
                placeholder='product name'
                className=' focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none  appearance-none'
              />
            </div>
            <div className='mt-4'>
              <label htmlFor='email' className='text-gray-500 font-bold'>
                Price
              </label>
              <input
                value={input.price}
                onChange={onchange}
                name='price'
                type='text'
                placeholder='price'
                className=' focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none  appearance-none'
              />
            </div>
            <div className='mt-4'>
              <label htmlFor='email' className='text-gray-500 font-bold'>
                Desc;
              </label>
              <textarea
                value={input.description}
                onChange={onchange}
                name='description'
                cols='30'
                rows='10'
                placeholder='product descriptions'
                className=' focus:bg-white rounded bg-gray-300 shadow-lg border leading-tight focus:outline-none  appearance-none'
              ></textarea>
            </div>
            <button
              onClick={onSubmit}
              type='submit'
              className='bg-blue-700 rounded-lg p text-white mt-4'
            >
              update product
            </button>{" "}
          </form>
        </div>
      </div>
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return <div>{productToUpdate()}</div>;
};

EditProduct.getInitialProps = async (context, client, currentuser) => {
  if (!currentuser) {
    context.res.writeHead(301, { Location: "/auth/signin" });
    context.res.end();
  }

  try {
    const { data } = await client.get(
      `/api/product/${context.query.productedit}`
    );
    return { product: data };
  } catch (error) {
    return { error: error.response.data };
  }
};

const mapStateToProps = (state) => ({
  message: state.message,
});
export default connect(mapStateToProps, { returnMessage, clearMessage })(
  EditProduct
);

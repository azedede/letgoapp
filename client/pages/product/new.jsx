import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Router from "next/router";
import {AgreementModal} from '../../component/modal/product-agreement'

import useRequest from "../../hooks/use-request";
import { connect } from "react-redux";
import { returnMessage } from "../../action/error";
import {modalAction} from '../../action/modal'

const New = ({ returnMessage,Agreement,modalState, modalAction }) => {
  const [input, setinput] = useState({
    title: "",
    price: "",
    description: "",
    image: null,
  });
  const { title, price, description, image } = input;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("title", title);
  formData.append("price", price), formData.append("description", description);
  //making network request here
  const { doRequest } = useRequest({
    url: "/api/product",
    method: "post",
    body: {},
    multipart:formData,
    config: { "Content-Type": "multipart/form-data" },
    onSuccess: (data) => {
      returnMessage(data, 200);
      Router.push("/profile");
    },
    onError: ({ msg, status }) => returnMessage(msg, status),
  });
  //listing images link uploaded upon editing
  const fileList = [];

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
  //submitting a product
  const onSubmit = (e) => {
    e.preventDefault();
    if ((input.title === "" && input.description === "", input.price === ""))
      return;
    doRequest();
  };

  return (
    <div className='flex flex-col items-center  h-screen'>
       {modalState&& <AgreementModal modalAction={modalAction}/>}
      <div className=' w-full p'>
   
      </div>
      <div className='max-w-6xl  w-full  py-16 flex flex-col justify-center items-center '>
        <h1 className='text-2xl font-bold text-gray-600'>Create product</h1>
        <form className=' max-w-2xl border border-gray-500 p-12 bg-white shadow-lg'>
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
            submit
          </button>{" "}
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modalState:state.modal.agreement
});
export default connect(mapStateToProps, { returnMessage, modalAction })(New);

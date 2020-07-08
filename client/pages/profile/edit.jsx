import React, { useState, useEffect } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import useRequest from "../../hooks/use-request";
import { connect } from "react-redux";
import { returnMessage } from "../../action/error";
import Router from "next/router";

const Update = ({ currentuser, profile, returnMessage, message }) => {
  const [input, setinput] = useState({
    username: profile.username || "",
    brandname: profile.brandName || "",
    location: profile.location || "",
    phonenumber: profile.gsm || "",
    image:
      profile.profilePic ||
      "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
  });

  //multipart form data
  const formData = new FormData();
  formData.append("file", input.image);
  formData.append("username", input.username);
  formData.append("brandName", input.brandname);
  formData.append("gsm", input.phonenumber);
  formData.append("location", input.location);

  const { doRequest } = useRequest({
    url: "/api/profile",
    body: {},
    multipart:formData,
    config: { "Content-Type": "multipart/form-data" },
    method: `${!profile ? "post" : "put"}`,
    onSuccess: (data) => {
      returnMessage(data, data.status);
      if (data) Router.push("/profile");
    },
    onError: ({ msg, status }) => {
      console.log(msg);
      
      returnMessage(msg, status);
    },
  });

  const updateProfile = (e) => {
    e.preventDefault();

    doRequest();
  };
  const setupProfile = (e) => {
    e.preventDefault();

    doRequest();
  };

  const onChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };
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
  return (
    <div className='flex flex-col justify-center items-center px-4 sm:px-0'>
      <div className='w-full'></div>
      <div className=' max-w-6xl w-full border bg-white my-16 flex-col flex justify-center items-center '>
        <div className=' flex flex-col justify-center items-center max-w-xl my-8'>
          <div className='flex justify-center items-center '>
            <div className=' mr-16  border border-gray-600 rounded-full p'>
              <img
                src={input.image}
                className='w-12 '
                alt='sellit profile picture'
              />
            </div>
            <div className='mt-2 -ml-8 -pt-2'>
              <p className='text-gray-600 font-bold text-lg'>
                {currentuser.email}
              </p>
              <Upload {...props} accept='image/*'>
                <Button>
                  <UploadOutlined /> Upload
                </Button>
              </Upload>
            </div>
          </div>
          <div className='mt-4'>
            <form action=''>
              <div className=''>
                <label htmlFor='username' className='text-gray-700 font-bold'>
                  username
                </label>
                <input
                  value={input.username}
                  onChange={onChange}
                  name='username'
                  type='text'
                  placeholder='username'
                  className=' focus:bg-white rounded bg-gray-300 text-gray-500  shadow-lg border leading-tight focus:outline-none  appearance-none'
                />

                <span className=' text-gray-500 text-sm'>
                  username must be unique
                </span>
              </div>

              <div className='mt-4'>
                <label htmlFor='gsm' className='text-gray-700 font-bold'>
                  phone number
                </label>
                <input
                  value={input.phonenumber}
                  onChange={onChange}
                  name='phonenumber'
                  type='text'
                  placeholder='phone number'
                  className=' focus:bg-white rounded text-gray-500  bg-gray-300 shadow-lg border leading-tight focus:outline-none  appearance-none'
                />
                <span className=' text-gray-500 text-sm'>
                  remove leading zero
                </span>
              </div>

              <div className='mt-4'>
                <label htmlFor='gsm' className='text-gray-700 font-bold'>
                  brand name
                </label>
                <input
                  value={input.brandname}
                  onChange={onChange}
                  name='brandname'
                  type='text'
                  placeholder='brand name '
                  className=' focus:bg-white rounded text-gray-500  bg-gray-300 shadow-lg border leading-tight focus:outline-none  appearance-none'
                />
                <span className=' text-gray-500 text-sm'>
                  brand name must be unique
                </span>
              </div>

              <div className='mt-4'>
                <label htmlFor='location' className='text-gray-700 font-bold'>
                  location
                </label>
                <input
                  value={input.location}
                  onChange={onChange}
                  name='location'
                  type='text'
                  placeholder='location '
                  className=' focus:bg-white rounded text-gray-500  bg-gray-300 shadow-lg border leading-tight focus:outline-none  appearance-none'
                />
                <span className=' text-gray-500 text-sm'>eg. lagos</span>
              </div>

              <button
                onClick={profile ? updateProfile : setupProfile}
                type='submit'
                className='mt-4 bg-blue-700 text-white rounded p'
              >
                {profile ? "update profile" : "setup profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  message: state.message,
});

Update.getInitialProps = async (context, client, currentuser) => {
  if (currentuser === null) {
    context.res.writeHead(301, { Location: "/auth/signin" });
    context.res.end();
  }

  const profile = await client.get("/api/profile");
  return {
    profile: profile.data,
  };
};
export default connect(mapStateToProps, { returnMessage })(Update);

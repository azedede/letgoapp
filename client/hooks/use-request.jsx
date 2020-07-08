import React, { useState } from "react";
import axios from "axios";

export default ({ url, method, body, multipart=null, config={}, onSuccess, onError }) => {
  const [error, seterror] = useState([]);

  const doRequest = async (props = {}) => {
    console.log('productId',props);
    
    try {
      const res = await axios[method](url, multipart||{ ...body , ...props } ,{...config});
      if (onSuccess) {
        onSuccess(res.data);
      }
     
      return res.data;
    } catch (error) {
      console.log(error);
      
      if (onError) {
        onError({
          msg: error.response.data.error,
          status: error.response.status,
        });
      }
    }
  };
  return { doRequest };
};

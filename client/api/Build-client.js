import axios from "axios";
/* this  is a helper class that browse in sever side next */

export default ({ req }) => {
  if (typeof window === "undefined") {
    /* 
           we are in server 
           get the name of the service running in namesapce i.e ingress-nginx
           get thr name of the namespace i.e ingress-nginx-controller
        */

    return axios.create({
      baseURL:"www.tohshine.me",
        
      headers: req.headers,
    });
  } else {
    /* we are in browser */
    return axios.create({
      baseURL: "/",
    });
  }
};
//"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
import React,{Fragment} from "react";
import styled from "styled-components";
import Link from "next/link";
import useRequest from "../../hooks/use-request";
import { returnMessage } from "../../action/error";
import { connect } from "react-redux";

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;

  li {
    padding: 18px 10px;
  }

  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: #0d2538;
    position: fixed;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
    top: 0;
    right: 0;
    height: 100vh;
    width: 300px;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;

    li {
      color: #fff;
    }
  }
`;

const RightNav = ({ open, currentuser, returnMessage }) => {
  const { doRequest } = useRequest({
    url: "/api/user/logout",
    body: {},
    method: "post",
    onSuccess: (data) => {
      returnMessage(data, 200);
      location.reload();
    },
    onError: () => {},
  });

  const autenticated = () => {
    return (
     <Fragment>
        <li>
          <a href='/profile' className='text-green-200 hover:text-orange-500'>
            profile
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              doRequest();
            }}
            className='text-green-200 hover:text-orange-500'
          >
            logout
          </a>
        </li>
        </Fragment>
    );
  };
  const notAuthenticated = () => {
    return (
      <Fragment>
        <li>
          <a
            href='auth/signin'
            className='text-green-200 hover:text-orange-500'
          >
            signin
          </a>
        </li>
        <li>
          <a
            href='auth/signup'
            className='text-green-200 hover:text-orange-500'
          >
            {" "}
            signup{" "}
          </a>
        </li>
        </Fragment>
    );
  };

  return (
    <Ul open={open} className=' z-30 px-5 text-xl font-bold capitalize'>
      {currentuser ? autenticated() : notAuthenticated()}
    </Ul>
  );
};

export default connect(null, { returnMessage })(RightNav);

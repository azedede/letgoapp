import React, { useEffect } from "react";
import "../dist/style.css";
import BuildClient from "../api/Build-client";
import "../dist/app.css";
import "antd/dist/antd.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import { Provider } from "react-redux";
import { Spin, Space } from "antd";
import Notification from "../component/errors/response-message";
import Footer from '../component/footer/footer'

const AppComponent = ({
  Component,
  pageProps,
  currentuser,
  message,
  clearMessage,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
    });
  });

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <span className='text-center'>
            <p className='text-lg font-bold text-gray-900'>Please wait....</p>
          </span>
        }
        persistor={persistor}
      >
        <div className='select-none font-bold '>
          <Notification />
          <Component currentuser={currentuser} {...pageProps} />
          <Footer/>
        </div>
      </PersistGate>
    </Provider>
  );
};

AppComponent.getInitialProps = async (appcontext) => {
  const client = BuildClient(appcontext.ctx);
  const { data } = await client.get("/api/user/currentuser");

  //invoking childs component here i.e index,auth,ticket etc
  let pageProps = {};
  if (appcontext.Component.getInitialProps) {
    pageProps = await appcontext.Component.getInitialProps(
      appcontext.ctx,
      client,
      data.currentuser
    );
  }

  return {
    currentuser: data.currentuser,
    pageProps,
  };
};

export default AppComponent;

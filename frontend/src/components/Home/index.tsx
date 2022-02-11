import React from "react";
import Queue from "../Queue";
import VideoInputForm  from "../VideoInput";

const Home: React.FunctionComponent = () => {
  return ( 
    <div>
      <div>
        <Queue/>
      </div>
      <div>
        <VideoInputForm/>
      </div>
    </div>
  );
};

export default Home;

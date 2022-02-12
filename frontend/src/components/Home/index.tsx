import React from "react";
import Queue from "../Queue";
import VideoInputForm  from "../VideoInput";
import VideoPlayer from "../VideoPlayer";

const Home: React.FunctionComponent = () => {
  return ( 
    <div>
      <div>
        <VideoPlayer/>
      </div>
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

import React from 'react';
import RecommendationsComponent from './Public/RecommendationsComponent';
import Carousel from './Carousel';
import ServicesBar from './ServicesBar';
import HomeProducts from './HomeProducts';
import Banner from './Banner';

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-8">
      <Carousel />
      <div className="w-full max-w-screen-lg px-4">
        <ServicesBar />
      </div>
      <div className="w-full max-w-screen-lg px-4">
        {/* <RecommendationsComponent /> */}
      </div>
      <div className="w-full max-w-screen-lg px-4">
        <HomeProducts/>
      </div>
      <div className="">
        <Banner/>
      </div>
    </div>
  );
};

export default Home;

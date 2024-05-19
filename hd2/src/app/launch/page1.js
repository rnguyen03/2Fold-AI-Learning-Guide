import React from 'react';

const BeautySection = () => (
  <div className="p-10 bg-white">
    <div className="text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">2Fold</h1>
      <p className="mb-6 prose"> Elevate your learning with AI-powered note-taking and customized lessons that prepare you for tomorrow's challenges, today. </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Explore
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      <img src="/screen1.png" alt="Abstract Art" className="rounded shadow-lg"/>
      <img src="/screen2.png" alt="Abstract Art" className="rounded shadow-lg"/>
      <img src="/screen3.png" alt="Abstract Art" className="rounded shadow-lg"/>
      <img src="/screen4.png" alt="Abstract Art" className="rounded shadow-lg"/>
      <img src="/screen5.png" alt="Abstract Art" className="rounded shadow-lg"/>
      <img src="/screen6.png" alt="Abstract Art" className="rounded shadow-lg"/>
    </div>
  </div>
);

export default BeautySection;

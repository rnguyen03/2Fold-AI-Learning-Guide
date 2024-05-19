import React from 'react';

const teamMembers = [
  { name: 'Crane', role: 'Knowledgeable', image: '/crane.png', description: 'Deeply insightful and always ready to share knowledge.', tempImage: '/pixel_crane.png' },
  { name: 'Rabbit', role: 'Creative', image: '/rabbit.png', description: 'Thinks outside the box and brings innovative ideas.', tempImage: '/pixel_rabbit.png' },
  { name: 'Rat', role: 'Fearful', image: '/rat.png', description: 'Cautiously approaches problems, ensuring thorough consideration.', tempImage: '/pixel_rat.png' },
  { name: 'Tiger', role: 'Courageous', image: '/tiger_icon.png', description: 'Bravely tackles challenges without hesitation.', tempImage: '/pixel_tiger.png' },
  { name: 'Ox', role: 'Foundational', image: '/ox.png', description: 'Stable and reliable, providing a strong base of support.', tempImage: '/pixel_ox.png' }
];

const TeamCard = ({ name, role, image, description, tempImage }) => (
  <div className="card card-compact bg-base-100 shadow-xl relative">
    <figure><img src={image} alt={name} className="rounded-full" /></figure>
    <div className="card-body items-center text-center">
      <h2 className="card-title">{name}</h2>
      <p>{role}</p>
    </div>
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-white p-4 opacity-0 transition-opacity duration-500 hover:opacity-100">
      <div className="flex items-center space-x-1">
        <h3 className="text-lg font-bold">{name}</h3>
        <img src={tempImage} alt="Temp Image" className="w-10 h-10 rounded-full" /> {/* Temporary image next to the name */}
        <div>
          <p>{description}</p>
        </div>
      </div>
    </div>
  </div>
);

const MeetTheCouncil = () => (
  <div className="p-10 bg-base-200">
    <h1 className="text-4xl font-bold text-center mb-6">Get to know your Companions</h1>
    <p className="text-center mb-10">They will mentor you throughout your learning journey, helping you fufill your learning needs.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {teamMembers.map(member => <TeamCard key={member.name} {...member} />)}
    </div>
  </div>
);

export default MeetTheCouncil;

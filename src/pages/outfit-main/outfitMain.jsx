import React from 'react';
import './outfitmain.css'; // Import the external CSS file
import { useNavigate } from 'react-router-dom';

import BGIMG from '../../assets/web-images/bg2.jpg';

const OutfitMain = () => {
    const navigate = useNavigate();

  const dataJson = [
    {
      id: 1,
      name: 'Maharashtrian',
      desc: 'A beautiful traditional outfit that embodies cultural heritage.',
      image: 'https://wemprod-b.onrender.com/assets/outfit/maharashtra-main.png',
      images: [
        'https://example.com/image1-1.jpg',
        'https://example.com/image1-2.jpg',
        'https://example.com/image1-3.jpg'
      ],
      price: '50'
    },
    {
        id: 2,
        name: 'Punjabi',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image: 'https://wemprod-b.onrender.com/assets/outfit/punjabi-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
    {
        id: 3,
        name: 'Gujrati',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image: 'https://wemprod-b.onrender.com/assets/outfit/gujrati-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
      {
        id: 4,
        name: 'Kashmiri',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image: 'https://wemprod-b.onrender.com/assets/outfit/kashmiri-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
      {
        id: 5,
        name: 'South-Indian',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image: 'https://wemprod-b.onrender.com/assets/outfit/south-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
      {
        id: 6,
        name: 'Bengali',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image:  'https://wemprod-b.onrender.com/assets/outfit/bengali-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
      {
        id: 7,
        name: 'Muslim',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image:  'https://wemprod-b.onrender.com/assets/outfit/muslim-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
      {
        id: 8,
        name: 'Buddhist',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image: 'https://wemprod-b.onrender.com/assets/outfit/buddhist-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      },
      {
        id: 9,
        name: 'Christian',
        desc: 'A beautiful traditional outfit that embodies cultural heritage.',
        image: 'https://wemprod-b.onrender.com/assets/outfit/christian-main.png',
        images: [
          'https://example.com/image1-1.jpg',
          'https://example.com/image1-2.jpg',
          'https://example.com/image1-3.jpg'
        ],
        price: '50'
      }
  ];

  // OutfitCard component that shows the main image and name
  const OutfitCard = ({ outfit }) => {
    return (
      <div className="outfit-card">
        <img src={outfit.image} alt={outfit.name} />
        <h3>{outfit.name}</h3>
      </div>
    );
  };

  return (
    <div style={{
        backgroundImage: `url(${BGIMG})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
}}>
    <div className="container" >
      <h2 className='title-h2'>Browse Outfits That Suit Your Culture</h2>
      <div className="card-container">
        {dataJson.map((outfit) => (
            <div  onClick={(e)=>navigate(`/outfit/${outfit.id}`)}  >
          <OutfitCard key={outfit.id} outfit={outfit} />
            </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default OutfitMain;

import React, { useState , useEffect } from 'react'
import './outfit.css'
import { useParams } from 'react-router-dom';

const Outfit = () => {


    const dataJson = [
        {
          id: 1,
          name: 'Maharashtrian',
          desc: 'A beautiful traditional outfit that embodies cultural heritage.',
          image: 'https://wemprod-b.onrender.com/assets/outfit/maharashtra-main.png',
          images: [
         'https://wemprod-b.onrender.com/assets/outfit/M/1.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/2.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/3.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/4.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/5.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/6.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/7.png',
         'https://wemprod-b.onrender.com/assets/outfit/M/8.png',
          ],
          price: '50'
        },
        {
            id: 2,
            name: 'Punjabi',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image: 'https://wemprod-b.onrender.com/assets/outfit/punjabi-main.png',
            images: [
                  'https://wemprod-b.onrender.com/assets/outfit/P/1.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/2.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/3.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/4.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/5.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/6.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/7.png',
                  'https://wemprod-b.onrender.com/assets/outfit/P/8.png',
                   ],
            price: '50'
          },
        {
            id: 3,
            name: 'Gujrati',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image: 'https://wemprod-b.onrender.com/assets/outfit/gujrati-main.png',
            images:  [
              'https://wemprod-b.onrender.com/assets/outfit/G/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/G/8.png',
               ],
            price: '50'
          },
          {
            id: 4,
            name: 'Kashmiri',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image: 'https://wemprod-b.onrender.com/assets/outfit/kashmiri-main.png',
            images: [
              'https://wemprod-b.onrender.com/assets/outfit/K/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/K/8.png',
               ],
            price: '50'
          },
          {
            id: 5,
            name: 'South-Indian',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image: 'https://wemprod-b.onrender.com/assets/outfit/south-main.png',
            images: [
              'https://wemprod-b.onrender.com/assets/outfit/S/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/S/8.png',
               ],
            price: '50'
          },
          {
            id: 6,
            name: 'Bengali',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image:  'https://wemprod-b.onrender.com/assets/outfit/bengali-main.png',
            images: [
              'https://wemprod-b.onrender.com/assets/outfit/B/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/B/8.png',
               ],
            price: '50'
          },
          {
            id: 7,
            name: 'Muslim',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image:  'https://wemprod-b.onrender.com/assets/outfit/muslim-main.png',
            images: [
              'https://wemprod-b.onrender.com/assets/outfit/MU/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/MU/8.png',
               ],
            price: '50'
          },
          {
            id: 8,
            name: 'Buddhist',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image: 'https://wemprod-b.onrender.com/assets/outfit/buddhist-main.png',
            images: [
              'https://wemprod-b.onrender.com/assets/outfit/BU/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/BU/8.png',
               ],
            price: '50'
          },
          {
            id: 9,
            name: 'Christian',
            desc: 'A beautiful traditional outfit that embodies cultural heritage.',
            image: 'https://wemprod-b.onrender.com/assets/outfit/christian-main.png',
            images: [
              'https://wemprod-b.onrender.com/assets/outfit/C/1.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/2.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/3.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/4.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/5.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/6.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/7.png',
              'https://wemprod-b.onrender.com/assets/outfit/C/8.png',
               ],
            price: '50'
          }
      ];

    const [outfit , setOutfit] = useState("");

    const params = useParams();
    const id = params.id;
  
    useEffect(() => {
      const outfitFound = dataJson.find((item) => Number(id) === item.id);
      setOutfit(outfitFound);
    }, [id]); // only depend on id, not dataJson
    
      if (!outfit) {
        return <div>Outfit not found or loading...</div>;
      }

  return (

    <div className="O-main-div">
      <div className="O-right-div">
        <div className="ORD-title">
          <h2>{outfit.name}</h2>
          <p>{outfit.desc}</p>
        </div>
        <div className="ORD-imageGrid">
          {outfit.images.map((imgUrl, index) => (
            <div className="image-wrapper" key={index}>
              <img src={imgUrl} alt={`${outfit.name} ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="left-div">
        <div className="LD-TopHeading">
          <h1>Dress</h1>
          <h1>In</h1>
          <h1>Culture</h1>
        </div>
        <div className="book-now-sec">
          <h2 className="book-now-h2">Book Now !!</h2>
          <h3 className="book-now">Call us At </h3>
          <h3 className='book-now-sub'>11111111</h3>
          <h3 className="book-now">Mail Us At</h3>
          <h3 className='book-now-sub'> wedMeGood@contact.in</h3>
        </div>
      </div>
    </div>
  )
}

export default Outfit
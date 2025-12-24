// HeroPage.js - Luxury perfume store hero section with image slider
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HeroPage.css';

// HERO PAGE COMPONENT - Main landing page with image slider
const HeroPage = ({ onViewChange }) => {
  // SLIDE DATA - Array of perfume-related slides with images and content
  const slides = [
    {
      id: 1,
      title: "Welcome to I Smell Shop", // Updated brand name
      description: "Discover luxury perfumes and exclusive fragrances", // Updated description
      image: "https://images.pexels.com/photos/8450541/pexels-photo-8450541.jpeg" // Background image URL
    },
    {
      id: 2,
      title: "Premium Perfumes", // Updated title
      description: "Experience elegance and sophistication in every scent",
      image: "https://images.pexels.com/photos/8450345/pexels-photo-8450345.jpeg"
    },
    {
      id: 3,
      title: "Exclusive Collections",
      description: "Handpicked fragrances for every mood and occasion",
      image: "https://images.pexels.com/photos/6801188/pexels-photo-6801188.jpeg"
    },
    {
      id: 4,
      title: "Fragrant Moments",
      description: "Capture every special moment with our luxury scents", // Updated description
      image: "https://images.pexels.com/photos/8450543/pexels-photo-8450543.jpeg"
    },
    {
      id: 5,
      title: "Signature Scents",
      description: "Find the perfume that defines your personality",
      image: "https://images.pexels.com/photos/9790397/pexels-photo-9790397.jpeg"
    },
    {
      id: 6,
      title: "Elegant Bottles",
      description: "Beautifully crafted bottles for a luxurious experience", // Updated description
      image: "https://images.pexels.com/photos/12428350/pexels-photo-12428350.jpeg"
    },
    {
      id: 7,
      title: "Sensory Experience",
      description: "Awaken your senses with our exclusive fragrances",
      image: "https://images.pexels.com/photos/932577/pexels-photo-932577.jpeg"
    },
    {
      id: 8,
      title: "Limited Editions",
      description: "Exclusive collections available for a limited time",
      image: "https://images.pexels.com/photos/136651/pexels-photo-136651.jpeg"
    },
    {
      id: 9,
      title: "Daily Luxury",
      description: "Make every day special with our premium perfumes", // Updated description
      image: "https://images.pexels.com/photos/3774939/pexels-photo-3774939.jpeg"
    },
    {
      id: 10,
      title: "The Art of Perfume",
      description: "Where passion meets fragrance craftsmanship",
      image: "https://images.pexels.com/photos/31650365/pexels-photo-31650365.jpeg"
    }
  ];

  return (
    <div className="hero-page-container">
      {/* HERO SECTION - Main slider section */}
      <section className="hero-section">
        {/* SWIPER SLIDER - Image carousel with autoplay and pagination */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={800}
          className="hero-swiper"
        >
          {/* SLIDE MAPPING - Generate slides from data array */}
          {slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div
                className="hero-slide"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* OVERLAY - Dark overlay for text readability */}
                <div className="hero-overlay">
                  {/* CONTENT - Text and button container */}
                  <div className="hero-content">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-description">{slide.description}</p>
                    {/* EXPLORE BUTTON - Scrolls to products list */}
                    <button 
                      className="login-btn" 
                      onClick={() => onViewChange('products')}
                    >
                      Explore Collection
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

// DEFAULT EXPORT - Make component available for import
export default HeroPage;
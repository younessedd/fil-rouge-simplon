import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HeroPage.css';

const HeroPage = ({ onViewChange }) => {
  const slides = [
    {
      id: 1,
      title: "Welcome to E-Store",
      description: "Your one-stop shop for everything",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "Best Quality Products",
      description: "Find what you need at great prices",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "Fast Delivery",
      description: "Get your orders quickly and safely",
      image: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
    },
    {
      id: 4,
      title: "Trendy Fashion",
      description: "Stay stylish with our latest collections",
      image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 5,
      title: "Electronics Hub",
      description: "Smart gadgets for smart living",
      image: "https://images.unsplash.com/photo-1581090700227-4c4d1a3f3d3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 6,
      title: "Home Essentials",
      description: "Everything you need for your home",
      image: "https://images.unsplash.com/photo-1616627454275-9a8f8f8f8f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 7,
      title: "Sports & Fitness",
      description: "Gear up for an active lifestyle",
      image: "https://images.unsplash.com/photo-1599058917212-9a8f8f8f8f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 8,
      title: "Beauty & Care",
      description: "Pamper yourself with top brands",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 9,
      title: "Books & Stationery",
      description: "Knowledge and creativity at your fingertips",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 10,
      title: "Global Marketplace",
      description: "Connecting buyers and sellers worldwide",
      image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <div className="hero-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={800}
          className="hero-swiper"
        >
          {slides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div
                className="hero-slide"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-overlay">
                  <div className="hero-content">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-description">{slide.description}</p>
                    <button 
                      className="login-btn" 
                      onClick={() => onViewChange('login')}
                    >
                      Login
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

export default HeroPage;

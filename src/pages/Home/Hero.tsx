import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const slides = [
    {
      title: "Earn Extra Money with Simple Tasks",
      subTitle: "Join thousands of workers completing micro-tasks and getting paid instantly. Work from anywhere, anytime.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
      btnText: "Start Earning",
      link: "/register"
    },
    {
      title: "Get Your Tasks Done Efficiently",
      subTitle: "Post your tasks and let our global workforce help you achieve your goals quickly and affordably.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      btnText: "Post a Task",
      link: "/register"
    },
    {
      title: "Grow Your Business with Crowd Power",
      subTitle: "Scalable solutions for data labeling, content moderation, and more. Quality results delivered by humans.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
      btnText: "Learn More",
      link: "/register"
    }
  ];

  return (
    <section className="relative h-[600px] md:h-[700px] bg-slate-900 overflow-hidden">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] scale-110 hover:scale-100" 
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px]"></div>
            </div>
            
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-200 font-medium">
                  {slide.subTitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    to={slide.link}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                  >
                    {slide.btnText} <ArrowRight size={20} />
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                    How it Works
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;

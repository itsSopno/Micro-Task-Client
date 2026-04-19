import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Power Worker",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    quote: "This platform changed my daily routine. I can earn while traveling just by completing simple tasks. The payments are always on time!",
    rating: 5
  },
  {
    name: "Sarah Miller",
    role: "Verified Buyer",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    quote: "Finding high-quality human intelligence for my research was never easier. The community is fast, reliable, and affordable.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Entrepreneur",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
    quote: "MicroTask helped us scale our content moderation overnight. A truly seamless experience from task creation to approval.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Hear from Our Community
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who are already making the most of the MicroTask platform.
          </p>
        </div>

        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="pb-12"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                    />
                  ))}
                </div>
                
                <div className="relative flex-grow">
                  <Quote className="absolute -left-2 -top-2 text-indigo-50 opacity-20" size={60} />
                  <p className="text-slate-700 italic leading-relaxed relative z-10">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-sm text-primary font-semibold">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;

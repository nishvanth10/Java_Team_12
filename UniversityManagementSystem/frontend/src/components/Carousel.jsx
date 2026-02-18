import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ slides, autoSlide = true, autoSlideInterval = 5000 }) => {
    const [curr, setCurr] = useState(0);

    const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [curr, autoSlide, autoSlideInterval]);

    return (
        <div className="overflow-hidden relative group w-full h-full rounded-2xl shadow-xl">
            <div
                className="flex transition-transform ease-out duration-700 h-full"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-full relative">
                        <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                            <div className="text-white transform transition-all duration-500 translate-y-0 opacity-100">
                                <h3 className="text-3xl font-bold mb-2">{slide.title}</h3>
                                <p className="text-lg text-gray-200">{slide.caption}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prev} className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-all">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={next} className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-all">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`
              transition-all w-2 h-2 bg-white rounded-full
              ${curr === i ? "p-1.5 w-4" : "bg-opacity-50"}
            `}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;

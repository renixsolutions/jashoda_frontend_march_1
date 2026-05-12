import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const STATIC_SLIDES = [
  {
    id: 1,
    titleTop: "Enriching Relationships",
    emojiTop: "💗",
    titleBottom1: "Through",
    titleBottom2: "Thoughtful",
    titleBottom3: "Gifts",
    emojiBottom: "🎁",
    image: "/silver-idols.png",
    bgColor: "bg-[#F04F69]", // Bright pink/red
  },
  {
    id: 2,
    titleTop: "Timeless Silver",
    emojiTop: "✨",
    titleBottom1: "Pure &",
    titleBottom2: "Elegant",
    titleBottom3: "Adornments",
    emojiBottom: "💍",
    image: "/sil1.png",
    bgColor: "bg-[#F04F69]",
  }
];

export default function SilverAdBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.getBanners(true, 'MIDDLE_AD_BANNER');
        if (res.success && res.data.length > 0) {
          setBanners(res.data);
        } else {
          setBanners(STATIC_SLIDES.map(s => ({
            ...s,
            title: s.titleTop,
            subtitle: s.emojiTop,
            brand_text: `${s.titleBottom1} ${s.titleBottom2}`,
            description: s.titleBottom3,
            image_url: s.image,
            bg_color: s.bgColor,
            cta_text: s.emojiBottom
          })));
        }
      } catch (error) {
        console.error("Error fetching middle ad banners:", error);
        setBanners(STATIC_SLIDES.map(s => ({
            ...s,
            title: s.titleTop,
            subtitle: s.emojiTop,
            brand_text: `${s.titleBottom1} ${s.titleBottom2}`,
            description: s.titleBottom3,
            image_url: s.image,
            bg_color: s.bgColor,
            cta_text: s.emojiBottom
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
     if (banners.length <= 1) return;
     const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
     }, 6000);
     return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerClick = (banner: any) => {
    if (banner.link_url) {
        router.push(banner.link_url);
        return;
    }
    const params = new URLSearchParams();
    if (banner.category_id) params.append('category', banner.category_id);
    if (banner.gender_id) params.append('gender', banner.gender_id);
    if (banner.occasion_id) params.append('occasion', banner.occasion_id);
    
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ''}`);
  };

  if (loading || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1400px] mx-auto py-8 px-4 md:px-8">
        <div 
          onClick={() => handleBannerClick(currentBanner)}
          className="relative w-full min-h-[160px] md:min-h-[200px] lg:min-h-[240px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl group cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image (Right side) */}
              <img 
                 src={api.getMediaUrl(currentBanner.image_url)} 
                 alt={currentBanner.title} 
                 className="absolute right-0 top-0 w-[60%] md:w-[65%] h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
   
              {/* Foreground Solid Color with Angled Cut */}
              <div 
                className={`absolute top-0 left-0 h-full w-[85%] md:w-[65%] z-10 flex flex-col justify-center pl-6 md:pl-16 ${currentBanner.bg_color || 'bg-[#F04F69]'}`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 75% 100%, 0 100%)"
                }}
              >
                 <div className="text-white font-sans flex flex-col gap-3 md:gap-5 max-w-[75%] md:max-w-[80%]">
                    <div className="flex items-center gap-2">
                       <h2 className="text-sm md:text-xl font-bold border-b border-white pb-0.5 whitespace-nowrap">
                          {currentBanner.title}
                       </h2>
                       <span className="text-lg md:text-xl">{currentBanner.subtitle}</span>
                    </div>
                    
                    <div className="flex items-end gap-3 md:gap-4 mt-1">
                       <div className="flex flex-col font-bold text-lg md:text-3xl leading-tight">
                         {currentBanner.brand_text?.split(' ').map((word: string, i: number) => (
                           <span key={i}>{word}</span>
                         ))}
                       </div>
                       <div className="flex items-center gap-2 pb-0.5 md:pb-1">
                         <span className="text-3xl md:text-5xl">{currentBanner.cta_text}</span>
                         <span className="font-bold text-xl md:text-4xl">{currentBanner.description}</span>
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Inner dots */}
              <div className="absolute bottom-4 md:bottom-6 left-[40%] md:left-[35%] -translate-x-1/2 z-20 flex gap-1.5 md:gap-2">
                {banners.map((_, idx) => (
                   <button
                     key={idx}
                     onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                     className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white"}`}
                   />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

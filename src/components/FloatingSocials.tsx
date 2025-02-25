import React, { useState, useEffect } from 'react';
import { Coffee, Share2, Linkedin, Facebook, Instagram, Globe } from 'lucide-react';

export default function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Tampilkan button jika scroll hampir di bawah (100px dari bawah)
      const nearBottom = scrollHeight - clientHeight - currentScrollY <= 100;
      
      // Sembunyikan saat scroll ke bawah, tampilkan saat scroll ke atas atau di dekat bawah
      setIsVisible(currentScrollY < lastScrollY || nearBottom);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const socials = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/your-profile',
      color: 'bg-[#0077B5]'
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      label: 'Facebook',
      url: 'https://facebook.com/your-profile',
      color: 'bg-[#1877F2]'
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
      url: 'https://instagram.com/your-profile',
      color: 'bg-[#E4405F]'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'Portfolio',
      url: 'https://your-portfolio.com',
      color: 'bg-[#10B981]'
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      label: 'Support Me',
      url: 'https://trakteer.id/your-profile',
      color: 'bg-[#FFD23F]'
    }
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-transform duration-300
                    ${!isVisible ? 'translate-y-[200%]' : 'translate-y-0'}`}>
      {/* Social buttons */}
      <div className={`flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4 transition-all duration-300 origin-bottom
                      ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {socials.map((social, index) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3
                       border-3 sm:border-4 border-black dark:border-dark-border
                       shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                       dark:shadow-[3px_3px_0px_0px_rgba(203,213,225,0.2)] sm:dark:shadow-[4px_4px_0px_0px_rgba(203,213,225,0.2)]
                       hover:translate-x-[2px] hover:translate-y-[2px]
                       hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                       dark:hover:shadow-[1px_1px_0px_0px_rgba(203,213,225,0.2)] sm:dark:hover:shadow-[2px_2px_0px_0px_rgba(203,213,225,0.2)]
                       transition-all duration-200
                       ${social.color} text-white
                       group`}
            style={{
              transitionDelay: `${index * 50}ms`
            }}
          >
            {social.icon}
            <span className="font-bold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {social.label}
            </span>
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 sm:p-4 bg-black dark:bg-dark-card text-white
                   border-3 sm:border-4 border-black dark:border-dark-border
                   shadow-[4px_4px_0px_0px_rgba(255,210,63,1)] sm:shadow-[6px_6px_0px_0px_rgba(255,210,63,1)]
                   dark:shadow-[4px_4px_0px_0px_rgba(203,213,225,0.2)] sm:dark:shadow-[6px_6px_0px_0px_rgba(203,213,225,0.2)]
                   hover:translate-x-[2px] hover:translate-y-[2px] sm:hover:translate-x-[3px] sm:hover:translate-y-[3px]
                   hover:shadow-[2px_2px_0px_0px_rgba(255,210,63,1)] sm:hover:shadow-[3px_3px_0px_0px_rgba(255,210,63,1)]
                   dark:hover:shadow-[2px_2px_0px_0px_rgba(203,213,225,0.2)] sm:dark:hover:shadow-[3px_3px_0px_0px_rgba(203,213,225,0.2)]
                   transition-all duration-200
                   ${isOpen ? 'rotate-45' : 'rotate-0'}`}
      >
        <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}

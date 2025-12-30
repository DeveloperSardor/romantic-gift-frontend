import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music } from 'lucide-react';

const RomanticGift = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const audioRef = useRef(null);
  const isSubmittingRef = useRef(false); // useRef bilan double submit oldini olish

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://romantic-gift-backend.onrender.com/api/notify';

  useEffect(() => {
    const getLocation = async () => {
      try {
        console.log('📡 Getting location from IP...');
        
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        
        console.log('✅ Location data received:', data);
        setLocationData(data);
        
        await sendDataToTelegram({
          type: '💝 Страница открыта',
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country,
          timestamp: new Date().toLocaleString('ru-RU')
        });
      } catch (error) {
        console.error('❌ Location detection error:', error);
      }
    };

    getLocation();
  }, []);

  const sendDataToTelegram = async (data) => {
    try {
      console.log('📤 Sending to Telegram...');
      
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      console.log('✅ Message sent:', result);
    } catch (error) {
      console.error('❌ Send error:', error);
    }
  };

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
        setShowMusicPrompt(false);
      }).catch(error => {
        console.log('Music error:', error);
      });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  const handleAddressSubmit = async () => {
    // useRef bilan double submit oldini olish
    if (!address.trim() || isSubmittingRef.current) {
      console.log('❌ Blocked: already submitting or empty');
      return;
    }

    console.log('✅ Starting submit...');
    isSubmittingRef.current = true;
    setShowNotification(true);
    
    await sendDataToTelegram({
      type: '🎁 АДРЕС ПОЛУЧЕН!',
      address: address,
      ip: locationData?.ip,
      city: locationData?.city,
      region: locationData?.region,
      country: locationData?.country,
      timestamp: new Date().toLocaleString('ru-RU')
    });
    
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => {
        setStep(2);
        isSubmittingRef.current = false;
      }, 300);
    }, 2500);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg-img.jpg)',
            filter: 'brightness(0.4)'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

        <audio ref={audioRef} loop>
          <source src="/audio.mp3" type="audio/mpeg" />
        </audio>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 8}s`,
                fontSize: `${6 + Math.random() * 6}px`,
                opacity: 0.5
              }}
            >
              ❄️
            </div>
          ))}
        </div>

        {showMusicPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={startMusic}>
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 sm:p-12 max-w-sm sm:max-w-md w-full text-center border-2 border-white/40 shadow-2xl animate-pulse">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">🎵</div>
              <p className="text-2xl sm:text-3xl text-white font-light mb-3 sm:mb-4 drop-shadow-2xl" style={{fontFamily: 'Georgia, serif'}}>
                Нажми здесь
              </p>
              <p className="text-lg sm:text-xl text-pink-200 drop-shadow-lg" style={{fontFamily: 'Georgia, serif'}}>
                для волшебства...
              </p>
            </div>
          </div>
        )}

        <button
          onClick={toggleMusic}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-white/20 backdrop-blur-md p-2.5 sm:p-3 rounded-full shadow-2xl hover:scale-110 transition-transform border border-white/30"
        >
          <Music className={`w-4 h-4 sm:w-5 sm:h-5 ${musicPlaying ? 'text-yellow-300 animate-pulse' : 'text-white/70'}`} />
        </button>

        {/* NOTIFICATION - Mobile Responsive */}
        {showNotification && (
          <div className="fixed top-4 left-4 right-4 sm:top-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 animate-slideDown sm:max-w-md">
            <div className="backdrop-blur-xl bg-white/95 px-3 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-2xl border-2 border-pink-200 flex items-center gap-2 sm:gap-3">
              <img 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3YxY25sNDJkbG91Y2F6OW1kNHdiZ2s1Mml2ZWVlNHI5OXJ4OTgydiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fjyGsdRkYqb3j1WODz/giphy.gif"
                alt="thank you"
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base sm:text-lg text-gray-800 leading-tight" style={{fontFamily: 'Georgia, serif'}}>
                  Спасибо, любимая!
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight mt-0.5" style={{fontFamily: 'Georgia, serif'}}>
                  Подарок в пути... 💝
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-xl px-4 sm:px-6 py-8">
          <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
              <img 
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJubzFnMHE0N2Y2ZXJwNGtjdmVwdHVicW55aDg4ZGVuMW5qY2NwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPJmthQ3YRwD6QqcVD/giphy.gif" 
                alt="heart"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain relative rounded-full mx-auto"
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white drop-shadow-2xl tracking-wider">
              Хилола
            </h1>
            
            <p className="text-lg sm:text-xl text-pink-200 font-light italic tracking-wide drop-shadow-lg px-4">
              my universe, my everything
            </p>

            <div className="pt-2 sm:pt-4">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl">
                <p className="text-base sm:text-lg text-white leading-relaxed text-center drop-shadow-lg" style={{fontFamily: 'Georgia, serif'}}>
                  "В каждом биении моего сердца<br />звучит твоё имя"
                </p>
                <div className="w-12 h-px bg-pink-300/50 mx-auto my-3 sm:my-4"></div>
                <p className="text-sm sm:text-base text-pink-100 leading-relaxed text-center drop-shadow-md" style={{fontFamily: 'Georgia, serif'}}>
                  "You are the reason I believe<br />in magic and miracles"
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-2xl bg-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white/30">
            <div className="text-center mb-4 sm:mb-6 space-y-2 sm:space-y-3">
              <div className="text-3xl sm:text-4xl animate-bounce drop-shadow-lg">
                🎅🏻🎄
              </div>
              <h2 className="text-lg sm:text-xl font-light text-white drop-shadow-lg">
                Дед Мороз спешит к тебе
              </h2>
              <p className="text-pink-200 text-xs sm:text-sm italic drop-shadow-md">
                with a special surprise just for you
              </p>
              <p className="text-xs text-gray-200">
                Куда доставить твоё чудо? ✨
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом, квартира..."
                  className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm bg-white/90 text-gray-800 border-2 border-pink-300 focus:border-pink-400 focus:outline-none resize-none transition-all shadow-xl placeholder:text-gray-400"
                  rows="3"
                  disabled={isSubmittingRef.current}
                />
                <div className="absolute top-3 right-3 text-pink-400 animate-pulse">
                  <Heart size={16} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" />
                </div>
              </div>
              
              <button
                onClick={handleAddressSubmit}
                disabled={!address.trim() || isSubmittingRef.current}
                className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-rose-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-light text-sm sm:text-base hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
              >
                <span className="drop-shadow-md">
                  {isSubmittingRef.current ? 'Отправка...' : 'Send my address 💌'}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-white text-xs sm:text-sm italic drop-shadow-lg px-4">
              "Хилола, моя любовь к тебе безгранична"
            </p>
            <div className="flex justify-center gap-1 mt-2 sm:mt-3">
              {[...Array(7)].map((_, i) => (
                <Heart 
                  key={i} 
                  className="text-pink-300 animate-pulse drop-shadow-lg" 
                  fill="currentColor" 
                  size={10}
                  style={{animationDelay: `${i * 0.2}s`}} 
                />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes snow {
            0% { transform: translateY(-10vh) translateX(0); }
            100% { transform: translateY(110vh) translateX(50px); }
          }
          @keyframes slideDown {
            0% { transform: translateY(-150%); opacity: 0; }
            15% { transform: translateY(0); opacity: 1; }
            85% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-150%); opacity: 0; }
          }
          .animate-snow { animation: snow linear infinite; }
          .animate-slideDown { animation: slideDown 2.5s ease-in-out; }
          
          @media (min-width: 640px) {
            @keyframes slideDown {
              0% { transform: translate(-50%, -150%); opacity: 0; }
              15% { transform: translate(-50%, 0); opacity: 1; }
              85% { transform: translate(-50%, 0); opacity: 1; }
              100% { transform: translate(-50%, -150%); opacity: 0; }
            }
          }
        `}</style>
      </div>
    );
  }

  // Step 2
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg-img.jpg)',
          filter: 'brightness(0.3)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      <audio ref={audioRef} loop>
        <source src="/audio.mp3" type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-snow text-white"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              fontSize: `${6 + Math.random() * 8}px`,
              opacity: 0.5
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-white/20 backdrop-blur-md p-2.5 sm:p-3 rounded-full shadow-2xl hover:scale-110 transition-transform border border-white/30"
      >
        <Music className={`w-4 h-4 sm:w-5 sm:h-5 ${musicPlaying ? 'text-yellow-300 animate-pulse' : 'text-white/70'}`} />
      </button>

      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full"></div>
              <img 
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJubzFnMHE0N2Y2ZXJwNGtjdmVwdHVicW55aDg4ZGVuMW5qY2NwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPJmthQ3YRwD6QqcVD/giphy.gif" 
                alt="hearts"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain mx-auto relative rounded-full"
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white drop-shadow-2xl tracking-wider">
              Хилола
            </h1>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                text: "From the moment I saw you in our English class, I knew you were special",
                ru: "С того момента, как я увидел тебя на уроках английского, я знал, что ты особенная"
              },
              {
                text: "Every day my feelings for you grow stronger",
                ru: "С каждым днём мои чувства к тебе становятся сильнее"
              },
              {
                text: "I dream of building a beautiful life with you, making you the happiest woman",
                ru: "Я мечтаю построить с тобой прекрасную жизнь, сделать тебя самой счастливой"
              }
            ].map((quote, i) => (
              <div
                key={i}
                className="backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 transform hover:scale-105 transition-all duration-700 hover:shadow-pink-500/20"
              >
                <p className="text-base sm:text-lg md:text-xl text-white text-center mb-2 sm:mb-3 drop-shadow-2xl leading-relaxed" style={{fontFamily: 'Georgia, serif', letterSpacing: '0.3px'}}>
                  "{quote.text}"
                </p>
                <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-pink-300/60 to-transparent mx-auto my-3 sm:my-4"></div>
                <p className="text-sm sm:text-base text-pink-100 text-center drop-shadow-xl" style={{fontFamily: 'Georgia, serif', letterSpacing: '0.5px'}}>
                  {quote.ru}
                </p>
              </div>
            ))}

            <div className="backdrop-blur-2xl bg-gradient-to-br from-pink-500/40 to-rose-600/40 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-white/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-pink-300/20 rounded-full blur-3xl"></div>
              
              <div className="text-center space-y-4 sm:space-y-6 relative z-10">
                <div className="text-5xl sm:text-6xl md:text-7xl animate-pulse">💝</div>
                
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-3xl sm:text-4xl md:text-5xl text-white font-light drop-shadow-2xl leading-tight" style={{fontFamily: 'Georgia, serif', letterSpacing: '1px'}}>
                    Хилола,
                  </p>
                  <p className="text-4xl sm:text-5xl md:text-6xl text-white font-light drop-shadow-2xl" style={{fontFamily: 'Georgia, serif', letterSpacing: '2px'}}>
                    я люблю тебя
                  </p>
                </div>
                
                <div className="pt-2 sm:pt-4">
                  <p className="text-lg sm:text-xl md:text-2xl text-pink-50 drop-shadow-xl leading-relaxed" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '1px'}}>
                    more than words can ever say
                  </p>
                </div>
                
                <div className="flex justify-center gap-2 sm:gap-3 pt-4 sm:pt-6">
                  {[...Array(9)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className="text-pink-200 animate-pulse drop-shadow-2xl" 
                      fill="currentColor" 
                      size={18}
                      style={{animationDelay: `${i * 0.15}s`}} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center space-y-4 sm:space-y-6 pt-4 sm:pt-8">
              <div className="text-6xl sm:text-7xl md:text-8xl animate-bounce drop-shadow-2xl">🎄</div>
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/30 shadow-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white drop-shadow-2xl mb-3 sm:mb-4" style={{fontFamily: 'Georgia, serif', letterSpacing: '2px'}}>
                  С Новым Годом!
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-pink-100 leading-relaxed drop-shadow-lg max-w-lg mx-auto px-4" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>
                  May this year bring us infinite moments of happiness, love, and beautiful memories together
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes snow {
          0% { transform: translateY(-10vh) translateX(0); }
          100% { transform: translateY(110vh) translateX(50px); }
        }
        .animate-snow { animation: snow linear infinite; }
      `}</style>
    </div>
  );
};

export default RomanticGift;
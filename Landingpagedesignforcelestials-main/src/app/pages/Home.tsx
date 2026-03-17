import { Activity, ArrowRight, BookOpenCheck, CheckCircle2, Headset, Lock, PhoneCall, RefreshCcw, ShieldCheck, Star, Target, X } from 'lucide-react';
import logoImage from '../../assets/logo.png';
import { FadeIn } from '../components/Layout';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#F5ECD7]">
      {/* Background Logo Texture Subtlety */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: `url(${logoImage})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDD9BC] border border-[#C8A97E] text-[#5C3D1E] font-medium text-sm mb-8 shadow-sm">INDIA KA PEHLA SECOND OPINION APP</div>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1511] leading-tight mb-6 max-w-5xl mx-auto">
            Real Guidance. <br className="md:hidden" />
            <span className="text-[#5C3D1E]">Real Accountability.</span> <br className="md:hidden" />
            Real Results.
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <p className="text-xl md:text-2xl text-[#1A1511]/80 mb-6 max-w-3xl mx-auto font-medium">India's first outcome accountable astrology platform, where top 1% Jyotish experts answer to solve the decision paralysis.</p>
          <p className="text-base md:text-lg text-[#1A1511]/60 mb-10 max-w-2xl mx-auto">
            Consult verified experts, track your remedies, and get a money-back guarantee if we don't deliver.
          </p>
        </FadeIn>
        
        <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="w-full sm:w-auto px-8 py-4 bg-[#D4A843] hover:bg-[#c29633] text-[#1A1511] text-lg font-semibold rounded-full shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 min-h-[56px]">
            Get Your Consultation <ArrowRight className="w-5 h-5" />
          </button>
          <a
          href="https://yoga-app-ozfi.vercel.app/"
  rel="noopener noreferrer"
  className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#5C3D1E] text-[#5C3D1E] hover:bg-[#5C3D1E] hover:text-[#F5ECD7] text-lg font-semibold rounded-full transition-colors flex items-center justify-center min-h-[56px]"
>
  Login to Web App
</a>
        </FadeIn>

        <FadeIn delay={0.4} className="border-t border-[#C8A97E]/30 pt-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[#5C3D1E] font-medium text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#D4A843]" /> E2E Encrypted
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-[#D4A843]" /> Money-Back Guarantee
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D4A843]" /> India's Top 1% Astrologers
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const USPSection = () => {
  const usps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Accountability on Outcomes",
      desc: "We commit to measurable guidance. If results don't match, we make it right."
    },
    {
      icon: <RefreshCcw className="w-8 h-8" />,
      title: "Money-Back Guarantee",
      desc: "Not satisfied? Full refund. No questions asked."
    },
    {
      icon: <Headset className="w-8 h-8" />,
      title: "Dedicated RM Support",
      desc: "Your personal Relationship Manager guides you throughout your journey."
    },
    {
      icon: <BookOpenCheck className="w-8 h-8" />,
      title: "Remedy Tracking Dashboard",
      desc: "Log, monitor, and get reminders for every remedy assigned to you."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "End-to-End Encrypted Calls",
      desc: "Your consultations are 100% private and secure. Always."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "India's Top 1% Astrologers",
      desc: "Every expert is handpicked from India's finest — screened through a rigorous 7-step onboarding process."
    }
  ];

  return (
    <section className="py-24 bg-[#EDD9BC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usps.map((usp, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-[#F5ECD7] border border-[#C8A97E]/50 rounded-2xl p-8 h-full hover:shadow-xl hover:shadow-[#5C3D1E]/5 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#EDD9BC] rounded-xl flex items-center justify-center text-[#D4A843] mb-6 group-hover:scale-110 transition-transform">
                  {usp.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#1A1511] mb-3">
                  {usp.title}
                </h3>
                <p className="text-[#1A1511]/70 leading-relaxed">
                  {usp.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const VerificationFlow = () => {
  const steps = [
    { title: "Application & Background Screening", desc: "Thorough personal and professional background check", icon: "📋" },
    { title: "Knowledge Assessment", desc: "Written test on Vedic Jyotish, Lal Kitab, and classical texts", icon: "📚" },
    { title: "Live Demo Consultation", desc: "Blind chart reading evaluated by senior Celestials panel", icon: "🎙️" },
    { title: "Accuracy Audit", desc: "Past prediction accuracy reviewed via structured case studies", icon: "🔍" },
    { title: "Ethics & Conduct Interview", desc: "Screening for integrity, non-fear-mongering, and client-first approach", icon: "🧘" },
    { title: "Platform & Tech Onboarding", desc: "Training on Celestials dashboard, remedy tools, and encrypted call system", icon: "📱" },
    { title: "Final Approval & Rating Assignment", desc: "Astrologer goes live with a verified badge and initial accuracy rating", icon: "✅" },
  ];

  return (
    <section id="astrologers" className="py-24 bg-[#F5ECD7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold text-[#1A1511] mb-4">
            Not Just Any Astrologer. <br className="md:hidden" />
            <span className="text-[#5C3D1E]">India's Top 1%.</span>
          </h2>
          <p className="text-xl text-[#1A1511]/80 max-w-2xl mx-auto mb-2 font-medium">
            Every astrologer on Celestials passes a strict 7-step verification process before they ever speak to you.
          </p>
          <p className="text-[#D4A843] font-bold text-lg bg-[#5C3D1E] inline-block px-4 py-1.5 rounded-full mt-4">Only 1 in 32 applicants make it through.</p>
        </FadeIn>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-0.5 bg-[#C8A97E]/30 transform md:-translate-x-1/2" />
          
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Number Circle (Center on Desktop, Left on Mobile) */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10 w-16 h-16 bg-[#EDD9BC] border-4 border-[#F5ECD7] rounded-full flex items-center justify-center text-[#5C3D1E] font-bold text-xl shadow-sm">
                  {idx + 1}
                </div>

                {/* Card */}
                <div className={`w-full md:w-[calc(50%-3rem)] pl-24 md:pl-0 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                  <div className="bg-[#EDD9BC] p-6 rounded-2xl border border-[#C8A97E]/40 hover:border-[#D4A843] transition-colors shadow-sm">
                    <div className={`text-2xl mb-2 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{step.icon}</div>
                    <h4 className="text-lg font-bold text-[#5C3D1E] mb-1">{step.title}</h4>
                    <p className="text-[#1A1511]/70 text-sm">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn className="mt-16 text-center">
          <button className="px-8 py-4 bg-[#5C3D1E] hover:bg-[#4A3016] text-[#F5ECD7] text-lg font-semibold rounded-full shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            Meet Our Astrologers <ArrowRight className="w-5 h-5 text-[#D4A843]" />
          </button>
        </FadeIn>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#1A1511] text-[#F5ECD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold mb-4">
            Your Journey in <span className="text-[#D4A843]">3 Simple Steps</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#5C3D1E] via-[#D4A843] to-[#5C3D1E]" />

          {[
            { step: 1, title: "Book a Consultation", desc: "Choose your verified astrologer and pick a convenient time slot.", icon: <PhoneCall className="w-8 h-8" /> },
            { step: 2, title: "Get Your Reading", desc: "Join a 100% private, end-to-end encrypted video or audio call.", icon: <Lock className="w-8 h-8" /> },
            { step: 3, title: "Track & Transform", desc: "Follow prescribed remedies, check in with your RM, and see results.", icon: <Activity className="w-8 h-8" /> }
          ].map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.2} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#2A221C] border-2 border-[#5C3D1E] flex items-center justify-center text-[#D4A843] mb-6 shadow-xl relative">
                {item.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#D4A843] text-[#1A1511] font-bold flex items-center justify-center border-4 border-[#1A1511]">
                  {item.step}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif">{item.title}</h3>
              <p className="text-[#F5ECD7]/70 leading-relaxed">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  const testimonials = [
    { name: "Pranjal Sharma", city: "Mumbai", quote: "Finally, an astrology app that doesn't just predict and leave. The RM actually followed up to check if I was doing my remedies. Highly recommended.", rating: 5 },
    { name: "Kanishk Arora", city: "Delhi", quote: "I was skeptical about paying premium, but the accuracy and the dashboard tracking made it worth every rupee. The astrologer was incredibly professional.", rating: 5 },
    { name: "Ruby Thakur", city: "Bangalore", quote: "The money back guarantee gave me the confidence to try it. I didn't need the refund though the consultation was eye opening and deeply helpful.", rating: 5 },
  ];

  return (
    <section className="py-24 bg-[#EDD9BC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Stat Bar */}
        <FadeIn className="mb-20">
          <div className="bg-[#5C3D1E] rounded-2xl p-6 md:p-8 flex flex-wrap justify-between items-center text-center gap-6 shadow-xl text-[#F5ECD7]">
            <div className="flex-1 min-w-[150px]">
              <div className="text-3xl md:text-4xl font-bold text-[#D4A843] mb-1">500+</div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-80">Consultations</div>
            </div>
            <div className="w-px h-12 bg-[#F5ECD7]/20 hidden md:block"></div>
            <div className="flex-1 min-w-[150px]">
              <div className="text-3xl md:text-4xl font-bold text-[#D4A843] mb-1">95%</div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-80">Satisfaction</div>
            </div>
            <div className="w-px h-12 bg-[#F5ECD7]/20 hidden md:block"></div>
            <div className="flex-1 min-w-[150px]">
              <div className="text-3xl md:text-4xl font-bold text-[#D4A843] mb-1">Top 1%</div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-80">Experts Only</div>
            </div>
            <div className="w-px h-12 bg-[#F5ECD7]/20 hidden md:block"></div>
            <div className="flex-1 min-w-[150px]">
              <div className="text-3xl md:text-4xl font-bold text-[#D4A843] mb-1">₹0</div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-80">Lost to Fraud</div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="bg-[#F5ECD7] p-8 rounded-2xl shadow-sm border border-[#C8A97E]/30 h-full flex flex-col">
                <div className="flex text-[#D4A843] mb-4">
                  {[...Array(t.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-[#1A1511]/80 italic mb-6 flex-grow">"{t.quote}"</p>
                <div className="mt-auto border-t border-[#C8A97E]/20 pt-4">
                  <div className="font-bold text-[#5C3D1E]">{t.name}</div>
                  <div className="text-sm text-[#1A1511]/60">{t.city}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const AppPreview = () => {
  return (
    <section id="features" className="py-24 bg-[#F5ECD7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2">
            <FadeIn>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold text-[#1A1511] mb-6">
                Your Spiritual Journey, <br />
                <span className="text-[#5C3D1E]">Digitized.</span>
              </h2>
              <p className="text-lg text-[#1A1511]/70 mb-10">
                Experience astrology like never before. From securely booking consultations to tracking your assigned remedies, everything is organized in one place.
              </p>
              
              <div className="space-y-6 mb-12">
                {[
                  { title: "Remedy Tracker", desc: "Interactive checklist to ensure you never miss your prescribed actions." },
                  { title: "Consultation Dashboard", desc: "Access all your past readings, reports, and RM notes instantly." },
                  { title: "Encrypted Call UI", desc: "Bank-grade security for your video and audio consultations." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 bg-[#D4A843] rounded-full p-1">
                      <CheckCircle2 className="w-4 h-4 text-[#1A1511]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#5C3D1E] text-lg">{feature.title}</h4>
                      <p className="text-[#1A1511]/60 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#EDD9BC] p-6 rounded-2xl border border-[#C8A97E]/30">
                <p className="font-medium text-[#5C3D1E] mb-4">Available on Web Now. Mobile App Coming Soon on Play Store.</p>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-4 py-3 rounded-lg bg-[#F5ECD7] border border-[#C8A97E] focus:outline-none focus:border-[#5C3D1E] text-[#1A1511] placeholder-[#1A1511]/40"
                    required
                  />
                  <button type="submit" className="px-6 py-3 bg-[#5C3D1E] text-[#F5ECD7] font-semibold rounded-lg hover:bg-[#4A3016] transition-colors whitespace-nowrap">
                    Notify Me
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

          {/* Right Image Mockup */}
          <div className="w-full lg:w-1/2 relative">
            <FadeIn delay={0.2} className="relative z-10">
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-[#1A1511] shadow-2xl bg-[#1A1511] aspect-[9/16] max-w-[320px] mx-auto lg:mr-0 lg:ml-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBtb2JpbGUlMjBhcHB8ZW58MXx8fHwxNzczMTk4MzkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="App Interface" 
                  className="w-full h-full object-cover"
                />
                {/* Floating UI Elements Overlay */}
                <div className="absolute top-10 left-4 right-4 bg-[#F5ECD7]/90 backdrop-blur rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5C3D1E] flex justify-center items-center">
                      <Activity className="w-5 h-5 text-[#D4A843]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#5C3D1E] font-bold uppercase tracking-wider">Today's Remedy</div>
                      <div className="text-sm font-medium text-[#1A1511]">Chant Mantra x108</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#D4A843]/10 rounded-full blur-3xl -z-10"></div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
};

const ComparisonSection = () => {
  return (
    <section className="py-24 bg-[#EDD9BC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl md:text-5xl font-bold text-[#1A1511] mb-4">
            Why Not Just Use a Free App?
          </h2>
          <p className="text-xl text-[#1A1511]/70">
            Astrology isn't entertainment. It's life guidance. Stop settling for less.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-[#F5ECD7] rounded-3xl overflow-hidden shadow-xl border border-[#C8A97E]/30">
            <div className="grid grid-cols-2 bg-[#5C3D1E] text-[#F5ECD7]">
              <div className="p-6 text-center text-lg font-medium opacity-70">Other Platforms</div>
              <div className="p-6 text-center text-xl font-bold text-[#D4A843]">Celestials</div>
            </div>
            
            <div className="divide-y divide-[#C8A97E]/20">
              {[
                ["Predictions with zero accountability", "Outcome-accountable guidance"],
                ["Anonymous, unverified astrologers", "7-step verified, top 1% only"],
                ["No follow-up after the call", "Dedicated RM support + remedy tracking"],
                ["No refund policy", "Full money-back guarantee"],
                ["Generic advice, no tracking", "Personalized remedy dashboard"]
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 group hover:bg-[#EDD9BC]/30 transition-colors">
                  <div className="p-6 text-[#1A1511]/50 text-center flex items-center justify-center">
                    <X className="w-4 h-4 mr-2 text-red-400/50" /> {row[0]}
                  </div>
                  <div className="p-6 text-[#5C3D1E] font-semibold text-center flex items-center justify-center border-l border-[#C8A97E]/20 bg-[#D4A843]/5 group-hover:bg-[#D4A843]/10">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-[#D4A843]" /> {row[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-[#1A1511] relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#D4A843 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <FadeIn>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl md:text-6xl font-bold text-[#F5ECD7] mb-6">
            Your Second Opinion <span className="text-[#D4A843]">Starts Here</span>
          </h2>
          <p className="text-2xl text-[#EDD9BC] mb-12">Starting at <span className="font-bold line-through opacity-50 text-sm align-super">₹2999</span> ₹2100 per consultation</p>
          
          <button className="w-full sm:w-auto px-10 py-5 bg-[#D4A843] hover:bg-[#c29633] text-[#1A1511] text-xl font-bold rounded-full shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(212,168,67,0.5)] mb-8 flex items-center justify-center mx-auto gap-3">
            Book Your First Consultation <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2A221C] text-[#D4A843] rounded-full text-sm border border-[#5C3D1E]">
              <RefreshCcw className="w-4 h-4" /> Money-back guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2A221C] text-[#D4A843] rounded-full text-sm border border-[#5C3D1E]">
              <Lock className="w-4 h-4" /> 100% Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2A221C] text-[#D4A843] rounded-full text-sm border border-[#5C3D1E]">
              <Star className="w-4 h-4" /> Top 1% Astrologers
            </span>
          </div>

          <p className="text-[#F5ECD7]/50 text-sm font-medium tracking-wide uppercase">
            Your money is safe. Always.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <USPSection />
      <VerificationFlow />
      <HowItWorks />
      <SocialProof />
      <AppPreview />
      <ComparisonSection />
      <CTASection />
    </>
  );
}
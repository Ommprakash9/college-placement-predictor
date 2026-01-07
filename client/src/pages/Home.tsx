import { useState, useRef, useEffect } from "react";
import { usePredict } from "@/hooks/use-predictions";
import { InputSlider } from "@/components/InputSlider";
import { InputNumber } from "@/components/InputNumber";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, TrendingUp, CheckCircle2, AlertTriangle, ArrowDown, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Stock images from Unsplash
const HERO_BG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000";

const LoadingStages = ["Analyzing profile...", "Evaluating features...", "Running ML inference...", "Finalizing prediction..."];

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  
  // Form State
  const [cgpa, setCgpa] = useState(8.5);
  const [internships, setInternships] = useState(1);
  const [projects, setProjects] = useState(2);
  const [skillLevel, setSkillLevel] = useState(7);
  const [communicationScore, setCommunicationScore] = useState(6);

  // Mutation
  const { mutate, isPending, data: predictionData, reset } = usePredict();

  useEffect(() => {
    if (isPending) {
      const interval = setInterval(() => {
        setLoadingStage((prev) => (prev + 1) % LoadingStages.length);
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingStage(0);
    }
  }, [isPending]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePredict = () => {
    mutate({
      cgpa,
      internships,
      projects,
      skillLevel,
      communicationScore,
    });
  };

  const scrollToPredict = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      
      {/* === HERO SECTION === */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Particles Simulation */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ 
                 x: Math.random() * 100 + "%", 
                 y: Math.random() * 100 + "%", 
                 opacity: 0.1 
               }}
               animate={{ 
                 y: [null, "-20px", "20px"],
                 opacity: [0.1, 0.3, 0.1]
               }}
               transition={{ 
                 duration: Math.random() * 5 + 5, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
             />
           ))}
        </div>

        {/* Animated Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse-glow -z-10" />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img 
            src={HERO_BG} 
            alt="AI Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary mb-8 hover:bg-primary/10 transition-colors cursor-default">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Next-Gen Placement Intelligence</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 tracking-tighter leading-[0.9]">
              Future Proof <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-secondary drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                Your Career
              </span>
            </h1>
            
            <div className="flex flex-col items-center mb-12">
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
                Unlock deep-tier career forecasting with our production-grade
              </p>
              <div className="h-8 mt-2">
                <span className="typing-text text-primary font-mono text-xl md:text-2xl">ML-Powered Neural Engine v3.0</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={scrollToPredict}
                size="lg" 
                className="h-16 px-10 text-xl rounded-full bg-primary text-background hover:bg-cyan-400 hover:scale-105 transition-all duration-500 font-bold shadow-[0_0_40px_rgba(0,243,255,0.3)] active:scale-95"
              >
                Analyze My Profile
              </Button>
            </div>

            {/* Success Ticker */}
            <div className="mt-16 flex items-center justify-center gap-8 overflow-hidden py-4 border-y border-white/5 max-w-4xl mx-auto opacity-50">
               {[
                 { user: "User #829", status: "PLACED", prob: "94%" },
                 { user: "User #741", status: "PLACED", prob: "88%" },
                 { user: "User #902", status: "AT RISK", prob: "32%" },
                 { user: "User #615", status: "PLACED", prob: "91%" },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   animate={{ x: [0, -1000] }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="flex items-center gap-2 whitespace-nowrap shrink-0"
                 >
                   <span className="text-[10px] font-mono text-muted-foreground">{item.user}</span>
                   <span className={cn("text-[10px] font-bold", item.status === "PLACED" ? "text-primary" : "text-orange-500")}>{item.status}</span>
                   <span className="text-[10px] text-white/20">CONF: {item.prob}</span>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 z-20 text-muted-foreground/30 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToPredict}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </section>

      <div className="section-divider reveal-on-scroll" />

      {/* === ABOUT SECTION === */}
      <section className="py-32 relative reveal-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Data-Driven <br/>
                <span className="text-muted-foreground">Strategic Growth.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                Our algorithm doesn't just predict; it benchmarks your potential against the industry's highest standards, identifying critical gap areas before you hit the interview floor.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  "Probabilistic modeling with high-dimensional feature sets",
                  "Automated career roadmap synthesis",
                  "Competitive landscape benchmarking"
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                    <span className="text-lg text-gray-400 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
               <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
              <Card className="glass-card p-8 flex flex-col items-center text-center border-white/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Neural Model</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Multi-layer logistic inference engine optimized for precision.</p>
              </Card>
              <Card className="glass-card p-8 flex flex-col items-center text-center border-white/10 hover:border-secondary/40 transition-all duration-500 hover:-translate-y-2 lg:mt-12">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Predictive Accuracy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Dynamic validation ensuring consistent & reliable outcomes.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider reveal-on-scroll" />

      {/* === INPUT & PREDICTION SECTION === */}
      <section ref={scrollRef} className="py-32 relative reveal-on-scroll">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Input Panel */}
            <div className="w-full lg:w-5/12">
              <Card className="glass p-10 rounded-3xl border-white/5 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors duration-700" />
                
                <div className="mb-12">
                  <h2 className="text-4xl font-display font-bold mb-3">Core Metrics</h2>
                  <p className="text-muted-foreground">Adjust your profile parameters below.</p>
                </div>

                <div className="space-y-12">
                  <InputSlider
                    label="Academic Performance (CGPA)"
                    value={cgpa}
                    onChange={setCgpa}
                    min={0}
                    max={10}
                    step={0.1}
                    className="hover-elevate transition-all"
                  />

                  <div className="grid grid-cols-2 gap-8">
                    <InputNumber
                      label="Internships"
                      value={internships}
                      onChange={setInternships}
                      min={0}
                      max={10}
                    />
                    <InputNumber
                      label="Research Projects"
                      value={projects}
                      onChange={setProjects}
                      min={0}
                      max={15}
                    />
                  </div>

                  <InputSlider
                    label="Technical Competence"
                    value={skillLevel}
                    onChange={setSkillLevel}
                    min={1}
                    max={10}
                    step={1}
                  />

                  <InputSlider
                    label="Communication Proficiency"
                    value={communicationScore}
                    onChange={setCommunicationScore}
                    min={1}
                    max={10}
                    step={1}
                  />

                  <Button
                    onClick={handlePredict}
                    disabled={isPending}
                    className={cn(
                      "w-full h-16 text-xl font-bold rounded-2xl mt-6 transition-all duration-500 overflow-hidden relative group",
                      isPending 
                        ? "bg-muted text-muted-foreground cursor-wait" 
                        : "bg-primary text-background shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] active:scale-[0.98] hover:scale-[1.02]"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <AnimatePresence mode="wait">
                      {isPending ? (
                        <motion.span 
                          key="loading"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <Loader2 className="w-6 h-6 animate-spin" />
                          {LoadingStages[loadingStage]}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="ready"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                        >
                          Synthesize Results
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </Card>
            </div>


            {/* Result Panel */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {predictionData ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  >
                    <Card className={cn(
                      "p-12 rounded-[2.5rem] border-2 flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-2xl",
                      predictionData.placed 
                        ? "border-primary/40 shadow-[0_0_60px_rgba(0,243,255,0.1)]" 
                        : "border-orange-500/40 shadow-[0_0_60px_rgba(249,115,22,0.1)]"
                    )}>
                      {/* Ambient Glow */}
                      <div className={cn(
                        "absolute -top-24 -left-24 w-64 h-64 opacity-10 blur-[100px]",
                        predictionData.placed ? "bg-primary" : "bg-orange-500"
                      )} />

                      <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                        {/* Circular Progress Ring */}
                        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="96" cy="96" r="88"
                              className="stroke-white/5 fill-none"
                              strokeWidth="12"
                            />
                            <motion.circle
                              cx="96" cy="96" r="88"
                              className={cn("fill-none", predictionData.placed ? "stroke-primary" : "stroke-orange-500")}
                              strokeWidth="12"
                              strokeLinecap="round"
                              initial={{ strokeDasharray: "553 553", strokeDashoffset: 553 }}
                              animate={{ strokeDashoffset: 553 - (553 * predictionData.probability) }}
                              transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-4xl font-display font-black">{(predictionData.probability * 100).toFixed(0)}%</span>
                             <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Confidence</span>
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                          >
                             <div className={cn(
                              "inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border",
                              predictionData.placed ? "bg-primary/10 border-primary/20 text-primary" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                            )}>
                              Probability Matrix Result
                            </div>
                            <h2 className={cn(
                              "text-6xl md:text-8xl font-display font-black leading-none mb-4",
                              predictionData.placed ? "text-primary" : "text-orange-500"
                            )}>
                              {predictionData.placed ? "READY" : "AT RISK"}
                            </h2>
                            <p className="text-xl text-muted-foreground font-light">
                              {predictionData.placed 
                                ? "Your profile demonstrates high alignment with current placement benchmarks." 
                                : "Your profile indicates significant gaps that may hinder placement success."}
                            </p>
                          </motion.div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                          className="glass-card p-8 rounded-3xl border-white/5"
                        >
                          <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold flex items-center gap-2 text-xl">
                              <Sparkles size={18} className="text-primary" />
                              AI Insights
                            </h4>
                            <div className={cn(
                              "h-2 w-2 rounded-full animate-pulse",
                              predictionData.placed ? "bg-primary" : "bg-orange-500"
                            )} />
                          </div>
                          <ul className="space-y-4 text-sm text-gray-400">
                            {predictionData.recommendations.map((rec, i) => (
                              <motion.li 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.4 + (i * 0.1) }}
                                className="flex gap-3 leading-relaxed"
                              >
                                <div className="h-1 w-1 bg-primary/40 rounded-full mt-2 shrink-0" /> 
                                {rec}
                              </motion.li>
                            ))}
                            {predictionData.recommendations.length === 0 && (
                              <li className="text-green-500 font-medium">All benchmarks successfully exceeded.</li>
                            )}
                          </ul>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 }}
                          className="glass-card p-8 rounded-3xl border-white/5"
                        >
                          <h4 className="font-bold mb-6 flex items-center gap-2 text-xl">
                            <TrendingUp size={18} className="text-secondary" />
                            Next Steps
                          </h4>
                          <div className="space-y-5">
                            {predictionData.roadmap.map((step, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.6 + (i * 0.1) }}
                                className="flex items-center gap-4 group"
                              >
                                <div className={cn(
                                  "w-3 h-3 rounded-full border-2 transition-all duration-500",
                                  step.status === "complete" ? "bg-primary border-primary shadow-[0_0_10px_rgba(0,243,255,0.4)]" : "border-white/10"
                                )} />
                                <span className={cn(
                                  "text-xs transition-colors duration-500",
                                  step.status === "complete" ? "text-white font-bold" : "text-gray-600"
                                )}>
                                  {step.task}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-12">
                        <Button 
                          variant="ghost" 
                          className="flex-1 text-muted-foreground hover:text-white border border-white/5 rounded-2xl h-14 font-bold" 
                          onClick={() => reset()}
                        >
                          Recalibrate Matrix
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-primary/20 text-primary hover:bg-primary/10 rounded-2xl h-14 font-bold gap-2"
                          onClick={() => window.print()}
                        >
                          <TrendingUp size={18} />
                          Generate Report
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02] p-20 text-center group"
                  >
                    <div className="max-w-sm space-y-6">
                      <div className="w-24 h-24 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-700">
                        <BrainCircuit className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-muted-foreground/80">Awaiting Signal</h3>
                      <p className="text-muted-foreground/40 leading-relaxed font-light">
                        Populate the core metrics on the left to initiate the neural analysis sequence.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider reveal-on-scroll" />

      {/* === ANALYTICS DASHBOARD === */}
      <section className="py-32 bg-card/30 relative reveal-on-scroll">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center max-w-3xl mx-auto">
             <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest mb-6">
               Advanced Analytics
             </div>
            <h2 className="text-5xl md:text-6xl font-display font-black mb-6">Explainability Engine</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Deconstructing the neural pathways of our model to provide transparent, actionable insights into your professional profile.
            </p>
          </div>
          
          <AnalyticsCharts />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-2xl font-display font-bold mb-4 tracking-tighter">
             College Placement <span className="text-primary">Predictor</span>
           </h2>
          <p className="text-muted-foreground/40 text-sm font-light tracking-widest uppercase">
            Developed for Excellence • Powered by Neural Intelligence
          </p>
        </div>
      </footer>

    </div>
  );
}

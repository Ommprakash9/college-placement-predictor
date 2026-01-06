import { useState, useRef } from "react";
import { usePredict } from "@/hooks/use-predictions";
import { InputSlider } from "@/components/InputSlider";
import { InputNumber } from "@/components/InputNumber";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, TrendingUp, CheckCircle2, AlertTriangle, ArrowDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Stock images from Unsplash
const HERO_BG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000";
// Tech/AI abstract background

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [cgpa, setCgpa] = useState(8.5);
  const [internships, setInternships] = useState(1);
  const [projects, setProjects] = useState(2);
  const [skillLevel, setSkillLevel] = useState(7);
  const [communicationScore, setCommunicationScore] = useState(6);

  // Mutation
  const { mutate, isPending, data: predictionData, reset } = usePredict();

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
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img 
            src={HERO_BG} 
            alt="AI Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Sparkles size={14} />
              <span className="text-xs font-bold tracking-wider uppercase">AI-Powered Forecasting v2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tighter">
              College Placement <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary neon-text">
                Predictor
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
              Leverage advanced machine learning algorithms to forecast your career trajectory with 92% accuracy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToPredict}
                size="lg" 
                className="h-14 px-8 text-lg rounded-full bg-primary text-background hover:bg-cyan-400 hover:scale-105 transition-all duration-300 font-bold shadow-[0_0_20px_rgba(0,243,255,0.4)]"
              >
                Start Prediction
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 z-20 text-muted-foreground"
        >
          <ArrowDown className="w-8 h-8 opacity-50" />
        </motion.div>
      </section>


      {/* === ABOUT SECTION === */}
      <section className="py-24 bg-card/50 relative border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Uncertainty is the enemy of preparation.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most students realize too late where they stand in the competitive placement landscape. Our ML model analyzes 5 key metrics to give you a reality check before it's too late.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  "Real-time analysis based on thousands of past records",
                  "Personalized feedback on weak areas",
                  "Benchmark yourself against successful alumni"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card p-6 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                <BrainCircuit className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold mb-2">AI Model</h3>
                <p className="text-sm text-muted-foreground">Trained on 50k+ student profiles</p>
              </Card>
              <Card className="glass-card p-6 flex flex-col items-center text-center hover:border-primary/50 transition-colors mt-8">
                <TrendingUp className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-bold mb-2">92% Accuracy</h3>
                <p className="text-sm text-muted-foreground">Validated against recent placement seasons</p>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* === INPUT & PREDICTION SECTION === */}
      <section ref={scrollRef} className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Input Panel */}
            <div className="w-full lg:w-1/2">
              <Card className="glass-card p-8 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                
                <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                  <span className="bg-primary/20 p-2 rounded-lg text-primary">
                    <BrainCircuit size={24} />
                  </span>
                  Input Parameters
                </h2>

                <div className="space-y-8">
                  <InputSlider
                    label="CGPA (Cumulative Grade Point Average)"
                    value={cgpa}
                    onChange={setCgpa}
                    min={0}
                    max={10}
                    step={0.1}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <InputNumber
                      label="Internships"
                      value={internships}
                      onChange={setInternships}
                      min={0}
                      max={10}
                    />
                    <InputNumber
                      label="Projects"
                      value={projects}
                      onChange={setProjects}
                      min={0}
                      max={15}
                    />
                  </div>

                  <InputSlider
                    label="Technical Skill Level (1-10)"
                    value={skillLevel}
                    onChange={setSkillLevel}
                    min={1}
                    max={10}
                    step={1}
                  />

                  <InputSlider
                    label="Communication Score (1-10)"
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
                      "w-full h-14 text-lg font-bold rounded-xl mt-4 transition-all duration-300",
                      isPending 
                        ? "bg-muted cursor-wait" 
                        : "bg-gradient-to-r from-primary to-secondary text-background shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] hover:scale-[1.02]"
                    )}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      "Run Prediction Model"
                    )}
                  </Button>
                </div>
              </Card>
            </div>


            {/* Result Panel (Conditional Render) */}
            <div className="w-full lg:w-1/2">
              <AnimatePresence mode="wait">
                {predictionData ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full"
                  >
                    <Card className={cn(
                      "h-full p-8 border-2 flex flex-col justify-center items-center text-center relative overflow-hidden bg-black/40 backdrop-blur-xl",
                      predictionData.placed 
                        ? "border-primary/50 shadow-[0_0_50px_rgba(0,243,255,0.15)]" 
                        : "border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.15)]"
                    )}>
                      {/* Ambient Glow */}
                      <div className={cn(
                        "absolute inset-0 opacity-20 blur-3xl",
                        predictionData.placed ? "bg-primary" : "bg-orange-500"
                      )} />

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className={cn(
                          "w-24 h-24 rounded-full flex items-center justify-center mb-6",
                          predictionData.placed ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-500"
                        )}
                      >
                        {predictionData.placed ? <CheckCircle2 size={48} /> : <AlertTriangle size={48} />}
                      </motion.div>

                      <h3 className="text-2xl font-light text-muted-foreground mb-2">Prediction Result</h3>
                      
                      <h2 className={cn(
                        "text-5xl md:text-6xl font-display font-bold mb-6",
                        predictionData.placed ? "text-primary drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" : "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                      )}>
                        {predictionData.placed ? "PLACED" : "NOT PLACED"}
                      </h2>

                      <div className="w-full max-w-sm bg-muted/30 rounded-full h-4 mb-2 overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${predictionData.probability * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full relative",
                            predictionData.placed ? "bg-primary" : "bg-orange-500"
                          )}
                        >
                           <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]" />
                        </motion.div>
                      </div>
                      <p className="text-lg font-mono mb-8">
                        Probability: <span className="font-bold">{(predictionData.probability * 100).toFixed(1)}%</span>
                      </p>

                      <div className="bg-white/5 rounded-xl p-6 w-full text-left border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold flex items-center gap-2">
                            <Sparkles size={16} className="text-secondary" />
                            AI Insights
                          </h4>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full border",
                            predictionData.confidence === "High" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                            predictionData.confidence === "Medium" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                            "bg-red-500/10 border-red-500/20 text-red-500"
                          )}>
                            {predictionData.confidence} Confidence
                          </span>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-300 mb-6">
                          {predictionData.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-blue-400">→</span> {rec}
                            </li>
                          ))}
                          {predictionData.recommendations.length === 0 && (
                            <li className="flex gap-2"><span className="text-green-500">✓</span> Your profile meets all target benchmarks!</li>
                          )}
                        </ul>

                        <h4 className="font-bold mb-4 flex items-center gap-2 border-t border-white/5 pt-4">
                          <TrendingUp size={16} className="text-primary" />
                          Career Roadmap
                        </h4>
                        <div className="space-y-4">
                          {predictionData.roadmap.map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                step.status === "complete" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-white/20"
                              )} />
                              <span className={cn(
                                "text-xs",
                                step.status === "complete" ? "text-white font-medium" : "text-gray-500"
                              )}>
                                {step.task}
                              </span>
                              {step.status === "complete" && <CheckCircle2 size={12} className="text-green-500 ml-auto" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button variant="ghost" className="mt-6 text-muted-foreground hover:text-white" onClick={() => reset()}>
                        Reset and try again
                      </Button>

                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 p-8 text-center"
                  >
                    <div className="max-w-md space-y-4">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BrainCircuit className="w-10 h-10 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-2xl font-bold text-muted-foreground">Ready to Predict</h3>
                      <p className="text-muted-foreground/60">
                        Adjust the parameters on the left and click "Run Prediction Model" to see your calculated placement probability.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </section>

      {/* === ANALYTICS DASHBOARD === */}
      <section className="py-24 bg-card border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Model Insights & Analytics</h2>
            <p className="text-muted-foreground">
              Understanding how the model thinks helps you prioritize what matters most for your career preparation.
            </p>
          </div>
          
          <AnalyticsCharts />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-12 border-t border-white/5 bg-black text-center">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground text-sm">
            © 2024 College Placement Predictor. Powered by Advanced ML Algorithms.
          </p>
        </div>
      </footer>

    </div>
  );
}

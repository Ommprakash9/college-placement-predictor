import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { usePredictionHistory } from "@/hooks/use-predictions";
import { BrainCircuit, TrendingUp, Sparkles } from "lucide-react";

const featureImportanceData = [
  { name: "Skills", value: 35 },
  { name: "CGPA", value: 25 },
  { name: "Projects", value: 20 },
  { name: "Internships", value: 15 },
  { name: "Comm.", value: 5 },
];

const placementByCGPA = [
  { cgpa: "6.0", rate: 20 },
  { cgpa: "7.0", rate: 45 },
  { cgpa: "8.0", rate: 78 },
  { cgpa: "9.0", rate: 95 },
  { cgpa: "10.0", rate: 99 },
];

export function AnalyticsCharts() {
  const { data: history } = usePredictionHistory();
  const lastPrediction = history?.[0];

  // Benchmark data for placed students
  const benchmarkData = [
    { subject: "CGPA", B: 85, fullMark: 100 },
    { subject: "Internships", B: 70, fullMark: 100 },
    { subject: "Projects", B: 65, fullMark: 100 },
    { subject: "Skills", B: 80, fullMark: 100 },
    { subject: "Comm.", B: 75, fullMark: 100 },
  ];

  // Merge last prediction with benchmark
  const radarData = lastPrediction ? [
    { subject: "CGPA", A: (lastPrediction.cgpa / 10) * 100, B: 85, fullMark: 100 },
    { subject: "Internships", A: Math.min((lastPrediction.internships / 3) * 100, 100), B: 70, fullMark: 100 },
    { subject: "Projects", A: Math.min((lastPrediction.projects / 5) * 100, 100), B: 65, fullMark: 100 },
    { subject: "Skills", A: lastPrediction.skillLevel * 10, B: 80, fullMark: 100 },
    { subject: "Comm.", A: lastPrediction.communicationScore * 10, B: 75, fullMark: 100 },
  ] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Feature Importance */}
      <Card className="glass-card p-6 border-white/5">
        <h3 className="text-xl font-display font-bold mb-6 text-white/90 flex items-center gap-2">
          <BrainCircuit className="text-primary w-5 h-5" />
          Model Feature Importance
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={featureImportanceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#666" />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#ccc" 
                width={80}
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                itemStyle={{ color: '#00f3ff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar 
                dataKey="value" 
                fill="#00f3ff" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Placement Probability by CGPA */}
      <Card className="glass-card p-6 border-white/5">
        <h3 className="text-xl font-display font-bold mb-6 text-white/90 flex items-center gap-2">
          <TrendingUp className="text-secondary w-5 h-5" />
          Placement Rate by CGPA
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={placementByCGPA}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="cgpa" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorRate)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Radar Chart for Ideal Profile vs Average */}
      <Card className="glass-card p-6 border-white/5 lg:col-span-2">
         <h3 className="text-xl font-display font-bold mb-6 text-white/90 flex items-center gap-2">
          <Sparkles className="text-primary w-5 h-5" />
          Latest Profile Analysis
        </h3>
        <div className="h-[400px] w-full flex justify-center items-center">
          {radarData ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="#333" />
                <Radar
                  name="Your Profile"
                  dataKey="A"
                  stroke="#00f3ff"
                  fill="#00f3ff"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Placed Benchmark"
                  dataKey="B"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.2}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                />
                <legend className="text-white" />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
             <div className="text-center text-muted-foreground">
               <p>Make a prediction to see your profile radar chart analysis.</p>
             </div>
          )}
        </div>
      </Card>
    </div>
  );
}

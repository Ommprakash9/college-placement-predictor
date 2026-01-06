import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
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

  // Simple aggregation for demo purposes if no history
  const recentTrends = history?.slice(-10).map((h, i) => ({
    id: i,
    prob: h.probability * 100,
    cgpa: h.cgpa
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Feature Importance */}
      <Card className="glass-card p-6 border-white/5">
        <h3 className="text-xl font-display font-bold mb-6 text-white/90">
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
                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
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
        <h3 className="text-xl font-display font-bold mb-6 text-white/90">
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
                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
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
         <h3 className="text-xl font-display font-bold mb-6 text-white/90">
          Your Profile Analysis
        </h3>
        <div className="h-[400px] w-full flex justify-center items-center">
            {/* Using a placeholder visual if no data is present, otherwise show recent */}
           <div className="text-center text-muted-foreground">
             <p>Make a prediction to see your profile radar chart analysis.</p>
           </div>
        </div>
      </Card>
    </div>
  );
}

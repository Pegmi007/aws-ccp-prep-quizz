import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ExamHistoryEntry {
  date: string;
  score: number;
  total: number;
  percentage: number;
}

interface ProgressionChartProps {
  examHistory: ExamHistoryEntry[];
}

export default function ProgressionChart({ examHistory }: ProgressionChartProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      <div>
        <h3 className="font-bold text-slate-950 text-sm sm:text-base font-display">Progression Globale</h3>
        <p className="text-xs text-slate-500 mt-0.5">Évolution de votre pourcentage de réussite au fil des examens.</p>
      </div>

      <div className="h-64 sm:h-72 w-full pr-4 text-xs font-mono">
        {examHistory && examHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={examHistory}>
              <defs>
                <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '11px' }}
                formatter={(value: any) => [`${value}%`, 'Score']}
              />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="#f97316" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPercentage)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <TrendingUp className="w-10 h-10 animate-pulse text-slate-300" />
            <span>Aucun examen enregistré pour le moment.</span>
          </div>
        )}
      </div>
    </div>
  );
}

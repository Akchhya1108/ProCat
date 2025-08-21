import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnalyticsDashboard({ productivity }) {
  const [timeframe, setTimeframe] = useState('week');
  const [insights, setInsights] = useState([]);
  
  // Mock data for demonstration
  const weeklyData = [
    { day: 'Mon', sessions: 8, focus: 85 },
    { day: 'Tue', sessions: 6, focus: 92 },
    { day: 'Wed', sessions: 10, focus: 78 },
    { day: 'Thu', sessions: 7, focus: 88 },
    { day: 'Fri', sessions: 5, focus: 95 },
    { day: 'Sat', sessions: 3, focus: 70 },
    { day: 'Sun', sessions: 4, focus: 80 }
  ];

  const generateInsights = () => {
    const insights = [];
    const avgSessions = weeklyData.reduce((sum, day) => sum + day.sessions, 0) / 7;
    const bestDay = weeklyData.reduce((best, day) => day.sessions > best.sessions ? day : best);
    const focusScore = weeklyData.reduce((sum, day) => sum + day.focus, 0) / 7;
    
    if (avgSessions > 6) {
      insights.push({
        type: 'success',
        icon: '🎉',
        title: 'Great Consistency!',
        desc: `You averaged ${avgSessions.toFixed(1)} sessions per day this week.`
      });
    }
    
    insights.push({
      type: 'info',
      icon: '📈',
      title: 'Peak Performance',
      desc: `${bestDay.day} was your most productive day with ${bestDay.sessions} sessions.`
    });
    
    if (focusScore > 85) {
      insights.push({
        type: 'success',
        icon: '🎯',
        title: 'Focus Master',
        desc: `Your focus score of ${focusScore.toFixed(1)}% is excellent!`
      });
    }
    
    return insights;
  };

  useEffect(() => {
    setInsights(generateInsights());
  }, [timeframe]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">📊 Analytics</h3>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="text-xs border rounded px-2 py-1"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-100 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-700">{productivity.totalSessions}</div>
          <div className="text-xs text-blue-600">Total Sessions</div>
        </div>
        <div className="bg-green-100 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-700">{Math.floor(productivity.totalTime / 60)}h</div>
          <div className="text-xs text-green-600">Focus Time</div>
        </div>
        <div className="bg-purple-100 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-700">{productivity.streak}</div>
          <div className="text-xs text-purple-600">Current Streak</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Weekly Sessions</h4>
        <div className="flex items-end justify-between h-24">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <motion.div
                className="bg-blue-400 w-6 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(day.sessions / 12) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{ minHeight: '4px' }}
              />
              <span className="text-xs mt-1">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">🧠 Insights</h4>
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`p-2 rounded-lg ${
              insight.type === 'success' ? 'bg-green-100' : 
              insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
            }`}
          >
            <div className="flex items-start gap-2">
              <span>{insight.icon}</span>
              <div>
                <h5 className="text-xs font-medium">{insight.title}</h5>
                <p className="text-xs text-gray-600">{insight.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Habits Tracking */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-3 rounded-lg">
        <h4 className="text-sm font-medium mb-2">🎯 This Week's Habits</h4>
        <div className="space-y-2">
          {[
            { habit: 'Morning Sessions', completion: 85 },
            { habit: 'Taking Breaks', completion: 70 },
            { habit: 'Evening Review', completion: 60 }
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-xs">
                <span>{item.habit}</span>
                <span>{item.completion}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-1.5">
                <motion.div
                  className="bg-purple-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.completion}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
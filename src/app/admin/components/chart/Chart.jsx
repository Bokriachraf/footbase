'use client';
import './chart.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Chart({ title, data, dataKey, grid }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart">
        <h3 className="chartTitle">{title || 'Statistiques'}</h3>
        <p className="text-center text-gray-500">Aucune donnée disponible.</p>
      </div>
    );
  }

  return (
    <div className="chart">
      <h3 className="chartTitle">{title || 'Statistiques'}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="mois" stroke="#5550bd" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" strokeWidth={2} />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}



// 'use client'
// import "./chart.css"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// function Chart({title, data, dataKey, grid}) {
  
//     return (
//         <div className="chart">
//            <h3 className="chartTitle">{title}</h3>
//         <ResponsiveContainer width="100%" aspect={4 / 1}>
//         <LineChart data={data}>
//             <XAxis dataKey="name" stroke="#5550bd"/>
//             <Line type="monotone" dataKey={dataKey} stroke="#5550bd"/>
//             <Tooltip/>
// {       grid &&     <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5"/>
// }        </LineChart>
//         </ResponsiveContainer>
//         </div>
//     )
// }

// export default Chart

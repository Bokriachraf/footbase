'use client'

import Chart from './components/chart/Chart'
import Featuredinfo from './components/featuredinfo/Featuredinfo'
import WidgetSm from './components/widgetSm/WidgetSm'
import WidgetLg from './components/widgetLg/WidgetLg'


const chartData = [
  { mois: 'Jan', demandes: 12 },
  { mois: 'Fév', demandes: 18 },
  { mois: 'Mar', demandes: 25 },
  { mois: 'Avr', demandes: 20 },
  { mois: 'Mai', demandes: 30 },
  { mois: 'Juin', demandes: 22 },
];
export default function AdminDashboardPage() {
  return (
    <div className="home">
      <Featuredinfo />

<Chart title="Évolution des demandes des inscriptions" data={chartData} dataKey="demandes" grid />;      <div className="homeWidgets">
        
        <WidgetLg />
      </div>
    </div>
  )
}
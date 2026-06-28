import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatTimeLabel } from '../../utils/dateFormatter';

const ChartTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <div className="muted-text chart-tooltip__label">{label}</div>
      <strong className="chart-tooltip__value">
        {Math.round(payload[0].value)}°{unit === 'imperial' ? 'F' : 'C'}
      </strong>
    </div>
  );
};

const WeatherChart = ({ items = [], unit }) => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth <= 576);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        label: formatTimeLabel(item.time, { hour: 'numeric' }),
        temp: unit === 'imperial' ? item.tempF : item.tempC,
      })),
    [items, unit],
  );

  if (!chartData.length) {
    return (
      <section className="panel dashboard-grid__span-12">
        <div className="panel__header">
          <div>
            <h3>Temperature Chart</h3>
            <p>Next 24 hours of temperature movement</p>
          </div>
        </div>
        <div className="panel__body">
          <p className="muted-text" style={{ margin: 0 }}>No chart data is available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel dashboard-grid__span-12">
      <div className="panel__header">
        <div>
          <h3>Temperature Chart</h3>
          <p>Next 24 hours of temperature movement</p>
        </div>
      </div>
      <div className="panel__body chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-fill-start)" stopOpacity={0.86} />
                <stop offset="100%" stopColor="var(--chart-fill-end)" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="5 5" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              minTickGap={isCompact ? 48 : 28}
              interval="preserveStartEnd"
              tickCount={isCompact ? 4 : 8}
            />
            <YAxis tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} axisLine={false} tickLine={false} width={42} />
            <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: 'var(--chart-grid)', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="temp" stroke="var(--chart-stroke)" fill="url(#temperatureGradient)" strokeWidth={3} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default WeatherChart;

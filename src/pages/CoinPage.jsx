import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function CoinPage() {
  const { id } = useParams();

  const [coin, setCoin] = useState(null);
  const [chart, setChart] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoin();
  }, [id, days]);

  async function fetchCoin() {
    setLoading(true);

    try {
      const coinResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );

      const coinData = await coinResponse.json();
      setCoin(coinData);

      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );

      const chartData = await chartResponse.json();

      const prices = chartData.prices.map((item) => ({
        time:
          days === 1
            ? new Date(item[0]).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date(item[0]).toLocaleDateString(),
        price: Number(item[1].toFixed(2)),
      }));

      setChart(prices);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="coin-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="coin-page">
      <Link className="back-btn" to="/">
        ← Back
      </Link>

      <div className="coin-header">
        <img src={coin.image.large} alt={coin.name} />

        <div>
          <h1>{coin.name}</h1>
          <p>{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="coin-info">
        <div className="info-card">
          <span>Price</span>
          <h3>${coin.market_data.current_price.usd.toLocaleString()}</h3>
        </div>

        <div className="info-card">
          <span>24H</span>
          <h3
            style={{
              color:
                coin.market_data.price_change_percentage_24h > 0
                  ? "lime"
                  : "red",
            }}
          >
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </h3>
        </div>

        <div className="info-card">
          <span>Market Cap</span>
          <h3>
            $
            {coin.market_data.market_cap.usd.toLocaleString()}
          </h3>
        </div>

        <div className="info-card">
          <span>Volume</span>
          <h3>
            $
            {coin.market_data.total_volume.usd.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="chart-buttons">
        <button onClick={() => setDays(1)}>24H</button>
        <button onClick={() => setDays(7)}>7D</button>
        <button onClick={() => setDays(30)}>30D</button>
        <button onClick={() => setDays(90)}>90D</button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={chart}>
            <XAxis dataKey="time" hide={days === 1 ? false : true} />
            <YAxis
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00ff99"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CoinPage;
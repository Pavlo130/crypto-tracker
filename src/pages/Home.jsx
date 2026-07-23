import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");

  async function crypto() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );

      const data = await response.json();
      setCoins(data);
    } catch {
      setError("Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    crypto();
  }, []);

  return (
    <div className="home">
      <h1 className="title">Crypto Tracker</h1>

      <input
        className="search"
        type="text"
        placeholder="Search coin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        <button onClick={() => setMode("all")}>All</button>
        <button onClick={() => setMode("gainers")}>📈 Gainers</button>
        <button onClick={() => setMode("losers")}>📉 Losers</button>
      </div>

      {loading && <h2>Loading...</h2>}

      {error && <h2>{error}</h2>}

      {!loading &&
        !error &&
        coins.filter((coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && <p className="empty">No coins found</p>}

      <div className="coin-list">
        {coins
          .filter((coin) => {
            const matchesSearch = coin.name
              .toLowerCase()
              .includes(search.toLowerCase());

            const matchesMode =
              mode === "all"
                ? true
                : mode === "gainers"
                ? coin.price_change_percentage_24h > 0
                : coin.price_change_percentage_24h < 0;

            return matchesSearch && matchesMode;
          })
          .map((coin) => (
            <Link
              key={coin.id}
              to={`/coin/${coin.id}`}
              className="coin-link"
            >
              <div className="coin-card">
                <img src={coin.image} alt={coin.name} />

                <h2>{coin.name}</h2>

                <p>{coin.symbol.toUpperCase()}</p>

                <p
                  style={{
                    color:
                      coin.price_change_percentage_24h > 0
                        ? "lime"
                        : "red",
                  }}
                >
                  ${coin.current_price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
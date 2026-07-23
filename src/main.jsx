import React from "react";
import { createRoot } from "react-dom/client";
import { ConditionCard } from "./components/ConditionCard";
import { Header } from "./components/Header";
import { RadarCard } from "./components/RadarCard";
import { SurfForecastCard } from "./components/SurfForecastCard";
import { WeatherSummaryCard } from "./components/WeatherSummaryCard";
import { WindSummaryCard } from "./components/WindSummaryCard";
import { getCachedConditions, LIVE_CONDITIONS_CACHE_MS, loadLiveConditions, writeConditionsCache } from "./data/liveConditions";
import data from "./data/mockConditions.json";
import "./styles.css";

const App = () => {
  const initialConditions = React.useMemo(() => getCachedConditions(data), []);
  const [conditions, setConditions] = React.useState(initialConditions);
  const [isWeatherReady, setIsWeatherReady] = React.useState(initialConditions.dataSource === "live");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const refreshConditions = React.useCallback((options = {}) => {
    setIsRefreshing(true);

    return loadLiveConditions(data, options)
      .then((liveConditions) => {
        writeConditionsCache(liveConditions);
        setConditions(liveConditions);
        setIsWeatherReady(true);
      })
      .catch(() => {
        const cachedConditions = getCachedConditions(data);
        setConditions(cachedConditions);
        setIsWeatherReady(cachedConditions.dataSource === "live");
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    refreshConditions();

    const intervalId = window.setInterval(() => {
      if (isMounted) refreshConditions({ force: true });
    }, LIVE_CONDITIONS_CACHE_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [refreshConditions]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-shell text-ink">
      <div className="mx-auto h-[800px] w-[1280px] overflow-hidden border-t-[3px] border-[#252A32] bg-shell">
        <Header
          conditions={conditions}
          isWeatherReady={isWeatherReady}
          isRefreshing={isRefreshing}
          onRefresh={() => refreshConditions({ force: true })}
        />
        <div className="grid h-[736px] grid-cols-[344px_190px_1fr] grid-rows-[328px_328px] gap-4 p-8">
          <ConditionCard conditions={conditions} />
          <WindSummaryCard wind={conditions.wind} isReady={isWeatherReady} />
          <WeatherSummaryCard forecast={conditions.wind.hourlyForecast} sun={conditions.weather} isReady={isWeatherReady} />
          <div className="col-span-2">
            <SurfForecastCard outlook={conditions.surfOutlook} />
          </div>
          <RadarCard />
        </div>
      </div>
    </main>
  );
};

createRoot(document.getElementById("root")).render(<App />);

import axios from "axios";
import { useState } from "react";

const API =
  "http://localhost:8000/api/simulation";

const SPEED_PRESETS = [
  0.5,
  1,
  2,
  5,
  10,
  20,
];

const ENVIRONMENT_PRESETS = [
  {
    name: "Default",
    temperature: 0.5,
    humidity: 0.5,
    sunlight: 0.5,
    resource_regeneration_rate: 0.05,
  },
  {
    name: "Drought",
    temperature: 0.9,
    humidity: 0.1,
    sunlight: 0.9,
    resource_regeneration_rate: 0.02,
  },
  {
    name: "Rainforest",
    temperature: 0.7,
    humidity: 0.95,
    sunlight: 0.8,
    resource_regeneration_rate: 0.12,
  },
  {
    name: "Ice Age",
    temperature: 0.05,
    humidity: 0.4,
    sunlight: 0.15,
    resource_regeneration_rate: 0.01,
  },
  {
    name: "Desert",
    temperature: 0.95,
    humidity: 0.05,
    sunlight: 1.0,
    resource_regeneration_rate: 0.015,
  },
  {
    name: "Volcanic",
    temperature: 1.0,
    humidity: 0.2,
    sunlight: 0.7,
    resource_regeneration_rate: 0.04,
  },
  {
    name: "Resource Boom",
    temperature: 0.5,
    humidity: 0.8,
    sunlight: 0.8,
    resource_regeneration_rate: 0.2,
  },
];

export default function SimulationControls() {

  const [speed, setSpeed] =
    useState(1);

  const [temperature, setTemperature] =
    useState(0.5);

  const [humidity, setHumidity] =
    useState(0.5);

  const [sunlight, setSunlight] =
    useState(0.5);

  const [
    resourceRegen,
    setResourceRegen,
  ] = useState(0.05);

  const [
    activePreset,
    setActivePreset,
  ] = useState("Default");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleRequest = async (
    fn: () => Promise<void>
  ) => {

    try {

      setLoading(true);

      setError(null);

      await fn();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "An error occurred"
      );

      console.error(err);

    } finally {

      setLoading(false);

    }


  };

  const start = () =>
    handleRequest(async () => {
      await axios.post(`${API}/start`);
    });

  const pause = () =>
    handleRequest(async () => {
      await axios.post(`${API}/pause`);
    });

  const resume = () =>
    handleRequest(async () => {
      await axios.post(`${API}/resume`);
    });

  const reset = () =>
    handleRequest(async () => {
      await axios.post(`${API}/reset`);
    });

  const updateSpeed = (
    value: number
  ) => {


    setSpeed(value);

    handleRequest(async () => {

      await axios.post(
        `${API}/speed`,
        {
          speed: value,
        }
      );
    });


  };

  const updateEnvironment =
    async (
      overrides?: Partial<{
        temperature: number;
        humidity: number;
        sunlight: number;
        resource_regeneration_rate: number;
      }>
    ) => {


      await axios.post(
        `${API}/environment`,
        {
          temperature,
          humidity,
          sunlight,
          resource_regeneration_rate:
            resourceRegen,
          ...overrides,
        }
      );
    };


  const applyPreset = async (
    preset:
      typeof ENVIRONMENT_PRESETS[number]
  ) => {


    setActivePreset(
      preset.name
    );

    setTemperature(
      preset.temperature
    );

    setHumidity(
      preset.humidity
    );

    setSunlight(
      preset.sunlight
    );

    setResourceRegen(
      preset.resource_regeneration_rate
    );

    await axios.post(
      `${API}/environment`,
      preset
    );


  };

  const environmentSlider =
    (
      label: string,
      value: number,
      setter: (
        value: number
      ) => void,
      field:
        | "temperature"
        | "humidity"
        | "sunlight"
        | "resource_regeneration_rate",
      min: number,
      max: number,
      step: number
    ) => (<div className="space-y-1">


      <div className="flex justify-between text-sm">

        <span>
          {label}
        </span>

        <span className="text-slate-400">
          {value.toFixed(2)}
        </span>

      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={loading}
        aria-label={label}
        className="w-full"
        onChange={(e) => {

          const next =
            Number(
              e.target.value
            );

          setActivePreset(
            "Custom"
          );

          setter(next);

          handleRequest(
            async () => {

              await updateEnvironment(
                {
                  [field]:
                    next,
                }
              );

            }
          );
        }}
      />

    </div>
    );


  return (<div className="rounded-xl border border-slate-800 bg-slate-900 p-4">


    <h3 className="mb-4 text-lg font-semibold">
      Simulation Controls
    </h3>

    {error && (
      <div className="mb-4 rounded bg-red-900/30 p-2 text-sm text-red-400">
        {error}
      </div>
    )}

    <div className="mb-5 flex gap-2">

      <button
        onClick={start}
        disabled={loading}
        className="flex-1 rounded bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
      >
        Start
      </button>

      <button
        onClick={pause}
        disabled={loading}
        className="flex-1 rounded bg-amber-600 px-3 py-2 text-sm font-medium hover:bg-amber-500"
      >
        Pause
      </button>

      <button
        onClick={resume}
        disabled={loading}
        className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500"
      >
        Resume
      </button>

      <button
        onClick={reset}
        disabled={loading}
        className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500"
      >
        Reset
      </button>

    </div>

    <div className="mb-6">

      <div className="mb-2 text-sm font-medium">
        Environment Presets
      </div>

      <div className="grid grid-cols-2 gap-2">

        {ENVIRONMENT_PRESETS.map(
          (preset) => (
            <button
              key={preset.name}
              onClick={() =>
                applyPreset(
                  preset
                )
              }
              className={
                activePreset ===
                  preset.name
                  ? "rounded bg-cyan-600 px-2 py-2 text-xs"
                  : "rounded bg-slate-800 px-2 py-2 text-xs hover:bg-slate-700"
              }
            >
              {preset.name}
            </button>
          )
        )}

      </div>

    </div>

    <div className="space-y-5">

      {environmentSlider(
        "Temperature",
        temperature,
        setTemperature,
        "temperature",
        0,
        1,
        0.01
      )}

      {environmentSlider(
        "Humidity",
        humidity,
        setHumidity,
        "humidity",
        0,
        1,
        0.01
      )}

      {environmentSlider(
        "Sunlight",
        sunlight,
        setSunlight,
        "sunlight",
        0,
        1,
        0.01
      )}

      {environmentSlider(
        "Resource Regeneration",
        resourceRegen,
        setResourceRegen,
        "resource_regeneration_rate",
        0.001,
        0.2,
        0.001
      )}

    </div>

    <div className="mt-6">

      <div className="mb-2 text-sm font-medium">
        Simulation Speed
      </div>

      <input
        type="range"
        min="0.1"
        max="20"
        step="0.1"
        value={speed}
        aria-label="Simulation Speed"
        onChange={(e) =>
          updateSpeed(
            Number(
              e.target.value
            )
          )
        }
        className="w-full"
      />

      <div className="mt-1 text-xs text-slate-400">
        {speed.toFixed(2)}x
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2">

        {SPEED_PRESETS.map(
          (value) => (
            <button
              key={value}
              onClick={() =>
                updateSpeed(
                  value
                )
              }
              className={
                Math.abs(
                  speed -
                  value
                ) < 0.01
                  ? "rounded bg-cyan-600 px-2 py-1 text-xs"
                  : "rounded bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700"
              }
            >
              {value}x
            </button>
          )
        )}

      </div>

    </div>

  </div>

  );
}

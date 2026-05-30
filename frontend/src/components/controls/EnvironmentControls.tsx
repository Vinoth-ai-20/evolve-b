export default function EnvironmentControls() {
  return (
    <div>

      <h3>Environment</h3>

      <label>
        Temperature
      </label>

      <input
        type="range"
        min="-1"
        max="1"
        step="0.01"
        aria-label="Temperature"
      />

    </div>
  );
}
import React from "react";
import ReactSlider from "react-slider";

function ControlPanel({
  opacity,
  setOpacity,
  visibility,
  setVisibility,
  selectedState,
  setSelectedState,
  states,
}) {
  return (
    <div className="sidebar">
      <div className="controls">
        <label>
          Layer Opacity:
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            value={opacity}
            onChange={setOpacity}
            min={0}
            max={1}
            step={0.01}
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow.toFixed(2)}</div>
            )}
          />
        </label>
        <label>
          Fill Visibility:
          <select
            value={visibility ? "On" : "Off"}
            onChange={(e) => setVisibility(e.target.value === "On")}
          >
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
        </label>
        <label>
          Select State:
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All States">All States</option>
            {states.map((state, index) => (
              <option
                key={index}
                value={state.properties ? state.properties.name : "Unknown"}
              >
                {state.properties ? state.properties.name : "No Name"}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default ControlPanel;

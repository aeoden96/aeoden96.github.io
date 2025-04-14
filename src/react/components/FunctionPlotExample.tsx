import React, { useState } from "react";
import FunctionPlot from "./FunctionPlot";

const examples = [
  {
    name: "Sine Wave",
    fn: (x: number, z: number) => Math.sin(x) * Math.cos(z),
    xRange: [-5, 5] as [number, number],
    zRange: [-5, 5] as [number, number],
  },
  {
    name: "Gaussian",
    fn: (x: number, z: number) => 3 * Math.exp(-(x * x + z * z) / 3),
    xRange: [-5, 5] as [number, number],
    zRange: [-5, 5] as [number, number],
  },
  {
    name: "Ripple",
    fn: (x: number, z: number) => {
      const d = Math.sqrt(x * x + z * z);
      return Math.sin(d * 2) / (d + 1);
    },
    xRange: [-5, 5] as [number, number],
    zRange: [-5, 5] as [number, number],
  },
  {
    name: "Saddle",
    fn: (x: number, z: number) => x * x - z * z,
    xRange: [-3, 3] as [number, number],
    zRange: [-3, 3] as [number, number],
  },
];

export default function FunctionPlotExample() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [resolution, setResolution] = useState(50);
  const [color, setColor] = useState("#00a0ff");

  const currentExample = examples[selectedExample];

  return (
    <div className="function-plot-example p-4">
      <div className="mb-4 flex gap-2 flex-wrap">
        {examples.map((example, index) => (
          <button
            key={example.name}
            onClick={() => setSelectedExample(index)}
            className={`px-3 py-1 rounded-md ${
              selectedExample === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {example.name}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={() => setWireframe(!wireframe)}
            className="rounded"
          />
          Wireframe
        </label>

        <div className="flex items-center gap-2">
          <span>Resolution:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={resolution}
            onChange={(e) => setResolution(parseInt(e.target.value))}
            className="w-32"
          />
          <span>{resolution}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>

      <FunctionPlot
        fn={currentExample.fn}
        xRange={currentExample.xRange}
        zRange={currentExample.zRange}
        wireframe={wireframe}
        resolution={resolution}
        color={color}
        height={500}
      />

      <div className="mt-4 bg-gray-100 p-4 rounded-md">
        <h3 className="font-bold mb-2">Function Definition:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          {currentExample.fn.toString()}
        </pre>
      </div>
    </div>
  );
}

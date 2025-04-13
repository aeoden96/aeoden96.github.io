import React, { useEffect, useRef } from "react";
import perlinFragmentShader from "../../shaders/perlin";
import { getGlowCirclesShader } from "../../shaders/glow_circles";

// Vertex shader - just pass through positions
const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const getShader = (shader: string, step?: number) => {
  return {
    perlin: perlinFragmentShader,
    glow_circles: getGlowCirclesShader(step ?? 19),
  }[shader];
};

// Initialize a shader program from source code
function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    console.error("Unable to load shaders");
    return null;
  }

  // Create the shader program
  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    console.error("Unable to create shader program");
    return null;
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Check if it linked successfully
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

// Create a shader of the given type, uploads the source and compiles it
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error("Unable to create shader");
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Check if compilation was successful
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Create the vertex positions for a square that covers the entire canvas
function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Create a square that covers the entire clip space
  const positions = [-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

const containerStyle = {
  width: "100%",
  height: "600px",
  margin: "2rem 0",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const canvasStyle = {
  width: "100%",
  height: "100%",
  display: "block",
};

type Props = {
  shader: string;
  step?: number;
};

export default function TutorialFragmentViewer({ shader, step }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const fragmentShader = getShader(shader, step);

  if (!fragmentShader) {
    console.error("Shader not found");
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Set clear color to black and clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize a shader program
    const shaderProgram = initShaderProgram(
      gl,
      vertexShaderSource,
      fragmentShader
    );

    if (!shaderProgram) {
      console.error("Unable to initialize shader program");
      return;
    }

    // Collect all the info needed to use the shader program
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, "uTime"),
        resolution: gl.getUniformLocation(shaderProgram, "uResolution"),
      },
    };

    // Create buffers
    const buffers = initBuffers(gl);

    // Resize canvas to match its displayed size
    function resizeCanvasToDisplaySize() {
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      if (!gl) {
        console.error("WebGL not supported");
        return;
      }

      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    }

    // Draw the scene repeatedly
    let startTime = Date.now();

    function render() {
      resizeCanvasToDisplaySize();

      if (!gl) {
        console.error("WebGL not supported");
        return;
      }

      // Calculate time
      const currentTime = (Date.now() - startTime) / 1000;

      // Clear the canvas
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Tell WebGL how to pull out the positions from the position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2, // 2 components per vertex
        gl.FLOAT, // the data is 32bit floats
        false, // don't normalize
        0, // stride
        0 // offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      // Tell WebGL to use our program
      gl.useProgram(programInfo.program);

      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      // Set the uniforms
      gl.uniform1f(programInfo.uniformLocations.time, currentTime);
      gl.uniform2f(
        programInfo.uniformLocations.resolution,
        canvas.width,
        canvas.height
      );

      // Draw the square
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

      // Request another frame
      animationRef.current = requestAnimationFrame(render);
    }

    // Start the animation loop
    render();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      style={containerStyle}
      className="fragment-viewer-container aspect-square"
    >
      <canvas
        ref={canvasRef}
        style={canvasStyle}
        className="fragment-viewer-canvas aspect-square"
      />
    </div>
  );
}

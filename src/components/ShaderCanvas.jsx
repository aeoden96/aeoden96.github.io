import React, { useEffect, useRef } from 'react';

// Vertex shader - just pass through positions
const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

// Fragment shader - creates a colorful gradient
const fragmentShaderSource = `
  precision mediump float;
  
  uniform float uTime;
  uniform vec2 uResolution;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    // Create a simple gradient based on position
    vec3 color = vec3(uv.x, uv.y, sin(uTime * 0.5) * 0.5 + 0.5);
    
    // Output the color
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Initialize a shader program from source code
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Check if it linked successfully
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// Create a shader of the given type, uploads the source and compiles it
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Check if compilation was successful
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Create the vertex positions for a square that covers the entire canvas
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Create a square that covers the entire clip space
  const positions = [
    -1.0, -1.0,
     1.0, -1.0,
     1.0,  1.0,
    -1.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

const containerStyle = {
  width: '100%',
  height: '400px',
  margin: '2rem 0',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const canvasStyle = {
  width: '100%',
  height: '100%',
  display: 'block'
};

export default function ShaderCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    // Only continue if WebGL is available and working
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Set clear color to black and clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize a shader program
    const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    
    // Collect all the info needed to use the shader program
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, 'uTime'),
        resolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
      },
    };

    // Create buffers
    const buffers = initBuffers(gl);

    // Resize canvas to match its displayed size
    function resizeCanvasToDisplaySize() {
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
      
      // Calculate time
      const currentTime = (Date.now() - startTime) / 1000;

      // Clear the canvas
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Tell WebGL how to pull out the positions from the position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2,        // 2 components per vertex
        gl.FLOAT, // the data is 32bit floats
        false,    // don't normalize
        0,        // stride
        0         // offset
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      // Tell WebGL to use our program
      gl.useProgram(programInfo.program);

      // Set the uniforms
      gl.uniform1f(programInfo.uniformLocations.time, currentTime);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);

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
    <div style={containerStyle} className="shader-container">
      <canvas 
        ref={canvasRef} 
        style={canvasStyle}
        className="shader-canvas"
      />
    </div>
  );
} 
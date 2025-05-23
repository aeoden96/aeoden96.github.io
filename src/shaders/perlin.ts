const perlinFragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uResolution;
  
  vec2 randomGradient(vec2 p) {
    p = p + 0.01;
    float x = dot(p, vec2(123.4, 234.5));
    float y = dot(p, vec2(234.5, 345.6));
    
    vec2 gradient = vec2(x, y);
    
    gradient = sin(gradient);
    
    gradient = gradient * 43758.5453;
    
    gradient = sin(gradient + uTime);
    return gradient;
  }

  float sdfOrientedBox(in vec2 p, in vec2 a, in vec2 b, float th) {
    float l = length(b - a);
    vec2 d = (b - a) / l;
    vec2 q = (p - (a + b) * 0.5);
    q = mat2(d.x, -d.y, d.y, d.x) * q;
    q = abs(q) - vec2(l, th) * 0.5;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  }

  vec2 quintic(vec2 p) {
    return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
  }

  float sdfCircle(vec2 p, float r) {
    return length(p) - r;
  }

  void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / uResolution.xy;
    
    vec3 black = vec3(0.);
    vec3 white = vec3(1.);
    vec3 color = black;
    
    uv = uv * 4.;
    vec2 gridId = floor(uv);
    vec2 gridUv = fract(uv);
    
    color = vec3(gridUv, 0.);
    
    vec2 bl = gridId + vec2(0.0, 0.0);
    vec2 br = gridId + vec2(1.0, 0.0);
    vec2 tl = gridId + vec2(0.0, 1.0);
    vec2 tr = gridId + vec2(1.0, 1.0);
    
    // Random gradient from each edge point
    vec2 gradBl = randomGradient(bl);
    vec2 gradBr = randomGradient(br);
    vec2 gradTl = randomGradient(tl);
    vec2 gradTr = randomGradient(tr);
    
    vec2 gridCell = gridId + gridUv;
    float distG1 = sdfOrientedBox(gridCell, bl, bl + gradBl / 2.0, 0.02);
    float distG2 = sdfOrientedBox(gridCell, br, br + gradBr / 2.0, 0.02);
    float distG3 = sdfOrientedBox(gridCell, tl, tl + gradTl / 2.0, 0.02);
    float distG4 = sdfOrientedBox(gridCell, tr, tr + gradTr / 2.0, 0.02);
    if (distG1 < 0.0 || distG2 < 0.0 || distG3 < 0.0 || distG4 < 0.0) {
      color = vec3(1.0);
    }
    
    // For visualization
    float circleRadius = 0.025;
    vec2 circleCenter = vec2(0.5, 0.5);
    float distToCircle = sdfCircle(gridUv - circleCenter, circleRadius);
    color = distToCircle > 0.0 ? color : white;
    
    vec2 distFromPixelToBl = gridUv - vec2(0.0, 0.0);
    vec2 distFromPixelToBr = gridUv - vec2(1.0, 0.0);
    vec2 distFromPixelToTl = gridUv - vec2(0.0, 1.0);
    vec2 distFromPixelToTr = gridUv - vec2(1.0, 1.0);
    
    float dotBl = dot(gradBl, distFromPixelToBl);
    float dotBr = dot(gradBr, distFromPixelToBr);
    float dotTl = dot(gradTl, distFromPixelToTl);
    float dotTr = dot(gradTr, distFromPixelToTr);
    
    gridUv = quintic(gridUv);
    
    // Linear interpolation between 4 dot products
    float b = mix(dotBl, dotBr, gridUv.x);
    float t = mix(dotTl, dotTr, gridUv.x);
    float perlin = mix(b, t, gridUv.y);
    
    color = vec3(perlin + 0.1);
    color = distToCircle > 0.0 ? color : white;

    // Output to screen
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default perlinFragmentShader;

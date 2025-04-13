const palleteAndVars = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

vec3 palette(float t) {
    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(1., 1., 1.);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b*cos( 6.28318*(c*t+d));
}
`;

const mainFunction = `
void main() {
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = gl_FragCoord.xy/uResolution.xy * 2.0 - 1.0;
        
    // Aspect ratio adjustment
    uv.x *= uResolution.x / uResolution.y; // uv.x is not from -1.78 to 1.78
    
    // short form
    // vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
    
    // --------------------------------------
    
    // Output to screen
    gl_FragColor = vec4(generate(uv), 1.0);
}
`;

const step1 = `
// Signed distance fn (SDF) of a circle with r = 0.5
// r > 0 - outside of sphere
// r = 0 - on the sphere radius
// r < 0 - inside the sphere
vec3 generate(vec2 uv) {
   float d = length(uv);
    d -= 0.5;
    d = abs(d);// Added abs() to reverse the inside
    
    return vec3(d,d,d);
}
`;

const step2 = `

// Introducing step function
// - points further from the sphere radius than offset (0.1) -> white (0.0)
// - points closer to the sphere radius than offset (0.1) -> black (1.0)
vec3 generate(vec2 uv) {
   float d = length(uv);
    d -= 0.5;
    d = abs(d); 
    
    d = step(0.1, d); 
    // creates a ring around the sphere of thickness 0.2
    
    return vec3(d,d,d);
}



//  to note: smoothstep(0.049,0.051, d) ===== step(0.1, d)
`;

const step3 = `

// Introducing smooth step function
// d < a -> black (0.0)
// d in [a,b] -> interpolation
// d > b -> white (1.0)
vec3 generate(vec2 uv) {
   float d = length(uv);
    d -= 0.5;
     d = abs(d); 
    
    d = smoothstep(0.0,0.1, d);
    
    return vec3(d,d,d);
}
`;

const step4 = `

// Apply sin() to d to create a radial repetition of the ring (instead of fixed radius = 0.5)
// Note: It will look like a small circle with r = .1:
//    because of the step fn
//    and because sin ~ x (for x around 0)
vec3 generate(vec2 uv) {
   float d = length(uv);

    d = sin(d);
    d = abs(d); 
    d = smoothstep(0.0,0.1, d);
    
    return vec3(d,d,d);
}
`;

const step5 = `
// We alter sin() funciton:
// - multiply it with p - to shrink oscillation lenght (so we can se more than one ring on [0,1]
// - divide by p - to reduce amplitude (color sharpness)
//
// Note: sin(px)/p 'zooms out' sin fn so it generates p-oscilations on [0, 2π]
// Note: if p = 2π, one full oscilation will occur on [0,1]
vec3 generate(vec2 uv) {
   float d = length(uv);

    d = sin(d * 8.)/ 8.;
    d = abs(d); 
    d = smoothstep(0.0,0.1, d);
    
    return vec3(d,d,d);
}
`;

const step6 = `
// Adding uTime component
vec3 generate(vec2 uv) {
   float d = length(uv);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = smoothstep(0.0,0.1, d);
    
    return vec3(d,d,d);
}
`;

const step7 = `
// For 'Neon' look, 1/x is much better than smoothstep
// Note: 1/x on [0,1] is >> 1, therefore white (0.0), so we introduce factor 0.01
// 1/x creates a sharp white line with diminishing dark background
vec3 generate(vec2 uv) {
   float d = length(uv);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    return vec3(d,d,d);
}
`;

const step8 = `

// Introducing color
// We just tinted the white areas with blue color
vec3 generate(vec2 uv) {
   float d = length(uv);
   
   vec3 col = vec3(1.0, 2.0, 3.0);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    return col * d;

}
    `;

const step9 = `
// Using color palette
// It changes color from the center of the sphere to the edge
// Note: Rings sometimes look like they change width, that is just due to color change
vec3 generate(vec2 uv) {
   float d = length(uv);
   
   vec3 col = palette(d);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    
    return col * d;
}
    `;

const step10 = `
// Palette is constant for some point p
// Using time variable, we're making the palette gradient dinamic
vec3 generate(vec2 uv) {
   float d = length(uv);
   
   vec3 col = palette(d + uTime);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    
    return col * d;
}
    `;

const step11 = `

// Spacial repetition
// frac(x,y) return fraction part of x
// if uv is [-1,1]x[-1,1] and some xy in it, frac will 
// return SAME value for each of the points xy, -xy, x-y, -x-y
// ISSUE: each small section is now a copy of a I. quadrant: [0,1]x[0,1] area
vec3 generate(vec2 uv) {
    uv = fract(uv);

   float d = length(uv);
   
   vec3 col = palette(d + uTime);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    
    return col * d;
}
`;

const step12 = `
// Spacial repetition - issue fix
// Its as simple as offseting uv by 0.5
// If me multiply uv by p:
//  - before fract: it will widen the area, therefore multiply the # of grid elements
//  - after  fract: it will widen the area, therefore shrink each individual grid item
vec3 generate(vec2 uv) {
    
    uv *= 2.; // [-2,2]x[-2,2] (it will duplicate oscillations)
    uv = fract(uv); // [-2,2] -> 4 segments -> [0,1]x[0,1]
    uv -= 0.5; // each segment is now in [-1,1]x[-1,1]    
    
   // d now represents local distance relative to the center of each repetition
   float d = length(uv);
   
   vec3 col = palette(d + uTime);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    
    return col * d;
}
`;

const step13 = `

// Saving the original distance to the center of the canvas
// We alter the color with d0, that way we override individual colors from each quadrant
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    uv = fract(uv * 2.0) - 0.5; 
    
    float d = length(uv);
    float d0 = length(uv0);
   
   vec3 col = palette(d0 + uTime);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    
    return col * d;
}
`;

const step14 = `
// Introducing finalColor
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    
    uv = fract(uv * 2.0) - 0.5; 
    
    float d = length(uv);
    float d0 = length(uv0);
   
    vec3 col = palette(d0 + uTime);

    d = sin(d * 8. + uTime)/ 8.;
    d = abs(d); 
    d = 0.02/d;
    
    finalColor += col * d;
    return finalColor;
}
`;

const step15 = `

// Introducing loop
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    for(float i=0.; i< 3.; i++){
        uv = fract(uv * 2.0) - 0.5; 
    
        float d = length(uv);
        float d0 = length(uv0);

        vec3 col = palette(d0 + uTime*.3);

        d = sin(d * 8. + uTime)/ 8.;
        d = abs(d); 
        d = 0.02/d;

        finalColor += col * d;
    
    }
    
    
    return finalColor;
}
`;

const step16 = `
// Fixing the issue: perfect matching of repetitions
// We divide the quadrants by a fraction, so each subdivision is generated with an offset
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    for(float i=0.; i< 2.; i++){
        uv = fract(uv * 1.5) - 0.5; 
    
        float d = length(uv);
        float d0 = length(uv0);

        vec3 col = palette(d0 + uTime*.3);

        d = sin(d * 8. + uTime)/ 8.;
        d = abs(d); 
        d = 0.02/d;

        finalColor += col * d;
    
    }
    
    
    return finalColor;
}
`;

const step17 = `
// Introducing exp to increase variations further
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    for(float i=0.; i< 3.; i++){
        uv = fract(uv * 1.5) - 0.5; 
    
        float d0 = length(uv0);

        float d = length(uv) * exp(-d0) ;

        vec3 col = palette(d0 + uTime*.2);

        d = sin(d * 8. + uTime)/ 8.;
        d = abs(d); 
        d = 0.01/d;

        finalColor += col * d;
    
    }
    
    
    return finalColor;
}
`;

const step18 = `
// Introducing i for color offsets for each iteration
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    for(float i=0.; i< 3.; i++){
        uv = fract(uv * 1.5) - 0.5; 
    
        float d0 = length(uv0);

        float d = length(uv) * exp(-d0) ;

        vec3 col = palette(d0 + i*.4 + uTime*.2);

        d = sin(d * 8. + uTime)/ 8.;
        d = abs(d); 
        d = 0.01/d;

        finalColor += col * d;
    
    }
    
    
    return finalColor;
}
`;

const step19 = `
// Introducing pow to enhance contrast of the image
// controls intensity, pow() on [0,1] reduces lower shades to 0
vec3 generate(vec2 uv) {

    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
    for(float i=0.; i< 3.; i++){
        uv = fract(uv * 1.5) - 0.5; 
    
        float d0 = length(uv0);

        float d = length(uv) * exp(-d0) ;

        vec3 col = palette(d0 + i*.4 + uTime*.2);

        d = sin(d * 8. + uTime)/ 8.;
        d = abs(d); 
        d = pow(0.01/d, 1.2); 

        finalColor += col * d;
    
    }
    
    
    return finalColor;
}
`;

const glowCirclesFragmentShader = `
${palleteAndVars}
${step19}
${mainFunction}
`;

export const getStepCode = (step: number) => {
  return (
    {
      1: step1,
      2: step2,
      3: step3,
      4: step4,
      5: step5,
      6: step6,
      7: step7,
      8: step8,
      9: step9,
      10: step10,
      11: step11,
      12: step12,
      13: step13,
      14: step14,
      15: step15,
      16: step16,
      17: step17,
      18: step18,
      19: step19,
    }[step] || step19
  );
};

export const getGlowCirclesShader = (step: number) => {
  const stepCode = getStepCode(step);

  return `${palleteAndVars}${stepCode}${mainFunction}`;
};

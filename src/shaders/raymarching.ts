const palleteAndVars = `
precision highp float;

uniform float uTime;
uniform vec3 uMouse;
uniform vec2 uResolution;

vec3 palette(float t) {
    vec3 a = vec3(0.5,0.5,0.5);
    vec3 b = vec3(0.5,0.5,0.5);
    vec3 c = vec3(1., 1., 1.);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b*cos( 6.28318*(c*t+d));
}


float sdSphere(vec3 p, float s){
    return length(p) - s;
}

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}


float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}


float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}


vec3 rot3D(vec3 p , vec3 axis, float angle) {
    return mix(dot(axis,p) * axis, p , cos(angle)) + cross(axis,p)* sin(angle);
}

mat2 rot2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);

}


float map(vec3 p) {
    vec3 spherePos = vec3(sin(uTime)* 3.,0,0);
    // SDF of a sphere ((0,0,0), 1)
    float sphere = sdSphere(p - spherePos, .1);
   
    

    
    // Rotation
     //vec3 q = p;  // Input copy
     //q.xy *= rot2D(uTime);
   // float box = sdBox(q, vec3(.75));
    
    
    // Space repetition
    vec3 q = p;  // Input copy
    
    // upward movement
    q.y -= uTime * .4;
    
    q = fract(q) - .5;
    
    float box = sdBox(q, vec3(.1)); //cube is scaled down, because it has bigger side length than fract, so it fills all space
    
    
    // Space repetition - single axis
    // q.xy = fract(p.xy) - .5;


    //Scaled cube
    //float box = sdBox(p * 4., vec3(.75))/ 4.;
    
    

    
    float ground = p.y + .75;

    return opSmoothUnion(ground,opSmoothUnion(box,sphere, 1.), 1.);
    
}




float map2(vec3 p) {
    p.z += uTime * .4;

      p = fract(p) - .5;

    float box = sdBox(p, vec3(.1));
    

    return box;
    
}

// Using octahedron instead of cube
// Decreased spacing in z direction
float map3(vec3 p) {
    p.z += uTime * .4;
    
    
        
    p.xy = fract(p.xy) - .5;
    p.z = mod(p.z, .25) - .125;
  
    float box = sdOctahedron(p, .15);
    

    return box;
    
}


`;

const mainFunction = `
void main() {
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = gl_FragCoord.xy/uResolution.xy * 2.0 - 1.0;
    vec2 m = (uMouse.xy * 2.0 - uResolution.xy) / uResolution.y;
        
    // Aspect ratio adjustment
    uv.x *= uResolution.x / uResolution.y; // uv.x is not from -1.78 to 1.78
    
    // short form
    // vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
    
    // --------------------------------------
    
    // Output to screen
    gl_FragColor = vec4(generate(uv, m), 1.0);
}
`;

const step1 = `
vec3 generate(vec2 uv, vec2 m) {

   // Initialization
   vec3 ro = vec3(0,0,-3); // ray origin, towards us, the camera
   vec3 rd = normalize(vec3(uv,1)); // ray direction, pointing in z direction
   float t = 0.; // total distance travelled
   
   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t; // position along the ray
       float d = map(p); // current actual distance to the scene
   
       t+= d; // Marching the ray, the marching sphere will touch closest object in the next iteration
  }
  
  // Coloring 
  
  finalColor = vec3(t * .2); // color based on t distance
  // output color is in [0,1], but t is in [-3,??] so we can multiply it with arbitrary value to see some image
  
  
  
  return finalColor;
}

`;

const step2 = `
// Instead of calc the color based on distance travelled,
// we'll display total num of interations that happened,
// at the end we switch it back
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map(p);
   
       t+= d;
       
       finalColor = vec3(i) / 80.; // we divide it to map it to [0,1]
       
       if(d < .001 || t > 100.) break; // early stop if close to the object, or too early stop if too far
  }
  
  // Coloring 
  //finalColor = vec3(t * .2);
  
  return finalColor;
}
`;

const step3 = `

// You can multiply uv before normalization to change FOV
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv * 0.5 ,1));
   float t = 0.;
   
   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  finalColor = vec3(t * .2);
  
  return finalColor;
}

`;

const step4 = `

vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  finalColor = vec3(t * .2);
  
  return finalColor;
}
`;

const step5 = `
// introducing mouse scene movement
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   ro.yz *= rot2D(-m.y);
   rd.yz *=  rot2D(-m.y);
   
   ro.xz *= rot2D(-m.x);
   rd.xz *=  rot2D(-m.x);
   

   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  finalColor = vec3(t * .2);
  
  return finalColor;
}
`;

const step6 = `
// Using new map2

vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   ro.yz *= rot2D(-m.y);
   rd.yz *=  rot2D(-m.y);
   
   ro.xz *= rot2D(-m.x);
   rd.xz *=  rot2D(-m.x);
   

   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map2(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  finalColor = vec3(t * .05);
  
  return finalColor;
}
`;

const step7 = `
// Using new coloring palette
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   ro.yz *= rot2D(-m.y);
   rd.yz *=  rot2D(-m.y);
   
   ro.xz *= rot2D(-m.x);
   rd.xz *=  rot2D(-m.x);
   

   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map2(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  finalColor = palette(t * .04);
  
  return finalColor;
}
`;

const step8 = `
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   ro.yz *= rot2D(-m.y);
   rd.yz *=  rot2D(-m.y);
   
   ro.xz *= rot2D(-m.x);
   rd.xz *=  rot2D(-m.x);
   

   vec3 finalColor = vec3(0);
   
   // Ray marching
   for (int i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map3(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  finalColor = palette(t * .04);
  
  return finalColor;
}
    `;

const step9 = `
// Using iteration count, render of objects gets more details, but its not smooth like the depth buffer
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   ro.yz *= rot2D(-m.y);
   rd.yz *=  rot2D(-m.y);
   
   ro.xz *= rot2D(-m.x);
   rd.xz *=  rot2D(-m.x);
   

   vec3 finalColor = vec3(0);
   
   // Ray marching
   int i = 0;
   for (i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       float d = map3(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  //finalColor = palette(t * .04);
  //finalColor = vec3(float(i) /80.);
  finalColor = palette(t* .04 + float(i) * .005); // using both
  
  return finalColor;
}
    `;

const step10 = `
// Adding sin fn to ray
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
   
   ro.yz *= rot2D(-m.y);
   rd.yz *=  rot2D(-m.y);
   
   ro.xz *= rot2D(-m.x);
   rd.xz *=  rot2D(-m.x);
   

   vec3 finalColor = vec3(0);
   
   // Ray marching
   int i = 0;
   for (i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       
       p.y += sin(t)*.35;
       
       float d = map3(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  //finalColor = palette(t * .04);
  //finalColor = vec3(float(i) /80.);
  finalColor = palette(t* .04 + float(i) * .005); // using both
  
  return finalColor;
}
    `;

const step11 = `
// Using movement to change the frequency instead rotation
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
  
   vec3 finalColor = vec3(0);
   
   // Ray marching
   int i = 0;
   for (i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       
       p.y += sin(t*(m.y+1.)*.5)*.35;
       
       float d = map3(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  //finalColor = palette(t * .04);
  //finalColor = vec3(float(i) /80.);
  finalColor = palette(t* .04 + float(i) * .005); // using both
  
  return finalColor;
}
`;

const step12 = `
// Adding rotation to the ray
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
  
   vec3 finalColor = vec3(0);
   
   // Ray marching
   int i = 0;
   for (i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       
       p.xy *= rot2D(t* .2 *m.x);
       p.y += sin(t*(m.y+1.)*.5)*.35;
       
       float d = map3(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  //finalColor = palette(t * .04);
  //finalColor = vec3(float(i) /80.);
  finalColor = palette(t* .04 + float(i) * .005); // using both
  
  return finalColor;
}

`;

const step13 = `
// Adding custom mouse anim when not pressed
vec3 generate(vec2 uv, vec2 m) {
   vec3 ro = vec3(0,0,-3); 
   vec3 rd = normalize(vec3(uv,1));
   float t = 0.;
  
   vec3 finalColor = vec3(0);
   
   if ( uMouse.z < 0. ) m = vec2(cos(uTime*.2), sin(uTime * .2));
   
   // Ray marching
   int i = 0;
   for (i = 0; i <80; i++){
   
       vec3 p = ro +rd * t;
       
       p.xy *= rot2D(t* .2 *m.x);
       p.y += sin(t*(m.y+1.)*.5)*.35;
       
       float d = map3(p);
   
       t+= d;
              
       if(d < .001 || t > 100.) break;
  }
  
  // Coloring 
  //finalColor = palette(t * .04);
  //finalColor = vec3(float(i) /80.);
  finalColor = palette(t* .04 + float(i) * .005); // using both
  
  return finalColor;
}
`;

const raymarchingFragmentShader = `
${palleteAndVars}
${step13}
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
    }[step] || step13
  );
};

export const getRaymarchingShader = (step: number) => {
  const stepCode = getStepCode(step);

  return `${palleteAndVars}${stepCode}${mainFunction}`;
};

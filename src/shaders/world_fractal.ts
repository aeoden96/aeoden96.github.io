// Interactive, step-by-step rebuild of the shader that powers the site's
// homepage background (see src/shaders/world_bg.ts). That one is fed by raw
// WebGL with custom uniforms (uShift / uSteps / uBright); here we adapt it to
// the FragmentViewerThreeJS rig, which only provides uTime / uMouse /
// uResolution. The camera tumble is driven by uTime, and dragging the mouse
// gently reorients the fractal in place of the route-change uShift.

const header = `
precision highp float;

uniform float uTime;
uniform vec3 uMouse;
uniform vec2 uResolution;

// Palette — warm amber → ember, pulled from the site accent (--site-accent).
const vec3 COL_HOT   = vec3(1.000, 0.820, 0.420);  // bright gold core
const vec3 COL_AMBER = vec3(0.961, 0.620, 0.043);  // #f59e0b accent
const vec3 COL_EMBER = vec3(0.620, 0.180, 0.030);  // deep rust ember
const vec3 NAVY      = vec3(0.039, 0.051, 0.078);  // #0a0d14 page background

// Slow tumble of the whole field.
const float CAM_ROT_X = 0.06;
const float CAM_ROT_Y = 0.04;

// Fractal shaping (baked from the homepage lil-gui defaults).
const float WARP_FREQ   = 56.3;
const float WARP_AMP    = 0.29;
const vec3  FOLD        = vec3(0.5, 0.4, 0.4);
const vec3  ROT3        = vec3(0.2, 1.6, -2.9);
const float SCALE_MULT  = 2.65;
const float SCALE_ACCUM = 7.48;
const vec3  RAYS        = vec3(0.30, 0.25, 0.55);

// Orbit-trap data, written by map(), read for colouring.
vec3 orbitTrap;

// High-quality, artifact-free spatial hash.
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

// Polynomial smooth-minimum (iq): a soft union whose crease is rounded by a
// quadratic fillet of width ~k (max depth k/4 at the midpoint).
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// Drag offset: 0 at rest, grows as the pointer moves across the canvas. Used
// to gently reorient the fractal, mirroring the homepage's per-navigation shift.
vec2 mouseShift() {
    return (uMouse.xy - 0.5 * uResolution.xy) / uResolution.y;
}
`;

// ── Distance functions ──────────────────────────────────────────────────────

// Step 1 — just a glowing nucleus.
const mapCore = `
float map(vec3 p) {
    orbitTrap = abs(p);
    return length(p) - 0.5;
}
`;

// Step 2 — three intersecting cylinders acting as crossing rays (no fold yet).
const mapRays = `
float map(vec3 p) {
    p.xz *= rot(uTime * CAM_ROT_X);
    p.xy *= rot(uTime * CAM_ROT_Y);

    orbitTrap = abs(p);

    float raysX = length(p.yz) - RAYS.x;
    float raysY = length(p.xz) - RAYS.y;
    float raysZ = length(p.xy) - RAYS.z;

    return min(raysX, min(raysY, raysZ));
}
`;

// Step 4 (write-up) — the same three rays, but smooth-merged. Rounding the
// hard union removes the gradient creases so the glow flows across junctions.
const mapRaysSmooth = `
float map(vec3 p) {
    p.xz *= rot(uTime * CAM_ROT_X);
    p.xy *= rot(uTime * CAM_ROT_Y);

    orbitTrap = abs(p);

    float raysX = length(p.yz) - RAYS.x;
    float raysY = length(p.xz) - RAYS.y;
    float raysZ = length(p.xy) - RAYS.z;

    float k = 0.3;
    return smin(smin(raysX, raysY, k), raysZ, k);
}
`;

// Step 5 (write-up) — domain-warp the sample point before measuring, no fold
// yet. The high-frequency sin frays the clean cross into rippling filaments and
// (deliberately) breaks the true-distance property of the field.
const mapWarpedRays = `
float map(vec3 p) {
    p.xz *= rot(uTime * CAM_ROT_X);
    p.xy *= rot(uTime * CAM_ROT_Y);

    vec3 q = p;
    q += sin(q.zxy * WARP_FREQ) * WARP_AMP;   // domain warp, no fold

    orbitTrap = abs(q);

    float raysX = length(q.yz) - RAYS.x;
    float raysY = length(q.xz) - RAYS.y;
    float raysZ = length(q.xy) - RAYS.z;

    float k = 0.3;
    return smin(smin(raysX, raysY, k), raysZ, k);
}
`;

// Steps 3–6 — the full homepage distance field: asymmetric KIFS fold + domain
// warp, smooth-merged into the rays and blended with the central core. The
// mouse shift adds a small, optional reorientation on top of the time tumble.
const mapFractal = `
float map(vec3 p) {
    vec2 mo = mouseShift();
    p.xz *= rot(uTime * CAM_ROT_X + mo.x * 0.35);
    p.xy *= rot(uTime * CAM_ROT_Y + mo.y * 0.35);

    vec3 q = p;
    float scale = 0.26;
    orbitTrap = vec3(1000.0);

    q += sin(q.zxy * WARP_FREQ) * WARP_AMP;   // domain warp
    q = abs(q) - FOLD;                          // asymmetric fold

    q.xy *= rot(ROT3.x);
    q.xz *= rot(ROT3.y);
    q.yz *= rot(ROT3.z);

    q *= SCALE_MULT;
    scale *= SCALE_ACCUM;

    orbitTrap = min(orbitTrap, abs(q));

    // Three cylinders acting as intersecting rays.
    float raysX = length(q.yz) - RAYS.x;
    float raysY = length(q.xz) - RAYS.y;
    float raysZ = length(q.xy) - RAYS.z;

    float k = 0.1;

    float h1 = clamp(6.7 + 0.1 * (raysX - raysY) / k, 0.1, 0.4);
    float mergedRays = mix(raysX, raysY, h1) - k * h1 * (1.0 - h1);

    float h2 = clamp(0.1 + 0.1 * (mergedRays - raysZ) / k, 0.0, 0.8);
    mergedRays = mix(mergedRays, raysZ, h2) - k * h2 * (-7.3 - h2);

    float core = length(p) - 0.44;        // central glowing nucleus
    mergedRays /= scale;

    float h3 = clamp(0.5 + 0.5 * (core - mergedRays) / 0.3, 0.0, 1.0);
    float d = mix(core, mergedRays, h3) - 0.3 * h3 * (1.0 - h3);

    return d * 0.3;
}
`;

// ── Main / accumulation passes ──────────────────────────────────────────────

// Steps 1–3 — flat amber volumetric accumulation, no tonemap. The 0.4 scale
// keeps the raw glow from blowing straight to white before we add ACES.
const mainFlat = `
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, -4.5);
    vec3 rd = normalize(vec3(uv, 1.0));
    float t = 0.0;

    vec3 glow = vec3(0.0);

    const int STEPS = 90;
    for (int i = 0; i < STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);

        // Accumulate light inversely to distance — close to a surface, glow more.
        glow += COL_AMBER * (0.0035 / (abs(d) + 0.005));

        t += abs(d) * 0.45 + 0.015;
        if (t > 10.0) break;
        if (max(glow.r, max(glow.g, glow.b)) > 4.0) break;
    }

    vec3 color = NAVY + glow * 0.4;
    gl_FragColor = vec4(color, 1.0);
}
`;

// Step 4 — colour each step by its orbit trap: gold core → amber → deep ember.
const mainColor = `
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, -4.5);
    vec3 rd = normalize(vec3(uv, 1.0));
    float t = 0.0;

    vec3 glow = vec3(0.0);

    const int STEPS = 90;
    for (int i = 0; i < STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);

        vec3 stepColor = mix(COL_HOT, COL_AMBER, smoothstep(0.0, 1.0, orbitTrap.x));
        stepColor = mix(stepColor, COL_EMBER, smoothstep(0.0, 1.0, orbitTrap.y));

        glow += stepColor * (0.0035 / (abs(d) + 0.005));

        t += abs(d) * 0.45 + 0.015;
        if (t > 10.0) break;
        if (max(glow.r, max(glow.g, glow.b)) > 4.0) break;
    }

    vec3 color = NAVY + glow * 0.4;
    gl_FragColor = vec4(color, 1.0);
}
`;

// Step 5 — vignette so the structure sits in a pool of dark, then an ACES
// tonemap to roll the bright core gracefully into white.
const mainToned = `
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, -4.5);
    vec3 rd = normalize(vec3(uv, 1.0));
    float t = 0.0;

    vec3 glow = vec3(0.0);

    const int STEPS = 90;
    for (int i = 0; i < STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);

        vec3 stepColor = mix(COL_HOT, COL_AMBER, smoothstep(0.0, 1.0, orbitTrap.x));
        stepColor = mix(stepColor, COL_EMBER, smoothstep(0.0, 1.0, orbitTrap.y));

        glow += stepColor * (0.0035 / (abs(d) + 0.005));

        t += abs(d) * 0.45 + 0.015;
        if (t > 10.0) break;
        if (max(glow.r, max(glow.g, glow.b)) > 4.0) break;
    }

    float vignette = 1.0 - dot(uv, uv) * 0.55;
    glow *= vignette * 0.9;

    // ACES tonemap.
    glow = (glow * (2.38 * glow - 0.04)) / (glow * (2.35 * glow + 1.52) + 0.14);

    vec3 color = NAVY + glow;
    gl_FragColor = vec4(color, 1.0);
}
`;

// Step 6 — the homepage look: dither the ray start to kill banding in the
// volume, then add film grain (the texture of the "window" onto this world)
// and an 8-bit dither over the final composite.
const mainFinal = `
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    vec3 ro = vec3(0.0, 0.0, -4.5);
    vec3 rd = normalize(vec3(uv, 1.0));

    // Dither the ray start to break up banding in the volume.
    float t = hash(gl_FragCoord.xy + mod(uTime, 100.0) * 10.0) * 0.05;

    vec3 glow = vec3(0.0);

    const int STEPS = 90;
    for (int i = 0; i < STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);

        vec3 stepColor = mix(COL_HOT, COL_AMBER, smoothstep(0.0, 1.0, orbitTrap.x));
        stepColor = mix(stepColor, COL_EMBER, smoothstep(0.0, 1.0, orbitTrap.y));

        glow += stepColor * (0.0035 / (abs(d) + 0.005));

        t += abs(d) * 0.45 + 0.015;
        if (t > 10.0) break;
        if (max(glow.r, max(glow.g, glow.b)) > 4.0) break;
    }

    float vignette = 1.0 - dot(uv, uv) * 0.55;
    glow *= vignette * 0.9;

    // ACES tonemap.
    glow = (glow * (2.38 * glow - 0.04)) / (glow * (2.35 * glow + 1.52) + 0.14);

    vec3 color = NAVY + glow;

    // Film grain — the texture of the "window" onto this world.
    float grain = hash(gl_FragCoord.xy + mod(uTime, 1000.0) * 15.0);
    color += (grain - 0.5) * 0.045;

    // Break up 8-bit banding.
    color += (hash(gl_FragCoord.xy + 123.456) * 2.0 - 1.0) / 255.0;

    gl_FragColor = vec4(color, 1.0);
}
`;

const build = (mapSrc: string, mainSrc: string) =>
  `${header}${mapSrc}${mainSrc}`;

export const getWorldFractalShader = (step: number) => {
  return (
    {
      1: build(mapCore, mainFlat),
      2: build(mapRays, mainFlat),
      7: build(mapRaysSmooth, mainFlat),
      8: build(mapWarpedRays, mainFlat),
      3: build(mapFractal, mainFlat),
      4: build(mapFractal, mainColor),
      5: build(mapFractal, mainToned),
      6: build(mapFractal, mainFinal),
    }[step] || build(mapFractal, mainFinal)
  );
};

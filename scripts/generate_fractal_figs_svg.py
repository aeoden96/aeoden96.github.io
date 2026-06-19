import math
from pathlib import Path

out_dir = Path('src/content/experiments/figures')
out_dir.mkdir(parents=True, exist_ok=True)

def write_svg(path, width, height, content):
    svg = f'<?xml version="1.0" encoding="utf-8"?>\n'
    svg += f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">\n'
    svg += content
    svg += '\n</svg>\n'
    path.write_text(svg)

# Figure 1: emission vs distance
W, H = 600, 320
pad = 40
xs = [i/500.0 for i in range(501)]
epsilons = [0.001, 0.005, 0.02]
colors = ['#d33','orange','#2a7']

# compute curves
curves = []
maxy = 0
for eps in epsilons:
    ys = [1.0 / (x + eps) for x in xs]
    maxy = max(maxy, max(ys))
    curves.append(ys)

# scale to SVG
def to_x(x):
    return pad + (W-2*pad) * (x - 0.0) / 1.0

def to_y(y):
    # invert y
    return H - pad - (H-2*pad) * (y / maxy)

content = []
# background and axes
content.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#fff"/>')
# axes lines
content.append(f'<line x1="{pad}" y1="{H-pad}" x2="{W-pad}" y2="{H-pad}" stroke="#333" stroke-width="1"/>')
content.append(f'<line x1="{pad}" y1="{pad}" x2="{pad}" y2="{H-pad}" stroke="#333" stroke-width="1"/>')

# draw curves
for idx, ys in enumerate(curves):
    points = ' '.join(f'{to_x(xs[i])},{to_y(ys[i])}' for i in range(len(xs)))
    content.append(f'<polyline fill="none" stroke="{colors[idx]}" stroke-width="2" points="{points}" />')
    # legend
    content.append(f'<rect x="{W-150}" y="{20+idx*20}" width="12" height="12" fill="{colors[idx]}"/>')
    content.append(f'<text x="{W-130}" y="{20+idx*20+10}" font-size="12" fill="#000">eps={epsilons[idx]}</text>')

# labels
content.append(f'<text x="{W/2}" y="{H-8}" font-size="12" text-anchor="middle">distance |d|</text>')
content.append(f'<text transform="translate(12,{H/2}) rotate(-90)" font-size="12" text-anchor="middle">emission e(|d|)</text>')

write_svg(out_dir / 'emission_vs_distance.svg', W, H, '\n'.join(content))

# Figure 2: sampling positions and contributions (SVG)
W, H = 700, 300
pad = 50
# simulate
eps = 0.005
step_scale = 0.0035
TMAX = 2.0

# full-step
t = 0.0
full_ts = []
full_vals = []
while t < TMAX and len(full_ts) < 1000:
    dval = abs(t)
    full_ts.append(t)
    full_vals.append(step_scale / (dval + eps))
    step = max(dval, 1e-4)
    t += step

# under-step
t = 0.0
under_ts = []
under_vals = []
while t < TMAX and len(under_ts) < 1000:
    dval = abs(t)
    under_ts.append(t)
    under_vals.append(step_scale / (dval + eps))
    step = 0.45 * dval + 0.015
    step = max(step, 1e-4)
    t += step

# crop to t in [0,0.6]
def clip_lists(ts, vals, tmax=0.6):
    xs = []
    ys = []
    for a,b in zip(ts, vals):
        if a <= tmax:
            xs.append(a)
            ys.append(b)
    return xs, ys

full_xs, full_ys = clip_lists(full_ts, full_vals)
under_xs, under_ys = clip_lists(under_ts, under_vals)
maxy2 = max(max(full_ys) if full_ys else 0, max(under_ys) if under_ys else 0)

def to_x2(x):
    return pad + (W-2*pad) * (x / 0.6)

def to_y2(y):
    return H - pad - (H-2*pad) * (y / maxy2)

content = []
content.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#fff"/>')
# axes
content.append(f'<line x1="{pad}" y1="{H-pad}" x2="{W-pad}" y2="{H-pad}" stroke="#333" stroke-width="1"/>')
content.append(f'<line x1="{pad}" y1="{pad}" x2="{pad}" y2="{H-pad}" stroke="#333" stroke-width="1"/>')
# full-step points/line
if full_xs:
    pts = ' '.join(f'{to_x2(full_xs[i])},{to_y2(full_ys[i])}' for i in range(len(full_xs)))
    content.append(f'<polyline fill="none" stroke="#1f77b4" stroke-width="1.5" points="{pts}" />')
    for x,y in zip(full_xs, full_ys):
        content.append(f'<circle cx="{to_x2(x)}" cy="{to_y2(y)}" r="3" fill="#1f77b4" />')
# under-step
if under_xs:
    pts = ' '.join(f'{to_x2(under_xs[i])},{to_y2(under_ys[i])}' for i in range(len(under_xs)))
    content.append(f'<polyline fill="none" stroke="#ff7f0e" stroke-width="1.5" points="{pts}" />')
    for x,y in zip(under_xs, under_ys):
        content.append(f'<circle cx="{to_x2(x)}" cy="{to_y2(y)}" r="3" fill="#ff7f0e" />')

content.append(f'<text x="{W/2}" y="{H-8}" font-size="12" text-anchor="middle">ray distance t (0→0.6)</text>')
content.append(f'<text transform="translate(12,{H/2}) rotate(-90)" font-size="12" text-anchor="middle">sample contribution (scaled)</text>')
# legend
content.append(f'<rect x="{W-180}" y="20" width="12" height="12" fill="#1f77b4"/>')
content.append(f'<text x="{W-165}" y="30" font-size="12">full-step (t+=|d|)</text>')
content.append(f'<rect x="{W-180}" y="40" width="12" height="12" fill="#ff7f0e"/>')
content.append(f'<text x="{W-165}" y="50" font-size="12">under-step (0.45|d|+0.015)</text>')

write_svg(out_dir / 'step_sampling.svg', W, H, '\n'.join(content))

print('Wrote SVG figures to', out_dir)

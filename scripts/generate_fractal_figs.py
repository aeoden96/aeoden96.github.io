import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

out_dir = Path('src/content/experiments/figures')
out_dir.mkdir(parents=True, exist_ok=True)

# Figure 1: emission vs distance for several epsilons
d = np.linspace(0.0, 1.0, 1000)
epsilons = [0.001, 0.005, 0.02]
plt.figure(figsize=(6,4))
for eps in epsilons:
    e = 1.0 / (d + eps)
    plt.plot(d, e, label=f'eps={eps}')
plt.xlabel('distance |d|')
plt.ylabel('emission e(|d|)')
plt.title('Emission vs distance: e(d)=1/(|d|+eps)')
plt.legend()
plt.grid(alpha=0.2)
plt.tight_layout()
plt.savefig(out_dir / 'emission_vs_distance.png', dpi=150)
plt.close()

# Figure 2: sampling positions and sampled contributions
# Model: a surface at t=0; d(t)=|t|; emission e(t)=1/(|t|+eps)
eps = 0.005
step_scale = 0.0035
TMAX = 2.0

# Full-step (sphere-tracing style): t += d
t = 0.0
full_ts = []
full_vals = []
while t < TMAX and len(full_ts) < 1000:
    dval = abs(t)
    full_ts.append(t)
    full_vals.append(step_scale / (dval + eps))
    step = max(dval, 1e-4)
    t += step

# Under-step: t += 0.45*|d| + 0.015
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

# Plot sampling positions and sampled contributions
plt.figure(figsize=(7,4))
plt.plot(full_ts, full_vals, 'o-', markersize=4, label='full-step (t+=|d|)')
plt.plot(under_ts, under_vals, 'o-', markersize=4, label='under-step (0.45|d|+0.015)')
plt.axvline(0, color='k', linestyle='--', alpha=0.4)
plt.xlim(0, 0.6)
plt.ylim(0, max(max(full_vals), max(under_vals)) * 1.1)
plt.xlabel('ray distance t (from start toward surface at t=0)')
plt.ylabel('sample contribution (scaled)')
plt.title('Sampling positions and contributions: full-step vs under-step')
plt.legend()
plt.grid(alpha=0.2)
plt.tight_layout()
plt.savefig(out_dir / 'step_sampling.png', dpi=150)
plt.close()

print('Wrote figures to', out_dir)

import React, { useEffect, useRef, useState } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import '../../styles/fractal-plot.css';

type Props = {
  mode?: 'emission' | 'sampling'
  width?: number
  height?: number
}

export default function FractalPlot({ mode = 'emission', width = 640, height = 320 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const plotRef = useRef<any>(null);
  const [activeMode, setActiveMode] = useState(mode);

  useEffect(() => {
    if (!ref.current) return;
    // Build data sets depending on mode
    if (plotRef.current) {
      plotRef.current.destroy();
      plotRef.current = null;
    }

    if (activeMode === 'emission') {
      const xs = Array.from({ length: 501 }, (_, i) => i / 500);
      const eps = [0.001, 0.005, 0.02];
      const ys = eps.map((e) => xs.map((x) => 1 / (x + e)));
      // uPlot expects TypedArray instances for performance; convert to Float64Array
      const data = [new Float64Array(xs), ...ys.map(a => new Float64Array(a))];
      const opts: any = {
        title: 'Emission vs distance: e(d)=1/(|d|+eps)',
        width,
        height,
        font: '12px Inter, system-ui, -apple-system, "Segoe UI", Roboto',
        scales: { x: { auto: false }, y: { auto: true } },
        axes: [ { stroke: '#94a3b8', grid: { show: true, stroke: '#0f1724' } }, { stroke: '#94a3b8' } ],
        series: [
          {},
          { label: `eps=${eps[0]}`, stroke: '#ffd166' },
          { label: `eps=${eps[1]}`, stroke: '#ff9f43' },
          { label: `eps=${eps[2]}`, stroke: '#ff6b6b' },
        ],
        cursor: { points: { show: true } },
      };
      plotRef.current = new uPlot(opts, data, ref.current);
    } else {
      // sampling mode
      const eps = 0.005;
      const step_scale = 0.0035;
      const full_ts: number[] = [];
      const full_vals: number[] = [];
      let t = 0;
      while (t < 2.0 && full_ts.length < 1000) {
        const dval = Math.abs(t);
        full_ts.push(t);
        full_vals.push(step_scale / (dval + eps));
        const step = Math.max(dval, 1e-4);
        t += step;
      }
      t = 0;
      const under_ts: number[] = [];
      const under_vals: number[] = [];
      while (t < 2.0 && under_ts.length < 1000) {
        const dval = Math.abs(t);
        under_ts.push(t);
        under_vals.push(step_scale / (dval + eps));
        let step = 0.45 * dval + 0.015;
        step = Math.max(step, 1e-4);
        t += step;
      }

      // crop to 0..0.6
      const tmax = 0.6;
      const crop = (xs: number[], ys: number[]) => {
        const a: number[] = [];
        const b: number[] = [];
        for (let i = 0; i < xs.length; i++) {
          if (xs[i] <= tmax) {
            a.push(xs[i]);
            b.push(ys[i]);
          }
        }
        return [a, b] as const;
      };

      const [fx, fy] = crop(full_ts, full_vals);
      const [ux, uy] = crop(under_ts, under_vals);
      // unify x-axis sample grid by taking union of x positions
      const xs = Array.from(new Set([...fx, ...ux])).sort((a,b)=>a-b);
      const interp = (xs_src: number[], ys_src: number[], x: number) => {
        // nearest neighbor
        let idx = 0;
        while (idx+1 < xs_src.length && xs_src[idx+1] <= x) idx++;
        return ys_src[idx] ?? ys_src[ys_src.length-1] ?? 0;
      };
      const fy_interp = xs.map(x => interp(fx, fy, x));
      const uy_interp = xs.map(x => interp(ux, uy, x));

      const data = [new Float64Array(xs), new Float64Array(fy_interp), new Float64Array(uy_interp)];
      const opts: any = {
        title: 'Sampling contributions: full-step vs under-step',
        width,
        height,
        font: '12px Inter, system-ui, -apple-system, "Segoe UI", Roboto',
        scales: { x: { auto: false }, y: { auto: true } },
        axes: [ { stroke: '#94a3b8', grid: { show: true, stroke: '#0f1724' } }, { stroke: '#94a3b8' } ],
        series: [ {}, { label: 'full-step', stroke: '#7dd3fc' }, { label: 'under-step', stroke: '#f97316' } ],
        cursor: { points: { show: true } },
      };
      plotRef.current = new uPlot(opts, data, ref.current);
    }

    // polish the root background to match dark theme
    if (plotRef.current && plotRef.current.root) {
      try { plotRef.current.root.style.background = 'transparent'; } catch {}
    }

    return () => {
      if (plotRef.current) {
        plotRef.current.destroy();
        plotRef.current = null;
      }
    };
  }, [mode, width, height]);

  return (
    <div className="fractal-plot-container">
      <div className="fractal-plot-header">
        <div style={{flex:'0 0 auto'}}>{activeMode === 'emission' ? 'Emission: e(d)=1/(|d|+ε)' : 'Sampling: contributions along ray'}</div>
        <div className="fractal-plot-controls">
          <button className={activeMode==='emission'?'active':''} onClick={()=>setActiveMode('emission')}>Emission</button>
          <button className={activeMode==='sampling'?'active':''} onClick={()=>setActiveMode('sampling')}>Sampling</button>
        </div>
      </div>
      <div className="fractal-plot-root">
        <div ref={ref} />
      </div>
    </div>
  );
}

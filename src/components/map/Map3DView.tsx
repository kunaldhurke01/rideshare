import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GeoPoint, LocationItem, StopPoint } from '../../types';
import { getRouteBounds } from '../../services/mapService';
import { Maximize2, Minimize2, Compass, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Map3DViewProps {
  primaryRoute?: GeoPoint[];
  secondaryRoute?: GeoPoint[];
  sharedRoute?: GeoPoint[];
  vehicleLocation?: GeoPoint;
  vehicleHeading?: number;
  pickupLocation?: LocationItem;
  dropoffLocation?: LocationItem;
  secondaryPickup?: LocationItem;
  secondaryDropoff?: LocationItem;
  stops?: StopPoint[];
  interactive?: boolean;
  className?: string;
  showBuildingExtrusions?: boolean;
  cameraTilt?: number; // 0 to 60 deg
  isSearchingAnimation?: boolean;
}

export const Map3DView: React.FC<Map3DViewProps> = ({
  primaryRoute = [],
  secondaryRoute = [],
  sharedRoute = [],
  vehicleLocation,
  vehicleHeading = 0,
  pickupLocation,
  dropoffLocation,
  secondaryPickup,
  secondaryDropoff,
  stops = [],
  interactive = true,
  className = '',
  showBuildingExtrusions = true,
  cameraTilt = 38,
  isSearchingAnimation = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera interactive state
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(cameraTilt);
  const [rotation, setRotation] = useState(-15);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Calculate bounding box and coordinate normalizer
  const allPoints = useMemo(() => {
    const list: GeoPoint[] = [...primaryRoute, ...secondaryRoute, ...sharedRoute];
    if (pickupLocation) list.push(pickupLocation.coordinates);
    if (dropoffLocation) list.push(dropoffLocation.coordinates);
    if (secondaryPickup) list.push(secondaryPickup.coordinates);
    if (secondaryDropoff) list.push(secondaryDropoff.coordinates);
    if (vehicleLocation) list.push(vehicleLocation);
    return list;
  }, [primaryRoute, secondaryRoute, sharedRoute, pickupLocation, dropoffLocation, secondaryPickup, secondaryDropoff, vehicleLocation]);

  const bounds = useMemo(() => getRouteBounds(allPoints), [allPoints]);

  // Coordinate projector: GeoPoint to 2D canvas coordinates
  const projectPoint = (p: GeoPoint, width: number, height: number): { x: number; y: number } => {
    const latSpan = Math.max(0.04, bounds.maxLat - bounds.minLat);
    const lngSpan = Math.max(0.06, bounds.maxLng - bounds.minLng);

    // Padding around bounds
    const pad = 80;
    const drawWidth = width - pad * 2;
    const drawHeight = height - pad * 2;

    const normX = (p.lng - bounds.minLng) / lngSpan;
    const normY = 1 - (p.lat - bounds.minLat) / latSpan;

    const x = pad + normX * drawWidth;
    const y = pad + normY * drawHeight;

    return { x, y };
  };

  // Main 3D render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;

      // Handle Retina / HiDPI crispness
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Background deep gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.8);
      bgGrad.addColorStop(0, '#0d183d');
      bgGrad.addColorStop(0.5, '#09102b');
      bgGrad.addColorStop(1, '#050a1c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Apply 3D Camera Matrix (Tilt, Rotation, Pan, Zoom)
      ctx.save();
      ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
      ctx.scale(zoom, zoom * Math.cos((tilt * Math.PI) / 180)); // 3D isometric foreshortening
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      // 2. Draw 3D Futuristic City Grid with soft glow
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)';
      const gridSize = 45;
      for (let x = -width; x < width * 2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -height);
        ctx.lineTo(x, height * 2);
        ctx.stroke();
      }
      for (let y = -height; y < height * 2; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-width, y);
        ctx.lineTo(width * 2, y);
        ctx.stroke();
      }

      // 3. Draw 3D Procedural Buildings / Cityscape blocks
      if (showBuildingExtrusions) {
        const seedBuildings = [
          { x: width * 0.2, y: height * 0.3, w: 40, h: 50, height3d: 28 },
          { x: width * 0.28, y: height * 0.25, w: 35, h: 35, height3d: 42 },
          { x: width * 0.35, y: height * 0.65, w: 50, h: 40, height3d: 32 },
          { x: width * 0.72, y: height * 0.28, w: 45, h: 55, height3d: 38 },
          { x: width * 0.8, y: height * 0.6, w: 40, h: 40, height3d: 22 },
          { x: width * 0.62, y: height * 0.72, w: 55, h: 35, height3d: 45 },
          { x: width * 0.15, y: height * 0.7, w: 38, h: 45, height3d: 25 },
        ];

        seedBuildings.forEach((b) => {
          // Building base shadow
          ctx.fillStyle = 'rgba(5, 12, 35, 0.6)';
          ctx.fillRect(b.x + 4, b.y + 4, b.w, b.h);

          // Building 3D walls (extrusion upward)
          const extrudeY = b.height3d * 0.65;
          ctx.fillStyle = 'rgba(20, 35, 80, 0.45)';
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + b.w, b.y);
          ctx.lineTo(b.x + b.w, b.y - extrudeY);
          ctx.lineTo(b.x, b.y - extrudeY);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = 'rgba(30, 50, 110, 0.55)';
          ctx.beginPath();
          ctx.moveTo(b.x + b.w, b.y);
          ctx.lineTo(b.x + b.w, b.y + b.h);
          ctx.lineTo(b.x + b.w, b.y + b.h - extrudeY);
          ctx.lineTo(b.x + b.w, b.y - extrudeY);
          ctx.closePath();
          ctx.fill();

          // Building rooftop with neon edge
          ctx.fillStyle = 'rgba(35, 60, 130, 0.7)';
          ctx.fillRect(b.x, b.y - extrudeY, b.w, b.h);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(b.x, b.y - extrudeY, b.w, b.h);
        });
      }

      // Helper function to draw glowing polyline route
      const drawRouteLine = (
        points: GeoPoint[],
        color: string,
        glowColor: string,
        lineWidth = 6,
        isDashed = false
      ) => {
        if (points.length < 2) return;

        // Glow Layer
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 18;
        ctx.lineWidth = lineWidth + 4;
        ctx.strokeStyle = glowColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const first = projectPoint(points[0], width, height);
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < points.length; i++) {
          const pt = projectPoint(points[i], width, height);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();

        // Core Solid Line
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (isDashed) {
          ctx.setLineDash([10, 8]);
          ctx.lineDashOffset = -time * 25;
        }
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < points.length; i++) {
          const pt = projectPoint(points[i], width, height);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();
      };

      // 4. Draw Secondary (Candidate) Route if present (Violet / Purple)
      if (secondaryRoute.length > 1) {
        drawRouteLine(secondaryRoute, '#a855f7', 'rgba(168, 85, 247, 0.65)', 5, true);
      }

      // 5. Draw Primary Route (Electric Blue / Cyan)
      if (primaryRoute.length > 1) {
        drawRouteLine(primaryRoute, '#06b6d4', 'rgba(6, 182, 212, 0.7)', 6);
      }

      // 6. Draw Shared Combined Segment if present (Emerald Green Glow)
      if (sharedRoute.length > 1) {
        drawRouteLine(sharedRoute, '#10b981', 'rgba(16, 185, 129, 0.85)', 8);
      }

      // 7. Draw Searching Radar Rings if searching mode active
      if (isSearchingAnimation && primaryRoute.length > 0) {
        const centerPt = projectPoint(primaryRoute[0], width, height);
        for (let r = 1; r <= 3; r++) {
          const pulseR = ((time * 30 + r * 35) % 120) + 15;
          const alpha = Math.max(0, 1 - pulseR / 135);
          ctx.save();
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.7})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.arc(centerPt.x, centerPt.y, pulseR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Helper to render 3D Floating Location Pin with ripple ring
      const draw3DPin = (
        point: GeoPoint,
        label: string,
        color: string,
        glow: string,
        type: 'pickup' | 'dropoff' | 'stop' = 'pickup'
      ) => {
        const pt = projectPoint(point, width, height);
        const floatY = Math.sin(time * 3 + pt.x) * 4;

        // Ground shadow & ripple
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y + 4, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing base ring
        const ringScale = ((time * 15) % 30) / 30;
        ctx.strokeStyle = glow;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y, 8 + ringScale * 14, 4 + ringScale * 7, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3D Pin Head (Floating)
        const pinHeadY = pt.y - 24 + floatY;
        ctx.save();
        ctx.shadowColor = glow;
        ctx.shadowBlur = 14;

        // Pin stem
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, pinHeadY + 8);
        ctx.stroke();

        // Pin Head Hexagon/Circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pt.x, pinHeadY, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pinHeadY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Label pill floating above
        ctx.save();
        ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
        const txtWidth = ctx.measureText(label).width;
        const pillW = txtWidth + 16;
        const pillH = 20;
        const pillX = pt.x - pillW / 2;
        const pillY = pinHeadY - 26;

        ctx.fillStyle = 'rgba(11, 19, 43, 0.85)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, pt.x, pillY + pillH / 2);
        ctx.restore();
      };

      // 8. Render Location Markers
      if (pickupLocation) {
        draw3DPin(pickupLocation.coordinates, 'Pickup: ' + pickupLocation.name.split(' ')[0], '#06b6d4', 'rgba(6, 182, 212, 0.8)', 'pickup');
      }
      if (dropoffLocation) {
        draw3DPin(dropoffLocation.coordinates, 'Dest: ' + dropoffLocation.name.split(' ')[0], '#10b981', 'rgba(16, 185, 129, 0.8)', 'dropoff');
      }
      if (secondaryPickup) {
        draw3DPin(secondaryPickup.coordinates, 'P2: ' + secondaryPickup.name.split(' ')[0], '#c084fc', 'rgba(192, 132, 252, 0.8)', 'pickup');
      }
      if (secondaryDropoff) {
        draw3DPin(secondaryDropoff.coordinates, 'D2: ' + secondaryDropoff.name.split(' ')[0], '#f43f5e', 'rgba(244, 63, 94, 0.8)', 'dropoff');
      }

      // Render extra stops if provided
      stops.forEach((s, idx) => {
        if (s.status === 'completed') return;
        const tag = s.type === 'pickup' ? `+ Pick ${s.passengerName.split(' ')[0]}` : `Drop ${s.passengerName.split(' ')[0]}`;
        const color = s.type === 'pickup' ? '#38bdf8' : '#34d399';
        draw3DPin(s.location.coordinates, tag, color, color);
      });

      // 9. Render 3D Vehicle Marker with Headlights
      if (vehicleLocation) {
        const vPt = projectPoint(vehicleLocation, width, height);
        ctx.save();
        ctx.translate(vPt.x, vPt.y);
        ctx.rotate(((vehicleHeading - 90) * Math.PI) / 180);

        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Headlight beams (cones of glowing light)
        ctx.save();
        const lightGrad = ctx.createRadialGradient(20, 0, 2, 55, 0, 45);
        lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        lightGrad.addColorStop(0.3, 'rgba(34, 211, 238, 0.3)');
        lightGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = lightGrad;
        ctx.beginPath();
        ctx.moveTo(12, -5);
        ctx.lineTo(60, -22);
        ctx.lineTo(60, 22);
        ctx.lineTo(12, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 3D Car Body
        // Base Chassis
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-14, -8, 28, 16, 4);
        ctx.fill();

        // Vehicle Top Shell (Cyber Electric Metallic Blue)
        const carGrad = ctx.createLinearGradient(-12, -6, 12, 6);
        carGrad.addColorStop(0, '#2563eb');
        carGrad.addColorStop(0.5, '#06b6d4');
        carGrad.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = carGrad;
        ctx.beginPath();
        ctx.roundRect(-12, -7, 24, 14, 4);
        ctx.fill();

        // Windshield and Roof
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.roundRect(-5, -5, 11, 10, 2);
        ctx.fill();

        // Roof glowing beacon
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Tail lights
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-13, -6, 2, 3);
        ctx.fillRect(-13, 3, 2, 3);

        // Front headlights
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(11, -6, 2, 3);
        ctx.fillRect(11, 3, 2, 3);

        ctx.restore();
      }

      ctx.restore(); // Restore 3D Camera Matrix

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    primaryRoute,
    secondaryRoute,
    sharedRoute,
    vehicleLocation,
    vehicleHeading,
    pickupLocation,
    dropoffLocation,
    secondaryPickup,
    secondaryDropoff,
    stops,
    zoom,
    pan,
    tilt,
    rotation,
    bounds,
    showBuildingExtrusions,
    isSearchingAnimation
  ]);

  // Mouse / Touch handlers for 3D Camera Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 1) {
      // Pan
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (e.buttons === 2) {
      // Right click rotate / tilt
      setRotation((prev) => prev + dx * 0.4);
      setTilt((prev) => Math.min(65, Math.max(10, prev - dy * 0.3)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetCamera = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setTilt(cameraTilt);
    setRotation(-15);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#070b19] rounded-2xl border border-slate-800/80 shadow-3d ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Floating 3D Map HUD Controls */}
      {interactive && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <div className="glass-panel rounded-xl p-1.5 flex flex-col gap-1 shadow-3d-sm">
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
              className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
              className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() => setTilt((t) => (t >= 50 ? 20 : t + 15))}
              className="p-2 text-slate-300 hover:text-purple-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Toggle 3D Perspective Tilt"
            >
              <Compass size={18} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Reset 3D Camera"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex flex-wrap gap-2">
        <div className="glass-panel rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-2 border border-cyan-500/30 text-cyan-200">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          <span>Primary Route</span>
        </div>
        {secondaryRoute.length > 0 && (
          <div className="glass-panel rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-2 border border-purple-500/30 text-purple-200">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc]"></span>
            <span>Shared Match Route</span>
          </div>
        )}
        {sharedRoute.length > 0 && (
          <div className="glass-panel rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-2 border border-emerald-500/30 text-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]"></span>
            <span>Merged Shared Corridor</span>
          </div>
        )}
      </div>
    </div>
  );
};

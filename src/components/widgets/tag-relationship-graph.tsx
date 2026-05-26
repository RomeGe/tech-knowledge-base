"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Edge {
  source: string;
  target: string;
}

const MOCK_TAGS = [
  "React", "Next.js", "TypeScript", "Tailwind", "Node.js",
  "GraphQL", "Docker", "AWS", "PostgreSQL", "Redis",
];

const MOCK_EDGES: Edge[] = [
  { source: "React", target: "Next.js" },
  { source: "React", target: "TypeScript" },
  { source: "Next.js", target: "TypeScript" },
  { source: "Next.js", target: "Tailwind" },
  { source: "TypeScript", target: "Node.js" },
  { source: "Node.js", target: "GraphQL" },
  { source: "Node.js", target: "PostgreSQL" },
  { source: "Docker", target: "AWS" },
  { source: "Docker", target: "Node.js" },
  { source: "AWS", target: "PostgreSQL" },
  { source: "Redis", target: "Node.js" },
  { source: "GraphQL", target: "React" },
];

export function TagRelationshipGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const animRef = useRef<ReturnType<typeof requestAnimationFrame>>(undefined);

  // Initialize nodes with random positions
  useEffect(() => {
    const initial: Node[] = MOCK_TAGS.map((tag, i) => {
      const angle = (i / MOCK_TAGS.length) * Math.PI * 2;
      return {
        id: tag,
        label: tag,
        x: 200 + 100 * Math.cos(angle),
        y: 150 + 80 * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: 20 + Math.floor(Math.random() * 10),
      };
    });
    setNodes(initial);
  }, []);

  // Force-directed layout simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    let frame = 0;
    const maxFrames = 120;

    const step = () => {
      if (frame >= maxFrames) return;
      frame++;

      setNodes((prev) => {
        const next = prev.map((n) => ({ ...n }));
        const nodeMap = new Map(next.map((n) => [n.id, n]));

        // Repulsion between all nodes
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 500 / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            next[i].vx -= fx;
            next[i].vy -= fy;
            next[j].vx += fx;
            next[j].vy += fy;
          }
        }

        // Attraction along edges
        for (const edge of MOCK_EDGES) {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) continue;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 80) * 0.005;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          s.vx += fx;
          s.vy += fy;
          t.vx -= fx;
          t.vy -= fy;
        }

        // Center gravity
        for (const n of next) {
          n.vx += (200 - n.x) * 0.001;
          n.vy += (150 - n.y) * 0.001;
        }

        // Apply velocity with damping
        for (const n of next) {
          n.vx *= 0.85;
          n.vy *= 0.85;
          n.x += n.vx;
          n.y += n.vy;
          // Bounds
          n.x = Math.max(30, Math.min(370, n.x));
          n.y = Math.max(30, Math.min(270, n.y));
        }

        return next;
      });

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes.length]);

  const nodeMap = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-text-primary">标签关系图</h3>
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className="w-full h-auto border border-border rounded-lg"
      >
        {/* Edges */}
        {MOCK_EDGES.map((edge, i) => {
          const s = nodeMap.get(edge.source);
          const t = nodeMap.get(edge.target);
          if (!s || !t) return null;
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill="var(--accent)"
              opacity="0.15"
              stroke="var(--accent)"
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fill="var(--text-primary)"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

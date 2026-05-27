"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface GraphArticle {
  id: string;
  title: string;
  tags: string | string[];
  category: string;
}

interface GraphNode {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

// Deterministic color from category string
const CATEGORY_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) | 0;
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

function parseTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

export function KnowledgeGraph({
  articles,
  currentId,
}: {
  articles: GraphArticle[];
  currentId?: string;
}) {
  const router = useRouter();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({ w: 800, h: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDimensions({
        w: Math.max(400, entry.contentRect.width),
        h: Math.max(300, Math.min(600, entry.contentRect.width * 0.6)),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Run force-directed simulation
  const runSimulation = useCallback(() => {
    if (articles.length === 0) return;

    const { w, h } = dimensions;
    const initialNodes: GraphNode[] = articles.map((a, i) => {
      const angle = (2 * Math.PI * i) / articles.length;
      const radius = Math.min(w, h) * 0.3;
      return {
        id: a.id,
        title: a.title,
        category: a.category,
        x: w / 2 + radius * Math.cos(angle),
        y: h / 2 + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });

    // Build edges from shared tags/categories
    const articleTags = articles.map((a) => ({
      tags: new Set(parseTags(a.tags)),
      category: a.category,
    }));
    const initialEdges: GraphEdge[] = [];
    for (let i = 0; i < articles.length; i++) {
      for (let j = i + 1; j < articles.length; j++) {
        let weight = 0;
        if (articleTags[i].category === articleTags[j].category) weight += 2;
        for (const tag of articleTags[i].tags) {
          if (articleTags[j].tags.has(tag)) weight += 1;
        }
        if (weight > 0) {
          initialEdges.push({ source: i, target: j, weight });
        }
      }
    }

    // Physics parameters
    const repulsion = 2000;
    const attraction = 0.005;
    const damping = 0.85;
    const centerGravity = 0.01;
    const iterations = 120;
    const minDist = 50;
    const maxX = w - 30;
    const maxY = h - 30;

    for (let iter = 0; iter < iterations; iter++) {
      // Repulsion between all node pairs
      for (let i = 0; i < initialNodes.length; i++) {
        for (let j = i + 1; j < initialNodes.length; j++) {
          const dx = initialNodes[j].x - initialNodes[i].x;
          const dy = initialNodes[j].y - initialNodes[i].y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), minDist);
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          initialNodes[i].vx -= fx;
          initialNodes[i].vy -= fy;
          initialNodes[j].vx += fx;
          initialNodes[j].vy += fy;
        }
      }

      // Attraction along edges
      for (const edge of initialEdges) {
        const src = initialNodes[edge.source];
        const tgt = initialNodes[edge.target];
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) continue;
        const force = attraction * dist * edge.weight;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        src.vx += fx;
        src.vy += fy;
        tgt.vx -= fx;
        tgt.vy -= fy;
      }

      // Center gravity
      for (const node of initialNodes) {
        node.vx += (w / 2 - node.x) * centerGravity;
        node.vy += (h / 2 - node.y) * centerGravity;
      }

      // Apply velocity with damping, clamp to bounds
      for (const node of initialNodes) {
        node.vx *= damping;
        node.vy *= damping;
        node.x = Math.max(30, Math.min(maxX, node.x + node.vx));
        node.y = Math.max(30, Math.min(maxY, node.y + node.vy));
      }
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [articles, dimensions]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  if (articles.length === 0) return null;

  const categories = [...new Set(articles.map((a) => a.category))];
  const { w, h } = dimensions;

  return (
    <div ref={containerRef} className="my-6 border border-border rounded-lg overflow-hidden">
      {/* Header with legend */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="text-xs text-text-tertiary uppercase tracking-wider">
          知识图谱
        </span>
        <div className="flex items-center gap-3">
          {categories.map((cat) => (
            <span key={cat} className="flex items-center gap-1 text-[10px] text-text-tertiary">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: categoryColor(cat) }}
              />
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Graph */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        className="bg-surface"
      >
        <g transform={`scale(${zoom})`}>
          {/* Edges */}
          {edges.map((edge, i) => {
            const src = nodes[edge.source];
            const tgt = nodes[edge.target];
            if (!src || !tgt) return null;
            return (
              <line
                key={i}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke="var(--color-border, #e5e7eb)"
                strokeWidth={Math.min(edge.weight, 3)}
                strokeOpacity={0.5}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isCurrent = node.id === currentId;
            const radius = isCurrent ? 8 : 5;
            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => router.push(`/articles/${node.id}`)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={categoryColor(node.category)}
                  stroke={isCurrent ? "var(--color-accent, #3b82f6)" : "white"}
                  strokeWidth={isCurrent ? 3 : 1.5}
                  className="transition-opacity hover:opacity-80"
                />
                <text
                  x={node.x}
                  y={node.y + radius + 12}
                  textAnchor="middle"
                  fill="var(--color-text-secondary, #6b7280)"
                  fontSize={isCurrent ? 11 : 10}
                  fontWeight={isCurrent ? 600 : 400}
                  className="pointer-events-none select-none"
                >
                  {node.title.length > 12
                    ? node.title.slice(0, 12) + "..."
                    : node.title}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zoom controls */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 bg-muted border-t border-border">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
          className="w-7 h-7 flex items-center justify-center text-xs border border-border rounded bg-surface hover:bg-surface-hover text-text-secondary"
          aria-label="缩小"
        >
          -
        </button>
        <span className="text-xs text-text-tertiary w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
          className="w-7 h-7 flex items-center justify-center text-xs border border-border rounded bg-surface hover:bg-surface-hover text-text-secondary"
          aria-label="放大"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-2 py-1 text-[10px] border border-border rounded bg-surface hover:bg-surface-hover text-text-tertiary"
        >
          重置
        </button>
      </div>
    </div>
  );
}

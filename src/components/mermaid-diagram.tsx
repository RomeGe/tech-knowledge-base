"use client";

import { useMemo } from "react";

interface DiagramNode {
  id: string;
  label: string;
}

interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

interface ParsedDiagram {
  type: "flowchart" | "sequence" | "class" | "unknown";
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  raw: string;
}

// Parse simple Mermaid diagram syntax
function parseMermaid(text: string): ParsedDiagram {
  const lines = text.trim().split("\n");
  let type: ParsedDiagram["type"] = "unknown";
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const nodeMap = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect diagram type
    if (/^(flowchart|graph)\s+[TBLR]/i.test(trimmed)) {
      type = "flowchart";
      continue;
    }
    if (/^sequenceDiagram/i.test(trimmed)) {
      type = "sequence";
      continue;
    }
    if (/^classDiagram/i.test(trimmed)) {
      type = "class";
      continue;
    }

    // Parse flowchart edges: A --> B or A -->|label| B
    const edgeMatch = trimmed.match(
      /^(\w+)\s*[-.]*-+[-.]*>?\s*(?:\|([^|]*)\|\s*)?(\w+)/
    );
    if (edgeMatch) {
      const [, from, label, to] = edgeMatch;
      if (!nodeMap.has(from)) {
        nodes.push({ id: from, label: from });
        nodeMap.add(from);
      }
      if (!nodeMap.has(to)) {
        nodes.push({ id: to, label: to });
        nodeMap.add(to);
      }
      edges.push({ from, to, label: label?.trim() });
      continue;
    }

    // Parse node definitions: A[label] or A(label)
    const nodeMatch = trimmed.match(/^(\w+)[\[{(](.+?)[\]})]/);
    if (nodeMatch) {
      const [, id, label] = nodeMatch;
      if (!nodeMap.has(id)) {
        nodes.push({ id, label: label.trim() });
        nodeMap.add(id);
      }
    }
  }

  return { type, nodes, edges, raw: text };
}

// Render flowchart as SVG
function FlowchartSVG({ nodes, edges }: { nodes: DiagramNode[]; edges: DiagramEdge[] }) {
  const nodeWidth = 120;
  const nodeHeight = 40;
  const gapX = 60;
  const gapY = 80;

  // Simple left-to-right layout
  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const visited = new Set<string>();
    let col = 0;

    // BFS from first node
    const queue = nodes.length > 0 ? [nodes[0].id] : [];
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      // Find column by longest path from root
      const incoming = edges.filter((e) => e.to === id);
      if (incoming.length === 0) {
        pos[id] = { x: 0, y: col * (nodeHeight + gapY) };
      } else {
        const parentPos = pos[incoming[0].from];
        if (parentPos) {
          pos[id] = { x: parentPos.x + nodeWidth + gapX, y: parentPos.y };
        } else {
          pos[id] = { x: 0, y: col * (nodeHeight + gapY) };
        }
      }
      col++;

      // Add children
      for (const edge of edges) {
        if (edge.from === id && !visited.has(edge.to)) {
          queue.push(edge.to);
        }
      }
    }

    // Add unvisited nodes
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        pos[node.id] = { x: 0, y: col * (nodeHeight + gapY) };
        col++;
      }
    }

    return pos;
  }, [nodes, edges]);

  const maxX = Math.max(...Object.values(positions).map((p) => p.x), 0) + nodeWidth + 40;
  const maxY = Math.max(...Object.values(positions).map((p) => p.y), 0) + nodeHeight + 40;

  return (
    <svg
      viewBox={`0 0 ${maxX} ${maxY}`}
      className="w-full max-w-2xl mx-auto"
      style={{ maxHeight: "400px" }}
    >
      {/* Edges */}
      {edges.map((edge, i) => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        if (!from || !to) return null;

        const x1 = from.x + nodeWidth;
        const y1 = from.y + nodeHeight / 2;
        const x2 = to.x;
        const y2 = to.y + nodeHeight / 2;
        const midX = (x1 + x2) / 2;

        return (
          <g key={i}>
            <path
              d={`M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1.5}
              markerEnd="url(#arrowhead)"
            />
            {edge.label && (
              <text
                x={midX}
                y={Math.min(y1, y2) - 6}
                textAnchor="middle"
                className="text-[10px] fill-text-tertiary"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const pos = positions[node.id];
        if (!pos) return null;

        return (
          <g key={node.id}>
            <rect
              x={pos.x}
              y={pos.y}
              width={nodeWidth}
              height={nodeHeight}
              rx={6}
              fill="var(--accent-subtle)"
              stroke="var(--accent)"
              strokeWidth={1.5}
            />
            <text
              x={pos.x + nodeWidth / 2}
              y={pos.y + nodeHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs fill-text-primary font-sans"
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--border)" />
        </marker>
      </defs>
    </svg>
  );
}

// Code fallback for unknown or complex diagrams
function DiagramCodeFallback({ raw }: { raw: string }) {
  return (
    <div className="my-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-t-lg text-xs text-text-tertiary">
        <span>mermaid</span>
      </div>
      <pre className="p-4 bg-surface border border-border border-t-0 rounded-b-lg overflow-x-auto text-sm text-text-secondary font-mono">
        {raw}
      </pre>
    </div>
  );
}

// Main Mermaid diagram component
export function MermaidDiagram({ code }: { code: string }) {
  const diagram = useMemo(() => parseMermaid(code), [code]);

  if (diagram.type === "flowchart" && diagram.nodes.length > 0) {
    return (
      <div className="my-6 p-4 bg-surface border border-border rounded-lg overflow-x-auto">
        <FlowchartSVG nodes={diagram.nodes} edges={diagram.edges} />
      </div>
    );
  }

  // Fallback: render as styled code block
  return <DiagramCodeFallback raw={code} />;
}

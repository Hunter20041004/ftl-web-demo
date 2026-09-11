type NetworkVariant = "hero" | "events" | "contact" | "partners";

type NetworkNode = {
  x: number;
  y: number;
  r?: number;
  hub?: boolean;
  secondary?: boolean;
};

type NetworkEdge = {
  from: number;
  to: number;
  bend?: number;
  flow?: boolean;
  secondary?: boolean;
};

type NetworkScene = {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
};

const scenes: Record<NetworkVariant, NetworkScene> = {
  hero: {
    nodes: [
      { x: 560, y: 94, r: 7, secondary: true },
      { x: 735, y: 70, r: 10, hub: true },
      { x: 886, y: 136, r: 6 },
      { x: 650, y: 236, r: 6 },
      { x: 824, y: 280, r: 8, hub: true },
      { x: 958, y: 346, r: 6, secondary: true },
      { x: 700, y: 410, r: 5, secondary: true },
    ],
    edges: [
      { from: 0, to: 1, bend: -18, secondary: true },
      { from: 1, to: 2, bend: -28, flow: true },
      { from: 1, to: 3, bend: 24 },
      { from: 2, to: 4, bend: 18 },
      { from: 3, to: 4, bend: -22, flow: true },
      { from: 4, to: 5, bend: -18 },
      { from: 4, to: 6, bend: 30, secondary: true },
    ],
  },
  events: {
    nodes: [
      { x: 84, y: 118, r: 5, secondary: true },
      { x: 238, y: 82, r: 8, hub: true },
      { x: 402, y: 172, r: 5 },
      { x: 588, y: 100, r: 6 },
      { x: 770, y: 174, r: 9, hub: true },
      { x: 920, y: 124, r: 5, secondary: true },
      { x: 318, y: 366, r: 6 },
      { x: 690, y: 390, r: 5, secondary: true },
    ],
    edges: [
      { from: 0, to: 1, bend: -14, secondary: true },
      { from: 1, to: 2, bend: 34 },
      { from: 2, to: 3, bend: -30, flow: true },
      { from: 3, to: 4, bend: 26 },
      { from: 4, to: 5, bend: -22, secondary: true },
      { from: 1, to: 6, bend: 18 },
      { from: 2, to: 6, bend: -20 },
      { from: 4, to: 7, bend: 24, flow: true },
      { from: 6, to: 7, bend: -26, secondary: true },
    ],
  },
  contact: {
    nodes: [
      { x: 520, y: 92, r: 5, secondary: true },
      { x: 690, y: 128, r: 6 },
      { x: 846, y: 88, r: 5, secondary: true },
      { x: 764, y: 270, r: 11, hub: true },
      { x: 932, y: 332, r: 6 },
      { x: 594, y: 404, r: 5, secondary: true },
    ],
    edges: [
      { from: 0, to: 1, bend: -18, secondary: true },
      { from: 1, to: 3, bend: 30, flow: true },
      { from: 2, to: 3, bend: -24 },
      { from: 3, to: 4, bend: 22, flow: true },
      { from: 3, to: 5, bend: 32, secondary: true },
      { from: 1, to: 5, bend: -20 },
    ],
  },
  partners: {
    nodes: [
      { x: 58, y: 272, r: 5, secondary: true },
      { x: 202, y: 238, r: 7 },
      { x: 360, y: 286, r: 5 },
      { x: 520, y: 226, r: 9, hub: true },
      { x: 676, y: 278, r: 5 },
      { x: 826, y: 236, r: 7 },
      { x: 958, y: 270, r: 5, secondary: true },
    ],
    edges: [
      { from: 0, to: 1, bend: -16, secondary: true },
      { from: 1, to: 2, bend: 18 },
      { from: 2, to: 3, bend: -20, flow: true },
      { from: 3, to: 4, bend: 20 },
      { from: 4, to: 5, bend: -18, flow: true },
      { from: 5, to: 6, bend: 14, secondary: true },
      { from: 1, to: 3, bend: -42, secondary: true },
      { from: 3, to: 5, bend: 40, secondary: true },
    ],
  },
};

function edgePath(scene: NetworkScene, edge: NetworkEdge) {
  const from = scene.nodes[edge.from];
  const to = scene.nodes[edge.to];
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 + (edge.bend ?? 0);
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
}

export function TransactionNetworkVisual({ variant }: { variant: NetworkVariant }) {
  const scene = scenes[variant];

  return (
    <div
      className={`transaction-network transaction-network--${variant}`}
      data-transaction-network={variant}
      aria-hidden="true"
    >
      <svg
        className="transaction-network__svg"
        viewBox="0 0 1000 520"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <g className="transaction-network__edges">
          {scene.edges.map((edge, index) => {
            const d = edgePath(scene, edge);
            const edgeClass = [
              "transaction-network__edge",
              edge.secondary ? "transaction-network__edge--secondary" : "",
            ].filter(Boolean).join(" ");

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <path className={edgeClass} d={d} data-network-edge />
                {edge.flow ? (
                  <path
                    className="transaction-network__flow"
                    d={d}
                    pathLength="100"
                    data-network-flow
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <g className="transaction-network__nodes">
          {scene.nodes.map((node, index) => {
            const radius = node.r ?? 6;
            const nodeClass = [
              "transaction-network__node",
              node.hub ? "transaction-network__node--hub" : "",
              node.secondary ? "transaction-network__node--secondary" : "",
            ].filter(Boolean).join(" ");

            return (
              <g
                className={nodeClass}
                transform={`translate(${node.x} ${node.y})`}
                data-network-node
                key={`${node.x}-${node.y}-${index}`}
              >
                {node.hub ? (
                  <circle className="transaction-network__hub-field" r={radius * 3.2} />
                ) : null}
                <circle className="transaction-network__node-ring" r={radius + 4} />
                <circle className="transaction-network__node-core" r={Math.max(2.2, radius * 0.42)} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

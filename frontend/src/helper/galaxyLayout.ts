const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export interface GalaxyLayout {
  position: [number, number, number];
  rotationSpeed: number;
  displayScale: number;
}

export function getGalaxyLayout(index: number, total: number): GalaxyLayout {
  if (total <= 1) {
    return {
      position: [0, 0, 0],
      rotationSpeed: 0.004,
      displayScale: 1.3,
    };
  }

  const count = Math.max(2, total);
  const y = 1 - (index / (count - 1)) * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = index * GOLDEN_ANGLE;
  const spread = Math.min(11, Math.max(4.5, 3.25 + count * 0.85));

  return {
    position: [
      Math.cos(theta) * radiusAtY * spread,
      y * spread * 0.55,
      Math.sin(theta) * radiusAtY * spread,
    ],
    rotationSpeed: 0.0025 + (index % 5) * 0.0007,
    displayScale: 0.95 + (index % 3) * 0.12,
  };
}

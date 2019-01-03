import Vector3 from './vector3';
import Quaternion from './quaternion';

import config from '../services/config';

export const applyDeadZone = (value, deadZone = 0.001) =>
  value > -deadZone && value < deadZone ? 0 : value;

export function calculateDistanceSquared(
  v1,
  v2,
  yLimit = config.guideParams.verticalCutoff
) {
  return calculateDistanceFromVectorsSquared(
    v1.pose.position,
    v2.pose.position,
    yLimit
  );
}

export function calculateDistanceFromVectors(v1, v2, yLimit) {
  return Math.sqrt(calculateDistanceFromVectorsSquared(v1, v2, yLimit));
}

export function calculateDistanceFromVectorsSquared(v1, v2, yLimit) {
  if (Math.abs(v2.y - v1.y) > yLimit) {
    return Infinity;
  } else {
    return (v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2 + (v2.z - v1.z) ** 2;
  }
}

export function findNearestPointTo(point, points, radius = Infinity) {
  let minDistanceSquared = radius ** 2;
  let nearestPoint;
  for (const otherPoint of points) {
    if (point !== otherPoint) {
      const distanceSquared = calculateDistanceSquared(point, otherPoint);
      if (distanceSquared < minDistanceSquared) {
        nearestPoint = otherPoint;
        minDistanceSquared = distanceSquared;
      }
    }
  }

  return nearestPoint;
}

/**
 * Checks if a point is near to one out of a set of edges and returns the edge and the projected point on the edge.
 *
 * @param point The point to check for.
 * @param edges A set of edges defined by starting point and ending point.
 * @param radius The radius within to search for.
 * @returns {{edge: *, point: *}}
 */
export function findNearestPointOnEdge(point, edges, radius = Infinity) {
  let minDistanceSquared = radius ** 2;
  let nearestEdge;
  let nearestPoint;

  for (const { edge, points } of edges) {
    const pointOnEdge = projectPointOnEdge(point, points);
    if (pointOnEdge) {
      const distanceSquared = calculateDistanceFromVectorsSquared(
        pointOnEdge,
        point
      );
      if (distanceSquared < minDistanceSquared) {
        nearestEdge = edge;
        nearestPoint = pointOnEdge;
        minDistanceSquared = distanceSquared;
      }
    }
  }

  return {
    edge: nearestEdge,
    point: nearestPoint,
  };
}

/**
 * Project a Point (point) onto a edge (defined by the two points p1 and p2). Returns null if projected point is outside
 * the given edge bounds.
 *
 * @param point The point to project.
 * @param p1 Starting point of the edge.
 * @param p2 Ending point of the edge.
 * @returns {Vector3} Point projected to the edge.
 *
 */
export function projectPointOnEdge(point, [p1, p2]) {
  const vp = new Vector3(point);
  const v1 = new Vector3(p1);
  const v2 = new Vector3(p2);

  // Get the direction of the projection.
  const v1v2 = v2.clone().subtract(v1);
  const d = v1v2.clone().normalize();

  // Get the projected length.
  const v = vp.clone().subtract(v1);
  const t = v.dot(d);

  // Check if projected length is bigger than the edge's length.
  if (t > v1v2.length()) {
    return null;
  }

  // Project the calculated length from the starting edge along the direction.
  const pointOnEdge = v1.clone().add(d.clone().scale(t));

  // Check if length from calculated point to starting point and to ending point is shorter than length between
  // starting and ending point. If not, the point is not on the edge.
  const v1pEdge = pointOnEdge.clone().subtract(v1);
  const v2pEdge = pointOnEdge.clone().subtract(v2);
  const length = v1v2.length();
  if (v1pEdge.length() > length || v2pEdge.length() > length) {
    return null;
  }

  return pointOnEdge;
}

export function findPointsInRadius(point, points, radius = Infinity) {
  let minDistanceSquared = radius ** 2;
  const pointsInRadius = new Set();
  for (const otherPoint of points) {
    if (point !== otherPoint) {
      const distanceSquared = calculateDistanceSquared(point, otherPoint);
      if (distanceSquared < minDistanceSquared) {
        pointsInRadius.add(otherPoint);
      }
    }
  }

  return pointsInRadius;
}

export function calculateDistance(v1, v2) {
  if (!v1 || !v2) return Infinity;
  return Math.sqrt(calculateDistanceSquared(v1, v2));
}

export function angleDiff(from, to) {
  const diff = to - from;
  return Math.atan2(Math.sin(diff), Math.cos(diff));
}

export function calculateEdgePose(point1, point2) {
  const p1 = new Vector3(point1.pose.position);
  const p2 = new Vector3(point2.pose.position);
  const p1p2 = p2.clone().subtract(p1);

  return {
    position: p1,
    orientation: Quaternion.fromUnitVectors(
      Vector3.X_AXIS,
      p1p2.clone().normalize()
    ),
    scale: {
      x: p1p2.length() * 0.001,
      y: 0.1,
      z: 0.1,
    },
  };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

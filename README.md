# Hand Landmark Detector

Library compatible with p5js for hand pose detection.

## variables

- wrist
- thumb1
- thumb2
- thumb3
- thumb4
- index1
- index2
- index3
- index4
- middle1
- middle2
- middle3
- middle4
- ring1
- ring2
- ring3
- ring4
- pinky1
- pinky2
- pinky3
- pinky4
- landmarks: array of all landmarks

## methods

- drawLandmarks()
- drawVideo(x = 0, y = 0, w = width, h = height)
- distanceBetween(p1, p2): returns the distance between landmarks p1 and p2
- directionBetween(p1, p2): returns the angle formed by landmarks p1 and p2 in the range of -1 to 1
- drawImageBetween(img, p1, p2): draws an image between landmarks p1 and p2

## notes

- use node 16.x
- use npm install (not yarn or pnpm)

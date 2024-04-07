# Hand Landmarks Tracker

A library compatible with p5.js for hand pose detection.

## Variables

- `wrist`
- `thumb1`, `thumb2`, `thumb3`, `thumb4`
- `index1`, `index2`, `index3`, `index4`
- `middle1`, `middle2`, `middle3`, `middle4`
- `ring1`, `ring2`, `ring3`, `ring4`
- `pinky1`, `pinky2`, `pinky3`, `pinky4`
- `landmarks`: Array containing all the landmarks.

## Methods

- `createHandTracker()`: Creates a new hand tracker.
- `drawLandmarks()`: Visualizes the detected hand landmarks on the canvas.
- `drawVideo(x = 0, y = 0, w = width, h = height)`: Draws the video feed on the canvas. Can be customized with position and size.
- `distanceBetween(p1, p2)`: Returns the Euclidean distance between landmarks `p1` and `p2`.
- `directionBetween(p1, p2)`: Returns the direction angle formed by landmarks `p1` and `p2`, normalized to the range of -1 to 1.
- `drawImageBetween(img, p1, p2)`: Draws an image stretched between landmarks `p1` and `p2`, aligning it with the line connecting these points.

## Notes

- Compatible with Node.js version 16.x.
- Use `npm install` for installing dependencies (avoid using `yarn` or `pnpm`).

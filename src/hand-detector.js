import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

window.isInputVideoFlipped = null
window.inputVideo = null
window.wrist = null
window.thumb1 = null
window.thumb2 = null
window.thumb3 = null
window.thumb4 = null
window.index1 = null
window.index2 = null
window.index3 = null
window.index4 = null
window.middle1 = null
window.middle2 = null
window.middle3 = null
window.middle4 = null
window.ring1 = null
window.ring2 = null
window.ring3 = null
window.ring4 = null
window.pinky1 = null
window.pinky2 = null
window.pinky3 = null
window.pinky4 = null

window.landmarks = []
window.inputVideoUrl = null

let namesMap = [
  'wrist',
  'thumb1',
  'thumb2',
  'thumb3',
  'thumb4',
  'index1',
  'index2',
  'index3',
  'index4',
  'middle1',
  'middle2',
  'middle3',
  'middle4',
  'ring1',
  'ring2',
  'ring3',
  'ring4',
  'pinky1',
  'pinky2',
  'pinky3',
  'pinky4',
]

class HandTracker {
  constructor({ url = null, flip = true } = {}) {
    this.isVideoLoaded = false
    this.isDetectorLoaded = false
    this.detector = null

    isInputVideoFlipped = flip
    inputVideoUrl = url

    createButton('Start Capture')
      .position(10, 10)
      .mousePressed(() => {
        this.initResources()
      })
  }

  async initResources() {
    if (window.inputVideoUrl) {
      console.log('Loading video')
      inputVideo = createVideo(window.inputVideoUrl, () => {
        console.log('Video loaded')
        inputVideo.play()
        inputVideo.loop()
        inputVideo.volume(0)
        this.isVideoLoaded = true
        console.log('Video playing, starting detection')
        if (this.isDetectorLoaded) {
          this.startDetection()
        }
      }).hide()
    } else {
      console.log('Loading webcam')
      inputVideo = createCapture(VIDEO, () => {
        this.isVideoLoaded = true
        console.log('Webcam loaded')
        this.startDetection()
      }).hide()
    }

    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm')

    this.detector = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      numHands: 1,
    })

    this.isDetectorLoaded = true
    console.log('Detector loaded')
    this.startDetection()
  }

  startDetection() {
    if (this.isVideoLoaded && this.isDetectorLoaded) {
      this.detectHand()
    }
  }

  async detectHand() {
    if (!this.isVideoLoaded || !this.isDetectorLoaded) return

    this.nullKeypoints()

    try {
      const estimation = await this.detector.detect(inputVideo.elt)

      if (estimation && estimation.landmarks && estimation.landmarks[0]) {
        keypoints = []
        const lms = estimation.landmarks[0]

        lms.forEach((lm, i) => {
          let name = namesMap[i]
          let adjustedX = lm.x * width
          const adjustedY = lm.y * height

          if (isInputVideoFlipped) {
            adjustedX = width - adjustedX
          }

          window[name] = {
            x: adjustedX,
            y: adjustedY,
          }

          landmarks.push({ x: adjustedX, y: adjustedY, name: name })
        })
      } else {
        this.nullKeypoints()
      }

      requestAnimationFrame(this.detectHand.bind(this))
    } catch (error) {
      console.error('Error detecting hand:', error)
    }
  }

  nullKeypoints() {
    namesMap.forEach((name) => {
      window[name] = null
    })
    landmarks = []
  }
}

window.drawVideo = (x = 0, y = 0, w = width, h = height) => {
  if (!inputVideo) return
  push()
  imageMode(CORNER)
  if (isInputVideoFlipped) {
    translate(width, 0)
    scale(-1, 1)
    image(inputVideo, width - (x + w), y, w, h)
  } else {
    image(inputVideo, x, y, w, h)
  }
  pop()
}

window.drawLandmarks = ({ size = 8, color = 'white' } = {}) => {
  if (!landmarks) return
  push()
  fill(color)
  noStroke()
  landmarks.forEach((lm) => {
    circle(lm.x, lm.y, size)
  })
  pop()
}

window.drawSkeleton = ({ thickness = 2, color = 'white' } = {}) => {
  push()
  stroke(color)
  strokeWeight(thickness)
  noFill()
  line(wrist?.x, wrist?.y, thumb1?.x, thumb1?.y)
  line(wrist?.x, wrist?.y, pinky1?.x, pinky1?.y)

  line(thumb1?.x, thumb1?.y, thumb2?.x, thumb2?.y)
  line(thumb2?.x, thumb2?.y, thumb3?.x, thumb3?.y)
  line(thumb3?.x, thumb3?.y, thumb4?.x, thumb4?.y)

  line(index1?.x, index1?.y, index2?.x, index2?.y)
  line(index2?.x, index2?.y, index3?.x, index3?.y)
  line(index3?.x, index3?.y, index4?.x, index4?.y)

  line(middle1?.x, middle1?.y, middle2?.x, middle2?.y)
  line(middle2?.x, middle2?.y, middle3?.x, middle3?.y)
  line(middle3?.x, middle3?.y, middle4?.x, middle4?.y)

  line(ring1?.x, ring1?.y, ring2?.x, ring2?.y)
  line(ring2?.x, ring2?.y, ring3?.x, ring3?.y)
  line(ring3?.x, ring3?.y, ring4?.x, ring4?.y)

  line(pinky1?.x, pinky1?.y, pinky2?.x, pinky2?.y)
  line(pinky2?.x, pinky2?.y, pinky3?.x, pinky3?.y)
  line(pinky3?.x, pinky3?.y, pinky4?.x, pinky4?.y)

  line(thumb2?.x, thumb2?.y, index1?.x, index1?.y)
  line(index1?.x, index1?.y, middle1?.x, middle1?.y)
  line(middle1?.x, middle1?.y, ring1?.x, ring1?.y)
  line(ring1?.x, ring1?.y, pinky1?.x, pinky1?.y)
  pop()
}

window.drawImageBetween = (img, p1, p2) => {
  if (!img || !p1 || !p2) return

  let distance = distanceBetween(p1, p2)
  let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)

  push()
  imageMode(CENTER)
  translate((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
  rotate(angle)
  image(img, 0, 0, distance, (distance * img.height) / img.width)
  pop()
}

window.distanceBetween = (p1, p2) => {
  if (!p1 || !p2) return 0
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

window.directionBetween = (p1, p2) => {
  if (!p1 || !p2) return 0
  let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
  return map(angle, -Math.PI / 2, Math.PI / 2, -1, 1)
}

window.createHandTracker = ({ url = null, flip = null } = {}) => {
  flip = flip !== null ? flip : url ? false : true
  return new HandTracker({ url, flip })
}

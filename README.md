# VELA • Modern High-Performance Media Player & Audiophile Turntable

<div align="center">
  <img src="assets/logo_128.png" width="96" alt="VELA Emblem" />
  <h2>VELA Media Player</h2>
  <p><strong>Next-Gen Video Player • Audiophile Hi-Fi Vinyl Stage • Spotify-Style Synced Lyrics • Interactive DJ Scratch</strong></p>
</div>

---

## ✨ Features Overview

### 🎬 1. Modern Video Experience
- **Fluid & Responsive Playback**: Hardware-accelerated decoding (HEVC/H.264/AV1/VP9) via Electron with zero dropped frames.
- **Gesture Scrubbing**: Horizontal drag-to-seek with smooth timecode previews and responsive scrubbing.
- **Lossless Stream-Copy Trimmer**: Export high-precision video clips in milliseconds without re-encoding quality loss.
- **Full Keyboard Shortcuts**: Space (Play/Pause), Left/Right (Seek 10s), Up/Down (Volume), `F` (Fullscreen), `T` (Trim Mode), `M` (Mute).

---

### 🎵 2. Audiophile Vinyl Turntable Stage
- **Deeper Espresso Aesthetic**: Custom luxury dark palette (`#120908`, `#1F100E`, `#2C1815`, `#C4846C`, `#E5A890`, `#F2ECE7`).
- **Realistic 33 RPM Turntable**: High-fidelity grooved vinyl disc with tonearm cartridge needle and peeking album sleeve.
- **Interactive DJ Vinyl Scratching**:
  - Real-time 1:1 angular mouse drag scratching.
  - Realistic Web Audio synthesis simulating vinyl groove friction & "wikka-wikka" needle squeal.
  - Mechanical tonearm needle micro-jitter during scratching.
  - Inertia release that seamlessly resumes smooth continuous 33 RPM rotation.
- **Beat-Reactive 360° Musical Particles**:
  - Fast-Fourier Transform (FFT) Web Audio spectral flux detecting Bass, Snares, and Treble.
  - Notes burst outward radially in 360 degrees with a Trap-style twister swirl and rapid exponential aerodynamic braking.
  - Clean boundary barrier safeguarding lyrics and album art.

---

### 📜 3. Real-Time Spotify-Style Synced Lyrics
- **Automated Lyrics Fetching**: Powered by LRCLIB API with smart artist & track title sanitization.
- **Offline & Local Fallback**: Automatically loads matching local `.lrc` files or embedded ID3 lyric tags.
- **Spotify Aesthetics**: Large bold active typography, blurred passed lines, smooth auto-scrolling, top/bottom gradient masks, and click-to-seek playback.

---

### 🔍 4. Inspector Drawer & Live BPM
- Detailed file inspection drawer displaying resolution, container, codecs, audio bitrates, and live-calculated/tagged **BPM**.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [FFmpeg](https://ffmpeg.org/) (for lossless trimming export)

### Installation
```bash
git clone https://github.com/YOUR_USERNAME/Vela.git
cd Vela
npm install
```

### Running the App
```bash
npm start
```

### Packaging into Standalone Executable (.exe)
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework**: Electron, Node.js
- **Audio Processing**: Web Audio API (AnalyserNode, BiquadFilter, BufferSource, Pink Noise Synthesis)
- **Canvas Visualizer**: 60 FPS HTML5 Canvas 2D Vector Rendering
- **Lyrics API**: LRCLIB
- **Styling**: Vanilla CSS with hardware-accelerated transforms & SVG vectors

---

## 📄 License
MIT License.

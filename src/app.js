// VELA - Movies & TV Dedicated Video Player Logic
document.addEventListener('DOMContentLoaded', async () => {
  // Elements - Viewport & Video
  const videoContainer = document.getElementById('video-container');
  const mainVideo = document.getElementById('main-video');
  const emptyDropZone = document.getElementById('empty-drop-zone');
  const emptyOpenBtn = document.getElementById('empty-open-btn');
  const openVideoBtn = document.getElementById('open-video-btn');
  const headerFileName = document.getElementById('header-file-name');
  const bottomVideoTitle = document.getElementById('bottom-video-title');

  // Elements - Side Navigation & Switching (Movies & TV style)
  const navPrevBtn = document.getElementById('nav-prev-btn');
  const navNextBtn = document.getElementById('nav-next-btn');
  const videoSwitchCard = document.getElementById('video-switch-card');
  const switchBadge = document.getElementById('switch-badge');
  const switchTitle = document.getElementById('switch-title');

  // Elements - Normal Playback Controls
  const normalControls = document.getElementById('normal-controls');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playMainIcon = document.getElementById('play-main-icon');
  const pauseMainIcon = document.getElementById('pause-main-icon');
  const rewind10Btn = document.getElementById('rewind-10-btn');
  const forward10Btn = document.getElementById('forward-10-btn');
  const timelineTrack = document.getElementById('timeline-track');
  const timelinePlayed = document.getElementById('timeline-played');
  const timelineThumb = document.getElementById('timeline-thumb');
  const labelCurrentTime = document.getElementById('label-current-time');
  const labelDurationTime = document.getElementById('label-duration-time');
  const volumeMuteBtn = document.getElementById('volume-mute-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeValLabel = document.getElementById('volume-val-label');
  const pipBtn = document.getElementById('pip-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  // Elements - Playback Speed Controller (Left of Pencil)
  const speedControlContainer = document.getElementById('speed-control-container');
  const speedPillBtn = document.getElementById('speed-pill-btn');
  const speedPillVal = document.getElementById('speed-pill-val');
  const speedTrackContainer = document.getElementById('speed-track-container');
  const speedActiveFill = document.getElementById('speed-active-fill');
  const speedThumbHandle = document.getElementById('speed-thumb-handle');

  // Elements - Pencil Menu (Image 2)
  const pencilEditBtn = document.getElementById('pencil-edit-btn');
  const pencilPopupMenu = document.getElementById('pencil-popup-menu');
  const menuActionTrim = document.getElementById('menu-action-trim');
  const menuActionSavePhoto = document.getElementById('menu-action-save-photo');
  const menuOptionsBtn = document.getElementById('more-options-btn');
  const moreOptionsBtn = document.getElementById('more-options-btn');
  const morePopupMenu = document.getElementById('more-popup-menu');
  const menuActionInfo = document.getElementById('menu-action-info');
  const menuOpenFile = document.getElementById('menu-open-file');
  const menuShowFolder = document.getElementById('menu-show-folder');

  // Elements - Info Drawer (Image 1)
  const sideInfoDrawer = document.getElementById('side-info-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const infoValFile = document.getElementById('info-val-file');
  const infoValDuration = document.getElementById('info-val-duration');
  const infoValVideo = document.getElementById('info-val-video');
  const infoValPixel = document.getElementById('info-val-pixel');
  const infoValDecoder = document.getElementById('info-val-decoder');
  const infoValRenderer = document.getElementById('info-val-renderer');
  const infoValAudio = document.getElementById('info-val-audio');
  const infoValBpm = document.getElementById('info-val-bpm');
  const infoValSize = document.getElementById('info-val-size');
  const infoValDropped = document.getElementById('info-val-dropped');

  // Elements - Trim Mode (Image 3)
  const windowCenterTab = document.getElementById('window-center-tab');
  const trimTopActions = document.getElementById('trim-top-actions');
  const trimSaveCopyBtn = document.getElementById('trim-save-copy-btn');
  const trimCancelTopBtn = document.getElementById('trim-cancel-top-btn');
  const trimControls = document.getElementById('trim-controls');
  const trimFloatingBadge = document.getElementById('trim-floating-badge');
  const trimPlayPauseBtn = document.getElementById('trim-play-pause-btn');
  const trimPlayIcon = document.getElementById('trim-play-icon');
  const trimPauseIcon = document.getElementById('trim-pause-icon');
  const trimMuteBtn = document.getElementById('trim-mute-btn');
  const trimVolumeSlider = document.getElementById('trim-volume-slider');
  const trimVolumeValLabel = document.getElementById('trim-volume-val-label');
  const trimVolumeIcon = document.getElementById('trim-volume-icon');
  const trimLabelStart = document.getElementById('trim-label-start');
  const trimLabelEnd = document.getElementById('trim-label-end');
  const trimSliderBar = document.getElementById('trim-slider-bar');
  const trimSelectedRail = document.getElementById('trim-selected-rail');
  const trimHandleLeft = document.getElementById('trim-handle-left');
  const trimHandleRight = document.getElementById('trim-handle-right');
  const trimPlayhead = document.getElementById('trim-playhead');

  // Elements - Dedicated Vinyl Audio Player Stage
  const audioVinylStage = document.getElementById('audio-vinyl-stage');
  const audioTrackCard = document.getElementById('audio-track-card');
  const turntableDeck = document.getElementById('turntable-deck');
  const vinylDisc = document.getElementById('vinyl-disc');
  const peekingDisc = document.getElementById('peeking-disc');
  const tonearmAssembly = document.getElementById('tonearm-assembly');
  const audioCoverImg = document.getElementById('audio-cover-img');
  const audioCoverFallback = document.getElementById('audio-cover-fallback');
  const audioMetaTitle = document.getElementById('audio-meta-title');
  const audioMetaDuration = document.getElementById('audio-meta-duration');
  const audioMetaArtist = document.getElementById('audio-meta-artist');
  const audioMetaAlbum = document.getElementById('audio-meta-album');
  const audioArtistRow = document.getElementById('audio-artist-row');
  const audioAlbumRow = document.getElementById('audio-album-row');
  const vinylLabelSpeed = document.getElementById('vinyl-label-speed');

  // Elements - Spotify-Style Synced Lyrics
  const audioLyricsContainer = document.getElementById('audio-lyrics-container');
  const lyricsScrollTrack = document.getElementById('lyrics-scroll-track');
  const lyricsPlaceholder = document.getElementById('lyrics-placeholder');
  const lyricsStatusText = document.getElementById('lyrics-status-text');

  let currentParsedLyrics = [];
  let currentActiveLyricIndex = -1;
  let isUserManuallyScrollingLyrics = false;
  let userScrollLyricsTimer = null;
  let currentLyricsTrackId = '';

  const ALL_AUDIO_EXTENSIONS = ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'opus', 'wma', 'alac', 'aiff'];
  let isCurrentMediaAudio = false;

  function checkIsAudioFile(filePath) {
    if (!filePath) return false;
    const ext = filePath.split('.').pop().toLowerCase();
    return ALL_AUDIO_EXTENSIONS.includes(ext);
  }

  // ==================== DJ VINYL SCRATCH ENGINE ====================
  let vinylWebAnimation = null;
  let isScratchingVinyl = false;
  let scratchCurrentAngle = 0;
  let lastPointerAngle = 0;
  let lastPointerTime = 0;
  let wasPlayingBeforeScratch = false;
  let scratchOriginalVolume = 1;
  let scratchSynth = null;

  function getCurrentVinylAngle() {
    if (!vinylDisc) return 0;
    const st = window.getComputedStyle(vinylDisc);
    const tr = st.transform || st.webkitTransform;
    if (tr && tr !== 'none') {
      try {
        const parts = tr.split('(')[1].split(')')[0].split(',');
        const a = parseFloat(parts[0]);
        const b = parseFloat(parts[1]);
        let deg = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        if (deg < 0) deg += 360;
        return deg;
      } catch (err) {
        return 0;
      }
    }
    return 0;
  }

  function resumeVinylRotation(startAngle = null) {
    if (!vinylDisc) return;
    const angle = startAngle !== null ? startAngle : getCurrentVinylAngle();
    const rate = currentSpeedVal || 1.0;
    const durationMs = 6000 / Math.max(0.25, rate);

    if (vinylWebAnimation) {
      vinylWebAnimation.cancel();
      vinylWebAnimation = null;
    }

    vinylDisc.classList.remove('scratching');

    if (vinylDisc.animate) {
      vinylWebAnimation = vinylDisc.animate([
        { transform: 'rotate(' + angle + 'deg)' },
        { transform: 'rotate(' + (angle + 360) + 'deg)' }
      ], {
        duration: durationMs,
        iterations: Infinity,
        easing: 'linear'
      });
    } else {
      vinylDisc.classList.add('playing');
    }
  }

  function pauseVinylRotation() {
    if (vinylWebAnimation) {
      const curAngle = getCurrentVinylAngle();
      vinylWebAnimation.cancel();
      vinylWebAnimation = null;
      vinylDisc.style.transform = 'rotate(' + curAngle + 'deg)';
    }
    vinylDisc.classList.remove('playing');
  }

  function initScratchSynth() {
    if (!audioContextObj) {
      initWebAudioAnalyser();
    }
    if (!audioContextObj || scratchSynth) return;

    try {
      const bufferSize = audioContextObj.sampleRate * 2;
      const noiseBuffer = audioContextObj.createBuffer(1, bufferSize, audioContextObj.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
        b6 = white * 0.115926;
      }

      const noiseSource = audioContextObj.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const hpFilter = audioContextObj.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.value = 260;

      const bpFilter = audioContextObj.createBiquadFilter();
      bpFilter.type = 'bandpass';
      bpFilter.frequency.value = 650;
      bpFilter.Q.value = 6.5;

      const scratchGain = audioContextObj.createGain();
      scratchGain.gain.value = 0;

      noiseSource.connect(hpFilter);
      hpFilter.connect(bpFilter);
      bpFilter.connect(scratchGain);
      scratchGain.connect(audioContextObj.destination);

      noiseSource.start();

      scratchSynth = {
        noiseSource,
        bpFilter,
        scratchGain
      };
    } catch (err) {
      console.warn('Scratch synth init note:', err);
    }
  }

  function updateScratchAudio(angularVelocityDegPerSec) {
    if (!scratchSynth || !audioContextObj) return;

    const absSpeed = Math.abs(angularVelocityDegPerSec);
    const now = audioContextObj.currentTime;

    if (absSpeed > 20) {
      const targetFreq = Math.min(2900, Math.max(420, 500 + absSpeed * 3.2));
      scratchSynth.bpFilter.frequency.setTargetAtTime(targetFreq, now, 0.015);

      const targetQ = Math.min(10.5, 5.5 + absSpeed * 0.008);
      scratchSynth.bpFilter.Q.setTargetAtTime(targetQ, now, 0.015);

      const targetGain = Math.min(0.48, Math.max(0, (absSpeed - 20) / 400 * 0.48));
      scratchSynth.scratchGain.gain.setTargetAtTime(targetGain, now, 0.015);
    } else {
      scratchSynth.scratchGain.gain.setTargetAtTime(0, now, 0.035);
    }
  }

  function stopScratchAudio() {
    if (scratchSynth && audioContextObj) {
      scratchSynth.scratchGain.gain.setTargetAtTime(0, audioContextObj.currentTime, 0.03);
    }
  }

  function setupVinylScratchListeners() {
    if (!vinylDisc || !turntableDeck) return;

    let didScratchMove = false;

    vinylDisc.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (!isCurrentMediaAudio) return;

      isScratchingVinyl = true;
      didScratchMove = false;
      if (vinylDisc.setPointerCapture) {
        try { vinylDisc.setPointerCapture(e.pointerId); } catch (err) {}
      }

      initScratchSynth();
      if (audioContextObj && audioContextObj.state === 'suspended') {
        audioContextObj.resume().catch(() => {});
      }

      scratchCurrentAngle = getCurrentVinylAngle();
      if (vinylWebAnimation) {
        vinylWebAnimation.cancel();
        vinylWebAnimation = null;
      }

      vinylDisc.classList.add('scratching');
      vinylDisc.style.transform = 'rotate(' + scratchCurrentAngle + 'deg)';

      if (tonearmAssembly) {
        tonearmAssembly.classList.add('scratching');
      }

      wasPlayingBeforeScratch = !mainVideo.paused;
      if (wasPlayingBeforeScratch) {
        scratchOriginalVolume = mainVideo.volume;
        mainVideo.volume = Math.max(0, scratchOriginalVolume * 0.15);
      }

      const deckRect = turntableDeck.getBoundingClientRect();
      const centerX = deckRect.left + deckRect.width / 2;
      const centerY = deckRect.top + deckRect.height / 2;
      lastPointerAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      lastPointerTime = performance.now();
    });

    window.addEventListener('pointermove', (e) => {
      if (!isScratchingVinyl) return;

      const now = performance.now();
      const dt = Math.max(0.001, (now - lastPointerTime) / 1000);
      lastPointerTime = now;

      const deckRect = turntableDeck.getBoundingClientRect();
      const centerX = deckRect.left + deckRect.width / 2;
      const centerY = deckRect.top + deckRect.height / 2;
      const currentPointerAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

      let deltaDeg = currentPointerAngle - lastPointerAngle;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;
      lastPointerAngle = currentPointerAngle;

      didScratchMove = true;
      scratchCurrentAngle += deltaDeg;
      vinylDisc.style.transform = 'rotate(' + scratchCurrentAngle + 'deg)';

      const angularVelocity = deltaDeg / dt;

      // 360 degrees = 1.8 seconds of playback
      const timeDelta = (deltaDeg / 360) * 1.8;
      if (mainVideo.duration && Math.abs(timeDelta) > 0.0005) {
        const newTime = Math.max(0, Math.min(mainVideo.duration, mainVideo.currentTime + timeDelta));
        mainVideo.currentTime = newTime;
      }

      updateScratchAudio(angularVelocity);

      if (tonearmAssembly) {
        const jitter = (Math.random() - 0.5) * Math.min(2.8, Math.abs(angularVelocity) * 0.009);
        tonearmAssembly.style.transform = 'rotate(' + (26 + jitter) + 'deg)';
      }
    });

    const handlePointerUp = (e) => {
      if (!isScratchingVinyl) return;
      isScratchingVinyl = false;

      stopScratchAudio();

      if (tonearmAssembly) {
        tonearmAssembly.classList.remove('scratching');
        tonearmAssembly.style.transform = '';
      }

      if (wasPlayingBeforeScratch) {
        mainVideo.volume = scratchOriginalVolume;
        mainVideo.play().catch(() => {});
        resumeVinylRotation(scratchCurrentAngle);
      } else {
        pauseVinylRotation();
      }
    };

    window.addEventListener('pointerup', (e) => {
      handlePointerUp(e);
      setTimeout(() => { didScratchMove = false; }, 150);
    });
    window.addEventListener('pointercancel', (e) => {
      handlePointerUp(e);
      setTimeout(() => { didScratchMove = false; }, 150);
    });

    // Capture and swallow any synthetic click generated by the browser after dragging the vinyl
    window.addEventListener('click', (e) => {
      if (didScratchMove) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        didScratchMove = false;
      }
    }, true);
  }

  setupVinylScratchListeners();

  function updateVinylAnimationState() {
    if (!vinylDisc || !peekingDisc || !tonearmAssembly) return;
    if (isScratchingVinyl) return;

    if (!isCurrentMediaAudio) {
      pauseVinylRotation();
      peekingDisc.classList.remove('playing');
      tonearmAssembly.classList.add('paused');
      return;
    }

    if (mainVideo.paused) {
      pauseVinylRotation();
      peekingDisc.classList.remove('playing');
      tonearmAssembly.classList.add('paused');
    } else {
      resumeVinylRotation();
      peekingDisc.classList.add('playing');
      tonearmAssembly.classList.remove('paused');
    }
  }

  function updateVinylSpeed(rate = 1.0) {
    if (!vinylDisc || !peekingDisc) return;
    const durationSec = (6 / Math.max(0.25, rate)).toFixed(2);
    vinylDisc.style.animationDuration = durationSec + 's';
    peekingDisc.style.animationDuration = durationSec + 's';
    if (vinylWebAnimation) {
      vinylWebAnimation.playbackRate = Math.max(0.25, rate);
    }
    if (vinylLabelSpeed) {
      vinylLabelSpeed.textContent = Math.round(33 * rate) + ' RPM';
    }
  }


  // ==================== REFINED BEAT-REACTIVE MUSICAL NOTES ENGINE ====================
  const vinylNotesCanvas = document.getElementById('vinyl-notes-canvas');
  let canvasCtx = null;
  if (vinylNotesCanvas) {
    canvasCtx = vinylNotesCanvas.getContext('2d');
  }

  // Pure Vector Drawing Functions (100% Solid & Never Clipped)
  function drawQuaver(ctx, size) {
    // Single Eighth note ♪
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.46, size * 0.32, -0.38, 0, Math.PI * 2);
    ctx.fill();

    const sx = size * 0.34;
    const sh = size * 1.35;
    const sw = Math.max(1.8, size * 0.08);
    ctx.fillRect(sx, -sh, sw, sh);

    ctx.beginPath();
    ctx.moveTo(sx + sw, -sh);
    ctx.bezierCurveTo(sx + size * 0.75, -sh * 0.65, sx + size * 0.7, -sh * 0.25, sx + size * 0.22, -sh * 0.1);
    ctx.bezierCurveTo(sx + size * 0.5, -sh * 0.35, sx + size * 0.52, -sh * 0.7, sx + sw, -sh * 0.82);
    ctx.closePath();
    ctx.fill();
  }

  function drawBeamNotes(ctx, size) {
    // Double Beamed notes ♫
    const span = size * 1.15;
    const sh = size * 1.35;
    const sw = Math.max(1.8, size * 0.08);

    ctx.beginPath();
    ctx.ellipse(-span / 2, 0, size * 0.44, size * 0.32, -0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(span / 2, -size * 0.12, size * 0.44, size * 0.32, -0.38, 0, Math.PI * 2);
    ctx.fill();

    const lx = -span / 2 + size * 0.34;
    ctx.fillRect(lx, -sh, sw, sh);

    const rx = span / 2 + size * 0.34;
    const rTop = -sh - size * 0.12;
    ctx.fillRect(rx, rTop, sw, sh);

    const bw = size * 0.26;
    ctx.beginPath();
    ctx.moveTo(lx, -sh);
    ctx.lineTo(rx + sw, rTop);
    ctx.lineTo(rx + sw, rTop + bw);
    ctx.lineTo(lx, -sh + bw);
    ctx.closePath();
    ctx.fill();
  }

  function drawCrotchet(ctx, size) {
    // Single Quarter note ♩
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.46, size * 0.32, -0.38, 0, Math.PI * 2);
    ctx.fill();

    const sx = size * 0.34;
    const sh = size * 1.35;
    const sw = Math.max(1.8, size * 0.08);
    ctx.fillRect(sx, -sh, sw, sh);
  }

  function drawSemiquaver(ctx, size) {
    // Sixteenth note ♬ (Quaver with double flag)
    drawQuaver(ctx, size);
    const sx = size * 0.34;
    const sh = size * 1.35;
    const sw = Math.max(1.8, size * 0.08);

    ctx.beginPath();
    ctx.moveTo(sx + sw, -sh * 0.72);
    ctx.bezierCurveTo(sx + size * 0.72, -sh * 0.45, sx + size * 0.65, -sh * 0.1, sx + size * 0.22, 0);
    ctx.bezierCurveTo(sx + size * 0.48, -sh * 0.2, sx + size * 0.5, -sh * 0.5, sx + sw, -sh * 0.58);
    ctx.closePath();
    ctx.fill();
  }

  function drawTrebleClef(ctx, size) {
    // Classical Treble Clef 𝄞
    ctx.save();
    ctx.scale(size * 0.026, size * 0.026);
    ctx.translate(0, -10);

    // Bottom decorative pearl ball
    ctx.beginPath();
    ctx.arc(0, 34, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Ornate G-clef spine & curves
    ctx.beginPath();
    ctx.moveTo(0, 34);
    ctx.bezierCurveTo(-0.5, 24, 3.5, 16, 5, 10);
    ctx.bezierCurveTo(12, -6, 12, -22, 2, -32);
    ctx.bezierCurveTo(-6, -42, -15, -32, -15, -16);
    ctx.bezierCurveTo(-15, 2, 4, 14, 4, 22);
    ctx.bezierCurveTo(4, 27, -1, 32, -6, 32);
    ctx.bezierCurveTo(-14, 32, -18, 24, -18, 16);
    ctx.bezierCurveTo(-18, 8, -12, 2, -6, 2);
    ctx.bezierCurveTo(0, 2, 5, 8, 5, 14);
    ctx.bezierCurveTo(5, 18, 1, 21, -2, 21);
    ctx.bezierCurveTo(-5, 21, -8, 18, -8, 15);

    ctx.lineWidth = 3.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();

    ctx.restore();
  }

  function drawSharp(ctx, size) {
    // Music Sharp ♯
    const h = size * 1.1;
    const w = size * 0.65;
    const barW = Math.max(1.6, size * 0.08);
    const crossH = Math.max(2.2, size * 0.12);

    ctx.fillRect(-w * 0.28, -h / 2, barW, h);
    ctx.fillRect(w * 0.28 - barW, -h / 2, barW, h);

    ctx.beginPath();
    ctx.moveTo(-w / 2, -h * 0.15);
    ctx.lineTo(w / 2, -h * 0.32);
    ctx.lineTo(w / 2, -h * 0.32 + crossH);
    ctx.lineTo(-w / 2, -h * 0.15 + crossH);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-w / 2, h * 0.28);
    ctx.lineTo(w / 2, h * 0.12);
    ctx.lineTo(w / 2, h * 0.12 + crossH);
    ctx.lineTo(-w / 2, h * 0.28 + crossH);
    ctx.closePath();
    ctx.fill();
  }

  function drawFlat(ctx, size) {
    // Music Flat ♭
    const h = size * 1.35;
    const barW = Math.max(1.8, size * 0.08);

    ctx.fillRect(-size * 0.25, -h * 0.72, barW, h * 0.72);

    ctx.beginPath();
    ctx.moveTo(-size * 0.25, 0);
    ctx.bezierCurveTo(size * 0.35, 0, size * 0.42, -size * 0.48, -size * 0.25, -size * 0.62);
    ctx.lineTo(-size * 0.25, -size * 0.46);
    ctx.bezierCurveTo(size * 0.18, -size * 0.36, size * 0.14, -size * 0.12, -size * 0.25, -size * 0.12);
    ctx.closePath();
    ctx.fill();
  }

  function drawSparkle(ctx, size) {
    // ✦ Sparkle
    const r = size * 0.65;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, -r * 0.2, r * 0.8, 0);
    ctx.quadraticCurveTo(0, r * 0.2, 0, r);
    ctx.quadraticCurveTo(0, r * 0.2, -r * 0.8, 0);
    ctx.quadraticCurveTo(0, -r * 0.2, 0, -r);
    ctx.closePath();
    ctx.fill();
  }

  // Vela Color Palette
  const NOTE_COLORS_BASS = ['#E5A890', '#C4846C', '#D4957D', '#E2977E'];
  const NOTE_COLORS_MID = ['#F2ECE7', '#EBD8D0', '#F7E7DF', '#E2D1C8'];
  const NOTE_COLORS_TREBLE = ['#F7E7DF', '#F2ECE7', '#DECEC6'];

  let activeNotesList = [];
  let particleAnimRaf = null;
  let lastParticleFrameTime = 0;

  // Web Audio Context & Multi-Band Analyser
  let audioContextObj = null;
  let audioAnalyserObj = null;
  let audioSrcNodeObj = null;
  let freqDataArray = null;
  let isAudioConnectedToVideo = false;

  // Dynamic Multi-Band Beat Tracking State
  let bassRollingAvg = 0.05;
  let snareRollingAvg = 0.04;
  let trebleRollingAvg = 0.03;
  let prevBassEnergy = 0;
  let prevSnareEnergy = 0;
  let prevTrebleEnergy = 0;

  let lastKickTriggerTime = 0;
  let lastSnareTriggerTime = 0;
  let lastTrebleTriggerTime = 0;
  let lastAmbientSpawnTime = 0;

  // Real-Time BPM Detection Engine
  let beatTimestampsList = [];
  let liveDetectedBpm = 0;
  let currentLoadedDetails = null;

  function recordBeatTimestamp(timestamp) {
    beatTimestampsList.push(timestamp);
    const cutoff = timestamp - 8000;
    beatTimestampsList = beatTimestampsList.filter(t => t > cutoff);

    if (beatTimestampsList.length >= 4) {
      const intervals = [];
      for (let i = 1; i < beatTimestampsList.length; i++) {
        const diff = beatTimestampsList[i] - beatTimestampsList[i - 1];
        if (diff >= 220 && diff <= 1200) {
          intervals.push(diff);
        }
      }
      if (intervals.length >= 3) {
        intervals.sort((a, b) => a - b);
        const medianInterval = intervals[Math.floor(intervals.length / 2)];
        let calculated = Math.round(60000 / medianInterval);
        while (calculated < 65) calculated *= 2;
        while (calculated > 185) calculated = Math.round(calculated / 2);

        if (liveDetectedBpm === 0) {
          liveDetectedBpm = calculated;
        } else {
          liveDetectedBpm = Math.round(liveDetectedBpm * 0.75 + calculated * 0.25);
        }

        if (infoValBpm && (!currentLoadedDetails || !currentLoadedDetails.bpm)) {
          infoValBpm.textContent = `${liveDetectedBpm} BPM (Live)`;
        }
      }
    }
  }

  function initWebAudioAnalyser() {
    if (isAudioConnectedToVideo || !mainVideo) {
      if (audioContextObj && audioContextObj.state === 'suspended') {
        audioContextObj.resume().catch(() => {});
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContextObj = new AudioCtx();
      audioSrcNodeObj = audioContextObj.createMediaElementSource(mainVideo);
      audioAnalyserObj = audioContextObj.createAnalyser();
      audioAnalyserObj.fftSize = 512;
      audioAnalyserObj.smoothingTimeConstant = 0.40; // Low smoothing for frame-accurate zero-lag transients
      audioSrcNodeObj.connect(audioAnalyserObj);
      audioAnalyserObj.connect(audioContextObj.destination);
      freqDataArray = new Uint8Array(audioAnalyserObj.frequencyBinCount);
      isAudioConnectedToVideo = true;
    } catch (e) {
      console.warn('Web Audio initialization note:', e);
    }
  }

  function resizeVinylCanvas() {
    if (!vinylNotesCanvas || !audioVinylStage) return;
    const rect = audioVinylStage.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    vinylNotesCanvas.width = rect.width * dpr;
    vinylNotesCanvas.height = rect.height * dpr;
    if (canvasCtx) {
      canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
      canvasCtx.scale(dpr, dpr);
    }
  }

  window.addEventListener('resize', resizeVinylCanvas);

  function spawnNoteParticle(intensityType = 'light', energy = 0.5, forcedAngle = null) {
    if (!turntableDeck || !vinylNotesCanvas || !audioVinylStage) return;

    // Up to 26 active particles for lively musical flow without clutter
    if (activeNotesList.length >= 26) {
      if (intensityType === 'heavy' && activeNotesList.length > 0) {
        // Priority to impactful beats
        activeNotesList.shift();
      } else {
        return;
      }
    }

    const stageRect = audioVinylStage.getBoundingClientRect();
    const deckRect = turntableDeck.getBoundingClientRect();
    if (stageRect.width === 0 || deckRect.width === 0) return;

    const centerX = (deckRect.left + deckRect.width / 2) - stageRect.left;
    const centerY = (deckRect.top + deckRect.height / 2) - stageRect.top;
    const radius = (deckRect.width / 2) * 0.94;

    // 360-degree radial dispersion around the vinyl rim
    const angle = (forcedAngle !== null && forcedAngle !== undefined) ? forcedAngle : (Math.random() * Math.PI * 2);
    const startX = centerX + Math.cos(angle) * radius;
    const startY = centerY + Math.sin(angle) * radius;

    // Outward radial unit vector
    const radX = Math.cos(angle);
    const radY = Math.sin(angle);

    // Twister tangential vortex component (spirals smoothly around the circular rim)
    const swirlStrength = 0.28; // subtle twister spiral curve
    const tanX = -Math.sin(angle);
    const tanY = Math.cos(angle);

    // Combined launch vector (strictly normalized)
    const rawVx = radX + tanX * swirlStrength;
    const rawVy = radY + tanY * swirlStrength;
    const dirLen = Math.hypot(rawVx, rawVy) || 1;
    const dirX = rawVx / dirLen;
    const dirY = rawVy / dirLen;

    let type = 'quaver';
    let color = NOTE_COLORS_TREBLE[0];
    let size = 10;
    let maxLife = 1.0;
    let burstSpeed = 3.0;
    let driftSpeed = 0.25;
    let upwardFloat = 0.22;
    let baseRotSpeed = (Math.random() - 0.5) * 0.04;
    let burstRotSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.08;

    if (intensityType === 'heavy') {
      // ===== HEAVY STRONG BEAT: CONTROLLED RADIAL BURST -> FAST BRAKE -> EARLY FADE =====
      const r = Math.random();
      if (r < 0.45) type = 'treble_clef';
      else if (r < 0.8) type = 'beam_notes';
      else type = 'semiquaver';

      color = NOTE_COLORS_BASS[Math.floor(Math.random() * NOTE_COLORS_BASS.length)];
      size = 18 + Math.min(energy, 1.0) * 5; // 18px to 23px (crisp, sleek proportions)
      maxLife = 1.15 + Math.random() * 0.25; // 1.15s to 1.4s (disappears quickly!)

      // Controlled velocity: punchy initial pop, tight dispersion boundary
      burstSpeed = 8.5 + Math.min(energy, 1.0) * 5.0; // 8.5 to 13.5 px/frame
      driftSpeed = 0.30 + Math.random() * 0.20; // 0.30 to 0.50 px/frame
      upwardFloat = 0.28;
      burstRotSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.16 + Math.random() * 0.10);
    } else if (intensityType === 'mid') {
      // ===== MID BEAT / SNARE / CLAP: MEDIUM TIGHT BURST =====
      const r = Math.random();
      if (r < 0.45) type = 'beam_notes';
      else if (r < 0.75) type = 'crotchet';
      else type = 'quaver';

      color = NOTE_COLORS_MID[Math.floor(Math.random() * NOTE_COLORS_MID.length)];
      size = 12.5 + Math.min(energy, 1.0) * 3.0; // 12.5px to 15.5px
      maxLife = 0.90 + Math.random() * 0.20; // 0.90s to 1.1s

      // Snappy compact burst
      burstSpeed = 5.0 + Math.min(energy, 1.0) * 3.0; // 5.0 to 8.0 px/frame
      driftSpeed = 0.22 + Math.random() * 0.15;
      upwardFloat = 0.20;
      burstRotSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.08 + Math.random() * 0.06);
    } else {
      // ===== LIGHT BEAT / HI-HAT / CHILL TAP: DELICATE CLOSE DRIFT =====
      const r = Math.random();
      if (r < 0.35) type = 'quaver';
      else if (r < 0.6) type = 'flat';
      else if (r < 0.8) type = 'sharp';
      else type = 'sparkle';

      color = NOTE_COLORS_TREBLE[Math.floor(Math.random() * NOTE_COLORS_TREBLE.length)];
      size = 8.0 + Math.min(energy, 1.0) * 2.0; // 8.0px to 10px
      maxLife = 0.65 + Math.random() * 0.15; // 0.65s to 0.80s

      // Soft delicate launch
      burstSpeed = 2.2 + Math.min(energy, 1.0) * 1.5; // 2.2 to 3.7 px/frame
      driftSpeed = 0.15 + Math.random() * 0.10;
      upwardFloat = 0.15;
      burstRotSpeed = (Math.random() - 0.5) * 0.04;
    }

    activeNotesList.push({
      x: startX,
      y: startY,
      startX_center: centerX,
      startY_center: centerY,
      vinylRadius: radius,
      dirX,
      dirY,
      burstSpeed,
      driftSpeed,
      upwardFloat,
      intensityType,
      type,
      size,
      color,
      maxLife,
      age: 0,
      rotation: Math.random() * Math.PI * 2,
      baseRotSpeed,
      burstRotSpeed,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 1.5 + Math.random() * 1.5,
      swayAmp: intensityType === 'heavy' ? 0.35 : 0.20
    });
  }

  function renderVisualizerFrame(timestamp) {
    if (!lastParticleFrameTime) lastParticleFrameTime = timestamp;
    const dt = Math.min((timestamp - lastParticleFrameTime) / 1000, 0.05);
    lastParticleFrameTime = timestamp;

    const currentSpeedRate = currentSpeedVal || 1.0;
    const now = performance.now();

    // Check Audio Spectrum if playing
    if (isCurrentMediaAudio && !mainVideo.paused && audioVinylStage && audioVinylStage.style.display !== 'none') {
      if (audioContextObj && audioContextObj.state === 'suspended') {
        audioContextObj.resume().catch(() => {});
      }

      if (audioAnalyserObj && freqDataArray) {
        audioAnalyserObj.getByteFrequencyData(freqDataArray);

        // Band 1: Bass / Sub-kick (Bins 1 - 4 -> ~40Hz to ~380Hz)
        let bSum = 0;
        for (let i = 1; i <= 4; i++) bSum += freqDataArray[i];
        const bassLevel = bSum / (4 * 255);

        // Band 2: Mid / Snare / Clap (Bins 10 - 28 -> ~950Hz to ~2600Hz)
        let sSum = 0;
        for (let i = 10; i <= 28; i++) sSum += freqDataArray[i];
        const snareLevel = sSum / (19 * 255);

        // Band 3: Treble / Hi-Hats / Crisp Percussion (Bins 35 - 100 -> ~3300Hz to ~9500Hz)
        let tSum = 0;
        for (let i = 35; i <= 100; i++) tSum += freqDataArray[i];
        const trebleLevel = tSum / (66 * 255);

        // Instantaneous Attack Spectral Flux (Frame-to-Frame Delta for Frame-Accurate Sync)
        const bassFlux = Math.max(0, bassLevel - prevBassEnergy);
        const snareFlux = Math.max(0, snareLevel - prevSnareEnergy);
        const trebleFlux = Math.max(0, trebleLevel - prevTrebleEnergy);

        prevBassEnergy = bassLevel;
        prevSnareEnergy = snareLevel;
        prevTrebleEnergy = trebleLevel;

        // Dynamic running averages (adapts dynamically to track volume & mastering)
        bassRollingAvg = bassRollingAvg * 0.88 + bassLevel * 0.12;
        snareRollingAvg = snareRollingAvg * 0.88 + snareLevel * 0.12;
        trebleRollingAvg = trebleRollingAvg * 0.90 + trebleLevel * 0.10;

        const kickThreshold = Math.max(0.035, bassRollingAvg * 1.18 + 0.015);
        const snareThreshold = Math.max(0.028, snareRollingAvg * 1.22 + 0.012);
        const trebleThreshold = Math.max(0.018, trebleRollingAvg * 1.25 + 0.010);

        // 1) Bass / Kick Attack Trigger
        if ((bassFlux > 0.035 || bassLevel > kickThreshold) && (now - lastKickTriggerTime > 135)) {
          lastKickTriggerTime = now;
          recordBeatTimestamp(now);

          // Categorize: HEAVY STRONG BEAT vs LIGHT / SINGLE BEAT
          const isHeavy = (bassLevel > 0.30 || bassFlux > 0.07 || bassLevel > bassRollingAvg * 1.55);
          if (isHeavy) {
            // STRONG BEAT -> CONTROLLED 360 RADIAL BURST
            const energyNorm = Math.min(1.0, (bassLevel - kickThreshold) / Math.max(0.06, bassRollingAvg) * 0.8 + bassFlux * 2.5);
            // Spawn 1 to 2 particles around 360 circle
            const burstCount = energyNorm > 0.65 ? 2 : 1;
            const baseAngle = Math.random() * Math.PI * 2;
            for (let b = 0; b < burstCount; b++) {
              const ang = baseAngle + (b * (Math.PI * 2 / burstCount)) + (Math.random() - 0.5) * 0.4;
              spawnNoteParticle('heavy', Math.max(0.65, energyNorm), ang);
            }
          } else {
            // LIGHT BEAT OR SINGLE BEAT -> SOFT SINGLE NOTE
            const energyNorm = Math.min(1.0, bassLevel / 0.28);
            spawnNoteParticle('light', energyNorm);
          }
        }

        // 2) Snare / Clap Hit Trigger
        if ((snareFlux > 0.03 || snareLevel > snareThreshold) && (now - lastSnareTriggerTime > 115)) {
          lastSnareTriggerTime = now;
          const isHardSnare = (snareLevel > 0.26 || snareFlux > 0.06);
          if (isHardSnare) {
            const snareEnergy = Math.min(1.0, (snareLevel - snareThreshold) / Math.max(0.04, snareRollingAvg) * 0.8 + 0.3);
            spawnNoteParticle('mid', snareEnergy);
          } else {
            // Light snare tap -> tiny note
            spawnNoteParticle('light', Math.min(1.0, snareLevel * 2.0));
          }
        }

        // 3) Treble / Hi-Hat Tap Trigger
        if ((trebleFlux > 0.02 || trebleLevel > trebleThreshold) && (now - lastTrebleTriggerTime > 85)) {
          lastTrebleTriggerTime = now;
          const trebleEnergy = Math.min(1.0, (trebleLevel - trebleThreshold) / Math.max(0.03, trebleRollingAvg) * 0.8 + 0.2);
          spawnNoteParticle('light', trebleEnergy);
        }
      }

      // Soft ambient flow fallback (in case audio has an ultra-quiet breakdown)
      if (now - lastAmbientSpawnTime > 1300 && activeNotesList.length < 2) {
        lastAmbientSpawnTime = now;
        spawnNoteParticle('light', 0.2);
      }
    }

    // Clear Canvas
    if (vinylNotesCanvas && canvasCtx) {
      canvasCtx.clearRect(0, 0, vinylNotesCanvas.width, vinylNotesCanvas.height);

      // Compute right boundary guard to strictly protect the album cover & lyrics card
      let cardLeftBoundary = 999999;
      if (audioTrackCard && audioVinylStage) {
        const stageBox = audioVinylStage.getBoundingClientRect();
        const cardBox = audioTrackCard.getBoundingClientRect();
        if (cardBox.width > 0 && cardBox.left > stageBox.left) {
          cardLeftBoundary = (cardBox.left - stageBox.left) - 15; // 15px safe barrier before card begins
        }
      }

      // Update & Draw Particles
      for (let i = activeNotesList.length - 1; i >= 0; i--) {
        const p = activeNotesList[i];
        p.age += dt * currentSpeedRate;
        const progress = p.age / p.maxLife;

        if (progress >= 1) {
          activeNotesList.splice(i, 1);
          continue;
        }

        // 1. Trap / Twister Rapid Braking Deceleration:
        // Snappy aerodynamic braking (-11.5 rate), settling tightly into gentle drift
        let currentSpeed = p.driftSpeed;
        if (p.age < 0.35) {
          currentSpeed = p.driftSpeed + (p.burstSpeed - p.driftSpeed) * Math.exp(-11.5 * p.age);
        }

        // Move radially outwards along twister launch vector
        p.x += p.dirX * currentSpeed * dt * 60;
        p.y += p.dirY * currentSpeed * dt * 60;

        // Gentle upward buoyancy takes over as speed settles
        if (p.age > 0.10) {
          const floatBlend = Math.min(1.0, (p.age - 0.10) / 0.25);
          p.y -= p.upwardFloat * floatBlend * dt * 60;
          // Subtle horizontal breeze
          p.x += Math.sin(p.age * p.swaySpeed + p.swayOffset) * p.swayAmp * floatBlend * dt * 60;
        }

        // Dynamic twister spin: snappy spin on launch, settling into smooth slow rotation
        const currentRotSpeed = p.baseRotSpeed + p.burstRotSpeed * Math.exp(-8.5 * p.age);
        p.rotation += currentRotSpeed * dt * 60;

        // 2. Opacity Curve: Smooth ease in -> fully visible -> early smooth fade out ('تختفي بدري')
        let alpha = 0;
        if (progress < 0.10) {
          alpha = progress / 0.10;
        } else if (progress > 0.45) {
          // Begins fading out early at 45% of its lifespan so it never lingers
          alpha = Math.max(0, 1 - (progress - 0.45) / 0.55);
        } else {
          alpha = 1;
        }

        // 3. Card Boundary Guard (Guarantee notes NEVER touch or cover album art or lyrics):
        if (p.x > cardLeftBoundary - 35) {
          const cardFade = Math.max(0, (cardLeftBoundary - p.x) / 35);
          alpha *= cardFade;
        }

        // 4. Radial Distance Guard: Keep notes orbiting within a compact ~1.36x vinyl radius
        const distFromCenter = Math.hypot(p.x - p.startX_center, p.y - p.startY_center);
        const maxOrbitDist = p.vinylRadius * 1.36;
        if (distFromCenter > p.vinylRadius * 1.08) {
          const orbitFade = Math.max(0, 1 - (distFromCenter - p.vinylRadius * 1.08) / (maxOrbitDist - p.vinylRadius * 1.08));
          alpha *= orbitFade;
        }

        // Cull immediately if faded out
        if (alpha <= 0.01) {
          activeNotesList.splice(i, 1);
          continue;
        }

        alpha = Math.max(0, Math.min(1, alpha));

        // Scale Curve: CRISP AND STABLE - ZERO SIZE PULSING!
        let scaleFactor = 1.0;
        if (progress < 0.08) {
          scaleFactor = 0.75 + 0.25 * (progress / 0.08);
        } else if (progress > 0.82) {
          scaleFactor = 1.0 - 0.25 * ((progress - 0.82) / 0.18);
        }

        // Render with warm static glow tailored to beat intensity
        canvasCtx.save();
        canvasCtx.translate(p.x, p.y);
        canvasCtx.rotate(p.rotation);
        canvasCtx.scale(scaleFactor, scaleFactor);
        canvasCtx.globalAlpha = alpha * (p.intensityType === 'heavy' ? 0.98 : (p.intensityType === 'mid' ? 0.90 : 0.82));
        canvasCtx.fillStyle = p.color;

        if (p.intensityType === 'heavy') {
          canvasCtx.shadowColor = 'rgba(196, 132, 108, 0.75)';
          canvasCtx.shadowBlur = 11;
        } else if (p.intensityType === 'mid') {
          canvasCtx.shadowColor = 'rgba(229, 168, 144, 0.40)';
          canvasCtx.shadowBlur = 6;
        } else {
          canvasCtx.shadowColor = 'rgba(242, 236, 231, 0.20)';
          canvasCtx.shadowBlur = 3;
        }

        // Render the exact clean vector symbol
        if (p.type === 'treble_clef') {
          drawTrebleClef(canvasCtx, p.size);
        } else if (p.type === 'beam_notes') {
          drawBeamNotes(canvasCtx, p.size);
        } else if (p.type === 'crotchet') {
          drawCrotchet(canvasCtx, p.size);
        } else if (p.type === 'semiquaver') {
          drawSemiquaver(canvasCtx, p.size);
        } else if (p.type === 'sharp') {
          drawSharp(canvasCtx, p.size);
        } else if (p.type === 'flat') {
          drawFlat(canvasCtx, p.size);
        } else if (p.type === 'sparkle') {
          drawSparkle(canvasCtx, p.size);
        } else {
          drawQuaver(canvasCtx, p.size);
        }

        canvasCtx.restore();
      }
    }

    // Continue loop
    particleAnimRaf = requestAnimationFrame(renderVisualizerFrame);
  }

  function startParticleVisualizer() {
    initWebAudioAnalyser();
    resizeVinylCanvas();
    if (!particleAnimRaf) {
      lastParticleFrameTime = performance.now();
      particleAnimRaf = requestAnimationFrame(renderVisualizerFrame);
    }
  }

  function stopParticleVisualizer() {
    if (particleAnimRaf) {
      cancelAnimationFrame(particleAnimRaf);
      particleAnimRaf = null;
    }
    if (canvasCtx && vinylNotesCanvas) {
      canvasCtx.clearRect(0, 0, vinylNotesCanvas.width, vinylNotesCanvas.height);
    }
    activeNotesList = [];
    beatTimestampsList = [];
    liveDetectedBpm = 0;
    prevBassEnergy = 0;
    prevSnareEnergy = 0;
    prevTrebleEnergy = 0;
  }

  // State
  let currentFilePath = '';
  let folderPlaylist = [];
  let playlistIndex = -1;
  let isNavigatingVideo = false;
  let isDraggingVideo = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDistanceX = 0;
  let hasTriggeredSwipe = false;
  let isTrimMode = false;
  let controlsHideTimer = null;

  // Trim State
  let trimStartSec = 0;
  let trimEndSec = 10;
  let isPreviewingTrim = false;
  let activeDraggingHandle = null; // 'left' | 'right' | null
  let trimLoopRaf = null;

  function resetToTrimStart() {
    if (!mainVideo) return;
    mainVideo.currentTime = trimStartSec;
    const dur = mainVideo.duration || 10;
    const pct = Math.max(0, Math.min(100, (trimStartSec / dur) * 100));
    if (trimPlayhead) trimPlayhead.style.left = `${pct}%`;
    if (trimFloatingBadge) trimFloatingBadge.textContent = formatTime(trimStartSec, true);
  }

  function checkTrimLoop() {
    if (isTrimMode && !mainVideo.paused) {
      if (mainVideo.currentTime >= trimEndSec) {
        resetToTrimStart();
      }
      trimLoopRaf = requestAnimationFrame(checkTrimLoop);
    }
  }

  function startTrimLoopMonitor() {
    if (trimLoopRaf) cancelAnimationFrame(trimLoopRaf);
    trimLoopRaf = requestAnimationFrame(checkTrimLoop);
  }

  function stopTrimLoopMonitor() {
    if (trimLoopRaf) {
      cancelAnimationFrame(trimLoopRaf);
      trimLoopRaf = null;
    }
  }

  // Helpers
  function formatTime(sec, showMillis = false) {
    if (isNaN(sec) || sec < 0) sec = 0;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);

    let base = '';
    if (h > 0) {
      base = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else {
      base = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    if (showMillis) {
      return `${base}.${ms.toString().padStart(2, '0')}`;
    }
    return base;
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Window Controls (Borderless)
  const winMinBtn = document.getElementById('win-min-btn');
  const winMaxBtn = document.getElementById('win-max-btn');
  const winCloseBtn = document.getElementById('win-close-btn');
  const appTopBar = document.getElementById('app-top-bar');
  const playRipple = document.getElementById('play-ripple');
  const rippleIcon = document.getElementById('ripple-icon');

  if (winMinBtn) {
    winMinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.velaAPI && window.velaAPI.minimize) {
        window.velaAPI.minimize();
      }
    });
  }
  if (winMaxBtn) {
    winMaxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.velaAPI && window.velaAPI.maximize) {
        window.velaAPI.maximize();
      }
    });
  }
  if (winCloseBtn) {
    winCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.velaAPI && window.velaAPI.close) {
        window.velaAPI.close();
      }
    });
  }

  // Double-click top bar to maximize / restore
  if (appTopBar) {
    appTopBar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.win-btn') || e.target.closest('button') || e.target.closest('#brand-pill')) return;
      if (window.velaAPI && window.velaAPI.maximize) {
        window.velaAPI.maximize();
      }
    });
  }

  function triggerRipple(isPlaying) {
    if (!playRipple || !rippleIcon) return;
    if (isPlaying) {
      rippleIcon.innerHTML = '<path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"></path>';
    } else {
      rippleIcon.innerHTML = '<path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"></path>';
    }
    playRipple.classList.add('pop');
    setTimeout(() => playRipple.classList.remove('pop'), 350);
  }

  // Volume state & UI synchronization
  let lastNonZeroVolume = 0.25;

  function updateVolumeUI() {
    const isMuted = mainVideo.muted || mainVideo.volume === 0;
    const currentVol = isMuted ? 0 : mainVideo.volume;

    if (volumeSlider) {
      volumeSlider.value = currentVol;
    }
    if (trimVolumeSlider) {
      trimVolumeSlider.value = currentVol;
    }

    const displayPct = isMuted ? 0 : Math.round(mainVideo.volume * 100);
    if (volumeValLabel) {
      volumeValLabel.textContent = `${displayPct}%`;
      if (isMuted) {
        volumeValLabel.classList.add('muted');
      } else {
        volumeValLabel.classList.remove('muted');
      }
    }
    if (trimVolumeValLabel) {
      trimVolumeValLabel.textContent = `${displayPct}%`;
      if (isMuted) {
        trimVolumeValLabel.classList.add('muted');
      } else {
        trimVolumeValLabel.classList.remove('muted');
      }
    }

    let activeSvg = '';
    if (isMuted) {
      activeSvg = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    } else if (mainVideo.volume < 0.5) {
      activeSvg = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    } else {
      activeSvg = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    }

    if (volumeIcon) volumeIcon.innerHTML = activeSvg;
    if (trimVolumeIcon) trimVolumeIcon.innerHTML = activeSvg;
  }

  function toggleMute() {
    if (mainVideo.muted || mainVideo.volume === 0) {
      mainVideo.muted = false;
      mainVideo.volume = lastNonZeroVolume > 0 ? lastNonZeroVolume : 0.25;
    } else {
      if (mainVideo.volume > 0) {
        lastNonZeroVolume = mainVideo.volume;
      }
      mainVideo.muted = true;
    }
    updateVolumeUI();
  }

  mainVideo.addEventListener('volumechange', updateVolumeUI);

  // Initial Volume
  mainVideo.volume = 0.25;
  updateVolumeUI();

  // ==================== SPOTIFY-STYLE SYNCHRONIZED LYRICS ENGINE ====================
  function parseLrcLyrics(lrcText) {
    if (!lrcText || typeof lrcText !== 'string') return [];
    const lines = lrcText.split('\n');
    const result = [];
    const lrcRegex = /^\[(\d{2}):(\d{2}(?:\.\d{1,3})?)\](.*)$/;

    for (let rawLine of lines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;
      if (/^\[[a-zA-Z]+:/.test(trimmed)) continue;

      const match = trimmed.match(lrcRegex);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseFloat(match[2]);
        const text = match[3].trim();
        if (text) {
          result.push({
            time: minutes * 60 + seconds,
            text
          });
        }
      }
    }

    result.sort((a, b) => a.time - b.time);
    return result;
  }

  function renderLyricsUI(lyricsData) {
    if (!lyricsScrollTrack) return;
    lyricsScrollTrack.innerHTML = '';
    currentActiveLyricIndex = -1;

    if (!lyricsData || !lyricsData.found || !lyricsData.lyrics) {
      lyricsScrollTrack.innerHTML = `
        <div class="lyrics-placeholder">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <span>Instrumental / No Lyrics Available</span>
        </div>
      `;
      currentParsedLyrics = [];
      return;
    }

    const parsed = parseLrcLyrics(lyricsData.lyrics);
    if (parsed.length > 0 && lyricsData.synced) {
      currentParsedLyrics = parsed;
      const frag = document.createDocumentFragment();

      parsed.forEach((item, index) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'lyrics-line';
        lineEl.textContent = item.text;
        lineEl.dataset.index = index.toString();
        lineEl.dataset.time = item.time.toString();

        lineEl.addEventListener('click', (e) => {
          e.stopPropagation();
          if (mainVideo) {
            mainVideo.currentTime = item.time;
            if (mainVideo.paused) {
              mainVideo.play().catch(() => {});
            }
          }
        });

        frag.appendChild(lineEl);
      });

      lyricsScrollTrack.appendChild(frag);
    } else {
      currentParsedLyrics = [];
      const plainLines = lyricsData.lyrics.split('\n').filter(l => l.trim().length > 0);
      const frag = document.createDocumentFragment();

      plainLines.forEach((text) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'lyrics-line';
        lineEl.style.opacity = '0.85';
        lineEl.style.color = '#F2ECE7';
        lineEl.style.cursor = 'default';
        lineEl.textContent = text.trim();
        frag.appendChild(lineEl);
      });

      lyricsScrollTrack.appendChild(frag);
    }
  }

  function updateLyricsSync(currentTime) {
    if (!currentParsedLyrics || currentParsedLyrics.length === 0) return;

    let activeIndex = -1;
    for (let i = 0; i < currentParsedLyrics.length; i++) {
      if (currentTime >= currentParsedLyrics[i].time - 0.22) {
        activeIndex = i;
      } else {
        break;
      }
    }

    if (activeIndex === currentActiveLyricIndex) return;
    currentActiveLyricIndex = activeIndex;

    const lineEls = lyricsScrollTrack ? lyricsScrollTrack.children : [];
    for (let i = 0; i < lineEls.length; i++) {
      const el = lineEls[i];
      if (i === activeIndex) {
        el.classList.add('active');
        el.classList.remove('passed');
        if (!isUserManuallyScrollingLyrics && audioLyricsContainer) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (i < activeIndex) {
        el.classList.remove('active');
        el.classList.add('passed');
      } else {
        el.classList.remove('active', 'passed');
      }
    }
  }

  async function loadLyricsForCurrentTrack(filePath, metaTitle, metaArtist, metaAlbum, duration) {
    if (!isCurrentMediaAudio) return;
    const trackId = `${filePath}_${metaTitle}_${metaArtist}`;
    currentLyricsTrackId = trackId;

    if (lyricsScrollTrack) {
      lyricsScrollTrack.innerHTML = `
        <div class="lyrics-placeholder">
          <span class="lyrics-loading-dot"></span>
          <span>Loading lyrics...</span>
        </div>
      `;
    }

    try {
      const result = await window.velaAPI.fetchLyrics({
        filePath,
        title: metaTitle,
        artist: metaArtist,
        album: metaAlbum,
        duration
      });

      if (currentLyricsTrackId !== trackId) return;
      renderLyricsUI(result);
    } catch (e) {
      if (currentLyricsTrackId !== trackId) return;
      renderLyricsUI({ found: false });
    }
  }

  if (audioLyricsContainer) {
    audioLyricsContainer.addEventListener('wheel', () => {
      isUserManuallyScrollingLyrics = true;
      clearTimeout(userScrollLyricsTimer);
      userScrollLyricsTimer = setTimeout(() => {
        isUserManuallyScrollingLyrics = false;
        if (lyricsScrollTrack && currentActiveLyricIndex >= 0) {
          const activeEl = lyricsScrollTrack.children[currentActiveLyricIndex];
          if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 3500);
    }, { passive: true });
  }

  // ==================== LOAD & PLAY MEDIA ====================
  async function loadVideo(filePath, autoPlay = false) {
    currentFilePath = filePath;
    currentLoadedDetails = null;
    beatTimestampsList = [];
    liveDetectedBpm = 0;
    const fileName = filePath.split(/[\\/]/).pop() || 'Media';
    headerFileName.textContent = fileName;
    bottomVideoTitle.textContent = fileName;

    isCurrentMediaAudio = checkIsAudioFile(filePath);
    if (infoValBpm) infoValBpm.textContent = isCurrentMediaAudio ? 'Detecting...' : '-';

    if (isCurrentMediaAudio) {
      if (mainVideo) mainVideo.style.display = 'none';
      if (audioVinylStage) {
        audioVinylStage.style.display = 'flex';
        requestAnimationFrame(() => {
          audioVinylStage.classList.add('active');
          resizeVinylCanvas();
        });
      }
      startParticleVisualizer();
      const pureBaseName = fileName.replace(/\.[^/.]+$/, '');
      if (audioMetaTitle) audioMetaTitle.textContent = pureBaseName;
      if (audioMetaDuration) audioMetaDuration.textContent = '0:00';
      if (audioMetaArtist) audioMetaArtist.textContent = 'Unknown Artist';
      if (audioAlbumRow) audioAlbumRow.style.display = 'none';
      if (audioCoverImg) audioCoverImg.style.display = 'none';
      if (audioCoverFallback) audioCoverFallback.style.display = 'flex';
      updateVinylSpeed(currentSpeedVal || 1.0);
      loadLyricsForCurrentTrack(filePath, pureBaseName, '', '', 0);
    } else {
      if (mainVideo) mainVideo.style.display = 'block';
      if (audioVinylStage) {
        audioVinylStage.classList.remove('active');
        audioVinylStage.style.display = 'none';
      }
      stopParticleVisualizer();
      currentLyricsTrackId = '';
      currentParsedLyrics = [];
      if (lyricsScrollTrack) lyricsScrollTrack.innerHTML = '';
    }

    emptyDropZone.style.display = 'none';
    if (window.velaAPI && window.velaAPI.pathToFileURL) {
      mainVideo.src = window.velaAPI.pathToFileURL(filePath);
    } else {
      const normalized = filePath.replace(/\\/g, '/');
      const parts = normalized.split('/').map(part => {
        if (/^[a-zA-Z]:$/.test(part)) return part;
        return encodeURIComponent(part);
      });
      mainVideo.src = 'file:///' + (parts[0] === '' ? parts.slice(1) : parts).join('/');
    }
    mainVideo.load();
    if (autoPlay) {
      mainVideo.play().catch(() => {});
    } else {
      mainVideo.pause();
    }
    updatePlayPauseIcons();
    updateVinylAnimationState();
    resetControlsTimer();

    // Fetch deep metadata (ffprobe & tags & cover art)
    try {
      window.velaAPI.getFileDetails(filePath).then(details => {
        if (!details || currentFilePath !== filePath) return;
        currentLoadedDetails = details;
        if (details.bpm && infoValBpm) {
          infoValBpm.textContent = `${details.bpm} BPM`;
        }
        if (details.isAudio || isCurrentMediaAudio) {
          isCurrentMediaAudio = true;
          if (mainVideo) mainVideo.style.display = 'none';
          if (audioVinylStage) {
            audioVinylStage.style.display = 'flex';
            audioVinylStage.classList.add('active');
          }
          if (audioMetaTitle) audioMetaTitle.textContent = details.title || fileName.replace(/\.[^/.]+$/, '');
          if (audioMetaDuration && details.durationFormatted) audioMetaDuration.textContent = details.durationFormatted;
          if (audioMetaArtist) audioMetaArtist.textContent = details.artist || 'Unknown Artist';
          if (details.album) {
            if (audioMetaAlbum) audioMetaAlbum.textContent = `Album: ${details.album}`;
            if (audioAlbumRow) audioAlbumRow.style.display = 'block';
          } else {
            if (audioAlbumRow) audioAlbumRow.style.display = 'none';
          }

          if (details.coverArt) {
            if (audioCoverImg) {
              audioCoverImg.src = details.coverArt;
              audioCoverImg.style.display = 'block';
            }
            if (audioCoverFallback) audioCoverFallback.style.display = 'none';
          } else {
            if (audioCoverImg) audioCoverImg.style.display = 'none';
            if (audioCoverFallback) audioCoverFallback.style.display = 'flex';
          }
          loadLyricsForCurrentTrack(
            filePath,
            details.title || fileName.replace(/\.[^/.]+$/, ''),
            details.artist || '',
            details.album || '',
            details.duration || 0
          );
        }
        if (sideInfoDrawer && sideInfoDrawer.classList.contains('open')) {
          updateInfoDrawer();
        }
      }).catch(() => {});
    } catch (e) {}

    if (sideInfoDrawer && sideInfoDrawer.classList.contains('open')) {
      updateInfoDrawer();
    }

    // Query folder siblings for playlist navigation
    try {
      const res = await window.velaAPI.getSiblingVideos(filePath);
      if (res && res.files && res.files.length > 0) {
        folderPlaylist = res.files;
        playlistIndex = res.currentIndex >= 0 ? res.currentIndex : folderPlaylist.indexOf(filePath);
      } else {
        folderPlaylist = [filePath];
        playlistIndex = 0;
      }
    } catch (err) {
      folderPlaylist = [filePath];
      playlistIndex = 0;
    }
    updateNavChevrons();
  }

  function updateNavChevrons() {
    if (!navPrevBtn || !navNextBtn) return;
    if (folderPlaylist.length <= 1) {
      navPrevBtn.style.display = 'none';
      navNextBtn.style.display = 'none';
    } else {
      navPrevBtn.style.display = 'flex';
      navNextBtn.style.display = 'flex';
    }
  }

  async function navigateVideo(targetIndex, direction = 'right') {
    if (folderPlaylist.length <= 1 || isNavigatingVideo) return;
    if (targetIndex < 0) {
      targetIndex = (targetIndex + folderPlaylist.length) % folderPlaylist.length;
    } else if (targetIndex >= folderPlaylist.length) {
      targetIndex = targetIndex % folderPlaylist.length;
    }

    const nextPath = folderPlaylist[targetIndex];
    if (!nextPath) return;

    isNavigatingVideo = true;
    playlistIndex = targetIndex;
    const nextName = nextPath.split(/[\\/]/).pop() || 'Next Video';

    // Show switch badge
    if (videoSwitchCard && switchBadge && switchTitle) {
      switchBadge.textContent = direction === 'right' ? 'Next Video →' : '← Previous Video';
      switchTitle.textContent = nextName;
      videoSwitchCard.classList.add('visible');
    }

    // Slide out animation
    const outOffset = direction === 'right' ? -120 : 120;
    const inOffset = direction === 'right' ? 120 : -120;
    const oldSurface = isCurrentMediaAudio ? audioVinylStage : mainVideo;

    if (oldSurface) {
      oldSurface.style.transition = 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease';
      oldSurface.style.transform = `translateX(${outOffset}px)`;
      oldSurface.style.opacity = '0';
    }

    setTimeout(() => {
      loadVideo(nextPath, true);

      const newSurface = isCurrentMediaAudio ? audioVinylStage : mainVideo;
      if (newSurface) {
        newSurface.style.transition = 'none';
        newSurface.style.transform = `translateX(${inOffset}px)`;
        newSurface.style.opacity = '0';

        void newSurface.offsetWidth; // Reflow

        newSurface.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease';
        newSurface.style.transform = 'translateX(0px)';
        newSurface.style.opacity = '1';
      }

      setTimeout(() => {
        if (oldSurface) {
          oldSurface.style.transition = '';
          oldSurface.style.transform = '';
          oldSurface.style.opacity = '';
        }
        if (newSurface) {
          newSurface.style.transition = '';
          newSurface.style.transform = '';
          newSurface.style.opacity = '';
        }
        isNavigatingVideo = false;
        if (videoSwitchCard) videoSwitchCard.classList.remove('visible');
      }, 350);
    }, 220);
  }

  function goToNextVideo() {
    if (folderPlaylist.length <= 1) return;
    const nextIdx = (playlistIndex + 1) % folderPlaylist.length;
    navigateVideo(nextIdx, 'right');
  }

  function goToPrevVideo() {
    if (folderPlaylist.length <= 1) return;
    const prevIdx = (playlistIndex - 1 + folderPlaylist.length) % folderPlaylist.length;
    navigateVideo(prevIdx, 'left');
  }

  // Open initial file if passed from Windows Explorer or command line
  let isVideoLoaded = false;

  if (window.velaAPI && window.velaAPI.getInitialFile) {
    window.velaAPI.getInitialFile().then(initFile => {
      if (isVideoLoaded) return;
      if (initFile) {
        isVideoLoaded = true;
        loadVideo(initFile, true);
      } else if (!isVideoLoaded) {
        isVideoLoaded = true;
        try {
          loadVideo('c:\\Visual PJ\\Vela\\sample_video.mp4', false);
        } catch (e) {
          emptyDropZone.style.display = 'flex';
        }
      }
    });

    window.velaAPI.onOpenFile(filePath => {
      if (filePath) {
        isVideoLoaded = true;
        loadVideo(filePath, true);
      }
    });
  } else {
    try {
      loadVideo('c:\\Visual PJ\\Vela\\sample_video.mp4', false);
    } catch (e) {
      emptyDropZone.style.display = 'flex';
    }
  }

  // Media element error logging
  mainVideo.addEventListener('error', () => {
    if (!currentFilePath) return;
    console.error('Playback error on media element:', mainVideo.error, currentFilePath);
  });

  // Open File Handlers
  async function handleOpenFile() {
    const files = await window.velaAPI.openFiles();
    if (files && files.length > 0) {
      loadVideo(files[0]);
    }
  }

  if (openVideoBtn) openVideoBtn.addEventListener('click', handleOpenFile);
  emptyOpenBtn.addEventListener('click', handleOpenFile);
  menuOpenFile.addEventListener('click', () => {
    closeAllMenus();
    handleOpenFile();
  });

  menuShowFolder.addEventListener('click', () => {
    closeAllMenus();
    if (currentFilePath) {
      window.velaAPI.showInFolder(currentFilePath);
    }
  });

  // Drag & Drop
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).map(f => f.path);
    if (files && files.length > 0) {
      loadVideo(files[0]);
    }
  });

  // ==================== PLAYBACK CONTROLS ====================
  function updatePlayPauseIcons() {
    if (mainVideo.paused) {
      playMainIcon.style.display = 'block';
      pauseMainIcon.style.display = 'none';
      trimPlayIcon.style.display = 'block';
      trimPauseIcon.style.display = 'none';
    } else {
      playMainIcon.style.display = 'none';
      pauseMainIcon.style.display = 'block';
      trimPlayIcon.style.display = 'none';
      trimPauseIcon.style.display = 'block';
    }
    updateVinylAnimationState();
  }

  function togglePlayPause() {
    if (!mainVideo) return;
    if (mainVideo.paused) {
      if (isTrimMode) {
        if (mainVideo.currentTime < trimStartSec || mainVideo.currentTime >= trimEndSec - 0.05) {
          resetToTrimStart();
        }
        startTrimLoopMonitor();
      }
      const p = mainVideo.play();
      if (p !== undefined) {
        p.catch(err => {
          console.warn('Playback interrupted:', err);
        });
      }
      triggerRipple(true);
    } else {
      mainVideo.pause();
      if (isTrimMode) {
        stopTrimLoopMonitor();
      }
      triggerRipple(false);
    }
    updatePlayPauseIcons();
    updateVinylAnimationState();
    resetControlsTimer();
  }

  // Double-click on video viewport to toggle fullscreen (Click-to-play/pause removed as requested)
  if (videoContainer) {
    videoContainer.addEventListener('dblclick', (e) => {
      if (isTrimMode) return;
      if (e.target.closest('.bottom-controls-surface') || e.target.closest('.app-top-bar') || e.target.closest('.nav-chevron') || e.target.closest('#trim-controls')) return;
      fullscreenBtn.click();
    });
  }

  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });
  mainVideo.addEventListener('play', () => {
    initWebAudioAnalyser();
    if (audioContextObj && audioContextObj.state === 'suspended') {
      audioContextObj.resume().catch(() => {});
    }
    if (isCurrentMediaAudio) {
      startParticleVisualizer();
    }
    updatePlayPauseIcons();
    updateVinylAnimationState();
    resetControlsTimer();
    if (isTrimMode) {
      startTrimLoopMonitor();
    }
  });
  mainVideo.addEventListener('pause', () => {
    updatePlayPauseIcons();
    updateVinylAnimationState();
    resetControlsTimer();
    if (isTrimMode) {
      stopTrimLoopMonitor();
    }
  });
  mainVideo.addEventListener('ended', () => {
    if (isTrimMode) {
      resetToTrimStart();
      mainVideo.play().catch(() => {});
      startTrimLoopMonitor();
    } else {
      updatePlayPauseIcons();
      updateVinylAnimationState();
      resetControlsTimer();
    }
  });

  // Time Updates
  mainVideo.addEventListener('timeupdate', () => {
    const cur = mainVideo.currentTime;
    const dur = mainVideo.duration || 0;

    // Spotify-style Synced Lyrics Update
    if (isCurrentMediaAudio) {
      updateLyricsSync(cur);
    }

    // Normal controls
    if (!isDraggingTimeline && dur > 0) {
      const pct = (cur / dur) * 100;
      timelinePlayed.style.width = `${pct}%`;
      timelineThumb.style.left = `${pct}%`;
      labelCurrentTime.textContent = formatTime(cur);
      labelDurationTime.textContent = formatTime(dur);
    }

    // Live dropped frames in Info Drawer
    if (sideInfoDrawer && sideInfoDrawer.classList.contains('open') && mainVideo.getVideoPlaybackQuality) {
      const q = mainVideo.getVideoPlaybackQuality();
      if (infoValDropped) infoValDropped.textContent = `${q.droppedVideoFrames || 0} frames`;
    }

    // Trim mode updates
    if (isTrimMode && dur > 0) {
      if (!isDraggingTrimPlayhead) {
        const pct = Math.max(0, Math.min(100, (cur / dur) * 100));
        trimPlayhead.style.left = `${pct}%`;
        trimFloatingBadge.textContent = formatTime(cur, true);
      }

      // Loop inside trimmed range if playing
      if (!mainVideo.paused && cur >= trimEndSec) {
        resetToTrimStart();
      }
    }
  });

  mainVideo.addEventListener('loadedmetadata', () => {
    labelDurationTime.textContent = formatTime(mainVideo.duration);
    if (isCurrentMediaAudio && audioMetaDuration && mainVideo.duration > 0) {
      audioMetaDuration.textContent = formatTime(mainVideo.duration);
    }
    trimStartSec = 0;
    trimEndSec = mainVideo.duration || 10;
    updateVolumeUI();
    updateTrimUI();
  });

  // Timeline Hold & Drag Scrubbing (Hold & Drag left/right)
  let isDraggingTimeline = false;
  let wasPlayingBeforeTimelineDrag = false;

  function updateTimelineSeek(clientX) {
    if (!mainVideo.duration) return;
    const rect = timelineTrack.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = pct * mainVideo.duration;
    mainVideo.currentTime = targetTime;
    timelinePlayed.style.width = `${pct * 100}%`;
    timelineThumb.style.left = `${pct * 100}%`;
    labelCurrentTime.textContent = formatTime(targetTime);
  }

  timelineTrack.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // left click only
    isDraggingTimeline = true;
    timelineTrack.classList.add('dragging');
    wasPlayingBeforeTimelineDrag = !mainVideo.paused;
    if (wasPlayingBeforeTimelineDrag) {
      mainVideo.pause();
    }
    updateTimelineSeek(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingTimeline) {
      updateTimelineSeek(e.clientX);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingTimeline) {
      isDraggingTimeline = false;
      timelineTrack.classList.remove('dragging');
      if (wasPlayingBeforeTimelineDrag) {
        mainVideo.play().catch(() => {});
      }
    }
  });

  // Skip 10s (Clean skip without HUD)
  if (rewind10Btn) {
    rewind10Btn.addEventListener('click', () => {
      mainVideo.currentTime = Math.max(0, mainVideo.currentTime - 10);
    });
  }

  if (forward10Btn) {
    forward10Btn.addEventListener('click', () => {
      mainVideo.currentTime = Math.min(mainVideo.duration || 0, mainVideo.currentTime + 10);
    });
  }

  // Volume slider input
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const val = parseFloat(volumeSlider.value);
      if (val > 0) {
        lastNonZeroVolume = val;
        mainVideo.muted = false;
      } else {
        mainVideo.muted = true;
      }
      mainVideo.volume = val;
      updateVolumeUI();
    });
  }

  if (trimVolumeSlider) {
    trimVolumeSlider.addEventListener('input', () => {
      const val = parseFloat(trimVolumeSlider.value);
      if (val > 0) {
        lastNonZeroVolume = val;
        mainVideo.muted = false;
      } else {
        mainVideo.muted = true;
      }
      mainVideo.volume = val;
      updateVolumeUI();
    });
  }

  // Mute / Unmute toggles
  if (volumeMuteBtn) {
    volumeMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMute();
    });
  }

  if (trimMuteBtn) {
    trimMuteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMute();
    });
  }

  // Fullscreen & PiP
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  pipBtn.addEventListener('click', async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await mainVideo.requestPictureInPicture();
      }
    } catch (e) {}
  });

  // ==================== PLAYBACK SPEED DRAG SLIDER ====================
  // 8 steps: 0.25, 0.50, 0.75, 1.0 (center anchor), 1.25, 1.50, 1.75, 2.0
  const SPEED_STEPS = [0.25, 0.50, 0.75, 1.0, 1.25, 1.50, 1.75, 2.0];
  const SPEED_PERCENTAGES = [0, 16.67, 33.33, 50, 62.5, 75, 87.5, 100];
  const speedCenterDetent = document.querySelector('.speed-center-detent');
  let isDraggingSpeed = false;
  let currentSpeedVal = 1.0;

  function findClosestSpeedIndex(pct) {
    let closestIdx = 3;
    let minDiff = Infinity;
    SPEED_PERCENTAGES.forEach((p, idx) => {
      const diff = Math.abs(p - pct);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  }

  function renderSpeedUI(pct, animate = true) {
    if (speedThumbHandle) {
      if (!animate) speedThumbHandle.classList.add('dragging');
      else speedThumbHandle.classList.remove('dragging');
      speedThumbHandle.style.left = `${pct}%`;
    }

    if (speedActiveFill) {
      if (!animate) speedActiveFill.classList.add('dragging');
      else speedActiveFill.classList.remove('dragging');

      if (pct >= 50) {
        speedActiveFill.style.left = '50%';
        speedActiveFill.style.width = `${pct - 50}%`;
      } else {
        speedActiveFill.style.left = `${pct}%`;
        speedActiveFill.style.width = `${50 - pct}%`;
      }
    }

    // Center notch magnetic highlight
    if (speedCenterDetent) {
      if (Math.abs(pct - 50) < 4) {
        speedCenterDetent.classList.add('centered');
      } else {
        speedCenterDetent.classList.remove('centered');
      }
    }
  }

  function setSpeedStep(speedVal, animate = true) {
    let closestIdx = 3;
    let minDiff = Infinity;
    SPEED_STEPS.forEach((s, idx) => {
      const diff = Math.abs(s - speedVal);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const targetSpeed = SPEED_STEPS[closestIdx];
    const targetPct = SPEED_PERCENTAGES[closestIdx];

    if (currentSpeedVal !== targetSpeed) {
      currentSpeedVal = targetSpeed;
      mainVideo.playbackRate = targetSpeed;

      if (speedPillVal) {
        speedPillVal.textContent = `${targetSpeed}x`;
        speedPillVal.classList.add('pop');
        setTimeout(() => speedPillVal.classList.remove('pop'), 180);
      }
      updateVinylSpeed(targetSpeed);
      if (speedLabel) speedLabel.textContent = `Playback Speed (${targetSpeed}x)`;
    }

    renderSpeedUI(targetPct, animate);
  }

  function handleSpeedTrackSeek(clientX, isLiveDrag = false) {
    if (!speedTrackContainer) return;
    const rect = speedTrackContainer.getBoundingClientRect();
    let rawPct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));

    // Magnetic detent around center 50%:
    // If within ±4% of center anchor, smoothly snap to 50%
    let visualPct = rawPct;
    if (Math.abs(rawPct - 50) < 4) {
      visualPct = 50;
    }

    // Find closest discrete speed step
    const closestIdx = findClosestSpeedIndex(rawPct);
    const stepSpeed = SPEED_STEPS[closestIdx];

    if (currentSpeedVal !== stepSpeed) {
      currentSpeedVal = stepSpeed;
      mainVideo.playbackRate = stepSpeed;

      if (speedPillVal) {
        speedPillVal.textContent = `${stepSpeed}x`;
        speedPillVal.classList.add('pop');
        setTimeout(() => speedPillVal.classList.remove('pop'), 180);
      }
      updateVinylSpeed(stepSpeed);
      if (speedLabel) speedLabel.textContent = `Playback Speed (${stepSpeed}x)`;
    }

    if (isLiveDrag) {
      // Fluid real-time tracking under finger/mouse
      renderSpeedUI(visualPct, false);
    } else {
      // Spring glide on click
      setSpeedStep(stepSpeed, true);
    }
  }

  if (speedTrackContainer) {
    speedTrackContainer.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDraggingSpeed = true;
      handleSpeedTrackSeek(e.clientX, true);
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (isDraggingSpeed) {
      handleSpeedTrackSeek(e.clientX, true);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingSpeed) {
      isDraggingSpeed = false;
      // Spring smoothly into the exact discrete position upon release
      setSpeedStep(currentSpeedVal, true);
    }
  });

  // Reset to 1.0x on pill click with smooth spring animation
  if (speedPillBtn) {
    speedPillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setSpeedStep(1.0, true);
    });
  }

  // Initialize speed at 1.0x (anchor at dead center)
  setSpeedStep(1.0, false);

  // Save photo from video (Snapshot)
  menuActionSavePhoto.addEventListener('click', async () => {
    closeAllMenus();
    try {
      const canvas = document.createElement('canvas');
      canvas.width = mainVideo.videoWidth || 1280;
      canvas.height = mainVideo.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(mainVideo, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `VELA_Snap_${Math.floor(mainVideo.currentTime)}s.png`;
      a.click();
      showToast('Frame snapshot saved!');
    } catch (e) {
      showToast('Error saving snapshot');
    }
  });

  // ==================== SWIPE / DRAG PLAYLIST NAVIGATION ====================
  // Drag left/right anywhere on video = transition to next/prev video
  // Side chevrons < and > = Movies & TV style navigation
  // Scroll wheel = volume

  if (videoContainer) {
    videoContainer.addEventListener('mousedown', (e) => {
      if (isTrimMode || isNavigatingVideo) return;
      if (e.button !== 0) return; // left click only
      if (e.target.closest('.bottom-controls-surface') || e.target.closest('.app-top-bar') || e.target.closest('.nav-chevron')) return;

      isDraggingVideo = true;
      hasTriggeredSwipe = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragDistanceX = 0;
      mainVideo.classList.add('dragging');
    });
  }

  window.addEventListener('mousemove', (e) => {
    resetControlsTimer();

    if (!isDraggingVideo || isTrimMode || isNavigatingVideo) return;

    const deltaX = e.clientX - dragStartX;
    dragDistanceX = deltaX;

    if (Math.abs(deltaX) > 8) {
      // Visual drag feedback with dampening
      mainVideo.style.transform = `translateX(${deltaX * 0.45}px)`;
      mainVideo.style.opacity = `${Math.max(0.6, 1 - Math.abs(deltaX) / 900)}`;

      // Show peek badge of target video
      if (videoSwitchCard && switchBadge && switchTitle && folderPlaylist.length > 1) {
        if (deltaX > 25) {
          // Dragging right -> Next video
          const targetIdx = (playlistIndex + 1) % folderPlaylist.length;
          const targetName = folderPlaylist[targetIdx] ? folderPlaylist[targetIdx].split(/[\\/]/).pop() : '';
          switchBadge.textContent = 'Next Video →';
          switchTitle.textContent = targetName;
          videoSwitchCard.classList.add('visible');
        } else if (deltaX < -25) {
          // Dragging left -> Previous video
          const targetIdx = (playlistIndex - 1 + folderPlaylist.length) % folderPlaylist.length;
          const targetName = folderPlaylist[targetIdx] ? folderPlaylist[targetIdx].split(/[\\/]/).pop() : '';
          switchBadge.textContent = '← Previous Video';
          switchTitle.textContent = targetName;
          videoSwitchCard.classList.add('visible');
        }
      }
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingVideo) {
      isDraggingVideo = false;
      mainVideo.classList.remove('dragging');

      if (videoSwitchCard && !hasTriggeredSwipe) {
        videoSwitchCard.classList.remove('visible');
      }

      const deltaX = dragDistanceX;
      // Threshold for swipe: 45px
      if (deltaX > 45 && folderPlaylist.length > 1) {
        // Dragged right -> Next video!
        hasTriggeredSwipe = true;
        goToNextVideo();
      } else if (deltaX < -45 && folderPlaylist.length > 1) {
        // Dragged left -> Previous video!
        hasTriggeredSwipe = true;
        goToPrevVideo();
      } else {
        // Did not cross threshold, spring back smoothly
        mainVideo.style.transition = 'transform 0.25s var(--smooth-ease), opacity 0.25s ease';
        mainVideo.style.transform = 'translateX(0px)';
        mainVideo.style.opacity = '1';
        setTimeout(() => {
          mainVideo.style.transition = '';
        }, 260);
      }
    }
  });

  // Chevrons click listeners
  if (navNextBtn) {
    navNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToNextVideo();
    });
  }

  if (navPrevBtn) {
    navPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPrevVideo();
    });
  }

  // Scroll Wheel Volume
  if (videoContainer) {
    videoContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      resetControlsTimer();
      const step = 0.05;
      let newVol = mainVideo.volume + (e.deltaY < 0 ? step : -step);
      newVol = Math.max(0, Math.min(1, Math.round(newVol * 100) / 100));
      if (newVol > 0) {
        mainVideo.muted = false;
        lastNonZeroVolume = newVol;
      } else {
        mainVideo.muted = true;
      }
      mainVideo.volume = newVol;
      updateVolumeUI();
    }, { passive: false });
  }

  // Idle controls auto-hide
  function resetControlsTimer() {
    document.body.classList.remove('controls-hidden');
    clearTimeout(controlsHideTimer);
    if (!mainVideo.paused && !isTrimMode) {
      controlsHideTimer = setTimeout(() => {
        if (!isDraggingTimeline && !pencilPopupMenu.classList.contains('active')) {
          document.body.classList.add('controls-hidden');
        }
      }, 3000);
    }
  }

  // ==================== PENCIL POPUP MENU (Image 2) ====================
  function closeAllMenus() {
    if (pencilPopupMenu) pencilPopupMenu.classList.remove('active');
    if (morePopupMenu) morePopupMenu.classList.remove('active');
    if (pencilEditBtn) pencilEditBtn.classList.remove('menu-open');
    if (moreOptionsBtn) moreOptionsBtn.classList.remove('menu-open');
  }

  if (pencilEditBtn && pencilPopupMenu) {
    pencilEditBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = pencilPopupMenu.classList.contains('active');
      closeAllMenus();
      if (!wasActive) {
        pencilPopupMenu.classList.add('active');
        pencilEditBtn.classList.add('menu-open');
      }
    });
  }

  if (moreOptionsBtn && morePopupMenu) {
    moreOptionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = morePopupMenu.classList.contains('active');
      closeAllMenus();
      if (!wasActive) {
        morePopupMenu.classList.add('active');
        moreOptionsBtn.classList.add('menu-open');
      }
    });
  }

  window.addEventListener('click', () => closeAllMenus());

  // ==================== INFO SIDE SLIDE DRAWER (Image 1) ====================
  async function updateInfoDrawer() {
    if (!currentFilePath) {
      if (infoValFile) infoValFile.textContent = 'No file loaded';
      if (infoValDuration) infoValDuration.textContent = '0:00';
      if (infoValVideo) infoValVideo.textContent = '-';
      if (infoValPixel) infoValPixel.textContent = '-';
      if (infoValDecoder) infoValDecoder.textContent = '-';
      if (infoValRenderer) infoValRenderer.textContent = '-';
      if (infoValAudio) infoValAudio.textContent = '-';
      if (infoValSize) infoValSize.textContent = '-';
      if (infoValDropped) infoValDropped.textContent = '0 frames';
      return;
    }

    const baseName = currentFilePath.split(/[\\/]/).pop() || '';
    if (infoValFile) infoValFile.textContent = baseName;

    // Actual duration from video element
    const dur = mainVideo.duration || 0;
    const durH = Math.floor(dur / 3600);
    const durM = Math.floor((dur % 3600) / 60);
    const durS = Math.floor(dur % 60);
    const durStr = durH > 0 
      ? `${durH}:${durM.toString().padStart(2, '0')}:${durS.toString().padStart(2, '0')}`
      : `${durM}:${durS.toString().padStart(2, '0')}`;
    if (infoValDuration) infoValDuration.textContent = durStr;

    // Actual live dropped frames from browser media playback quality API
    if (infoValDropped) {
      if (mainVideo.getVideoPlaybackQuality) {
        const q = mainVideo.getVideoPlaybackQuality();
        infoValDropped.textContent = `${q.droppedVideoFrames || 0} frames`;
      } else {
        infoValDropped.textContent = '0 frames';
      }
    }

    // Decoder & Renderer in Windows Electron GPU pipeline
    if (isCurrentMediaAudio) {
      if (infoValDecoder) infoValDecoder.textContent = 'Audio (Chromium / WASAPI)';
      if (infoValRenderer) infoValRenderer.textContent = 'wasapi · directsound';
      if (infoValVideo) infoValVideo.textContent = '– Pure Audio Track';
      if (infoValPixel) infoValPixel.textContent = 'WASAPI · 32-bit Float · Hi-Fi Studio';
    } else {
      if (infoValDecoder) infoValDecoder.textContent = 'GPU (d3d11va)';
      if (infoValRenderer) infoValRenderer.textContent = 'gpu-next · d3d11';

      // Show actual video dimensions if already loaded in DOM
      const actualWidth = mainVideo.videoWidth || 0;
      const actualHeight = mainVideo.videoHeight || 0;
      if (actualWidth > 0 && actualHeight > 0) {
        if (infoValVideo) infoValVideo.textContent = `– ${actualWidth}×${actualHeight}`;
      } else {
        if (infoValVideo) infoValVideo.textContent = 'Loading...';
      }
    }

    if (infoValBpm) {
      if (liveDetectedBpm > 0) {
        infoValBpm.textContent = `${liveDetectedBpm} BPM (Live)`;
      } else if (isCurrentMediaAudio) {
        infoValBpm.textContent = 'Detecting...';
      } else {
        infoValBpm.textContent = '-';
      }
    }

    try {
      const details = await window.velaAPI.getFileDetails(currentFilePath);
      if (details) {
        if (details.name && infoValFile) infoValFile.textContent = details.name;
        if (details.durationFormatted && infoValDuration) infoValDuration.textContent = details.durationFormatted;
        
        if (details.isAudio || isCurrentMediaAudio) {
          const aCodec = (details.audioCodec || 'mp3').toUpperCase();
          if (infoValVideo) infoValVideo.textContent = `– Hi-Fi Audio (${details.ext || aCodec})`;
          if (infoValPixel) infoValPixel.textContent = 'WASAPI · 32-bit Float · Hi-Fi Studio';
          if (infoValDecoder) infoValDecoder.textContent = `Audio (${aCodec})`;
          if (infoValRenderer) infoValRenderer.textContent = 'wasapi · directsound';
        } else {
          // Exact video dimensions and frame rate
          const vW = details.width || mainVideo.videoWidth || 1920;
          const vH = details.height || mainVideo.videoHeight || 1080;
          const fps = details.fps || '60';
          if (infoValVideo) infoValVideo.textContent = `– ${vW}×${vH} @ ${fps} fps`;

          // Exact pixel format and colorspace
          const cs = details.colorSpace || 'bt709';
          const ct = details.colorTransfer || `${cs}/bt.1886`;
          if (infoValPixel) infoValPixel.textContent = `d3d11 · ${cs} · ${ct}`;
        }

        // Exact audio codec, sample rate, and channels
        if (details.hasAudio) {
          const aCodec = details.audioCodec || 'aac';
          const aRate = details.sampleRate || '48000';
          const aChan = details.channels || 'stereo';
          if (infoValAudio) infoValAudio.textContent = `${aCodec} · ${aRate} Hz · ${aChan}`;
        } else {
          if (infoValAudio) infoValAudio.textContent = 'No Audio Stream';
        }

        // Exact BPM
        if (infoValBpm) {
          if (details.bpm) {
            infoValBpm.textContent = `${details.bpm} BPM`;
          } else if (liveDetectedBpm > 0) {
            infoValBpm.textContent = `${liveDetectedBpm} BPM (Live)`;
          } else if (details.isAudio || isCurrentMediaAudio) {
            infoValBpm.textContent = 'Analyzing...';
          } else {
            infoValBpm.textContent = '-';
          }
        }
        
        // Exact file size
        if (details.sizeMB && infoValSize) infoValSize.textContent = details.sizeMB;
      }
    } catch (e) {
      console.warn('Could not fetch file details:', e);
    }
  }

  function openInfoDrawer() {
    closeAllMenus();
    updateInfoDrawer();
    if (sideInfoDrawer) sideInfoDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
  }

  function closeInfoDrawer() {
    if (sideInfoDrawer) sideInfoDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
  }

  if (menuActionInfo) {
    menuActionInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      openInfoDrawer();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeInfoDrawer();
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => {
      closeInfoDrawer();
    });
  }

  if (sideInfoDrawer) {
    sideInfoDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // ==================== GITHUB AUTO-UPDATE & RELEASE NOTIFIER ====================
  const infoAppVersion = document.getElementById('info-app-version');
  const checkUpdateBtn = document.getElementById('check-update-btn');
  const updateBtnText = document.getElementById('update-btn-text');
  const infoUpdateStatus = document.getElementById('info-update-status');
  const updateModalBackdrop = document.getElementById('update-modal-backdrop');
  const updateModalTitle = document.getElementById('update-modal-title');
  const updateCurrVersion = document.getElementById('update-curr-version');
  const updateNewVersion = document.getElementById('update-new-version');
  const updateChangelogText = document.getElementById('update-changelog-text');
  const updateActionDownload = document.getElementById('update-action-download');

  let latestReleaseUrl = 'https://github.com/hmmanxiety/Vela/releases';
  let isCheckingUpdate = false;

  async function checkAppUpdates(isManual = false) {
    if (!window.velaAPI || !window.velaAPI.checkUpdates) return;
    if (isCheckingUpdate) return;
    isCheckingUpdate = true;

    if (checkUpdateBtn) checkUpdateBtn.classList.add('checking');
    if (updateBtnText) updateBtnText.textContent = 'Checking...';
    if (infoUpdateStatus) infoUpdateStatus.textContent = 'Checking GitHub...';

    try {
      const res = await window.velaAPI.checkUpdates();
      if (res && res.success) {
        if (infoAppVersion && res.currentVersion) {
          infoAppVersion.textContent = res.currentVersion;
        }

        if (res.updateAvailable) {
          latestReleaseUrl = res.releaseUrl || latestReleaseUrl;
          if (infoUpdateStatus) {
            infoUpdateStatus.textContent = `New update ${res.latestVersion} available!`;
            infoUpdateStatus.classList.add('has-update');
          }
          showUpdateModal(res);
        } else {
          if (infoUpdateStatus) {
            infoUpdateStatus.textContent = 'You are on the latest version';
            infoUpdateStatus.classList.remove('has-update');
          }
          if (isManual) {
            showToast(`Vela is up to date (${res.currentVersion || 'v1.0.0'}) ✨`);
          }
        }
      } else {
        if (infoUpdateStatus) {
          infoUpdateStatus.textContent = 'Could not check updates';
        }
        if (isManual) {
          showToast('Could not reach GitHub releases');
        }
      }
    } catch (err) {
      console.warn('Update check error:', err);
      if (infoUpdateStatus) infoUpdateStatus.textContent = 'Check failed';
    } finally {
      isCheckingUpdate = false;
      if (checkUpdateBtn) checkUpdateBtn.classList.remove('checking');
      if (updateBtnText) updateBtnText.textContent = 'Check for updates';
    }
  }

  function showUpdateModal(releaseInfo) {
    if (!updateModalBackdrop) return;

    if (mainVideo && !mainVideo.paused) {
      mainVideo.pause();
    }

    if (updateModalTitle) {
      updateModalTitle.textContent = `Vela ${releaseInfo.latestVersion} is available!`;
    }
    if (updateCurrVersion) {
      updateCurrVersion.textContent = releaseInfo.currentVersion || 'v1.0.0';
    }
    if (updateNewVersion) {
      updateNewVersion.textContent = releaseInfo.latestVersion;
    }
    if (updateChangelogText) {
      updateChangelogText.textContent = releaseInfo.changelog || 'Performance improvements and bug fixes.';
    }

    updateModalBackdrop.style.display = 'flex';
  }

  if (checkUpdateBtn) {
    checkUpdateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      checkAppUpdates(true);
    });
  }

  if (updateActionDownload) {
    updateActionDownload.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.velaAPI && window.velaAPI.openExternal) {
        window.velaAPI.openExternal(latestReleaseUrl);
      }
    });
  }

  // Automatic check 2.5s after launch
  setTimeout(() => {
    checkAppUpdates(false);
  }, 2500);

  // ==================== TRIM MODE (Image 3) ====================
  function enterTrimMode() {
    closeAllMenus();
    isTrimMode = true;
    isPreviewingTrim = false;
    mainVideo.pause();
    stopTrimLoopMonitor();

    // Switch Header
    windowCenterTab.style.display = 'flex';
    trimTopActions.style.display = 'flex';
    if (openVideoBtn) openVideoBtn.style.display = 'none';

    // Switch Controls
    normalControls.style.display = 'none';
    trimControls.style.display = 'flex';

    // Init handles: Start at 00:00 (beginning) and end at full duration
    const dur = mainVideo.duration || 10;
    trimStartSec = 0;
    trimEndSec = dur;

    updateVolumeUI();
    updateTrimUI();
  }

  function exitTrimMode() {
    isTrimMode = false;
    isPreviewingTrim = false;
    stopTrimLoopMonitor();

    // Switch Header
    windowCenterTab.style.display = 'none';
    trimTopActions.style.display = 'none';
    if (openVideoBtn) openVideoBtn.style.display = 'flex';

    // Switch Controls
    normalControls.style.display = 'flex';
    trimControls.style.display = 'none';

    mainVideo.play().catch(() => {});
    updatePlayPauseIcons();
  }

  menuActionTrim.addEventListener('click', () => {
    enterTrimMode();
  });

  trimCancelTopBtn.addEventListener('click', exitTrimMode);

  let isDraggingTrimPlayhead = false;
  let wasPlayingBeforeTrimScrub = false;

  function updateTrimPlayheadSeek(clientX) {
    const rect = trimSliderBar.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, mouseX / rect.width));
    const dur = mainVideo.duration || 10;
    const targetSec = pct * dur;
    mainVideo.currentTime = targetSec;
    trimPlayhead.style.left = `${pct * 100}%`;
    trimFloatingBadge.textContent = formatTime(targetSec, true);
  }

  function updateTrimUI() {
    const dur = mainVideo.duration || 10;
    const startPct = Math.max(0, Math.min(100, (trimStartSec / dur) * 100));
    const endPct = Math.max(0, Math.min(100, (trimEndSec / dur) * 100));
    const widthPct = Math.max(0, endPct - startPct);

    trimHandleLeft.style.left = `${startPct}%`;
    trimHandleRight.style.left = `${endPct}%`;
    trimSelectedRail.style.left = `${startPct}%`;
    trimSelectedRail.style.width = `${widthPct}%`;

    trimLabelStart.textContent = formatTime(trimStartSec, false);
    trimLabelEnd.textContent = formatTime(trimEndSec, false);

    if (!isDraggingTrimPlayhead) {
      const cur = (mainVideo && !isNaN(mainVideo.currentTime)) ? mainVideo.currentTime : trimStartSec;
      const curPct = Math.max(0, Math.min(100, (cur / dur) * 100));
      trimPlayhead.style.left = `${curPct}%`;
      trimFloatingBadge.textContent = formatTime(cur, true);
    }
  }

  // Bracket Handle Dragging [ and ] (Completely independent from playhead)
  trimHandleLeft.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    activeDraggingHandle = 'left';
    trimHandleLeft.classList.add('dragging');
  });

  trimHandleRight.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    activeDraggingHandle = 'right';
    trimHandleRight.classList.add('dragging');
  });

  // Playhead Needle & Rail Dragging in Trim Mode
  trimPlayhead.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    isDraggingTrimPlayhead = true;
    trimPlayhead.classList.add('dragging');
    wasPlayingBeforeTrimScrub = !mainVideo.paused;
    if (wasPlayingBeforeTrimScrub) {
      mainVideo.pause();
    }
    updateTrimPlayheadSeek(e.clientX);
  });

  trimSliderBar.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.bracket-handle')) return; // handled by bracket listener
    isDraggingTrimPlayhead = true;
    trimPlayhead.classList.add('dragging');
    wasPlayingBeforeTrimScrub = !mainVideo.paused;
    if (wasPlayingBeforeTrimScrub) {
      mainVideo.pause();
    }
    updateTrimPlayheadSeek(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isTrimMode) return;

    if (isDraggingTrimPlayhead) {
      updateTrimPlayheadSeek(e.clientX);
    } else if (activeDraggingHandle) {
      const rect = trimSliderBar.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, mouseX / rect.width));
      const dur = mainVideo.duration || 10;
      const targetSec = pct * dur;

      if (activeDraggingHandle === 'left') {
        trimStartSec = Math.max(0, Math.min(targetSec, trimEndSec - 0.5));
        if (mainVideo.currentTime < trimStartSec) {
          resetToTrimStart();
        }
      } else if (activeDraggingHandle === 'right') {
        trimEndSec = Math.min(dur, Math.max(targetSec, trimStartSec + 0.5));
        if (mainVideo.currentTime >= trimEndSec) {
          resetToTrimStart();
        }
      }
      updateTrimUI();
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingTrimPlayhead) {
      isDraggingTrimPlayhead = false;
      trimPlayhead.classList.remove('dragging');
      if (wasPlayingBeforeTrimScrub) {
        if (mainVideo.currentTime >= trimEndSec) {
          resetToTrimStart();
        }
        mainVideo.play().catch(() => {});
        startTrimLoopMonitor();
      }
    }
    if (activeDraggingHandle) {
      trimHandleLeft.classList.remove('dragging');
      trimHandleRight.classList.remove('dragging');
      activeDraggingHandle = null;
    }
  });

  // Trim Preview Play/Pause
  trimPlayPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
  });

  // Save as copy (Automatic Hardware-Accelerated Optimization via FFmpeg)
  trimSaveCopyBtn.addEventListener('click', async () => {
    if (!currentFilePath) return;

    const ext = currentFilePath.split('.').pop() || 'mp4';
    const defaultName = `VELA_Trim_${Date.now()}.${ext}`;
    const outputPath = await window.velaAPI.selectSavePath(defaultName);
    if (!outputPath) return;

    trimSaveCopyBtn.disabled = true;
    trimSaveCopyBtn.textContent = 'Saving...';

    try {
      const res = await window.velaAPI.trimVideo({
        inputPath: currentFilePath,
        outputPath: outputPath,
        startSec: trimStartSec,
        endSec: trimEndSec,
        optimize: true
      });

      if (res && res.success) {
        showToast(`Clip saved successfully! (${res.sizeMB} MB) ✨`);
        exitTrimMode();
        loadVideo(outputPath);
      }
    } catch (err) {
      console.error(err);
      showToast('Error trimming: ' + err.message);
    } finally {
      trimSaveCopyBtn.disabled = false;
      trimSaveCopyBtn.textContent = 'Save as copy';
    }
  });

  // Blur buttons on click/focus so Spacebar always operates player globally
  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.tagName === 'BUTTON') {
      e.target.blur();
    }
  });

  document.addEventListener('click', () => {
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
      document.activeElement.blur();
    }
  });

  // Ensure window and body have focus
  window.focus();
  if (document.body) document.body.focus();

  // ==================== KEYBOARD SHORTCUTS ====================
  // Reliable Spacebar Play/Pause (First press plays, second pauses, repeats seamlessly)
  function handleSpaceKey(e) {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') && e.target.type !== 'range') {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      togglePlayPause();
    }
  }

  function handleSpaceKeyUp(e) {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') && e.target.type !== 'range') {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  window.addEventListener('keydown', handleSpaceKey, true);
  document.addEventListener('keydown', handleSpaceKey, true);
  window.addEventListener('keyup', handleSpaceKeyUp, true);
  document.addEventListener('keyup', handleSpaceKeyUp, true);

  window.addEventListener('keydown', (e) => {
    // If typing in a text input (if any), don't trigger shortcuts
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') && e.target.type !== 'range') {
      return;
    }

    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
      return; // Already handled by handleSpaceKey
    }

    if (e.key === 'n' || e.key === 'N' || e.key === 'PageDown') {
      e.preventDefault();
      goToNextVideo();
    } else if (e.key === 'p' || e.key === 'P' || e.key === 'PageUp') {
      e.preventDefault();
      goToPrevVideo();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (rewind10Btn) rewind10Btn.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (forward10Btn) forward10Btn.click();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let newVol = Math.min(1, Math.round((mainVideo.volume + 0.05) * 100) / 100);
      mainVideo.muted = false;
      lastNonZeroVolume = newVol;
      mainVideo.volume = newVol;
      updateVolumeUI();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      let newVol = Math.max(0, Math.round((mainVideo.volume - 0.05) * 100) / 100);
      if (newVol === 0) {
        mainVideo.muted = true;
      } else {
        mainVideo.muted = false;
        lastNonZeroVolume = newVol;
      }
      mainVideo.volume = newVol;
      updateVolumeUI();
    } else if (e.key === 'f' || e.key === 'F') {
      fullscreenBtn.click();
    } else if (e.key === 'm' || e.key === 'M') {
      volumeMuteBtn.click();
    } else if (e.key === 't' || e.key === 'T') {
      if (isTrimMode) exitTrimMode();
      else enterTrimMode();
    } else if (e.key === 'Escape') {
      if (sideInfoDrawer && sideInfoDrawer.classList.contains('open')) {
        closeInfoDrawer();
      } else if (isTrimMode) {
        exitTrimMode();
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, true);
});


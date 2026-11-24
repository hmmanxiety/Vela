const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execFile } = require('child_process');

app.name = 'Vela';
try {
  app.setAppUserModelId('Vela');
} catch (e) {}
try {
  app.setPath('userData', path.join(app.getPath('appData'), 'Vela'));
} catch (e) {}

// Enable GPU acceleration, hardware decoding, and modern codec support
app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;

const ALL_VIDEO_EXTENSIONS = [
  'mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv', 'ts', 'm2ts', 'mts',
  'm4v', '3gp', 'vob', 'mpg', 'mpeg', 'ogv', 'rmvb', 'divx', 'asf', 'f4v',
  'hevc', 'h264', 'h265', 'm2v', 'mxf'
];

const ALL_AUDIO_EXTENSIONS = [
  'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'opus', 'wma', 'alac', 'aiff'
];

const ALL_MEDIA_EXTENSIONS = [
  ...ALL_VIDEO_EXTENSIONS,
  ...ALL_AUDIO_EXTENSIONS
];

const STORE_PATH = path.join(app.getPath('userData'), 'vela_data.json');

function extractFilePathFromArgv(argv) {
  if (!Array.isArray(argv)) return null;
  for (let i = 1; i < argv.length; i++) {
    let arg = argv[i];
    if (arg && typeof arg === 'string') {
      arg = arg.replace(/^"|"$/g, '').trim();
      if (!arg.startsWith('--') && !arg.startsWith('-') && arg !== '.') {
        try {
          if (fs.existsSync(arg) && fs.statSync(arg).isFile()) {
            return path.resolve(arg);
          }
        } catch (e) {}
      }
    }
  }
  return null;
}

let initialFilePath = extractFilePathFromArgv(process.argv);

// Single instance lock - if user double-clicks another video in Windows, route to running instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
      const newFile = extractFilePathFromArgv(commandLine);
      if (newFile) {
        mainWindow.webContents.send('app:open-file', newFile);
      }
    }
  });
}

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    }
  } catch (err) {}
  return { recentFiles: [], settings: { volume: 0.3 } };
}

function saveStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {}
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 800,
    minWidth: 880,
    minHeight: 560,
    backgroundColor: '#120908',
    frame: false, // True Borderless / Frameless window!
    hasShadow: true,
    roundedCorners: true,
    title: 'Vela',
    icon: path.join(__dirname, '..', 'assets', 'icon_white.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ==================== WINDOW MANAGEMENT IPC ====================
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  }
  return false;
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// ==================== MEDIA & FILE IPC ====================
ipcMain.handle('app:get-initial-file', () => {
  const file = initialFilePath;
  initialFilePath = null;
  return file;
});

ipcMain.handle('dialog:open-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Media in VELA',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Supported Media', extensions: ALL_MEDIA_EXTENSIONS },
      { name: 'Audio Files (MP3, WAV, FLAC, M4A, OGG)', extensions: ALL_AUDIO_EXTENSIONS },
      { name: 'Video Files', extensions: ALL_VIDEO_EXTENSIONS },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled || !result.filePaths.length) return [];
  return result.filePaths;
});

ipcMain.handle('dialog:select-save-path', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Trimmed Clip (Optimized)',
    defaultPath: defaultName || 'VELA_Clip.mp4',
    filters: [
      { name: 'MP4 Video (Universal & Optimized)', extensions: ['mp4'] },
      { name: 'MKV Video', extensions: ['mkv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePath || null;
});

ipcMain.handle('media:trim-video', async (event, { inputPath, outputPath, startSec, endSec, optimize = true }) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(inputPath)) return reject(new Error('Input file does not exist'));

    const duration = Math.max(0.1, endSec - startSec);

    const runFfmpeg = (args) => {
      return new Promise((res, rej) => {
        const proc = spawn('ffmpeg', args);
        let stderr = '';
        proc.stderr.on('data', d => stderr += d.toString());
        proc.on('close', code => {
          if (code === 0 && fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
            res({ success: true, outputPath, duration, sizeBytes: stats.size, sizeMB });
          } else {
            rej(new Error(`FFmpeg exited with code ${code}: ${stderr.slice(-300)}`));
          }
        });
        proc.on('error', err => rej(err));
      });
    };

    if (optimize) {
      // 1. Try Hardware NVENC with Visual Transparency (CQ 21) & Universal Web Compatibility
      const nvencArgs = [
        '-ss', startSec.toString(),
        '-to', endSec.toString(),
        '-i', inputPath,
        '-map', '0:v:0',
        '-map', '0:a?',
        '-c:v', 'h264_nvenc',
        '-preset', 'p5',
        '-tune', 'hq',
        '-rc', 'vbr',
        '-cq', '21',
        '-b:v', '0',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
        '-y',
        outputPath
      ];

      runFfmpeg(nvencArgs)
        .then(result => resolve({ ...result, mode: 'optimized-nvenc' }))
        .catch(err => {
          console.warn('NVENC failed, falling back to CPU x264:', err.message);
          // 2. High-quality CPU fallback (CRF 21, faster preset)
          const cpuArgs = [
            '-ss', startSec.toString(),
            '-to', endSec.toString(),
            '-i', inputPath,
            '-map', '0:v:0',
            '-map', '0:a?',
            '-c:v', 'libx264',
            '-preset', 'faster',
            '-crf', '21',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-movflags', '+faststart',
            '-y',
            outputPath
          ];
          runFfmpeg(cpuArgs)
            .then(result => resolve({ ...result, mode: 'optimized-cpu' }))
            .catch(cpuErr => {
              console.warn('CPU encode failed, falling back to stream copy:', cpuErr.message);
              // 3. Fallback to copy
              const copyArgs = [
                '-ss', startSec.toString(),
                '-to', endSec.toString(),
                '-i', inputPath,
                '-c', 'copy',
                '-avoid_negative_ts', 'make_zero',
                '-y',
                outputPath
              ];
              runFfmpeg(copyArgs)
                .then(result => resolve({ ...result, mode: 'stream-copy' }))
                .catch(copyErr => reject(copyErr));
            });
        });
    } else {
      // Direct Stream Copy (Original raw bitrate)
      const copyArgs = [
        '-ss', startSec.toString(),
        '-to', endSec.toString(),
        '-i', inputPath,
        '-c', 'copy',
        '-avoid_negative_ts', 'make_zero',
        '-y',
        outputPath
      ];
      runFfmpeg(copyArgs)
        .then(result => resolve({ ...result, mode: 'stream-copy' }))
        .catch(err => {
          // Fallback to CPU encode
          const cpuArgs = [
            '-ss', startSec.toString(),
            '-to', endSec.toString(),
            '-i', inputPath,
            '-map', '0:v:0',
            '-map', '0:a?',
            '-c:v', 'libx264',
            '-preset', 'faster',
            '-c:a', 'aac',
            '-y',
            outputPath
          ];
          runFfmpeg(cpuArgs)
            .then(result => resolve({ ...result, mode: 'fallback-cpu' }))
            .catch(fErr => reject(fErr));
        });
    }
  });
});

ipcMain.handle('media:get-file-details', async (event, filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) return null;
    const stats = fs.statSync(filePath);
    const rawExt = path.extname(filePath).replace('.', '');
    const ext = rawExt.toUpperCase();
    const name = path.basename(filePath);
    const isAudio = ALL_AUDIO_EXTENSIONS.includes(rawExt.toLowerCase());

    // Exact size formatting
    const sizeInMB = stats.size / (1024 * 1024);
    let sizeMBStr = '';
    if (sizeInMB >= 1000) {
      sizeMBStr = (sizeInMB / 1024).toFixed(2) + ' GB';
    } else if (sizeInMB >= 1) {
      sizeMBStr = sizeInMB.toFixed(1) + ' MB';
    } else {
      sizeMBStr = (stats.size / 1024).toFixed(1) + ' KB';
    }

    // Call ffprobe to probe actual video/audio stream properties
    let probeData = null;
    try {
      probeData = await new Promise((resolve) => {
        execFile('ffprobe', [
          '-v', 'quiet',
          '-print_format', 'json',
          '-show_format',
          '-show_streams',
          filePath
        ], { timeout: 3500 }, (err, stdout) => {
          if (!err && stdout) {
            try {
              resolve(JSON.parse(stdout));
            } catch (e) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } catch (e) {
      probeData = null;
    }

    let videoStream = null;
    let audioStream = null;
    if (probeData && Array.isArray(probeData.streams)) {
      videoStream = probeData.streams.find(s => s.codec_type === 'video' && s.disposition && s.disposition.attached_pic !== 1);
      if (!videoStream) {
        // If no regular video stream, find any video stream if it's not pure audio
        videoStream = probeData.streams.find(s => s.codec_type === 'video');
      }
      audioStream = probeData.streams.find(s => s.codec_type === 'audio');
    }

    // Extract ID3 / audio metadata tags
    let title = '';
    let artist = '';
    let album = '';
    let bpm = '';
    if (probeData && probeData.format && probeData.format.tags) {
      const tags = probeData.format.tags;
      title = tags.title || tags.TITLE || tags.Title || tags.TIT2 || '';
      artist = tags.artist || tags.ARTIST || tags.Artist || tags.TPE1 || tags.album_artist || tags.ALBUM_ARTIST || '';
      album = tags.album || tags.ALBUM || tags.Album || tags.TALB || '';
      bpm = tags.bpm || tags.BPM || tags.TBPM || tags.tempo || tags.TEMPO || '';
    }
    if (!bpm && audioStream && audioStream.tags) {
      const aTags = audioStream.tags;
      bpm = aTags.bpm || aTags.BPM || aTags.TBPM || aTags.tempo || aTags.TEMPO || '';
    }
    if (bpm) {
      const parsedBpm = parseFloat(bpm);
      if (!isNaN(parsedBpm) && parsedBpm > 0) {
        bpm = Math.round(parsedBpm).toString();
      }
    }

    // If pure audio file, extract embedded cover art image if present
    let coverArt = null;
    if (isAudio) {
      try {
        coverArt = await new Promise((resolve) => {
          execFile('ffmpeg', [
            '-i', filePath,
            '-an',
            '-vcodec', 'copy',
            '-f', 'image2pipe',
            '-'
          ], { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024, timeout: 3000 }, (err, stdout) => {
            if (!err && stdout && stdout.length > 32) {
              resolve('data:image/jpeg;base64,' + stdout.toString('base64'));
            } else {
              resolve(null);
            }
          });
        });
      } catch (e) {
        coverArt = null;
      }
    }

    // Exact FPS calculation from streams
    let fps = '60';
    const rateStr = (videoStream && videoStream.avg_frame_rate && videoStream.avg_frame_rate !== '0/0')
      ? videoStream.avg_frame_rate
      : (videoStream ? videoStream.r_frame_rate : null);
    if (rateStr && rateStr !== '0/0') {
      const parts = rateStr.split('/');
      if (parts.length === 2 && Number(parts[1]) > 0) {
        const calculated = Number(parts[0]) / Number(parts[1]);
        if (calculated > 0 && isFinite(calculated)) {
          fps = (Math.abs(calculated - Math.round(calculated)) < 0.05)
            ? Math.round(calculated).toString()
            : calculated.toFixed(2);
        }
      }
    }

    // Exact Duration formatting
    const durationSec = probeData && probeData.format && probeData.format.duration
      ? Number(probeData.format.duration)
      : (videoStream && videoStream.duration ? Number(videoStream.duration) : null);
    let durationFormatted = '';
    if (durationSec && isFinite(durationSec)) {
      const h = Math.floor(durationSec / 3600);
      const m = Math.floor((durationSec % 3600) / 60);
      const s = Math.floor(durationSec % 60);
      if (h > 0) {
        durationFormatted = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      } else {
        durationFormatted = `${m}:${s.toString().padStart(2, '0')}`;
      }
    }

    // Exact Pixel & Colorspace info
    const pixFmt = videoStream ? (videoStream.pix_fmt || 'yuv420p') : 'yuv420p';
    const colorSpace = videoStream ? (videoStream.color_space || (videoStream.height >= 720 ? 'bt709' : 'bt601')) : 'bt709';
    const colorTransfer = videoStream && videoStream.color_transfer ? videoStream.color_transfer : `${colorSpace}/bt.1886`;

    // Exact Audio info
    let audioCodec = 'aac';
    let sampleRate = '48000';
    let channels = 'stereo';
    let hasAudio = false;

    if (audioStream) {
      hasAudio = true;
      audioCodec = (audioStream.codec_name || 'aac').toLowerCase();
      sampleRate = audioStream.sample_rate || '48000';
      if (audioStream.channel_layout) {
        channels = audioStream.channel_layout;
      } else if (audioStream.channels === 1) {
        channels = 'mono';
      } else if (audioStream.channels === 2) {
        channels = 'stereo';
      } else if (audioStream.channels > 2) {
        channels = `${audioStream.channels}ch`;
      }
    }

    return {
      name,
      path: filePath,
      size: stats.size,
      sizeMB: sizeMBStr,
      ext,
      isAudio,
      title: title || path.parse(filePath).name,
      artist: artist || '',
      album: album || '',
      coverArt,
      duration: durationSec,
      durationFormatted,
      width: (!isAudio && videoStream) ? videoStream.width : null,
      height: (!isAudio && videoStream) ? videoStream.height : null,
      videoCodec: (!isAudio && videoStream) ? (videoStream.codec_name || 'h264') : null,
      pixFmt,
      colorSpace,
      colorTransfer,
      fps,
      hasAudio,
      audioCodec,
      sampleRate,
      channels,
      bpm: bpm || null
    };
  } catch (err) {
    return null;
  }
});

ipcMain.handle('store:load', async () => loadStore());
ipcMain.handle('store:save', async (event, data) => saveStore(data));
ipcMain.handle('system:show-in-folder', async (event, filePath) => shell.showItemInFolder(filePath));

ipcMain.handle('folder:get-sibling-videos', async (event, filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) return { files: [], currentIndex: -1 };
    const dir = path.dirname(filePath);
    const validExtensions = new Set(ALL_MEDIA_EXTENSIONS.map(ext => `.${ext.toLowerCase()}`));
    const dirEntries = fs.readdirSync(dir, { withFileTypes: true });

    const videoFiles = dirEntries
      .filter(entry => entry.isFile() && validExtensions.has(path.extname(entry.name).toLowerCase()))
      .map(entry => entry.name)
      .sort(new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare)
      .map(name => path.join(dir, name));

    const normalizedCurrent = path.normalize(filePath).toLowerCase();
    const currentIndex = videoFiles.findIndex(f => path.normalize(f).toLowerCase() === normalizedCurrent);

    return {
      files: videoFiles,
      currentIndex: currentIndex >= 0 ? currentIndex : 0
    };
  } catch (err) {
    console.error('Error getting sibling videos:', err);
    return { files: [], currentIndex: -1 };
  }
});

// ==================== SPOTIFY-STYLE SYNCHRONIZED LYRICS ENGINE ====================
const lyricsMemoryCache = new Map();

function cleanTitleForLyrics(raw) {
  if (!raw) return '';
  let s = raw.replace(/\.[^/.]+$/, '');
  s = s.replace(/^\d+[\s\.\-_]+/, '');
  s = s.replace(/\s*[\(\[](?:feat|ft|with|prod)[\.\s][^\)\]]+[\)\]]/gi, '');
  s = s.replace(/\s*[\(\[](?:official|video|audio|lyrics|music|remaster|hd|hq|4k|deluxe|version)[^\)\]]*[\)\]]/gi, '');
  s = s.replace(/#[a-zA-Z0-9_\-]+/g, '');
  s = s.replace(/\s*-\s*(?:slowed|sped up|reverb|remix|edit|tiktok).*$/i, '');
  return s.trim();
}

ipcMain.handle('media:fetch-lyrics', async (event, { filePath, title, artist, album, duration }) => {
  try {
    if (!filePath) return { found: false, lyrics: null };

    // 1. Check local .lrc file in the same folder
    try {
      const dir = path.dirname(filePath);
      const baseNoExt = path.parse(filePath).name;
      const localLrcPath = path.join(dir, baseNoExt + '.lrc');
      if (fs.existsSync(localLrcPath)) {
        const fileContent = fs.readFileSync(localLrcPath, 'utf8');
        if (fileContent && fileContent.trim()) {
          return { found: true, synced: true, lyrics: fileContent, source: 'local' };
        }
      }
    } catch (e) {}

    // Clean title & artist
    let cleanT = cleanTitleForLyrics(title || path.parse(filePath).name);
    let cleanA = (artist && artist !== 'Unknown Artist') ? artist.trim() : '';

    // If artist is empty, try splitting "Artist - Title" from filename
    if (!cleanA && cleanT.includes(' - ')) {
      const parts = cleanT.split(' - ');
      cleanA = parts[0].trim();
      cleanT = parts.slice(1).join(' - ').trim();
    }

    const cacheKey = `${cleanT}___${cleanA}`.toLowerCase();
    if (lyricsMemoryCache.has(cacheKey)) {
      return lyricsMemoryCache.get(cacheKey);
    }

    const durSec = duration ? Math.round(Number(duration)) : null;
    let result = null;

    // 2. Query LRCLIB via /api/get
    if (cleanT && cleanA) {
      try {
        const params = new URLSearchParams({
          track_name: cleanT,
          artist_name: cleanA
        });
        if (album) params.append('album_name', album);
        if (durSec && durSec > 0) params.append('duration', durSec.toString());

        const res = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
          headers: { 'User-Agent': 'VelaMediaPlayer/2.0' },
          signal: AbortSignal.timeout(4500)
        });
        if (res.ok) {
          result = await res.json();
        }
      } catch (e) {}
    }

    // 3. Fallback to /api/search with fuzzy track/artist query
    if (!result || (!result.syncedLyrics && !result.plainLyrics)) {
      try {
        const query = cleanA ? `${cleanT} ${cleanA}` : cleanT;
        const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(query)}`, {
          headers: { 'User-Agent': 'VelaMediaPlayer/2.0' },
          signal: AbortSignal.timeout(4500)
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            let candidate = list.find(item => item.syncedLyrics && durSec && Math.abs(item.duration - durSec) <= 6);
            if (!candidate) candidate = list.find(item => item.syncedLyrics);
            if (!candidate) candidate = list[0];
            result = candidate;
          }
        }
      } catch (e) {}
    }

    if (result && (result.syncedLyrics || result.plainLyrics)) {
      const payload = {
        found: true,
        synced: Boolean(result.syncedLyrics),
        lyrics: result.syncedLyrics || result.plainLyrics,
        trackName: result.trackName || cleanT,
        artistName: result.artistName || cleanA,
        source: 'lrclib'
      };
      lyricsMemoryCache.set(cacheKey, payload);
      return payload;
    }

    const notFound = { found: false, synced: false, lyrics: null };
    lyricsMemoryCache.set(cacheKey, notFound);
    return notFound;
  } catch (err) {
    return { found: false, synced: false, lyrics: null };
  }
});

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'dist');
const outputFile = path.join(outputDir, 'maplesoundz-single.html');

const tracks = [
  {
    basename: 'pickup.mp3',
    file: 'event-audio/basic/pickup.mp3',
    art: 'pickup.png',
  },
  {
    basename: 'level-up.mp3',
    file: 'event-audio/basic/level-up.mp3',
    art: 'level-up.png',
  },
  {
    basename: 'jump.mp3',
    file: 'event-audio/basic/jump.mp3',
    art: 'jump.png',
  },
  {
    basename: 'teleport-portal.mp3',
    file: 'event-audio/basic/teleport-portal.mp3',
    art: 'teleport-portal.png',
  },
  {
    basename: 'invite.mp3',
    file: 'event-audio/messaging/invite.mp3',
    art: 'invite.png',
  },
  {
    basename: 'quest-alert.mp3',
    file: 'event-audio/notifications/quest-alert.mp3',
    art: 'quest-alert.png',
  },
  {
    basename: 'quest-clear.mp3',
    file: 'event-audio/notifications/quest-clear.mp3',
    art: 'quest-clear.png',
  },
  {
    basename: 'NxLogo.mp3',
    file: 'ui-audio/BgmUI.img/NxLogo.mp3',
    art: 'nx-logo.png',
  },
  {
    basename: 'Title.mp3',
    file: 'ui-audio/BgmUI.img/Title.mp3',
    art: 'title.png',
  },
  {
    basename: 'WzLogo.mp3',
    file: 'ui-audio/BgmUI.img/WzLogo.mp3',
    art: 'wz-logo.png',
  },
  {
    basename: 'BtMouseOver.mp3',
    file: 'ui-audio/UI.img/BtMouseOver.mp3',
    art: 'bt-mouse-over.png',
  },
  {
    basename: 'CharSelect.mp3',
    file: 'ui-audio/UI.img/CharSelect.mp3',
    art: 'char-select.png',
  },
  {
    basename: 'DlgNotice.mp3',
    file: 'ui-audio/UI.img/DlgNotice.mp3',
    art: 'dlg-notice.png',
  },
  {
    basename: 'DragEnd.mp3',
    file: 'ui-audio/UI.img/DragEnd.mp3',
    art: 'drag-end.png',
  },
  {
    basename: 'ScrollUp.mp3',
    file: 'ui-audio/UI.img/ScrollUp.mp3',
    art: 'scroll-up.png',
  },
];

function readFile(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function toDataUri(relPath) {
  const absPath = path.join(root, relPath);
  const ext = path.extname(absPath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png',
  };
  const mimeType = mimeTypes[ext];

  if (!mimeType) {
    throw new Error(`Unsupported asset type for ${relPath}`);
  }

  const base64 = fs.readFileSync(absPath).toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

function escapeScript(text) {
  return text.replace(/<\/script/gi, '<\\/script');
}

const backgroundDataUri = toDataUri('public/assets/background-art.jpg');
const css = readFile('public/assets/styles.css').replace(
  'url("/assets/background-art.jpg")',
  `url("${backgroundDataUri}")`
);

const embeddedTracks = tracks.map((track) => ({
  basename: track.basename,
  art: toDataUri(`public/assets/game-art/${track.art}`),
  audio: toDataUri(track.file),
}));

const appJs = `
const tracks = ${JSON.stringify(embeddedTracks)};

const root = document.querySelector('#app');
const cardTemplate = document.querySelector('#card-template');

let activeAudio = null;
let activeCard = null;

function stopActivePlayback() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }

  if (activeCard) {
    activeCard.classList.remove('is-playing');
  }

  activeAudio = null;
  activeCard = null;
}

function handlePlay(audio, card) {
  const isSameTrack = activeAudio === audio;

  stopActivePlayback();

  if (isSameTrack) {
    return;
  }

  activeAudio = audio;
  activeCard = card;
  card.classList.add('is-playing');
  audio.play().catch(() => {
    stopActivePlayback();
  });
}

function createTrackCard(track) {
  const fragment = cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.sound-card');
  const image = fragment.querySelector('.card-art');
  const title = fragment.querySelector('.card-title');
  const audio = fragment.querySelector('audio');

  image.src = track.art;
  image.alt = track.basename;
  title.textContent = track.basename.replace(/\\.mp3$/i, '');
  audio.src = track.audio;

  card.addEventListener('click', () => handlePlay(audio, card));
  audio.addEventListener('ended', () => {
    if (activeAudio === audio) {
      stopActivePlayback();
    }
  });

  return fragment;
}

for (const track of tracks) {
  root.appendChild(createTrackCard(track));
}
`;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MapleSoundz</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div class="page-shell">
      <main id="app" class="soundboard"></main>
    </div>

    <template id="card-template">
      <button class="sound-card" type="button">
        <div class="card-art-wrap">
          <div class="card-glow"></div>
          <img class="card-art" alt="" />
        </div>
        <p class="card-title"></p>
        <audio preload="none"></audio>
      </button>
    </template>

    <script>
${escapeScript(appJs)}
    </script>
  </body>
</html>
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, html);
console.log(`Wrote ${path.relative(root, outputFile)}`);

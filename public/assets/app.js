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

  image.src = `/assets/game-art/${track.art}`;
  image.alt = track.basename;
  title.textContent = track.basename.replace(/\.mp3$/i, '');
  audio.src = `/${track.file}`;

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

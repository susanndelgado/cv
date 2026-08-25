/* ======================
    NAV
 ====================== */
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

function closeMenu() {
  navigation.classList.remove("open");

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

function openMenu() {
  navigation.classList.add("open");

  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

/* close when a navigation item is selected */

navigation.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    closeMenu();
  }
});

/* close if user clicks elsewhere */

document.addEventListener("click", (event) => {
  const clickedMenu = navigation.contains(event.target);

  const clickedButton = menuButton.contains(event.target);

  if (!clickedMenu && !clickedButton) {
    closeMenu();
  }
});

/* close with Escape */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();

    menuButton.focus();
  }
});

/* ======================
   SANDBOX UI SOUND
   ====================== */

let audioContext;

function enableAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

/* ---------- CREATE UI TONE ---------- */

function playInterfaceSound(frequency = 520, duration = 0.035, volume = 0.025) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gain.gain.setValueAtTime(volume, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration,
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(audioContext.currentTime + duration);
}

/* ---------- ENABLE AUDIO AFTER INTERACTION ---------- */

document.addEventListener("pointerdown", enableAudio, {
  once: true,
});

document.addEventListener("keydown", enableAudio, {
  once: true,
});

/* ---------- HOVER SOUND ---------- */

document.addEventListener("pointerover", (event) => {
  const control = event.target.closest("a, button, .project-card");

  if (!control) return;

  /*
   Prevent sound from repeating while moving
   between children inside the same control.
  */
  if (event.relatedTarget && control.contains(event.relatedTarget)) {
    return;
  }

  playInterfaceSound(540, 0.035, 0.018);
});

/* ---------- CLICK SOUND ---------- */

document.addEventListener("click", (event) => {
  const control = event.target.closest("a, button, .project-card");

  if (!control) return;

  enableAudio();

  playInterfaceSound(760, 0.045, 0.025);
});

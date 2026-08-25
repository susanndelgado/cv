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
    NAV END
 ====================== */

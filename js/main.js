const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const reserveForm = document.querySelector(".reserve-form");
const formStatus = document.querySelector("#form-status");
const reservationDate = document.querySelector("#reservation-date");
const mondayNotice = document.querySelector("[data-monday-notice]");

function isMonday(value) {
  if (!value) return false;

  const date = new Date(`${value}T12:00:00`);
  return date.getDay() === 1;
}

function updateMondayState() {
  if (!reservationDate || !mondayNotice) return false;

  const mondaySelected = isMonday(reservationDate.value);
  mondayNotice.hidden = !mondaySelected;

  if (mondaySelected) {
    reservationDate.setCustomValidity(
      "Mondays are first come, first served for Trivia Night — no reservations are taken.",
    );
  } else {
    reservationDate.setCustomValidity("");
  }

  return mondaySelected;
}

if (navToggle && siteNav) {
  const setNavState = (isOpen) => {
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-open", isOpen);
  };

  navToggle.addEventListener("click", () => {
    const isOpen = !siteNav.classList.contains("is-open");
    setNavState(isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      setNavState(false);
      navToggle.focus();
    }
  });
}

if (reservationDate) {
  reservationDate.addEventListener("change", updateMondayState);
  reservationDate.addEventListener("input", updateMondayState);
}

if (reserveForm && formStatus) {
  reserveForm.addEventListener("submit", (event) => {
    const mondaySelected = updateMondayState();

    if (mondaySelected) {
      event.preventDefault();
      reservationDate?.reportValidity();
      formStatus.textContent =
        "Mondays are first come, first served for Trivia Night — no reservations are taken.";
      return;
    }

    if (!reserveForm.checkValidity()) {
      event.preventDefault();
      reserveForm.reportValidity();
      formStatus.textContent = "";
      return;
    }

    const action = reserveForm.getAttribute("action")?.trim() ?? "";
    const isPlaceholderAction = action === "" || action === "#";

    if (isPlaceholderAction) {
      event.preventDefault();
      formStatus.textContent =
        "Reservation requests are not yet connected. Replace the form action with a Formspree endpoint for red@thecanarybk.com.";
      return;
    }

    formStatus.textContent =
      "Thanks — your reservation request has been sent. Your table is not confirmed until you hear back from The Canary.";
  });
}

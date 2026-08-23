const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const reserveForm = document.querySelector(".reserve-form");
const formStatus = document.querySelector("#form-status");
const reservationDate = document.querySelector("#reservation-date");
const mondayNotice = document.querySelector("[data-monday-notice]");
const successMessageLead = "Thanks — your reservation request has been sent.";
const successMessageDetail =
  "Your table is not confirmed until you hear back from The Canary.";

function setFormStatus(content = "", state = "") {
  formStatus.classList.remove("is-success", "is-error");

  if (!content) {
    formStatus.textContent = "";
    return;
  }

  if (state === "success") {
    formStatus.classList.add("is-success");
  } else if (state === "error") {
    formStatus.classList.add("is-error");
  }

  formStatus.innerHTML = content;
}

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
  reserveForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus();

    const mondaySelected = updateMondayState();

    if (mondaySelected) {
      reservationDate?.reportValidity();
      setFormStatus(
        "Mondays are first come, first served for Trivia Night — no reservations are taken.",
        "error",
      );
      return;
    }

    if (!reserveForm.checkValidity()) {
      reserveForm.reportValidity();
      return;
    }

    try {
      const response = await fetch(reserveForm.action, {
        method: reserveForm.method || "POST",
        body: new FormData(reserveForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }

      setFormStatus(
        `<span class="form-status-lead">${successMessageLead}</span><span class="form-status-detail">${successMessageDetail}</span>`,
        "success",
      );
      reserveForm.reset();
      mondayNotice.hidden = true;
      reservationDate?.setCustomValidity("");
    } catch {
      setFormStatus(
        "Something went wrong while sending your request. Please try again.",
        "error",
      );
    }
  });
}

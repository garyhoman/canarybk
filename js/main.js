const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

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

const inquiriesForm = document.querySelector(".inquiry-form");
const inquiriesStatus = document.querySelector("#inquiry-form-status");

if (inquiriesForm && inquiriesStatus) {
  inquiriesForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    inquiriesStatus.textContent = "";
    inquiriesStatus.innerHTML = "";
    inquiriesStatus.classList.remove("is-success", "is-error");

    if (!inquiriesForm.checkValidity()) {
      inquiriesForm.reportValidity();
      return;
    }

    try {
      const response = await fetch(inquiriesForm.action, {
        method: "POST",
        body: new FormData(inquiriesForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        inquiriesStatus.classList.add("is-success");
        inquiriesStatus.textContent =
          "Thanks — your message has been sent. We'll be in touch soon.";
        inquiriesForm.reset();
        return;
      }

      inquiriesStatus.classList.add("is-error");
      inquiriesStatus.innerHTML =
        'Something went wrong. Please try again or email <a href="mailto:red@thecanarybk.com">red@thecanarybk.com</a>.';
    } catch (error) {
      inquiriesStatus.classList.add("is-error");
      inquiriesStatus.innerHTML =
        'Something went wrong. Please try again or email <a href="mailto:red@thecanarybk.com">red@thecanarybk.com</a>.';
    }
  });
}

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

    const submitButton = inquiriesForm.querySelector('[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }

    try {
      const formData = new FormData(inquiriesForm);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(inquiriesForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      inquiriesStatus.classList.add("is-success");
      inquiriesStatus.textContent =
        "Thanks — your message has been sent. We'll be in touch soon.";
      inquiriesForm.reset();
    } catch (error) {
      inquiriesStatus.classList.add("is-error");
      inquiriesStatus.innerHTML =
        'Something went wrong. Please try again or email <a href="mailto:gazhoman@yahoo.ie">gazhoman@yahoo.ie</a>.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

// GitHub Pages contact flow: prepare a draft; the visitor sends it in their email app.
(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const reason = form.elements.namedItem("reason");
  const fundingHelp = document.getElementById("funding-help");
  const draft = document.getElementById("contact-draft");
  const status = document.getElementById("contact-status");
  const emailLink = document.getElementById("open-contact-email");
  const requestedReason = new URLSearchParams(window.location.search).get("reason");
  if (Array.from(reason.options).some(option => option.value === requestedReason)) {
    reason.value = requestedReason;
  }

  function updateReason() {
    fundingHelp.hidden = reason.value !== "funding";
    if (reason.value === "funding") reason.setAttribute("aria-describedby", "funding-help");
    else reason.removeAttribute("aria-describedby");
  }

  form.addEventListener("input", () => {
    updateReason();
    // Invalidate a prepared draft so it never sends older form values.
    draft.hidden = true;
    emailLink.removeAttribute("href");
    status.textContent = "";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const value = name => form.elements.namedItem(name).value.trim();
    const subject = `STARI — ${reason.selectedOptions[0].textContent}`;
    const body = [
      "Hello John,", "", value("message"), "",
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      ...(value("organization") ? [`Organization: ${value("organization")}`] : [])
    ].join("\n");
    emailLink.href = `mailto:monnier@umich.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById("draft-subject").value = subject;
    document.getElementById("draft-body").value = body;
    draft.hidden = false;
    status.textContent = "Your draft is ready. Open your email app to review and send it. No message has been sent yet.";
    emailLink.focus();
  });

  updateReason();
  form.hidden = false;
})();

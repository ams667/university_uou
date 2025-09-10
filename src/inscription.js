document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("successMessage");

  function validateField(field, errorElement, validationFn) {
    const isValid = validationFn(field.value.trim());
    if (!isValid) {
      field.classList.add("input-error");
      errorElement.style.display = "block";
    } else {
      field.classList.remove("input-error");
      errorElement.style.display = "none";
    }
    return isValid;
  }

  const validators = {
    text: (v) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test(v),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: (v) => /^[\+]?[0-9\s\-\(\)]{8,}$/.test(v),
    domaines: (v) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test(v),
    radio: () => document.querySelector('input[name="sexe"]:checked') !== null,
  };

  const fields = [
    { id: "firstName", type: "text" },
    { id: "lastName", type: "text" },
    { id: "email", type: "email" },
    { id: "phone", type: "phone" },
    { id: "domaines", type: "domaines" },
  ];

  fields.forEach(({ id, type }) => {
    const field = document.getElementById(id);
    const errorElement = document.getElementById(id + "Error");

    field.addEventListener("blur", () => validateField(field, errorElement, validators[type]));
    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) validateField(field, errorElement, validators[type]);
    });
  });

  document.querySelectorAll('input[name="sexe"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById("sexeError").style.display = "none";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isFormValid = true;
    fields.forEach(({ id, type }) => {
      const field = document.getElementById(id);
      const errorElement = document.getElementById(id + "Error");
      if (!validateField(field, errorElement, validators[type])) isFormValid = false;
    });

    const sexeError = document.getElementById("sexeError");
    if (!validators.radio()) {
      sexeError.style.display = "block";
      isFormValid = false;
    } else {
      sexeError.style.display = "none";
    }

    if (!isFormValid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ri-loader-line"></i> Envoi en cours...';

    // Vérifie que form.action est défini
    const action = form.getAttribute("action");
    if (!action) {
      console.error("Le formulaire n'a pas d'attribut action !");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="ri-send-plane-line"></i> S\'inscrire';
      return;
    }

    const formData = new FormData(form);

    fetch(action, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          successMessage.style.display = "block";
          form.reset();
          successMessage.scrollIntoView({ behavior: "smooth" });
        } else {
          throw new Error("Erreur de réseau ou endpoint invalide");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="ri-send-plane-line"></i> S\'inscrire';
      });
  });

  // Animation description
  setTimeout(() => {
    const desc = document.querySelector(".inscription_description");
    if (desc) {
      desc.style.opacity = "1";
      desc.style.transform = "translateY(-60px)";
    }
  }, 500);
});

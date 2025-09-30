import './inscription.css';

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
    text: (value) => /^[A-za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test(value),
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\+]?[0-9\s\-\(\)]{8,}$/.test(value),
    domaines: (value) => /^[A-za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test(value),
    radio: () => document.querySelector('input[name="sexe"]:checked') !== null,
  };

  const fields = [
    { id: "firstName", type: "text" },
    { id: "lastName", type: "text" },
    { id: "email", type: "email" },
    { id: "phone", type: "phone" },
    { id: "domaines", type: "domaines" },
  ];

  const domaineField = document.getElementById("domaines");
  const domaineError = document.getElementById("domainesError");

  domaineField.addEventListener("change", () => {
    validateField(domaineField, domaineError, validators.domaines);
  });

  fields.forEach(({ id, type }) => {
    const field = document.getElementById(id);
    const errorElement = document.getElementById(id + "Error");

    field.addEventListener("blur", () => {
      validateField(field, errorElement, validators[type]);
    });

    field.addEventListener("input", () => {
      if (field.classList.contains("input-error")) {
        validateField(field, errorElement, validators[type]);
      }
    });
  });

  document.querySelectorAll('input[name="sexe"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const errorElement = document.getElementById("sexeError");
      errorElement.style.display = "none";
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isFormValid = true;

    fields.forEach(({ id, type }) => {
      const field = document.getElementById(id);
      const errorElement = document.getElementById(id + "Error");
      const isValid = validateField(field, errorElement, validators[type]);
      if (!isValid) isFormValid = false;
    });

    const sexeError = document.getElementById("sexeError");
    const isSexeValid = validators.radio();
    if (!isSexeValid) {
      sexeError.style.display = "block";
      isFormValid = false;
    } else {
      sexeError.style.display = "none";
    }

    if (isFormValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-line"></i> Envoi en cours...';

      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
        mode: "cors",
      })
        .then((response) => {
          if (response.ok) {
            successMessage.style.display = "block";
            form.reset();

            successMessage.scrollIntoView({ behavior: "smooth" });
          } else {
            throw new Error("Erreur de réseau");
          }
        })
        .catch((error) => {
          console.error("Erreur:", error);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<i class="ri-send-plane-line"></i> S\'inscrire';
        });
    }
  });

  setTimeout(() => {
    document.querySelector(".inscription_description").style.opacity = "1";
    document.querySelector(".inscription_description").style.transform =
      "translateY(-40px)";
  }, 500);
});

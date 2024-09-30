let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  const activeLink = document.querySelector(`header nav a[href*='${id}']`);
  if (activeLink) activeLink.classList.add("active");
};

const showSkills = () => {
  const triggerBottom = (window.innerHeight / 5) * 4;
  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar) => {
    const barTop = bar.getBoundingClientRect().top;
    if (barTop < triggerBottom) {
      bar.classList.add("show");
    } else {
      bar.classList.remove("show");
    }
  });
};

const revealElements = document.querySelectorAll(".reveal");
const reveal = () => {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("active");
    }
  });
};

const validateForm = (name, email, phone, message) => {
  return {
    isValid: !!(name && email && phone && message),
    emailValid: isValidEmail(email),
    phoneValid: isValidPhone(phone),
  };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10,}$/; 
  return phoneRegex.test(phone);
};

const submitForm = () => {
  const form = document.getElementById("contact-form");
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      showMessage("Thank you for your message. It has been sent successfully!", "success");
      form.reset();
    } else {
      showMessage("Oops! There was a problem submitting your form. Please try again.", "error");
    }
  })
  .catch(error => {
    showMessage("Oops! There was a problem submitting your form. Please try again.", "error");
  });
};

const showMessage = (message, type) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  
  const contactSection = document.querySelector(".contact");
  contactSection.appendChild(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 5000);
};

// Throttle function for scroll events
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });

  window.onscroll = () => {
    let top = window.scrollY;
    sections.forEach((sec) => {
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        setActiveLink(id);
      }
    });

    showSkills();
    reveal();
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Typing effect
  const texts = ["Front-End Developer", "Student", "Video Editor", "Autodidact"];
  const typingElement = document.querySelector(".typing-text span");
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIndex < currentText.length) {
      typingElement.textContent += currentText.charAt(charIndex);
      charIndex++;
    } else if (isDeleting && charIndex > 0) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  }

  // Form validation and submission
  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const subject = document.querySelector('input[name="subject"]').value.trim();
    const message = document.querySelector('textarea[name="message"]').value.trim();

    const { isValid, emailValid, phoneValid } = validateForm(name, email, phone, message);

    if (!isValid) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }

    if (!emailValid) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!phoneValid) {
      showMessage("Please enter a valid phone number.", "error");
      return;
    }

    // If all validations pass, submit the form
    submitForm();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("starsContainer");
  const maxStars = 450;

  for (let i = 0; i < maxStars; i++) {
    setTimeout(createStar, i * 50);
  }

  function createStar() {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 2.5 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    const colors = ["#8a2be2", "#4b0082", "#d4fbff"];
    star.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    const duration = 2 + Math.random() * 8;
    star.style.animationDuration = duration + "s";

    const delay = Math.random() * 4;
    star.style.animationDelay = delay + "s";

    star.style.boxShadow = `0 0 ${size * 2}px ${star.style.backgroundColor}`;

    container.appendChild(star);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const hero = document.querySelector(".hero");
  const header = document.querySelector(".site-header");
  const footer = document.querySelector(".site-footer");
  const cta = document.querySelector("#cta");
  const heroImages = [
    "assets/img/hero-1.jpg",
    "assets/img/hero-2.jpg",
    "assets/img/hero-3.jpg",
  ];

  if (hero) {
    let currentIndex = 0;
    let transitionCount = 0;
    let activeLayer = null;
    let inactiveLayer = null;

    // Preload hero images to reduce flicker on first switch.
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const layerA = document.createElement("div");
    layerA.className = "hero-bg";
    const layerB = document.createElement("div");
    layerB.className = "hero-bg";
    hero.prepend(layerB);
    hero.prepend(layerA);

    activeLayer = layerA;
    inactiveLayer = layerB;
    activeLayer.className = `hero-bg hero-${currentIndex + 1}`;
    activeLayer.style.backgroundImage = `url("${heroImages[currentIndex]}")`;
    // Trigger the same transition on the very first image.
    requestAnimationFrame(() => {
      activeLayer.classList.add("is-active");
    });

    const crossfadeTo = (nextIndex) => {
      inactiveLayer.style.backgroundImage = `url("${heroImages[nextIndex]}")`;
      inactiveLayer.className = `hero-bg hero-${nextIndex + 1}`;
      inactiveLayer.classList.add("is-active");
      activeLayer.classList.remove("is-active");

      const previousActive = activeLayer;
      activeLayer = inactiveLayer;
      inactiveLayer = previousActive;
      currentIndex = nextIndex;
    };

    const slideTimer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % heroImages.length;
      crossfadeTo(nextIndex);
      transitionCount += 1;

      // Stop after one full loop (1 -> 2 -> 3 -> 1).
      if (nextIndex === 0 && transitionCount >= heroImages.length) {
        clearInterval(slideTimer);
      }
    }, 5000);
  }

  const daySection = document.querySelector("#day");
  const mascot = document.querySelector(".mascot");

  if (daySection && mascot) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 画面に入ったとき
            setTimeout(() => {
              mascot.classList.add("tilt-once");
            }, 150);
          } else {
            // 画面から出たとき
            mascot.classList.remove("tilt-once");
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(daySection);
  }

  const trustSection = document.querySelector("#trust");
  const trustNumbers = document.querySelectorAll(".trust-number");

  if (trustSection && trustNumbers.length > 0) {
    const animateCount = (element, target) => {
      const duration = 1400;
      const startTime = performance.now();

      const step = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const value = Math.round(target * eased);

        element.textContent = value.toString();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = target.toString();
        }
      };

      requestAnimationFrame(step);
    };

    const trustObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trustNumbers.forEach((number) => {
              const target = Number(number.dataset.target);
              animateCount(number, target);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.45,
      },
    );

    trustObserver.observe(trustSection);
  }

  if (header && footer && cta) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const onFinalPage = entry.isIntersecting;

        header.classList.toggle("is-hidden", onFinalPage);
        footer.classList.toggle("is-visible", onFinalPage);
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(cta);
  }
});

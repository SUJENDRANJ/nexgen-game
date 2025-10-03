export const createConfetti = (container) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-10px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';

    container.appendChild(confetti);

    const duration = 2000 + Math.random() * 1000;
    const startTime = Date.now();
    const startX = parseFloat(confetti.style.left);
    const endX = startX + (Math.random() - 0.5) * 30;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        confetti.style.top = `${progress * 100}%`;
        confetti.style.left = `${startX + (endX - startX) * progress}%`;
        confetti.style.transform = `rotate(${progress * 720}deg)`;
        confetti.style.opacity = 1 - progress;
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };

    requestAnimationFrame(animate);
  }
};

export const createSparkles = (element) => {
  const rect = element.getBoundingClientRect();
  const sparkleCount = 12;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${rect.left + rect.width / 2}px`;
    sparkle.style.top = `${rect.top + rect.height / 2}px`;
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';

    document.body.appendChild(sparkle);

    const angle = (i / sparkleCount) * Math.PI * 2;
    const distance = 100;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const currentDistance = distance * progress;
        const x = rect.left + rect.width / 2 + Math.cos(angle) * currentDistance;
        const y = rect.top + rect.height / 2 + Math.sin(angle) * currentDistance;

        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.opacity = 1 - progress;
        sparkle.style.transform = `scale(${1 + progress})`;

        requestAnimationFrame(animate);
      } else {
        sparkle.remove();
      }
    };

    requestAnimationFrame(animate);
  }
};

export const pulseAnimation = {
  animation: 'pulse 2s infinite',
};

export const glowAnimation = {
  animation: 'glow 1.5s ease-in-out infinite',
};

export const bounceAnimation = {
  animation: 'bounce 0.6s ease',
};

export const shakeAnimation = {
  animation: 'shake 0.5s ease',
};

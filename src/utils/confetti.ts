import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#f43f5e', '#10b981', '#fbbf24', '#f97316'],
    });
  } catch (e) {
    console.warn('Confetti error:', e);
  }
}

export function fireMatchConfetti() {
  try {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#ec4899'],
    });
  } catch (e) {
    console.warn('Confetti error:', e);
  }
}

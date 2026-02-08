/**
 * Letter-hover "flip rapidly between random letters" effect.
 * Implementation notes:
 * - We split the name into spans (one per character).
 * - On hover of a character, we quickly replace it with random glyphs for a short duration,
 *   then restore the original.
 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DEFAULT_FLIP_DURATION_MS = 420; // total scramble time
const DEFAULT_TICK_MS = 28;           // speed of flipping

function randomChar() {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

function splitIntoSpans(el) {
  const text = el.dataset.text ?? el.textContent ?? "";
  el.textContent = "";

  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch;
    span.dataset.original = ch;
    el.appendChild(span);
  });
}

function attachHoverScramble(container, opts = {}) {
  const durationMs = opts.durationMs ?? DEFAULT_FLIP_DURATION_MS;
  const tickMs = opts.tickMs ?? DEFAULT_TICK_MS;

  container.querySelectorAll(".char").forEach((span) => {
    let timer = null;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;

      const original = span.dataset.original ?? span.textContent;
      const startTime = performance.now();

      // Prevent multiple overlapping intervals on the same span
      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        const elapsed = performance.now() - startTime;

        // During scramble: show random characters
        if (elapsed < durationMs) {
          // keep spaces/punctuation stable if you ever use them
          if (original.trim() === "") {
            span.textContent = original;
          } else {
            span.textContent = randomChar();
          }
        } else {
          // Restore original and stop
          span.textContent = original;
          clearInterval(timer);
          timer = null;
          running = false;
        }
      }, tickMs);
    };

    // Hover triggers per-letter
    span.addEventListener("mouseenter", start);

    // If mouse leaves early, let it finish quickly and restore
    span.addEventListener("mouseleave", () => {
      // Optional: you can force immediate restore by uncommenting:
      // if (timer) clearInterval(timer);
      // span.textContent = span.dataset.original ?? span.textContent;
      // running = false; timer = null;
    });
  });
}

// Boot
const nameEl = document.getElementById("scrambleName");
if (nameEl) {
  splitIntoSpans(nameEl);
  attachHoverScramble(nameEl, {
    durationMs: 420,
    tickMs: 26,
  });
}
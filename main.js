/* ===================================================
   TARUN SHARMA - PIXEL GAME ENGINE SCRIPT
   8-Bit Starfield Canvas, NES Synthesizer Audio, Project Filter
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPixelStarfield();
    initProjectFiltering();
    initRetroAudioHUD();
    initCopyBeacons();
    initScrollSpy();
});

/* ===================================================
   1. 8-BIT RETRO STARFIELD CANVAS
   =================================================== */
function initPixelStarfield() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const pixelStars = [];
    const starCount = Math.min(Math.floor((width * height) / 12000), 100);

    const colors = ['#ffffff', '#00f0ff', '#ffe600', '#39ff14', '#ff2a85'];

    for (let i = 0; i < starCount; i++) {
        pixelStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.floor(Math.random() * 3 + 2) * 2, // Chunky pixel steps (2, 4, 6px)
            speed: (Math.random() * 0.4 + 0.1),
            color: colors[Math.floor(Math.random() * colors.length)],
            twinkleTimer: Math.random() * 60
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < pixelStars.length; i++) {
            const s = pixelStars[i];
            s.y -= s.speed;
            if (s.y < 0) {
                s.y = height;
                s.x = Math.random() * width;
            }

            s.twinkleTimer++;
            if (Math.sin(s.twinkleTimer * 0.1) > -0.5) {
                ctx.fillStyle = s.color;
                // Draw square pixel
                ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
            }
        }

        requestAnimationFrame(render);
    }

    render();
}

/* ===================================================
   2. RETRO PROJECT FILTERING
   =================================================== */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playRetroSfx('select');

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                const catArray = categories.split(' ');

                if (filterValue === 'all' || catArray.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ===================================================
   3. NES 8-BIT SQUARE WAVE SYNTHESIZER (WEB AUDIO)
   =================================================== */
let audioCtx = null;
let soundEnabled = true;

function initRetroAudioHUD() {
    const soundToggle = document.getElementById('sound-toggle');
    if (!soundToggle) return;

    const savedSound = localStorage.getItem('tarun_pixel_sound');
    if (savedSound === 'off') {
        soundEnabled = false;
        soundToggle.innerText = 'AUDIO: OFF';
    } else {
        soundEnabled = true;
        soundToggle.innerText = 'AUDIO: ON';
    }

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundToggle.innerText = 'AUDIO: ON';
            localStorage.setItem('tarun_pixel_sound', 'on');
            playRetroSfx('coin');
            showPixelToast('[SOUND FX: ACTIVE]');
        } else {
            soundToggle.innerText = 'AUDIO: OFF';
            localStorage.setItem('tarun_pixel_sound', 'off');
            showPixelToast('[SOUND FX: MUTED]');
        }
    });

    // Attach 8-bit sound to all buttons and links
    document.querySelectorAll('button, .btn-pixel-primary, .btn-pixel-secondary, .btn-card-pixel, .nav-links a').forEach(el => {
        el.addEventListener('click', () => {
            playRetroSfx('blip');
        });
    });
}

function playRetroSfx(type = 'blip') {
    if (!soundEnabled) return;

    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Classic 8-bit Square wave sound
        osc.type = 'square';

        if (type === 'blip') {
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'coin') {
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'select') {
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(330, now + 0.05);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    } catch (e) {
        console.warn('Audio Error:', e);
    }
}

/* ===================================================
   4. COPY BEACONS & RETRO TOAST
   =================================================== */
function initCopyBeacons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = btn.getAttribute('data-copy');
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    playRetroSfx('coin');
                    showPixelToast(`COPIED: ${text}`);
                });
            }
        });
    });
}

function showPixelToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/* ===================================================
   5. SCROLL SPY
   =================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

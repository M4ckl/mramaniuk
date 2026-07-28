document.addEventListener('DOMContentLoaded', () => {
    const skills = ["Swift", "SwiftUI", "iOS", "UI Design", "Git", "Xcode",
        "Figma", "Python", "HTML", "CSS", "JS", "UIKit", "Kotlin"];

    const circle = document.querySelector('.circle');
    const container = document.querySelector('.skills-container');

    // GEOMETRY
    const POINTS = 260;          
    const RADIUS = 235;          
    const PERSPECTIVE = 900;     
    const CENTER = 300;          
    const TILT = -0.32;          

    const nodes = [];
    const golden = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < POINTS; i++) {
        const y = 1 - (i / (POINTS - 1)) * 2;     
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;

        const dot = document.createElement('div');
        dot.classList.add('dot');
        const size = 4 + Math.random() * 5;
        dot.dataset.size = size;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;

        circle.appendChild(dot);

        nodes.push({
            el: dot,
            bx: Math.cos(theta) * r,
            by: y,
            bz: Math.sin(theta) * r,
            baseSize: size,
            active: false,
            ox: 0, oy: 0
        });
    }

    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    let angle = 0;              
    const speed = 0.0022;       

    let pointer = { x: 0, y: 0, active: false };
    const REPEL_RADIUS = 140;   
    const REPEL_FORCE = 55;     

    function updatePointer(clientX, clientY) {
        const box = circle.getBoundingClientRect();
        if (box.width === 0) return;
        pointer.x = (clientX - box.left) / (box.width / 600);
        pointer.y = (clientY - box.top) / (box.height / 600);
        pointer.active = true;
    }

    if (container) {
        container.addEventListener('mousemove',
            e => updatePointer(e.clientX, e.clientY));
        container.addEventListener('mouseleave',
            () => { pointer.active = false; });
    }

    function project(n) {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        let x = n.bx * cosA - n.bz * sinA;
        let z = n.bx * sinA + n.bz * cosA;
        let y = n.by;

        const y2 = y * cosT - z * sinT;
        const z2 = y * sinT + z * cosT;
        y = y2;
        z = z2;

        const zPx = z * RADIUS;
        const scale = PERSPECTIVE / (PERSPECTIVE - zPx);

        n.sx = CENTER + x * RADIUS * scale;
        n.sy = CENTER + y * RADIUS * scale;
        n.scale = scale;
        n.depth = (z + 1) / 2; 
    }

    function animate() {
        angle += speed;

        for (const n of nodes) {
            project(n);

            const el = n.el;
            const depth = n.depth;
            const dotScale = 0.4 + depth * 0.9;
            const opacity = 0.18 + depth * 0.82;

            let tx = 0, ty = 0;
            if (pointer.active) {
                const dx = n.sx - pointer.x;
                const dy = n.sy - pointer.y;
                const dist = Math.hypot(dx, dy);
                if (dist < REPEL_RADIUS && dist > 0.001) {
                    const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE * (0.4 + depth * 0.6);
                    tx = (dx / dist) * force;
                    ty = (dy / dist) * force;
                }
            }
            n.ox += (tx - n.ox) * 0.12;
            n.oy += (ty - n.oy) * 0.12;

            el.style.transform =
                `translate3d(${n.sx + n.ox}px, ${n.sy + n.oy}px, 0) translate(-50%, -50%) scale(${n.scale * dotScale})`;
            el.style.opacity = n.active ? Math.max(0.15, depth) : opacity;
            el.style.zIndex = Math.round(depth * 100) + (n.active ? 100 : 0);

            if (!n.active) {
                el.style.background =
                    `color-mix(in srgb, var(--text-primary) ${25 + depth * 55}%, transparent)`;
            }
        }

        requestAnimationFrame(animate);
    }

    // SKILLS "islands"
    function activate(node) {
        if (node.active) return;
        node.active = true;
        node.el.classList.add('active');
        node.el.textContent = skills[Math.floor(Math.random() * skills.length)];

        setTimeout(() => {
            node.el.classList.remove('active');
            node.el.textContent = '';
            node.el.style.width = `${node.baseSize}px`;
            node.el.style.height = `${node.baseSize}px`;
            node.active = false;
        }, 2600 + Math.random() * 1200);
    }

    function popLoop() {
        const candidates = nodes.filter(n => !n.active && n.depth > 0.55);
        if (candidates.length) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            const tooClose = nodes.some(n =>
                n.active && Math.hypot(n.sx - pick.sx, n.sy - pick.sy) < 120);
            if (!tooClose) activate(pick);
        }
        setTimeout(popLoop, 600 + Math.random() * 700);
    }

    function fitSphere() {
        if (!container) return;
        const box = container.getBoundingClientRect();
        const s = Math.min(box.width, box.height) / 600;
        if (s > 0 && s < 5) {
            circle.style.transform = `translate(-50%, -50%) scale(${s})`;
        }
    }

    animate();
    popLoop();
    fitSphere();
    window.addEventListener('resize', fitSphere);


    // ANIMATED THEME TOGGLE 
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');

    const saved = localStorage.getItem('theme');
    if (saved === 'dark') root.setAttribute('data-theme', 'dark');

    const THEME_BG = { light: '#F7F7F7', dark: '#0b0b0d' };

    function applyTheme(next) {
        if (next === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        localStorage.setItem('theme', next);
    }

    let switching = false;

    if (toggle) {
        toggle.addEventListener('click', () => {
            if (switching) return;
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

            const prefersReduced = window.matchMedia(
                '(prefers-reduced-motion: reduce)').matches;

            if (prefersReduced) {
                applyTheme(next);
                return;
            }

            switching = true;

            const rect = toggle.getBoundingClientRect();
            const originX = rect.left + rect.width / 2;
            const originY = rect.top + rect.height / 2;
            const diameter = 2.4 * Math.hypot(
                Math.max(originX, window.innerWidth - originX),
                Math.max(originY, window.innerHeight - originY)
            );

            const ripple = document.createElement('div');
            ripple.className = 'theme-ripple';
            ripple.style.background = THEME_BG[next];
            ripple.style.left = `${originX}px`;
            ripple.style.top = `${originY}px`;
            ripple.style.width = ripple.style.height = `${diameter}px`;
            document.body.appendChild(ripple);

            void ripple.offsetWidth;
            ripple.style.transition = 'transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)';
            ripple.style.transform = 'translate(-50%, -50%) scale(1)';

            let grown = false;
            const onGrown = () => {
                if (grown) return;
                grown = true;
                applyTheme(next);
                let faded = false;
                const cleanup = () => {
                    if (faded) return;
                    faded = true;
                    ripple.remove();
                    switching = false;
                };
                ripple.style.transition = 'opacity 0.4s ease';
                ripple.style.opacity = '0';
                ripple.addEventListener('transitionend', cleanup, { once: true });
                setTimeout(cleanup, 600);
            };
            ripple.addEventListener('transitionend', onGrown, { once: true });
            setTimeout(onGrown, 820);
        });
    }


    // ABOUT — one-shot typing animation
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        const full = aboutText.textContent.replace(/\s+/g, ' ').trim();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduced) {
            aboutText.textContent = full;
        } else {
            aboutText.style.minHeight = aboutText.offsetHeight + 'px';
            aboutText.textContent = '';
            aboutText.classList.add('typing');
            let i = 0;

            const typeNext = () => {
                if (i <= full.length) {
                    aboutText.textContent = full.slice(0, i);
                    i++;
                    const prev = full[i - 2];
                    const delay = (prev === '.' || prev === ',') ? 90 : 12 + Math.random() * 14;
                    setTimeout(typeNext, delay);
                } else {
                    aboutText.classList.remove('typing');
                }
            };
            setTimeout(typeNext, 900);
        }
    }


    // PORTFOLIO SCROLL INDICATOR
    const portfolioList = document.getElementById('portfolio-scroll');
    const scrollDots = document.querySelectorAll('#portfolio-dots .scroll-dot');
    const groups = document.querySelectorAll('.portfolio-group');

    if (portfolioList && scrollDots.length > 0 && groups.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(groups).indexOf(entry.target);
                    scrollDots.forEach(dot => dot.classList.remove('active'));
                    if (scrollDots[index]) scrollDots[index].classList.add('active');
                }
            });
        }, { root: portfolioList, rootMargin: '0px', threshold: 0.5 });

        groups.forEach(group => observer.observe(group));
    }

});

document.addEventListener('DOMContentLoaded', () => {
    
    // =========SKILLS ANIMATION LOGIC================
    const skills = ["Swift", "iOS", "UI Design", "Git", "Xcode", "Figma", "SwiftUI", "Python", "HTML", "CSS", "JS"];
    const circle = document.querySelector('.circle');
    const ringCount = 3;
    const dotsPerRing = 25;
    const baseRadius = 120;
    const radiusStep = 54;
    const dots = [];

    for (let r = 0; r < ringCount; r++) {
        const radius = baseRadius + r * radiusStep;
        for (let i = 0; i < dotsPerRing; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            const size = 5 + Math.random() * 7; 
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;

            const gray = Math.floor(Math.random() * 60);
            dot.style.background = `rgb(${gray}, ${gray}, ${gray})`;

            circle.appendChild(dot);
            dots.push({
                el: dot,
                radius,
                angle: (i / dotsPerRing) * Math.PI * 2,
                speed: 0.0012 + Math.random() * 0.0012,
                scaleTimer: Math.random() * 500
            });
        }
    }

    function animate() {
        dots.forEach(d => {
            d.angle += d.speed;
            const x = Math.cos(d.angle) * d.radius + 300 - d.el.offsetWidth / 2;
            const y = Math.sin(d.angle) * d.radius + 300 - d.el.offsetHeight / 2;
            d.x = x;
            d.y = y;
            d.el.style.left = `${x}px`;
            d.el.style.top = `${y}px`;

            d.scaleTimer += 1;
            const scale = 1 + Math.sin(d.scaleTimer * 0.02) * 0.4;
            if (!d.el.classList.contains("active")) {
                d.el.style.transform = `scale(${scale})`;
            }
        });

        requestAnimationFrame(animate);
    }

    function isFarFromActive(dot) {
        const activeDots = dots.filter(d => d.el.classList.contains("active"));
        for (let a of activeDots) {
            const dx = dot.x - a.x;
            const dy = dot.y - a.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 110) return false;
        }
        return true;
    }

    function randomSkillPop() {
        let randomDot;
        let attempts = 0;

        do {
            randomDot = dots[Math.floor(Math.random() * dots.length)];
            attempts++;
            if (attempts > 20) break;
        } while (!isFarFromActive(randomDot));

        if (randomDot && !randomDot.el.classList.contains("active")) {
            randomDot.el.classList.add("active");
            randomDot.el.textContent = skills[Math.floor(Math.random() * skills.length)];

            randomDot.el.style.background = "#000000";
            randomDot.el.style.color = "#FFFFFF";

            setTimeout(() => {
                randomDot.el.classList.remove("active");
                randomDot.el.textContent = "";
                const gray = Math.floor(Math.random() * 60);
                randomDot.el.style.background = `rgb(${gray}, ${gray}, ${gray})`;
            }, 2000 + Math.random() * 1000);
        }

        setTimeout(randomSkillPop, 500 + Math.random() * 800);
    }

    animate();
    randomSkillPop();

    // ============LOGIC OF INDICATOR==============
    const portfolioList = document.getElementById('portfolio-scroll');
    const scrollDots = document.querySelectorAll('#portfolio-dots .scroll-dot');
    const groups = document.querySelectorAll('.portfolio-group');

    if (portfolioList && scrollDots.length > 0 && groups.length > 0) {
        const observerOptions = {
            root: portfolioList,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(groups).indexOf(entry.target);

                    scrollDots.forEach(dot => dot.classList.remove('active'));
                    if (scrollDots[index]) {
                        scrollDots[index].classList.add('active');
                    }
                }
            });
        }, observerOptions);
        groups.forEach(group => observer.observe(group));
    }

});
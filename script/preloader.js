document.addEventListener("DOMContentLoaded", () => {
    const video1 = document.querySelector(".left-block video");
    const video2 = document.querySelector(".bottom-right-block video");
    const preloader = document.getElementById("preloader");

    [video1, video2].forEach(v => {
        if (!v) return;
        v.muted = true;
        v.playsInline = true;
        v.play().catch(err => console.log("Autoplay blocked:", err));
    });

    function waitForVideo(video) {
        return new Promise(resolve => {
            if (video.readyState >= 3) resolve();
            else video.addEventListener("canplaythrough", resolve, { once: true });
        });
    }

    function waitForImages() {
        const images = Array.from(document.images);
        return Promise.all(images.map(img =>
            img.complete ? Promise.resolve() :
                new Promise(resolve => img.onload = img.onerror = resolve)
        ));
    }

    Promise.all([ waitForVideo(video1), waitForVideo(video2), waitForImages() ])
        .then(() => {
            preloader.style.display = "none";
            video1.style.opacity = "1";
            video2.style.opacity = "1";
        });
});

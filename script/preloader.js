document.addEventListener("DOMContentLoaded", () => {
    const video1 = document.querySelector(".left-block video");
    const video2 = document.querySelector(".bottom-right-block video");
    const preloader = document.getElementById("preloader");

    function waitForVideo(video) {
        return new Promise(resolve => {
            if (video.readyState >= 3) {
                resolve();
            } else {
                video.addEventListener("canplaythrough", resolve, { once: true });
            }
        });
    }

    function waitForImages() {
        const images = Array.from(document.images);
        const promises = images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => img.onload = img.onerror = resolve));
        return Promise.all(promises);
    }

    Promise.all([waitForVideo(video1), waitForVideo(video2), waitForImages()]).then(() => {
        preloader.style.display = "none";

        video1.style.opacity = "1";
        video1.style.visibility = "visible";
        video2.style.opacity = "1";
        video2.style.visibility = "visible";

        video1.currentTime = 0;
        video2.currentTime = 0;
        Promise.all([video1.play(), video2.play()]).catch(err => console.log(err));
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('projects-modal');
    const modalContent = modal.querySelector('.modal-projects-content');
    const closeButton = modal.querySelector('.close-button-projects');
    const projectsLink = document.getElementById('nav-projects');

    const progressBarFill = document.getElementById('modal-progress-fill');
    const dynamicCodeButton = document.getElementById('dynamic-code-button');

    const sectionLinks = [
        "https://github.com/M4ckl/UniversityApp",
        "https://github.com/M4ckl/ClearBackgroundApp",
        "#link-to-section-3"
    ];

    function openModal(e) {
        e.preventDefault();
        modal.classList.add('show');
        updateDynamicElements(modalContent);
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    function updateDynamicElements(container) {
        if (!container) return;

        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        const sectionIndex = Math.floor((scrollTop + clientHeight / 2) / clientHeight);

        let progressPercent = 33.3;
        if (sectionIndex === 1) {
            progressPercent = 66.6;
        } else if (sectionIndex >= 2) {
            progressPercent = 100;
        }

        if (progressBarFill) {
            progressBarFill.style.height = `${progressPercent}%`;
        }

        if (dynamicCodeButton && sectionLinks[sectionIndex]) {
            dynamicCodeButton.href = sectionLinks[sectionIndex];
        }
    }

    if (projectsLink) {
        projectsLink.addEventListener('click', openModal);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    if (modalContent) {
        modalContent.onscroll = () => updateDynamicElements(modalContent);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
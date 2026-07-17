document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('resumeCard');
    const resumeContent = document.querySelector('.resume-content');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const cardBack = document.querySelector('.card-back');

    // Base properties of the card (initial size)
    const baseWidth = 400;
    const baseHeight = 240;

    let vw = window.innerWidth;
    let vh = window.innerHeight;

    window.addEventListener('resize', () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
    });

    window.addEventListener('scroll', () => {
        // Calculate scroll progress (0 to 1)
        const scrollTop = window.scrollY;
        // The container is 400vh tall, so maxScroll is 300vh
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        if (maxScroll <= 0) return;

        let progress = scrollTop / maxScroll;
        // Clamp progress
        progress = Math.max(0, Math.min(1, progress));

        let rotateX = 40;
        let rotateZ = -15;
        let rotateY = 0;
        
        if (progress <= 0.4) {
            // Phase 1 (0.0 to 0.4): Flip the card and flatten it
            const phase1Progress = progress / 0.4; // 0 to 1

            // Ease out cubic for a smoother flip animation
            const easeOut = 1 - Math.pow(1 - phase1Progress, 3);

            rotateX = 40 * (1 - easeOut);
            rotateZ = -15 * (1 - easeOut);
            // Flip around Y axis
            rotateY = 180 * easeOut;

            // Fade out the scroll down indicator
            scrollIndicator.style.opacity = Math.max(0, 1 - (phase1Progress * 2));

            // Hide content during flip
            resumeContent.style.opacity = 0;
            
            // Remove expanded state
            cardBack.classList.remove('expanded');

            // Reset size
            card.style.width = `${baseWidth}px`;
            card.style.height = `${baseHeight}px`;

        } else {
            // Phase 2 (0.4 to 1.0): Scale up to fill the screen
            const phase2Progress = (progress - 0.4) / 0.6; // 0 to 1

            rotateX = 0;
            rotateZ = 0;
            rotateY = 180;
            
            // Fade in content
            resumeContent.style.opacity = phase2Progress;
            scrollIndicator.style.opacity = 0;

            // Calculate target dimensions to fill viewport
            const targetWidth = vw;
            const targetHeight = vh;

            // Interpolate width and height
            const currentWidth = baseWidth + (targetWidth - baseWidth) * phase2Progress;
            const currentHeight = baseHeight + (targetHeight - baseHeight) * phase2Progress;

            card.style.width = `${currentWidth}px`;
            card.style.height = `${currentHeight}px`;

            // Adjust border radius
            const currentRadius = 20 * (1 - phase2Progress);
            const faces = document.querySelectorAll('.card-face');
            faces.forEach(face => {
                face.style.borderRadius = `${currentRadius}px`;
            });

            // Enable internal scrolling when fully expanded
            if (phase2Progress > 0.95) {
                cardBack.classList.add('expanded');
                // Optional: Let user scroll inside if content is taller than screen
            } else {
                cardBack.classList.remove('expanded');
            }
        }

        // Apply transformations using translateZ(0) to enable GPU acceleration
        card.style.transform = `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });
});

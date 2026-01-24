/**
 * slider.js - Swiper Initialization for Services
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper
    const swiper = new Swiper('.services-swiper', {
        slidesPerView: 1.2, // Mobile: 1 full + 0.2 peek (less peek to allow gap)
        spaceBetween: 24, // Increased spacing for mobile
        centeredSlides: true,
        loop: false,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            // Tablet
            768: {
                slidesPerView: 2.5,
                spaceBetween: 30,
                centeredSlides: false,
            },
            // Desktop
            1024: {
                slidesPerView: 3, // Max fit for standard grid
                spaceBetween: 40,
                centeredSlides: false,
            },
            // Wide Desktop
            1400: {
                slidesPerView: 3, // Maximize for wide screens
                spaceBetween: 40,
            }
        }
    });
});

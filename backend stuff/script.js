const totalImages = 11; // Adjust this to reflect the number of images in the folder
let currentIndex = 0;
const images = Array.from({ length: totalImages }, (_, i) => `../backend stuff/releasephotos/image${i + 1}.png`);
const carouselImage = document.querySelector(".carousel-image");
let slideInterval;

// Function to display the current image
function showImage(index) {
    carouselImage.src = images[index];
}

// Function to start the automatic slide interval
function startSlideInterval() {
    slideInterval = setInterval(() => {
        nextImage();
    }, 5000); // 5 seconds
}

// Function to reset the slide interval (used when an arrow is clicked)
function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// Functions to navigate images manually
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
    resetSlideInterval(); // Reset interval after navigating
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
    resetSlideInterval(); // Reset interval after navigating
}

// Initial setup
showImage(currentIndex);
startSlideInterval(); // Start automatic slide when page loads

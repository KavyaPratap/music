let nextPage = 1;
let fetchedVideos = new Set(); // Set to store fetched video titles

document.getElementById('getRecommendations').addEventListener('click', function() {
    nextPage = 1;
    fetchedVideos.clear(); // Clear fetched videos when new recommendations are requested
    document.getElementById('recommendations').innerHTML = '';
    showLoadingAnimation();
    fetchRecommendations();
});

document.getElementById('moreSuggestions').addEventListener('click', function() {
    nextPage++;
    showLoadingAnimation();
    fetchRecommendations();
});

function fetchRecommendations() {
    const mood = document.getElementById('mood').value;
    const language = document.getElementById('language').value;

    fetch('/getRecommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: mood, language: language, next_page: nextPage, exclude: Array.from(fetchedVideos) }),
    })
    .then(response => response.json())
    .then(data => {
        const recommendationsSection = document.getElementById('recommendationsSection');
        const recommendationsTitle = document.getElementById('recommendationsTitle');
        const recommendationsDiv = document.getElementById('recommendations');

        recommendationsTitle.textContent = `${mood.charAt(0).toUpperCase() + mood.slice(1)} ${language.charAt(0).toUpperCase() + language.slice(1)} Songs`;

        if (data.length === 0 && nextPage === 1) {
            recommendationsDiv.innerHTML = '<p>No recommendations found for the selected mood and language.</p>';
            recommendationsSection.style.display = 'block'; // Show recommendations section with message
            document.getElementById('moreSuggestions').style.display = 'none'; // Hide more suggestions button
            hideLoadingAnimation();
            return;
        }

        data.forEach(video => {
            if (!fetchedVideos.has(video.title)) {
                fetchedVideos.add(video.title); // Add new video title to fetched set

                const videoElement = document.createElement('div');
                videoElement.classList.add('video');
                videoElement.innerHTML = `
                    <h3>${video.title}</h3>
                    <p><a href="${video.link}" target="_blank">Watch on YouTube</a></p>
                    <p>Views: ${video.views.toLocaleString()}</p>
                `;
                recommendationsDiv.appendChild(videoElement);
            }
        });

        recommendationsSection.style.display = 'block'; // Ensure recommendations section is visible

        // Show more suggestions button if there are more pages to fetch
        if (data.length >= 20) {
            document.getElementById('moreSuggestions').style.display = 'block';
        } else {
            document.getElementById('moreSuggestions').style.display = 'none'; // Hide more suggestions button if no more data
        }
        hideLoadingAnimation();
    })
    .catch(error => {
        console.error('Error:', error);
        hideLoadingAnimation();
    });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleSidebar = document.getElementById('darkModeToggleSidebar');

darkModeToggle.addEventListener('click', () => {
    toggleDarkMode();
});

darkModeToggleSidebar.addEventListener('click', () => {
    toggleDarkMode();
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.checked = isDarkMode;
    darkModeToggleSidebar.checked = isDarkMode;
}

// Set initial theme based on time of day
const hour = new Date().getHours();
if (hour >= 18 || hour < 6) { // Night time from 6 PM to 6 AM
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    darkModeToggleSidebar.checked = true;
} else {
    document.body.classList.remove('dark-mode');
    darkModeToggle.checked = false;
    darkModeToggleSidebar.checked = false;
}

// Toggle sidebar
const toggleButton = document.getElementById('toggleButton');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Loading Animation
function showLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'block';
}

function hideLoadingAnimation() {
    document.getElementById('loadingAnimation').style.display = 'none';
}

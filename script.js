console.log('Hello, World!');

// Toggle dark and light mode
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Apply the theme
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Toggle theme function
function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
}

// Add click event listener
themeToggle.addEventListener('click', toggleTheme);

// Add smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// Booking Modal Functions
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    body.style.overflow = 'auto'; // Restore background scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        deviceType: document.getElementById('deviceType').value,
        issue: document.getElementById('issue').value,
        preferredDate: document.getElementById('preferredDate').value,
        preferredTime: document.getElementById('preferredTime').value,
        timestamp: new Date().toISOString()
    };

    try {
        // Submit to Google Forms
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc5gA_ud4f9XFWGXQ0mP_hqtGOUIOAFxX7RQ3msCK2gSCyMig/formResponse';
        const formDataGoogle = new FormData();
        
        // Map your form fields to Google Form field IDs
        formDataGoogle.append('entry.2005620554', formData.name);
        formDataGoogle.append('entry.1045781291', formData.phone);
        formDataGoogle.append('entry.839337160', formData.address);
        formDataGoogle.append('entry.1065046570', formData.deviceType);
        formDataGoogle.append('entry.839337160', formData.issue);
        formDataGoogle.append('entry.1065046570', formData.preferredDate);
        formDataGoogle.append('entry.839337160', formData.preferredTime);

        // Submit to Google Forms
        await fetch(googleFormUrl, {
            method: 'POST',
            body: formDataGoogle,
            mode: 'no-cors'
        });

        // Submit to MongoDB (using deployed backend URL)
        const backendUrl = 'https://your-backend-url.onrender.com'; // Replace with your actual deployed backend URL
        const response = await fetch(`${backendUrl}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit booking');
        }

        // Show success message
        alert('Booking submitted successfully! We will contact you shortly.');
        closeBookingModal();
        document.getElementById('bookingForm').reset();

    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Failed to submit booking. Please try again or contact us directly.');
    }
} 
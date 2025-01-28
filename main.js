// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaQC8eA6mbfaFjuTUhjlSuXGgTQYYQpFs",
  authDomain: "chisomxstan.firebaseapp.com",
  projectId: "chisomxstan",
  storageBucket: "chisomxstan.firebasestorage.app",
  messagingSenderId: "570220228870",
  appId: "1:570220228870:web:568c5eaadf45417b2d6e87",
  measurementId: "G-SZ4S6B7SHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
// Reference to the RSVP collection
const rsvpCollection = collection(db, "rsvps");




document.addEventListener("DOMContentLoaded", () => {
  // Set the wedding date
  const weddingDate = new Date("2025-04-26T00:00:00");

  // Get elements for each time unit
  const monthsElement = document.querySelector("#month");
  const daysElement = document.querySelector("#days");
  const hoursElement = document.querySelector("#hours");
  const minutesElement = document.querySelector("#minutes");
  const secondsElement = document.querySelector("#seconds");

  function updateCountdown() {
    const now = new Date();
    const timeDiff = weddingDate - now;

    if (timeDiff <= 0) {
      // If the countdown is over
      document.getElementById("countdown").innerHTML =
        "<p class='text-4xl font-bold'>Today is the big day! 🎉</p>";
      return;
    }

    // Calculate time components
    const totalSeconds = Math.floor(timeDiff / 1000);
    const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60)); // Approximate months
    const days = Math.floor((totalSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    // Update the countdown elements
    monthsElement.textContent = String(months).padStart(2, "0");
    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Run initially to avoid delay
});

document.addEventListener("DOMContentLoaded", () => {
  const rsvpModal = document.getElementById("rsvp-modal");
  const joyfullyAcceptBtn = document.querySelector(".accept-btn");
  const closeModal = document.getElementById("close-modal");
  const contactInputs = document.querySelectorAll("input[name='contact-method']");
  const contactInput = document.getElementById("contact-input");
  const contactLabel = document.getElementById("contact-label");
  const contactDetail = document.getElementById("contact-detail");

  // Open modal
  joyfullyAcceptBtn.addEventListener("click", () => {
    rsvpModal.classList.remove("hidden");
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    rsvpModal.classList.add("hidden");
  });

  // Update contact input field
  contactInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      contactInput.classList.remove("hidden");
      if (e.target.value === "email") {
        contactLabel.textContent = "Email Address";
        contactDetail.type = "email";
        contactDetail.placeholder = "example@example.com";
      } else if (e.target.value === "whatsapp") {
        contactLabel.textContent = "WhatsApp Number";
        contactDetail.type = "tel";
        contactDetail.placeholder = "+1234567890";
      }
    });
  });
});



// Form Submission Handling
// Get DOM Elements for QR Code modal and messages
const qrModal = document.getElementById('qr-code-modal');
const closeQrModal = document.getElementById('close-qr-modal');
const qrCodeDiv = document.getElementById('qrcode');
const thankYouMessage = document.getElementById('thank-you-message');
const infoMessage = document.getElementById('info-message');
const rsvpForm = document.getElementById('rsvp-form')
const rsvpModal = document.getElementById("rsvp-modal");

// RSVP Form Submission Handling to generate QR Code
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the submit button
  const submitButton = rsvpForm.querySelector('button[type="submit"]');
  
  // Disable the submit button and update its text
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  // Collect form data
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
  const contactDetail = document.getElementById('contact-detail').value.trim();
  const songRequest = document.getElementById('song-request').value.trim();

  // Prepare data object
  const rsvpData = {
    firstName,
    lastName,
    contactMethod,
    contactDetail,
    songRequest,
    timestamp: new Date().toISOString(),
  };

  try {
    // Save RSVP data to Firestore
    await addDoc(collection(db, "rsvps"), rsvpData);

    // Construct pure text QR code data
    const qrData = `RSVP Details

Name: ${firstName} ${lastName}
Contact Method: ${contactMethod}
Contact Detail: ${contactMethod === "email"
        ? contactDetail.replace('@', '＠').replace('.', '․')
        : contactDetail.replace(/(\d{3})(\d{3})(\d{4})/, '$1\u200B-$2\u200B-$3')
      }
Song Request: ${songRequest}`;
    // Generate QR code URL
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    // Create Image for QR Code
    const qrImage = new Image();
    qrImage.src = qrImageUrl;
    qrImage.onload = () => {
      // Hide the RSVP modal
      rsvpModal.classList.add('hidden');

      // Show the QR Code modal
      qrModal.classList.remove('hidden');

      // Append the QR code image to the modal
      qrCodeDiv.innerHTML = '';
      qrCodeDiv.appendChild(qrImage);

      // Display the thank-you message
      thankYouMessage.innerHTML = `Thank you, ${firstName}! Your RSVP has been successfully recorded.`;

      // Re-enable the submit button and reset text
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    };
    qrImage.onerror = (error) => {
      console.error("Error loading QR code:", error);
      qrCodeDiv.innerHTML = "Error loading QR code. Please try again.";

      // Re-enable the submit button and reset text
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    };
  } catch (error) {
    console.error("Error saving RSVP to Firestore:", error);
    alert("Failed to submit your RSVP. Please try again.");

    // Re-enable the submit button and reset text
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});

// Close QR Code Modal
closeQrModal.addEventListener('click', () => {
  // Clear QR code image
  qrCodeDiv.innerHTML = '';

  // Reset the form fields
  rsvpForm.reset();

  // Hide the QR Code modal
  qrModal.classList.add('hidden');
});

//decline modal
const declineModal = document.getElementById('decline-modal')
const closeDeclineModal = document.getElementById('close-decline-modal')
const declineBtn = document.querySelector('.decline-btn')

// Open Decline Modal
declineBtn.addEventListener('click', () => {
  declineModal.classList.remove('hidden');
});
// Close Decline Modal
closeDeclineModal.addEventListener('click', () => {
  declineModal.classList.add('hidden');
});

// Admin Login
const adminBtn = document.querySelectorAll('.admin-btn'); // Admin button
const adminModal = document.getElementById('admin-modal');
const closeAdminModal = document.getElementById('close-admin-modal');
const adminForm = document.getElementById('admin-form');

// Show Admin Modal
adminBtn.forEach(btn => {
  btn.addEventListener('dblclick', (e) => {
    e.preventDefault(); // Prevent default link behavior
    adminModal.classList.remove('hidden');
  });
})


// Close Admin Modal
closeAdminModal.addEventListener('click', () => {
  adminModal.classList.add('hidden');
});

// Form Submission Handling
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Collect login details
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();

  // Placeholder logic for authentication
  if (username === 'admin' && password === 'password123') {
    window.location.href = './admin.html'; // Redirect to admin page
  } else {
    alert('Invalid login details. Please try again.');
  }


});
// main.js

// Function for smooth scrolling to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Handle the contact form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent the default form submission
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    const formData = {
      name,
      email,
      message
    };
  
    // Send a POST request to submit the contact form data to the backend
    fetch('http://localhost:5000/submit-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);  // Show success message
    })
    .catch(error => {
      console.error('Error submitting contact form:', error);
      alert('Something went wrong, please try again later.');
    });
  });

  
// Hero button click action


/* Service card hover effect
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'transform 0.3s';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});
*/

/* Contact form submission handling
document.querySelector('.send').addEventListener('click', function () {
    alert("Thank you for reaching out! We will get back to you soon.");
});
*/
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.querySelector('.send');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        alert('Button clicked!');
      });
    }
  });
  


    // Other event listeners
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
                card.style.transition = 'transform 0.3s';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
        });
    }


// main.js

const userTypeElement = document.getElementById('user-type');
if (userTypeElement) {
    userTypeElement.addEventListener('change', function () {
        const shopkeeperFields = document.getElementById('shopkeeper-fields');
        if (this.value === 'shopkeeper') {
            shopkeeperFields.style.display = 'block';
        } else {
            shopkeeperFields.style.display = 'none';
        }
    });
}


// Store the token in localStorage or sessionStorage
fetch('/api/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
})
.then(response => response.json())
.then(data => {
    localStorage.setItem('token', data.token); // Store the token in local storage
})
.catch(error => console.error('Error:', error));






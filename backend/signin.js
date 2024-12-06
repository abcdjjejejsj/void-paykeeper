const signInForm = document.getElementById('signinForm');

signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(result.user));

            alert('Login successful');
            window.location.href = 'dashboard.html';  // Redirect to the dashboard
        } else {
            alert(result.message || "Sign-in failed");
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        alert("An error occurred. Please try again.");
    }
});

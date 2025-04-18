// DOM Elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotPasswordLink = document.querySelector('.forgot-password');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeModal = document.querySelector('.close');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const toast = document.getElementById('toast');

// Event Listeners
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate inputs
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Here you would typically send a request to your backend
    console.log('Login with:', { email, password });
    showToast('Login successful!', 'success');
    // Redirect to dashboard or home page
    // window.location.href = '/dashboard';
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Here you would typically send a request to your backend
    console.log('Signup with:', { name, email, password });
    showToast('Account created successfully!', 'success');
    
    // Switch to login form after successful signup
    container.classList.remove('right-panel-active');
});

// Forgot Password
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    forgotPasswordModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
    }
});

forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showToast('Please enter your email', 'error');
        return;
    }
    
    // Here you would typically send a request to your backend
    console.log('Password reset requested for:', email);
    showToast('Password reset link sent to your email', 'success');
    forgotPasswordModal.style.display = 'none';
});

// Google Sign In/Sign Up
function handleGoogleSignIn(response) {
    // Handle the Google Sign-In response
    console.log('Google Sign-In response:', response);
    
    // Here you would decode the credential and send to your backend for verification
    const credential = response.credential;
    const decodedToken = parseJwt(credential);
    console.log('Decoded Google token:', decodedToken);
    
    // For demo purposes, we'll just show a success message
    showToast(`Signed in as ${decodedToken.name}`, 'success');
    
    // Redirect to dashboard or home page
    // window.location.href = '/dashboard';
}

function handleGoogleSignUp(response) {
    // Handle the Google Sign-Up response
    console.log('Google Sign-Up response:', response);
    
    // Here you would decode the credential and send to your backend for verification
    const credential = response.credential;
    const decodedToken = parseJwt(credential);
    console.log('Decoded Google token:', decodedToken);
    
    // For demo purposes, we'll just show a success message
    showToast(`Account created for ${decodedToken.name}`, 'success');
    
    // Switch to login form after successful signup
    container.classList.remove('right-panel-active');
}

// Helper function to parse JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

// Toggle password visibility
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show toast notification
function showToast(message, type) {
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type) {
        toast.classList.add(type);
    }
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
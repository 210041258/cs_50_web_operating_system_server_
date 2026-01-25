// DOM Elements
const countdownElement = document.getElementById('countdown');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const quantityInput = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decreaseQty');
const increaseBtn = document.getElementById('increaseQty');
const totalPriceElement = document.getElementById('totalPrice');
const orderForm = document.getElementById('orderForm');
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');
const continueShoppingBtn = document.getElementById('continueShopping');
const modalQuantity = document.getElementById('modalQuantity');
const modalTotal = document.getElementById('modalTotal');
const orderNumber = document.getElementById('orderNumber');
const orderEmail = document.getElementById('orderEmail');

// Constants
const PRODUCT_PRICE = 1770;
const SALE_END_TIME = new Date();
SALE_END_TIME.setHours(SALE_END_TIME.getHours() + 24); // 24 hours from now

// Format currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-US');
}

// Update total price
function updateTotalPrice() {
    const quantity = parseInt(quantityInput.value);
    const total = PRODUCT_PRICE * quantity;
    totalPriceElement.textContent = formatCurrency(total);
}

// Initialize quantity controls
decreaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        updateTotalPrice();
    }
});

increaseBtn.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
        updateTotalPrice();
    }
});

// Countdown Timer
function updateCountdown() {
    const now = new Date();
    const timeDifference = SALE_END_TIME - now;
    
    if (timeDifference <= 0) {
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        clearInterval(countdownInterval);
        showSaleEnded();
        return;
    }
    
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Show sale ended message
function showSaleEnded() {
    const saleTag = document.querySelector('.sale-tag');
    saleTag.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>SALE ENDED</span>';
    saleTag.style.background = '#ff4757';
    
    const orderButton = document.querySelector('.btn-order');
    orderButton.disabled = true;
    orderButton.innerHTML = '<i class="fas fa-times-circle"></i><span>SALE ENDED</span><small>Offer Expired</small>';
    orderButton.style.opacity = '0.6';
    orderButton.style.cursor = 'not-allowed';
}

// Image Gallery Functionality
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');
        
        // Update main image
        const newImage = thumbnail.getAttribute('data-image');
        mainImage.src = newImage;
        
        // Add fade effect
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 100);
    });
});

// Form Validation
function validateForm() {
    let isValid = true;
    const errors = {};
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');
    
    // First Name validation
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        errors.firstName = 'First name is required';
        isValid = false;
    } else if (firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
        isValid = false;
    }
    
    // Last Name validation
    const lastName = document.getElementById('lastName').value.trim();
    if (!lastName) {
        errors.lastName = 'Last name is required';
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone').value.trim();
    if (!phone) {
        errors.phone = 'Phone number is required';
        isValid = false;
    } else if (!/^[\d\s\+\-\(\)]+$/.test(phone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
    }
    
    // Address validation
    const address = document.getElementById('address').value.trim();
    if (!address) {
        errors.address = 'Delivery address is required';
        isValid = false;
    } else if (address.length < 10) {
        errors.address = 'Please provide a complete address';
        isValid = false;
    }
    
    // Terms validation
    const terms = document.getElementById('terms').checked;
    if (!terms) {
        errors.terms = 'You must agree to the terms and conditions';
        isValid = false;
    }
    
    // Display errors
    Object.keys(errors).forEach(key => {
        const errorElement = document.getElementById(key + 'Error');
        const inputElement = document.getElementById(key);
        
        if (errorElement) {
            errorElement.textContent = errors[key];
        }
        
        if (inputElement) {
            inputElement.style.borderColor = '#ff4757';
        }
    });
    
    return isValid;
}

// Form Submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Disable submit button to prevent double submission
    const submitButton = orderForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
    submitButton.disabled = true;
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        quantity: parseInt(quantityInput.value),
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        newsletter: document.getElementById('newsletter').checked,
        total: PRODUCT_PRICE * parseInt(quantityInput.value),
        orderDate: new Date().toISOString()
    };
    
    // In a real application, you would send this data to your server
    // For now, we'll simulate an API call
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate order number
        const orderNum = 'WREN-' + new Date().getFullYear() + '-' + 
                         Math.floor(1000 + Math.random() * 9000);
        
        // Update modal with order details
        modalQuantity.textContent = formData.quantity;
        modalTotal.textContent = formatCurrency(formData.total);
        orderNumber.textContent = orderNum;
        orderEmail.textContent = formData.email;
        
        // Show success modal
        successModal.style.display = 'flex';
        
        // Reset form
        orderForm.reset();
        quantityInput.value = 1;
        updateTotalPrice();
        
        // Store order in localStorage for demo purposes
        const orders = JSON.parse(localStorage.getItem('wrenOrders') || '[]');
        orders.push({
            ...formData,
            orderNumber: orderNum,
            status: 'pending'
        });
        localStorage.setItem('wrenOrders', JSON.stringify(orders));
        
    } catch (error) {
        alert('There was an error processing your order. Please try again.');
        console.error('Order submission error:', error);
    } finally {
        // Re-enable submit button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Modal Controls
closeModalBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
});

continueShoppingBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Input Validation on Blur
const inputs = document.querySelectorAll('input[required], textarea[required]');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateField(input);
    });
    
    // Clear error on focus
    input.addEventListener('focus', () => {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.style.borderColor = '';
    });
});

function validateField(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById(input.id + 'Error');
    
    if (!value) {
        if (errorElement) {
            errorElement.textContent = 'This field is required';
        }
        input.style.borderColor = '#ff4757';
        return false;
    }
    
    // Additional validations based on field type
    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                }
                input.style.borderColor = '#ff4757';
                return false;
            }
            break;
        case 'tel':
            if (!/^[\d\s\+\-\(\)]+$/.test(value)) {
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid phone number';
                }
                input.style.borderColor = '#ff4757';
                return false;
            }
            break;
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    input.style.borderColor = '#2ed573';
    return true;
}

// Add animation to order button on page load
window.addEventListener('load', () => {
    const orderButton = document.querySelector('.btn-order');
    orderButton.style.animation = 'pulse 2s infinite';
    
    // Start countdown
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Initialize total price
    updateTotalPrice();
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
});

// Wishlist functionality
const wishlistButton = document.querySelector('.btn-wishlist');
wishlistButton.addEventListener('click', () => {
    const icon = wishlistButton.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistButton.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
        wishlistButton.style.color = '#ff4757';
        
        // Show notification
        showNotification('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistButton.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        wishlistButton.style.color = '';
        
        showNotification('Removed from wishlist', 'info');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ed573' : '#3742fa'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1002;
        animation: slideInRight 0.3s ease;
    `;
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cart counter
let cartCount = 0;
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter') || createCartCounter();
    cartCounter.textContent = cartCount;
    cartCounter.style.display = cartCount > 0 ? 'flex' : 'none';
}

function createCartCounter() {
    const counter = document.createElement('div');
    counter.className = 'cart-counter';
    document.body.appendChild(counter);
    
    // Add styles for cart counter
    counter.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: #ff4757;
        color: white;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    `;
    
    return counter;
}

// Initialize cart counter
updateCartCounter();

// Simulate adding to cart on order
orderForm.addEventListener('submit', () => {
    cartCount += parseInt(quantityInput.value);
    updateCartCounter();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl + Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
        if (orderForm.contains(document.activeElement)) {
            orderForm.requestSubmit();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && successModal.style.display === 'flex') {
        successModal.style.display = 'none';
    }
});

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.feature, .review').forEach(el => {
    observer.observe(el);
});

// Add animation class
const animateStyle = document.createElement('style');
animateStyle.textContent = `
    .feature, .review {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .feature.animate-in, .review.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animateStyle);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Flash Sale website loaded successfully!');
    
    // Set minimum date for any date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });
});
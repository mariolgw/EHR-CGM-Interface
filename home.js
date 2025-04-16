document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && !event.target.closest('nav') && !event.target.closest('.mobile-menu')) {
            navMenu.classList.remove('active');
            
            // Reset icon
            const icon = mobileMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if the element has specific JavaScript handling
            if (this.classList.contains('option-btn') || this.getAttribute('data-category')) {
                return;
            }
            
            const targetId = this.getAttribute('href');
            
            // Skip for empty anchors or ones with no target
            if (targetId === '#' || !document.querySelector(targetId)) {
                return;
            }
            
            e.preventDefault();
            
            // Get target element and scroll to it
            const target = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .team-member, .option-card, .resource-card, .support-card, .contact-option');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to add animation classes when element is in viewport
    function handleScrollAnimation() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }
    
    // Add initial styling for animations
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Create CSS class for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Run on load and scroll
    window.addEventListener('load', handleScrollAnimation);
    window.addEventListener('scroll', handleScrollAnimation);
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('.faq-toggle i');
            
            question.addEventListener('click', () => {
                // Check if this item is already active
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    const faqAnswer = faq.querySelector('.faq-answer');
                    const faqIcon = faq.querySelector('.faq-toggle i');
                    
                    faqAnswer.style.maxHeight = null;
                    
                    if (faqIcon) {
                        faqIcon.classList.remove('fa-minus');
                        faqIcon.classList.add('fa-plus');
                    }
                });
                
                // If the clicked item wasn't active before, open it
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    
                    if (icon) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    }
                }
            });
        });
        
        // Open first FAQ item by default
        if (faqItems[0]) {
            faqItems[0].classList.add('active');
            const firstAnswer = faqItems[0].querySelector('.faq-answer');
            const firstIcon = faqItems[0].querySelector('.faq-toggle i');
            
            if (firstAnswer) {
                firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
            }
            
            if (firstIcon) {
                firstIcon.classList.remove('fa-plus');
                firstIcon.classList.add('fa-minus');
            }
        }
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            // Add blur event to check field when user leaves it
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Add input event to revalidate as user types
            field.addEventListener('input', function() {
                validateField(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            // Prevent default form submission
            e.preventDefault();
            
            // Validate all required fields
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            // If form is valid, show success message (in real scenario, would submit to server)
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Form submitted successfully! We will be in touch soon.';
                successMessage.style.cssText = `
                    background-color: #d4edda;
                    color: #155724;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                `;
                
                // Add success icon
                const icon = successMessage.querySelector('i');
                icon.style.cssText = `
                    color: #28a745;
                    font-size: 24px;
                    margin-right: 10px;
                `;
                
                // Remove any existing success messages
                const existingMessage = form.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // Append new success message
                form.appendChild(successMessage);
                
                // Reset form
                form.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transition = 'opacity 0.5s ease';
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 5000);
            }
        });
    });
    
    // Field validation function
    function validateField(field) {
        // Different validation based on field type
        let isValid = true;
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value.trim());
        } else if (field.type === 'tel') {
            // Basic phone validation - can be enhanced for specific formats
            const phoneRegex = /^[0-9\+\-\(\)\s]{7,20}$/;
            isValid = field.value.trim() === '' || phoneRegex.test(field.value.trim());
        } else {
            isValid = field.value.trim() !== '';
        }
        
        // Add or remove error class
        if (!isValid) {
            field.classList.add('error');
            field.classList.remove('success');
        } else {
            field.classList.remove('error');
            
            // Only add success class if field has a value
            if (field.value.trim() !== '') {
                field.classList.add('success');
            } else {
                field.classList.remove('success');
            }
        }
        
        return isValid;
    }
    
    // Handle registration option selection
    const optionBtns = document.querySelectorAll('.option-btn');
    const registrationForms = document.querySelectorAll('.registration-form');
    
    if (optionBtns.length > 0 && registrationForms.length > 0) {
        optionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all option cards
                document.querySelectorAll('.option-card').forEach(card => {
                    card.classList.remove('active-option');
                });
                
                // Add active class to parent card
                this.closest('.option-card').classList.add('active-option');
                
                // Hide all forms
                registrationForms.forEach(form => {
                    form.style.display = 'none';
                });
                
                // Show selected form
                const targetId = this.getAttribute('href');
                const targetForm = document.querySelector(targetId);
                
                if (targetForm) {
                    targetForm.style.display = 'block';
                    
                    // Smooth scroll to form
                    const headerOffset = 100;
                    const elementPosition = targetForm.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Handle resource category filtering
    const categoryTabs = document.querySelectorAll('.category-tab');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    if (categoryTabs.length > 0 && resourceCards.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Get selected category
                const selectedCategory = tab.getAttribute('data-category');
                
                // Animate filtered resources
                resourceCards.forEach(card => {
                    // First set all cards to invisible but still taking up space
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        // Then hide non-matching cards entirely and show matching ones
                        if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300);
                });
            });
        });
        
        // Handle footer category links
        document.querySelectorAll('a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const category = link.getAttribute('data-category');
                const categorySection = document.querySelector('.resource-categories');
                
                if (categorySection) {
                    // Scroll to resources section
                    categorySection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Slight delay to ensure proper scrolling before changing category
                    setTimeout(() => {
                        // Find and click the appropriate category tab
                        const targetTab = document.querySelector(`.category-tab[data-category="${category}"]`);
                        if (targetTab) {
                            targetTab.click();
                        }
                    }, 500);
                }
            });
        });
    }
});
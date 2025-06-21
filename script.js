document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const loader = document.getElementById('loader');
    const pageContent = document.getElementById('page-content');
    const accreditationsContainer = document.getElementById('accreditations-container');

    // MODIFIED: Corrected the ID to match your new HTML for the programs section
    const programsContainer = document.getElementById('programs-cards-container'); 
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
    const pageSections = document.querySelectorAll('.page-section');
    const splineContainer = document.querySelector('.content-right'); // For scroll fix

    // --- Loader Logic ---
    const hideLoader = () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    };

    window.addEventListener('load', hideLoader);

    // --- Data Fetching and Population ---
    const fetchData = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Populate different sections if the containers exist
            if(accreditationsContainer && data.aboutUs && data.aboutUs.accreditations) {
                populateAccreditations(data.aboutUs.accreditations);
            }
            // MODIFIED: Use the new internshipPrograms data
            if(programsContainer && data.internshipPrograms) {
                populatePrograms(data.internshipPrograms);
            }

        } catch (error) {
            console.error('Error fetching or parsing data:', error);
            // Optionally, display an error message to the user on the page
        }
    };

    const populateAccreditations = (items) => {
        accreditationsContainer.innerHTML = ''; // Clear existing content
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('accreditation-item');
            // Using a more descriptive alt text
            itemElement.innerHTML = `
                <img src="${item.icon}" width="200" height="200" alt="${item.text}" style="border-radius: 12px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
            `;
            accreditationsContainer.appendChild(itemElement);
        });
    
    };


    // MODIFIED: This function is completely updated to create the new program card style
    // Ensure programsContainer is accessible in this scope.
// It should be initialized once the DOM is ready, for example:
// const programsContainer = document.getElementById('programs-cards-container');
let focusedCard = null; // Keeps track of the currently focused card

// Function to remove focus and dimming from all cards
const resetCards = () => {
    const cardsContainer = document.getElementById('programs-cards-container');
    if (cardsContainer) {
        cardsContainer.classList.remove('card-focused');
        document.querySelectorAll('.program-card').forEach(card => {
            card.classList.remove('focused');
        });
    }
    focusedCard = null;
};

// Event listener for clicks anywhere on the document (to unfocus when clicking outside)
// This needs to be attached once, outside of populatePrograms.
document.addEventListener('click', (event) => {
    if (focusedCard && !event.target.closest('.program-card')) {
        resetCards();
    }
});


/**
 * Populates the programs container with program cards and adds interactivity for click-to-focus.
 * When a card is clicked, it becomes focused and other cards are dimmed/blurred.
 * Clicking the same card again, or clicking outside any focused card, resets the view.
 * @param {Array<Object>} cards - An array of card data objects.
 */
const populatePrograms = (cards) => {
    const programsContainer = document.getElementById('programs-cards-container');
    if (!programsContainer) {
        console.error('Programs container not found. Make sure an element with id "programs-cards-container" exists.');
        return;
    }

    programsContainer.innerHTML = ''; // Clear existing content to prevent duplicate listeners

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('program-card');
        
        // Add a unique ID to the card if `card.id` exists, useful for debugging or specific targeting
        if (card.id) {
            cardElement.id = `program-card-${card.id}`;
        }

        cardElement.innerHTML = `
            <div class="program-card-image">
                <img src="${card.image}" alt="${card.title}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/123338/E0E1DD?text=Image';">
            </div>
            <div class="program-card-content">
                <h3>${card.title}</h3>
                <div class="rating">★★★★★</div>
                <p>${card.description}</p>
                <a href="#" class="btn-learn-more">Learn More →</a>
            </div>
        `;
        programsContainer.appendChild(cardElement);

        // Add event listener to the entire program card for click-to-focus
        cardElement.addEventListener('click', (event) => {
            // Prevent event from bubbling up to the document listener prematurely
            event.stopPropagation(); 

            if (cardElement === focusedCard) {
                // If the clicked card is already focused, unfocus it
                resetCards();
            } else {
                // Focus the clicked card and dim others
                resetCards(); // Clear any previous focus
                cardElement.classList.add('focused');
                programsContainer.classList.add('card-focused'); // Add class to parent to trigger sibling dimming
                focusedCard = cardElement;
            }
        });
    });
};

const handleNavigation = (targetId) => {
    loader.style.display = 'flex';
    setTimeout(() => { loader.style.opacity = '1'; }, 10);

    pageContent.style.opacity = '0';

    setTimeout(() => {
        pageSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active state for both desktop and mobile links
        document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });

        // --- Specific logic for #special section ---
        const specialSection = document.querySelector('#special');
        if (specialSection) {
            if (targetId === '#special') {
                // When #special is the target, explicitly set its display to make it visible
                specialSection.style.display = 'block'; // Or 'flex', 'grid', etc., based on your layout needs
            } else {
                // If another section is the target, hide #special
                specialSection.style.display = 'none';
            }
        }
        // --- End of specific logic ---

        pageContent.style.opacity = '1';

        // Re-run animations for the new active section
        handleScrollAnimation();
        hideLoader();
    }, 800);
};

    const setupEventListeners = (links, isMobile) => {
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (isMobile) {
                    mobileNav.classList.remove('open');
                }
                const targetId = link.getAttribute('href');
                handleNavigation(targetId);
            });
        });
    };
    
    setupEventListeners(navLinks, false);
    setupEventListeners(mobileNavLinks, true);

    burgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    // --- Animation Logic ---
    const handleScrollAnimation = () => {
        // Ensure we only observe elements within the *active* section
        const elements = document.querySelectorAll('.page-section.active .animate-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after animation to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    };

    // --- FIX: Spline iframe scroll issue ---
    if (splineContainer) {
        splineContainer.addEventListener('mouseenter', () => {
            document.body.style.overflow = 'hidden'; // Prevents page scroll
        });
        splineContainer.addEventListener('mouseleave', () => {
            document.body.style.overflow = 'auto'; // Re-enables page scroll
        });
    }

    // --- Initial Load ---
    fetchData();
    handleScrollAnimation();
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Curtain Effect Logic ---
    const whoWeAreSection = document.querySelector('#who-we-are');
    if (whoWeAreSection) {
        const curtainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    curtainObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        curtainObserver.observe(whoWeAreSection);
    }

    // --- Slider Logic ---
    const initSlider = () => {
        const sliderContainer = document.querySelector('.slider-container');
        const track = document.querySelector('.slider-track');
        if (!sliderContainer || !track) return;

        const nextButton = document.getElementById('next-slide');
        const prevButton = document.getElementById('prev-slide');
        let slides, slideWidth, currentIndex = 0;

        const setupSlider = () => {
            slides = Array.from(track.children);
            slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(0px)`;
            currentIndex = 0;
            updateNavButtons();
        };

        const getSlidesPerView = () => window.innerWidth < 576 ? 1 : window.innerWidth < 992 ? 2 : 3;

        const updateSlidePosition = () => {
            const newTransform = -slideWidth * currentIndex;
            track.style.transform = `translateX(${newTransform}px)`;
            updateNavButtons();
        };

        const updateNavButtons = () => {
            if (!nextButton || !prevButton) return;
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= slides.length - getSlidesPerView();
        };

        nextButton?.addEventListener('click', () => {
            if (currentIndex < slides.length - getSlidesPerView()) {
                currentIndex++;
                updateSlidePosition();
            }
        });

        prevButton?.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlidePosition();
            }
        });

        // Swipe Logic
        let isDragging = false, startX, currentX;
        sliderContainer.addEventListener('mousedown', e => { isDragging = true; startX = e.pageX; sliderContainer.style.cursor = 'grabbing'; });
        sliderContainer.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].pageX; });

        const handleMove = (e) => {
            if (!isDragging) return;
            currentX = e.pageX || e.touches[0].pageX;
            const diff = currentX - startX;
            if (Math.abs(diff) > 50) { // Threshold to prevent accidental swipe
                const direction = diff > 0 ? -1 : 1;
                const newIndex = currentIndex + direction;
                const slidesPerView = getSlidesPerView();
                if (newIndex >= 0 && newIndex <= slides.length - slidesPerView) {
                    currentIndex = newIndex;
                    updateSlidePosition();
                }
                isDragging = false; // End swipe after one action
            }
        };
        
        sliderContainer.addEventListener('mousemove', handleMove);
        sliderContainer.addEventListener('touchmove', handleMove);

        const endDrag = () => { isDragging = false; sliderContainer.style.cursor = 'grab'; };
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);

        window.addEventListener('resize', setupSlider);
        setupSlider(); // Initial setup
    };
    initSlider();

    // --- Counter Animation Logic ---
    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        counter.innerText = '0';
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16);

                        const updateCounter = () => {
                            const current = +counter.innerText;
                            if (current < target) {
                                counter.innerText = `${Math.ceil(current + increment)}`;
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(statsSection);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // --- Testimonial Section Logic ---
    const initTestimonialSlider = () => {
        const section = document.querySelector('#testimonials');
        const track = section?.querySelector('.testimonial-track');
        const dotsContainer = section?.querySelector('.testimonial-dots');
        if (!section || !track || !dotsContainer) return;

        let slides, currentIndex = 0;
        
        const setupSlider = () => {
            slides = Array.from(track.children);
            // Create dots
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlidePosition();
                });
                dotsContainer.appendChild(dot);
            });
            updateSlidePosition();
        };

        const updateSlidePosition = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            // Update dots
            Array.from(dotsContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        // Animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(section);

        window.addEventListener('resize', updateSlidePosition);
        setupSlider();
    };

    initTestimonialSlider();
});

document.addEventListener("DOMContentLoaded", function() {
    const animatedElements = document.querySelectorAll('.animate-in-1');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }
});






document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        // The 'answer' element's max-height and opacity are controlled by CSS
        // We no longer need to directly query answer here for display logic,
        // but keeping it for consistency if other properties were needed.

        question.addEventListener('click', () => {
            // Check if the current item is already active
            const isOpen = item.classList.contains('active');

            // Close all other FAQ items before toggling the clicked one.
            // This ensures only one FAQ item is open at a time.
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    // The CSS handles the smooth closing via max-height and opacity.
                    // No need to set display: none; here.
                }
            });

            // Toggle the 'active' class on the clicked item.
            // The CSS will then handle the opening or closing animation.
            if (isOpen) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});




















document.addEventListener('DOMContentLoaded', function() {
    // Get references to the elements
    const whatsappToggleBtn = document.getElementById('whatsapp-toggle-btn');
    const whatsappChatbox = document.getElementById('whatsapp-chatbox');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatboxMessages = document.querySelector('.chatbox-messages');

    // Function to toggle the chatbox visibility
    function toggleChatbox() {
        // We only toggle the 'active' class.
        // The CSS (whatsapp-widget-css Canvas) handles the visibility, opacity,
        // and transform transitions based on the presence of this class.
        whatsappChatbox.classList.toggle('active');

        // Optional: clear input when closing
        if (!whatsappChatbox.classList.contains('active')) {
            chatInput.value = '';
            // When closing, ensure messages scroll to top, or keep current position
            // For now, no specific scroll adjustment on close, let user decide
        } else {
            // When opening, scroll to the bottom to show latest messages
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
            chatInput.focus(); // Focus input field when chatbox opens
        }
    }

    // Function to send a message
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText !== '') {
            // Create a new outgoing message div
            const newMessageDiv = document.createElement('div');
            newMessageDiv.classList.add('message', 'outgoing');
            newMessageDiv.textContent = messageText;
            chatboxMessages.appendChild(newMessageDiv);

            // Scroll to the bottom of the messages area after adding the message
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

            // Clear the input field
            chatInput.value = '';

            // Optional: Simulate a reply after a short delay
            setTimeout(() => {
                const replyMessageDiv = document.createElement('div');
                replyMessageDiv.classList.add('message', 'incoming');
                replyMessageDiv.textContent = "Thank you for your message! We'll get back to you shortly.";
                chatboxMessages.appendChild(replyMessageDiv);
                
                // Scroll to the bottom again after the reply
                chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
            }, 1500); // 1.5 second delay for reply
        }
    }

    // Event listener for the toggle button
    whatsappToggleBtn.addEventListener('click', toggleChatbox);

    // Event listener for pressing Enter in the input field
    chatInput.addEventListener('keypress', function(event) {
        // Check if the pressed key is 'Enter' and the chatbox is active
        if (event.key === 'Enter' && whatsappChatbox.classList.contains('active')) {
            sendMessage();
            event.preventDefault(); // Prevent default Enter key behavior (e.g., new line in input)
        }
    });

    // Optional: Close chatbox if clicked outside (useful for desktop UX)
    // This is a common pattern but can be tricky with fixed elements and z-index.
    // For simplicity, it's omitted but can be added if required.
    // document.addEventListener('click', function(event) {
    //     if (!whatsappChatbox.contains(event.target) && !whatsappToggleBtn.contains(event.target) && whatsappChatbox.classList.contains('active')) {
    //         whatsappChatbox.classList.remove('active');
    //     }
    // });
});






document.addEventListener('DOMContentLoaded', function() {
    // Get references to the Login elements
    const loginButton = document.querySelector('.loginPortal'); // Select the login button by its class
    const loginPopupOverlay = document.getElementById('login-popup-overlay');
    const closeLoginPopupBtn = document.getElementById('close-login-popup');
    const loginForm = document.querySelector('.login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginMessageDiv = document.getElementById('login-message');

    // Function to open the login pop-up
    function openLoginPopup() {
        loginPopupOverlay.classList.add('active');
        loginUsernameInput.focus(); // Focus on username field when pop-up opens
    }

    // Function to close the login pop-up
    function closeLoginPopup() {
        loginPopupOverlay.classList.remove('active');
        // Clear form fields and messages on close
        loginForm.reset();
        loginMessageDiv.textContent = '';
    }

    // Function to handle login form submission (mock)
    function handleLoginSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (username === 'test' && password === 'password') { // Simple mock authentication
            loginMessageDiv.style.color = 'var(--primary-highlight)';
            loginMessageDiv.textContent = 'Login successful! Redirecting...';
            // In a real app, you'd redirect or perform actual login logic here
            setTimeout(() => {
                closeLoginPopup();
                // window.location.href = '/dashboard'; // Example redirection
            }, 1000);
        } else {
            loginMessageDiv.style.color = '#ff4d4d'; // Red for error
            loginMessageDiv.textContent = 'Invalid username or password. Please try again.';
        }
    }

    // Event listeners for Login Pop-up
    // Ensure button exists before attaching listener
    if (loginButton) {
        loginButton.addEventListener('click', openLoginPopup);
    }
    closeLoginPopupBtn.addEventListener('click', closeLoginPopup);
    loginForm.addEventListener('submit', handleLoginSubmit);

    // Close pop-up if clicked outside the container
    loginPopupOverlay.addEventListener('click', function(event) {
        if (event.target === loginPopupOverlay) { // Only close if clicking on the overlay itself
            closeLoginPopup();
        }
    });
});







document.addEventListener('DOMContentLoaded', function() {
    // Get references to the Login elements
    const loginButton = document.querySelector('.loginPortal'); // Select the login button by its class
    const loginPopupOverlay = document.getElementById('login-popup-overlay');
    const closeLoginPopupBtn = document.getElementById('close-login-popup');
    const loginForm = document.querySelector('.login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginMessageDiv = document.getElementById('login-message');

    // Get references to the new Verify Certificate elements
    const verifyButton = document.querySelector('.verifyPortal'); // Select the verify button by its class
    const verifyPopupOverlay = document.getElementById('verify-popup-overlay');
    const closeVerifyPopupBtn = document.getElementById('close-verify-popup');
    const verifyForm = document.querySelector('.verify-form');
    const internIdInput = document.getElementById('intern-id-input');
    const verifyMessageDiv = document.getElementById('verify-message');

    // Function to open the login pop-up
    function openLoginPopup() {
        // Close verify pop-up if open to ensure only one is active at a time
        if (verifyPopupOverlay && verifyPopupOverlay.classList.contains('active')) {
            closeVerifyPopup();
        }
        if (loginPopupOverlay) {
            loginPopupOverlay.classList.add('active');
            loginUsernameInput.focus(); // Focus on username field when pop-up opens
        }
    }

    // Function to close the login pop-up
    function closeLoginPopup() {
        if (loginPopupOverlay) {
            loginPopupOverlay.classList.remove('active');
            // Clear form fields and messages on close
            loginForm.reset();
            loginMessageDiv.textContent = '';
        }
    }

    // Function to handle login form submission (mock)
    function handleLoginSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (username === 'test' && password === 'password') { // Simple mock authentication
            loginMessageDiv.style.color = 'var(--primary-highlight)';
            loginMessageDiv.textContent = 'Login successful! Redirecting...';
            // In a real app, you'd redirect or perform actual login logic here
            setTimeout(() => {
                closeLoginPopup();
                // window.location.href = '/dashboard'; // Example redirection
            }, 1000);
        } else {
            loginMessageDiv.style.color = '#ff4d4d'; // Red for error
            loginMessageDiv.textContent = 'Invalid username or password. Please try again.';
        }
    }

    // Function to open the verify pop-up
    function openVerifyPopup() {
        // Close login pop-up if open
        if (loginPopupOverlay && loginPopupOverlay.classList.contains('active')) {
            closeLoginPopup();
        }
        if (verifyPopupOverlay) {
            verifyPopupOverlay.classList.add('active');
            internIdInput.focus(); // Focus on intern ID field when pop-up opens
        }
    }

    // Function to close the verify pop-up
    function closeVerifyPopup() {
        if (verifyPopupOverlay) {
            verifyPopupOverlay.classList.remove('active');
            // Clear form fields and messages on close
            verifyForm.reset();
            verifyMessageDiv.textContent = '';
        }
    }

    // Function to handle verify form submission (mock)
    function handleVerifySubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const internId = internIdInput.value.trim();

        if (internId === 'ITID000') { // Simple mock verification
            verifyMessageDiv.style.color = 'var(--primary-highlight)';
            verifyMessageDiv.textContent = `Certificate for ${internId} is Valid!`;
            // In a real app, you'd fetch and display actual certificate details
            // Optional: Close after a delay or require user action to close
            // setTimeout(() => { closeVerifyPopup(); }, 2000);
        } else {
            verifyMessageDiv.style.color = '#ff4d4d'; // Red for error
            verifyMessageDiv.textContent = 'Invalid Intern ID. Please try again.';
        }
    }

    // Event listeners for Login Pop-up
    if (loginButton) {
        loginButton.addEventListener('click', openLoginPopup);
    }
    if (closeLoginPopupBtn) {
        closeLoginPopupBtn.addEventListener('click', closeLoginPopup);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    if (loginPopupOverlay) {
        loginPopupOverlay.addEventListener('click', function(event) {
            if (event.target === loginPopupOverlay) {
                closeLoginPopup();
            }
        });
    }

    // Event listeners for Verify Certificate Pop-up
    if (verifyButton) {
        verifyButton.addEventListener('click', openVerifyPopup);
    }
    if (closeVerifyPopupBtn) {
        closeVerifyPopupBtn.addEventListener('click', closeVerifyPopup);
    }
    if (verifyForm) {
        verifyForm.addEventListener('submit', handleVerifySubmit);
    }
    if (verifyPopupOverlay) {
        verifyPopupOverlay.addEventListener('click', function(event) {
            if (event.target === verifyPopupOverlay) {
                closeVerifyPopup();
            }
        });
    }
});

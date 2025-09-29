document.addEventListener('DOMContentLoaded', function() {

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add animation class
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }

    // Scroll animations
    const revealElements = document.querySelectorAll('.fade-in, .reveal-left, .reveal-right, .reveal-bottom');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Mobile menu logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('primary-navigation');
    const backdrop = document.querySelector('.backdrop');

    function openMenu() {
        navLinks.classList.add('is-open');
        hamburger.classList.add('is-open');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close menu');
        if (backdrop) {
            backdrop.hidden = false;
            backdrop.classList.add('is-open');
        }
    }

    function closeMenu() {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        if (backdrop) {
            backdrop.classList.remove('is-open');
            backdrop.hidden = true;
        }
    }

    function toggleMenu() {
        if (navLinks.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        navLinks.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('a')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                closeMenu();
            }
        });

        if (backdrop) {
            backdrop.addEventListener('click', closeMenu);
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 920 && navLinks.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // Smooth scroll for internal links
    if (navLinks) {
        const menuAnchors = navLinks.querySelectorAll('a[href^="#"]');
        menuAnchors.forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href') || '';
                const id = href.slice(1);
                const target = document.getElementById(id);
                
                if (target) {
                    e.preventDefault();
                    closeMenu();
                    
                    setTimeout(() => {
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            });
        });
    }

    // Form handling with validation
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    const sendBtn = document.getElementById('send-btn');
    const photoInput = document.getElementById('photos');
    const uploadArea = document.getElementById('upload-area');
    const photoPreview = document.getElementById('photo-preview');
    
    let selectedFiles = [];
    const MAX_FILES = 3;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    // Photo upload functionality
    if (photoInput && uploadArea && photoPreview) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            photoInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });

        photoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });

        function handleFiles(files) {
            // Filter valid image files
            const validFiles = files.filter(file => {
                const isImage = file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic');
                const isValidSize = file.size <= MAX_FILE_SIZE;
                
                if (!isImage) {
                    setStatus(`${file.name} is not a valid image file.`, 'error');
                    return false;
                }
                if (!isValidSize) {
                    setStatus(`${file.name} exceeds 5MB limit.`, 'error');
                    return false;
                }
                return true;
            });

            // Check total files limit
            if (selectedFiles.length + validFiles.length > MAX_FILES) {
                setStatus(`You can only upload up to ${MAX_FILES} photos.`, 'error');
                return;
            }

            // Add to selected files
            selectedFiles = [...selectedFiles, ...validFiles];
            displayPhotos();
        }

        function displayPhotos() {
            photoPreview.innerHTML = '';
            
            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoItem = document.createElement('div');
                    photoItem.className = 'photo-item';
                    photoItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <button type="button" class="remove-photo" data-index="${index}" aria-label="Remove photo">
                            <i class="fas fa-times"></i>
                        </button>
                        <span class="photo-name">${file.name}</span>
                    `;
                    photoPreview.appendChild(photoItem);
                };
                reader.readAsDataURL(file);
            });

            // Show preview section
            if (selectedFiles.length > 0) {
                photoPreview.style.display = 'grid';
            } else {
                photoPreview.style.display = 'none';
            }
        }

        // Remove photo
        photoPreview.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-photo');
            if (removeBtn) {
                const index = parseInt(removeBtn.dataset.index);
                selectedFiles.splice(index, 1);
                displayPhotos();
            }
        });
    }

    function setStatus(msg, type = 'ok') {
        if (!statusEl) return;
        statusEl.hidden = false;
        statusEl.textContent = msg;
        statusEl.classList.remove('is-error', 'is-ok');
        statusEl.classList.add(type === 'error' ? 'is-error' : 'is-ok');
        
        setTimeout(() => {
            statusEl.hidden = true;
        }, 5000);
    }

    function validateEmail(email) {
        if (!email) return true; // Email is optional
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get and validate fields
            const name = form.name.value.trim();
            const phone = form.phone.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            // Validation
            if (!name || !phone || !message) {
                setStatus('Please fill in all required fields (Name, Phone, Message).', 'error');
                return;
            }

            if (!validatePhone(phone)) {
                setStatus('Please enter a valid phone number (at least 10 digits).', 'error');
                return;
            }

            if (email && !validateEmail(email)) {
                setStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Check honeypot
            if (form.gotcha && form.gotcha.value) {
                return;
            }

            // Disable button and show loading
            if (sendBtn) {
                sendBtn.disabled = true;
                sendBtn.textContent = 'Sending...';
            }
            setStatus('Sending your message...', 'ok');

            try {
                const data = new FormData(form);
                
                // Remove default file input and add selected files
                data.delete('photos');
                selectedFiles.forEach((file, index) => {
                    data.append(`photo-${index + 1}`, file);
                });
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    setStatus('Thank you! We will contact you shortly.', 'ok');
                    form.reset();
                    selectedFiles = [];
                    displayPhotos();
                } else {
                    const json = await response.json().catch(() => ({}));
                    const errorMsg = json.errors?.map(e => e.message).join(', ') || 'There was a problem sending your message. Please try again.';
                    setStatus(errorMsg, 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                setStatus('Network error. Please check your connection and try again.', 'error');
            } finally {
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.textContent = 'Send';
                }
            }
        });

        // Real-time validation feedback
        const phoneInput = form.phone;
        const emailInput = form.email;

        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                if (this.value && !validatePhone(this.value)) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '';
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && !validateEmail(this.value)) {
                    this.style.borderColor = '#dc3545';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    }
});
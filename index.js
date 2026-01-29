// Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll animation for header
        let lastScroll = 0;
        const header = document.querySelector('header');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.style.boxShadow = 'none';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }
            
            lastScroll = currentScroll;
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.feature-card, .comp-card, .practice-item').forEach(el => {
            observer.observe(el);
        });

        // Authentication Modal
        const authModal = document.getElementById('authModal');
        const openAuthBtn = document.getElementById('openAuthModal');
        const closeAuthBtn = document.getElementById('closeAuthModal');
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToSignin = document.getElementById('switchToSignin');
        const authTitle = document.getElementById('authTitle');
        const authSubtitle = document.getElementById('authSubtitle');
        const authSubmit = document.getElementById('authSubmit');
        const authFooterText = document.getElementById('authFooterText');

        let isSignupMode = false;

        openAuthBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeAuthBtn.addEventListener('click', () => {
            authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            isSignupMode = true;
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Start your math competition journey today';
            authSubmit.textContent = 'Sign Up';
            authFooterText.innerHTML = 'Already have an account? <a href="#" id="switchToSignin2">Sign in</a>';
            document.getElementById('switchToSignin2').addEventListener('click', switchToSigninHandler);
        });

        function switchToSigninHandler(e) {
            e.preventDefault();
            isSignupMode = false;
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Sign in to continue your training';
            authSubmit.textContent = 'Sign In';
            authFooterText.innerHTML = 'Don\'t have an account? <a href="#" id="switchToSignup2">Sign up</a>';
            document.getElementById('switchToSignup2').addEventListener('click', switchToSignup.click.bind(switchToSignup));
        }

        switchToSignin.addEventListener('click', switchToSigninHandler);

        // Social auth buttons (these would connect to actual OAuth providers)
        document.getElementById('googleAuth').addEventListener('click', () => {
            alert('Google sign-in would be implemented here using OAuth 2.0');
        });

        document.getElementById('githubAuth').addEventListener('click', () => {
            alert('GitHub sign-in would be implemented here using OAuth 2.0');
        });

        // Form submission (this would connect to your backend)
        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (isSignupMode) {
                alert(`Sign up functionality would create account for: ${email}`);
            } else {
                alert(`Sign in functionality would authenticate: ${email}`);
            }
        });
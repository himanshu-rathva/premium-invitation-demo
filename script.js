document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader & Envelope ---
    const preloader = document.getElementById('preloader');
    const openBtn = document.getElementById('openInviteBtn');
    const mainContent = document.getElementById('mainContent');
    const navDots = document.getElementById('navDots');
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    
    openBtn.addEventListener('click', () => {
        // Open envelope animation
        const envelope = document.querySelector('.envelope');
        envelope.style.transform = 'translateY(-20px) scale(1.05)';
        
        setTimeout(() => {
            preloader.classList.add('slide-up');
            mainContent.classList.remove('hidden');
            navDots.classList.remove('hidden');
            
            // Try to play music
            bgMusic.volume = 0.5;
            bgMusic.play().catch(e => {
                console.log("Audio autoplay prevented by browser");
                musicPlayer.classList.add('paused');
            });
            
            // Trigger initial scroll animations
            handleScrollAnimations();
        }, 800);
    });

    // --- Music Player Toggle ---
    musicPlayer.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicPlayer.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicPlayer.classList.add('paused');
        }
    });

    // --- Scroll Animations ---
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle staggered animations
                if (entry.target.hasAttribute('data-delay')) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, entry.target.getAttribute('data-delay'));
                } else {
                    entry.target.classList.add('visible');
                }
                // Optional: Stop observing once animated
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));

    function handleScrollAnimations() {
        animateElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight - 50) {
                el.classList.add('visible');
            }
        });
    }

    // --- Navigation Dots ---
    const sections = document.querySelectorAll('.section');
    const dots = document.querySelectorAll('.nav-dot');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href').slice(1) === current) {
                dot.classList.add('active');
            }
        });
    });

    // --- Countdown Timer ---
    // Set wedding date: December 15, 2026 09:00:00
    const weddingDate = new Date("Dec 15, 2026 09:00:00").getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(timer);
            document.querySelector('.countdown-grid').innerHTML = '<h2>Happily Married!</h2>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countDays").querySelector('.countdown-number').innerText = days.toString().padStart(3, '0');
        document.getElementById("countHours").querySelector('.countdown-number').innerText = hours.toString().padStart(2, '0');
        document.getElementById("countMinutes").querySelector('.countdown-number').innerText = minutes.toString().padStart(2, '0');
        document.getElementById("countSeconds").querySelector('.countdown-number').innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // --- RSVP Form ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state
        const originalContent = rsvpSubmitBtn.innerHTML;
        rsvpSubmitBtn.innerHTML = '<span class="btn-content">Sending...</span>';
        rsvpSubmitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            rsvpForm.style.display = 'none';
            rsvpSuccess.classList.remove('hidden');
            
            // Optional: Create falling hearts or confetti effect here
            createConfetti();
        }, 1500);
    });

    // --- Particle Background Effect ---
    const canvas = document.getElementById('particleCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particlesArray = [];
        const colors = ['#d4af37', '#e6c27a', '#ffffff']; // Gold and white

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * -1 - 0.5; // Float upwards
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.01;
                
                // Reset particle when it goes off screen
                if(this.y < 0 || this.x < 0 || this.x > canvas.width || this.size <= 0.2) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                    this.size = Math.random() * 3 + 1;
                }
            }
            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        function initParticles() {
            for (let i = 0; i < 50; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // --- Simple Confetti Effect for RSVP ---
    function createConfetti() {
        for(let i=0; i<30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#d4af37', '#e6c27a', '#ff9a9e'][Math.floor(Math.random() * 3)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '9999';
            confetti.style.transition = 'top 3s ease-in, transform 3s ease-in, opacity 3s ease-in';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.transform = `rotate(${Math.random() * 360 + 360}deg)`;
                confetti.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
});

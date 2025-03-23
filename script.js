// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Custom ease for smoother animations
let customEase = "M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1";

// Initialize smooth scrolling with Lenis
const lenis = new Lenis({
    smooth: true,
    direction: 'vertical',
    wrapper: document.body,
    infinite: false
});

// Connect Lenis to GSAP's ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

// Animation loop for smooth scrolling
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Page Loader Animation
function initLoader() {
    // Loader variables
    let counter = { value: 0 };
    let loaderDuration = 5;
    
    // Make loader faster for returning visitors
    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 2;
        counter = { value: 75 };
    }
    sessionStorage.setItem("visited", "true");
    
    // Update loader text as progress changes
    function updateLoaderText() {
        let progress = Math.round(counter.value);
        document.querySelector(".loader_number").textContent = progress;
    }
    
    // Actions after loader is complete
    function endLoaderAnimation() {
        gsap.to(".page-loader", {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                document.querySelector(".page-loader").style.display = "none";
                lenis.start(true);
                
                // Make hero section visible
                gsap.set(".hero-content", { autoAlpha: 1 });
                gsap.set(".hero-content-grid", { yPercent: 0 });
                gsap.set(".hero-name-wrapper", { yPercent: 0 });
            }
        });
    }
    
    // Pause scrolling until loaded
    lenis.stop(true);
    
    // Create loader timeline
    let tlLoad = gsap.timeline({
        onComplete: endLoaderAnimation
    });
    
    // Animate counter and progress bar
    tlLoad.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: CustomEase.create("custom", customEase)
    });
    
    tlLoad.to(".loader_progress", {
        width: "100%",
        duration: loaderDuration,
        ease: CustomEase.create("custom", customEase)
    }, 0);
}

// Create scroll-based animations for the hero section
function initScrollAnimations() {
    // Timeline for fading out hero content when scrolling down
    let tlFirst = gsap.timeline({
        scrollTrigger: {
            trigger: ".experience-section",
            start: "top bottom",
            end: "top center",
            scrub: true,
            toggleActions: "none none reverse none"
        },
        defaults: { ease: "none" }
    });
    
    tlFirst.fromTo(".hero-content", { autoAlpha: 1 }, { autoAlpha: 0 })
           .fromTo(".hero-content-grid", { yPercent: 0 }, { yPercent: -50 }, 0)
           .fromTo(".hero-name-wrapper", { yPercent: 0 }, { yPercent: 50 }, 0);
    
    // Timeline for fading in hero content when scrolling back up
    let tlSecond = gsap.timeline({
        scrollTrigger: {
            trigger: ".experience-section",
            start: "bottom center",
            end: "bottom top",
            scrub: true,
            toggleActions: "none none reverse none"
        },
        defaults: { ease: "none" }
    });
    
    tlSecond.from(".hero-content", { autoAlpha: 0 })
            .from(".hero-content-grid", { yPercent: -50 }, 0)
            .from(".hero-name-wrapper", { yPercent: 50 }, 0);
            
    // Animate experience items on scroll
    gsap.utils.toArray('.experience-item').forEach((item, i) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1,
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Animate contact section on scroll
    gsap.fromTo('.contact-container', 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            scrollTrigger: {
                trigger: '.contact-section',
                start: "top 80%",
                toggleActions: "play none none none"
            }
        }
    );
    
    // Add animation for profile picture
    gsap.fromTo('.profile-picture', 
        { opacity: 0, scale: 0.8 },
        { 
            opacity: 1, 
            scale: 1, 
            duration: 1,
            delay: 0.5,
            ease: "back.out(1.7)"
        }
    );
}

// Initialize all functionality when document is ready
document.addEventListener("DOMContentLoaded", function() {
    initLoader();
    initScrollAnimations();
    
    // Adjust for responsive behavior
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
        console.log("Mobile view detected");
        lenis.destroy();  
        gsap.ticker.lagSmoothing(0);
    }
});
document.addEventListener("DOMContentLoaded", function() {

    const scrollBtn = document.getElementById('scrollTopBtn');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const dropdown = document.getElementById('mobileDropdown');
    const faqItems = document.querySelectorAll('.faq-item');

    if (menuBtn && dropdown) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
            
            const icon = menuBtn.querySelector('i');
            if (dropdown.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    if(icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    }

    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 450) {
                scrollBtn.classList.add('active');
            } else {
                scrollBtn.classList.remove('active');
            }

            if (window.scrollY === 0) {
                scrollBtn.classList.remove('clicked');
            }
        });

        window.scrollToTop = function() {
            scrollBtn.classList.add('clicked');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            scrollBtn.blur();
        };
    }

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if(otherAnswer) otherAnswer.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    if(answer) answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: true,
            offset: 0
        });
    }
    
    const projects = [
        { slug: 'spawnersystem', cardId: 'card-spawnersystem', badgeId: 'spawner-downloads' },
        { slug: 'phantomblocker', cardId: 'card-phantomblocker', badgeId: 'phantom-downloads' },
        { slug: 'envprotect', cardId: 'card-envprotect', badgeId: 'env-downloads' },
        { slug: 'instantshield', cardId: 'card-instantshield', badgeId: 'shield-downloads' },
        { slug: 'advancedtags', cardId: 'card-advancedtags', badgeId: 'advanced-downloads' },
        { slug: 'dynamicdistance', cardId: 'card-dynamicdistance', badgeId: 'dynamic-downloads' },
        { slug: 'pursecommand', cardId: 'card-pursecommand', badgeId: 'purse-downloads' }
    ];

    function fetchProjectData(project) {
        return fetch(`https://api.modrinth.com/v2/project/${project.slug}`)
            .then(response => response.json())
            .then(data => {
                const downloads = data.downloads || 0;
                
                const badgeEl = document.getElementById(project.badgeId);
                if (badgeEl) {
                    const formatted = new Intl.NumberFormat('tr-TR').format(downloads);
                    badgeEl.innerHTML = `<i class="fa-solid fa-download"></i> ${formatted}`;
                }

                return { ...project, downloads: downloads };
            })
            .catch(err => {
                console.error(`${project.slug} verisi alınamadı:`, err);
                return { ...project, downloads: 0 }; 
            });
    }

    Promise.all(projects.map(fetchProjectData)).then(results => {
        results.sort((a, b) => b.downloads - a.downloads);
        const firstCard = document.getElementById(projects[0].cardId);
        if (firstCard && firstCard.parentNode) {
            const container = firstCard.parentNode;
            
            results.forEach(item => {
                const cardElement = document.getElementById(item.cardId);
                if (cardElement) {
                    container.appendChild(cardElement);
                }
            });
        }
    });
});

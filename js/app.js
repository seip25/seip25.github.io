App.createComponent('SobreMi', {
    template: 'sobre-mi',
    onMount: (state) => {
        mutation({ animation: 'fadeIn', selector: 'article', time: 50 });

    }
});
App.createComponent('Proyectos', {
    template: 'proyectos',
    onMount: (state) => {
        mutation({ animation: 'fadeIn', selector: 'article', time: 50 });

    }
});
App.createComponent('Experiencia', {
    template: 'experiencia',
    onMount: (state) => {
        mutation({ animation: 'fadeIn', selector: 'section', time: 50 });

    }
});
App.createComponent('Intereses', {
    template: 'intereses',
    onMount: (state) => {
        mutation({ animation: 'fadeIn', selector: 'section', time: 100 });

    }
});

App.addRoute('*', 'SobreMi')
App.addRoute('/', 'SobreMi');
App.addRoute('/proyectos', 'Proyectos');
App.addRoute('/experiencia', 'Experiencia');
App.addRoute('/intereses', 'Intereses');
handleRouting();


let countAnimations = 0;

function mutation({ animation = 'fadeIn', selector = 'article section', time = 100 }) {
    const observer = new MutationObserver((mutations) => {
        if (time == false) Animations[animation](selector);
        else Animations[animation](selector, time);
        if (countAnimations < 2) Animations.easeOutBack('div,p,ul, .tech-stack img, .tech-stack i', 300);
        countAnimations++;
        observer.disconnect();
    });

    observer.observe(document.getElementById("app-lila"), {
        childList: true,
        subtree: true
    });
}

const Animations = {
    fadeUp: (selector, delay = 0) => {
        return anime({
            targets: selector,
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 800,
            delay: delay,
            easing: 'easeOutQuint'
        });
    },

    fadeIn: (selector, delay = 0) => {
        return anime({
            targets: selector,
            opacity: [0, 1],
            duration: 600,
            delay: delay,
            easing: 'easeInOutQuad'
        });
    },

    staggerFadeUp: (selector) => {
        return anime({
            targets: selector,
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(200, { start: 200 }),
            duration: 700,
            easing: 'easeOutBack'
        });
    },
    easeOutBack: (selector, delay = 300) => {
        anime({
            targets: selector,
            translateY: [15, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: anime.stagger(80, { start: delay }),
            duration: 600,
            easing: 'easeOutBack'
        });
    }
};



window.addEventListener('load', async() => {

    document.body.classList.add('loaded');
    Animations.fadeUp('header nav', 200);
    await savePageView('POST');
});

async function savePageView(method = 'GET') {
    const url = 'https://vps-5161722-x.dattaweb.com';
    const options = {
        method: method
    };
    const request = await fetch(`${url}?page=seip25`, { ...options });
    const response = await request.json();
 
}

function theme(theme_ = false) {
    let theme = theme_ ? theme_ : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    if (theme_) {
        localStorage.setItem('theme', theme_);
    }
    if (localStorage.getItem('theme') === 'dark' || localStorage.getItem('theme') === 'light') {
        theme = localStorage.getItem('theme');
    }
    document.documentElement.setAttribute('data-theme', theme)

    return theme;
}

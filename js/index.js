window.addEventListener('load', () => {

    document.body.classList.add('loaded');
    anime({
        targets: 'header nav article',
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutQuad'
    });

    anime({
        targets: 'main h3 h4',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(200, { from: 'first' }),
        duration: 800,
        easing: 'easeInOutSine'
    });
    anime({
        targets: '.tech-stack img i',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
    
});


// window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//     theme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
// })
// document.addEventListener('DOMContentLoaded', () => {
//     theme();
// });

// function theme(theme_ = false) {
//     let theme = theme_ ? theme_ : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

//     if (theme_) {
//         localStorage.setItem('theme', theme_);
//     }
//     if (localStorage.getItem('theme') === 'dark' || localStorage.getItem('theme') === 'light') {
//         theme = localStorage.getItem('theme');
//     }
//     document.documentElement.setAttribute('data-theme', theme)

//     return theme;
// }

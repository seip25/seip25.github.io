App.createComponent('SobreMi', { template: 'sobre-mi' });
App.createComponent('Proyectos', { template: 'proyectos' });
App.createComponent('Experiencia', { template: 'experiencia' });
App.createComponent('Intereses', { template: 'intereses' });

App.addRoute('*', 'SobreMi')
App.addRoute('/', 'SobreMi');
App.addRoute('/proyectos', 'Proyectos');
App.addRoute('/experiencia', 'Experiencia');
App.addRoute('/intereses', 'Intereses');
handleRouting();
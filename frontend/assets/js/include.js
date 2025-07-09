import $ from 'jquery';

export function loadTemplates() {
    const includes = $('[data-include]');
    const promises = [];

    includes.each(function () {
        const component = $(this).data('include');
        const self = $(this);

        const p = $.get(`/components/${component}.html`).then(html => {

            self.replaceWith(html);
        });

        promises.push(p);
    });

    return Promise.all(promises);
}

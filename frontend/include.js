import $ from 'jquery';

export function loadTemplates() {
    const includes = $('[data-include]');
    const promises = [];

    includes.each(function () {
        const component = $(this).data('include');
        const self = $(this);

        // Δημιουργούμε Promise για κάθε AJAX request
        const p = $.get(`/components/${component}.html`).then(html => {
            // Αντικαθιστούμε το στοιχείο με το HTML του component
            self.replaceWith(html);
        });

        promises.push(p);
    });

    // Επιστρέφουμε ένα Promise που ολοκληρώνεται όταν ολοκληρωθούν όλα
    return Promise.all(promises);
}

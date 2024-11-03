export class Form {
    constructor() {
        this.form = document.createElement('form');
        this.form.innerHTML = `<input type="text" placeholder="Назва фігури" />`;
    }

    onCreate(callback) {
        this.form.onsubmit = (event) => {
            event.preventDefault();
            const name = this.form.querySelector('input').value;
            callback({ name });
        };
    }
}
export class FigureList {
    constructor() {
        this.figureList = document.createElement('div');
        this.figureList.id = 'figureList';
    }

    updateList(figures) {
        this.figureList.innerHTML = '';
        figures.forEach(figure => {
            const listItem = document.createElement('div');
            listItem.textContent = figure.name;
            this.figureList.appendChild(listItem);
        });
    }
}

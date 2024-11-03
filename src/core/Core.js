import { FigureList } from "../client/FigureList";
import { Form } from "../client/Form";
import { Viewer } from "../three/Viewer";
import { figureAPIService } from '../api/figure-service.api';

export class Core {
    constructor() {
        this.filters = {
            geometryType: '',
            color: '',
            size: null
        };
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        
        this.figureListController = new FigureList();
        this.formController = new Form(this.addFigure.bind(this));
        this.viewerController = new Viewer();
    }

    async start() {
        this.loadFiltersFromLocalStorage();
        const figuresData = await figureAPIService.getFiguresData();
        this.updateDisplay(figuresData);
        this.initFilterHandlers();
        this.initSortHandlers();
    }

    initFilterHandlers() {
        document.getElementById('geometryType').addEventListener('change', (event) => {
            this.filters.geometryType = event.target.value;
            this.saveFiltersToLocalStorage();
            this.updateDisplay();
        });

        document.getElementById('colorFilter').addEventListener('input', (event) => {
            this.filters.color = event.target.value;
            this.saveFiltersToLocalStorage();
            this.updateDisplay();
        });

        document.getElementById('sizeFilter').addEventListener('input', (event) => {
            this.filters.size = parseFloat(event.target.value);
            this.saveFiltersToLocalStorage();
            this.updateDisplay();
        });
    }

    initSortHandlers() {
        document.getElementById('sortBy').addEventListener('change', (event) => {
            this.sortBy = event.target.value;
            this.updateDisplay();
        });

        document.getElementById('sortAsc').addEventListener('click', () => {
            this.sortOrder = 'asc';
            this.updateDisplay();
        });

        document.getElementById('sortDesc').addEventListener('click', () => {
            this.sortOrder = 'desc';
            this.updateDisplay();
        });
    }

    filterFigures(figure) {
        const { geometryType, color, size } = this.filters;
        if (geometryType && figure.geometryType !== geometryType) return false;
        if (color && figure.color !== color) return false;
        if (size && figure.size !== size) return false;
        return true;
    }

    sortFigures(figures) {
        const sortBy = this.sortBy || 'name';
        const order = this.sortOrder || 'asc';

        return figures.sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    updateDisplay(figures = []) {
        const filteredFigures = figures.filter(this.filterFigures.bind(this));
        const sortedFigures = this.sortFigures(filteredFigures);
        this.figureListController.updateList(sortedFigures);
        this.viewerController.updateScene(sortedFigures);
    }

    // localstorage
    loadFiltersFromLocalStorage() {
        const savedFilters = JSON.parse(localStorage.getItem('figureFilters'));
        if (savedFilters) {
            this.filters = savedFilters;
            this.applyFiltersToUI();
        }
    }

    saveFiltersToLocalStorage() {
        localStorage.setItem('figureFilters', JSON.stringify(this.filters));
    }

    applyFiltersToUI() {
        document.getElementById('geometryType').value = this.filters.geometryType || '';
        document.getElementById('colorFilter').value = this.filters.color || '#000000';
        document.getElementById('sizeFilter').value = this.filters.size || '';
    }

    async addFigure(figureData) {
        const newFigure = await figureAPIService.addFigureData(figureData);
        if (newFigure) {
            this.updateDisplay();
        }
    }
}

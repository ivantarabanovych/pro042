import axios from 'axios';

class FigureAPIService {
    constructor() {
        this.basePath = 'http://localhost:3000/figures';
    }

    async getFiguresData() {
        try {
            const response = await axios.get(this.basePath);
            return response.data;
        } catch (error) {
            console.error('Помилка завантаження даних:', error);
        }
    }
}

export const figureAPIService = new FigureAPIService();

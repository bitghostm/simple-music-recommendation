import server from '../index';
import request from 'supertest';

export const testApi = {
    post(url, body) {
        const httpRequest = request(server).post(url);
        httpRequest.send(body);
        httpRequest.set('Accept', 'application/json')
        return httpRequest;
    },
    get(url, query) {
        const httpRequest = request(server).get(url);
        httpRequest.query(query);
        return httpRequest.send();
    }
}

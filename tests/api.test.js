const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp[0].user).toEqual('mary123');
    });
});
test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp[2].name).toEqual("Bob's Samsung Galaxy");
    });
});
test('test-ception', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/test`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp).toEqual("The API is working!");
    });
});
   
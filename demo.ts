const request = require("request");


request({
    url: 'https://m.trendyol.com',
    timeout: 5
}, (err: any, res: any, data: any) => {
    console.log(err.connect);
});
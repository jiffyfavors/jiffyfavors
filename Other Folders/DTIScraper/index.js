const _axios = require("axios")
const { exec } = require("child_process");
const axiosRetry = require('axios-retry')
const cheerio = require("cheerio")
const fs = require('fs');
const retryDelay = (retryNumber = 0) => {
    const seconds = Math.pow(2, retryNumber) * 1000;
    const randomMs = 1000 * Math.random();
    return seconds + randomMs;
};
const axios = _axios.create()
axiosRetry(axios, {
    retries: 2,
    retryDelay,
    // retry on Network Error & 5xx responses
    retryCondition: axiosRetry.isRetryableError,
});
async function fetchHTML(url) {
    const { data } = await axios.get(url).catch(err => {
        console.log(err)
        startScraper();
    })
    return cheerio.load(data)
}
let keyword = process.argv.slice(2)[0];
let businesses = [];
async function scraperFn(url) {
    const $ = await fetchHTML(url)
    let biz = [];
    $('body > div.content-wrapper > section.content > div > div.box-body > div > div > table tbody tr').each(function() {
        var children = $(this).children();
        let data = {
            name: $(children[0]).text(),
            teritory: $(children[1]).text(),
            owner: $(children[2]).text(),
            bn: $(children[3]).text(),
            scope: $(children[6]).text()
        }
        biz.push(data)
    });
    var lng = $('body > div.content-wrapper > section.content > div > div.box-body > div > div > div > ul li').length;
    let next = $('body > div.content-wrapper > section.content > div > div.box-body > div > div > div > ul li').children()[lng - 1];
    let _nextPage = $(next).attr('href');
    if (_nextPage) {
        dataWriter(_nextPage, businesses.concat(biz))
    } else {
        exec('pm2 delete ' + keyword, (error, data, getter) => {
            if (error) {
                console.log("error", error.message);
                return;
            }
            if (getter) {
                console.log("data", data);
                return;
            }
            process.exit()
            console.log("data", data);
        });
    }
}

function dataWriter(_nextPage, data) {
    let payload = JSON.stringify({
        nextPage: _nextPage,
        data: data
    }, null, 2)
    fs.writeFile('./results/' + keyword + '.json', payload, (err) => {
        if (err) throw err;
        console.log('Job Done');
        startScraper()
    });
}

function startScraper() {
    fs.readFile('./results/' + keyword + '.json', (err, data) => {
        if (err) {
            dataWriter('http://bnrs.dti.gov.ph/search?keyword=%25' + keyword + '%25&criteria=exact&sort_by=business_name&sort_order=asc', [])
        } else {
            let _nextPage = JSON.parse(data).nextPage;
            businesses = JSON.parse(data).data;
            console.log('Starting New Job:', businesses.length, ' written')
            scraperFn(_nextPage)
        }
    });
}
startScraper()
//console.log(process.argv.slice(2))
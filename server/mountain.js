// URL for list of OnTheSnow mountains 
const ON_THE_SNOW_US_MOUNTAINS_URL = "https://skiapp.onthesnow.com/app/widgets/resortlist?region=us&regionids=429&language=en&pagetype=profile&direction=1&order=resort&limit=1000&countrycode=USA&minvalue=-1&open=anystatus";

exports.setupApp = app => {
    // setup puppeteer 
    const puppeteer = require('puppeteer');
    // package that replicates fetch functionality built into the browser
    const fetch = require('node-fetch');
    // connect to dataStore
    const dataStore = require('./DataStore.js');

    // fetches urls for every OnTheSnow mountain in the US 
    async function fetchOnTheSnowMetaMountainData(){
        // const mountainData = await getJSON(ON_THE_SNOW_US_MOUNTAINS_URL);
        const mountainData = await fetch(ON_THE_SNOW_US_MOUNTAINS_URL);
        if (mountainData){
            return await mountainData.json(); 
        }
        throw new Error(`OnTheSnow Error: ${mountainData.message}`);
    }

    app.get(
        '/api/mountain/meta_mountain_data',
        async (req, res, next) => {
            try {
                // get mountain data from DB 
                let mountainData = await dataStore.getMountainData(); 

                res.status(200);
                res.json(mountainData);
            }
            catch (error){
                // create error object with useful message
                console.log(error);
                const err = new Error('Error: unable to fetch onthesnow data');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        }
    );

    app.get(
        '/api/mountain/single_mountain_data',
        async (req, res, next) => {
            try {
                // get mountain data from DB 
                let mountainKey = req.query.mountainKey; 
                let mountainData = await dataStore.getSingleMountainData(mountainKey);

                res.status(200);
                res.json(mountainData);
            }
            catch (error) {
                // create error object with useful message
                console.log(error);
                const err = new Error('Error: unable to fetch onthesnow data');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        }
    );

    // return the JSON data resulting from remote API requests
    app.get(
        '/api/mountain/scrape/trailmap',
        async (req, res, next) => {

            // cannot get trailmap without url, so report "user error"
            if (!req.query.urlpath) {
                // create error object with useful message
                const err = new Error('Usage: please provide a url path as query parameters');
                // set status code to return with response
                err.status = 400;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
                return;
            } 

            try {
                (async () => {

                    let trailMapUrl = "https://onthesnow.com" + req.query.urlpath;
                    // const trailMapUrl = "https://www.onthesnow.com/montana/big-sky-resort/trailmap.html"

                    const browser = await puppeteer.launch({
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                        ],
                    });
                    let page = await browser.newPage();

                    await page.goto(trailMapUrl, { waitUntil: "networkidle2" });

                    let data = await page.evaluate(() => {
                        let trailMapImageLink = document.querySelector("#tm_popup_open").src;
                        // edit URL to return Xlarge version (want best quality)
                        return {"url": trailMapImageLink.split("/").splice(0, 8).join("/") + "/xlarge.jpg"}
                    });
                    console.log("this is the data:");
                    console.log(data);
                    // everything's good, respond to server 
                    res.status(200);
                    res.send(data);
                })();

            } catch (error) {
                console.log(error);
                // create error object with useful message
                const err = new Error('Error: failed to scrape webpage');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        },
    );

    // return the JSON data resulting from remote API requests
    app.get(
        '/api/scrapedescription',
        async (req, res, next) => {
            try {
                (async () => {

                    const altaUrl = 'https://www.onthesnow.com/utah/alta-ski-area/ski-resort.html';

                    let browser = await puppeteer.launch();
                    let page = await browser.newPage();

                    await page.goto(altaUrl, { waitUntil: "networkidle2" });

                    let data = await page.evaluate(() => {
                        let description = document.querySelector("#profileIN > h4 > p:nth-child(1)").textContent;

                        return description;
                    });
                    console.log(data);
                    // everything's good, respond to server 
                    res.status(200);
                    res.send(data);

                })();
                // console.log(typeof(data));

            } catch (error) {
                console.log(error);
                // create error object with useful message
                const err = new Error('Error: failed to scrape webpage');
                // set status code to return with response
                err.status = 503;
                // forward error on to next middleware handler (the error handler defined below)
                next(err);
            }
        },
    );
}
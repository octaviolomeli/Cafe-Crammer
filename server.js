require('dotenv').config();
const express = require('express');
const https = require("https")
const app = express();
const ejs = require('ejs');
const yelp = require('yelp-fusion');
const apiKey = process.env.YELP_KEY;
const client = yelp.client(apiKey);

// Set views
app.set('views', './views');
app.set('view engine','ejs'); 
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use(express.json())

app.get('', (req, res) => {
    res.render('index', {cafes: "Results will show here", nums: "# of cafes will show here"});
})

app.get('/', (req, res) => {
    res.render('index.ejs', {cafes: "Results will show here", nums: "# of cafes will show here"});
})

app.post('/', (req, res) => {

    // filter a cafe according to user preference
    function filter_cafe(cafe){
        var current = false;
        // Location
        if (cafe['location']['city'] != 'Berkeley' || cafe['location']['state'] != 'CA'){
            return current;
        }

        // Price
        if (cafe['price'] == req.body.price || req.body.price == "Any"){
            current = true;
        }
        // if undefined, then show the cafe anyway
        else if (!(cafe['price'])){
            current = true;
        }
        else if (req.body.price == "$$2"){
            current = cafe['price'] == "$$" || cafe['price'] == "$";
            if (!(current)){
                return current;
            }
        }
        else
        {
            return false;
        }
        // Rating
        if (req.body.rating == 'Any'){
            current = true;
        }
        else{
            if (req.body.rating == '5'){
                current = 5 == parseFloat(cafe['rating']);
            }
            else if (req.body.rating == '35'){
                current = 3 <= parseFloat(cafe['rating']) && parseFloat(cafe['rating']) <= 5;
            }
            else if (req.body.rating == '45'){
                current = 4 <= parseFloat(cafe['rating']) && parseFloat(cafe['rating']) <=5;
            }
            if (!(current)){
                return current;
            }
        }
        // Distance
        if (req.body.distance == 'Any'){
            current = true;
        }
        // Math.round(num * 10) / 10
        else{
            if (req.body.distance == '.5'){
                current = Math.round(10*parseFloat(cafe['distance'])/ 1609)/ 10 <= .5;
            }
            else if (req.body.distance == '1'){
                current = Math.round(10*parseFloat(cafe['distance'])/ 1609)/10 <= 1;
            }
            else if (req.body.distance == '12'){
                current = 1 <= Math.round(10*parseFloat(cafe['distance'])/ 1609)/10 && Math.round(10*parseFloat(cafe['distance'])/ 1609)/10 <= 2;
            }
            if (!(current)){
                return current;
            }
        }
        return current;
    }

    // add a restaurant to the table
    // n = name, w = website, p = phone, r = rating, a = address, d = distance, pl = price level
    function add_entry(n, w, p, r, a, d, pl)
    {
        if (p == ""){
            p = "No phone";
        }
        var html_to_insert = 
        `<div class="row">
            <div class="col-md-12 restaurant">
                <div class="container">
                    <div class="row">
                        <div class="col-md-10 restaurant-name">
                            <a href="${w}" target="_blank" class="url">${n}</a>
                        </div>
                        <div class="col-md-2 price">
                            ${pl}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-7 phone">
                            ${p}
                        </div>
                        <div class="col-md-5 rating">
                            Rating: ${r}/5 stars
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5 distance">
                            ${d} mile(s) away
                        </div>
                        <div class="col-md-7 address">
                            ${a}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        return html_to_insert;
    }

    var len_cafes = 0;
    var cafe_html = "";
    // required for search
    var searchRequest;
    if (req.body.wifi == 'true'){
        searchRequest = {
            term: 'WiFi',
            location: req.body.location,
            categories: 'cafes',
            limit: 50
        };
    } else {
        searchRequest = {
            location: req.body.location,
            categories: 'cafes',
            limit: 50
        };
    }
    
    // api call
    client.search(searchRequest).then(response => {
        const results = response.jsonBody.businesses;
        // loop through cafes
        for (var i=0; i<results.length; i++){
            // cafe meets the user's preferences
            if (filter_cafe(results[i])){
                len_cafes++;
                // add to html
                if (results[i]['price']){
                    cafe_html += add_entry(results[i]['name'], results[i]['url'], results[i]['display_phone'], results[i]['rating'], results[i]['location']['display_address'][0], Math.round(10*parseFloat(results[i]['distance'])/ 1609)/10, results[i]['price']);
                } else {
                    cafe_html += add_entry(results[i]['name'], results[i]['url'], results[i]['display_phone'], results[i]['rating'], results[i]['location']['display_address'][0], Math.round(10*parseFloat(results[i]['distance'])/ 1609)/10, "N/A");
                }
            }
        }
        // refresh page to load in new rows
        res.render('index.ejs', {cafes: cafe_html, nums: (len_cafes + " cafe matches")})
    }).catch(e => {
        console.log(e);
    });
})

app.listen(process.env.PORT, () => {console.log("App is running.")});
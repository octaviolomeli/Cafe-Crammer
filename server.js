require('dotenv').config();
const express = require('express');
const app = express();
const yelp = require('yelp-fusion');
const apiKey = process.env.API_KEY;
const client = yelp.client(apiKey);
const cors = require("cors");
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.urlencoded({ extended: true}));
app.use(express.json())

app.post('/', (req, res) => {
    // filter a cafe according to user preference
    function filter_cafe(cafe){
        var current = false;
        // Location
        if (cafe['location']['city'] != 'Berkeley' || cafe['location']['state'] != 'CA') {
            return current;
        }

        // Price
        if (cafe['price'] == req.body.price || req.body.price == "Any") {
            current = true;
        }
        // if undefined, then show the cafe anyway
        else if (!(cafe['price'])) {
            current = true;
        }
        else if (req.body.price == "$$2") {
            current = cafe['price'] == "$$" || cafe['price'] == "$";
            if (!(current)){
                return current;
            }
        }
        else {
            return false;
        }
        // Rating
        if (req.body.rating == 'Any') {
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
        return {website: w, name: n, phone: p, rating: r, address: a, distance: d, price: pl};
    }

    var len_cafes = 0;
    var cafes = [];
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
        for (var i = 0; i < results.length; i++) {
            // cafe meets the user's preferences
            if (filter_cafe(results[i])){
                len_cafes++;
                // add to html
                if (results[i]['price']){
                    cafes.push(add_entry(results[i]['name'], results[i]['url'], results[i]['display_phone'], results[i]['rating'], results[i]['location']['display_address'][0], Math.round(10*parseFloat(results[i]['distance'])/ 1609)/10, results[i]['price']));
                } else {
                    cafes.push(add_entry(results[i]['name'], results[i]['url'], results[i]['display_phone'], results[i]['rating'], results[i]['location']['display_address'][0], Math.round(10*parseFloat(results[i]['distance'])/ 1609)/10, "N/A"));
                }
            }
        }

        res.send({cafes: cafes, nums: len_cafes});
    }).catch(e => {
        console.log(e);
    });
})

app.listen(process.env.PORT, () => {console.log("App is running.")});

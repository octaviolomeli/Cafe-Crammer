import ReactDOM from 'react-dom/client';
import { createRoot } from "react-dom/client";
import './App.css';
import Filter from './Filter';
import Cafe from './Cafe';

const information = [
[{value:".5", text: ".5 or less"}, {value:"1", text:"1 or less"}, {value:"12", text:"1 to 2"}, {value:"Any", text: "Any"}],
[{value:"$", text:"$"}, {value:"$$", text:"$$"}, {value:"$$$", text:"$$$"}, {value:"$$2", text:"$ or $$"}, {value:"Any", text:"Any"}],
[{value:"5", text:"5 only"}, {value:"45", text:"4 to 5"}, {value:"35", text:"3 to 5"}, {value:"Any", text:"Any"}],
[{value:"true", text:"Yes"}, {value:"Any", text: "Doesn't matter"}]
]

function search() {
  let location = document.getElementById("autocomplete").value;
  let distance = document.getElementsByName("distance")[0]
  distance = distance.options[distance.selectedIndex].value;
  let price = document.getElementsByName("price")[0]
  price = price.options[price.selectedIndex].value;
  let rating = document.getElementsByName("rating")[0]
  rating = rating.options[rating.selectedIndex].value;
  let wifi = document.getElementsByName("wifi")[0]
  wifi = wifi.options[wifi.selectedIndex].value;

  document.getElementsByClassName("results-box")[0].innerHTML = "";

  fetch("http://localhost:4000/", {
    method: 'post', 
    body: JSON.stringify({location: location, distance: distance, price: price, rating: rating, wifi: wifi}),
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(response => response.json())
  .then(json => {
    const container = document.getElementsByClassName("results-box")[0];
    const cafes = json.cafes;

    for (var i = 0; i < cafes.length; i++) {
      let individualCafe = document.createElement("div");
      let root = createRoot(individualCafe);
      root.render(<Cafe  website={cafes[i].website} name={cafes[i].name} price={cafes[i].price} wifi={cafes[i].wifi} phone={cafes[i].phone} rating={cafes[i].rating} distance={cafes[i].distance} address={cafes[i].address} />);
      container.appendChild(individualCafe);
    }
    document.getElementById("num-results").innerHTML = json.nums + " cafes matched.";
  })
}

function App() {
  return (
    <div className="App">
      <div className="berkeley-image">
        <div className="top">
            <h1>Café Crammer</h1>
            <p>Find cafés that meet your needs</p>
        </div>
      </div>
      
      <div className="bottom">
        <div className="container">
            <br />
            <p id="filter">
                Things to note
            </p>
            <ul>
                <li>Only cafes located in the city of Berkeley are shown.</li>
                <li>Data is provided by Yelp. Check the opening hours of each store by clicking on their names.</li>
            </ul>

            <div className="row">
                <div className="col-md-4">
                  <p id="filter">
                      Your location
                  </p>
                  
                  <div className="filters">
                      <input id="autocomplete" name="location" placeholder="Type a location" type="text" required/>
                  </div>
                  <br />
                  <p id="filter">
                      Filters
                  </p>
                  <Filter name="distance" data={information[0]} spanText="Mile(s) away:" />

                  <Filter name="price" data={information[1]} spanText="Price Level:" />

                  <Filter name="rating" data={information[2]} spanText="Rating:" />

                  <Filter name="wifi" data={information[3]} spanText="WiFi:" />

                  <span id="location_popup">Enter a location before filtering</span><br />
                  <button id="search-button" onClick={search}>Search</button>
                  
                </div>

                <div className="col-md-8">
                  <div id="num-results">
                    # of cafes will show here
                  </div>
                  <div className="results-box container">
                    Results will show here
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;

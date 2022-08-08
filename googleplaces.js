// in header tag
<script src="https://maps.googleapis.com/maps/api/js?key=[]&libraries=places&callback=initAutocomplete" async defer></script>

// input tag
<input id="autocomplete" placeholder="Enter a location" type="text" />

// function
let autocomplete;
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      types: [],
      componentRestrictions: {'country': ['US']},
      fields: ['place_id', 'geometry', 'name']
    });
  autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged(){
  var place = autocomplete.getPlace();
  
  if (!place.geometry){
    // User did not slect a prediction, reset the input field
    document.getElementById('autocomplete').placeholder = 'Enter a location';
  } else {
    // assign place.name to location variable to use for yelp api call
    location = place.name;
  }
}

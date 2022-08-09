var autocomplete;
function initAutocomplete() {
  var BerkeleyCenter = new google.maps.LatLng(37.871532, -122.273010);
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      componentRestrictions: {'country': ['us']},
      location: BerkeleyCenter,
      radius: 6400,
      strictbounds: true,
      fields: ['place_id', 'geometry', 'name']
    });
  autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged(){
  var place = autocomplete.getPlace();
  
  if (!place.geometry){
    // User did not slect a prediction, reset the input field
    document.getElementById('autocomplete').placeholder = 'Enter a location';
  }
}
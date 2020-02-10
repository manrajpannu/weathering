var currentTime = new Date().getHours();
var elem = document.getElementById('bodybox')


// function to see if its day or night
// then changes the background 
if (7 <= currentTime && currentTime < 20) {
 	elem.className  = "morning";
}
else {
	elem.className  = "night";
}

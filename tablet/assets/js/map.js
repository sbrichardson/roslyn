//create an array to hold all the markers
var markers = [
   			//Offices
   			["The Engineering Computing Center is for the use of Engineering and Computer Science majors/minors, and for anyone currently taking an engineering or computer science class. All users must abide by the Engineering Computing Center Extended Usage Agreement. The ECC has dual booted (Microsoft Windows 7 & Linux Ubuntu) computers located in rooms A, B, C, D, E and the north side of F. Some labs are used as Teaching Laboratories and are open for general use only when classes are not being held in the rooms.  A schedule for these labs can be found by following the Lab links on the right of the screen.  Rooms A and F are open for general use during all ECC business hours.", 0.268, 0.134],
   			["Department of Computer Science and Engineering Office", 0.252, 1.496],
   			["IT Room", 0.486, 1.570],
   			["Dr. George Bebis's Office", 0.120, 1.650],
   			["TA Offices", 0.909, -0.260],
   			["Dr. Fred Harris's Office", -0.140, 1.650],
   			["Nancy Latourette's", -0.140,  1.488],

   			//Labs
   			["ECSL Lab", -0.570, -1.697],
   			["Room 211", 0.000, -1.690],
   			["Robotics Lab", 0.679, 1.570],
   			["Robotics Lab Storage Room", 0.570, 1.230],


   			//Classrooms
   			["Room 234 - Main Classroom", 0.178, 0.909],
   			["Room 201 - Classroom", -0.820, -1.700],

   			//Amenities
   			["Men's Restroom", 0.135, -0.443],
   			["Women's Restroom", 0.125, 1.230],

   			//Rooms that I don't yet know what they are
   			["Room 200", -0.850, -1.460],
   			["Room 202", -0.660, -1.457],
   			["Room 204", -0.520, -1.454],
   			["Room 206", -0.400, -1.451],
   			["Room 208", -0.280, -1.448],
   			["Room 210", -0.140, -1.445],
   			["Room 212", -0.140, -1.300],
   			["Room 214", -0.140, -1.170],
   			["Room 216", -0.140, -1.050],
   			["Room 218", -0.140, -0.925],
   			["Room 220", -0.140, -0.805],
   			["Room 221", -0.140, -0.680],
   			["Room 222", -0.140, -0.555],
   			["Room 223", -0.140, -0.430],
   			["Room 224", -0.140, -0.310],
   			["Room 226", -0.140, -0.185],
   			["Room 227", -0.140, -0.060],
   			["Room 229", -0.140,  0.085],
   			["Room 230", -0.140,  0.315],
   			["Room 232", -0.140,  0.440],
   			["Room 233", -0.140,  0.675],
   			["Room 235", -0.140,  0.824],
   			["Room 236", -0.140,  0.950],
   			["Room 237", -0.140,  1.080],
   			["Room 238", -0.140,  1.210],
   			["Room 239", -0.140,  1.350],
   			["Room 243",  0.280,  1.230],
   			["Room 244",  0.410,  1.230],
   			["Room 249",  0.520,  0.950],
   			["Room 250",  0.520,  0.725],
   			["Room 251",  0.920,  0.640],
   			["Room 247",  0.920,  1.350],
   			["Room 261",  0.250, -0.740],
   			["Room 257",  0.570, -0.740],
   			["Room 219",  0.170, -0.970],
   			["Room 217",  0.170, -1.250],
];


var map = L.map('map_pane', {zoom:8, minZoom:8, maxZoom:10, zoomControl:false}).setView([0,0], 0);

var southWest = L.latLng(-400/360.0, -640/360.0),
northEast = L.latLng(400/360.0, 640/360.0),
bounds = L.latLngBounds(southWest, northEast);

L.imageOverlay('assets/img/scaleMap.png', bounds).addTo(map);

//sets bounds
var southWest2 = L.latLng(-500/360.0, -740/360.0),
northEast2 = L.latLng(500/360.0, 740/360.0),
bounds2 = L.latLngBounds(southWest2, northEast2);

map.setMaxBounds(bounds2);

//Place all markers on the map
for (var i = 0; i < markers.length; i++) 
{
	marker = new L.marker([markers[i][1],markers[i][2]])
		.bindPopup(markers[i][0])
		.addTo(map);
}

// (just for testing) create a popup whereever the user clicks the map
var popup = L.popup();
function onMapClick(e) {
popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
}

map.on('click', onMapClick);



require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/widgets/Legend"	
  ], function(Map, MapView, Graphic, GraphicsLayer, FeatureLayer, Locate, Search, Legend) {

        // Create a basemap for the map view
        var myMap = new Map({
            basemap: "gray-vector"
        });

        // Create a map view for the HTML using the basemap
        // previously created.
        var myView = new MapView({
            container: "viewDiv",  // HTML ID 
            map: myMap,        // BaseMap Created
            zoom: 12.5 ,     // zoom in level
            center : [-111.792824, 43.825386 ]   //start location     
        });


        // Create a Graphics Layer which can be used to draw graphics
        // on the map
        var graphicsLayer = new GraphicsLayer();
        myMap.add(graphicsLayer);        

        // pull information from the Json file 
        var placesJson = fetch("./places.json").then(places => {
            places.json().then(data => {
                
         // Loop through each feature in the json file 
                for (var place of data.features) {

                    // color of point marker
                    var place_color;
                    place_color = [50, 54, 168]

                    var marker = {
                        type: "simple-marker",
                        style: "square",
                        color: place_color
                    };

                    // Define location to draw
                    // This JS map is expected by ArcGIS to make a graphic
                    var location = {
                        type: "point",
                        longitude: place.long,
                        latitude: place.lat
                    };

                    // Define attributes for us in popup template.  The popup
                    // template uses {}'s to access items in the attributes map.
                    // The template content also supports HTML tags.
                    var popup_attributes = {
                        name: place.name
                    }

                    var popup_template = {
                        title: "Places To Go With Kids",
                        content: "Name: {name}"
                    }
            
                    // Combine location and symbol to create a graphic object
                    // Also include the attributes and template for popup
                    var graphic = new Graphic({
                        geometry: location,
                        symbol: marker,
                        attributes: popup_attributes,
                        popupTemplate: popup_template
                    });

                    // Add the graphic (with its popup) to the graphics layer
                    graphicsLayer.add(graphic);

                } // End of Loop
            
            })})

        // Create a locate me button
        var locate = new Locate({
            view: myView,
            useHeadingEnabled: false,
            goToOverride: function(view, options) {
                options.target.scale = 1000000;  // 1/1000000 scale
                return view.goTo(options.target);
              }
        });
        myView.ui.add(locate, "top-left");

        var search = new Search({
            view: myView
        });
        myView.ui.add(search, "top-right"); 

        // var legend = new Legend({
        //     view: myView,
        //     layerInfos: [{
        //         layer: volcanoLayer,
        //         title: "Volcano Legend"
        //     }, {
        //         layer: faultsLayer,
        //         title: "Faults Legend"
        //     }]
        // });
        // myView.ui.add(legend, "bottom-left");

});
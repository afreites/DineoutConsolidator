var zkey='e61d98604aa556372466d466c4f086df'
//Get a reference to the table body
var tbody = d3.select("tbody");

// Select the submit button
var submit = d3.select("#submit");
submit.on("click", function(){
    
    // Prevent the page from refreshing
    d3.event.preventDefault();
    
    // Select the input element restaurant name
    var name = d3.select("#name").node().value;
    //var inputName = name.property("value");
    console.log(name);
    
    // Get the input element telephone number
    var phone = d3.select("#phone").node().value;
    console.log(phone);

    //Get the city and return the latitude and longitude
    var city = d3.select("#city").node().value;
    console.log(city);
    var lat ="";
    var lng = "";
    if (city == "toronto"){
        lat = 43.6532;
        lng = -79.3832;
    } else if(city == "los angeles"){
        lat = 34.0522;
        lng = -118.2437;
    } else if (city == "new york"){
        lat = 40.7128;
        lng = -74.0060;
    } else {"City not available"};

    getReviews(phone, name, lat, lng);
});

function getReviews(phone, name, lat, lng){
    //Pass the phone number to the app.py to pull the data using the api
    var google_url = `/api/google?phone=${phone}`;
    //var google_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${g_phone}&inputtype=phonenumber&fields=formatted_address,name,user_ratings_total,price_level,rating&key=${gkey}`;
    console.log(google_url);

    d3.json(google_url).then(function(data) {
        // Grab values from the response json object to build the table
        console.log(data);
        var g_rating = data.candidates[0].rating;
        var g_reviews = data.candidates[0].user_ratings_total;
        var price_level = data.candidates[0].price_level;

        var row = d3.select("#g_results");
        row.html('');
        cell = row.append("th");
        cell.text("Google");
        cell.attr("scope", "row");
        cell = row.append("td");
        cell.text(g_rating);
        cell = row.append("td");
        cell.text(g_reviews);
        cell = row.append("td");
        cell.text("$".repeat(price_level));
    });


    //Get the yelp review
    var yelp_url = `/api/yelp?phone=${phone}`;
    //var params_ld = {'phone':y_phone};
    //response = (yelp_url, params=params_ld, headers=headers); 
    //console.log(response);
    console.log(yelp_url);
    d3.json(yelp_url).then(function(y_data) {
        console.log(y_data);
        // Grab values from the response json object to build the table
        var y_rating = y_data.businesses[0].rating;
        var y_reviews = y_data.businesses[0].review_count;
        var y_price_range = y_data.businesses[0].price;
        var address = y_data.businesses[0].location;
        
        var cell = d3.select("#address");
        cell.text(`Address: ${address["address1"]}, ${address["address2"]}`);
        
        var row = d3.select("#y_results");
        row.html('');
        var cell = row.append("th");
        cell.text("Yelp");
        cell.attr("scope", "row");
        cell = row.append("td");
        cell.text(y_rating);
        cell = row.append("td");
        cell.text(y_reviews);
        cell = row.append("td");
        cell.text(y_price_range);
    });
    //Get the zomato review
    var zomato_url = `/api/zomato?name=${name}&lat=${lat}&lng=${lng}`
    d3.json(zomato_url).then(function(z_data) {
        console.log(z_data);
        console.log(z_data.restaurants[0].restaurant);
        // Grab values from the response json object to build the table
        var z_rating = z_data.restaurants[0].restaurant.user_rating.aggregate_rating;
        var z_reviews = z_data.restaurants[0].restaurant.user_rating.votes;
        console.log("z_reviews" + z_reviews);
        var z_price_range = z_data.restaurants[0].restaurant.price_range;
        
        var row = d3.select("#z_results");
        row.html('');
        var cell = row.append("th");
        cell.text("Zomato");
        cell.attr("scope", "row");
        cell = row.append("td");
        cell.text(z_rating);
        cell = row.append("td");
        cell.text(z_reviews);
        cell = row.append("td");
        cell.text("$".repeat(z_price_range));     
    });
};
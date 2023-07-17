var key = "3b8979c5c1714c929db3bf4eff3f8a62";

        //shown locations is an array to hold the locations that we have shown on the screen currently
        var shownlocations = [];
        console.log(shownlocations);
        document.getElementById("current").addEventListener('click', currentLocation);
        document.getElementById("lookup").addEventListener('submit', lookupLocation);
        //we can use the IP address of the user to lookup their current location and show the weather for that location if they click this button
        
        function currentLocation() {
            if (shownlocations.length > 2) {
                alert("Delete a location before adding another. 3 locations maximum.");
            }
            else {
                console.log("implement current location function");

                /*The GEOAPIFY API lets you automatically detect a user's IP address and returns an object with the city name. I then use the city name to make a request to the Weatherbit API.*/
                var xhttpIP = new XMLHttpRequest();
                xhttpIP.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        var IPObject = JSON.parse(this.responseText);
                        console.log(this.responseText);
                        var cityFromIP = IPObject.city.name;

                        /*This is our request to the Weatherbit API*/
                        var xhttp1 = new XMLHttpRequest();
                        // Response handler
                        xhttp1.onreadystatechange = function () {
                            // Wait for readyState = 4 & 200 response
                            if (this.readyState == 4 && this.status == 200) {

                                // parse JSON response
                                var response = JSON.parse(this.responseText);

                                console.log(response);

                                var duplicate = false;
                                for (i = 0; i < shownlocations.length; i++) {
                                    if (shownlocations[i] === response.data[0].city_name) {
                                        alert("You have already saved this location. Try another one.");
                                        duplicate = true;
                                        event.preventDefault;
                                    }
                                }

                                if (!duplicate) {
                                    var newdiv = document.createElement('div');
                                    newdiv.className = "row onelocation";
                                    var coldiv1 = document.createElement('div');
                                    coldiv1.className = "col-sm-6";
                                    var coldiv2 = document.createElement('div');
                                    coldiv2.className = "col-sm-6";

                                    var buttondiv = document.createElement('div');
                                    buttondiv.className = "row";
                                    var refreshbutton = document.createElement('button');
                                    refreshbutton.innerHTML = "Refresh Location";
                                    newdiv.appendChild(refreshbutton);

                                    var locationdiv = document.createElement('div');
                                    locationdiv.className = "row";
                                    locationdiv.id = "locationtext";
                                    var tempdiv = document.createElement('div');
                                    tempdiv.className = "row";
                                    var timediv = document.createElement('div');
                                    timediv.className = "row";
                                    var weatherdiv = document.createElement('div');
                                    weatherdiv.className = "row";

                                    var location = document.createElement('h3');
                                    var temperature = document.createElement('h2');
                                    var time = document.createElement('h3');
                                    var weather = document.createElement('img');

                                    /*Don't display the state if it's outside the US*/
                                    if (response.data[0].country_code === "US"){
                                        location.innerHTML = response.data[0].city_name + ", " + response.data[0].state_code + ", " + response.data[0].country_code;
                                    }
                                    else{
                                        location.innerHTML = response.data[0].city_name + ", " + response.data[0].country_code;
                                    }

                                    var today = new Date();
                                    var ampm = "am";
                                    var hours;
                                    var minutes;
                                    if (today.getHours() >= 12) {
                                        ampm = "pm";
                                        if (today.getHours() > 12) {
                                            hours = today.getHours() - 12;
                                        }
                                    }
                                    if (today.getHours() <= 12) {
                                        hours = today.getHours();
                                    }
                                    if (today.getMinutes() < 10) {
                                        minutes = '0' + today.getMinutes();
                                    }
                                    else {
                                        minutes = today.getMinutes();
                                    }
                                    var currenttime = hours + ":" + minutes + ":" + today.getSeconds() + " " + ampm;
                                    time.innerHTML = currenttime;
                                    temperature.innerHTML = response.data[0].app_temp + "°F";
                                    weather.src = "./icons/" + response.data[0].weather.icon + ".png";

                                    newdiv.appendChild(coldiv1);
                                    newdiv.appendChild(coldiv2);

                                    buttondiv.appendChild(refreshbutton);
                                    coldiv1.appendChild(buttondiv);
                                    coldiv1.appendChild(locationdiv);
                                    locationdiv.appendChild(location);
                                    coldiv1.appendChild(tempdiv);
                                    tempdiv.appendChild(temperature);
                                    coldiv1.appendChild(timediv);
                                    timediv.appendChild(time);
                                    coldiv2.appendChild(weatherdiv);
                                    weatherdiv.appendChild(weather);

                                    var exbutton = document.createElement('button');
                                    exbutton.id = "exbutton";
                                    var ex = document.createElement('i');
                                    ex.className = "fa fa-times fa-2x";
                                    exbutton.appendChild(ex);
                                    newdiv.appendChild(exbutton);

                                    ex.addEventListener('click', (event) => {
                                        console.log(event.target.parentNode.parentNode);
                                        event.target.parentNode.parentNode.remove();
                                        for (i = 0; i < shownlocations.length; i++) {
                                            if (shownlocations[i] === response.data[0].city_name) {
                                                shownlocations.splice(i, 1);
                                            }
                                        }
                                    })

                                    document.getElementById("displays").appendChild(newdiv);

                                    refreshbutton.addEventListener('click', (event) => {
                                        console.log("refreshing");
                                        var xhttp3 = new XMLHttpRequest();
                                        xhttp3.onreadystatechange = function () {
                                            if (this.readyState == 4 && this.status == 200) { /*Update temp and weather icons when hitting refresh button on location*/
                                                var refreshResponse = JSON.parse(this.responseText);
                                                temperature.innerHTML = refreshResponse.data[0].app_temp + "°F";
                                                weather.innerHTML = "./icons/" + refreshResponse.data[0].weather.icon + ".png";
                                                var today = new Date();
                                                var ampm = "am";
                                                var hours;
                                                var minutes;
                                                if (today.getHours() >= 12) {
                                                    ampm = "pm";
                                                    if (today.getHours() > 12) {
                                                        hours = today.getHours() - 12;
                                                    }
                                                }
                                                if (today.getHours() <= 12) {
                                                    hours = today.getHours();
                                                }
                                                if (today.getMinutes() < 10) {
                                                    minutes = '0' + today.getMinutes();
                                                }
                                                else {
                                                    minutes = today.getMinutes();
                                                }
                                                var currenttime = hours + ":" + minutes + ":" + today.getSeconds() + " " + ampm;
                                                time.innerHTML = currenttime;
                                                console.log("refreshed time " + refreshResponse.data[0].ob_time);
                                            }
                                            else if (this.readyState == 4) {
                                                console.log(this.responseText);
                                            }
                                        };
                                       
                                        xhttp3.open("GET", "https://api.weatherbit.io/v2.0/current?&city=" + cityFromIP + "&key=3b8979c5c1714c929db3bf4eff3f8a62&units=I", true);
                                        xhttp3.send();
                                    })

                                    shownlocations.push(response.data[0].city_name);
                                }


                            } else if (this.readyState == 4) {

                                // this.status !== 200, error from server
                                console.log(this.responseText);

                            }
                        };
                        
                        xhttp1.open("GET", "https://api.weatherbit.io/v2.0/current?&city=" + cityFromIP + "&key=3b8979c5c1714c929db3bf4eff3f8a62&units=I", true);
                        xhttp1.send();
                    }


                    else if (this.readyState == 4) {
                        // this.status !== 200, error from server
                        console.log(this.responseText);
                    }
                }
                xhttpIP.open("GET", "https://api.geoapify.com/v1/ipinfo?&apiKey=f881a864b69a4562a84f386dd44734d5", true);
                xhttpIP.send();
            }
        }

        function lookupLocation(event) {
            if (shownlocations.length > 2) {
                alert("Delete a location before adding another. 3 locations maximum.");
                event.preventDefault();
            }
            else {
                console.log("implement lookup location function");
                event.preventDefault();
                var inputData = {
                    text: document.getElementById("loclookup").value
                }
                console.log(inputData.text);
                var xhttp2 = new XMLHttpRequest();
                // Response handler
                xhttp2.onreadystatechange = function () {

                    // Wait for readyState = 4 & 200 response
                    if (this.readyState == 4 && this.status == 200) {

                        // parse JSON response
                        var response = JSON.parse(this.responseText);

                        console.log(response);
                        var duplicate = false;
                        for (i = 0; i < shownlocations.length; i++) {
                            if (shownlocations[i] === response.data[0].city_name) {
                                alert("You have already saved this location. Try another one.");
                                duplicate = true;
                                event.preventDefault;
                            }
                        }

                        if (!duplicate) {
                            var newdiv = document.createElement('div');
                            newdiv.className = "row onelocation";
                            var coldiv1 = document.createElement('div');
                            coldiv1.className = "col-sm-6";
                            var coldiv2 = document.createElement('div');
                            coldiv2.className = "col-sm-6";

                            var buttondiv = document.createElement('div');
                            buttondiv.className = "row";
                            var refreshbutton = document.createElement('button');
                            refreshbutton.innerHTML = "Refresh Location";
                            newdiv.appendChild(refreshbutton);

                            var locationdiv = document.createElement('div');
                            locationdiv.className = "row";
                            locationdiv.id = "locationtext";
                            var tempdiv = document.createElement('div');
                            tempdiv.className = "row";
                            var timediv = document.createElement('div');
                            timediv.className = "row";
                            var weatherdiv = document.createElement('div');
                            weatherdiv.className = "row";

                            var location = document.createElement('h3');
                            var temperature = document.createElement('h2');
                            var time = document.createElement('h3');
                            var weather = document.createElement('img');

                            /*Don't display the state if it's outside the US*/
                            if (response.data[0].country_code === "US"){
                                location.innerHTML = response.data[0].city_name + ", " + response.data[0].state_code + ", " + response.data[0].country_code;
                            }
                            else{
                                location.innerHTML = response.data[0].city_name + ", " + response.data[0].country_code;
                            }

                            var today = new Date();
                            var ampm = "am";
                            var hours;
                            var minutes;
                            if (today.getHours() >= 12) {
                                ampm = "pm";
                                if (today.getHours() > 12) {
                                    hours = today.getHours() - 12;
                                }
                            }
                            if (today.getHours() <= 12) {
                                hours = today.getHours();
                            }
                            if (today.getMinutes() < 10) {
                                minutes = '0' + today.getMinutes();
                            }
                            else {
                                minutes = today.getMinutes();
                            }
                            var currenttime = hours + ":" + minutes + ":" + today.getSeconds() + " " + ampm;
                            time.innerHTML = currenttime;
                            temperature.innerHTML = response.data[0].app_temp + "°F";
                            weather.src = "./icons/" + response.data[0].weather.icon + ".png";

                            newdiv.appendChild(coldiv1);
                            newdiv.appendChild(coldiv2);

                            buttondiv.appendChild(refreshbutton);
                            coldiv1.appendChild(buttondiv);
                            coldiv1.appendChild(locationdiv);
                            locationdiv.appendChild(location);
                            coldiv1.appendChild(tempdiv);
                            tempdiv.appendChild(temperature);
                            coldiv1.appendChild(timediv);
                            timediv.appendChild(time);
                            coldiv2.appendChild(weatherdiv);
                            weatherdiv.appendChild(weather);

                            var exbutton = document.createElement('button');
                            var ex = document.createElement('i');
                            exbutton.id = "exbutton";
                            ex.className = "fa fa-times fa-2x";
                            exbutton.appendChild(ex);
                            newdiv.appendChild(exbutton);

                            document.getElementById("displays").appendChild(newdiv);

                            refreshbutton.addEventListener('click', (event) => {
                                console.log("refreshing");
                                var xhttp4 = new XMLHttpRequest();
                                xhttp4.onreadystatechange = function () {
                                    if (this.readyState == 4 && this.status == 200) { /*Update temp and weather icons when hitting refresh button on location*/
                                        var refreshResponse = JSON.parse(this.responseText);
                                        temperature.innerHTML = refreshResponse.data[0].app_temp + "°F";
                                        weather.src = "./icons/" + refreshResponse.data[0].weather.icon + ".png";
                                        var today = new Date();
                                        var ampm = "am";
                                        var hours;
                                        var minutes;
                                        if (today.getHours() >= 12) {
                                            ampm = "pm";
                                            if (today.getHours() > 12) {
                                                hours = today.getHours() - 12;
                                            }
                                        }
                                        if (today.getHours() <= 12) {
                                            hours = today.getHours();
                                        }
                                        if (today.getMinutes() < 10) {
                                            minutes = '0' + today.getMinutes();
                                        }
                                        else {
                                            minutes = today.getMinutes();
                                        }
                                        var currenttime = hours + ":" + minutes + ":" + today.getSeconds() + " " + ampm;
                                        time.innerHTML = currenttime;
                                        console.log("refreshed time " + refreshResponse.data[0].ob_time);
                                    }
                                    else if (this.readyState == 4) {
                                        console.log(this.responseText);
                                    }
                                };
                                if (!isNaN(inputData.text)) {
                                    xhttp4.open("GET", "https://api.weatherbit.io/v2.0/current?&postal_code=" + inputData.text + "&key=3b8979c5c1714c929db3bf4eff3f8a62&units=I", true);
                                }
                                else {
                                    xhttp4.open("GET", "https://api.weatherbit.io/v2.0/current?&city=" + inputData.text + "&key=3b8979c5c1714c929db3bf4eff3f8a62&units=I", true);
                                }

                                /*old api: https://api.weatherstack.com/current?access_key=55d5f40c0e1a6b6bf033ee4965041514&query=" + data.text + "&units=f"*/
                                xhttp4.send();
                                console.log(response);
                            })
                            ex.addEventListener('click', (event) => {
                                console.log(event.target.parentNode.parentNode);
                                event.target.parentNode.parentNode.remove();
                                for (i = 0; i < shownlocations.length; i++) {
                                    if (shownlocations[i] === response.data[0].city_name) {
                                        shownlocations.splice(i, 1);
                                    }
                                }
                            })
                            shownlocations.push(response.data[0].city_name);
                        }



                    } else if (this.readyState == 4) {

                        // this.status !== 200, error from server
                        console.log(this.responseText);

                    }
                };

                if (!isNaN(inputData.text)) {
                    xhttp2.open("GET", "https://api.weatherbit.io/v2.0/current?&postal_code=" + inputData.text + "&key=3b8979c5c1714c929db3bf4eff3f8a62&units=I", true);
                }
                else {
                    xhttp2.open("GET", "https://api.weatherbit.io/v2.0/current?&city=" + inputData.text + "&key=3b8979c5c1714c929db3bf4eff3f8a62&units=I", true);
                }

                xhttp2.send();
            }

            document.getElementById("lookup").reset();

        }

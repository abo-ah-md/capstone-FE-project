/* fetching the datat from the API then using 
the coordnates from the preveous Geo api to 
fetch the weather data  sending it to server
 then fetching it from server and update the 
 page and showing the card */
const formHandler = async () => {
  // getting the User input
  const inputcity = document.getElementById("city").value;
  const fromDate = document.getElementById("arrival-date").value;
  const toDate = document.getElementById("leave-date").value;
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;

  //taking the dates
  try {
    let Geo = async (inputcity) => {
      try {
        const res = await fetch(
          `http://api.geonames.org/searchJSON?maxRows=10&operator=OR&q=${inputcity}&name=${inputcity}&username=aboahmd`,
          {
            method: "GET",
            credentials: "same-origin",
          }
        );

        let geodata = await res.json();

        await fetch("http://localhost:5000/savegeoData", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            langtitude: geodata.geonames[0].lng,
            latitude: geodata.geonames[0].lat,
            cityName: geodata.geonames[0].name,
            CuntryName: geodata.geonames[0].countryName,
            fromDate : fromDate,
            toDate : toDate,
            startTime : startTime,
            endTime : endTime
          }),
        });
        return await geodata;
      } catch (er) {
        console.log(er);
      }
    };

    let geodata = await Geo(inputcity);
    //getting the weather data using the coordinates from Geo API function

    let weather = async (langtitude, latitdude) => {
      try {
        let url = "http://api.weatherbit.io/v2.0/forecast/daily?";
        let key = "267f6d9c0f954735963a93de4b326522";

        const res = await fetch(
          `${url}lat=${latitdude}&lon=${langtitude}&key=${key}`,
          {
            method: "GET",
            credentials: "same-origin",
          }
        );
        const weatherData = await res.json();
        console.log(weatherData);
        let weatherDatabyday=[]
      weatherData.data.forEach(element => {
        //  console.log(element.data[0].weather.description);
           let data2 = {
            "description":element.weather.description,
            "datetime":element.datetime,
            "temp":element.temp,
          }
          weatherDatabyday.push(data2);
        });
        

        fetch("http://localhost:5000/saveweatherData", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weatherDatabyday,
          }),
        });

        return  weatherDatabyday;
      } catch (er) {
        console.log(er);
      }
    };

    let weatherData = await weather(
      geodata.geonames[0].lng,
      geodata.geonames[0].lat
    );

    //displaying the fetched data
    const update = async () => {
      try {
        const res = await fetch("http://localhost:5000/test", {
          method: "GET",
          credentials: "same-origin",
        });
        const getData = await res.json();
        console.log(getData);

        // document.getElementById("").innerText = ;
        let days = document.getElementsByClassName("output-card");
        for (let k = 0; k < days.length; k++) {
          let day = cards[k];
          day.querySelector(".day") = k; 
          let cards = document.getElementsByClassName("plan-card");
          for (let i = 0; i < cards.length; i++) {
            let card = cards[i][k];
            card.querySelector(".category") = getData[k][i].duration; 
            card.querySelector(".time") = getData[k][i].time; 
            card.querySelector(".destination-name") = getData[k][i].activity; 
          }
        }

      } catch (err) {
        console.log("error", err);
      }



    };

    await update();

    //showing the travel planning  card
  } catch (er) {
    console.log(er);
  }
};

//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////

export { formHandler };

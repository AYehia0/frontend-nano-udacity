/* Global Variables */
const zipCodeElement = document.getElementById("zip");
const userFeeling = document.getElementById("feelings");
const generateButton = document.getElementById("generate");
const date = document.getElementById("date");
const temperature = document.getElementById("temp");
const content = document.getElementById("content");

// The API keys, it should be hidden in the backend lol
const API_KEY = "&APPID=e23122c5062eb361eb2aa6ee3762e1db&units=imperial";

// the externel api url : openweathermap
const EXT_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

// the server side urls
const GET_URL = "http://localhost:8080/result";
const POST_URL = "http://localhost:8080/add";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// getting the data from the user
const getUserData = () => {
  // getting the zip code
  const zipCode = zipCodeElement.value;

  // getting the user response
  const userRes = userFeeling.value;

  return {
    zipCode,
    userRes,
  };
};

// calling the externel api for info
const getWeatherData = async (data) => {
  const zip = data.zipCode;
  //const userResponse = data.userResponse;

  // checking the zip code
  if (zip.length < 4) return;

  const res = await fetch(EXT_URL + zip + API_KEY);

  const resData = await res.json();

  return resData;
};

// getting saved data from the server
const getServerData = async () => {
  const res = await fetch(GET_URL);

  const data = await res.json();

  return data;
};

// saving data to the backend
const saveToServer = async (dataToSend) => {
  const res = await fetch(POST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });
};

// updating the html
generateButton.addEventListener("click", async () => {
  // getting the inputs
  const userInputs = getUserData();

  const zip = userInputs.zipCode;
  const feelings = userInputs.userRes;

  // checking the zip code
  if (zip <= 4) return;

  // checking if the zip code is already in the server side
  const backendData = await getServerData();
  const ind = searchZipCode(zip, backendData.data);

  // it exists
  if (ind != -1) {
    // return it
    const dataToDisplay = backendData.data[ind][zip];

    console.log(dataToDisplay);
    updateHTML(dataToDisplay);
  } else {
    const weather = await getWeatherData(userInputs);

    // checking if the zip code was vaild
    if (weather.cod == "404") {
      console.error("Invaild zip code : city not found !!!");
      alert("Invaild zip code : city not found !!!");
      return;
    }

    let weatherToSave = {};
    weather["userFeeling"] = feelings;

    console.error(weather);
    weatherToSave[zip] = weather;

    // save to the server
    await saveToServer(weatherToSave);
  }
});

// Helper functions

// return the index of the zip code
const searchZipCode = (zipCode, objToSearch) => {
  // for testing
  if (objToSearch.length == 0) return -1;

  const ind = objToSearch.findIndex((el) => Object.keys(el)[0] == zipCode);

  return ind;
};

// updating the content section with the data
const updateHTML = (data) => {
  date.innerHTML = data.dt;
  temperature.innerText = `Temprature : ${data.main.temp}`;
  content.innerText = `User Feelings : ${data.userFeeling}`;
};

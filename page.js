'use strict'

/* Run these right away */
let image_src = loadImageFromDB();
let originalName = getSadAnimalTabName(true);

/* Run these only after the DOM is loaded */
window.onload = function() {
  updateNameDate(true);
  const changeName = document.querySelector("#greeting");
  changeName.addEventListener("dblclick", function(e) {
    let boolResult = setSadAnimalTabName();
    updateNameDate(boolResult);
  });
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "flex";
};

/* Refreshes name and date on dblclick */
function updateNameDate(bool) {
  setGreeting(bool);
  setSadAnimalDateTime();
}

/* Sets the innerHTML of #timedate */
function setSadAnimalDateTime() {
  document.getElementById("timedate").innerHTML = formatAMPM();
}

/* Pulls a new image from API, calls setImage() on url */
async function loadImageFromDB() {
  const request = new XMLHttpRequest();
  let url = "";
  await request.open("GET", "https://sad-start-api.herokuapp.com/", true);
  request.onload = function() {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      url = data[0].img_url;
      setImage(url);
    } else {
      console.log("error");
      url =
        "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjpyY-Ct4TkAhVUMn0KHeweB_kQjRx6BAgBEAQ&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Ffalse-error-missing-absent-x-red-2061132%2F&psig=AOvVaw0MnZgbjb9tL1iaXqAikREB&ust=1565943156255387";
      setImage(url);
    }
  };
  request.send();
}

/* Sets the src attribute of the <img> */
function setImage(url) {
  let image = document.getElementById("sadAnimalImage");
  image.src = url;
}

/** Gets name from localStorage
 *
 * If no name inputed, prevents duplicate prompt window
 * once page loads.
 * @param inputReceived: represents whether this call was
 *        initiated after the prompt was dismissed or saved
 *        with an empty string.
 * @returns a string: either "no input" or the user's
 *        chosen name.
 */
function getSadAnimalTabName(inputReceived) {
 
  if (!localStorage.getItem("sadAnimalTabName")) {
    if (!inputReceived) {
      return "no input";
    }
    let newNameSaved = setSadAnimalTabName();
    if (!newNameSaved) {
      return "no input";
    }
  }
  return localStorage.getItem("sadAnimalTabName");
}

/**Prompts user, then attempts to save in localStorage
 *
 * @returns true if user input a string, false otherwise
 */
function setSadAnimalTabName() {
  let namePrompt = prompt("Enter your name for the Sad Animal New Tab: ", getSadAnimalTabName(true));
  if (namePrompt !== null && namePrompt.trim() !== "") {
    console.log("saved new name:", namePrompt);
    localStorage.setItem("sadAnimalTabName", namePrompt);
    return true;
  } else {
    return false;
  }
}

/* Changes HTML text to show greeting */
function setGreeting(inputReceived) {
  let name = getSadAnimalTabName(inputReceived);
  let greeting = document.getElementById("greeting");
  greeting.innerHTML = name !== "no input" ? `Hello, ${name}` : "Hello";
}

/** Formats the date and time
 * 
 * @returns a string representing the current date and time
 */
function formatAMPM() {
  var d = new Date(),
  minutes =
      d.getMinutes().toString().length == 1
        ? "0" + d.getMinutes()
        : d.getMinutes(),
    hours = d.getHours() % 12 || 12,
    ampm = d.getHours() >= 12 ? "pm" : "am",
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
  return (
    days[d.getDay()] +
    ", " +
    months[d.getMonth()] +
    " " +
    d.getDate() +
    ", " +
    d.getFullYear() +
    ", " +
    hours +
    ":" +
    minutes +
    ampm
  );
}

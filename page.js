"use strict";

/* Run these right away */
let image_src = loadImageFromDB();
onFirstLoad();

/* Run these only after the DOM is loaded */
window.onload = function() {
  updateNameDate();
  const changeName = document.querySelector("#greeting");
  changeName.addEventListener("dblclick", function(e) {
    setSadAnimalTabName();
    updateNameDate();
  });
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "flex";
};

/* Refreshes name and date on dblclick */
function updateNameDate() {
  setGreeting();
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
      url = "https://via.placeholder.com/750x650/FFFFFF?text=oops!";
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
 * @returns either an empty string or the user's chosen name.
 */
function getSadAnimalTabName() {
  let name = localStorage.getItem("sadAnimalTabName");
  return name || "";
}

/** Prompts user, then attempts to save in localStorage
 *
 * @returns true if user pressed OK, false on CANCEL
 */
function setSadAnimalTabName() {
  let namePrompt = prompt(
    "Enter your name for the Sad Animal New Tab: ",
    getSadAnimalTabName()
  );
  if (namePrompt === null) {
    return false;
  }
  console.log("saved new name:", namePrompt);
  localStorage.setItem("sadAnimalTabName", namePrompt);
  return true;
}

/* Changes HTML text to show greeting */
function setGreeting() {
  let name = getSadAnimalTabName();
  let greeting = document.getElementById("greeting");
  greeting.innerHTML = name !== "" ? `Hello, ${name}` : "Hello";
}

/* Checks if this is the first time the extension has been loaded */
function onFirstLoad() {
  let check = localStorage.getItem("sadAnimalsPreviouslyLoaded");
  if (check !== "1") {
    setSadAnimalTabName();
    localStorage.setItem("sadAnimalsPreviouslyLoaded", 1);
  }
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

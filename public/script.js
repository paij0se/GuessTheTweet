"use strict";
function sendAndReceive() {
  var tusername = document.getElementById("tusername").value;
  var tusername2 = document.getElementById("tusername2").value;
  var tusername3 = document.getElementById("tusername3").value;
  fetch(`/tweets?user=${tusername}&user2=${tusername2}&user3=${tusername3}`, {
    method: "GET",
  })
    .then(function (r) {
      return r.json();
    })
    .then((uwu) => {
      // Doesen't start with "RT"
      if (!uwu.tweet.text.startsWith("RT")) {
        document.getElementById("res").innerHTML += `<p>${uwu.tweet.text}</p>`;
      } else {
        document.getElementById(
          "res"
        ).innerHTML += `<p>${uwu.tweet.text} (Retweeted)</p>`;
      }
    });
}

"use strict";
function sendAndReceive() {
  var tusername = document.getElementById("tusername").value;
  var tusername2 = document.getElementById("tusername2").value;
  var tusername3 = document.getElementById("tusername3").value;
  fetch(`/tweets?user=${tusername}&user2=${tusername2}&user3=${tusername3}`, {
    method: "GET",
  })
    .then(function (r) {
      if (r.ok) {
        return r.json();
      } else {
        document.getElementById(
          "res"
        ).innerHTML += `<p>ratio, Too much requests</p>`;
      }
    })
    .then((uwu) => {
      // Doesen't start with "RT"
      try {
        if (!uwu.tweet.startsWith("RT")) {
          document.getElementById("res").innerHTML += `<p>${uwu.tweet}</p>
          <button type="button" class="btn btn-secondary btn-lg btn-block">${tusername}</button>
          <br>
          <button type="button" class="btn btn-secondary btn-lg btn-block">${tusername2}</button>
          <br>
          <button type="button" class="btn btn-secondary btn-lg btn-block">${tusername3}</button>

          `;
          console.log(`by: ${uwu.by}`);
        } else {
          document.getElementById(
            "res"
          ).innerHTML += `<p>${uwu.tweet} (Retweeted)</p>`;
        }
      } catch (error) {
        console.log("Error", error);
        document.getElementById("res").innerHTML += `<p>${uwu}</p>`;
      }
    });
}

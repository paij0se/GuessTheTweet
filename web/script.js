"use strict";

function sendAndReceive() {
  let tusername = document.getElementById("tusername").value;
  let tusername2 = document.getElementById("tusername2").value;
  let tusername3 = document.getElementById("tusername3").value;
  let tusername4 = document.getElementById("tusername4").value;
  fetch(
    `http://127.0.0.1:8080/tweets/?u=${tusername}&u2=${tusername2}&u3=${tusername3}&u4=${tusername4}`,
    {
      method: "GET",
    }
  )
    .then((r) => {
      return r.json();
    })
    .then((uwu) => {
      let tweet = uwu[0];
      try {
        let optionUserArray = [tusername, tusername2, tusername3, tusername4];
        const winner = uwu[1];
        let winningButton;
        const onClick = function () {
          winningButton = winner;
          if (winningButton == winner) {
            const buton = document.createElement("button");
            document.querySelector("body").appendChild(buton);
            buton.type = "button";
            buton.className = "btn btn-success btn-lg btn-block";
            buton.style = "border: 2px solid black; border-radius: 20px;";
            buton.innerText = winner;
          }
        };

        for (let i = 0; i < optionUserArray.length; ++i) {
          const buton = document.createElement("button");
          document.querySelector("body").appendChild(buton);
          buton.type = "button";
          buton.className = "btn btn-outline-dark btn-lg btn-block";
          buton.id = i;
          buton.style = "border: 2px solid black; border-radius: 20px;";
          buton.innerText = `@${optionUserArray[i]}`;
          buton.addEventListener("click", onClick);
        }
        // Display the tweet
        document.getElementById("res").innerHTML += `
          <h2>${tweet}</h2>`;
      } catch (error) {
        console.log("Error", error);
        document.getElementById("res").innerHTML += `<p>${uwu}</p>`;
      }
    });
}

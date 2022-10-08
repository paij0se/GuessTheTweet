"use strict";

function sendAndReceive() {
  let tusername = document.getElementById("tusername").value;
  let tusername2 = document.getElementById("tusername2").value;
  let tusername3 = document.getElementById("tusername3").value;
  let tusername4 = document.getElementById("tusername4").value;
  fetch(
    `/tweets?user=${tusername}&user2=${tusername2}&user3=${tusername3}&user4=${tusername4}`,
    {
      method: "GET",
    }
  )
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
      if (uwu.error == "Empty username") {
        document.getElementById("res").innerHTML += `<p>${uwu.error} </p>`;
      }
      try {
        let optionUserArray = [tusername, tusername2, tusername3, tusername4];
        /*
        for (let i = 0; i < optionUserArray.length; i++) {
          if (uwu.by == optionUserArray[i]) {
            console.log(`${uwu.by} - ${optionUserArray[i]}`);
          }
        }
        */

        const createWinner = function () {
          const winner = uwu.by;
          let winningButton;
          const onClick = function () {
            winningButton = winner;
            if (winningButton == winner) {
              // SOB :weary:
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
          /*
          document.getElementById(
            "winner"
          ).innerHTML += `<button type="button" class="btn btn-success btn-lg btn-block">${winner}</button>
              <br>`;
*/
          document.getElementById("res").innerHTML += `
          <p>${uwu.tweet}</p>`;
          /*
          <button type="button" class="btn btn-outline-dark btn-lg btn-block">${tusername}</button>
          <br>
          <button type="button" class="btn btn-outline-dark btn-lg btn-block">${tusername2}</button>
          <br>
          <button type="button" class="btn btn-outline-dark btn-lg btn-block">${tusername3}</button>
          <br>
          <button type="button" class="btn btn-outline-dark btn-lg btn-block">${tusername4}</button>
          `;
          */
        };

        createWinner();
      } catch (error) {
        console.log("Error", error);
        document.getElementById("res").innerHTML += `<p>${uwu}</p>`;
      }
    });
}

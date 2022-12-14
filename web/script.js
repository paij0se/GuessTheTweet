"use strict";
function sendAndReceive() {
  let tusername = document.getElementById("tusername").value;
  let tusername2 = document.getElementById("tusername2").value;
  let tusername3 = document.getElementById("tusername3").value;
  let tusername4 = document.getElementById("tusername4").value;
  if (
    tusername == "" ||
    tusername2 == "" ||
    tusername3 == "" ||
    tusername4 == ""
  ) {
    alert("Fill all the users!");
  } else {
    let optionUserArray = [tusername, tusername2, tusername3, tusername4];
    // Save the input to local storage
    for (let i = 0; i < optionUserArray.length; i++) {
      localStorage.setItem(`user${i}`, optionUserArray[i]);
    }
    fetch(
      `https://guessthetweet.herokuapp.com/tweets/?u=${tusername}&u2=${tusername2}&u3=${tusername3}&u4=${tusername4}`,
      {
        method: "GET",
      }
    )
      .then((r) => {
        return r.json();
      })
      .then((uwu) => {
        let tweet = uwu[0][0];
        let userWinnerPfp = uwu[0][2];
        try {
          const winner = uwu[0][1];
          let winningButton;
          const onClick = function () {
            winningButton = winner;
            if (winningButton == winner) {
              const buton = document.createElement("button");
              document.querySelector("body").appendChild(buton);
              buton.type = "button";
              buton.className = "btn btn-success btn-lg btn-block";
              buton.style =
                "border: 2px solid black; border-radius: 20px; margin: auto;";
              buton.innerText = winner;
              document.getElementById("usert").innerHTML = `@${uwu[0][1]}`;
              document.getElementById("pfpw").src = userWinnerPfp;
              document.getElementById("namet").innerHTML = uwu[0][3];
            }
          };
          for (let i = 0; i < optionUserArray.length; ++i) {
            const buton = document.createElement("button");
            document.querySelector("body").appendChild(buton);
            buton.type = "button";
            buton.className = "btn btn btn-secondary btn-lg btn-block";
            buton.id = i;
            buton.style = "border: 2px solid black; border-radius: 20px;";
            buton.innerText = `@${optionUserArray[i]}`;
            buton.addEventListener("click", onClick);
          }
          for (let i = 0; i < uwu[1].length; i++) {
            document.getElementById("pfp").innerHTML += `
            <img id="avatar" src="${uwu[1][i]}">
            `;
          }
          // Display the tweet
          document.getElementById("res").innerHTML += `
          <h2>${tweet}</h2>`;
        } catch (error) {
          document.getElementById("res").innerHTML += `<p>${tweet}</p>`;
        }
      });
  }
}

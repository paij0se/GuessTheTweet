"use strict";
try {
  document.getElementById("tusername").value = localStorage.getItem("user0");
  document.getElementById("tusername2").value = localStorage.getItem("user1");
  document.getElementById("tusername3").value = localStorage.getItem("user2");
  document.getElementById("tusername4").value = localStorage.getItem("user3");
} catch (error) {
  console.log("No Users in Local Storage");
}

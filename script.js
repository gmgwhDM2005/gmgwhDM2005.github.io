const search = document.getElementById("search");

search.addEventListener("keyup", function () {

const value = this.value.toLowerCase();

document.querySelectorAll(".post").forEach(post => {

const text = post.innerText.toLowerCase();

post.style.display = text.includes(value) ? "block" : "none";

});

});
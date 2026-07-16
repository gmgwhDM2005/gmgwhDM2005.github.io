const search = document.getElementById("search");

search.addEventListener("keyup", function () {

const value = this.value.toLowerCase();

document.querySelectorAll(".post").forEach(post => {

const text = post.innerText.toLowerCase();

post.style.display = text.includes(value) ? "block" : "none";

});

});


document.getElementById("navigbar").innerHTML = `
<header>

<div>
    <a href="https://gmgwhDM2005.github.io/" class="logo" style="text-decoration: none;">gmg's Transport Blogs</a>
</div>

<nav>

    <a href="https://gmgwhDM2005.github.io/">Home</a>
    <a href="https://gmgwhDM2005.github.io/blogs">Blogs</a>

</nav>

</header>
`

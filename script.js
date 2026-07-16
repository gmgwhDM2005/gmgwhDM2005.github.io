/*const search = document.getElementById("search");

search.addEventListener("keyup", function () {

const value = this.value.toLowerCase();

document.querySelectorAll(".post").forEach(post => {

const text = post.innerText.toLowerCase();

post.style.display = text.includes(value) ? "block" : "none";

});

});
*/

document.getElementById("navigbar").innerHTML = `
<header>

<div>
    <a href="https://gmgwhDM2005.github.io/" class="logo" style="">gmg's Transport Blogs</a>
</div>

<nav>

    <a href="https://gmgwhDM2005.github.io/">Home</a>
    <a href="https://gmgwhDM2005.github.io/blogs">Blogs</a>

</nav>

</header>
`

document.getElementById("footer").innerHTML = `
<footer>

<p>© 2026 gmgwhDM2005</p>

<p>
<a class="footerStyle" href="https://www.x.com/gmgwhDM2005">X</a> • <a class="footerStyle" href="https://www.flickr.com/gmgwhDM2005">Flickr</a>
</p>

</footer>
`
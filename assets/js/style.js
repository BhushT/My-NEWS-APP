const API_KEY = process.env.api_key;
// const API_KEY = "8e7b6cc93175422fa89cc62abfbf0902";
// const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

// Function to show the loader
function showLoader() {
    document.getElementById('loader');
}

// Function to hide the loader
function hideLoader() {
    document.getElementById('loader');
}

async function fetchNews(query) {
    try {
        showLoader(); // Show the loader before making the API call

        const res = await fetch(`/api?q=${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`Error fetching news: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        if (!data || !data.articles) {
            throw new Error("Invalid API response - missing 'articles' property.");
        }

        hideLoader(); // Hide the loader after the API call is completed

        bindData(data.articles);
    } catch (error) {
        hideLoader();
        console.error('Error fetching news:', error);
    }
}



function bindData(articles) {
    if (!articles || !Array.isArray(articles)) {
        console.error('Invalid articles data:', articles);
        return;
    }

    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}


function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}
let curSelectedNav;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}


document.addEventListener('DOMContentLoaded', function () {
    // Make sure the DOM is loaded before accessing elements
    const searchButton = document.getElementById('search-button');
    const searchText = document.getElementById('search-text');
    let curSelectedNav = null; // Assuming this is defined somewhere else in your code

    if (!searchButton || !searchText) {
        console.error("Error: Could not find searchButton or searchText element.");
        return;
    }

    searchButton.addEventListener('click', () => {
        // showLoader();
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        curSelectedNav?.classList.remove('active');
        curSelectedNav = null;
        // hideLoader();
    });
    
});

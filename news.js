const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 5566; // use environment port if provided

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = "b8eb6f4f4c8a46e8b2159c4c8b31a827";

// Home route
app.get("/", async (req, res) => {
    try {
        const result = await axios.get(`https://newsapi.org/v2/everything?q=everything&apiKey=${API_KEY}`);
        const response = result.data.articles;
        res.render("news.ejs", { response: response, message: null });
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.render("news.ejs", { response: [], message: "Failed to load news." });
    }
});

// Category route
app.get("/category", async (req, res) => {
    const category = req.query.category;
    try {
        const result = await axios.get(`https://newsapi.org/v2/everything?q=${category}&apiKey=${API_KEY}`);
        const response = result.data.articles;
        res.render("news.ejs", { response: response, message: null });
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.render("news.ejs", { response: [], message: "Failed to load category news." });
    }
});

// Search route
app.get("/search", async (req, res) => {
    const search_text = req.query.query;
    console.log("Search Text:", search_text);

    try {
        const result = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: search_text,
                language: 'en',
                sortBy: 'relevancy',
                apiKey: API_KEY
            }
        });

        const response = result.data.articles;
        if (response && response.length > 0) {
            res.render("news.ejs", { response: response, message: null });
        } else {
            res.render("news.ejs", { response: [], message: "No news available for the search query." });
        }
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.render("news.ejs", { response: [], message: "Error fetching news. Please try again later." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

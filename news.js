import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port=5566;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const API_KEY="b8eb6f4f4c8a46e8b2159c4c8b31a827";

app.get("/", async (req,res)=>{
    try{
        const result = await axios.get(`https://newsapi.org/v2/everything?q=everything&apiKey=${API_KEY}`);
        const response=result.data.articles;
        res.render("news.ejs", { response: response });
    }catch(error){
        console.log(error.response.data);
    }
});
app.get("/category", async (req,res)=>{
    const category = req.query.category;
    try{
        const result = await axios.get(`https://newsapi.org/v2/everything?q=${category}&apiKey=${API_KEY}`);
        const response=result.data.articles;
        res.render("news.ejs", { response: response });
    }catch(error){
        console.log(error.response.data);
    }
});
app.get("/search", async (req, res) => {
    const search_text = req.query.query;

    // Log the search text to verify it’s being received
    console.log("Search Text:", search_text);

    // If the search_text is empty, render with a "no news" message

    try {
        // Make a request to the API with the search text
        const result = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: search_text,
                language: 'en',
                sortBy: 'relevancy',
                apiKey: API_KEY
            }
        });

        const response = result.data.articles;
        // Render the response or show "no news" message if empty
        if (response && response.length > 0) {
            res.render("news.ejs", { response: response, message: null });
        } else {
            res.render("news.ejs", { response: [], message: "No news available for the search query." });
        }
    } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        res.render("news.ejs", { response: [], message: "Error fetching news. Please try again later." });
    }
});



app.listen(port,()=>{
    console.log(`Listen port on ${port}`);
});
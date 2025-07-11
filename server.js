const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "https://angelcube.dev"
}));

app.get('/books', (req, res) => {
    let url = "https://api.hardcover.app/v1/graphql";
    let options = {
        method: "post",
        headers: {
            "Authorization": "Bearer " + process.env.HARDCOVER_KEY
        },
        data: { 
            query: `
                list_books(
                    where: {
                        user_books: {
                            user_id: {_eq: 38349}, 
                            status_id: {_eq: 2}
                        }
                    }
                    distinct_on: book_id
                    limit: 5
                    offset: 0
                ) {
                    book {
                        title
                        contributions {
                            author {
                                name
                            }
                        }
                    }
                }`
        }
    }
    axios.get(url, options)
        .then(function (response) {
            res.status(200).send(response.data);
        })
        .catch(function (error) {
            res.status(500).send(error.response.status);
        });
})  

app.get('/music', (req, res) => {
    let url = "https://ws.audioscrobbler.com/2.0/";
    let options = {
        params: {
            method: "user.getrecenttracks",
            user: "angelcube__",
            limit: 5,
            api_key: process.env.LASTFM_KEY,
            format: "json"
        }
    }
    axios.get(url, options).then(function (response) {
        res.send(response.data);
    });
})

app.get('/mbid-lookup', (req, res) => {
    let url = "http://musicbrainz.org/ws/2/recording/";
    let options = {
        params: {
            query: "releases:" + req.query.release + " AND " + req.query.title + "",
            fmt: "json"
        }
    }
    axios.get(url, options).then(function (response) {
        res.send(response.data.recordings[0].releases[0].id);
    }).catch(function (error) {
        res.status(error.response.status).send(error.response.data);
    });
})

app.get('/coverart-lookup', (req, res) => {
    let url = "http://coverartarchive.org/release/" + req.query.mbid;
    let options = {
        params: {
        }
    }
    axios.get(url, options).then(function (response) {
        res.send(response.data);
    }).catch(function (error) {
        res.status(error.response.status).send(error.response.data);
    });
})

app.get('/games', (req, res) => {
    let url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/";
    let options = {
        params: {
            key: process.env.STEAM_KEY,
            steamid: "76561199245582776",
            format: "json"
        }
    }
    axios.get(url, options).then(function (response) {
        res.send(response.data);
    });
})  

app.get('/code', (req, res) => {
    let url = "https://hackatime.hackclub.com/api/v1/stats";
    let options = {
        headers: {
            "Authorization": "Bearer " + process.env.HACKATIME_KEY
        }
    }
    axios.get(url, options).then(function (response) {
        res.send(response.data);
    });

    // this is so ass
})  


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
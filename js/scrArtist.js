//Saves artist name from the url
const params = new URLSearchParams(location.search);
const artName = params.get("name") || "";

document.getElementById("artistName").textContent = artName || "Artist";

async function fetchArtist() {
    //No artist name - Error
    if (!artName) {
        document.getElementById("artistData").textContent = "No artist name provided.";
        return;
    }

    //Fetching URL with all needed information
    const url = `https://api.artic.edu/api/v1/agents/search?` + `q=${encodeURIComponent(artName)}&limit=1&fields=` +
                ["id","title","display_name","description","birth_date","death_date","nationality"].join(",");

    try {
        //Extracting the data
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        const a = json.data?.[0];
        const box = document.getElementById("artistData");

        //Error if artist record not found
        if (!a) { 
            box.textContent = "No artist record found."; 
            return; 
        }

        //Displays all information
        box.innerHTML = `
            <div>${a.nationality || ""}</div>
            <div>${a.birth_date || ""}${a.death_date ? " - " + a.death_date : ""}</div>
            <p>${a.description || "No additional information avaliable"}</p>`;

        //Link to the search tab
        const back = document.getElementById("seeArtworks");
        back.href = `search.html?q=${encodeURIComponent(artName)}&limit=10`;
    } catch (err) {
        document.getElementById("artistData").textContent = "Error: " + err.message;
        console.error(err);
    }
}

fetchArtist();
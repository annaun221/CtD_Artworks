//Setting a general API adress for different artworks
const BASE = "https://api.artic.edu/api/v1/artworks/search";

//Actual image url
function iiif(image_id, w = 400) {
    return `https://www.artic.edu/iiif/2/${image_id}/full/${w},/0/default.jpg`;
}

//Search function
async function runSearch() {
    //User input
    const q = document.getElementById("q").value.trim();
    const limit = Math.max(1, Math.min(100, Number(document.getElementById("limit").value) || 10));
    const status = document.getElementById("status");
    const results = document.getElementById("results");
    results.innerHTML = "";

    //No Input
    if (!q) {
        status.textContent = "Please enter a search term.";
        return;
    }
    status.textContent = "Searching…";

    //Full API URL based on the user input
    const params = new URLSearchParams({
        q,
        limit: String(limit),
        fields: ["id","title","artist_title","date_display","image_id"].join(",")
    });

    try {
        //Fetches array of artworks
        const res = await fetch(`${BASE}?${params.toString()}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const items = (data.data || []);
        
        //error message if there's no artworks found
        if (items.length === 0) {
            status.textContent = "No matches.";
            return;
        }

        //Combining information for each artwork
        items.forEach(item => {
            const wrap = document.createElement("div");
            
            //Image
            if (item.image_id) {
                const img = document.createElement("img");
                img.src = iiif(item.image_id, 400);
                img.alt = "No Image Avaliable";
                wrap.appendChild(img);
            }

            //Title
            const title = document.createElement("div");
            title.className = "artTitle";
            title.innerHTML = `<strong>${item.title || "(Untitled)"}</strong>`;
            wrap.appendChild(title);

            //Name and date
            const meta = document.createElement("div");
            meta.className = "artMeta";
            const artist = item.artist_title || "Unknown artist";
            const date = item.date_display ? ` - ${item.date_display}` : "";
            meta.textContent = artist + date;
            wrap.appendChild(meta);

            //Link to learn more
            const link = document.createElement("a");
            link.className = "artLink";
            link.href = `https://www.artic.edu/artworks/${item.id}`;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = "Learn More About the Artwork";
            wrap.appendChild(link);

            results.appendChild(wrap);
        });

        //Info about the search
        status.textContent = `Showing ${items.length} results for “${q}”.`;
    } catch (err) {
        status.textContent = `Error: ${err.message}`;
        console.error(err);
    }
}

//Immediately shows artworks from the artist page
const p = new URLSearchParams(location.search);
const preQ = p.get("q");
const preLim = p.get("limit");
if (preQ) document.getElementById("q").value = preQ;
if (preLim) document.getElementById("limit").value = preLim;

//Loads with a link, by enter and search button  
if (preQ) runSearch();
document.getElementById("searchBtn").addEventListener("click", runSearch);
document.getElementById("q").addEventListener("keydown", (e) => {if (e.key === "Enter") runSearch();});
  
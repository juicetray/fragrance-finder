document.addEventListener("DOMContentLoaded", async () => {
  console.log("perfume.js is connected!");

  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");
  const name = params.get("name");
  const image = params.get("img");
  const description = params.get("desc");

  const nameEl = document.getElementById("perfumeName");
  const imgEl = document.getElementById("perfumeImage");
  const descEl = document.getElementById("perfumeDetails");
  const dupeList = document.getElementById("dupeResults");

  if (!id) {
    nameEl.textContent = "No perfume ID found in the URL.";
    return;
  }

  // Render selected perfume info
  nameEl.textContent = name || "Unnamed Perfume";
  imgEl.src = image && image.trim() !== ""
    ? image
    : "https://shoperfumes.ca/wp-content/uploads/2022/07/coming-soon-picture.jpg";
  imgEl.alt = name || "Perfume";
  imgEl.style.display = "block";
  imgEl.style.margin = "1rem auto";
  imgEl.style.maxWidth = "200px";
  imgEl.style.borderRadius = "var(--pico-border-radius)";
  descEl.textContent = description || "No description provided.";

  // Function to fetch dupes
  const url = `https://fragrancefinder-api.p.rapidapi.com/dupes/${id}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b9d9fa1b41msh1830115e5b81cf6p170c07jsnba165b6b0be1",
      "x-rapidapi-host": "fragrancefinder-api.p.rapidapi.com"
    }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const dupes = data.recommendations;

    dupeList.innerHTML = "";

    if (!dupes || !dupes.length) {
      dupeList.innerHTML = "<li>No similar perfumes found.</li>";
      return;
    }

    dupes.forEach(dupe => {
      const li = document.createElement("li");

      const article = document.createElement("article");
      article.style.display = "flex";
      article.style.flexDirection = "column";
      article.style.alignItems = "center";
      article.style.padding = "1rem";
      article.style.border = "1px solid var(--pico-muted-border-color)";
      article.style.borderRadius = "var(--pico-border-radius)";
      article.style.backgroundColor = "var(--pico-background-color)";
      article.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
      article.style.textAlign = "center";

      const img = document.createElement("img");
      img.src = dupe.image && dupe.image.trim() !== ""
        ? dupe.image
        : "https://shoperfumes.ca/wp-content/uploads/2022/07/coming-soon-picture.jpg";
      img.alt = dupe.perfume;
      img.style.width = "100%";
      img.style.maxWidth = "150px";
      img.style.borderRadius = "var(--pico-border-radius)";
      img.style.objectFit = "cover";

      const title = document.createElement("h3");
      title.textContent = dupe.perfume;

      const similarity = document.createElement("p");
      similarity.textContent = `Similarity: ${Math.round(dupe.combinedSimilarity)}%`;

      const link = document.createElement("a");
      link.href = `/perfume.html?id=${dupe._id}&name=${encodeURIComponent(dupe.perfume)}&img=${encodeURIComponent(dupe.image)}&desc=${encodeURIComponent(dupe.description)}`;
      link.textContent = "View Details";
      link.style.marginTop = "0.5rem";

      article.appendChild(img);
      article.appendChild(title);
      article.appendChild(similarity);
      article.appendChild(link);

      li.appendChild(article);
      dupeList.appendChild(li);
    });

  } catch (err) {
    console.error("Error fetching recommendations:", err);
    dupeList.innerHTML = "<li>Failed to load similar perfumes.</li>";
  }
});

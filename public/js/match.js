document.getElementById("matchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const selectedNotes = [...document.querySelectorAll('input[name="notes"]:checked')]
      .map(input => input.value);
  
    if (!selectedNotes.length) return;
  
    const query = selectedNotes.join(',');
  
    try {
      const res = await fetch(`/api/match?notes=${encodeURIComponent(query)}`);
      const data = await res.json();
  
      const matchResults = document.getElementById("matchResults");
      matchResults.innerHTML = "";
  
      if (!data.length) {
        matchResults.innerHTML = "<li>No matches found.</li>";
        return;
      }
  
      data.forEach(perfume => {
        const li = document.createElement("li");
        const article = document.createElement("article");
  
        const img = document.createElement("img");
        img.src = perfume.image && perfume.image.trim() !== ''
          ? perfume.image
          : "https://shoperfumes.ca/wp-content/uploads/2022/07/coming-soon-picture.jpg";
        img.alt = perfume.perfume;
        img.style.width = "100%";
        img.style.maxWidth = "150px";
        img.style.borderRadius = "var(--pico-border-radius)";
        img.style.objectFit = "cover";
  
        const title = document.createElement("h3");
        title.textContent = perfume.perfume;
  
        const link = document.createElement("a");
        link.href = `/perfume.html?id=${perfume._id}&name=${encodeURIComponent(perfume.perfume)}&img=${encodeURIComponent(perfume.image)}&desc=${encodeURIComponent(perfume.description)}`;
        link.textContent = "View Details";
        link.style.marginTop = "0.5rem";
  
        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(link);
  
        li.appendChild(article);
        matchResults.appendChild(li);
      });
  
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    }
  });
  
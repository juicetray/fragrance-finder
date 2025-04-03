const brands = [
    "Lattafa Perfumes", "Dior", "Tom Ford", "Yves Saint Laurent", "Guerlain",
    "Giorgio Armani", "Jean Paul Gaultier", "Xerjoff", "Chanel", "Parfums de Marly",
    "Zara", "Versace", "Mancera", "By Kilian", "Dolce&Gabbana", "Amouage", "Rabanne",
    "Maison Martin Margiela", "Givenchy", "Carolina Herrera", "Armaf", "Maison Francis Kurkdjian",
    "Montale", "Valentino", "Hermès", "Maison Alhambra", "Prada", "Mugler", "Creed",
    "Lancôme", "Byredo", "Diptyque", "Bath & Body Works", "Burberry", "Jo Malone London",
    "Gucci", "O Boticário", "Natura", "Louis Vuitton", "Kayali Fragrances", "Nishane",
    "Hugo Boss", "Serge Lutens", "Afnan", "Victoria's Secret", "Penhaligon's", "Calvin Klein",
    "Etat Libre d'Orange", "Initio Parfums Prives", "Bvlgari", "Azzaro", "Viktor&Rolf",
    "Frederic Malle", "Zoologist Perfumes", "Narciso Rodriguez", "Avon", "Le Labo",
    "Montblanc", "Juliette Has A Gun", "Roja Dove"
  ];
  
  const brandList = document.getElementById('brandList');
  const searchInput = document.getElementById('search');
  const resultList = document.getElementById('perfumeResults');
  
  function displayBrands(filter = "") {
    brandList.innerHTML = "";
  
    const filtered = brands.filter(brand =>
      brand.toLowerCase().startsWith(filter.toLowerCase())
    );
  
    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.textContent = "No matching brands found.";
      brandList.appendChild(li);
      return;
    }
  
    filtered.forEach(brand => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = "#";
      link.textContent = brand;
  
      link.addEventListener('click', (e) => {
        e.preventDefault();
        fetchPerfumesForBrand(brand);
      });
  
      li.appendChild(link);
      brandList.appendChild(li);
    });
  }
  
  async function fetchPerfumesForBrand(brand) {
    resultList.innerHTML = '';
  
    const loadingItem = document.createElement('li');
    loadingItem.textContent = `Loading perfumes for "${brand}"...`;
    resultList.appendChild(loadingItem);
  
    const url = `https://fragrancefinder-api.p.rapidapi.com/perfumes/search?q=${encodeURIComponent(brand)}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'b9d9fa1b41msh1830115e5b81cf6p170c07jsnba165b6b0be1',
        'x-rapidapi-host': 'fragrancefinder-api.p.rapidapi.com'
      }
    };
  
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(data);
  
      resultList.innerHTML = '';
  
      if (!data.length) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = `No perfumes found for "${brand}".`;
        resultList.appendChild(emptyItem);
        return;
      }
  
      data.forEach(perfume => {
        const li = document.createElement('li');
        const article = document.createElement('article');
      
        const img = document.createElement('img');
        img.src = perfume.image && perfume.image.trim() !== ''
          ? perfume.image
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfJVsVkp4XqVcc2vu97zkm4ipaxMHgYRjNEQ&s';
        img.alt = perfume.perfume;
        img.style.width = '100%';
        img.style.maxWidth = '150px';
        img.style.borderRadius = 'var(--pico-border-radius)';
        img.style.objectFit = 'cover';
      
        const title = document.createElement('h3');
        title.textContent = perfume.perfume;
      
        article.appendChild(img);
        article.appendChild(title);
        li.appendChild(article);
        resultList.appendChild(li);
      });
      
  
    } catch (error) {
      console.error('Error fetching perfumes:', error);
      resultList.innerHTML = '';
      const errorItem = document.createElement('li');
      errorItem.textContent = 'Error fetching perfumes. Check the console.';
      resultList.appendChild(errorItem);
    }
  }
  
  searchInput.addEventListener('input', () => {
    displayBrands(searchInput.value);
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    displayBrands();
  });
  
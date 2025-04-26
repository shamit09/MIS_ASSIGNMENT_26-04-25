
function start() {
    var searchTerm = document.getElementById("searchInput").value.trim();

    if (searchTerm === "") {
        alert("Please enter a country name!");
        return;
    }

    var url = `https://restcountries.com/v3.1/name/${searchTerm}`;

    fetch(url)
        .then(res => res.json())
        .then(data => process(data))
        .catch(err => console.error("Error fetching country data:", err));
}

function process(data) {
    var oldContent = document.getElementById("results");
    oldContent.textContent = "";

    if (!data || data.status === 404) {
        oldContent.innerHTML = "<p>No countries found! Try another search.</p>";
        return;
    }

    for (var a = 0; a < data.length; a++) {
        var country = data[a];

        var newDiv = document.createElement("div");
        newDiv.classList.add("card");

        newDiv.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Region:</strong> ${country.region}</p>
            <button onclick="showMoreDetails('${country.name.common}')">More Details</button>
            <button onclick="getWeather('${country.capital ? country.capital[0] : ''}')">Weather Updates</button>
        `;

        oldContent.appendChild(newDiv);
    }
}

function showMoreDetails(countryName) {
    var url = `https://restcountries.com/v3.1/name/${countryName}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const country = data[0];

            // Prepare modal content
            var modalBody = document.getElementById("modalBody");
            modalBody.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${country.flags.png}" alt="Flag" width="150"><br><br>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
            `;

            openModal();
        })
        .catch(err => console.error("Error fetching country details:", err));
}

function getWeather(capitalCity) {
    if (!capitalCity) {
        alert("No capital city available for weather data.");
        return;
    }

    const apiKey = "734c5998e6bed94acb326e5c317cd66b"; // YOUR REAL API KEY
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("Weather data not found for this city.");
                return;
            }

            // Prepare modal content
            var modalBody = document.getElementById("modalBody");
            modalBody.innerHTML = `
                <h2>Weather in ${data.name}</h2>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Weather:</strong> ${data.weather[0].main}</p>
                <p><strong>Description:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
            `;

            openModal();
        })
        .catch(err => console.error("Error fetching weather data:", err));
}

function openModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Optional: Close modal if clicked outside
window.onclick = function(event) {
    var modal = document.getElementById("modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


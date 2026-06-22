export async function getWeather(city) {

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const url =
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    console.log("URL:", url);

    const response = await fetch(url);

    console.log("Status:", response.status);

    const data = await response.json();

    console.log("Data:", JSON.stringify(data, null, 2));

    return data;
}
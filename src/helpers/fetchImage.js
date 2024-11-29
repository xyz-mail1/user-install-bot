const fetch = require("node-fetch");

async function fetchGif(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.link;
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    throw error;
  }
}

module.exports = fetchGif;

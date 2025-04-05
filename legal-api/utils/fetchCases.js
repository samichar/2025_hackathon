import fetch from "node-fetch";

const fetchCases = async (search) => {
  const apiUrl = `https://www.courtlistener.com/api/rest/v4/search/?search=${encodeURIComponent(search)}&ordering=-date_filed&page_size=5`;

  console.log(`Constructed API URL: ${apiUrl}`); // Log the full API URL

  try {
    const response = await fetch(apiUrl);

    // Log the response status and data for debugging
    console.log(`Response Status: ${response.status}`);
    const data = await response.json();
    console.log("Raw API Response Data:", JSON.stringify(data, null, 2)); // Log the full response

    // Check if results exist before mapping
    if (!data.results || data.results.length === 0) {
      throw new Error("API response does not contain valid 'results'");
    }

    return data.results.map((item, index) => {
      // Debug log for each item in the results
      console.log(`\n[DEBUG] Result ${index + 1}:`);
      console.log(`caseName: "${item.caseName}"`);
      console.log(`snippet: "${item.opinions?.[0]?.snippet}"`);
      console.log(`dateFiled: "${item.dateFiled}"`);
      console.log(`absolute_url: "${item.absolute_url}"`);

      // Use the caseName field for the title, fallback to "No title available"
      const title = item.caseName?.trim() || "No title available";

      // Use the snippet for the summary, fallback to "No summary available"
      const summary = item.opinions?.[0]?.snippet 
        ? item.opinions[0].snippet.replace(/\s+/g, " ").slice(0, 300).trim() + "..." 
        : "No summary available.";

      // Use dateFiled if available, otherwise fallback to meta.date_created
      const date = item.dateFiled || item.meta?.date_created || "No date available";

      // Construct the link to the case
      const link = item.absolute_url 
        ? `https://www.courtlistener.com${item.absolute_url}` 
        : "No link available";

      return { title, summary, date, link };
    });
  } catch (err) {
    console.error("Error fetching cases from CourtListener:", err.message);
    throw new Error("Failed to fetch case data");
  }
};

export default fetchCases;
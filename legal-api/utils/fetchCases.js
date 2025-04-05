import fetch from "node-fetch";

const fetchCases = async (search) => {
  const apiUrl = `https://www.courtlistener.com/api/rest/v4/opinions/?search=${encodeURIComponent(search)}&ordering=-date_filed&page_size=5`;

  try {
    const response = await fetch(apiUrl);

    // Log the response status and data for debugging
    console.log(`Response Status: ${response.status}`);
    const data = await response.json();
    console.log("API Response Data:", data);

    // Check if results exist before mapping
    if (!data.results) {
      throw new Error("API response does not contain 'results'");
    }

    return data.results.map(item => ({
      title: item.case_name,
      summary: item.plain_text ? item.plain_text.slice(0, 300) + "..." : "No summary available.",
      date: item.date_filed,
      link: `https://www.courtlistener.com${item.absolute_url}`,
    }));
  } catch (err) {
    console.error("Error fetching cases from CourtListener:", err.message);
    throw new Error("Failed to fetch case data");
  }
};

export default fetchCases;
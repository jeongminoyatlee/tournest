import axios from 'axios';

export default async function handler(req, res) {
  const { city } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions+in+${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      photo: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}` : null,
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Google Places data:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}

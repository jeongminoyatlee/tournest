// pages/api/coordinates.js
export default async function handler(req, res) {
    const { city } = req.query;
  
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      res.status(500).json({ error: 'Failed to fetch coordinates' });
    }
  }
  
const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('public/bangladesh.geojson', 'utf8'));

  data.features.forEach(feature => {
    if (feature.geometry && feature.geometry.type === 'Polygon') {
      if (feature.geometry.coordinates.length > 1) {
        // Find the ring with the most coordinates (the real shape, not a 5-point bounding box)
        let bestRing = feature.geometry.coordinates[0];
        for (let ring of feature.geometry.coordinates) {
          if (ring.length > bestRing.length) {
            bestRing = ring;
          }
        }
        feature.geometry.coordinates = [bestRing];
      }
    } else if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach((polygon, i) => {
        if (polygon.length > 1) {
          let bestRing = polygon[0];
          for (let ring of polygon) {
            if (ring.length > bestRing.length) {
              bestRing = ring;
            }
          }
          feature.geometry.coordinates[i] = [bestRing];
        }
      });
    }
  });

  fs.writeFileSync('public/bangladesh.geojson', JSON.stringify(data));
  console.log('Fixed GeoJSON geometry! Removed global bounding boxes from polygons.');
} catch (e) {
  console.error(e);
}

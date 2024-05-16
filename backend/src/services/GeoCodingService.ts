export class GeoCodingService {
	static async getCoordinates(
		address: string
	): Promise<{ latitude: number; longitude: number } | null> {
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
					address
				)}&key=AIzaSyBfE8LqtzkYYKEbWGQQrGdHalnXsp9qz_8`
			);
			const data = await response.json();

			if (data.results && data.results.length > 0) {
				const { lat, lng } = data.results[0].geometry.location;
				return { latitude: lat, longitude: lng };
			}
		} catch (error) {
			console.error("Error geocoding address:", error);
		}
		return null;
	}
}

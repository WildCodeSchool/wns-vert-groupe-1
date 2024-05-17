export class GeoCodingCityService {
	static async getCoordinates(
		city: string
	): Promise<{ latitude: number; longitude: number } | null> {
		try {
			const response = await fetch(
				`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA`
			);
			if (response.ok) {
				const data = await response.json();
				console.log("data", data);

				if (data.features && data.features.length > 0) {
					const firstResult = data.features[0];
					const latitude = firstResult.center[1];
					const longitude = firstResult.center[0];
					console.log("latitude", latitude);
					console.log("longitude", longitude);
					return { latitude, longitude };
				} else {
					console.log("Aucune caractéristique trouvée pour la ville:", city);
				}
			}
		} catch (error) {
			console.error("Error get latitude and longitude from city:", error);
		}
		return null;
	}
}

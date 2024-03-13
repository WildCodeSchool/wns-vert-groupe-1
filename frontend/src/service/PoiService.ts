import { Poi } from '../../../backend/src/entities/poi';
import { GeoCodingService } from './GeoCodingService';

export class PoiService {
  static async createOrUpdatePoi(poiData: Partial<Poi>): Promise<Poi | null> {
    // Create or update your POI entity
    const poi = new Poi();
    
    // Assign address only if it's not undefined
    if (poiData.address !== undefined) {
      poi.address = poiData.address;
    }
    
    // Fetch coordinates from the address if address is not undefined
    if (poi.address !== undefined) {
      const coordinates = await GeoCodingService.getCoordinates(poi.address);
      if (coordinates) {
        poi.latitude = coordinates.latitude;
        poi.longitude = coordinates.longitude;
      }
    }
    
    // Save the POI entity
    await poi.save();
    
    return poi;
  }
}

import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
  mutation CreateNewPoi($poiData: PoiInput!) {
    CreateNewPoi(poiData: $poiData) {
      id
    }
  }
`;
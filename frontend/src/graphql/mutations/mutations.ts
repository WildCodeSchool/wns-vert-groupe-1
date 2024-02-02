import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
  mutation createNewPoi($poiData: PoiInput!) {
    createNewPoi(poiData: $poiData) {
      id
    }
  }
`;
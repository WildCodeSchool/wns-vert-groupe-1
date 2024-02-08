import { useRouter } from "next/router"
import { useQuery } from "@apollo/client";

import { useEffect, useState } from "react";
import { GET_POI_BY_ID } from "@queries";
import { POIInput } from "@types";

const POIDetails = () => {
    const router = useRouter();
    const [POIDetails, setPOIDetails] = useState<POIInput>({
        name: "",
        address: "",
        description: "",
        images: [],
        city: "",
        category: "",
    });

    const { loading, error, data } = useQuery(GET_POI_BY_ID, {
        variables: { id: parseInt(router.query.id as string) },
});
console.log(data) 
   useEffect(() => {
        if (!loading && data && data.getPoiById) {
            setPOIDetails({
                name: data.getPoiById.name,
                address: data.getPoiById.address,
                description: data.getPoiById.description,
                images: data.getPoiById.images,
                city: data.getPoiById.city,
                category: data.getPoiById.category,
            });
        }
    }, [data, error, router.query.id]);
    console.log(POIDetails)
}

export default POIDetails;

import { useRouter } from "next/router"
import { useQuery } from "@apollo/client";

import { useEffect, useState } from "react";
import { GET_POI_BY_ID } from "@queries";
import { POIType } from "@types";

const POIDetails = () => {
    const router = useRouter();
    const [POIDetails, setPOIDetails] = useState<POIType>({
        name: "",
        address: "",
        description: "",
        images: [],
        city: "",
        category: "",
    });

    const { loading, error, data } = useQuery(GET_POI_BY_ID, {
        variables: { id: router.query.id },
    });

    useEffect(() => {
        if (!loading && data && data.getPoiById) {
            setPOIDetails({
                id: data.getPoiById.id,
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

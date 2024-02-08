import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import axios from "axios";


const POIDetails = () => {
    const router = useRouter();
    const [POIDetails, setPOIDetails] = useState();
    console.log(router.query.id)
    useEffect(() => {
        const fetchAdData = async () => {
            if (router.query.id){
                 const result = await axios.get(
                `http://localhost:4000/poi/${router.query.id}`
            ); 
             console.log(result);
            setPOIDetails(result.data);
            }
           
        };
        fetchAdData();
    }, [router.query.id]);
}

export default POIDetails;

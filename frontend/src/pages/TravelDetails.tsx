import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTravelById } from "../services/travelService";
import type { TravelResponse } from "../types/travel";

import Loader from "../components/Loader";
import CardDetails from "../components/card/CardDetails";

export default function TravelDetails() {
    const { id } = useParams();

    const [travel, setTravel] = useState<TravelResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        getTravelById(id)
            .then(setTravel)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;
    if (!travel) return <p>Viagem não encontrada</p>

    return (
        <div>
            <CardDetails travel={travel} />
        </div>
    );
}

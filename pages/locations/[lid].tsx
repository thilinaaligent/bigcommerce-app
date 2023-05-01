import { useRouter } from "next/router";
import ErrorMessage from "../../components/error";
import Loading from "../../components/loading";
import LocationForm from "../../components/LocationForm";
import { useSession } from "../../context/session";
import { useLocationInfo, useProductList } from "../../lib/hooks";
import { LocationItemFormData } from "../../types";

const LocationInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const lid = Number(router.query?.lid);
    const { error, isLoading, list = [], mutateList } = useProductList();
    const { isLoading: isInfoLoading, location } = useLocationInfo(lid, list);
    const { label, description, enabled } = location ?? {};
    const formData = { label, description, enabled };

    const handleCancel = () => router.push("/");

    const handleSubmit = async (data: LocationItemFormData) => {
        try {
            const filteredList = list.filter((item) => item.id !== lid);
            const { label, description, enabled } = data;
            const apiFormattedData = {
                label,
                description,
                enabled,
            };

            // Update local data immediately (reduce latency to user)
            mutateList([...filteredList, { ...location, ...data }], false);

            // Update location details
            await fetch(`/api/locations/${lid}?context=${encodedContext}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiFormattedData),
            });

            // Refetch to validate local data
            mutateList();

            router.push("/");
        } catch (error) {
            console.error("Error updating the location: ", error);
        }
    };

    if (isLoading || isInfoLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <LocationForm
            formData={formData}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
        />
    );
};

export default LocationInfo;

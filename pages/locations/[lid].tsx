import { Flex, H2, HR } from "@bigcommerce/big-design";
import { ArrowBackIcon } from "@bigcommerce/big-design-icons";
import Link from "next/link";
import { useRouter } from "next/router";
// import ErrorMessage from "@components/error";
import Loading from "@components/loading";
import LocationForm from "@components/LocationForm";
// import { useLocationsList } from "@components/LocationsList/hooks/useLocationsList";
import { useSession } from "@context/session";
import { useLocationInfo } from "@lib/hooks";
import { LocationItemFormData } from "@types";

const LocationInfo = () => {
    const router = useRouter();
    const encodedContext = useSession()?.context;
    const lid = Number(router.query?.lid);

    // const { error, mutateList } = useLocationsList();

    const { isLoading: isInfoLoading, location } = useLocationInfo(lid);
    const {
        description,
        enabled = true,
        label,
        code,
        managed_by_external_source = false,
        type_id = "PHYSICAL",
        storefront_visibility = true,
        address: {
            address1 = "",
            address2 = "",
            city = "",
            country_code = "",
            geo_coordinates: { latitude = 0, longitude = 0 } = {},
            email = "",
            phone = "",
            state = "",
            zip = "",
        } = {},
    } = location ?? {
        address: {
            geo_coordinates: {},
        },
    };
    const formData = {
        code,
        description,
        enabled,
        label,
        managed_by_external_source,
        type_id,
        storefront_visibility,
        address: {
            address1,
            address2,
            city,
            country_code,
            geo_coordinates: {
                latitude,
                longitude,
            },
            email,
            phone,
            state,
            zip,
        },
    };

    const handleCancel = () => router.push("/");

    const handleSubmit = async (data: LocationItemFormData) => {
        try {
            // const filteredList = list.filter((item) => item.id !== lid);
            // const { label, description, enabled } = data;
            // const apiFormattedData = {
            //     label,
            //     description,
            //     enabled,
            // };

            // Update local data immediately (reduce latency to user)
            // mutateList([...filteredList, { ...location, ...data }], false);

            // Update location details
            await fetch(`/api/locations/${lid}?context=${encodedContext}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            // Refetch to validate local data
            // mutateList();

            router.push("/");
        } catch (error) {
            console.error("Error updating the location: ", error);
        }
    };

    if (isInfoLoading) return <Loading />;
    // if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <Flex
                alignContent="stretch"
                alignItems="center"
                flexDirection="row"
                flexWrap="nowrap"
                justifyContent="flex-start"
                flexColumnGap="10px"
            >
                <Link href="/">
                    <ArrowBackIcon />
                </Link>
                <H2 margin="none">Edit Location</H2>
            </Flex>
            <HR marginVertical="large" />
            <LocationForm
                formData={formData}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
            />
        </>
    );
};

export default LocationInfo;

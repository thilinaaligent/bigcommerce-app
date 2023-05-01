import useSWR from "swr";
import { useSession } from "@context/session";
import { fetcher } from "@lib/hooks";
import { QueryParams } from "@types";

export function useLocationsList(query?: QueryParams) {
    const { context } = useSession();
    const params = new URLSearchParams({ ...query, context }).toString();

    const {
        data,
        error,
        mutate: mutateList,
    } = useSWR(context ? ["/api/locations/list", params] : null, fetcher);

    return {
        list: data?.data,
        meta: data?.meta,
        isLoading: !data && !error,
        error,
        mutateList,
    };
}

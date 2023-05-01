import {
    Badge,
    Button,
    Dropdown,
    Flex,
    H0,
    Panel,
    Small,
    Link as StyledLink,
    Table,
    TableSortDirection,
} from "@bigcommerce/big-design";
import { MoreHorizIcon, AddIcon } from "@bigcommerce/big-design-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import ErrorMessage from "../components/error";
import Loading from "../components/loading";
import { useLocationsList } from "../lib/hooks";
import { LocationItem } from "../types";

const Index = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnHash, setColumnHash] = useState("");
    const [direction, setDirection] = useState<TableSortDirection>("ASC");
    const router = useRouter();
    const {
        error,
        isLoading,
        list = [],
        meta = {},
    } = useLocationsList({
        page: String(currentPage),
        limit: String(itemsPerPage),
        ...(columnHash && { sort: columnHash }),
        ...(columnHash && { direction: direction.toLowerCase() }),
    });
    const itemsPerPageOptions = [10, 20, 50, 100];
    const tableItems: LocationItem[] = list.map(
        ({ id, label, description, enabled }) => ({
            id,
            label,
            description,
            enabled,
        })
    );

    const onItemsPerPageChange = (newRange) => {
        setCurrentPage(1);
        setItemsPerPage(newRange);
    };

    const onSort = (
        newColumnHash: string,
        newDirection: TableSortDirection
    ) => {
        setColumnHash(
            newColumnHash === "stock" ? "inventory_level" : newColumnHash
        );
        setDirection(newDirection);
    };

    const renderLabel = (
        id: number,
        label: string,
        description: string
    ): ReactElement => (
        <Link href={`/locations/${id}`}>
            <StyledLink>{label}</StyledLink>
            <Small>{description}</Small>
        </Link>
    );

    const renderEnabled = (enabled: boolean): ReactElement =>
        enabled ? (
            <Badge label="active" variant="success" />
        ) : (
            <Badge label="inactive" variant="warning" />
        );

    const renderAction = (id: number): ReactElement => (
        <Dropdown
            items={[
                {
                    content: "Edit location",
                    onItemClick: () => router.push(`/locations/${id}`),
                    hash: "edit",
                },
            ]}
            toggle={
                <Button
                    iconOnly={<MoreHorizIcon color="secondary60" />}
                    variant="subtle"
                />
            }
        />
    );

    // if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <>
            <Flex justifyContent="space-between">
                <H0>Locations</H0>
                <Button
                    onClick={() => router.push(`/locations/add`)}
                    iconLeft={<AddIcon />}
                >
                    Add new location
                </Button>
            </Flex>
            <Panel id="locations">
                <Table
                    columns={[
                        {
                            header: "Location name",
                            hash: "label",
                            render: ({ id, label, description }) =>
                                renderLabel(id, label, description),
                            isSortable: true,
                        },
                        {
                            header: "Status",
                            hash: "enabled",
                            render: ({ enabled }) => renderEnabled(enabled),
                            isSortable: true,
                        },
                        {
                            header: "Action",
                            hideHeader: true,
                            hash: "id",
                            render: ({ id }) => renderAction(id),
                            align: "right",
                        },
                    ]}
                    items={tableItems}
                    itemName="Locations"
                    pagination={{
                        currentPage,
                        totalItems: meta?.pagination?.total,
                        onPageChange: setCurrentPage,
                        itemsPerPageOptions,
                        onItemsPerPageChange,
                        itemsPerPage,
                    }}
                    sortable={{
                        columnHash,
                        direction,
                        onSort,
                    }}
                    stickyHeader
                />
            </Panel>
        </>
    );
};

export default Index;

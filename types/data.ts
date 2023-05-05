export interface FormData {
    description: string;
    isVisible: boolean;
    name: string;
    price: number;
    type: string;
}

export interface TableItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface LocationAddress {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
    geo_coordinates: GeoCordinates;
    country_code: string;
}
interface GeoCordinates {
    latitude: number | null;
    longitude: number | null;
}

interface OperatingHoursData {
    open: boolean;
    opening: string;
    closing: string;
}

interface OperatingHours {
    sunday: OperatingHoursData;
    monday: OperatingHoursData;
    tuesday: OperatingHoursData;
    wednesday: OperatingHoursData;
    thursday: OperatingHoursData;
    friday: OperatingHoursData;
    saturday: OperatingHoursData;
}

interface SpecialHours {
    label: string;
    date: string;
    open: boolean;
    opening: string;
    closing: string;
    all_day: boolean;
    annual: boolean;
}

export interface LocationItemFormData {
    code: string;
    label: string;
    description?: string;
    managed_by_external_source?: boolean;
    type_id?: "PHYSICAL" | "VIRTUAL";
    enabled?: boolean;
    operating_hours?: OperatingHours;
    time_zone?: string;
    address?: LocationAddress;
    storefront_visibility?: boolean;
    special_hours?: SpecialHours[];
}

export interface LocationItem extends LocationItemFormData {
    id: number;
}

export interface ListItem extends FormData {
    id: number;
}

export interface StringKeyValue {
    [key: string]: string;
}

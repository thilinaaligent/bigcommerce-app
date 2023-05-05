import {
    Button,
    Checkbox,
    Flex,
    FormGroup,
    Input,
    Panel,
    Select,
    Form as StyledForm,
    Textarea,
} from "@bigcommerce/big-design";
import { ChangeEvent, FormEvent, useState } from "react";
import { LocationItemFormData, StringKeyValue } from "../types";

interface FormProps {
    formData: LocationItemFormData;
    onCancel(): void;
    onSubmit(form: LocationItemFormData): void;
}

const FormErrors = {
    name: "Product name is required",
    price: "Default price is required",
};

const LocationForm = ({ formData, onCancel, onSubmit }: FormProps) => {
    const {
        description,
        enabled = true,
        label,
        code,
        managed_by_external_source = false,
        type_id = "PHYSICAL",
        storefront_visibility = true,
        address: {
            address1,
            address2,
            city,
            country_code,
            geo_coordinates: { latitude, longitude },
            email,
            phone,
            state,
            zip,
        },
    } = formData;
    const [form, setForm] = useState<LocationItemFormData>({
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
    });
    const [errors, setErrors] = useState<StringKeyValue>({});

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name: formName, value } = event.target || {};
        setForm((prevForm) => ({ ...prevForm, [formName]: value }));

        // Add error if it exists in FormErrors and the input is empty, otherwise remove from errors
        !value && FormErrors[formName]
            ? setErrors((prevErrors) => ({
                  ...prevErrors,
                  [formName]: FormErrors[formName],
              }))
            : setErrors(({ [formName]: removed, ...prevErrors }) => ({
                  ...prevErrors,
              }));
    };

    const handleAddressChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name: formName, value } = event.target || {};
        setForm((prevForm) => ({
            ...prevForm,
            address: {
                ...prevForm.address,
                [formName]: value,
            },
        }));

        // Add error if it exists in FormErrors and the input is empty, otherwise remove from errors
        !value && FormErrors[formName]
            ? setErrors((prevErrors) => ({
                  ...prevErrors,
                  [formName]: FormErrors[formName],
              }))
            : setErrors(({ [formName]: removed, ...prevErrors }) => ({
                  ...prevErrors,
              }));
    };

    const handleGeoCoordinatesChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name: formName, value } = event.target || {};
        setForm((prevForm) => ({
            ...prevForm,
            address: {
                ...prevForm.address,
                geo_coordinates: {
                    ...prevForm.address.geo_coordinates,
                    [formName]: value,
                },
            },
        }));

        // Add error if it exists in FormErrors and the input is empty, otherwise remove from errors
        !value && FormErrors[formName]
            ? setErrors((prevErrors) => ({
                  ...prevErrors,
                  [formName]: FormErrors[formName],
              }))
            : setErrors(({ [formName]: removed, ...prevErrors }) => ({
                  ...prevErrors,
              }));
    };

    const handleTypeIdChange = (value: LocationItemFormData["type_id"]) => {
        setForm((prevForm) => ({ ...prevForm, type_id: value }));
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { checked, name: formName } = event.target || {};
        setForm((prevForm) => ({ ...prevForm, [formName]: checked }));
    };

    const handleSubmit = (event: FormEvent<EventTarget>) => {
        event.preventDefault();

        // If there are errors, do not submit the form
        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors) return;

        onSubmit(form);
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <Panel header="Basic Information">
                <FormGroup>
                    <Input
                        error={errors?.label}
                        label="Label"
                        name="label"
                        required
                        value={form.label}
                        onChange={handleChange}
                        description="Example: Central store"
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.code}
                        label="Code"
                        name="code"
                        required
                        value={form.code}
                        onChange={handleChange}
                        description="Example: BIGC-1"
                    />
                </FormGroup>
                <FormGroup>
                    <Textarea
                        error={errors?.description}
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Checkbox
                        name="enabled"
                        checked={form.enabled}
                        onChange={handleCheckboxChange}
                        label="Enabled"
                    />
                </FormGroup>
                <FormGroup>
                    <Checkbox
                        name="storefront_visibility"
                        checked={form.storefront_visibility}
                        onChange={handleCheckboxChange}
                        label="Visible in storefront"
                    />
                </FormGroup>
                <FormGroup>
                    <Checkbox
                        name="managed_by_external_source"
                        checked={form.managed_by_external_source}
                        onChange={handleCheckboxChange}
                        label="Managed by external source?"
                        description="Indicates if the third-party system is the source of truth for inventory values. If set to true, manually editing inventory in BC's control panel will be disabled."
                    />
                </FormGroup>
                <FormGroup>
                    <Select
                        label="Type"
                        name="type_id"
                        options={[
                            { value: "PHYSICAL", content: "Physical" },
                            { value: "VIRTUAL", content: "Virtual" },
                        ]}
                        required
                        value={form.type_id}
                        onOptionChange={handleTypeIdChange}
                    />
                </FormGroup>
            </Panel>
            <Panel header="Address Information">
                <FormGroup>
                    <Input
                        error={errors?.address1}
                        label="Address 1"
                        name="address1"
                        required
                        value={form.address.address1}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.address2}
                        label="Address 2"
                        name="address2"
                        required
                        value={form.address.address2}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.city}
                        label="City"
                        name="city"
                        required
                        value={form.address.city}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.state}
                        label="State"
                        name="state"
                        required
                        value={form.address.state}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.zip}
                        label="Postcode"
                        name="zip"
                        required
                        value={form.address.zip}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.country_code}
                        label="Country code"
                        name="country_code"
                        required
                        value={form.address.country_code}
                        onChange={handleAddressChange}
                        description="SO 3166-1 alpha-3 code."
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.email}
                        label="Email"
                        name="email"
                        required
                        value={form.address.email}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.phone}
                        label="Phone"
                        name="phone"
                        required
                        value={form.address.phone}
                        onChange={handleAddressChange}
                    />
                </FormGroup>
            </Panel>
            <Panel header="Geo Information">
                <FormGroup>
                    <Input
                        error={errors?.latitude}
                        label="Latitude"
                        name="latitude"
                        required
                        value={form.address.geo_coordinates.latitude}
                        onChange={handleGeoCoordinatesChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        error={errors?.longitude}
                        label="Longitude"
                        name="longitude"
                        required
                        value={form.address.geo_coordinates.longitude}
                        onChange={handleGeoCoordinatesChange}
                    />
                </FormGroup>
            </Panel>
            <Flex justifyContent="flex-end">
                <Button
                    marginRight="medium"
                    type="button"
                    variant="subtle"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </Flex>
        </StyledForm>
    );
};

export default LocationForm;

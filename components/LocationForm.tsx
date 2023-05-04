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
        // storefront_visibility = true,
    } = formData;
    const [form, setForm] = useState<LocationItemFormData>({
        code,
        description,
        enabled,
        label,
        managed_by_external_source,
        type_id,
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

    const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, name: formName } = event.target || {};
        setForm((prevForm) => ({ ...prevForm, [formName]: value }));
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
                        label="Enabled?"
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
                        onOptionChange={(e) => handleSelectChange(e)}
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

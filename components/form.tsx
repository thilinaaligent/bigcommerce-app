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
import { FormData, LocationItemFormData, StringKeyValue } from "../types";

interface FormProps {
    formData: LocationItemFormData;
    onCancel(): void;
    onSubmit(form: LocationItemFormData): void;
}

const FormErrors = {
    name: "Product name is required",
    price: "Default price is required",
};

const Form = ({ formData, onCancel, onSubmit }: FormProps) => {
    const { description, enabled, label } = formData;
    const [form, setForm] = useState<LocationItemFormData>({
        description,
        enabled,
        label,
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

    const handleSelectChange = (value: string) => {
        setForm((prevForm) => ({ ...prevForm, type: value }));
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
                        name="name"
                        required
                        value={form.label}
                        onChange={handleChange}
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

export default Form;

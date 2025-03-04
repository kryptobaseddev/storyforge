import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

/**
 * Hook for managing form state with validation
 * @param initialValues - Initial form values
 * @param validate - Validation function that returns errors
 * @returns Form state and handlers
 */
function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate: (values: T) => Partial<Record<keyof T, string>> = () => ({})
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof T;
    
    setValues(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  }, []);

  // Handle field blur (for validation on blur)
  const handleBlur = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const fieldName = name as keyof T;
    
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Validate the field on blur
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [validate, values]);

  // Set a field value programmatically
  const setFieldValue = useCallback((
    field: keyof T, 
    value: unknown
  ) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    
    setTouched(allTouched);
    
    // If no errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
}

export default useForm; 
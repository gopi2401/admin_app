import { Field, FieldProps } from 'solid-form-handler';
import { Component, JSX, Show, children, splitProps } from 'solid-js';

export type FileInputProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value'
> &
  FieldProps & { label?: string; accept?: string } & (
    | { multiple?: false; value?: File }
    | { multiple?: true; value?: File[] }
  );

export const FileInput: Component<FileInputProps> = (props) => {
  let fileInput: HTMLInputElement;
  const [local, rest] = splitProps(props, [
    'classList',
    'label',
    'accept',
    'formHandler',
    'multiple',
    'value',
  ]);

  return (
    <Field
      {...props}
      mode="file-input"
      render={(field) => (
        <div classList={local.classList}>
          <Show when={local.label}>
            <label class="form-label block mt-2 text-sm font-medium text-gray-900 dark:text-gray-300" for={field.props.id}>
              {local.label}
            </label>
          </Show>
          <input
            {...rest}
            class='hidden'
            multiple={local.multiple}
            type="file"
            accept={local.accept}
            classList={{ 'd-none': true }}

            onChange={field.props.onChange}
          />
          <Show when={field.helpers.error}>
            <div class="invalid-feedback">{field.helpers.errorMessage}</div>
          </Show>
        </div>
        
      )}
    />
  );
};
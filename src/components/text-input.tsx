import { FieldProps, Field } from 'solid-form-handler';
import { Component, JSX, Show, splitProps } from 'solid-js';

export type TextInputProps = JSX.InputHTMLAttributes<HTMLInputElement> &
  FieldProps & { label?: string, childrenRef?: HTMLInputElement };

export const TextInput: Component<TextInputProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'classList',
    'label',
    'formHandler',
    'childrenRef'
  ]);

  return (
    <Field
      {...props}
      mode="input"
      render={(field) => (
        <div classList={local.classList}>
          <Show when={local.label}>
            <label class="form-label block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300" for={field.props.id}>
              {local.label}
            </label>
          </Show>
          <input
            {...rest}
            {...field.props}
            ref={local.childrenRef}
            classList={{
              'border-red-500': field.helpers.error,
              'form-control': true,
            }}
          />
          <div class="min-h-12 h-2">
            <Show when={field.helpers.error}>
              <span class="text-red-500">{field.helpers.errorMessage}</span>
            </Show>
          </div>

        </div>
      )}
    />
  );
};
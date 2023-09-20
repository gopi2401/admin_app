import { FieldProps, Field } from 'solid-form-handler';
import { Component, JSX, Show, splitProps } from 'solid-js';

export type TextAreaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldProps & { label?: string};

export const TextArea: Component<TextAreaProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'classList',
    'label',
    'formHandler'
  ]);

  return (
    <Field
      {...props}
      mode="input"
      render={(field) => (
        <div classList={local.classList}>
          <Show when={local.label}>
            <label class="form-label block mt-2 text-sm font-medium text-gray-900 dark:text-gray-300" for={field.props.id}>
              {local.label}
            </label>
          </Show>
          <textarea
            {...rest}
            {...field.props}
            classList={{
              'border-red-500': field.helpers.error,
              'form-control': true,
            }}
          />
          <div class="min-h-20 h-5">
            <Show when={field.helpers.error}>
              <span class="text-red-500">{field.helpers.errorMessage}</span>
            </Show>
          </div>

        </div>
      )}
    />
  );
};
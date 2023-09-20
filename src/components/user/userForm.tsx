import { createSignal, Show, type JSX } from 'solid-js';
import { useFormHandler } from 'solid-form-handler';
import { z } from 'zod';
import { zodSchema } from 'solid-form-handler/zod';
import { TextInput } from '../text-input';
import { FileInput } from '../file-input';
const isRequired = (value?: File) => (value ? true : false);
const schema = z.object({
    name: z.string().min(1, 'name is required'),
    phone: z.number().min(10).or(z.string().min(10)),
    whatsAppNumber: z.string().min(10).nullable().or(z.literal('')),
    logo: z.custom<File>().refine(isRequired, { message: 'File is required' }),
});
export default function UserForm(props: any) {
    const user: any = props.edit;
    const formHandler = useFormHandler(zodSchema(schema));
    let logo: HTMLInputElement;
    const [logoImage, setLogoImage] = createSignal({ preview: '', raw: '' });
    if (user) {
        formHandler.fillForm(user);
        if (user.logo) {
            setLogoImage(
                {
                    preview: user.logo,
                    raw: '',
                });
        }
    }
    async function submit(ev: Event) {
        ev.preventDefault();
        try {
            await formHandler.validateForm();
            const form = ev.target as HTMLFormElement;
            const formD = new FormData(form);
            for (const field of formD.entries()) {
                const value: any = field[1]
                if (!value || (typeof value === 'object' && !value.name)) {
                    formD.delete(field[0]);
                }
            }
            if (user) {
                var response = await (await fetch(`http://localhost:8080/user/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        "authorization": "Bearer " + localStorage.getItem('accessToken')
                    },
                    body: formD as FormData,
                })).json();
            } else {
                var response = await (await fetch('https://api.bookmyplots.co/signup', {
                    method: 'POST',
                    // headers: {
                    //     "authorization": "Bearer " + user().accessToken
                    // },
                    body: formD as FormData,
                })).json();
            }
            // setLoading(false);
            if (response.status === 'success') {
                props.onclose()
            } if (response.message === "Phone number already registered") {
                window.alert(response.message)
            } else {
            }
        } catch (e) {
        }

    }
    const loadFile = (e: any) => {
        setLogoImage(
            {
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
    };

    return (
        <>
            <form autocomplete="off" onSubmit={submit} enctype="multipart/form-data">
                <div class="fixed inset-0 bg-black opacity-75"></div>
                <div class="fixed inset-0 flex  top-10 bottom-10 justify-center ">
                    <div class='bg-white h-full flex flex-col w-4/12  rounded-md items-center'>
                        <header class=' flex w-full max-w-5xl p-4 top-0'>
                            <div class="flex  justify-between w-full">
                                <div class="text-lg font-medium text-gray-900 mb-2">
                                    {user ? 'UserEdit' : 'UserCreate'}
                                </div>
                                <div onClick={props.onclose}>
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </div>
                        </header>
                        <div class='w-8/12'>
                            <div class="flex items-center justify-between w-full">
                                <label onClick={() => logo.click()} class="form-label block my-2 text-sm font-medium text-blue-900 dark:text-gray-300">
                                    Upload Logo
                                </label >
                                <div class="flex flex-col items-center justify-end">
                                    <Show when={logoImage().preview} fallback={null}>
                                        <img src={logoImage().preview} alt="dummy" class="w-20 h-20" />
                                    </Show>
                                </div>
                            </div>
                            <FileInput onChange={loadFile} name="logo" ref={logo} accept=".svg, .jpg, .jpeg, .png" formHandler={formHandler} />
                            <TextInput
                                label="Company name *"
                                placeholder='Eg: Nagal Nagar Plot'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="name"
                                formHandler={formHandler}
                            />
                            <TextInput
                                type="tel" pattern="[0-9]*"
                                label="Phone Number *"
                                placeholder='9XXXX12345'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="phone"
                                formHandler={formHandler}
                                maxlength="10"
                            />
                            <TextInput
                                type="number" pattern="[0-9]*"
                                label="whatsAppNumber"
                                placeholder='9XXXX12345'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="whatsAppNumber"
                                formHandler={formHandler}
                            />
                        </div>
                        <button type='submit' class="w-44 h-12 px-6 mt-5 text-indigo-100 transition-colors duration-150 bg-purple-700 hover:bg-purple-800 rounded-lg focus:shadow-outline">Save</button>
                    </div>
                </div>
            </form>
        </>
    )
}

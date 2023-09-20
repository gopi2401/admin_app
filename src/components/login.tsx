import { TextInput } from "./text-input";

export default function Login() {
    let phone: HTMLInputElement;
    let otp: HTMLInputElement;
    async function submit(ev: Event) {
        ev.preventDefault();
        try {
            const form = ev.target as HTMLFormElement;
            const formD = new FormData(form);
            const response = await (await fetch('http://localhost:8080/verify', {
                method: 'POST',
                body: formD as FormData,
            })).json();
            if (response.status === 'success') {
                localStorage.setItem("accessToken", response.accessToken);
                // localStorage.setItem("user", JSON.stringify(response.data));
                document.cookie = `accessToken=${response.accessToken};`;
                document.cookie = `user=${JSON.stringify(response.data)};`;
                window.location.href = "/user";
            } else {
            }
        } catch (e) {
        }
    }
    return (
        <>
            <section class="bg-gray-50 dark:bg-gray-900">
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        Estate
                    </a>
                    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form autocomplete="off" onSubmit={submit} class="space-y-4 md:space-y-6" action="#">
                                <TextInput label="Phone Number" type="number" name="phone" class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="98765XXXXX" required={true}></TextInput>
                                <TextInput label="Password" type="password" name="otp" id="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} ></TextInput>
                                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

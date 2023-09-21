import { createResource, createSignal, For, Show } from 'solid-js';
import UserForm from '../user/userForm'

export default function UserPage() {
    const [UserBoolen, setUserBoolen] = createSignal(false);
    const [user, setUser] = createSignal(null);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [users] = createResource(apiGet)
    async function apiGet() {
        const response = await fetch('https://api.bookmyplots.co/users', {
            method: 'GET',
            headers: {
                "authorization": "Bearer " + localStorage.getItem('accessToken')
            },
        });
        const data = await response.json();
        return data;
    }
    async function apiDelete(id: number) {
        const response = await (await fetch(`https://api.bookmyplots.co/user/${id}`, {
            method: 'DELETE',
        })).json();
        if (response.status === 'success') {
            return response;
        }
    }
    async function apiActivityStatus(val: boolean, id: number) {
        const formData = new FormData();
        formData.append("isDeleted", val);
        const response = await (await fetch(`https://api.bookmyplots.co/user/${id}`, {
            method: 'PUT',
            headers: {
                "authorization": "Bearer " + localStorage.getItem('accessToken')
            },
            body: formData as FormData,
        })).json();
        if (response.status === 'success') {
            return response;
        }
    }
    const UserModal = (user: any) => {
        if (user.id) { setUser(user) } else { setUser(null) }
        setUserBoolen(!UserBoolen());

    }
    const filteredUsers = () => {
        const query = searchQuery().toString().toLowerCase();
        if (query) {
            return users().filter(
                (user: any) =>
                    user.name.toString().toLowerCase()?.includes(query) ||
                    user.phone?.includes(query) ||
                    user.whatsAppNumber?.includes(query) ||
                    user.id?.toString().includes(query)
            );
        } else {
            return users()
        }
    };

    return (
        <div class='w-full'>
            <div class='h-16 p-2 flex items-center justify-between'>
                <div class='flex items-center ml-3'><input value={searchQuery()} onInput={(e) => setSearchQuery(e.target.value)} class='border p-2 w-96 rounded-lg mr-3' placeholder="Search..." type="text" />
                    <button onClick={() => location.reload()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></button>
                </div>
                <div class='flex items-center'>
                    <button onClick={UserModal} type="button" class="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-1 focus:ring-[#2557D6]/50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#2557D6]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5x h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add user
                    </button>
                    <div class='pl-2' ></div>
                    {/* <button type="button" class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-1 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Export
                    </button> */}
                </div>
            </div>
            <div class="flex flex-col">
                <div class="overflow-x-auto">
                    <div class="inline-block min-w-full py-2">
                        <div class="overflow-hidden">
                            <table class="min-w-full text-left text-sm font-light">
                                <thead class="border-b font-medium dark:border-neutral-500">
                                    <tr class=' bg-gray-100'>
                                        {/* <th scope="col" class="px-6 py-4">S.NO</th> */}
                                        <th scope="col" class="px-6 py-4">ID</th>
                                        <th scope="col" class="px-6 py-4">Name</th>
                                        <th scope="col" class="px-6 py-4">Phone Number</th>
                                        <th scope="col" class="px-6 py-4">Logo</th>
                                        <th scope="col" class="px-6 py-4">Whatsapp Number</th>
                                        <th scope="col" class="px-6 py-4">Activity status</th>
                                        <th scope="col" class="px-6 py-4">Otp</th>
                                        <th scope="col" class="px-4 py-4"></th>
                                        <th scope="col" class="px-4 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.loading ?
                                        <></> : <For each={filteredUsers()}>{(user: any) =>
                                            <tr class="border-b dark:border-neutral-500">
                                                <td class="whitespace-nowrap px-6 py-4 font-medium">{user.id}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.role === 'chief' ? <span>&#129332</span> : null}{user.name}</td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.phone}</td>
                                                <td class="px-6 py-4"><a target="_blank" href={user.logo}> <img
                                                    class="w-10 h-10"
                                                    src={user.logo}
                                                    alt="Logo"
                                                /></a></td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.whatsAppNumber}</td>
                                                <td class="whitespace-nowrap px-6 py-4"> <div class="px-4">
                                                    <input onchange={() => apiActivityStatus(!user.isDeleted, user.id)} type="checkbox" class="relative shrink-0 w-11 h-6 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-1 ring-transparent  ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800 before:inline-block before:w-5 before:h-5 before:bg-white checked:before:bg-white before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-white" checked={!user.isDeleted} />
                                                </div>
                                                </td>
                                                <td class="whitespace-nowrap px-6 py-4">{user.otp}</td>
                                                <td class="whitespace-nowrap px-4 py-4"><button onClick={() => UserModal(user)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button></td>
                                                <td class="whitespace-nowrap px-4 py-4"><button onClick={() => apiDelete(user.id)}><svg fill="#00000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke-width="1.5" stroke="red" viewBox="0 0 482.428 482.429"><g><g><path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979V115.744z" /><path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z" /><path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z" /><path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z" /></g></g></svg></button></td>
                                            </tr>
                                        }</For>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Show when={UserBoolen()} fallback={null} >
                <div class=" absolute w-full">
                    <UserForm onclose={UserModal} edit={user()} />
                </div>
            </Show>
        </div >
    );
}

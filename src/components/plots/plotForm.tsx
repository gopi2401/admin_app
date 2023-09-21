import { createSignal, Show, type JSX } from 'solid-js';
import { useFormHandler } from 'solid-form-handler';
import { z } from 'zod';
import { zodSchema } from 'solid-form-handler/zod';
import { TextInput } from '../text-input';
import { FileInput } from '../file-input';
import { TextArea } from '../textArea';
const isRequired = (value?: File) => (value ? true : false);
const schema = z.object({
    name: z.string().min(1, 'name is required'),
    address: z.string().min(4, 'Give more information').optional(),
    youtubeLink: z.string().url("Enter a URL").or(z.literal('')),
    locationLink: z.string().url("Enter a URL").or(z.literal('')),
    plotImage: z.custom<File>().refine(isRequired, { message: 'File is required' }),
    plots: z.custom<File>().optional(),
    cover: z.custom<File>().refine(isRequired, { message: 'File is required' }),
    media: z.array(z.custom<File>()
        .refine(isRequired, { message: 'File is required' })
    ).min(2)
});
const Edit = z.object({
    name: z.string().min(1, 'name is required'),
    address: z.string().min(4, 'Give more information').optional(),
    youtubeLink: z.string().url("Enter a URL").or(z.literal('')),
    locationLink: z.string().url("Enter a URL").or(z.literal('')),
    plotImage: z.custom<File>().optional(),
    plots: z.custom<File>().optional(),
    cover: z.custom<File>().optional(),
    media: z.array(z.custom<File>()).min(2).optional(),
});
export default function PlotForm(props: any) {
    const plot: any = props.edit;
    const formHandler = useFormHandler(zodSchema(plot ? Edit : schema));
    let plotImage: HTMLInputElement;
    let xsl: HTMLInputElement;
    let coverImage: HTMLInputElement;
    let images: HTMLInputElement;
    const [files, setFiles] = createSignal([]);
    const [plotimageUrl, setPlotimageUrl] = createSignal("");
    const [xlsfileUrl, setXlsfileUrl] = createSignal("");
    let coverImageUrl = false;

    if (plot) {
        formHandler.fillForm(plot);
        let arr: any = [];
        if (plot.cover) { arr.push(plot.cover); }; //arr.splice(0, 0, plot.cover)
        if (plot.media.length != 0) { arr.push(...plot.media) };
        if (arr.length != 0) { setFiles(arr); }
        if (plot.plots.length != 0) { setXlsfileUrl(plot.name + '.xlsx'); }
        if (plot.cover) {
            coverImageUrl = true;
        }
    }

    async function submit(ev: Event) {
        ev.preventDefault();
        try {
            await formHandler.validateForm()
            const form = ev.target as HTMLFormElement;
            const formD = new FormData(form);
            formD.delete("media");
            let i = 1
            files().map(file => {
                if (coverImageUrl) {
                    if (i > 1) {
                        if (typeof file == 'object') { formD.append("media", file); }
                        if (typeof file == 'string') {
                            formD.append("media", file);
                        }
                    };
                } else {
                    if (i > 0) {
                        if (typeof file == 'object') { formD.append("media", file); }
                        if (typeof file == 'string') {
                            formD.append("media", file);
                        }
                    };
                }
                i++;
            })
            if (xlsfileUrl()) { formD.append("plotdetails", 'true'); } else { formD.append("plotdetails", 'false'); }
            for (const field of Array.from(formD.entries())) {
                const value: any = field[1]
                if (!value || (typeof value === 'object' && !value.name)) {
                    formD.delete(field[0]);
                }
            }

            let url = 'https://api.bookmyplots.co/plots/create';
            let method = 'POST'

            if (plot) {
                url = `https://api.bookmyplots.co/plots/edit/${plot.id}`;
                method = 'PUT'
            }
            const response = await (await fetch(url, {
                method,
                headers: {
                    "authorization": "Bearer " + localStorage.getItem('accessToken')
                },
                body: formD,
            })).json();
            if (response.status === 'success') {
                props.onclose()
            } else {

            }
        } catch (e) {
        }

    }
    const removeFile = (index: number) => {
        setFiles(files().filter((_, i) => i !== index));
        if (index === 0 && coverImageUrl) {
            coverImage.value = '';
            coverImageUrl = false;
        } else if (coverImageUrl) {
            index += 1;
            const files = Array.from(images.files);
            files.splice(index, 1);
        } else {
            const files = Array.from(images.files);
            files.splice(index, 1);
        }
    }

    const loadFile = (event: any) => {
        switch (event.target.name) {
            case 'plotImage': setPlotimageUrl(event.target.files[0].name);
                break;
            case 'plots': setXlsfileUrl(event.target.files[0].name);
                break;
            case 'media': setMedia(Array.from(event.target.files));
                break;
            case 'cover': setCover(Array.from(event.target.files));
                break;
            default: ''
        }

    };
    const setMedia = (file: any) => {
        if (coverImageUrl) {
            setFiles([...files(), ...file]);
            return;
        }
        setFiles(file);
    }

    const setCover = (file: any) => {
        const tempFile = files();
        if (coverImageUrl) {
            tempFile.splice(0, 1);
        }
        setFiles([...file, ...tempFile]);
        coverImageUrl = true;
    }


    return (
        <>
            <form autocomplete="off" onSubmit={submit} enctype="multipart/form-data">
                <div class="fixed inset-0 bg-black opacity-75"></div>
                <div class="fixed inset-0 flex  top-10 bottom-10 justify-center ">
                    <div class='bg-white h-full flex flex-col w-4/12  rounded-md items-center'>
                        <header class=' flex w-full max-w-5xl p-4 top-0'>
                            <div class="flex  justify-between w-full">
                                <div class="text-lg font-medium text-gray-900 mb-2">
                                    {plot ? "PlotEdit" : "PlotCreate"}
                                </div>
                                <div onClick={props.onclose}>
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </div>
                        </header>
                        <div class='overflow-y-auto w-9/12'>
                            <TextInput
                                label="Plot Name"
                                placeholder='Eg: Nagal Nagar Plot'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="name"
                                formHandler={formHandler}
                            />
                            <div class="flex items-center justify-between w-full">
                                <label class="form-label block text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Upload Plot Image
                                </label>
                                <div class="flex flex-col items-center justify-end">
                                    <Show when={plotimageUrl()} fallback={null}>
                                        <button class=" text-sm font-medium text-blue-600" onClick={() => { plotImage.value = ''; setPlotimageUrl(null) }}>
                                            Remove File
                                        </button>
                                    </Show>
                                </div>
                            </div>
                            <FileInput onChange={loadFile} class="hidden" name="plotImage" ref={plotImage} accept=".svg, .jpg, .jpeg, .png" formHandler={formHandler} />
                            <div class="flex flex-col items-center justify-center p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50" onClick={() => plotImage.click()}>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    <Show when={plotimageUrl() || plot} fallback={"Upload *svg,jpg and png image"}>
                                        {plotimageUrl() ? <div>{plotimageUrl()}</div> : <img src={plot.plotImage} alt="dummy" class="w-20 h-20" />}
                                    </Show>
                                </p>
                            </div>
                            <TextArea
                                rows="2"
                                label="About The Plot"
                                placeholder='Eg: Near Railway St'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="address"
                                formHandler={formHandler}
                            />
                            <div class="flex items-center justify-between w-full">
                                <label class="form-label block text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Upload file
                                </label>
                                <div class="flex flex-col items-center justify-end">
                                    <Show when={xlsfileUrl()} fallback={
                                        (<a class='text-sm font-medium text-blue-600' href="https://plot-project-media.s3.ap-south-1.amazonaws.com/Sample/Sample-Spreadsheet.xlsx">Download Sample</a>)
                                    }>
                                        <button class=" text-sm font-medium text-blue-600" onClick={() => { xsl.value = ''; setXlsfileUrl(null) }}>
                                            Remove File
                                        </button>
                                    </Show>
                                </div>
                            </div>
                            <div class="flex flex-col items-center justify-center py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50" onClick={() => xsl.click()}>
                                <p class="text-sm bg-gray-50 text-gray-500 dark:text-gray-400">
                                    <Show when={xlsfileUrl() || plot} fallback={"Tap to upload the sample file"}>
                                        <div>{xlsfileUrl()}</div>
                                    </Show>
                                </p>
                            </div>
                            <FileInput onChange={loadFile} class="hidden" name="plots" ref={xsl} accept=".xlsx" formHandler={formHandler} />
                            <TextInput
                                label="Youtube Video"
                                placeholder='paste your youtube link'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="youtubeLink"
                                formHandler={formHandler}
                            /><TextInput
                                label="Location Link"
                                placeholder='Paste your map link'
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                name="locationLink"
                                formHandler={formHandler}
                            />
                            <div class="flex items-center justify-between w-full">
                                <label class="form-label block mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Add Images
                                </label>
                                <div class="flex items-center justify-end">
                                    <p class="mt-2 pr-4 text-sm text-gray-500 dark:text-gray-400cursor-pointer" onClick={() => coverImage.click()}>Add Cover</p>
                                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => images.click()}>Add Images</p>
                                </div>
                            </div>
                            <FileInput onChange={loadFile} class="hidden" name="cover" ref={coverImage} accept=".svg, .jpg, .jpeg, .png" formHandler={formHandler} />
                            <FileInput onChange={loadFile} class="hidden" name="media" ref={images} accept=".svg, .jpg, .jpeg, .png" multiple formHandler={formHandler} />
                            <div id="cont" class='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 mt-2  items-center justify-center '>
                                {files().map((file, index) => (
                                    <div id={'rowdiv' + index} class=''>
                                        <div class='relative max-h-48 max-w-5xl'>
                                            <img
                                                class='h-full w-full rounded-md'
                                                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                                id={'output' + index}
                                                alt={'Image ' + index}
                                                width="200"
                                            />
                                            <button
                                                class=' absolute rounded-full  top-0 right-0 w-5 h-5 pb-1 pl-0.5  bg-black text-white  flex items-center justify-center text-center cursor-pointer'
                                                onClick={() => removeFile(index)}
                                            >
                                                x
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type='submit' class="w-44 h-12 px-6 my-4 text-indigo-100 transition-colors duration-150 bg-purple-700 hover:bg-purple-800 rounded-lg focus:shadow-outline">Save</button>
                    </div>
                </div>
            </form >
        </>
    )
}

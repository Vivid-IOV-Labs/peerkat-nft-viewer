import ApiService from "./ApiService";
const API_ENDPOINT = "media";


async function list() {
    const { data: { allMedia } } = await ApiService.get(`${API_ENDPOINT}/list`);
    console.log(allMedia);
    return allMedia;
}

export default {
    list
}
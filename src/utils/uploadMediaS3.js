import sendRequest, { getAccessToken } from '../helpers/AxiosApiRequest';
import { API_GATEWAY_URL } from '../common/constants';
import RNFetchBlob from "rn-fetch-blob";

// Get Image name 
const getFileImageName = (imgFile) => {
    const name = new Date().getTime()
    const extension = imgFile.split('/')[1]
    return `${name}.${extension}`
}

// Get pre-singed url by uploaded data
const getUploadData = async ({
    mediaFile,
    collectionId,
    userId,
    type = '',
}) => {
    let presignedResponse = null
    const token = await getAccessToken('ACCESS_TOKEN')
    const imageId = getFileImageName(mediaFile.mime)
    const params = {
        imageId,
        collectionId,
        type
    }
    try {
        presignedResponse = await sendRequest({
            url: `${API_GATEWAY_URL}/nft-image/${userId}/pre-signed`,
            method: 'PUT',
            params,
            headers: {
                Authorization: `${token}`
            },
        })
        return presignedResponse;
    } catch (error) {
        console.log("@@@ errro ====>", error)
        return presignedResponse;
    }

}

// Convert Image into Array Buffer
const convertImageToArrayBuffer = async (url) => {
    try {
        const base64 = await RNFetchBlob.fs.readFile(url, 'base64')
        var Buffer = require("buffer/").Buffer;
        const arrayBuffer = await Buffer.from(base64, "base64");
        return arrayBuffer;
    } catch (error) {
        console.log("@@@ error ", error)
    }
}

// Upload media on AWS S3
const putCollectionMedia = async ({
    mediaFile,
    collectionId,
    uploadUrl,
    type,
}) => {
    const token = await getAccessToken('ACCESS_TOKEN')
    let newPath = mediaFile.path.replace('file://', '');
    const arrayBuffer = await convertImageToArrayBuffer(newPath);
    try {
        const presignedFinalResponse = await sendRequest({
            url: uploadUrl,
            method: 'PUT',
            data: arrayBuffer,
            headers: {
                'x-amz-tagging': `token=${token}&collectionId=${collectionId}&type=${type}`,
                'Content-Type': mediaFile.mime,
                'Authorization': 'No'
            },
        })
    } catch (error) {
        console.log("@@@ error ", error)
    }
}

export {
    getFileImageName,
    getUploadData,
    putCollectionMedia,
    convertImageToArrayBuffer
};
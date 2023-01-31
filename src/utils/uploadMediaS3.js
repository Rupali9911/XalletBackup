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
    previewMediaId = ''
}) => {
    let presignedResponse = null
    const token = await getAccessToken('ACCESS_TOKEN')
    const imageId = getFileImageName(mediaFile.mime)
    // const params = {
    //     imageId,
    //     collectionId,
    //     type
    // }
    const params = type
        ? previewMediaId
            ? {
                imageId,
                collectionId,
                preview_img_id: previewMediaId,
                type,
            }
            : {
                imageId,
                collectionId,
                type,
            }
        : {
            imageId,
            collectionId,
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
    } catch (error) { }
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
    } catch (error) { }
}

const putNFTMedia = async ({
    mediaFile,
    nftId,
    uploadUrl,
    previewMediaId,
    thumbImgPath,
}) => {
    const token = await getAccessToken('ACCESS_TOKEN')
    let newPath = mediaFile.path.replace('file://', '');
    const arrayBuffer = await convertImageToArrayBuffer(newPath);
    const headers = {
        'x-amz-tagging': thumbImgPath
            ? `token=${token}&nft_id=${nftId}&thumbImgPath=${thumbImgPath}`
            : previewMediaId
                ? `token=${token}&nft_id=${nftId}&preview_img_id=${previewMediaId}`
                : `token=${token}&nft_id=${nftId}`,
        'Content-Type': mediaFile.mime,
        'Authorization': 'No'
    }

    return sendRequest({
        url: uploadUrl,
        method: 'PUT',
        data: arrayBuffer,
        headers,
    })
}

export {
    getFileImageName,
    getUploadData,
    putCollectionMedia,
    putNFTMedia,
    convertImageToArrayBuffer
};
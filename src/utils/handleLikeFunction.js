import {NEW_BASE_URL} from '../common/constants';
import sendRequest from '../helpers/AxiosApiRequest';

export const handleLike = async nftItem => {
  let getNftItem = {...nftItem};
  return new Promise(async (resolve, reject) => {
    let data = {
      nftId: nftItem.nftId,
      status: Number(nftItem.isLike) === 1 ? 0 : 1,
    };
    sendRequest({
      url: `${NEW_BASE_URL}/nfts/like`,
      method: 'POST',
      data,
    })
      .then(response => {
        if (response.generatedMaps.length > 0 || response.affected) {
          getNftItem.isLike = data.status;
          getNftItem.totalLike = data.status
            ? Number(getNftItem.totalLike) + 1
            : Number(getNftItem.totalLike) - 1;
          resolve(getNftItem);
        } else {
          reject(nftItem);
        }
      })
      .catch(err => {
        reject(nftItem);
      });
  });
};

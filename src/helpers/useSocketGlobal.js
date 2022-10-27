import {initiateSocket, socket} from './socket';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

// import { useAppDispatch } from '@/store/hooks'
// import { getNFTDetails } from '@/store/nft/detailSlice'
// import { selectDataUser } from '@/store/user/selectors'
// import { useRouter } from 'next/router'
// import { toast } from 'react-toastify'

export const useSocketGlobal = (
  event,
  callback,
  isPendingTransaction = true,
) => {
  const {networkType} = useSelector(state => state.WalletReducer);
  const {userData} = useSelector(state => state.UserReducer);
  const userAddress = userData?.userWallet?.address;

  useEffect(() => {
    const customCallback = isPendingTransaction
      ? data => {
          // const modalTransactionPending = document.getElementById(
          //     idModalTransactionPending,
          // )
          // if (modalTransactionPending) {
          //     callback(data)
          // }
          callback(data);
        }
      : callback;

    const connectSocket = async () => {
      if (socket?.connected === undefined) {
        if (userAddress) {
          initiateSocket(userAddress);
        }
      }

      if (socket) {
        socket.off(event).on(event, customCallback);
      }
    };
    connectSocket();
  }, [userAddress, networkType]);
};

// export const useSocketDetailPage = (event, setIsLoading, message) => {
//     const router = useRouter()
//     const dispatch = useAppDispatch()
//     const handleSocketResult = (data) => {
//         console.log(data)
//         setIsLoading(false)
//         toast.success(message)
//         dispatch(getNFTDetails(router.query))
//     }
//     const dataUserStore = useSelector(selectDataUser)
//     const userAddress = dataUserStore?.userWallet.address
//     useEffect(() => {
//         const connectSocket = async () => {
//             if (socket?.connected === undefined) {
//                 if (userAddress) {
//                     initiateSocket(userAddress)
//                 }
//             }
//             if (socket) {
//                 socket.off(event).on(event, handleSocketResult)
//             }
//         }
//         connectSocket()
//     }, [userAddress])
// }

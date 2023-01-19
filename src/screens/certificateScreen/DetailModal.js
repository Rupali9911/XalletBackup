import React from 'react';
import ShowModal from './modal';
import {translate} from '../../walletUtils';
import TransactionPending from '../../components/Popup/transactionPending';

const DetailModal = ({
  openTransactionPending,
  cancelAuctionModal,
  reclaimModal,
  cancelResellModal,
  setOpenTransactionPending,
  modalClose,
  cancelAuctionApi,
  closeReclaimModal,
  reClaimApi,
  closeCancelModal,
  handleCancelSell,
}) => {
  return (
    <>
      <TransactionPending
        isVisible={openTransactionPending}
        setVisible={setOpenTransactionPending}
      />
      <ShowModal
        isVisible={cancelAuctionModal}
        title={translate('common.cancelAuction')}
        description={translate('common.areYouWantCancelAuction')}
        closeModal={modalClose}
        onRightPress={cancelAuctionApi}
      />
      <ShowModal
        isVisible={reclaimModal}
        title={translate('common.reclaimNFT')}
        description={translate('common.areYouWantReclaimNFT')}
        closeModal={closeReclaimModal}
        onRightPress={reClaimApi}
      />
      <ShowModal
        isVisible={cancelResellModal}
        title={translate('common.cancelResell')}
        description={translate('common.cancellingYourlistingWillUnPublish')}
        closeModal={closeCancelModal}
        onRightPress={handleCancelSell}
      />
    </>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.openTransactionPending === nextProps.openTransactionPending &&
    prevProps.cancelAuctionModal === nextProps.cancelAuctionModal &&
    prevProps.reclaimModal === nextProps.reclaimModal &&
    prevProps.cancelResellModal === nextProps.cancelResellModal
  );
}

export default React.memo(DetailModal, arePropsEqual);

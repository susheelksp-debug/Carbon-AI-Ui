import { setTokenExpireModal } from "../slices/auth";
import { store } from "../store";

export const handleTokenExpireModal = () => {
    store.dispatch(setTokenExpireModal(true));
};
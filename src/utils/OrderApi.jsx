import axios from "axios";
import { getAuthHeaderConfig } from "./getHeader";
import { apiURL } from "./getProductApi";

export const newOrder = async (id, qty, address) => {
  const headers = getAuthHeaderConfig();
  const body = {
    productId: id,
    quantity: qty,
    addressType: "HOME",
    address: address,
  };

  try {
    const res = await axios.post(
      `${apiURL}api/v1/ecommerce/order`,
      body,
      headers
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export const getOrderHistory = async () => {
  const headers = getAuthHeaderConfig();
  try {
    const res = await axios.get(`${apiURL}api/v1/ecommerce/order/`, headers);
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getSingleOrderDetails = async (id) => {
  const headers = getAuthHeaderConfig();
  try {
    const res = await axios.get(
      `${apiURL}api/v1/ecommerce/order/${id}`,
      headers
    );
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

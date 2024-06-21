import axios from "axios";
import {
  getHeaderWithProjectIdAndBody,
  headerWithProjectIdOnly,
} from "./getHeader";

export const apiURL = "https://academics.newtonschool.co/";

export const getProductsBySearch = async (page, filter) => {
  const headers = headerWithProjectIdOnly();

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  let searchFilter = "";
  if (filter && !isObjectEmpty(filter)) {
    searchFilter = `&search=${JSON.stringify(filter)}`;
  }

  try {
    console.log(
      `${apiURL}api/v1/ecommerce/clothes/products?limit=${20}&page=${page}${searchFilter}`
    );
    const res = await axios.get(
      `${apiURL}api/v1/ecommerce/clothes/products?limit=${20}&page=${page}${searchFilter}`,
      headers
    );

    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getProductById = async (id) => {
  const headers = headerWithProjectIdOnly();

  try {
    const res = await axios.get(
      `https://academics.newtonschool.co/api/v1/ecommerce/product/${id}`,
      headers
    );
    return res.data.data;
  } catch (error) {
    return error;
  }
};

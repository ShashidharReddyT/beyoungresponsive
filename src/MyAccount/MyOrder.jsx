import { Flex, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/UserProvider";
import "./MyOrder.css";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    // Fetch order data from the API
    const fetchOrderData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("projectID", "yxpa71cax49z");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://academics.newtonschool.co/api/v1/ecommerce/order/",
          requestOptions
        );
        const data = await response.json();
        console.log(data);
        // Check the data structure and adjust the following code accordingly
        if (data.status === "success" && data.results > 0) {
          setOrders(data.data || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchOrderData();
  }, [token]);

  const getSavedAddress = () => {
    const savedAddress = JSON.parse(localStorage.getItem("savedAddress")) || {};
    return savedAddress;
  };

  return (
    <div className="my-orders">
      <Flex
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Array.isArray(orders) && orders.length === 0 ? (
          <>
            <img
              src="https://www.beyoung.in/desktop/images/checkout/EMPTY%20CARTORDER%20PAGE..png"
              alt="cartbag"
              style={{ width: "350px" }}
              className="cartproductimage"
            />
            <Text
              style={{ marginTop: "0", fontSize: "25px" }}
              className="nothingbag"
            >
              No Orders.
            </Text>
            <Link to="/">
              <Button
                style={{
                  width: "300px",
                  height: "2.5rem",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "white",
                  backgroundColor: "black",
                  borderRadius: "10px",
                  border: "1px solid rgb(66, 162, 162)",
                  cursor: "pointer",
                  marginLeft: "0px",
                }}
                className="buttoncartnothings"
              >
                Continue Shopping
              </Button>
            </Link>
          </>
        ) : (
          <div className="orderss">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-6 g-4">
              <p className="fw-bold" style={{ fontSize: "20px" }}>
                YOUR ORDERS:
              </p>
              {Array.isArray(orders) &&
                orders.map((order, index) => (
                  <div key={index} className="col">
                    {order.order.items.map((product, productIndex) => (
                      <div key={productIndex} className="card h-60">
                        <img
                          src={product.product.displayImage}
                          alt={product.product.name}
                          className="card-img-top img-fluid"
                        />
                        <div className="card-body">
                          <h5 className="card-title">{product.product.name}</h5>
                          <p className="card-text">
                            Price: ₹{product.product.price}
                          </p>
                          <p className="card-text">
                            Ratings: {product.product.ratings.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              {/* Right side section for shipping address */}
            </div>
            <div className="col1">
              <p className="fw-bold" style={{ fontSize: "20px" }}>
                SHIPPING ADDRESS:
              </p>
              <p>Street: {getSavedAddress().address1}</p>
              <p>City: {getSavedAddress().address2}</p>
              <p>State: {getSavedAddress().state}</p>
              <p>Country: {getSavedAddress().country}</p>
              <p>Zip / Postal Code: {getSavedAddress().zip}</p>
            </div>
          </div>
        )}
      </Flex>
    </div>
  );
};

export default MyOrder;

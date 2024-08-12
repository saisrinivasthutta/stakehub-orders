import { useState, useEffect } from "react";
import { Vortex } from "react-loader-spinner";
import DataTable from "react-data-table-component";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const Home = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [qty, setQty] = useState("");
  const [qtyError, setQtyError] = useState("");
  const [mode, setMode] = useState("buyerMode");
  const [pendingSellerOrders, setPendingSellerOrders] = useState([]);
  const [pendingBuyerOrders, setPendingBuyerOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const getPendingBuyerOrders = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const url = "https://orders-stake-hub.onrender.com/buyer-pending-orders";
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
      setPendingBuyerOrders(data);
      console.log(data);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const getPendingSellerOrders = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const url = "https://orders-stake-hub.onrender.com/seller-pending-orders";
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
      setPendingSellerOrders(data);
      console.log(data);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const getCompletedOrders = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const url = "https://orders-stake-hub.onrender.com/completed-orders";
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
      setCompletedOrders(data);
      console.log(data);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getPendingBuyerOrders();
    getPendingSellerOrders();
    getCompletedOrders();
  }, []);

  const matchOrders = async (details) => {
    setApiStatus(apiStatusConstants.inProgress);
    const url = "https://orders-stake-hub.onrender.com/match-orders";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      await setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
      console.log(data);
    }
    setPrice("");
    setQty("");
  };

  const onSubmitBuyerOrder = async (e) => {
    e.preventDefault();
    setApiStatus(apiStatusConstants.inProgress);
    const details = { buyer_price: parseInt(price), buyer_qty: parseInt(qty) };
    matchOrders(details);
    const url = "https://orders-stake-hub.onrender.com/buyer-orders";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
    } else {
      await setApiStatus(apiStatusConstants.failure);
      console.log(data);
    }
    setPrice("");
    setQty("");
  };

  const onSubmitSellerOrder = async (e) => {
    e.preventDefault();
    setApiStatus(apiStatusConstants.inProgress);
    const details = {
      seller_price: parseInt(price),
      seller_qty: parseInt(qty),
    };
    const url = "https://orders-stake-hub.onrender.com/seller-orders";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
      console.log(response);
    } else {
      setApiStatus(apiStatusConstants.failure);
      console.log(data);
    }
    setPrice("");
    setQty("");
  };

  const changePrice = (e) => {
    e.preventDefault();
    setPrice(e.target.value);
  };

  const changeQty = (e) => {
    e.preventDefault();
    setQty(e.target.value);
  };

  const onPriceBlur = (e) => {
    e.preventDefault();
    if (price === 0 || price === "") {
      setPriceError("Price Must be Greater than 0");
    }
  };

  const onQtyBlur = (e) => {
    e.preventDefault();
    if (qty === 0 || qty === "") {
      setQtyError("Quantity Must be Greater than 0");
    }
  };

  const renderForm = () => {
    if (mode === "buyerMode") {
      return (
        <form onSubmit={onSubmitBuyerOrder}>
          <h1 className="main-heading">Buyer</h1>
          <label htmlFor="buyerPrice">Price :</label>
          <input
            onChange={changePrice}
            value={price}
            onBlur={onPriceBlur}
            id="buyerPrice"
            type="number"
          />
          <p>{priceError}</p>
          <label htmlFor="buyerQty">Quantity :</label>
          <input
            onChange={changeQty}
            value={qty}
            onBlur={onQtyBlur}
            id="buyerQty"
            type="number"
          />
          <p>{qtyError}</p>
          <button type="submit">Submit Order</button>
        </form>
      );
    }
    return (
      <form onSubmit={onSubmitSellerOrder}>
        <h1 className="main-heading">Seller</h1>
        <label htmlFor="buyerPrice">Price :</label>
        <input onBlur={onPriceBlur} id="buyerPrice" type="number" />
        <p>{priceError}</p>
        <label htmlFor="buyerQty">Quantity :</label>
        <input onBlur={onQtyBlur} id="buyerQty" type="number" />
        <p>{qtyError}</p>
        <button type="submit">Submit Order</button>
      </form>
    );
  };

  const onChangeModeToBuyer = () => {
    setMode("buyerMode");
    setPrice("");
    setQty("");
    setPriceError("");
    setQtyError("");
  };

  const onChangeModeToSeller = () => {
    setMode("sellerMode");
    setPrice("");
    setQty("");
    setPriceError("");
    setQtyError("");
  };

  const renderUi = () => {
    switch (apiStatus) {
      case apiStatusConstants.failure:
        return <h1>Failure </h1>;
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader">
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["red", "green", "blue", "yellow", "orange", "purple"]}
            />
          </div>
        );
      case apiStatusConstants.initial:
        return renderInitialAndSuccessView();
      case apiStatusConstants.success:
        return renderInitialAndSuccessView();

      default:
        break;
    }
  };

  const renderInitialAndSuccessView = () => (
    <>
      <div className="btn-container">
        <button onClick={onChangeModeToBuyer} type="button">
          Buyer
        </button>
        <button onClick={onChangeModeToSeller} type="button">
          Seller
        </button>
      </div>
      <div className="form-container">{renderForm()}</div>
      <div className="data-container">
        {renderSellerTable()}
        {renderBuyerTable()}
        {renderCompletedTable()}
      </div>
    </>
  );

  const renderSellerTable = () => {
    const columns = [
      {
        name: "Price",
        selector: (row) => row.seller_price,
      },
      {
        name: "Quantity",
        selector: (row) => row.seller_qty,
      },
    ];
    return (
      <div className="table-container">
        <h1>Pending Seller Orders</h1>
        <DataTable
          highlightOnHover
          columns={columns}
          data={pendingSellerOrders}
        />
      </div>
    );
  };

  const renderBuyerTable = () => {
    const columns = [
      {
        name: "Price",
        selector: (row) => row.buyer_price,
      },
      {
        name: "Quantity",
        selector: (row) => row.buyer_qty,
      },
    ];
    return (
      <div className="table-container">
        <h1>Pending Buyer Orders</h1>
        <DataTable
          highlightOnHover
          columns={columns}
          data={pendingBuyerOrders}
        />
      </div>
    );
  };

  const renderCompletedTable = () => {
    const columns = [
      {
        name: "Price",
        selector: (row) => row.price,
      },
      {
        name: "Quantity",
        selector: (row) => row.qty,
      },
    ];
    return (
      <div className="table-container">
        <h1>Completed Orders</h1>
        <DataTable highlightOnHover columns={columns} data={completedOrders} />
      </div>
    );
  };

  return (
    <div className="main-container">
      <h1 className="main-heading">Welcome to STAKEHUB Orders</h1>
      {renderUi()}
    </div>
  );
};
export default Home;

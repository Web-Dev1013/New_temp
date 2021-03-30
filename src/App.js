import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [list, setList] = useState([]); // State array value for every item of left section.
  const [cost, setCost] = useState(0); // Total cost state value.
  const [flag, setFlag] = useState(false); // Flag state value to identify what button is selected.
  const [itemId, setItemId] = useState(""); // State value to store id of selected item.
  const [message, setMessage] = useState(""); // State value to manage the response message.
  const [result, setResult] = useState(""); //  State value to manage the result.
  const [dollar, setDollar] = useState(0);
  const [quarter, setQuarter] = useState(0);
  const [dime, setDime] = useState(0);
  const [nickel, setNickel] = useState(0);

  // When loading the page, getting the items of left section.
  const getList = () => {
    return Promise.resolve(
      fetch("http://tsg-vending.herokuapp.com/items").then((data) =>
        data.json()
      )
    );
  };

  // When click purchase button, getting the data of selected item.
  const getNewItem = () => {
    return Promise.resolve(
      fetch(
        "http://tsg-vending.herokuapp.com/money/" + cost + "/item/" + itemId,
        {
          method: "POST",
        }
      ).then((data) => data.json())
    );
  };

  // When click Dollar button, Increase the total cost every 1.
  const addDollar = () => {
    setCost(Number(cost) + 1);
    setDollar(dollar + 1);
  };

  // When click Quarter button, Increase the total cost every 0.25.
  const addQuarter = () => {
    setCost(Number(cost) + 0.25);
    setQuarter(quarter + 1);
  };

  // When click Dime button, Increase the total cost every 0.1.
  const addDime = () => {
    setCost((Number(cost) + 0.1).toFixed(2));
    setDime(dime + 1);
  };

  // When click Nickel button, Increase the total cost every 0.05
  const addNickel = () => {
    setCost((Number(cost) + 0.05).toFixed(2));
    setNickel(nickel + 1);
  };

  // When click item in left section.
  const selectItem = (key, id) => {
    setFlag(key); // key: order of the selected item.
    setItemId(id); // id: number of the selected item.
    setCost(0); //: when click item, the cost will be filled as zero
    setMessage(""); // when click item, the message will be filed as blink string.
    setResult(""); // when click item, the result will be filled as blink string.
  };

  // When click purchase button
  const purchase = () => {
    getNewItem().then((subItems) => {
      // When click purchase button, getting the data of selected item.
      getList().then((items) => {
        // when click purchase button, refresh the left section because the quantity is reduced.
        setList(items);
      });
      if (subItems.message) {
        // If there is return message, will display the message in message box.
        setMessage(subItems.message);
      } else {
        setMessage("Thank You!!!");
        var price = 0;
        for (var i = 0; i < list.length; i++) {
          // selecting the price of selected iem.
          if (list[i].id === itemId) {
            price = list[i].price;
          }
        }
        var b_c = cost - price;  // total cost - price of selected item. 
        var dollars = parseInt(b_c); 
        var quarters = parseInt((b_c - dollars) / 0.25); 
        var dimes = parseInt((b_c - dollars - quarters * 0.25) / 0.1); 
        var nickels = parseInt(
          (b_c - dollars - quarters * 0.25 - dimes * 0.1) / 0.05
        ); console.log("nickel", nickels)
        var pennies = (
          (b_c - dollars - quarters * 0.25 - dimes * 0.1 - nickels * 0.05) /
            0.01
        ).toFixed(0);
        quarters = dollars * 4 + quarters;
        var results =
          quarters + (quarters > 1 ? " Quarters," : " Quarter,") +
          (dimes >= 1 ? dimes + (dimes > 1 ? " Dimes," : " Dime,") : "") +
          (nickels >= 1
            ? nickels + (nickels > 1 ? " Nickels," : " Nickel,")
            : "") +
          (pennies >= 1
            ? pennies + (pennies > 1 ? " Pennies," : " Penny,")
            : "") + 
          (b_c > 0 ? "b/c Price is " + b_c : "");
        setResult(results);
      }
    });
  };

  // when click change button,
  const changeReturn = () => {
    if (message === "") {
      var quarters = quarter + dollar*4;
      var pennies = cost - dollar - quarter*0.25 - dime*0.1 - nickel*0.05;
      var results =
        (quarters >= 1 ? quarters + (quarters>1?" Quarters,":" Quarter,") : "") +
        (dime >= 1 ? dime + (dime>1?" Dimes,":" Dime,") : "") +
        (nickel >= 1 ? nickel + (nickel>1?" Nickels,":" Nickel,") : "") +
        (pennies >= 1 ? pennies + (pennies>1?" Pennies,":" Penny,") : "") +
        (cost > 0 ? "b/c Price is " + cost : "");
      setResult(results);
    } else {
      setCost(0); // initialize cost.
      setMessage(""); // initialize message
      setItemId(""); // initialize item number
      setResult(""); // initialize result box
    }
  };

  // when load the page, getting the items of left section.
  useEffect(() => {
    getList().then((items) => {
      setList(items);
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="w-100 header mx-4">
          <p className="h1 text-center p-3 text-dark font-weight-bold">
            Vending Machine
          </p>
        </div>
        <div className="row w-100 p-5">
          <div className="col-sm-8 left-content">
            <div className="row">
              {list &&
                list.map((item, key) => {
                  return (
                    <div className="col-lg-4 col-md-6 col-sm-12" key={key}>
                      <div
                        className="card mt-4"
                        onClick={() => selectItem(key, item.id)}
                      >
                        <div className="card-body">
                          <p className="item_id font-weight-bold">{item.id}</p>
                          <input
                            type="checkbox"
                            value={item.id}
                            className="state"
                            checked={key === flag ? true : false}
                            disabled
                          />
                          <p className="text-center item_name font-weight-bold">
                            {item.name}
                          </p>
                          <p className="text-center item_price font-weight-bold">
                            <span className="currency">$ </span>
                            <span className="price">{item.price}</span>
                          </p>
                          <p className="text-center font-weight-bold">
                            Quantity Left:
                            <span className="quantity">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-sm-4 px-5">
            <div className="right_item">
              <div className="row">
                <div className="w-100">
                  <p className="h3 text-center py-3 m-0">Total $ In</p>
                  <input
                    type="text"
                    id="amount"
                    className="form-control mx-auto mb-2 w-50"
                    placeholder="0.00"
                    value={cost}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 px-3">
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="dollar"
                    value="dollar"
                    onClick={addDollar}
                  >
                    Add Dollar
                  </button>
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="dime"
                    value="dime"
                    onClick={addDime}
                  >
                    Add Dime
                  </button>
                </div>
                <div className="col-md-6 px-3">
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="quarter"
                    value="quarter"
                    onClick={addQuarter}
                  >
                    Add Quarter
                  </button>
                  <button
                    className="btn btn-secondary w-100 my-2"
                    id="nickel"
                    value="nickel"
                    onClick={addNickel}
                  >
                    Add Nickel
                  </button>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="right_item">
              <div className="row">
                <div className="w-100">
                  <p className="h3 text-center py-3 m-0">Messages</p>
                  <div className="d-flex mt-2">
                    <div className="mx-auto">
                      <input
                        type="text"
                        id="message"
                        className="form-control mx-auto mb-2"
                        value={message}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className=" mx-auto">
                      <label
                        htmlFor="purchase_item"
                        className="font-weight-bold text-secondary"
                      >
                        Item :
                      </label>
                      <input
                        type="text"
                        id="purchase_item"
                        className="form-control"
                        value={itemId}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="d-flex mt-2">
                    <button
                      className="btn btn-secondary w-50 mx-auto my-2"
                      id="purchase"
                      onClick={purchase}
                    >
                      Make Purchase
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="right_item">
              <div className="row">
                <div className="w-100 mt-3">
                  <p className="h3 text-center py-3 m-0">Change</p>
                  <input
                    type="text"
                    className="form-control mx-auto my-2 change_result w-75"
                    value={result}
                    readOnly
                  />
                  <div className="d-flex">
                    <button
                      className="btn btn-secondary w-50 mx-auto my-2"
                      id="change"
                      onClick={changeReturn}
                    >
                      Change Return
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

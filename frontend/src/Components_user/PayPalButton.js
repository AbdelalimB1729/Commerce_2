import React, { useEffect } from "react";

const PayPalButton = ({ total, onSuccess }) => {
  useEffect(() => {
    console.log("Initializing PayPal Button...");

    const existingScript = document.querySelector("#paypal-sdk");

    const loadPayPalButtons = () => {
      if (window.paypal) {
        console.log("Rendering PayPal Buttons...");
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              if (total <= 0) {
                alert("Total must be greater than 0 to proceed with payment.");
                return;
              }
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total.toString(), 
                    },
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              console.log("PayPal order approved.");
              return actions.order
                .capture()
                .then((details) => {
                  console.log("Order captured successfully:", details);
                  alert(
                    `Transaction completed by ${details.payer.name.given_name}`
                  );
                  if (onSuccess) {
                    onSuccess(details);
                  }
                })
                .catch((err) => {
                  console.error("Error capturing PayPal order:", err);
                });
            },
            onError: (err) => {
              console.error("PayPal Button Error:", err);
            },
          })
          .render("#paypal-button-container")
          .catch((err) => {
            console.error("Error rendering PayPal Buttons:", err);
          });
      } else {
        console.error("PayPal SDK is not available.");
      }
    };

    if (!existingScript) {
      console.log("Loading PayPal SDK...");
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=ART50ZLUTRsApktCVHMF4i4KzbbnM7o5b80o6tpHwODyTaxZGHaxkFzoWf_P9DStGm4OmmEV9dYB0kJs&currency=USD&debug=true";
      script.id = "paypal-sdk";
      script.async = true;

      script.onload = () => {
        console.log("PayPal SDK loaded successfully.");
        loadPayPalButtons();
      };

      script.onerror = () => {
        console.error("Failed to load PayPal SDK script.");
      };

      document.body.appendChild(script);
    } else {
      console.log("PayPal SDK already loaded.");
      loadPayPalButtons();
    }

    return () => {
      console.log("Cleaning up PayPal Button...");
      const container = document.querySelector("#paypal-button-container");
      if (container) {
        container.innerHTML = ""; 
      }
    };
  }, [total, onSuccess]);

  return <div id="paypal-button-container" className="my-4"></div>;
};

export default PayPalButton;

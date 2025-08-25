import { useEffect, useState, useCallback } from "react";
import CurrencyDropdown from "./Dropdown";
import { HiArrowsRightLeft, HiExclamationCircle } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["USD", "EUR", "GBP", "JPY", "INR"]
  );

  // Fetch available currencies
  const fetchCurrencies = useCallback(async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      if (!res.ok) throw new Error("Failed to fetch currencies");
      
      const data = await res.json();
      setCurrencies(Object.keys(data));
      setError(null);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setError("Failed to load currencies. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  // Currency conversion with proper error handling
    const convertCurrency = async () => {
      console.log("Starting conversion..."); // Debug log
      console.log(`Amount: ${amount}, From: ${fromCurrency}, To: ${toCurrency}`); // Debug log
      console.log(`Amount: ${amount}, From: ${fromCurrency}, To: ${toCurrency}`); // Debug log
    console.log("Conversion triggered"); // Log to check if function is called
    console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`); // Log input values
    console.log("Conversion triggered"); // Log to check if function is called
    const numericAmount = parseFloat(amount);
    
    // Input validation
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    
    if (fromCurrency === toCurrency) {
      setError("Please select different currencies for conversion");
      return;
    }

    setConverting(true);
    setError(null);
    
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${numericAmount}&from=${fromCurrency}&to=${toCurrency}`
      );
      
      if (!res.ok) throw new Error("Failed to convert currency");
      
      const data = await res.json();
      const result = data.rates[toCurrency];
      
      setConvertedAmount({
        amount: result,
        from: fromCurrency,
        to: toCurrency,
        originalAmount: numericAmount
      });
      
    } catch (error) {
      console.error("Error converting currency:", error);
      setError("Failed to convert currency. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
    setError(null);
  };

  const handleAmountChange = (value) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl currency-card">
      <h2 className="mb-6 text-3xl font-bold text-gray-800 text-center">
        💱 Currency Converter
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          title="From:"
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          handleFavorite={handleFavorite}
        />
        {/* swap currency button */}
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>
        <CurrencyDropdown
          favorites={favorites}
          currencies={currencies}
          currency={toCurrency}
          setCurrency={setToCurrency}
          title="To:"
          handleFavorite={handleFavorite}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount:
        </label>
        <input
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          type="text"
          inputMode="decimal"
          placeholder="Enter amount"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <HiExclamationCircle className="text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={convertCurrency}
          disabled={converting}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200
          ${converting ? "opacity-75 cursor-not-allowed" : "hover:bg-indigo-700"}`}
        >
          {converting ? "Converting..." : "Convert"}
        </button>
      </div>

      {convertedAmount && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="text-lg font-semibold text-green-800 text-center">
            {convertedAmount.originalAmount} {convertedAmount.from} = 
          </div>
          <div className="text-2xl font-bold text-green-900 text-center mt-2">
            {convertedAmount.amount.toFixed(2)} {convertedAmount.to}
          </div>
          <div className="text-sm text-green-600 text-center mt-2">
            Exchange rate applied
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;

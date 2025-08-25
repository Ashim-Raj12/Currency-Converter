import { HiOutlineStar, HiStar } from "react-icons/hi2";

const CurrencyDropdown = ({
  currencies,
  currency,
  setCurrency,
  favorites,
  handleFavorite,
  title = "",
}) => {
  const isFavorite = (curr) => favorites.includes(curr);

  return (
    <div>
      <label
        htmlFor={title}
        className="block text-sm font-medium text-gray-700"
      >
        {title}
      </label>

      <div className="mt-1 relative">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
        >
          {favorites.map((favCurrency) => (
            <option className="bg-gray-200" value={favCurrency} key={favCurrency}>
              {favCurrency}
            </option>
          ))}
          <hr />
          {currencies
            .filter((c) => !favorites.includes(c))
            .map((currCurrency) => (
              <option value={currCurrency} key={currCurrency}>
                {currCurrency}
              </option>
            ))}
        </select>

        <button
          onClick={() => handleFavorite(currency)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {isFavorite(currency) ? 
            <HiStar className="text-yellow-500" /> : 
            <HiOutlineStar className="text-gray-400" />
          }
        </button>
      </div>
    </div>
  );
};

export default CurrencyDropdown;

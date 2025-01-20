import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  ariaLabel,
  className,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        data-testid="search-icon"
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        aria-label={ariaLabel || placeholder}
      />
    </div>
  );
};

export default SearchInput;

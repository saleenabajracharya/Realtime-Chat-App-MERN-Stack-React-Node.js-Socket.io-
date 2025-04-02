import React from "react";

export const Input = ({
  label = "",
  name = "",
  type = "",
  className = "",
  inputClassName = "",
  isRequired = true,
  placeholder = "",
  value = '',
  onChange = () => {},
}) => {
  return (
    <div className={`w-1/2 ${className}`}> 
      <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none block w-full p-2.5 ${inputClassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

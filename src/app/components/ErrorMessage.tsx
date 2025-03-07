import React from "react";

const ErrorMessage = ({ error }: { error: string | undefined }) => {
  return (
    error && (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 mb-4 text-sm text-center">
        {error}
      </div>
    )
  );
};

export default ErrorMessage;

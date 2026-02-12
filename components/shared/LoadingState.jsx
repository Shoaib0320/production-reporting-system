import React from 'react';
import PropTypes from 'prop-types';

function LoadingState({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#00A3E1] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 font-medium animate-pulse">{message}</p>
        </div>
    );
}

LoadingState.propTypes = {
  message: PropTypes.string,
};

LoadingState.defaultProps = {
  message: 'Loading...',
};

export default LoadingState;
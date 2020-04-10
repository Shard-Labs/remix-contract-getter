import React from "react";

export const Spinner = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border my-2" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
};

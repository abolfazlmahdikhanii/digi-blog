import React from "react";
import { Spinner } from "./ui/spinner";
import { ChevronDown } from "lucide-react";

const ShowMoreBtn = ({
  hasNextPage = false,
  dataLength,
  isFetchingNextPage = false,
  fetchNextPage,
}) => {
  const nextPageHandler = () => {
    fetchNextPage();
  };
  return (
    <>
      {hasNextPage && dataLength>0 && (
        <div className="self-center">
          <button
            variant="outline"
            className="rounded-full self-center min-h-10 px-6 mt-6 flex items-center gap-x-2.5 text-green-500"
            onClick={nextPageHandler}
            disabled={isFetchingNextPage}
          >
            <span>Show more</span>{" "}
            {isFetchingNextPage ? (
              <Spinner />
            ) : (
              <ChevronDown size={16} className="-mb-1" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default ShowMoreBtn;

import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/GlobalContext";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Details = () => {
  // Accessing context for page title and details page data
  const { setPageTitle, detailsPageData, setDetailsPageData } = useContext(AppContext);

  // State to store filtered table data
  const [tableData, setTableData] = useState([]);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Effect to set page title and process details page data
  useEffect(() => {
    console.log(detailsPageData); // Log details page data for debugging
    setPageTitle("Details"); // Set the page title

    // Check if detailsPageData is a non-empty object
    if (detailsPageData && typeof detailsPageData === "object" && Object.keys(detailsPageData).length > 0) {
      // Convert object to key-value pairs
      const entries = Object.entries(detailsPageData);

      // Filter entries to include only string or number values
      const filteredEntries = entries.filter(([key, value]) => typeof value === "string" || typeof value === "number");

      // Set the filtered data for the table
      setTableData(filteredEntries);
    } else {
      // Reset table data if detailsPageData is empty
      setTableData([]);
    }
  }, [detailsPageData]); // Re-run effect when detailsPageData changes

  return (
    <div className="w-full mt-10 px-[20px]">
      {/* Back button section */}
      <div className="flex justify-start items-center my-2">
        <div
          className="gap-2 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-50 flex justify-center items-center"
          onClick={() => {
            setDetailsPageData({}); // Clear details page data
            navigate(-1); // Navigate back to the previous page
          }}
        >
          <FaArrowLeft size={23} /> {/* Back arrow icon */}
          <span className="text-3xl font-bold">Back</span> {/* Back button text */}
        </div>
      </div>

      {/* Table to display key-value pairs */}
      <table className="w-full mt-6 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border border-gray-200">
            <th className="p-2 w-[50%] ">Key</th> {/* Table header for keys */}
            <th className="p-2 w-[50%] ">Value</th> {/* Table header for values */}
          </tr>
        </thead>
        <tbody>
          {/* Display "No Data" if tableData is empty */}
          {tableData.length === 0 ? (
            <tr>
              <td className="p-2 text-center text-gray-400" colSpan={2}>
                No Data
              </td>
            </tr>
          ) : (
            // Map through tableData to display key-value pairs
            tableData.map(([key, value], index) => (
              key !== "_id" && ( // Exclude the "_id" field
                <tr key={index}>
                  <td className="border border-gray-200 p-2">{key}</td> {/* Display key */}
                  <td className="border border-gray-200 p-2">{value}</td> {/* Display value */}
                </tr>
              )
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Details;
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch, FaPlus } from "react-icons/fa";
import { Button, Modal, Form } from 'react-bootstrap'
import { useToast } from '@chakra-ui/react';

const SubscriptionPlan = () => {
 

  useEffect(() => {
  }, []);

  

  return (
    <div className="table-responsive">
     
      {/* {filteredPlans.length > 0 ?
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)", width: "10%" }}>Sr No.</th>
              <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Name</th>
              <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Duration (in Months)</th>
              <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Price (in USD)</th>
              <th scope="col" style={{ textAlign: "center", width: '15%', backgroundColor: "rgb(249,180,181)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPlans.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center", width: "10%",fontWeight:"500" }}>{indexOfFirstPlan + index + 1}</td>
                <td style={{ textAlign: "center",fontWeight:"500" }}>{item.name}</td>
                <td style={{ textAlign: "center", fontWeight:"500"}}>{item.duration === 1 ? `${item.duration} month` : `${item.duration} months`}</td>
                <td style={{ textAlign: "center", width: '18%',fontWeight:"500" }}>{`$ ${item.price}`}</td>
                <td style={{ display: "flex", columnGap: '10px', margin: "auto" }}>
                  <button className="btn btn-primary" style={{ fontWeight: '500', margin: "auto" }} onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="btn btn-danger" style={{ fontWeight: '500', margin: "auto" }} onClick={() => handleDelete(item._id)} >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : <p>No active plan found...</p>}

      {filteredPlans.length > 0 ?
        <div className="pagination-container" style={{ display: 'flex' }}>
          <button
            className="pagination-arrow"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            style={{ backgroundColor: "rgb(199,205,215)", height: "38px", borderRadius: "4px", width: "35px", margin: "0px 20px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}
          >
            &#8249;&#8249;
          </button>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredPlans.length / plansPerPage) }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <button
            style={{ backgroundColor: "rgb(199,205,215)", height: "38px", borderRadius: "4px", width: "35px", margin: "0px 20px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}
            className="pagination-arrow"
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(filteredPlans.length / plansPerPage)}
          >
            &#8250;&#8250;
          </button>
        </div> : ""}  */}

    </div>
  )
}

export default SubscriptionPlan

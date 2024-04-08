import React, { useEffect, useState } from 'react'
import { FaSearch, FaPlus, FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import { Button, Modal, Form } from 'react-bootstrap'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import baseUrl from 'src/URL/baseUrl';
import { useDropzone } from 'react-dropzone';

const Users = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchName, setSearchName] = useState('');
  const [totalPages, setTotalPages] = useState(null)
  const [fileterData, setFileterData] = useState({})
  const [totalData, setTotalData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    // profileImage: null,
  });
  const toast = useToast()

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjExN2U4NThkODJkNzU4MDJiY2FiNjEiLCJpYXQiOjE3MTI1NTcxMzcsImV4cCI6MTcxNTE0OTEzNywidHlwZSI6ImFjY2VzcyJ9.FXfNDwWE6IhwpmyPeRdoq07tkGlcec_CKOyWWVTHKec"
  let token = localStorage.getItem('accessToken')
  console.log(typeof token);
  console.log(token);
  useEffect(() => {
    getUsers();
  }, [searchName, currentPage]);

  const handleSearchTextChange = (e) => {
    const searchText = e.target.value;
    setSearchName(searchText);
    if (searchText === "") {
      handleSearchClear()
    }
  };

  const handleSearchClear = () => {
    setSearchName("");
  };

  const getUsers = async () => {
    try {
      let queryParams = {
        page_no: currentPage ? currentPage : 1,
      };
      let filterData = {}; // Define filterData
  
      if (searchName !== "") {
        filterData = { ...filterData, name: searchName };
      }
  
      const response = await axios.get(`${baseUrl}/v1/auth/users`, {
        params: {
          page: queryParams.page_no,
          filter: JSON.stringify(filterData)
        },
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      console.log(response);
  
      if (response.status === 200) {
        setData(response.data.data.data);
        setTotalPages(response.data.data.totalPages);
        setTotalData(response.data.data.totalResults);
      } else {
        // Handle other response status codes if needed
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: "An error occurred while fetching users.",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    }
  };
  

  const nextPage = () => {
    if (currentPage < totalPages) { // Check if current page is less than total pages
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page)
  };

  const calculateSerialNumber = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  const [showModal, setShowModal] = useState({
    add: false
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/v1/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
      if (response.data.data.code === 201) {
        toast({
          title: 'Register successfull',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      } else {
        toast({
          title: 'Error',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      }
      getUsers();
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        password: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        profileImage: null,
      })
    }
    catch (error) {
      console.error("err", error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    };
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/users/${id}`)
      .then((response) => {
        toast({
          title: 'User deleted successfuly!!',
          description: "",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        getUsers()
      })
      .catch((error) => {

        console.log(error);
      });
  };

  return (
    <div className="table-responsive">
      <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: "30px" }}>
        <div className="search-box" style={{ width: "300px", display: "flex" }}>
          <span className="input-group-text" style={{ width: "15%", fontSize: "20px", borderRadius: "5px 0px 0px 5px", backgroundColor: 'rgb(249,180,181)' }}>
            <FaSearch />
          </span>
          <input
            type="text"
            value={searchName}
            onChange={handleSearchTextChange}
            placeholder="Search by name"
            className="form-control"
            style={{ borderRadius: "0px 5px 5px 0px" }}
          />
        </div>
        <div style={{ display: "flex", columnGap: "20px" }}>
          <button onClick={() => setShowModal({ add: true })} className="btn btn-primary" style={{ display: "flex", fontWeight: 'bold', backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}><FaPlus style={{ marginTop: '3px' }} /> &nbsp; Register</button>
          {/* <button onClick={() => handleDownload()} className="btn btn-primary" style={{ display: "flex", fontWeight: 'bold', backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}><FaDownload style={{ marginTop: '3px' }} /> &nbsp; Download</button> */}
        </div>
      </div>
      {data.length > 0 ? <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Profile Image</th>
            <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Name</th>
            <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Email</th>
            <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Address</th>
            <th scope="col" style={{ textAlign: "center", width: '15%', backgroundColor: "rgb(249,180,181)" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", width: "10%", fontWeight: "500" }}>{calculateSerialNumber(index)}</td>
              <td style={{ textAlign: "center", fontWeight: "500" }}>{item.name}</td>
              <td style={{ textAlign: "center", fontWeight: "500" }}>{item.email}</td>
              <td style={{ textAlign: "center", fontWeight: "500" }}>{item.address.addressLine1 + ", " + item.address.city + ", " + item.address.state + ", " + item.address.country + "-" + item.address.zipcode}</td>
              <td style={{ display: "flex", columnGap: '10px', alignItems: "center" }}>
                <button className="btn" ><FaEdit /></button>
                <button className="btn " onClick={() => handleDelete(item._id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        : <p>No active user...</p>}
      {totalPages > 1 ? (
        <div className="pagination-container" style={{ display: 'flex' }}>
          <button
            className="pagination-arrow"
            onClick={prevPage}
            disabled={currentPage === 1}
            style={{ backgroundColor: "rgb(199,205,215)", height: "38px", borderRadius: "4px", width: "35px", margin: "0px 20px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}
          >
            &#8249;&#8249;
          </button>
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <button
            style={{ backgroundColor: "rgb(199,205,215)", height: "38px", borderRadius: "4px", width: "35px", margin: "0px 20px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}
            className="pagination-arrow"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            &#8250;&#8250;
          </button>
        </div>
      ) : null}

      <Modal show={showModal.add} onHide={() => setShowModal({ add: false })} centered runTransition={false}>
        <Modal.Header closeButton>
          <Modal.Title>Register new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData?.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="email" style={{ marginTop: "10px" }}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData?.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="password" style={{ marginTop: "10px" }}>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData?.password} onChange={handleInputChange} pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$"
                title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one special character, and one number." required minLength={8} />
            </Form.Group>
            {/* <Form.Group controlId="profileImage" style={{ marginTop: "10px" }}>
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" name="profileImage" onChange={handleImageChange} required />
            </Form.Group> */}
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="addressLine1" style={{ marginTop: "10px" }}>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control type="text" name="addressLine1" value={formData?.addressLine1} onChange={handleInputChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="addressLine2" style={{ marginTop: "10px" }}>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control type="text" name="addressLine2" value={formData?.addressLine2} onChange={handleInputChange} />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="city" style={{ marginTop: "10px" }}>
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={formData?.city} onChange={handleInputChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="state" style={{ marginTop: "10px" }}>
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" value={formData?.state} onChange={handleInputChange} required />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="country" style={{ marginTop: "10px" }}>
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" value={formData.country} onChange={handleInputChange} required />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="zipcode" style={{ marginTop: "10px" }}>
                  <Form.Label>Zipcode</Form.Label>
                  <Form.Control type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} required />
                </Form.Group>
              </div>
            </div>
            <div></div>
            <Button variant="primary" type="submit" style={{ marginTop: "30px" }}>Register</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Users

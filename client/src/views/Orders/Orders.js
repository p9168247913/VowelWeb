import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch, FaPlus } from "react-icons/fa";
import { Button, Modal, Form } from 'react-bootstrap'
import { useToast } from '@chakra-ui/react';

const SubscriptionPlan = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(5);
  const [modal, setShowModal] = useState({
    add: false,
    edit: false
  })
  const toast = useToast()

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/subscriptionPlans');
      setSubscriptionPlans(response.data.reverse());
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPlans = subscriptionPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.duration.toString().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.price <= 0) {
      toast({
        title: ' Price of plan could not be 0 or less !!',
        description: "",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: "top"
      });
      return;
    }
    if (formData.duration <= 0) {
      toast({
        title: ' Duration of plan must be 1 month or above !!',
        description: "",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: "top"
      });
      return;
    }
    fetch('http://localhost:8080/subscriptionPlans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log("register", data);
        if (data.msg === "Subscription plan name already exists") {
          toast({
            title: 'Subscription Error',
            description: "Subscription plan name already exists !!",
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: "top"
          });
        } else if (data.msg === "Subscription plan already exists") {
          toast({
            title: 'Subscription Plan Error',
            description: "Subscription plan already exists !!",
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: "top"
          });
        } else {
          toast({
            title: 'Subscription Added Successfully !!',
            description: "",
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: "top"
          });
          setShowModal(false);
          fetchSubscriptionPlans();
          setFormData({
            name: '',
            duration: '',
            price: ''
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/subscriptionPlans/${id}`)
      .then((response) => {
        toast({
          title: 'Subscription plan deleted successfuly!!',
          description: "",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        fetchSubscriptionPlans()
      })
      .catch((error) => {
        toast({
          title: 'Could not delete plan !!',
          description: "",
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        console.log(error);
      });
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      duration: item.duration,
      price: item.price,
    });
    setShowModal({ edit: true });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.price <= 0) {
      toast({
        title: ' Price of plan could not be 0 or less !!',
        description: "",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: "top"
      });
      return;
    }
    if (formData.duration <= 0) {
      toast({
        title: ' Duration of plan must be 1 month or above !!',
        description: "",
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/subscriptionPlans/${selectedItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = response.json()
      console.log(data);
      if (response.ok) {
        toast({
          title: 'Subscription plan updated successfuly!!',
          description: "",
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        setSelectedItem(null);
        fetchSubscriptionPlans()
        setFormData({
          name: '',
          duration: '',
          price: ''
        });
        setShowModal({ edit: false })
      } else {
        // Error case
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  };

  const onEditToggle = () => {
    setShowModal({ edit: false })
    setFormData({
      name: "",
      duration: "",
      price: "",
    });
  }

  const onAddToggle = () => {
    setShowModal({ add: false })
    setFormData({
      name: "",
      duration: "",
      price: "",
    });
  }

  return (
    <div className="table-responsive">
      <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: "30px" }}>
        <div className="search-box" style={{ width: "300px", display: "flex" }}>
          <span className="input-group-text" style={{ width: "15%", fontSize: "20px", borderRadius: "5px 0px 0px 5px", backgroundColor:'rgb(249,180,181)' }}>
            <FaSearch />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by plan name or email"
            className="form-control"
            style={{ borderRadius: "0px 5px 5px 0px" }}
          />
        </div>
        <button
          onClick={() => setShowModal({ add: true })}
          className="btn btn-primary" style={{ display: "flex", fontWeight: 'bold', backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}><FaPlus style={{ marginTop: '3px' }} /> &nbsp; Add Plan</button>
      </div>
      {filteredPlans.length > 0 ?
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
        </div> : ""}

      <Modal show={modal.add} onHide={() => onAddToggle()} centered runTransition={false}>
        <Modal.Header closeButton>
          <Modal.Title>Register new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Subscription Plan Name</Form.Label>
              <Form.Control placeholder='Enter plan name here...' type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="email" style={{ marginTop: "10px" }}>
              <Form.Label>Duration of Plan</Form.Label>
              <Form.Control placeholder='Enter plan duration here...' type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="password" style={{ marginTop: "10px" }}>
              <Form.Label>Price</Form.Label>
              <Form.Control placeholder='Enter plan price here...' type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required minLength={8} />
            </Form.Group>
            <div></div>
            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} >Add</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={modal.edit} onHide={() => onEditToggle()} centered runTransition={false}>
        <Modal.Header closeButton>
          <Modal.Title> Update Subscription Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditFormSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Subscription Plan Name</Form.Label>
              <Form.Control placeholder='Enter plan name here...' type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="email" style={{ marginTop: "10px" }}>
              <Form.Label>Duration of Plan</Form.Label>
              <Form.Control placeholder='Enter plan duration here...' type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="password" style={{ marginTop: "10px" }}>
              <Form.Label>Price</Form.Label>
              <Form.Control placeholder='Enter plan price here...' type="number" name="price" value={formData.price} onChange={handleInputChange} required minLength={8} />
            </Form.Group>
            <div></div>
            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} >Update</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default SubscriptionPlan

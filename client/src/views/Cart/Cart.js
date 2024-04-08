import React, { useEffect } from 'react'
import { useState } from 'react';
import { FaSearch, FaPlus } from "react-icons/fa";
import { Button, Modal, Form } from 'react-bootstrap'
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const SubAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('subadmin');
    const toast = useToast()
    const [allowedPages, setAllowedPages] = useState([]);
    const [subadmins, setSubadmins] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [searchText, setSearchText] = useState("");

    const handleCheckboxChange = (event) => {
        const page = event.target.value;
        if (event.target.checked) {
            setAllowedPages([...allowedPages, page]);
        } else {
            setAllowedPages(allowedPages.filter((p) => p !== page));
        }
    };

    const [modal, setShowModal] = useState({
        add: false,
        edit: false
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            toast({
                title: 'Password Error',
                description: "Password must be at least 8 characters long",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/admin/register", {
                name,
                email,
                password,
                role,
                allowedPages
            })
            console.log("response", response)
            const data = response.data
            if (data.msg === "Email already exists") {
                toast({
                    title: 'Registration Error',
                    description: "Sub-Admin already exists!!",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
            } else if (data.msg === "Sub-Admin registered successfully!!!") {
                toast({
                    title: 'Registration Successfull!!',
                    description: "Sub-Admin registered successfully !!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                setName('');
                setEmail('');
                setPassword('');
                setAllowedPages([])
                setShowModal({ add: false })
                fetchSubadmins()
            }
        } catch (error) {
            toast({
                title: 'Server Error',
                description: "Try after sometime !!",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const onToggle = (e) => {
        setShowModal({ add: false })
        setShowModal({ edit: false })
        setName('');
        setEmail('');
        setPassword('');
        setAllowedPages([])
    }

    useEffect(() => {
        fetchSubadmins();
    }, []);

    const fetchSubadmins = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/subadmin');
            setSubadmins(response.data.reverse());
            console.log(response.data)
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/admin/subadmin/${id}`);
            toast({
                title: 'Deleted',
                description: "Sub-Admin removed!!",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            fetchSubadmins();
        } catch (error) {
            console.error(error);
            toast({
                title: 'Server Error',
                description: "Try after sometime !!",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }
    }
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/admin/subadmin/${selectedItem._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name, email, password, role, allowedPages
                }),
            });
            if (response.ok) {
                toast({
                    title: 'Updated successfuly!!',
                    description: "Sub-Admin details updated!!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: "top"
                });
                setSelectedItem(null);
                fetchSubadmins()
                setName('');
                setEmail('');
                setPassword('');
                setAllowedPages([])
                setShowModal({ edit: false })
            } else {
                // Error case
                console.error("Failed to update data");
            }
        } catch (error) {
            console.error("Failed to update data:", error);
        }
    }

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setName(item.name)
        setEmail(item.email)
        setPassword(item.password)
        setRole(item.role)
        setAllowedPages(item.allowedPages)
        setShowModal({ edit: true });
    };

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredItems = subadmins.filter((item) => {
        const lowerCaseSearchText = searchText.toLowerCase();
        const lowerCaseName = item.name.toLowerCase();
        const lowerCaseEmail = item.email.toLowerCase();
        return (
            lowerCaseName.includes(lowerCaseSearchText) ||
            lowerCaseEmail.includes(lowerCaseSearchText)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const goToNextPage = () => {
        const totalPages = Math.ceil(subadmins.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className="table-responsive">
            <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: "30px" }}>
                <div className="search-box" style={{ width: "300px", display: "flex" }}>
                    <span className="input-group-text" style={{ width: "15%", fontSize: "20px", borderRadius: "5px 0px 0px 5px", backgroundColor:'rgb(249,180,181)' }}>
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder="Search by name or email"
                        className="form-control"
                        style={{ borderRadius: "0px 5px 5px 0px" }}
                    />
                </div>
                <button
                    onClick={() => setShowModal({ add: true })}
                    className="btn btn-primary" style={{ display: "flex", fontWeight: 'bold', backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", cursor: "pointer" }}><FaPlus style={{ marginTop: '3px' }} /> &nbsp; Register</button>
            </div>
            {
                filteredItems.length>0 ? <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Sr No.</th>
                        <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Name</th>
                        <th scope="col" style={{ textAlign: "center", backgroundColor: "rgb(249,180,181)" }}>Email</th>
                        <th scope="col" style={{ textAlign: "center", width: '15%', backgroundColor: "rgb(249,180,181)" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: "center", width: "10%",fontWeight:"500" }}>{(currentPage - 1) * 8+index + 1}</td>
                            <td style={{ textAlign: "center",fontWeight:"500" }}>{item.name}</td>
                            <td style={{ textAlign: "center",fontWeight:"500" }}>{item.email}</td>
                            <td style={{ display: "flex", columnGap: '10px', }}>
                                <button className="btn btn-primary" style={{ fontWeight: '500',margin: "auto" }} onClick={() => handleEditClick(item)}>Edit</button>
                                <button className="btn btn-danger" style={{ fontWeight: '500',margin: "auto" }} onClick={() => handleDelete(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>: <p>No Sub-Admin found...  </p>
            }

            {/* : <p>No active user</p>} */}


            {
                filteredItems.length>0 ? <div className="pagination-container" style={{ display: 'flex', }}>
                <button
                    className="pagination-arrow"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    style={{ backgroundColor: "rgb(199,205,215)", height: "38px", borderRadius: "4px", width: "35px", margin: "0px 20px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}
                >
                    &#8249;&#8249;
                </button>
                <ul className="pagination">
                    {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map(
                        (_, index) => (
                            <li
                                key={index}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        )
                    )}
                </ul>
                <button
                    style={{ backgroundColor: "rgb(199,205,215)", height: "38px", borderRadius: "4px", width: "35px", margin: "0px 20px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;" }}
                    className="pagination-arrow"
                    onClick={goToNextPage}
                    disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                >
                    &#8250;&#8250;
                </button>
            </div>: ""
            }
            {/* :""} */}


            <Modal show={modal.add} onHide={() => onToggle()} centered runTransition={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Sub-Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email" style={{ marginTop: "10px" }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="password" style={{ marginTop: "10px" }}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </Form.Group>
                        <Form.Group controlId="role" style={{ marginTop: "10px" }}>
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="subadmin">Sub-Admin</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="allowedPages" style={{ marginTop: "10px" }}>
                            <Form.Label>Allowed Pages</Form.Label>
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Dashboard"
                                        value="/dashboard"
                                        checked={allowedPages.includes('/dashboard')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Users"
                                        value="/users"
                                        checked={allowedPages.includes('/users')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Blocked Users"
                                        value="/blocked-users"
                                        checked={allowedPages.includes('/blocked-users')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Subscription-Plan"
                                        value="/subscription-plan"
                                        checked={allowedPages.includes('/subscription-plan')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Subscriptions"
                                        value="/subscriptions"
                                        checked={allowedPages.includes('/subscriptions')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Login Notification"
                                        value="/login-notification"
                                        checked={allowedPages.includes('/login-notification')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Subscription Notification"
                                        value="/subscription-notification"
                                        checked={allowedPages.includes('/subscription-notification')}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Payment Notification"
                                        value="/payment-notification"
                                        checked={allowedPages.includes('/payment-notification')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="FAQ"
                                        value="/faqs"
                                        checked={allowedPages.includes('/faqs')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Terms & Conditions"
                                        value="/terms-conditions"
                                        checked={allowedPages.includes('/terms-conditions')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Help"
                                        value="/help"
                                        checked={allowedPages.includes('/help')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Privacy Policy"
                                        value="/privacy-policy"
                                        checked={allowedPages.includes('/privacy-policy')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="About Us"
                                        value="/about-us"
                                        checked={allowedPages.includes('/about-us')}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ marginTop: '30px' }}>
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={modal.edit} onHide={() => onToggle()} centered runTransition={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Sub-Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email" style={{ marginTop: "10px" }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="password" style={{ marginTop: "10px" }}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </Form.Group>
                        <Form.Group controlId="role" style={{ marginTop: "10px" }}>
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="subadmin">Sub-Admin</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="allowedPages" style={{ marginTop: "10px" }}>
                            <Form.Label>Allowed Pages</Form.Label>
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Dashboard"
                                        value="/dashboard"
                                        checked={allowedPages.includes('/dashboard')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Users"
                                        value="/users"
                                        checked={allowedPages.includes('/users')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Blocked Users"
                                        value="/blocked-users"
                                        checked={allowedPages.includes('/blocked-users')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Subscription-Plan"
                                        value="/subscription-plan"
                                        checked={allowedPages.includes('/subscription-plan')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Subscriptions"
                                        value="/subscriptions"
                                        checked={allowedPages.includes('/subscriptions')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Login Notification"
                                        value="/login-notification"
                                        checked={allowedPages.includes('/login-notification')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Subscription Notification"
                                        value="/subscription-notification"
                                        checked={allowedPages.includes('/subscription-notification')}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Payment Notification"
                                        value="/payment-notification"
                                        checked={allowedPages.includes('/payment-notification')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="FAQ"
                                        value="/faqs"
                                        checked={allowedPages.includes('/faqs')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Terms & Conditions"
                                        value="/terms-conditions"
                                        checked={allowedPages.includes('/terms-conditions')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Help"
                                        value="/help"
                                        checked={allowedPages.includes('/help')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Privacy Policy"
                                        value="/privacy-policy"
                                        checked={allowedPages.includes('/privacy-policy')}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="About Us"
                                        value="/about-us"
                                        checked={allowedPages.includes('/about-us')}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ marginTop: '30px' }}>
                            Update
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SubAdmin

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import baseUrl from 'src/URL/baseUrl';
import { Modal, Button } from 'react-bootstrap';

const Cart = () => {
    const toast = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [userAddress, setUserAddress] = useState({});
    const completeAddress = userAddress?.addressLine1 + ", " + userAddress?.addressLine2 + ", " + userAddress?.city + ", " + userAddress?.state + ", " + userAddress?.country + "-" + userAddress?.zipcode

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddAddress = () => {
        if (address.trim() !== '') {
            setAddresses([...addresses, address]);
            setAddress('');
            handleCloseModal();
        }
    };

    const handleSelectAddress = (selectedAddr) => {
        setSelectedAddress(selectedAddr);
    };

    useEffect(() => {
        fetchCartItems();
        getAddressOfUser();
    }, []);

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    const token = localStorage.getItem('accessToken');

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${baseUrl}/v1/cart/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response?.status === 200) {
                const itemsWithQuantity = response.data.data.data.map(item => ({
                    ...item,
                    quantity: 1
                }));
                setCartItems(itemsWithQuantity);
                calculateTotalPrice(itemsWithQuantity);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    };

    const handleItemCheckboxChange = (item) => {
        const selectedIds = selectedItemIds ? [...selectedItemIds] : [];
        if (selectedIds.includes(item._id)) {
            selectedIds.splice(selectedIds.indexOf(item._id), 1);
        } else {
            selectedIds.push(item._id);
        }
        setSelectedItemIds(selectedIds);
        calculateTotalPrice(selectedIds);
    };

    const handleQuantityChange = (itemId, quantity) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item._id === itemId) {
                return { ...item, quantity };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        const previousContribution = cartItems.find(item => item._id === itemId).products.price * cartItems.find(item => item._id === itemId).quantity;
        setTotalPrice(prevTotalPrice => (prevTotalPrice - previousContribution + parseFloat(updatedCartItems.find(item => item._id === itemId).products.price) * quantity).toFixed(2));
    };

    const calculateTotalPrice = (selectedIds) => {
        let total = 0;
        cartItems.forEach(item => {
            if (selectedIds && selectedIds.includes(item._id)) {
                total += parseFloat(item.products.price) * item.quantity;
            }
        });
        setTotalPrice(total.toFixed(2));
    };

    const handleDeleteAndLoad = async (item) => {
        try {
            const response = await axios.delete(`${baseUrl}/v1/cart/delete/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                fetchCartItems();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    };

    const getAddressOfUser = async () => {
        try {
            let response = await axios.get(`${baseUrl}/v1/address/${user.address}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                setUserAddress(response.data.data.data)
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
        }
    }

    const handlePay = () => {
        console.log(totalPrice);
        console.log(selectedAddress)
        console.log(selectedItemIds)
    };

    return (
        <div>
            <div style={{ width: "100%", height: "70vh", display: 'flex', gap: "10px", }}>
                <div style={{ width: "70%", height: "95%", maxHeight: "70vh", overflow: "auto", marginLeft: "-50px" }}>
                    {
                        cartItems && cartItems.length > 0 ?
                            cartItems.map((item, i) => (
                                <div key={i} style={{
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    display: "flex",
                                    gap: "10px",
                                    marginLeft: "100px",
                                    backgroundColor: "white",
                                    borderRadius: "30px",
                                    width: "80%",
                                    height: "auto",
                                    marginTop: "12px",
                                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItemIds.includes(item._id)}
                                        onChange={() => handleItemCheckboxChange(item)}
                                        style={{ width: "20px", border: "1px solid red", marginLeft: "15px", cursor: 'pointer' }}
                                    />
                                    <div style={{ width: "30%", }}>
                                        <img src={item.products.productImage}
                                            style={{ marginLeft: "20px", borderRadius: "13px", marginTop: "8px", width: '180px', height: "180px" }} />
                                    </div>
                                    <div >
                                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>{item.products.name}</p>
                                        <p style={{ fontWeight: "100", fontSize: "13px", width: "380px" }}>{item.products.description}</p>
                                        <p style={{ fontWeight: "500" }}>Price: ₹{parseFloat(item.products.price).toFixed(2)}</p>
                                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    width: "100px",
                                                }}>
                                                <button
                                                    disabled={item.quantity === 1}
                                                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                    style={{
                                                        fontWeight: "bolder",
                                                        fontSize: "16px",
                                                        backgroundColor: 'rgb(199,205,215)',
                                                        border: 'none',
                                                        borderRadius: "5px",
                                                        width: "30px",
                                                        height: "30px",
                                                        boxShadow: "box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <div style={{ fontSize: '20px', fontWeight: "bold" }}>{item.quantity}</div>
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                    style={{
                                                        fontWeight: "bolder",
                                                        fontSize: "16px",
                                                        backgroundColor: 'rgb(199,205,215)',
                                                        border: 'none',
                                                        borderRadius: "5px",
                                                        width: "30px",
                                                        height: "30px",
                                                        boxShadow: "box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => handleDeleteAndLoad(item)}
                                                    style={{
                                                        border: "none",
                                                        backgroundColor: "white"
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.color = 'red';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.color = 'black';
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            : <h4>Your Cart is empty</h4>
                    }
                </div>
                <div style={{ width: "1px", height: "65vh", border: "1px solid gray" }}></div>
                <div style={{ width: "34%" }}>
                    <p>{selectedItemIds.length > 0 ? `${selectedItemIds.length} items selected` : "No items selected"}</p>
                    <p style={{ fontWeight: 'bolder', fontSize: "30px" }}>{selectedItemIds.length > 0 ? `Total Amount: ₹${totalPrice}` : ""}</p>
                    <h5 style={{ marginTop: '20px' }}> Select Shipping Address:</h5>
                    <input type="radio" name="address" value={completeAddress} checked={selectedAddress === completeAddress} onChange={() => handleSelectAddress(completeAddress)} />
                    <label style={{ marginLeft: "10px" }}>{completeAddress}</label>
                    {addresses.length > 0 && (
                        <div>
                            {addresses.map((addr, index) => (
                                <div key={index}>
                                    <input type="radio" name="address" value={addr} checked={selectedAddress === addr} onChange={() => handleSelectAddress(addr)} />
                                    <label style={{ marginLeft: "10px" }}>{addr}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    <Button className='d-flex mt-2' variant="primary" onClick={handleShowModal}><FaPlus style={{ marginTop: "5px" }} />&nbsp; Address</Button>

                    {selectedItemIds.length > 0 && selectedAddress && (
                        <div className='mt-5'>
                            <Button variant="success" onClick={handlePay}>{`Pay ${totalPrice}`}</Button>
                        </div>
                    )}
                </div>
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Address input fields */}
                        {/* Implement form inputs to get address details */}
                        <input type="text" className='form-control' value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={handleAddAddress}>Save Address</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Cart;

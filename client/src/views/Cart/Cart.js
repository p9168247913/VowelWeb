import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { Button, Modal, Form, Card, FormControl } from 'react-bootstrap';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import baseUrl from 'src/URL/baseUrl';

const Cart = () => {
    const toast = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchCartItems();
        console.log("cart", cartItems)
    }, []);

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ""
    const token = localStorage.getItem('accessToken')

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${baseUrl}/v1/cart/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            if (response.status === 200) {
                setCartItems(response.data.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const handleCheckboxChange = (itemId) => {
        const updatedSelectedItems = [...selectedItems];
        const index = updatedSelectedItems.indexOf(itemId);
        if (index !== -1) {
            updatedSelectedItems.splice(index, 1);
        } else {
            updatedSelectedItems.push(itemId);
        }
        setSelectedItems(updatedSelectedItems);
    };

    const handleQuantityChange = (itemId, quantity) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantity };
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    const handleBuyClick = () => {
        const totalPrice = selectedItems.reduce((total, itemId) => {
            const selectedItem = cartItems.find((item) => item.id === itemId);
            return total + (parseFloat(selectedItem.price) * selectedItem.quantity);
        }, 0);
        setTotalPrice(totalPrice);

    };

    return (
        <div>
            {/* Display total purchase amount */}
            <div>Total Price: ${totalPrice.toFixed(2)}</div>

            {/* Display cart items */}
            {cartItems.map((item) => (
                <Card key={item._id}>
                    <Card.Body>
                        <Card.Title>{item?.name}</Card.Title>
                        <Card.Img variant="top" src={item?.productImage} />
                        <Card.Text>Price: ${parseFloat(item?.price).toFixed(2)}</Card.Text>
                        <Card.Text>Description: {item?.description}</Card.Text>
                        <Form.Group controlId={`quantity_${item?.id}`}>
                            <Form.Label>Quantity</Form.Label>
                            <FormControl
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                            />
                        </Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Select for purchase"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                    </Card.Body>
                </Card>
            ))}

            {/* Buy button */}
            <Button variant="primary" onClick={handleBuyClick}>
                Buy
            </Button>
        </div>
    );
};

export default Cart;

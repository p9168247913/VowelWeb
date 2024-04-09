import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';

const EditProductModal = ({ isOpen, onClose, product, onEdit }) => {
    const [editedProduct, setEditedProduct] = useState({
        name: product ? product.name : '',
        image: product ? product.productImage : '',
        price: product ? product.price : '',
        description: product ? product.description : '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({ ...editedProduct, [name]: value });
    };

    const handleSubmit = () => {
        // Perform any validation here if needed
        // Call the onEdit function with the updated product
        onEdit(editedProduct);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Name</FormLabel>
                        <Input type="text" name="name" value={editedProduct.name} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Image URL</FormLabel>
                        <Input type="text" name="image" value={editedProduct.image} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Price</FormLabel>
                        <Input type="text" name="price" value={editedProduct.price} onChange={handleInputChange} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Description</FormLabel>
                        <Textarea name="description" value={editedProduct.description} onChange={handleInputChange} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProductModal;

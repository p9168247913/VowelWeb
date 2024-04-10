import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {
    FaSearch, FaEdit, FaPlus,
    FaTrash,
    FaCartPlus
} from "react-icons/fa";
import baseUrl from 'src/URL/baseUrl';
import { ModalFooter, FormControl, FormLabel, Textarea, Grid, GridItem, Box, Image, Text, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Input } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Swal from 'sweetalert2';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalData, setTotalData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        productImage: ''
    });
    const [addProduct, setAddProduct] = useState({
        name: '',
        price: '',
        description: '',
        productImage: ''
    });

    const [showModal, setShowModal] = useState({
        add: false
    });

    const toast = useToast()

    let token = localStorage.getItem('accessToken');
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

    const handleEditClick = (product) => {
        setEditedProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            productImage: product.productImage
        })

        setIsEditModalOpen(true);
    };

    const handleEditProduct = async () => {
        let editData = {
            name: editedProduct.name,
            price: editedProduct.price,
            description: editedProduct.description,
            productImage: editedProduct.image
        }
        try {
            let response = await axios.put(`${baseUrl}/v1/product/update/${editedProduct.id}`, editData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                toast({
                    title: 'Product Updated',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                getProducts();
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
        setIsEditModalOpen(false);
    };

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

    useEffect(() => {
        getProducts();
    }, [searchName, currentPage]);

    const getProducts = async () => {
        try {

            let queryParams = {
                page_no: currentPage ? currentPage : 1,
            };
            let filterData = {};

            if (searchName !== "") {
                filterData = { ...filterData, name: searchName };
            }

            const response = await axios.get(`${baseUrl}/v1/product/`, {
                params: {
                    page: queryParams.page_no,
                    filter: JSON.stringify(filterData)
                },
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (response.data.data.code === 200) {
                setProducts(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
                setTotalData(response.data.data.totalResults);
            }
        } catch (error) {
            toast({
                title: 'Error',
                statu: 'error',
                description: error.response.data.message,
                duration: 4000,
                isClosable: true,
            })
        }
    }

    const nextPage = () => {
        if (currentPage < totalPages) {
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

    const handleAddProduct = async () => {
        try {
            const response = await axios.post(`${baseUrl}/v1/product/add`, addProduct, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                toast({
                    title: 'Product Updated',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                getProducts();
                setShowModal({ ...showModal, add: false })
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

    const handleDeleteProduct = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`${baseUrl}/v1/product/delete/${productId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    toast({
                        title: 'Product Deleted',
                        status: 'success',
                        duration: 4000,
                        isClosable: true,
                    });
                    getProducts();
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            }
        }
    };

    const handleAddToCart = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Add this product to cart',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, add it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(`${baseUrl}/v1/cart/add`, { productId, userId: user.id }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                if (response.status === 200) {
                    toast({
                        title: 'Product Added to Cart',
                        status: 'success',
                        duration: 4000,
                        isClosable: true,
                    });
                    getProducts();
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response.data.data,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            }
        }
    }

    return (
        <>
            <div className="table-responsive p-3">
                <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: "30px" }}>
                    <div className="search-box" style={{ width: "350px", display: "flex", marginBottom: "30px" }}>
                        <span className="input-group-text" style={{ width: "15%", fontSize: "20px", borderRadius: "5px 0px 0px 5px", backgroundColor: 'rgb(249,180,181)' }}>
                            <FaSearch />
                        </span>
                        <input
                            value={searchName}
                            onChange={handleSearchTextChange}
                            type="text"
                            placeholder="Search products by name"
                            className="form-control"
                            style={{ borderRadius: "0px 5px 5px 0px" }}
                        />
                    </div>
                    {
                        user.role === "admin" && <div style={{ display: "flex", columnGap: "20px" }}>
                            <button onClick={() => setShowModal({ ...showModal, add: true })} className="btn btn-primary" style={{ display: "flex", fontWeight: 'bold', backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", border: "none", cursor: "pointer", height: "40px" }}><FaPlus style={{ marginTop: '3px' }} /> &nbsp; Add</button>
                        </div>
                    }
                </div>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} style={{ height: "70vh", overflow: 'auto' }}>
                    {products.map((product, index) => (
                        <GridItem key={index}>
                            <Box style={{ height: "340px", padding: "5px", width: "280px" }} borderWidth="1px" borderRadius="lg" overflow="hidden">
                                <Image style={{ height: "150px", margin: 'auto' }} src={product.productImage} alt={product.name} />
                                <Box p="2">
                                    <Box d="flex" alignItems="baseline">
                                        <Text fontSize="xl" fontWeight="semibold">
                                            {product.name}
                                        </Text>
                                        <Text style={{ marginTop: "-15px" }} ml="1" color="gray.500">
                                            {product.price}
                                        </Text>
                                    </Box>
                                    <Box mt="1">
                                        <Text style={{ fontSize: "12px", marginTop: "-15px" }} lineHeight="tight">{product.description}</Text>
                                    </Box>
                                    <Flex>
                                        {user.role === 'admin' && (
                                            <>
                                                <IconButton icon={<FaEdit />} onClick={() => handleEditClick(product)} aria-label="Edit" mr={2} />
                                                <IconButton icon={<FaTrash />} onClick={() => handleDeleteProduct(product.id)} aria-label="Delete" mr={2} />
                                            </>
                                        )}
                                        <IconButton onClick={() => handleAddToCart(product.id)} icon={<FaCartPlus />} aria-label="Add to Cart" />
                                    </Flex>
                                </Box>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
                {totalPages > 1 ? (
                    <div className="pagination-container mt-2" style={{ display: 'flex' }}>
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

                <Modal isOpen={showModal.add} onClose={() => setShowModal({ add: false })}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Product</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl mb={4}>
                                <FormLabel>Name</FormLabel>
                                <Input type="text" name="name" value={addProduct.name} onChange={(e) => setAddProduct({ ...addProduct, name: e.target.value })} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Image URL</FormLabel>
                                <Input type="text" name="image" value={addProduct.productImage} onChange={(e) => setAddProduct({ ...addProduct, productImage: e.target.value })} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Price</FormLabel>
                                <Input type="text" name="price" value={addProduct.price} onChange={(e) => setAddProduct({ ...addProduct, price: e.target.value })} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea name="description" value={addProduct.description} onChange={(e) => setAddProduct({ ...addProduct, description: e.target.value })} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
                                Save Changes
                            </Button>
                            <Button onClick={() => setShowModal({ add: false })}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Edit Product</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl mb={4}>
                                <FormLabel>Name</FormLabel>
                                <Input type="text" name="name" value={editedProduct.name} onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Image URL</FormLabel>
                                <Input type="text" name="image" value={editedProduct.productImage} onChange={(e) => setEditedProduct({ ...editedProduct, productImage: e.target.value })} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Price</FormLabel>
                                <Input type="text" name="price" value={editedProduct.price} onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea name="description" value={editedProduct.description} onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleEditProduct}>
                                Save Changes
                            </Button>
                            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}

export default Products

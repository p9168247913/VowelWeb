import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import baseUrl from 'src/URL/baseUrl';
import { Grid, GridItem, Box, Image, Text } from '@chakra-ui/react';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts()
    }, []);

    let token = localStorage.getItem('accessToken');
    const getProducts = async () => {
        try {
            const response = await axios.get(`${baseUrl}/v1/product/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response);

            if (response.data.data.code === 200) {
                setProducts(response.data.data.data);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="table-responsive p-3">
                <div className="search-box" style={{ width: "330px", display: "flex", marginBottom: "30px" }}>
                    <span className="input-group-text" style={{ width: "15%", fontSize: "20px", borderRadius: "5px 0px 0px 5px", backgroundColor: 'rgb(249,180,181)' }}>
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search products by name"
                        className="form-control"
                        style={{ borderRadius: "0px 5px 5px 0px" }}
                    />
                </div>
                <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} style={{ height:"70vh", overflow:'auto' }}>
                    {products.map((product, index) => (
                        <GridItem key={index}>
                            <Box style={{ height:"330px", padding:"5px"}} borderWidth="1px" borderRadius="lg" overflow="hidden">
                                <Image style={{ height:"150px", margin:'auto'}} src={product.productImage} alt={product.name} />
                                <Box p="6">
                                    <Box d="flex" alignItems="baseline">
                                        <Text fontSize="xl" fontWeight="semibold">
                                            {product.name}
                                        </Text>
                                        <Text ml="1" color="gray.500">
                                            {product.price}
                                        </Text>
                                    </Box>
                                    <Box mt="1">
                                        <Text style={{fontSize:"12px"}} lineHeight="tight">{product.description}</Text>
                                    </Box>
                                </Box>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </div>
        </>
    )
}

export default Products

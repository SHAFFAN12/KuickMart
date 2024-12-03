import React from 'react'
import '../index.css'
import img1 from '../assets/slider-1.png';
// import { Button, Rating } from "@mui/material";
import { SlSizeFullscreen } from "react-icons/sl";
import { IoIosHeartEmpty } from "react-icons/io";
// import { useContext } from 'react';
// import {MyContext} from "../../App";
const Card = () => {
    // const [isOpenProductModal, setIsOpenProductModal] = useState(false);

    // const viewProductDetails = (id) => {
    //     setIsOpenProductModal(true);
    // }
  return (
    <div className={`productItem`}>
            <div className="imgWrapper">
                <img src={img1} className="w-100" alt="Product" />
                <span className='badge badge-primary'>28%</span>
                <div className='actions'>
                    <button 
                    // onClick={() => viewProductDetails(1)}
                        ><SlSizeFullscreen /></button>
                    <button><IoIosHeartEmpty style={{ fontSize: '20px' }} /></button>
                </div>
            </div>
            <div className="info">
                <h4>Werther's Original Caramel Hard Candies</h4>
                <span className="text-green-200 block">In Stock</span>
                {/* <Rating className="mt-2 mb-2" name="read-only" value={5} readOnly size="small" precision={0.5} /> */}
                <div className="flex">
                    <span className="oldPrice">Rs 20.00</span>
                    <span className="netPrice text-red-200 ml-2">Rs 14.00</span>
                </div>
            </div>
        </div>
  )
}

export default Card

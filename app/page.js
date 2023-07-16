"use client"

import React,{useState,useEffect} from 'react'
import { collection, addDoc, getDoc, querySnapshot, query , onSnapshot } from 'firebase/firestore'
import {db} from './firebase'
import { doc, deleteDoc } from "firebase/firestore";

import Image from 'next/image'

export default function Home() {
  const  [items,setItems] = useState([
    
  ])
  const [newItem , setNewItem] = useState({name:'',price:''})
  const [total,setTotal] = useState(0)
  //add item
  const addItem = async (e) =>{
    e.preventDefault()
    if(newItem.name !== '' && newItem.price !== ''){
     // setItems([...items,newItem]);
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({name:'',price:''});


    }
  }



  //read item
useEffect(() => {
const q = query(collection(db, "items"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  let itemsArray = [];

  querySnapshot.forEach((doc) => {
    itemsArray.push({id:doc.id,...doc.data()});

  });

  setItems(itemsArray);
  //Read Total
  const calculateTotal = () =>{
    const total = itemsArray.reduce((total,item)=>(total += parseInt(item.price)),0);
    setTotal(total);
  }

calculateTotal();
return () => unsubscribe();

});
},[])


  //delete item
  const deleteItem = async (id) =>{
    await deleteDoc(doc(db, "items", id));

  }










  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className='text-4xl p-4 text-center font-sans font-family:Oswald'>EXPENSE TRACKER</h1>
        <div className='bg-slate-600 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input onChange={(e) =>setNewItem({...newItem,name:e.target.value})} value={newItem.name} type='text'className='col-span-3 mx-1 p-1' placeholder='Enter Item'></input>
            <input onChange={(e) =>setNewItem({...newItem,price:e.target.value})} value={newItem.price} type='number'className='col-span-2 mx-1 p-1' placeholder='Enter Price'></input>
            <button onClick={addItem} type='submit' className='bg-gray-400 p-1 hover:bg-gray-200 rounded-sm '>Submit</button>
          </form>

          <ul>
            {items.map((item,index)=>(
              <li key={index} className='my-4 w-full flex justify-between bg-slate-500 rounded-md'>
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize text-white'>{item.name}</span>
                  <span className='text-white'>$ {item.price}</span>
                </div>
                <button onClick={()=> deleteItem(item.id)} className='ml-8 rounded-md p-4 border-l-2 border-slate-500 hover:bg-slate-400 w-16'>X</button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? ('') : (
            <div className='flex justify-between p-3 text-white'>
              <span>Total</span>
              <span >${total}</span>  
              </div>      
            )}
        </div>
      </div>
    </main>
  )
}

import React, { StrictMode } from "react";
import Image from 'next/image'
import { Inter } from 'next/font/google'
import RootLayout from '../app/layout'
import ToDo from '../app/todo'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
      <ToDo></ToDo>
  )
}

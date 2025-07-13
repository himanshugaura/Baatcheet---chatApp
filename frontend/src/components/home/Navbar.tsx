'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User } from 'lucide-react';
import Image from 'next/image';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function Navbar() { 
    const isLoggedIn = useSelector((state: RootState) => state?.auth.user);
    
  return (
    <header className=" w-full bg-transparent text-white z-40">
      <nav className="flex items-center justify-between p-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ 
              scale: 1.05,
              transition: { type: 'spring', stiffness: 400 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className='flex gap-3'>
              <Image
                src="/images/logo.png" 
                alt="logo" 
                width={30} 
                height={30} 
              />
              <h1 className='font-bold text-2xl'>Baat-Cheet</h1>
            </div>
          </motion.div>
        </Link>

        {/* Right side icons */} 
        <div className="flex items-center gap-4">

          {/* Profile Avatar */}

          <Link href={isLoggedIn ? "/dashboard" : "/auth/login"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full cursor-pointer"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </motion.button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
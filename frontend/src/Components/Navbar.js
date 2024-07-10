import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faVectorSquare } from '@fortawesome/free-solid-svg-icons'


export default function NavBar() {
  return (
    <nav className='flex justify-between m-4'>
        <div>
                <FontAwesomeIcon icon={faVectorSquare} className='h-8 w-8'/>
        </div>
        <div className='flex justify-normal gap-4'>
            <p className='text-lg'>About</p>
            <a href='https://github.com' target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faGithub} className='h-6 w-6'/>
            </a>
        </div>
    </nav>
  )
}

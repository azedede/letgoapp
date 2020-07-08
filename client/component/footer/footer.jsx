import React from 'react'

const footer = () => {
    return (
        <div
        className='select-none px-6 bg-gray-900 sm:pb-20 text-center object-cover bg-fixed  '
        style={{ backgroundImage: "url(../../shop.jpg)" }}
      >
        <div className='sm:pt-6'>
          <div className=' grid-4'>
            <div className='text-gray-400 flex-col flex justify-center items-center px-8'>
              <img
                src='./logo.png'
                className=' w-16  rounded-full'
                alt='local market'
              />
              <p className='text-xs pt-2  text-white '>
                let help you get your desire product
                <br /> & and prevent been frauded
              </p>
            </div>
            <div className='text-gray-400'>
              <p className='capitalize font-bold text-xl'>address</p>
              <p className='text-xs pt-6 text-lg'>km 10 blessed avenue</p>
            </div>
            <div className='text-gray-400'>
              <p className='capitalize font-bold text-lg text-xl'>location</p>
              <p className='text-xs pt-6 text-lg'>Lagos Nigeria</p>
            </div>
            <div className='text-gray-400'>
              <p className='capitalize font-bold text-lg text-xl'>contact</p>
              <p className='text-xs pt-2 text-lg'>tohshine@ gmail.com</p>
              <p className='text-xs pt-2 text-lg'>+2348138385529</p>
            </div>
          </div>
          <div className='text-gray-400 text-center pt-4 font-bold'>
            &copy; 9jsLetgo 2020
          </div>
        </div>
      </div>
    )
}

export default footer

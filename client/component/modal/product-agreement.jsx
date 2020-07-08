import React from "react";

export const AgreementModal = ({modalAction}) => {
  return (
    <div className=' top-auto left-auto max-w-4xl w-full z-10 absolute p-2'>
      <div className=' bg-gray-100 rounded-lg text-center leading-5 shadow-xl px-2  sm:py-32'>
        <h1 className='text-xl font-bold text-gray-900'>Terms & Conditions</h1>
        <p className='sm:px-32 leading-10  '>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
          similique voluptatibus eius, tempore molestiae dolore repellat dicta
          fugit modi sapiente cum possimus sint nam. Rerum error praesentium
          eius quasi exercitationem!
        </p>

        <button className='bg-blue-500 rounded text-white p m mr-2' onClick={()=>modalAction(false)}>
          accept
        </button>
        <a href="/profile" className='bg-red-500 rounded text-white p m'>decline</a>
      </div>
    </div>
  );
};

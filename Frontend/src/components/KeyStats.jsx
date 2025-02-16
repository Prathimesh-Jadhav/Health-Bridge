import React from 'react'
import submission from '../assets/submission.jpg'

const KeyStats = ({title, value, icon,id}) => {
  return (
    <div className='rounded-lg border-[1px] border-gray-200 bg-white min-w-[250px] p-4 flex flex-col gap-4 max-w-[250px] max-h-[150px]' key={id}>
        <div className='text-gray-400'>{title}</div>
        <div className='flex justify-between relative'>
            <div className={`text-3xl font-semibold self-end pb-2 ${title === 'LastSubmit' && 'text-xl'}`}>{value}</div>
            <div className='min-w-[40px] min-h-[40px] rounded-full bg-gray-200 absolute  -right-2 bottom-0 flex justify-center items-center overflow-hidden p-2'><img src={icon} alt="" width={45} className='object-contain'/></div>
        </div>
    </div>
  )
}

export default KeyStats

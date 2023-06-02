import React from 'react';

interface buttonProp {
  onClick?: () => void;
  type?: String;
  buttonText: string;
  className?: string; 
}
interface navProp {
  className?: string;  
}

interface modalAlert{
    text?:String;
    onClick?: () => void;
    header?:String; 
    onCancel?: () => void;

}

interface navAbsenProp{
  names: String[];
  clock: String;
}

interface tableProp{
  data: any;
}

interface absenBtnProp{
  text:String;
  onClick: (data?:any) => void;
  btnW: String;
}

interface AttendaceProp{
  onClick: () => void;
  onCancel: ()=> void;
  onInput: any;
  value: string;
}

const Button: React.FC<buttonProp> = ({ type, onClick, buttonText, className }) => {
  const buttonClassName = `bg-sky-500 h-10 w-20 m-4 py-2 text-white font-medium hover:bg-sky-600 rounded-xl shadow-sm ${className}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      {buttonText}
    </button>
  );
};

const Navbar: React.FC<navProp> = ({ className }) => {
  const navbarClassName = `${className}`;

  return (
    <nav className={navbarClassName}>

    </nav>
  );
};

const Alert: React.FC<modalAlert> = ({text, onClick, header, onCancel})=>{
    return(
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white w-80 h-48 rounded-lg overflow-hidden flex flex-col justify-center items-center">
          <div className="py-2">
            <h3 className="text-black text-center font-bold text-2xl">{header}</h3>
          </div>
          <p className="text-center text-black py-2">{text}</p>
          <div className="flex gap-3">
          <button className="bg-sky-600 text-white  font-bold text-lg w-28 h-8 rounded-xl mt-5" onClick={onClick}>
            OK
          </button>
          {onCancel && (
            <button className="bg-amber-400 text-white font-bold text-lg w-28 h-8 rounded-xl mt-5" onClick={onCancel}>
              Cancel
            </button>
          )}

          </div>
        </div>
      </div>
    );
};



const Overlay: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col items-center text-white">
        <svg className="animate-spin h-16 w-16 text-white mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{text}</span>
      </div>
    </div>
  );
};



const NavbarAbsen: React.FC<navAbsenProp> = ({names, clock})=>{
  return(
    <nav>
      <div className="flex justify-between bg-primary min-w-full lg:px-8 px-4 h-16 font-Poppins items-center">
        <div className="font-bold text-base lg:text-lg w-1/2 break-words ">{names}</div>
        <div className="font-thin">{clock}</div>

      </div>
    </nav>
  );
};

const Table: React.FC<tableProp> = ({data})=>{
  return(
    <div className="overflow-x-auto">
    <table className="table-fixed border-b border-black mx-auto">
      <thead>
        <tr>
          <th className="w-1/3 px-4 py-2 text-lg text-gray-800">Tanggal</th>
          <th className="w-1/3 px-4 py-2 text-lg text-gray-800">Time In</th>
          <th className="w-1/3 px-4 py-2 text-lg text-gray-800">Time Out</th>
        </tr>
      </thead>
      <tbody>
      {data && data.absen.map((item: any, index: number) => (
        <tr key={index} className="border-b text-sm border-gray-200 hover:bg-gray-100">
          <td className="px-4 py-2 text-center text-gray-600">{item.date}</td>
          <td className="px-4 py-2 text-center text-gray-600">{item.timeIn}</td>
          <td className="px-4 py-2 text-center text-gray-600">{item.timeOut}</td>
        </tr>
      ))}

      </tbody>
    </table>
  </div>
  );
};

const AbsenBtn: React.FC<absenBtnProp> = ({text, onClick, btnW})=>{
  const className = `bg-white w-${btnW} h-10 rounded-full border-2 border-black px-4 py-2`
  return(
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

const ModalAttendance: React.FC<AttendaceProp> = ({onClick, onCancel, onInput, value}) =>{
  return(
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white rounded-lg w-80 h-48 overflow-hidden flex flex-col justify-center items-center">
        <span className="font-bold text-2xl text-center text-dark">Kenapa?</span>

        <label htmlFor="reason" className='block mb-2 font-medium text-gray-700 '></label>
        <select  value={value} onInput={onInput} name="reason" id="reason" className='w-18 px-4 py-2 border border-gray-300 rounded-md foucs:outline-none focus:bordedr-indigo-500'>
          <option value="">Pilih Alasan</option>
          <option value="sakit">Sakit</option>
          <option value="izin">Izin</option>
          <option value="libur">Libur</option>
          <option value="cuti bersama">Cuti Bersama</option>

        </select>
        <div className='flex gap-4'>
          <button className="font-bold text-white h-8 w-28 mt-5 rounded-full bg-sky-500" onClick={onClick}>Ok</button> 
          <button className="font-bold text-white h-8 w-28 mt-5 rounded-full bg-yellow-500" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export { Button, Navbar, Alert, Overlay, NavbarAbsen, Table, AbsenBtn, ModalAttendance };

import React, { useEffect, useState } from 'react';
import { AbsenBtn, Alert, NavbarAbsen, Table, ModalAttendance } from '../component/ui';
import * as XLSX from "xlsx";
import saveAs from "file-saver";

interface AbsenProps {
  names: string[];
  username: String;
}

const Absen: React.FC<AbsenProps> = ({ names, username }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<any>(null);
  const [alert, setAlert] = useState<String>("");
  const [alertHeader, setAlertHeader] = useState<String>("");
  const [resetPop, setResetPop] = useState<string>("")
  const [modal, setModal] = useState<Boolean>(false);
  const [reason,setReason] = useState<string>('')

  const options = {
    hour12: false, // Setel ke false untuk format 24 jam
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };  
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  const getAbsen = async () => {
    try {
      const response = await fetch(`https://server-production-9d59.up.railway.app/${username}`, {
        method: 'POST'
      });
      const data = await response.json();
      setData(data.absenData);
    } catch (e) {
      console.error(`Terjadi kesalahan saat mengambil data absen dari ${names}` + e);
    }
  };
  useEffect(() => {
    getAbsen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeIn = async () => {
    try {
      const date = new Date().toISOString().split('T')[0]; // Mendapatkan tanggal hari ini
      const timeIn = new Date().toLocaleTimeString(undefined, options); // Mendapatkan waktu saat fungsi dijalankan
      const timeOut = ''; // Waktu keluar kosong, sesuaikan jika ada nilai waktu keluar
  
      const body = {
        date,
        timeIn,
        timeOut
      };
  
      const response = await fetch(`https://server-production-9d59.up.railway.app/timein/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      if (response.status === 200) {
        setAlertHeader(`Good 👍`)
        setAlert(`Absen:
          date: ${date}
          time: ${timeIn}`);
        // Tampilkan pesan OK jika status respons adalah 200
        await getAbsen()
      } else {
        const errorText = await response.text();
        setAlertHeader('☹')
        setAlert(`Error: ${errorText}`); // Tampilkan pesan error jika status respons bukan 200
      }
  
    } catch (e) {
      console.error(`Gagal melakukan timeIn ${names}`, e);
    }
  };

  const timeOut = async () => {
    try {
      const timeOut = new Date().toLocaleTimeString(undefined, options); // Mendapatkan waktu saat fungsi dijalankan
      const body = {timeOut};
      const response = await fetch(`https://server-production-9d59.up.railway.app/timeout/${username}`,{
        method: 'PUT', 
        headers:{
          "Content-Type":"application/json" 
        },
        body:JSON.stringify(body)
      })
      if(response.status ===200){
        setAlertHeader('Pulang 🏃‍♂️🏃‍♀️🏃‍♂️🏃‍♀️')
        setAlert("Dah sana pulang");
        await getAbsen();
      }else{
        const errorText = await response.text();
        setAlertHeader('☹')
        setAlert(`Error: ${errorText}`); // Tampilkan pesan error jika status respons bukan 200
      }

    }catch(e){
      console.error(`Gagal melakukan timeOut ${names}`)
    }
  }

  const reset = async ()=>{
    try{
      const response = await fetch(`https://server-production-9d59.up.railway.app/reset/${username}`,{
        method:"DELETE"
      })
      if(response.status ===200){
        setAlertHeader("Happy Weekend")
        setAlert("Sudah Reset");
        await getAbsen();
        setResetPop("");
      }else{
        const errorText = await response.text();
        setAlert(`Error: ${errorText}`); // Tampilkan pesan error jika status respons bukan 200
      }


    }catch(e){
      console.error(`Gagal Reset ${names}`)
    }
  }
  
  // const resetConfirmation = async () =>{
  //   setResetPop("Yakin Reset?")
  // }
  
  const pilihan = async () =>{
    setModal(true);
  }

  const handelModalAttendance = async () =>{
    console.log(`ini dari klik, nilai reason adalah ${reason}`)
    const date = new Date().toISOString().split('T')[0];
    try{
      const timeIn = reason;
    const timeOut = reason;
    const body ={
      date,
      timeIn,
      timeOut
    }
    const response = await fetch(`https://server-production-9d59.up.railway.app/timein/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      if (reason === 'sakit') {
        setAlertHeader("😟");
        setAlert("Get well soon");
      } else if (reason === 'izin') {
        setAlertHeader("👍");
        setAlert("OK");
      } else if (reason === 'cuti bersama' || reason === 'libur') {
        setAlertHeader("OK");
        setAlert("Happy weekend");
      }
      // Tampilkan pesan OK jika status respons adalah 200
      await getAbsen()
    } else {
      const errorText = await response.text();
      setAlertHeader('☹')
      setAlert(`Error: ${errorText}`); // Tampilkan pesan error jika status respons bukan 200
    }

    console.log(JSON.stringify(body, null, 2));
    setModal(false);
   
    }catch(e){
      console.error(e)
    }
  }

  const onInput = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReason(event.target.value);
    console.log(reason)
  };
    
 
  


    const generateExcelFile = async () => {
    const template = `${process.env.PUBLIC_URL}/template.xlsx`;
    try {
      const response = await fetch(template);
      const templateData = await response.arrayBuffer();
      const templateWorkbook = XLSX.read(templateData, { type: 'array' });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, templateWorkbook.Sheets[templateWorkbook.SheetNames[0]], 'Sheet1');
  
      const worksheet = workbook.Sheets['Sheet1'];
  
      // Mengisi data ID dan Nama pada kolom B8 dan C8
      worksheet['B8'] = { t: 's', v: data.nama };
      worksheet['C8'] = { t: 's', v: data.ID.toString() };
  
      // Mengisi periode pada sel B3
      const minDate = new Date(data.absen[0].date);
      const maxDate = new Date(data.absen[data.absen.length - 1].date);
  
      const minDateFormat = minDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const maxDateFormat = maxDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
      worksheet['B3'] = { t: 's', v: `Periode: ${minDateFormat} - ${maxDateFormat}` };
  
      // Mengisi data absen pada kolom B, C, D, E, F dimulai dari baris 8
      let rowIndex = 8;
      data.absen.forEach((item: { date: string; timeIn: string; timeOut: string; }) => {
        worksheet[`C${rowIndex}`] = { t: 's', v: data.nama };
        worksheet[`B${rowIndex}`] = { t: 's', v: data.ID.toString() };
        worksheet[`D${rowIndex}`] = { t: 's', v: item.date };
        worksheet[`E${rowIndex}`] = { t: 's', v: item.timeIn };
        worksheet[`F${rowIndex}`] = { t: 's', v: item.timeOut };
        worksheet[`G${rowIndex}`] = { t: 's', v: "+07:00" };
  
        rowIndex++;
      });
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `absen ${data.nama} ${data.ID}.xlsx`;
      saveAs(excelFile, fileName);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };
  
  
  

  // const handleButtonClick = () => {
  // };

  return (
    <div>
      <NavbarAbsen
      names={names}
      clock={formattedTime}
      />
      
      <Table data={data}/>

      <div className="flex justify-center p-4 mt-4 gap-5 lg:gap-72">
        <AbsenBtn
          text="Time In"
          onClick={timeIn} 
          btnW='29'/>
        <AbsenBtn
          text="Time Out"
          onClick={timeOut} 
          btnW='29'/>
      </div>

      <div className="flex justify-center gap-4 mt-4 flex-col items-center">
      <AbsenBtn
          text="Download"
          onClick={generateExcelFile} 
          btnW='200'/>
      {/* <AbsenBtn
          text="Reset Attendance"
          onClick={resetConfirmation} 
          btnW='200'/> */}
      <AbsenBtn
          text="Absent"
          onClick={pilihan} 
          btnW='200'/>
      </div>

      {resetPop && <Alert text={resetPop} header="Konfirmasi" onClick={reset} onCancel={()=>setResetPop("")}/>}
          {alert && <Alert text={alert} header={alertHeader} onClick={()=>{
            setAlert('')
            setAlertHeader('')
          }}/>}

      {modal && <ModalAttendance
      onClick={handelModalAttendance}
      onInput={onInput}
      value={reason}
      onCancel={()=>setModal(false)}
      />}
    </div>
  );
};

export default Absen;

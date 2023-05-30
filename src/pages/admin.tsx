import React, { useEffect, useState } from 'react';
import { Alert, NavbarAbsen, Overlay } from '../component/ui';
import saveAs from 'file-saver';
import { format, parse } from 'date-fns';
import ExcelJS from 'exceljs';

const Admin: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alert, setAlert] = useState<string>('');
  const [alertHeader, setAlertHeader] = useState<string>('');
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  const resetAll = async () => {
    try {
      const res = await fetch('https://server-production-9d59.up.railway.app/resetAll', {
        method: 'DELETE',
      });
      if (res.status === 200) {
        setAlertHeader('OK');
        setAlert('Sudah Reset');
      }
    } catch (e) {
      console.error(`Gagal Reset ${e}`);
    }
  };

  const fetchAbsen = async () => {
    try {
      const res = await fetch('https://server-production-9d59.up.railway.app/absen', {
        method: 'POST',
      });
      const data = await res.json();
      setData(data);
      console.log(JSON.stringify(data, null, 2));

    } catch (e) {
      console.error(`Error: ${e}`);
    }
  };

  useEffect(() => {
  if (Object.keys(data).length > 0) {
    generateExcelFile();
  }
}, [data]);


  const generateExcelFile = async () => {
    const template = `${process.env.PUBLIC_URL}/template.xlsx`;
  
    try {
      const response = await fetch(template);
      const templateData = await response.arrayBuffer();
      const templateWorkbook = new ExcelJS.Workbook();
      await templateWorkbook.xlsx.load(templateData);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
      const startingRow = 8; // Baris awal untuk menulis data
      let rowIndex = startingRow;
  
       
  
      const absenTanggal = data[4].absen; // Mengambil data absen dari "22-101942"
      const dates = absenTanggal.map((absen: { date: string | number | Date; }) => new Date(absen.date)); // Mengubah string tanggal menjadi objek Date
      const minDate = new Date(Math.min(...dates)); // Mengambil nilai tanggal terkecil
      const maxDate = new Date(Math.max(...dates)); // Mengambil nilai tanggal terbesar
      const minDateFormat = format(minDate, 'dd MMMM yyyy');
      const maxDateFormat = format(maxDate, 'dd MMMM yyyy');
  
      worksheet.getColumn('B').width = 15.71;
      worksheet.getColumn('C').width = 36;
      worksheet.getColumn('D').width = 15;
      worksheet.getColumn('E').width = 15;
      worksheet.getColumn('F').width = 15;
      worksheet.getColumn('G').width = 15;
  
      const title = worksheet.getCell('B1');
      title.value = "PT Asuransi Umum BCA";
      title.font = { name: 'Calibri', size: 11, bold: true };
  
      const subtitle = worksheet.getCell('B2');
      subtitle.value = "Format Absen Manual";
      subtitle.font = { name: 'Calibri', size: 11, bold: true };
  
      const period = worksheet.getCell('B3');
      period.value = `Period: ${minDateFormat} - ${maxDateFormat}`;
      period.font = { name: 'Calibri', size: 11, bold: true };
  
      const timezone = worksheet.getCell('B4');
      timezone.value = "Time zone format: +hh:mm or -hh:mm";
      timezone.font = { name: 'Calibri', size: 11, bold: true };
  
  
      // header
      const fontHeader={name:'Arial', size:10, bold:true}
      worksheet.getCell(`B7`).value = "Employee ID";
      worksheet.getCell(`C7`).value = "Employee Name";
      worksheet.getCell(`D7`).value = "Date";
      worksheet.getCell(`E7`).value = "Time In";
      worksheet.getCell(`F7`).value = "Time Out";
      worksheet.getCell(`G7`).value = "Time Zone";
      
      worksheet.getCell(`B7`).font = fontHeader;
      worksheet.getCell(`C7`).font = fontHeader;
      worksheet.getCell(`D7`).font = fontHeader;
      worksheet.getCell(`E7`).font = fontHeader;
      worksheet.getCell(`F7`).font = fontHeader;
      worksheet.getCell(`G7`).font = fontHeader;
      
      worksheet.getCell(`B7`).alignment = { vertical: 'bottom', horizontal: 'center' };
      worksheet.getCell(`C7`).alignment = { vertical: 'bottom', horizontal: 'center' };
      worksheet.getCell(`D7`).alignment = { vertical: 'bottom', horizontal: 'center' };
      worksheet.getCell(`E7`).alignment = { vertical: 'bottom', horizontal: 'center' };
      worksheet.getCell(`F7`).alignment = { vertical: 'bottom', horizontal: 'center' };
      worksheet.getCell(`G7`).alignment = { vertical: 'bottom', horizontal: 'center' };
  
  
      if (data && typeof data === 'object') {
        Object.keys(data).forEach((key) => {
          const dataAbsen = data[key];
          const name = dataAbsen.nama;
          const id = dataAbsen.ID;
          const absenData = dataAbsen.absen;
          const font = {name:'Calibri', size:10.5,};
  
          absenData.forEach((absen: { date: string; timeIn: string | number | boolean | Date | ExcelJS.CellErrorValue | ExcelJS.CellRichTextValue | ExcelJS.CellHyperlinkValue | ExcelJS.CellFormulaValue | ExcelJS.CellSharedFormulaValue | null | undefined; timeOut: string | number | boolean | Date | ExcelJS.CellErrorValue | ExcelJS.CellRichTextValue | ExcelJS.CellHyperlinkValue | ExcelJS.CellFormulaValue | ExcelJS.CellSharedFormulaValue | null | undefined; }, index: number) => {
            const row = rowIndex + index;
            const parsedDate = parse(absen.date, 'yyyy-MM-dd', new Date());
            const formattedDate = format(parsedDate, 'dd-MM-yyyy');
  
            worksheet.getCell(`B${row}`).value = id;
            worksheet.getCell(`B${row}`).font = font;
            worksheet.getCell(`C${row}`).value = name;
            worksheet.getCell(`C${row}`).font = font;
            worksheet.getCell(`D${row}`).value = formattedDate;
            worksheet.getCell(`D${row}`).font = font;
            worksheet.getCell(`E${row}`).value = absen.timeIn;
            worksheet.getCell(`E${row}`).font = font;
            worksheet.getCell(`F${row}`).value = absen.timeOut;
            worksheet.getCell(`F${row}`).font = font;
            worksheet.getCell(`G${row}`).value = "+07:00";
            worksheet.getCell(`G${row}`).font = font;
          });
          
  
          rowIndex += absenData.length;
          console.log(`ini panjang absenData : ${absenData.length}`);
        });
      } else {
        console.error('Data is undefined or null');
      }
  
      const excelBuffer = await workbook.xlsx.writeBuffer();
      const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `Absen BDP12 ${minDateFormat} - ${maxDateFormat}.xlsx`;
      saveAs(excelFile, fileName);
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  const ambil = async () =>{
    setIsLoading(true);
    await fetchAbsen();
    setIsLoading(false);
  }

  return (
    <div>
      <NavbarAbsen names={["Admin"]} clock={formattedTime} />
      <div className="flex flex-col font-Poopins text-lg font-semibold items-center justify-center h-screen md:flex-row">
        <button
          className="w-200 h-24 rounded-full bg-emerald-500 border-2 border-black text-white mx-auto mb-3 md:mb-0"
          onClick={ambil}
        >
          Ambil Semua Data
        </button>
        <button
          className="w-200 h-24 rounded-full bg-red-500 border-2 border-black text-white mx-auto"
          onClick={resetAll}
        >
          Reset Semua Absen
        </button>
      </div>
      {alert && <Alert header={alertHeader} text={alert} onClick={() => setAlert('')} />}
      {isLoading && <Overlay text="Loading..."/>}
    </div>
  );
};

export default Admin;

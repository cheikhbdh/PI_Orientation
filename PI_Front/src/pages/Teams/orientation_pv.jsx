import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './OrientationPV.css';
import * as XLSX from 'xlsx';
import XLSXStyle from 'xlsx-style-correct';
import { saveAs } from 'file-saver';

const OrientationPV = () => {
  const { id } = useParams();
  const history = useHistory();
  const [pvData, setPvData] = useState([]);

  useEffect(() => {
    fetchPVData();
  }, []);

  const fetchPVData = () => {
    axios
      .get(`http://127.0.0.1:8000/get-pv/${id}/`)
      .then((response) => {
        setPvData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PV data:', error);
      });
  };

  const handleDownloadExcel = () => {
    // Reformater les données pour l'exportation Excel
    const formattedData = pvData.map(item => ({
      Matricule: item.matricule,
      Crédits: item.stats['Crédits'],
      MOYENNE_SYR: item.stats['MOYENNE_SYR'],
      Moyenne_semestre: item.stats['Moyenne_semestre'],
      MOYENNE_PST: item.stats['MOYENNE_PST'],
      PSP: item.stats['PSP'],
      MOYENNE_HE: item.stats['MOYENNE_HE'],
      MOYENNE_DEV: item.stats['MOYENNE_DEV'],
      'Choix 1': item.choix1,
      'Choix 2': item.choix2,
      'Choix 3': item.choix3,
      Filière: item.orientation,
      RESTE_DSI: item.capacite_restante.DSI,
      RESTE_CNM: item.capacite_restante.CNM,
      RESTE_RSS: item.capacite_restante.RSS,
      classement: item.classement
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Appliquer les styles
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        }
      };
    }

    for (let R = 1; R <= range.e.r; ++R) {
      const isAlternateRow = R % 2 === 0;
      const fillColor = isAlternateRow ? { rgb: "CCE5FF" } : { rgb: "82B1ff" };

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[address]) continue;

        const cell = ws[address];
        cell.s = {
          fill: { fgColor: fillColor },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          }
        };

        if (cell.v === 30) {
          cell.s = { ...cell.s, fill: { fgColor: { rgb: "66CC00" } } };
        }

        if (ws[XLSX.utils.encode_cell({ c: range.e.c - 1, r: R })]?.v === "CNM") {
          for (let i = range.s.c; i <= range.e.c; ++i) {
            const rowAddress = XLSX.utils.encode_cell({ c: i, r: R });
            if (!ws[rowAddress]) continue;
            ws[rowAddress].s = {
              fill: { fgColor: { rgb: "FFFF00" } },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              }
            };
          }
        }
      }
    }

    // Ajuster la largeur des colonnes
    const colWidths = formattedData.reduce((acc, row) => {
      Object.keys(row).forEach((key, idx) => {
        const value = row[key] ? row[key].toString() : "";
        acc[idx] = Math.max(acc[idx] || 10, value.length + 2);
      });
      return acc;
    }, []);

    ws['!cols'] = colWidths.map(w => ({ wch: w }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Appliquer les styles avec XLSXStyle
    const wbout = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'PV_d_Orientation.xlsx');
  };

  return (
    <div className="full-page">
      <IconButton variant="outlined" color="primary" onClick={() => history.goBack()} className="back-button">
        <ArrowBackIcon />
      </IconButton>
      {pvData.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Crédits</th>
                <th>MOYENNE SYR</th>
                <th>Moyenne semestre</th>
                <th>MOYENNE PST</th>
                <th>PSP</th>
                <th>MOYENNE HE</th>
                <th>MOYENNE DEV</th>
                <th>Choix 1</th>
                <th>Choix 2</th>
                <th>Choix 3</th>
                <th>orientation</th>
              </tr>
            </thead>
            <tbody>
              {pvData.map((item, index) => (
                <tr key={index}>
                  <td>{item.matricule}</td>
                  <td>{item.stats['Crédits']}</td>
                  <td>{item.stats['MOYENNE_SYR']}</td>
                  <td>{item.stats['Moyenne_semestre']}</td>
                  <td>{item.stats['MOYENNE_PST']}</td>
                  <td>{item.stats['PSP']}</td>
                  <td>{item.stats['MOYENNE_HE']}</td>
                  <td>{item.stats['MOYENNE_DEV']}</td>
                  <td>{item.choix1}</td>
                  <td>{item.choix2}</td>
                  <td>{item.choix3}</td>
                  <td>{item.orientation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="contained" color="secondary" onClick={handleDownloadExcel}>
            Télécharger en tant qu'Excel
          </Button>
        </div>
      ) : (
        <p>Chargement du PV...</p>
      )}
    </div>
  );
};

export default OrientationPV;

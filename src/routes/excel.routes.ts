import { Router } from 'express';
import Product from '../models/Product.js';
import DeletedLog from '../models/DeletedLog.js';
import ExcelJS from 'exceljs';
import dayjs from 'dayjs';

type Query = {
  deletedLog?: string;
  createdLog?: string;
};

const router = Router();

router.get('/', async (req, res) => {
  const { deletedLog, createdLog } = req.query;
  const query: Query = {};
  if (deletedLog && typeof deletedLog === 'string') query.deletedLog = deletedLog;
  if (createdLog && typeof createdLog === 'string') query.createdLog = createdLog;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Logs');

  try {
    if (query.createdLog) {
      const logs = await Product.find().select('-__v').sort({ createdAt: -1 });
      if (!logs || logs.length === 0) {
        res.status(400).json({ message: 'Товар(ы) отсутствуют в базе' });
      } else {
        sheet.columns = [
          { header: 'Brand', key: 'brand', width: 15 },
          { header: 'Model', key: 'model', width: 15 },
          { header: 'Device type', key: 'deviceType', width: 20 },
          { header: 'Serial number', key: 'serialNumber', width: 25 },
          { header: 'Country of origin', key: 'manufactureCountry', width: 25 },
          { header: 'Date to store', key: 'createdAt', width: 20 }
        ];

        logs.forEach((log) => {
          const formatted = {
            ...log.toObject(),
            createdAt: dayjs(log.createdAt).format('DD.MM.YYYY HH:mm')
          };
          sheet.addRow(formatted);
        });

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=created-logs.xlsx');
        await workbook.xlsx.write(res);
        res.end();
      }
    } else if (query.deletedLog) {
      const logs = await DeletedLog.find().select('-__v').sort({ deletedAt: -1 });
      if (!logs || logs.length === 0) {
        res.status(400).json({ message: 'Записи об удалении отсутствуют в базе' });
      } else {
        sheet.columns = [
          { header: 'Model', key: 'model', width: 15 },
          { header: 'Serial number', key: 'serialNumber', width: 25 },
          { header: 'Date to store', key: 'deletedAt', width: 20 }
        ];

        logs.forEach((log) => {
          const formatted = {
            ...log.toObject(),
            deletedAt: dayjs(log.deletedAt).format('DD.MM.YYYY HH:mm')
          };
          sheet.addRow(formatted);
        });

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=deleted-logs.xlsx');
        await workbook.xlsx.write(res);
        res.end();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Ошибка при получении данных' });
  }
});

export default router;

import { Router } from 'express';
import WorkDay from '../models/WorkDay.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const days = await WorkDay.find().select('-__v -createdAt -updatedAt');
    res.json(days);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при поиске данных' });
  }
});

router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const day = await WorkDay.findOne({ date }).select('-__v -createdAt -updatedAt');
    if (!day) {
      res.status(404).json({ message: 'День не найден' });
    } else {
      res.json(day);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при поиске данных' });
  }
});

router.post('/', async (req, res) => {
  try {
    const workDay = await WorkDay.create(req.body);
    await workDay.save();
    res.status(201).json({ message: 'Данные успешно сохранены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при сохранении данных' });
  }
});

router.patch('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const updateWorkDay = await WorkDay.findOneAndUpdate({ date }, req.body, {
      new: true
    });
    if (updateWorkDay) {
      res.status(200).send(updateWorkDay);
    } else {
      res.status(401).json({ message: 'День отсутствует в базе данных' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже!'
    });
  }
});
export default router;

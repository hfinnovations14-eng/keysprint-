import { Router } from 'express';
import {
  getTournaments,
  getTournamentDetails,
  registerTournament,
  submitTournamentRace,
  getTournamentStandings
} from '../controllers/tournamentController.js';
import { authenticateToken, authenticateOptionalToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticateOptionalToken, getTournaments);
router.get('/:id', authenticateOptionalToken, getTournamentDetails);
router.post('/:id/register', authenticateToken, registerTournament);
router.post('/:id/race', authenticateToken, submitTournamentRace);
router.get('/:id/standings', authenticateOptionalToken, getTournamentStandings);

export default router;


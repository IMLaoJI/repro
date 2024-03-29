import { Team } from '@repro/domain'
import { FutureInstance } from 'fluture'
import { DataLoader } from './common'

export function createTeamApi(dataLoader: DataLoader) {
  function getMyTeam(): FutureInstance<Error, Team> {
    return dataLoader('/teams/mine')
  }

  return {
    getMyTeam,
  }
}

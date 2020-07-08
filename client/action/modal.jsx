import {AGREEMENT} from './Types'
export const modalAction = (agreement)=>{
  return {
      type: AGREEMENT,
      payload: agreement
  }
}
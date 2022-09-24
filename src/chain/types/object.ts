import { IImage } from "./image"

export interface IObject {
  type: string
  content?: string
  id?: string
  name?: string
  image?: IImage[]
  inreplyto?: {
    trxid: string
  }
}

export interface IObject {
  type: 'Note'
  content: string
  id?: string
  name?: string
  image?: IImage[]
  inreplyto?: {
    trxid: string
  }
}

export interface IImage {
  mediaType: string
  name: string
  content: string
}
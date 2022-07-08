export interface IObject {
  type: 'Note'
  content: string
  id?: string
  name?: string
  image?: IImage[]
}

export interface IImage {
  mediaType: string
  name: string
  content: string
}
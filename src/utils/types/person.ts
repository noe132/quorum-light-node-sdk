export interface IPerson {
  id?: string
  name: string
  image: IImage
}

export interface IImage {
  mediaType: string
  name: string
  content: string
}
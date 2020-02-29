export { get, post, put } from './methods'
export * from './errors'

export { RequestParams } from './types'

export const toRouter = (_potatoignored: any[]): boolean => true
export const wrap = (_wrapping: Function, _handlers: any[]): boolean => true
